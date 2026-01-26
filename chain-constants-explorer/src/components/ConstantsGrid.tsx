import React from 'react';
import { motion } from 'framer-motion';
import { ConstantCard } from './ConstantsCard';
import { ChainConstant } from '../types/constants';
import { Layers, FilterX, AlertCircle } from 'lucide-react';
interface ConstantsGridProps {
  constants: ChainConstant[];
}
export const ConstantsGrid: React.FC<ConstantsGridProps> = ({ constants }) => {
  if (constants.length === 0) {
    return (
      <div className="bg-gray-800/30 rounded-2xl p-12 border border-gray-700 text-center">
        <FilterX className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-medium mb-2">No Constants Found</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Try adjusting your search or filters to find the chain constants you are looking for.
        </p>
      </div>
    );
  }
  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center space-x-2">
          <Layers className="w-5 h-5" />
          <span>Chain Constants</span>
        </h2>
        <div className="text-sm text-gray-500">
          Showing {constants.length} constant{constants.length !== 1 ? 's' : ''}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {constants.map((constant, index) => (
          <motion.div
            key={constant.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <ConstantCard constant={constant} />
          </motion.div>
        ))}
      </div>
      <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-400">Type Safety Active</h4>
            <p className="text-sm text-blue-300/80 mt-1">
              All constants are type-safe thanks to PAPI's auto-generated TypeScript interfaces.
              Hover over values to see their TypeScript types.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};