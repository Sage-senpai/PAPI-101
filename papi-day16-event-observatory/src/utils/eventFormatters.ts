// src/utils/eventFormatter.ts
import Decimal from 'decimal.js'

export interface EventData {
  id: string
  blockNumber: number
  eventType: string
  from: string
  to: string
  amount: string
  timestamp: Date
  rawData: any
}

/**
 * Format a raw event from PAPI into a structured EventData object
 */
export const formatEvent = (rawEvent: any): EventData => {
  const eventType = getEventType(rawEvent)
  const blockNumber = rawEvent.blockNumber || 0
  
  // Extract data based on event type
  let from = 'System'
  let to = 'System'
  let amount = '0'
  
  const eventData = rawEvent.event?.value || rawEvent.event?.data || {}
  
  switch (eventType) {
    case 'Balances.Transfer':
      from = formatAddress(eventData.from)
      to = formatAddress(eventData.to)
      amount = formatAmount(eventData.amount)
      break
      
    case 'Balances.Deposit':
      to = formatAddress(eventData.who)
      amount = formatAmount(eventData.amount)
      from = 'Network'
      break
      
    case 'Balances.Withdraw':
      from = formatAddress(eventData.who)
      amount = formatAmount(eventData.amount)
      to = 'Network'
      break
      
    case 'Staking.Rewarded':
      to = formatAddress(eventData.stash)
      amount = formatAmount(eventData.amount)
      from = 'Validator Pool'
      break
      
    case 'Staking.Slashed':
      from = formatAddress(eventData.validator || eventData.stash)
      amount = formatAmount(eventData.amount)
      to = 'Treasury'
      break
      
    case 'Treasury.Awarded':
      to = eventData.account ? formatAddress(eventData.account) : `Proposal #${eventData.proposalIndex || 'N/A'}`
      amount = formatAmount(eventData.award || eventData.amount)
      from = 'Treasury'
      break
      
    default:
      from = 'Unknown'
      to = 'Unknown'
      amount = '0'
  }
  
  return {
    id: `${blockNumber}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    blockNumber,
    eventType,
    from,
    to,
    amount,
    timestamp: new Date(),
    rawData: rawEvent,
  }
}

/**
 * Extract event type from PAPI event structure
 */
const getEventType = (rawEvent: any): string => {
  if (rawEvent.event?.type) return rawEvent.event.type
  if (rawEvent.type) return rawEvent.type
  
  // Handle PAPI event structure: { pallet: "Balances", name: "Transfer" }
  const pallet = rawEvent.event?.pallet || rawEvent.pallet
  const name = rawEvent.event?.name || rawEvent.name
  
  if (pallet && name) return `${pallet}.${name}`
  
  return 'Unknown.Event'
}

/**
 * Format a Polkadot address to a shortened version
 */
export const formatAddress = (address: string | any): string => {
  if (!address) return 'Unknown'
  
  // Handle different address formats from PAPI
  const addr = typeof address === 'string' ? address : address.toString?.() || String(address)
  
  if (addr.length <= 12) return addr
  return `${addr.substring(0, 6)}...${addr.substring(addr.length - 6)}`
}

/**
 * Format a raw amount (in Planck) to DOT with 4 decimal places
 */
export const formatAmount = (rawAmount: any): string => {
  try {
    if (!rawAmount) return '0.0000'
    
    // Handle BigInt, string, number
    const amountStr = typeof rawAmount === 'bigint' 
      ? rawAmount.toString() 
      : String(rawAmount)
    
    const amount = new Decimal(amountStr)
    const dotAmount = amount.div(10_000_000_000) // Convert Planck to DOT
    
    return dotAmount.toDecimalPlaces(4).toString()
  } catch (error) {
    console.error('Error formatting amount:', error, rawAmount)
    return '0.0000'
  }
}

/**
 * Get the color associated with an event type
 */
export const getEventColor = (eventType: string): string => {
  const colors: Record<string, string> = {
    'Balances.Transfer': '#00D68F',
    'Balances.Deposit': '#00B2FF',
    'Balances.Withdraw': '#FFAA00',
    'Staking.Rewarded': '#E6007A',
    'Staking.Slashed': '#FF3D71',
    'Treasury.Awarded': '#8A2BE2',
  }
  
  return colors[eventType] || '#666666'
}

/**
 * Get a friendly display name for an event type
 */
export const getEventDisplayName = (eventType: string): string => {
  return eventType.replace('.', ' • ')
}