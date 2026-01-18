import validator from 'validator'
import { z } from 'zod'

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  details: Record<string, any>
}

// Zod schemas for validation
const addressSchema = z.string()
  .min(47, 'Address too short (expected 47-48 chars)')
  .max(48, 'Address too long (expected 47-48 chars)')
  .regex(/^[1-9A-HJ-NP-Za-km-z]{47,48}$/, 'Invalid SS58 address format')

const amountSchema = z.union([
  z.number().positive('Amount must be positive'),
  z.bigint().positive('Amount must be positive'),
  z.string().refine(val => {
    try {
      const num = BigInt(val)
      return num > 0n
    } catch {
      return false
    }
  }, 'Invalid amount format')
])

const transactionSchema = z.object({
  method: z.string().min(1, 'Method name is required'),
  params: z.record(z.any()).optional(),
}).passthrough()

// Mock PAPI validation functions
export const validateTransaction = async (
  input: string,
  inputType: 'json' | 'hex' | 'raw'
): Promise<ValidationResult> => {
  console.log(`🔍 Validating ${inputType} input...`)
  
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    details: {}
  }

  try {
    let parsedData: any
    
    // Parse based on input type
    switch (inputType) {
      case 'json':
        try {
          parsedData = JSON.parse(input)
          result.details.parsedJson = parsedData
        } catch (error) {
          result.isValid = false
          result.errors.push('Invalid JSON format')
          result.errors.push(`JSON error: ${(error as Error).message}`)
          return result
        }
        break
        
      case 'hex':
        if (!input.startsWith('0x')) {
          result.isValid = false
          result.errors.push('Hex data must start with 0x')
        }
        
        if (input.length < 10) {
          result.isValid = false
          result.errors.push('Hex data too short (minimum 10 characters)')
        }
        
        if (!validator.isHexadecimal(input.slice(2))) {
          result.isValid = false
          result.errors.push('Invalid hex characters')
        }
        
        parsedData = { method: 'unknown', rawHex: input }
        result.details.hexLength = input.length - 2 // Exclude 0x
        break
        
      case 'raw':
        // Simple raw text parsing
        parsedData = parseRawInput(input)
        result.details.parsedRaw = parsedData
        break
        
      default:
        result.isValid = false
        result.errors.push(`Unknown input type: ${inputType}`)
        return result
    }
    
    // Validate transaction structure
    if (inputType === 'json' || inputType === 'raw') {
      try {
        transactionSchema.parse(parsedData)
      } catch (error) {
        if (error instanceof z.ZodError) {
          result.isValid = false
          error.errors.forEach(err => {
            result.errors.push(`Validation error: ${err.message} at ${err.path.join('.')}`)
          })
        }
      }
    }
    
    // Check for common errors
    checkCommonErrors(parsedData, result)
    
    // Check for warnings
    checkWarnings(parsedData, result)
    
    // Add validation metadata
    result.details.validationTimestamp = new Date().toISOString()
    result.details.inputType = inputType
    result.details.inputLength = input.length
    
  } catch (error) {
    console.error('Validation error:', error)
    result.isValid = false
    result.errors.push(`Validation engine error: ${(error as Error).message}`)
  }
  
  // Log result
  if (result.isValid) {
    console.log('✅ Validation passed with', result.warnings.length, 'warning(s)')
  } else {
    console.log('❌ Validation failed with', result.errors.length, 'error(s)')
  }
  
  return result
}

const parseRawInput = (input: string): any => {
  const lines = input.split('\n')
  const result: any = { params: {} }
  
  lines.forEach(line => {
    line = line.trim()
    if (!line || line.startsWith('//')) return
    
    const match = line.match(/^(\w+):\s*(.+)$/)
    if (match) {
      const [_, key, value] = match
      
      if (key === 'method') {
        result.method = value.trim()
      } else {
        // Try to parse value
        let parsedValue = value.trim()
        
        // Remove trailing comments
        parsedValue = parsedValue.split('//')[0].trim()
        
        // Try to parse as number
        if (/^\d+n$/.test(parsedValue)) {
          result.params[key] = BigInt(parsedValue.slice(0, -1))
        } else if (/^\d+$/.test(parsedValue)) {
          result.params[key] = BigInt(parsedValue)
        } else if (parsedValue.startsWith('"') && parsedValue.endsWith('"')) {
          result.params[key] = parsedValue.slice(1, -1)
        } else {
          result.params[key] = parsedValue
        }
      }
    }
  })
  
  return result
}

