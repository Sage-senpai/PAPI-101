import React from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { PALLET_OPERATIONS } from '../data/palletOperations';
import { BatchTransaction } from '../types/batch.types';
import { GripVertical, X, Plus, Search } from 'lucide-react';

interface BatchBuilderProps {
  batch: BatchTransaction;
  setBatch: React.Dispatch<React.SetStateAction<BatchTransaction>>;
  addOperation: (opId: string) => void;
  removeOperation: (opId: string) => void;
}

const OperationCard: React.FC<{
  op: BatchTransaction['operations'][0];
  index: number;
  remove: () => void;
}> = ({ op, index, remove }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'OPERATION',
    item: { id: op.id, index },
    collect: monitor => ({ isDragging: monitor.isDragging() }),
  }));

  return (
    <div
      ref={drag}
      className={`p-4 rounded-xl border ${
        isDragging ? 'opacity-60 border-primary-500 shadow-2xl' : 'border-gray-700'
      } bg-gray-800/40 hover:bg-gray-800/60 transition-all`}
      style={{ borderLeft: `4px solid ${op.operation.color}` }}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-3">
          <GripVertical className="w-5 h-5 text-gray-500 cursor-move" />
          <div>
            <div className="font-medium">
              {op.operation.pallet}.{op.operation.method}
            </div>
            <div className="text-sm text-gray-400">{op.operation.description}</div>
          </div>
        </div>
        <button onClick={remove} className="text-gray-400 hover:text-red-400">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Parameter inputs would go here – simplified for brevity */}
      <div className="text-xs text-gray-500 mt-2">
        Estimated gas: {op.gasUsed.toLocaleString()}
      </div>
    </div>
  );
};

const BatchBuilder: React.FC<BatchBuilderProps> = ({
  batch,
  setBatch,
  addOperation,
  removeOperation,
}) => {
  const [, drop] = useDrop(() => ({
    accept: 'PALLET_OP',
    drop: (item: { id: string }) => addOperation(item.id),
  }));

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Build Your Batch</h2>
          <div className="text-sm text-gray-400">
            {batch.operations.length} operations • {batch.totalGas.toLocaleString()} gas
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Palette */}
          <div className="space-y-4">
            <h3 className="font-semibold">Operations Palette</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {PALLET_OPERATIONS.map(op => (
                <div
                  key={op.id}
                  className="p-4 rounded-xl bg-gray-900/50 border border-gray-700 hover:border-gray-600 cursor-grab"
                  onClick={() => addOperation(op.id)}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl" style={{ color: op.color }}>
                      {op.icon}
                    </span>
                    <div>
                      <div className="font-medium">{op.pallet}.{op.method}</div>
                      <div className="text-sm text-gray-400 truncate">{op.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Canvas */}
          <div ref={drop} className="md:col-span-2">
            <div className={`min-h-[400px] rounded-xl border-2 border-dashed p-6 transition-colors ${
              batch.operations.length === 0 ? 'border-gray-600 flex items-center justify-center' : 'border-gray-700'
            }`}>
              {batch.operations.length === 0 ? (
                <div className="text-center text-gray-400">
                  <Plus className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Drag operations here or click to add</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {batch.operations.map((op, i) => (
                    <OperationCard
                      key={op.id}
                      op={op}
                      index={i}
                      remove={() => removeOperation(op.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default BatchBuilder;