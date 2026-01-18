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

export const formatEvent = (rawEvent: any): EventData => {
  const eventType = rawEvent.event.type || 'Unknown.Event'
  const blockNumber = Math.floor(Math.random() * 10000) + 17850000 // Mock block number
  
  // Extract data based on event type
  let from = 'System'
  let to = 'System'
  let amount = '0'
  
  switch (eventType) {
    case 'Balances.Transfer':
      from = formatAddress(rawEvent.event.data?.from)
      to = formatAddress(rawEvent.event.data?.to)
      amount = formatAmount(rawEvent.event.data?.amount)
      break
      
    case 'Balances.Deposit':
      to = formatAddress(rawEvent.event.data?.who)
      amount = formatAmount(rawEvent.event.data?.amount)
      break
      
    case 'Balances.Withdraw':
      from = formatAddress(rawEvent.event.data?.who)
      amount = formatAmount(rawEvent.event.data?.amount)
      break
      
    case 'Staking.Rewarded':
      to = formatAddress(rawEvent.event.data?.stash)
      amount = formatAmount(rawEvent.event.data?.amount)
      break
      
    case 'Staking.Slashed':
      from = formatAddress(rawEvent.event.data?.stash)
      amount = formatAmount(rawEvent.event.data?.amount)
      break
      
    case 'Treasury.Awarded':
      to = `Proposal ${rawEvent.event.data?.proposalIndex || 'N/A'}`
      amount = formatAmount(rawEvent.event.data?.award)
      break
      
    default:
      from = 'Unknown'
      to = 'Unknown'
      amount = '0'
  }
  
  return {
    id: `${blockNumber}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    blockNumber,
    eventType,
    from,
    to,
    amount,
    timestamp: new Date(),
    rawData: rawEvent,
  }
}

export const formatAddress = (address: string): string => {
  if (!address) return 'Unknown'
  if (address.length <= 12) return address
  return `${address.substr(0, 6)}...${address.substr(-6)}`
}

export const formatAmount = (rawAmount: string | number | bigint): string => {
  try {
    if (!rawAmount) return '0.0000'
    
    const amount = new Decimal(rawAmount.toString())
    const dotAmount = amount.div(10_000_000_000) // Convert planck to DOT
    
    return dotAmount.toDecimalPlaces(4).toString()
  } catch (error) {
    console.error('Error formatting amount:', error)
    return '0.0000'
  }
}

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

export const getEventIcon = (eventType: string): string => {
  const icons: Record<string, string> = {
    'Balances.Transfer': 'swap_horiz',
    'Balances.Deposit': 'account_balance_wallet',
    'Balances.Withdraw': 'account_balance_wallet',
    'Staking.Rewarded': 'trending_up',
    'Staking.Slashed': 'warning',
    'Treasury.Awarded': 'account_balance',
  }
  
  return icons[eventType] || 'notifications'
}