const checkCommonErrors = (data: any, result: ValidationResult) => {
  // Check method name
  if (data.method) {
    const validMethods = [
      'balances.transfer_keep_alive',
      'balances.transfer',
      'balances.transfer_all',
      'staking.bond',
      'staking.unbond',
      'staking.nominate',
      'utility.batch',
      'utility.batch_all',
    ]
    
    if (!validMethods.includes(data.method)) {
      result.warnings.push(`Method "${data.method}" may not exist. Valid methods: ${validMethods.join(', ')}`)
    }
  }
  
  // Check parameters
  if (data.params) {
    // Check amount
    if (data.params.value !== undefined) {
      try {
        amountSchema.parse(data.params.value)
      } catch (error) {
        if (error instanceof z.ZodError) {
          result.errors.push(`Amount error: ${error.errors[0].message}`)
          result.isValid = false
        }
      }
    }
    
    // Check address
    if (data.params.dest !== undefined) {
      try {
        addressSchema.parse(data.params.dest)
      } catch (error) {
        if (error instanceof z.ZodError) {
          result.errors.push(`Address error: ${error.errors[0].message}`)
          result.isValid = false
        }
      }
    }
    
    // Check for missing required params
    if (data.method === 'balances.transfer_keep_alive') {
      if (!data.params.dest) {
        result.errors.push('Missing required parameter: dest')
        result.isValid = false
      }
      if (!data.params.value) {
        result.errors.push('Missing required parameter: value')
        result.isValid = false
      }
    }
  }
}

const checkWarnings = (data: any, result: ValidationResult) => {
  // Check for suspiciously large amounts
  if (data.params?.value) {
    let amount: bigint
    try {
      amount = BigInt(data.params.value)
      if (amount > 1000000000000000n) { // 100,000 DOT
        result.warnings.push('Amount is very large. Double-check the value.')
      }
    } catch {
      // Already caught by amount validation
    }
  }
  
  // Check for common test addresses
  if (data.params?.dest) {
    const testAddresses = [
      '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY', // Alice
      '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty', // Bob
    ]
    
    if (testAddresses.includes(data.params.dest)) {
      result.warnings.push('Using well-known test address. Is this intentional?')
    }
  }
  
  // Check for duplicate parameters
  if (data.params && Object.keys(data.params).length > 5) {
    result.warnings.push('Many parameters specified. Ensure all are required.')
  }
}

// Simulate PAPI's txFromCallData validation
export const simulateTxFromCallData = (callData: string): ValidationResult => {
  console.log(`🧪 Simulating txFromCallData with: ${callData.substring(0, 30)}...`)
  
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    details: {}
  }
  
  // Common invalid patterns
  const invalidPatterns = [
    {
      pattern: /^0x[0-9a-f]{0,15}$/i, // Too short
      error: 'Call data too short. Expected at least 32 bytes, got {length} bytes.',
      fix: 'Ensure call data includes method and all parameters.'
    },
    {
      pattern: /^0x[0-9a-f]{129,}$/i, // Too long
      error: 'Call data too long. Expected maximum 64 bytes, got {length} bytes.',
      fix: 'Check for duplicate or extra data in call data.'
    },
    {
      pattern: /^[^0x]/i, // Doesn't start with 0x
      error: 'Call data must start with 0x.',
      fix: 'Add 0x prefix to call data.'
    },
    {
      pattern: /[^0-9a-f]/i, // Invalid characters
      error: 'Invalid characters in hex data. Only 0-9, a-f, A-F allowed.',
      fix: 'Remove non-hex characters from call data.'
    }
  ]
  
  // Check patterns
  for (const pattern of invalidPatterns) {
    if (pattern.pattern.test(callData)) {
      result.isValid = false
      const length = Math.floor((callData.length - 2) / 2) // Bytes
      result.errors.push(
        pattern.error.replace('{length}', length.toString())
      )
      result.warnings.push(`💡 Fix: ${pattern.fix}`)
    }
  }
  
  // If no pattern matched but still might be invalid
  if (result.isValid && callData.length % 2 !== 0) {
    result.isValid = false
    result.errors.push('Hex data has odd length. Hex data must have even number of characters (excluding 0x).')
    result.warnings.push('💡 Fix: Add a leading zero if necessary (e.g., 0x0123 instead of 0x123).')
  }
  
  result.details.callDataLength = callData.length
  result.details.byteLength = Math.floor((callData.length - 2) / 2)
  result.details.validatedAt = new Date().toISOString()
  
  return result
}