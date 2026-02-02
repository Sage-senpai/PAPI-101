import React, { useState, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { PALLET_OPERATIONS } from '../data/palletOperations';
import { BatchTransaction, BatchOperation, TransactionOperation } from '../types/batch.types';
import { GripVertical, X, Plus, Search, Zap, Clock, Layers } from 'lucide-react';

// ─── Drag item types ──────────────────────────────────────────
const DND_TYPES = {
  PALETTE_ITEM: 'PALETTE_ITEM',
  CANVAS_ITEM: 'CANVAS_ITEM',
} as const;

interface PaletteDragItem {
  type: typeof DND_TYPES.PALETTE_ITEM;
  operationId: string;
}

interface CanvasDragItem {
  type: typeof DND_TYPES.CANVAS_ITEM;
  id: string;
  index: number;
}

// ─── Props ────────────────────────────────────────────────────
interface BatchBuilderProps {
  batch: BatchTransaction;
  setBatch: React.Dispatch<React.SetStateAction<BatchTransaction>>;
  addOperation: (opId: string) => void;
  removeOperation: (opId: string) => void;
}

// ─── Palette Item (draggable) ─────────────────────────────────
const PaletteItem: React.FC<{ operation: TransactionOperation }> = ({ operation }) => {
  const [{ isDragging }, drag] = useDrag<PaletteDragItem, void, { isDragging: boolean }>(() => ({
    type: DND_TYPES.PALETTE_ITEM,
    item: { type: DND_TYPES.PALETTE_ITEM, operationId: operation.id },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }));

  return (
    <div
      ref={drag}
      className={`palette-item p-3 rounded-xl border cursor-grab active:cursor-grabbing transition-all duration-200 ${
        isDragging
          ? 'opacity-40 scale-95 border-primary-500'
          : 'border-gray-700 hover:border-gray-500 bg-gray-800/40 hover:bg-gray-800/70'
      }`}
      style={{ borderLeft: `3px solid ${operation.color}` }}
    >
      <div className="flex items-center gap-3">
        <span className="text-lg">{operation.icon}</span>
        <div className="min-w-0">
          <div className="font-semibold text-sm text-gray-100">
            {operation.pallet}.<span className="text-gray-300">{operation.method}</span>
          </div>
          <div className="text-xs text-gray-500 truncate">{operation.description}</div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-700/50">
        <span className="text-xs text-gray-500 flex items-center gap-1">
          <Zap className="w-3 h-3 text-yellow-500" /> {operation.estimatedGas.toLocaleString()}
        </span>
        <span
          className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ background: `${operation.color}18`, color: operation.color }}
        >
          {operation.category}
        </span>
      </div>
    </div>
  );
};

