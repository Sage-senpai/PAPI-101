import React from 'react';
import { Twitter } from 'lucide-react';
import { TwitterShareButton } from 'react-share';
import { ProjectPlan } from '../types/plan.types';

interface ShareButtonProps {
  plan: ProjectPlan;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ plan }) => {
  const url = window.location.href;
  const title = `I just planned my next dApp "${plan.name}" with #PAPI30Days Capstone Planner! 🚀\n\nUsing ${plan.chains.map(c => c.name).join(' + ')} with ${plan.features.length} features.\n\nBuild your own plan →`;

  const handleClick = () => {
    console.log('🐦 Sharing your project plan on Twitter!');
    console.log('Plan:', plan.name);
    console.log('Chains:', plan.chains.map(c => c.name).join(', '));
    console.log('Features:', plan.features.length);
    console.log('Hashtag: #PAPI30Days #Polkadot');
  };

  return (
    <TwitterShareButton
      url={url}
      title={title}
      via="Polkadot"
      hashtags={['PAPI30Days', 'Polkadot', 'Web3']}
      className="p-3 rounded-lg bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/30 transition-colors"
      onClick={handleClick}
    >
      <Twitter size={20} className="text-[#1DA1F2]" />
    </TwitterShareButton>
  );
};