
import React, { useMemo } from 'react';
import { Group, Expense, Transaction } from '../types';
import { calculateSettlement } from '../services/settlementService';

interface SettlementModalProps {
    group: Group;
    expenses: Expense[];
    onClose: () => void;
}

const SettlementModal: React.FC<SettlementModalProps> = ({ group, expenses, onClose }) => {
    const transactions = useMemo(() => calculateSettlement(group, expenses), [group, expenses]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md transform transition-all">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-slate-800">結算建議</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <i className="fas fa-times fa-lg"></i>
                    </button>
                </div>
                <div className="space-y-4">
                    {transactions.length === 0 ? (
                        <p className="text-slate-600 text-center py-8">所有帳務都已結清！</p>
                    ) : (
                        transactions.map((t, index) => (
                            <div key={index} className="flex items-center justify-between bg-slate-100 p-4 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <span className="font-semibold text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full">{t.from}</span>
                                    <i className="fas fa-long-arrow-alt-right text-slate-500"></i>
                                    <span className="font-semibold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">{t.to}</span>
                                </div>
                                <span className="font-bold text-xl text-slate-700">${t.amount.toFixed(2)}</span>
                            </div>
                        ))
                    )}
                </div>
                <button
                    onClick={onClose}
                    className="mt-6 w-full px-4 py-2 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700 transition"
                >
                    關閉
                </button>
            </div>
        </div>
    );
};

export default SettlementModal;