// ─── Canvas Operation Card (draggable + droppable for reorder) ─
const CanvasCard: React.FC<{
  op: BatchOperation;
  index: number;
  onRemove: () => void;
  onUpdate: (params: Record<string, string | number | null>) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}> = ({ op, index, onRemove, onUpdate, onReorder }) => {
  const [{ isDragging }, drag] = useDrag<CanvasDragItem, void, { isDragging: boolean }>(() => ({
    type: DND_TYPES.CANVAS_ITEM,
    item: { type: DND_TYPES.CANVAS_ITEM, id: op.id, index },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }));

  const [{ isOver }, drop] = useDrop<CanvasDragItem, void, { isOver: boolean }>({
    accept: DND_TYPES.CANVAS_ITEM,
    collect: (monitor) => ({ isOver: monitor.isOver() }),
    hover: (item) => {
      if (item.index !== index) {
        onReorder(item.index, index);
        item.index = index;
      }
    },
  });

  const dragDrop = useCallback(
    (node: HTMLDivElement | null) => {
      drag(drop(node));
    },
    [drag, drop]
  );

  return (
    <div
      ref={dragDrop}
      className={`rounded-xl border transition-all duration-200 animate-operation-drop ${
        isDragging
          ? 'opacity-40 border-primary-500 shadow-lg shadow-primary-500/10'
          : isOver
          ? 'border-primary-500/60 bg-primary-500/5'
          : 'border-gray-700 bg-gray-800/40 hover:border-gray-600'
      }`}
      style={{ borderLeft: `4px solid ${op.operation.color}` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between p-4 pb-2">
        <div className="flex items-center gap-3">
          <GripVertical className="w-4 h-4 text-gray-600 cursor-move shrink-0" />
          <span className="text-lg">{op.operation.icon}</span>
          <div>
            <div className="font-semibold text-sm">
              {op.operation.pallet}.<span className="text-gray-300">{op.operation.method}</span>
            </div>
            <div className="text-xs text-gray-500">{op.operation.description}</div>
          </div>
        </div>
        <button
          onClick={onRemove}
          className="p-1 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Parameters */}
      <div className="px-4 pb-2">
        <div className="text-xs text-gray-600 mb-2 font-medium uppercase tracking-wider">Parameters</div>
        <div className="space-y-2">
          {op.operation.parameters.map((param) => (
            <div key={param.name} className="flex items-center gap-2">
              <div className="flex-1 min-w-0">
                <span className="text-xs font-mono text-gray-300">{param.name}</span>
                {param.required && <span className="text-red-400 text-xs ml-1">*</span>}
                <span className="text-xs text-gray-600 ml-1">({param.type})</span>
              </div>
              <input
                type="text"
                value={op.parameters[param.name] ?? ''}
                onChange={(e) =>
                  onUpdate({ ...op.parameters, [param.name]: e.target.value })
                }
                placeholder={param.defaultValue?.toString() ?? '...'}
                className="w-40 bg-gray-900 border border-gray-700 rounded-lg px-2 py-1 text-xs text-gray-200 focus:outline-none focus:border-primary-500 transition-colors"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-gray-700/50 mt-1">
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Zap className="w-3 h-3 text-yellow-500" /> {op.gasUsed.toLocaleString()} gas
          </span>
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Clock className="w-3 h-3 text-blue-400" /> Step {index + 1}
          </span>
        </div>
        <span
          className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ background: `${op.operation.color}18`, color: op.operation.color }}
        >
          {op.operation.category}
        </span>
      </div>
    </div>
  );
};

// ─── Drop Zone (canvas) ───────────────────────────────────────
const DropZone: React.FC<{
  operations: BatchOperation[];
  onDrop: (opId: string) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, params: Record<string, string | number | null>) => void;
  onReorder: (from: number, to: number) => void;
}> = ({ operations, onDrop, onRemove, onUpdate, onReorder }) => {
  const [{ isOver }, drop] = useDrop<PaletteDragItem, void, { isOver: boolean }>({
    accept: DND_TYPES.PALETTE_ITEM,
    drop: (item) => {
      onDrop(item.operationId);
    },
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  });

  return (
    <div
      ref={drop}
      className={`min-h-[380px] rounded-2xl border-2 border-dashed p-5 transition-all duration-300 ${
        isOver ? 'drop-zone-active' : 'border-gray-700/60'
      } ${operations.length === 0 ? 'flex items-center justify-center' : ''}`}
    >
      {operations.length === 0 ? (
        <div className="text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center">
            <Plus className="w-6 h-6 text-gray-600" />
          </div>
          <p className="text-gray-500 font-medium">Drop operations here</p>
          <p className="text-gray-600 text-sm mt-1">Or click items in the palette to add them</p>
        </div>
      ) : (
        <div className="space-y-3 w-full">
          {operations.map((op, i) => (
            <CanvasCard
              key={op.id}
              op={op}
              index={i}
              onRemove={() => onRemove(op.id)}
              onUpdate={(params) => onUpdate(op.id, params)}
              onReorder={onReorder}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────
const BatchBuilder: React.FC<BatchBuilderProps> = ({
  batch,
  setBatch,
  addOperation,
  removeOperation,
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const categories = [...new Set(PALLET_OPERATIONS.map((o) => o.category))];

  const filtered = PALLET_OPERATIONS.filter((op) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      op.pallet.toLowerCase().includes(q) ||
      op.method.toLowerCase().includes(q) ||
      op.description.toLowerCase().includes(q);
    const matchesCategory = !categoryFilter || op.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleUpdate = (id: string, params: Record<string, string | number | null>) => {
    setBatch((prev) => ({
      ...prev,
      operations: prev.operations.map((op) =>
        op.id === id ? { ...op, parameters: params } : op
      ),
    }));
  };

  const handleReorder = (fromIdx: number, toIdx: number) => {
    setBatch((prev) => {
      const ops = [...prev.operations];
      const [moved] = ops.splice(fromIdx, 1);
      ops.splice(toIdx, 0, moved);
      return {
        ...prev,
        operations: ops.map((op, i) => ({ ...op, order: i })),
      };
    });
  };

  // Click-to-add fallback (palette items are also draggable)
  const handlePaletteClick = (opId: string) => {
    addOperation(opId);
  };

  const totalGas = batch.operations.reduce((s, o) => s + o.gasUsed, 0);
  const palletCount = new Set(batch.operations.map((o) => o.operation.pallet)).size;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="glass-card rounded-2xl p-6">
        {/* Title row */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary-500" />
            Build Your Batch
          </h2>
          <span className="text-xs text-gray-500 bg-gray-800 px-3 py-1 rounded-full">
            {batch.operations.length} operation{batch.operations.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="grid lg:grid-cols-[260px_1fr] gap-5">
          {/* ── Palette ── */}
          <div className="flex flex-col gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search pallets…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-primary-500 transition-colors"
              />
            </div>

            {/* Category pills */}
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setCategoryFilter(null)}
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                  !categoryFilter
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat === categoryFilter ? null : cat)}
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize transition-colors ${
                    categoryFilter === cat
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Items list */}
            <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1">
              {filtered.map((op) => (
                <div key={op.id} onClick={() => handlePaletteClick(op.id)} className="cursor-pointer">
                  <PaletteItem operation={op} />
                </div>
              ))}
              {filtered.length === 0 && (
                <p className="text-xs text-gray-600 text-center py-6">No operations match</p>
              )}
            </div>

            {/* Hint */}
            <div className="mt-2 p-3 bg-gray-900/60 rounded-xl border border-gray-700/40">
              <p className="text-xs text-gray-500">
                <span className="text-gray-300 font-medium">💡 Tip:</span> Drag items into the canvas, or click to add instantly.
              </p>
            </div>
          </div>

          {/* ── Canvas + Stats ── */}
          <div className="flex flex-col gap-4">
            <DropZone
              operations={batch.operations}
              onDrop={addOperation}
              onRemove={removeOperation}
              onUpdate={handleUpdate}
              onReorder={handleReorder}
            />

            {/* Stats bar */}
            {batch.operations.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: 'Total Gas', value: totalGas.toLocaleString(), icon: <Zap className="w-4 h-4 text-yellow-400" />, color: 'text-yellow-300' },
                  { label: 'Operations', value: batch.operations.length, icon: <Layers className="w-4 h-4 text-blue-400" />, color: 'text-blue-300' },
                  { label: 'Pallets', value: palletCount, icon: <Search className="w-4 h-4 text-purple-400" />, color: 'text-purple-300' },
                  { label: 'Transactions', value: 1, icon: <Clock className="w-4 h-4 text-green-400" />, color: 'text-green-300' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-gray-900/60 rounded-xl p-3 border border-gray-700/40 animate-fade-up">
                    <div className="flex items-center gap-2 mb-1">
                      {stat.icon}
                      <span className={`text-lg font-bold ${stat.color}`}>{stat.value}</span>
                    </div>
                    <div className="text-xs text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default BatchBuilder;