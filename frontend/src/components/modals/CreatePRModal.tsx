import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { LineItem, Priority } from '../../types';
import { useProcurement } from '../../context/ProcurementContext';
import { Plus, Trash2, Calculator, Info } from 'lucide-react';
import { formatCurrency } from '../../config';

interface CreatePRModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatePRModal: React.FC<CreatePRModalProps> = ({ isOpen, onClose }) => {
  const { createPurchaseRequest } = useProcurement();

  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Infrastructure & DevOps');
  const [priority, setPriority] = useState<Priority>('medium');
  const [requiredDate, setRequiredDate] = useState('2026-11-20');
  const [businessJustification, setBusinessJustification] = useState('');

  const [items, setItems] = useState<LineItem[]>([
    {
      id: 'item-temp-1',
      name: 'High-Performance GPU Compute Node',
      category: 'Compute Hardware',
      quantity: 2,
      unit: 'units',
      estimatedUnitPrice: 8500,
      totalPrice: 17000,
      specifications: 'PCIe Gen 5, 80GB H100 GPU equivalent for inference workloads',
    },
  ]);

  const handleAddItem = () => {
    const newItem: LineItem = {
      id: `item-temp-${Date.now()}`,
      name: '',
      category: 'General Supplies',
      quantity: 1,
      unit: 'units',
      estimatedUnitPrice: 100,
      totalPrice: 100,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleItemChange = (
    id: string,
    field: 'name' | 'quantity' | 'estimatedUnitPrice' | 'unit' | 'category' | 'specifications',
    value: string | number
  ) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'estimatedUnitPrice') {
          const qty = field === 'quantity' ? Number(value) : item.quantity;
          const price = field === 'estimatedUnitPrice' ? Number(value) : item.estimatedUnitPrice;
          updated.totalPrice = Math.max(0, qty * price);
        }
        return updated;
      })
    );
  };

  const subtotal = items.reduce((acc, curr) => acc + curr.totalPrice, 0);
  const estimatedTax = subtotal * 0.08;
  const totalAmount = subtotal + estimatedTax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || items.some((i) => !i.name.trim())) {
      alert('Please fill in requisition title and all item names.');
      return;
    }

    createPurchaseRequest({
      title,
      department,
      priority,
      requiredDate,
      businessJustification,
      items,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Purchase Requisition (PR)"
      subtitle="Submit an authorized procurement requisition for department and finance review."
      maxWidth="4xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 text-slate-800 dark:text-slate-200">
        {/* Top Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Requisition Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Q4 Data Center Network Switch Upgrades"
              className="w-full bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700/80 rounded-lg px-3 sm:px-3.5 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700/80 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="Infrastructure & DevOps">Infrastructure & DevOps</option>
              <option value="Facilities & Workplace">Facilities & Workplace</option>
              <option value="Information Security">Information Security</option>
              <option value="R&D Engineering">R&D Engineering</option>
              <option value="Corporate Operations">Corporate Operations</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Priority Level</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700/80 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="low">Low (Standard fulfillment)</option>
              <option value="medium">Medium (Routine operations)</option>
              <option value="high">High (Time sensitive)</option>
              <option value="urgent">Urgent (Production critical)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Required Delivery Date
            </label>
            <input
              type="date"
              required
              value={requiredDate}
              onChange={(e) => setRequiredDate(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700/80 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2 md:col-span-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Approval Level Estimated
            </label>
            <div className="h-[38px] px-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-lg flex items-center text-xs text-blue-700 dark:text-blue-400 font-medium">
              {totalAmount > 50000
                ? 'Finance Director / CFO'
                : totalAmount > 5000
                ? 'Procurement Specialist'
                : 'Dept Manager Only'}
            </div>
          </div>
        </div>

        {/* Business Justification */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Business Need & Justification *
          </label>
          <textarea
            rows={2}
            required
            value={businessJustification}
            onChange={(e) => setBusinessJustification(e.target.value)}
            placeholder="Explain why this purchase is necessary, expected ROI, and timeline constraints..."
            className="w-full bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700/80 rounded-lg px-3 sm:px-3.5 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Requisition Line Items */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Requisition Line Items ({items.length})
            </h4>
            <Button
              type="button"
              variant="outline"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={handleAddItem}
            >
              Add Item
            </Button>
          </div>

          <div className="space-y-3">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl p-3 sm:p-3.5 space-y-2.5 sm:space-y-3"
              >
                <div className="grid grid-cols-12 gap-2 sm:gap-3 items-center">
                  <div className="col-span-12 sm:col-span-5 space-y-1">
                    <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium">Item Description #{idx + 1}</span>
                    <input
                      type="text"
                      required
                      placeholder="Item name / model..."
                      value={item.name}
                      onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400"
                    />
                  </div>

                  <div className="col-span-4 sm:col-span-2 space-y-1">
                    <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium">Qty</span>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="col-span-4 sm:col-span-2 space-y-1">
                    <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium">Unit Price ($)</span>
                    <input
                      type="number"
                      min={0}
                      value={item.estimatedUnitPrice}
                      onChange={(e) => handleItemChange(item.id, 'estimatedUnitPrice', e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="col-span-3 sm:col-span-2 space-y-1">
                    <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium">Total</span>
                    <div className="py-1.5 text-xs font-bold text-slate-900 dark:text-slate-200">
                      {formatCurrency(item.totalPrice)}
                    </div>
                  </div>

                  <div className="col-span-1 flex justify-end pt-3 sm:pt-5">
                    <button
                      type="button"
                      disabled={items.length <= 1}
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 disabled:opacity-30 disabled:hover:text-slate-400 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Technical specifications / Part numbers (optional)..."
                    value={item.specifications || ''}
                    onChange={(e) => handleItemChange(item.id, 'specifications', e.target.value)}
                    className="w-full bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-700 dark:text-slate-300 placeholder:text-slate-400"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cost Summary Box */}
        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>Includes 8% estimated standard sales & logistics tax provision.</span>
          </div>
          <div className="text-left sm:text-right space-y-0.5 w-full sm:w-auto">
            <div className="text-xs text-slate-500 dark:text-slate-400">Subtotal: {formatCurrency(subtotal)}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Tax (8%): {formatCurrency(estimatedTax)}</div>
            <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Total Budget: <span className="text-blue-600 dark:text-blue-400">{formatCurrency(totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 sm:gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Submit Requisition
          </Button>
        </div>
      </form>
    </Modal>
  );
};
