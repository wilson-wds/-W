
import React, { useState } from 'react';
import { Group, User, Expense } from '../types';

interface AddExpenseFormProps {
    group: Group;
    currentUser: User;
    onAddExpense: (expense: Omit<Expense, 'id' | 'createdAt' | 'groupId'>) => Promise<void>;
}

const AddExpenseForm: React.FC<AddExpenseFormProps> = ({ group, currentUser, onAddExpense }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [payerId, setPayerId] = useState(currentUser.id);
    const [participants, setParticipants] = useState<string[]>(group.members.map(m => m.id));
    const [error, setError] = useState('');

    const handleParticipantChange = (memberId: string) => {
        setParticipants(prev =>
            prev.includes(memberId)
                ? prev.filter(id => id !== memberId)
                : [...prev, memberId]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const numAmount = parseFloat(amount);
        if (!description || !numAmount || numAmount <= 0 || participants.length === 0) {
            setError('請填寫所有欄位並確保金額大於 0 且至少有一位分攤人。');
            return;
        }
        setError('');
        
        const newExpense: Omit<Expense, 'id' | 'createdAt' | 'groupId'> = {
            description,
            amount: numAmount,
            payerId,
            participants,
        };
        await onAddExpense(newExpense);

        // Reset form
        setDescription('');
        setAmount('');
        setPayerId(currentUser.id);
        setParticipants(group.members.map(m => m.id));
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-slate-700 mb-4">新增一筆費用</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-slate-600">項目名稱</label>
                    <input
                        id="description"
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="例如：晚餐"
                    />
                </div>
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-slate-600">金額</label>
                    <input
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="0.00"
                        min="0.01"
                        step="0.01"
                    />
                </div>
                <div>
                    <label htmlFor="payer" className="block text-sm font-medium text-slate-600">付款人</label>
                    <select
                        id="payer"
                        value={payerId}
                        onChange={(e) => setPayerId(e.target.value)}
                        className="mt-1 w-full px-3 py-2 border border-slate-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        {group.members.map(member => (
                            <option key={member.id} value={member.id}>{member.nickname}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <span className="block text-sm font-medium text-slate-600">分攤人</span>
                    <div className="mt-2 space-y-2 max-h-40 overflow-y-auto pr-2">
                        {group.members.map(member => (
                            <div key={member.id} className="flex items-center">
                                <input
                                    id={`participant-${member.id}`}
                                    type="checkbox"
                                    checked={participants.includes(member.id)}
                                    onChange={() => handleParticipantChange(member.id)}
                                    className="h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                                />
                                <label htmlFor={`participant-${member.id}`} className="ml-3 text-sm text-slate-700">
                                    {member.nickname}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <button
                    type="submit"
                    className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
                >
                    新增費用
                </button>
            </form>
        </div>
    );
};

export default AddExpenseForm;
