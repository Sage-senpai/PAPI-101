// src/components/ChainInfo.tsx
import { useState, useEffect } from 'react';
import { 
  Code, 
  Shield, 
  Database, 
  Cpu, 
  Hash,
  Box,
  Activity
} from 'lucide-react';

interface ChainInfoProps {
  api: any | null;
  chainInfo: {
    chainName: string;
    version: string;
    specVersion: number;
    existentialDeposit: bigint;
    currentBlock: number;
  } | null;
}

export const ChainInfo: React.FC<ChainInfoProps> = ({ api, chainInfo }) => {
  const [accountBalance, setAccountBalance] = useState<bigint | null>(null);
  const [blockHash, setBlockHash] = useState<string>('');
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  // Example account to query (Polkadot Treasury)
  const EXAMPLE_ACCOUNT = '13UVJyLnbVp9RBZYFwFGyDvVd1y27Tt8tkntv6Q7JVPhFsTB';

  useEffect(() => {
    const fetchAdditionalInfo = async () => {
      if (!api || !chainInfo) return;

      try {
        setIsLoadingBalance(true);
        
        // Fetch account balance
        const accountInfo = await api.query.System.Account.getValue(EXAMPLE_ACCOUNT);
        setAccountBalance(accountInfo.data.free);
        
        // Fetch latest block hash using finalized head
        const finalizedHash = await api.query.System.BlockHash.getValue(chainInfo.currentBlock);
        // Convert Binary to hex string
        setBlockHash(finalizedHash.asHex());
        
        console.log("📊 Additional chain info fetched:", {
          accountBalance: accountInfo.data.free.toString(),
          blockHash: finalizedHash.asHex()
        });
        
      } catch (error) {
        console.error("❌ Error fetching additional info:", error);
      } finally {
        setIsLoadingBalance(false);
      }
    };

    fetchAdditionalInfo();
    
    // Refresh every 12 seconds
    const interval = setInterval(fetchAdditionalInfo, 12000);
    return () => clearInterval(interval);
  }, [api, chainInfo]);

  if (!chainInfo) {
    return (
      <div className="p-8 glass-card">
        <p className="text-gray-500 text-center">Connect to see chain information</p>
      </div>
    );
  }

  const formatBalance = (balance: bigint | null): string => {
    if (balance === null) return 'Loading...';
    return (Number(balance) / 10**10).toFixed(4) + ' DOT';
  };

  const formatED = (ed: bigint): string => {
    return (Number(ed) / 10**10).toFixed(4) + ' DOT';
  };

  const infoCards = [
    {
      icon: <Code className="w-5 h-5" />,
      title: "Chain Name",
      value: chainInfo.chainName,
      color: "text-matrix-green"
    },
    {
      icon: <Cpu className="w-5 h-5" />,
      title: "Runtime Version",
      value: `v${chainInfo.version}`,
      color: "text-blue-400"
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Spec Version",
      value: `#${chainInfo.specVersion}`,
      color: "text-purple-400"
    },
    {
      icon: <Box className="w-5 h-5" />,
      title: "Existential Deposit",
      value: formatED(chainInfo.existentialDeposit),
      color: "text-yellow-400",
      tooltip: "Minimum balance to keep account alive"
    },
    {
      icon: <Activity className="w-5 h-5" />,
      title: "Current Block",
      value: `#${chainInfo.currentBlock.toLocaleString()}`,
      color: "text-green-400"
    },
    {
      icon: <Database className="w-5 h-5" />,
      title: "Example Balance",
      value: formatBalance(accountBalance),
      color: "text-polkadot-pink",
      tooltip: `Balance of ${EXAMPLE_ACCOUNT.slice(0, 8)}...`
    }
  ];

  return (
    <div className="p-6 glass-card polkadot-glow">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 matrix-text">PAPI Chain Dashboard</h2>
        <p className="text-gray-400">Live data from Polkadot via light-client</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {infoCards.map((card, index) => (
          <div 
            key={index} 
            className="p-4 bg-gray-900/50 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors"
            title={card.tooltip}
          >
            <div className="flex items-center space-x-3 mb-2">
              <div className={card.color}>
                {card.icon}
              </div>
              <span className="text-sm text-gray-400">{card.title}</span>
            </div>
            <p className={`text-lg font-mono font-bold ${card.color}`}>
              {isLoadingBalance && card.title === "Example Balance" ? (
                <span className="animate-pulse">Loading...</span>
              ) : (
                card.value
              )}
            </p>
          </div>
        ))}
      </div>
      
      {blockHash && (
        <div className="mt-6 pt-6 border-t border-gray-800">
          <div className="flex items-center space-x-2 mb-2">
            <Hash className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-400">Latest Block Hash</span>
          </div>
          <code className="text-xs bg-gray-900/50 p-3 rounded block overflow-x-auto font-mono text-gray-300">
            {blockHash}
          </code>
        </div>
      )}
      
      <div className="mt-6 pt-6 border-t border-gray-800">
        <p className="text-sm text-gray-500">
          <span className="text-matrix-green">🔵 Week 1 Recap:</span> This dashboard demonstrates constants, storage queries, 
          and real-time data fetching using PAPI's untyped API (no CLI needed!).
        </p>
      </div>
    </div>
  );
};