import React, { useState } from "react";
import { DollarSign, Plus, Calendar, Tag, Trash, TrendingDown } from "lucide-react";
import { DailyExpense } from "../types";

interface FinanceModuleProps {
  expenses: DailyExpense[];
  onAddExpense: (expense: Omit<DailyExpense, "id" | "timestamp">) => void;
  onDeleteExpense: (id: string) => void;
  currencySymbol: string;
}

const CONSTANT_CATEGORIES = [
  "Study Materials",
  "AI API Tools",
  "Nutrition & Gym",
  "Cafeteria / Coffee",
  "Transport",
  "Recreation / Leisure",
  "Miscellaneous"
];

export default function FinanceModule({
  expenses,
  onAddExpense,
  onDeleteExpense,
  currencySymbol
}: FinanceModuleProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Study Materials");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amount) return;
    onAddExpense({
      description,
      amount: parseFloat(amount) || 0,
      category
    });
    setDescription("");
    setAmount("");
  };

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
      {/* Logger list and creation (Left 2 columns) */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-800/85">
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider flex items-center gap-2 text-white">
              <TrendingDown className="w-4 h-4 text-red-500 animate-pulse" /> Log Expenses Through The Day
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-red-950/40 text-red-400 rounded border border-red-500/20">
              Budget & Accountability
            </span>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6">
            <input
              type="text"
              placeholder="Expense item (e.g., Gemini Pro Subscription)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="px-3 py-2 text-xs rounded bg-zinc-950 border border-zinc-800 outline-none focus:border-red-500 sm:col-span-2 text-white font-mono"
              required
            />
            <div className="relative">
              <span className="absolute left-2.5 top-2.5 text-xs opacity-50 font-mono text-zinc-400">
                {currencySymbol}
              </span>
              <input
                type="number"
                step="0.01"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-7 pr-3 py-2 text-xs rounded bg-zinc-950 border border-zinc-800 outline-none focus:border-red-500 text-white font-mono"
                required
                min="0.01"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-2 py-2 text-xs rounded bg-zinc-950 border border-zinc-800 outline-none focus:border-red-500 flex-1 text-white font-mono"
              >
                {CONSTANT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="text-zinc-900 bg-zinc-950">
                    {cat}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="p-2 bg-red-600 hover:bg-red-505 text-white font-bold rounded flex items-center justify-center cursor-pointer"
                title="Log daily exp"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </form>

          {expenses.length === 0 ? (
            <div className="text-center py-8 text-xs text-zinc-500 italic">
              No expenses recorded today. Discipline is financial freedom. Keep your overhead extremely lean!
            </div>
          ) : (
            <div className="space-y-2">
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="p-3 rounded-lg bg-zinc-950 border border-zinc-850 flex items-center justify-between gap-3 text-xs font-mono"
                >
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded text-[9px] uppercase bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono">
                      {expense.category}
                    </span>
                    <span className="font-bold text-white font-mono">{expense.description}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-bold text-red-400 font-mono">
                      -{currencySymbol}
                      {expense.amount.toFixed(2)}
                    </span>
                    <button
                      onClick={() => onDeleteExpense(expense.id)}
                      className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                      title="Delete expense entry"
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Expense ledger sums (Right column) */}
      <div className="space-y-6">
        <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800">
          <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-widest border-b border-zinc-850 pb-2 mb-4">
            Overhead Accounting
          </h3>

          <div className="space-y-5">
            <div>
              <span className="text-[10px] text-zinc-500 font-mono block mb-1">TOTAL OUTFLOW RECORDED</span>
              <span className="text-3xl font-mono font-bold text-red-500">
                {currencySymbol}
                {totalSpent.toFixed(2)}
              </span>
            </div>

            {/* Micro bento visual helper */}
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-850 text-xs space-y-2 font-mono">
              <span className="font-semibold block text-red-400">Transformation Rules:</span>
              <p className="text-zinc-400 leading-normal font-sans text-xs">
                "Overspending is a direct leak of kinetic focus. By tracking exactly where your currency drains daily, you take back control of your surroundings."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
