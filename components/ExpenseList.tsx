
import React from 'react';
import { Expense, User } from '../types';
import { Timestamp } from 'firebase/firestore';

interface ExpenseListProps {
    expenses: Expense[];
    members: User[];
    loading: boolean;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, members, loading }) => {
    const getUserNickname = (userId: string) => {
        return members.find(m => m.id === userId)?.nickname || '未知使用者';
    };

    const formatDate = (timestamp: Timestamp) => {
        if (timestamp && typeof timestamp.toDate === 'function') {
            return timestamp.toDate().toLocaleDateString();
        }
        return '...';
    };

    if (loading) {
        return (
            <div className="p-6 bg-white rounded-xl shadow-lg h-full flex justify-center items-center">
                <p className="text-slate-500">正在載入費用清單...</p>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg h-full">
            <h3 className="text-xl font-bold text-slate-700 mb-4">費用清單</h3>
            {expenses.length === 0 ? (
                <div className="text-center py-10 text-slate-500">
                    <p>目前沒有任何費用紀錄。</p>
                    <p className="text-sm">請在左方新增一筆費用。</p>
                </div>
            ) : (
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                    {expenses.map(expense => (
                        <div key={expense.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <p className="font-semibold text-slate-800">{expense.description}</p>
                                    <p className="text-sm text-slate-500 mt-1">
                                        由 <strong>{getUserNickname(expense.payerId)}</strong> 支付
                                    </p>
                                </div>
                                <div className="text-right ml-4">
                                    <p className="text-lg font-bold text-indigo-600">
                                        ${expense.amount.toFixed(2)}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        {formatDate(expense.createdAt)}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-slate-200">
                                <p className="text-xs text-slate-600 font-medium">分攤人:</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {expense.participants.map(pid => (
                                        <span key={pid} className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
                                            {getUserNickname(pid)}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ExpenseList;
