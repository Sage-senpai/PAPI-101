import { useBalance } from '../hooks/useChainData';
import { formatBalance } from '../utils/validation';

interface BalanceDisplayProps {
  address: string;
}

export const BalanceDisplay: React.FC<BalanceDisplayProps> = ({ address }) => {
  const { data, isLoading, error } = useBalance(address);

  if (isLoading) {
    return <div>Loading balance...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (data === null) {
    return <div>No balance data</div>;
  }

  const formattedBalance = formatBalance(data, 8);

  return (
    <div className="balance-display">
      <span className="balance-amount">{formattedBalance}</span>
      <span className="balance-currency">DOT</span>
    </div>
  );
};