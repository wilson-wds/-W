
import React, { useState, useEffect } from 'react';
import { Group, Expense, User } from '../types';
import AddExpenseForm from './AddExpenseForm';
import ExpenseList from './ExpenseList';
import SettlementModal from './SettlementModal';
import { UsersIcon, ClipboardIcon } from './icons';
import { db } from '../firebaseConfig';
import { collection, query, onSnapshot, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';

interface GroupPageProps {
    group: Group;
    currentUser: User;
    onLeaveGroup: () => void;
}

const GroupPage: React.FC<GroupPageProps> = ({ group, currentUser, onLeaveGroup }) => {
    const [isSettlementModalOpen, setIsSettlementModalOpen] = useState(false);
    const [showCopied, setShowCopied] = useState(false);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loadingExpenses, setLoadingExpenses] = useState(true);

    useEffect(() => {
        setLoadingExpenses(true);
        const expensesColRef = collection(db, "groups", group.id, "expenses");
        const q = query(expensesColRef, orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const expensesData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Expense));
            setExpenses(expensesData);
            setLoadingExpenses(false);
        }, (error) => {
            console.error("Error fetching expenses:", error);
            setLoadingExpenses(false);
        });

        return () => unsubscribe();
    }, [group.id]);

    const handleAddExpense = async (expenseData: Omit<Expense, 'id' | 'createdAt' | 'groupId'>) => {
        try {
            await addDoc(collection(db, "groups", group.id, "expenses"), {
                ...expenseData,
                groupId: group.id,
                createdAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Error adding expense:", error);
            alert("新增費用時發生錯誤。");
        }
    };

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(group.id).then(() => {
            setShowCopied(true);
            setTimeout(() => setShowCopied(false), 2000);
        });
    };
    
    return (
        <div className="space-y-6">
            <div className="p-6 bg-white rounded-xl shadow-lg">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800">{group.name}</h2>
                        <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                           <span>群組 ID: <code>{group.id}</code></span>
                           <button onClick={handleCopyToClipboard} className="relative p-1 rounded-md hover:bg-slate-200">
                               <ClipboardIcon className="h-5 w-5" />
                               {showCopied && (
                                   <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded">
                                       已複製!
                                   </span>
                               )}
                           </button>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                         <button
                            onClick={() => setIsSettlementModalOpen(true)}
                            className="px-4 py-2 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition"
                            disabled={expenses.length === 0}
                         >
                            結算
                         </button>
                         <button
                            onClick={onLeaveGroup}
                            className="px-4 py-2 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition"
                         >
                            離開群組
                         </button>
                    </div>
                </div>

                <div className="mt-6 border-t pt-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
                        <UsersIcon className="h-6 w-6 text-slate-500" />
                        群組成員
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {group.members.map(member => (
                            <span key={member.id} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                                {member.nickname}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <AddExpenseForm group={group} currentUser={currentUser} onAddExpense={handleAddExpense} />
                </div>
                <div className="lg:col-span-2">
                    <ExpenseList expenses={expenses} members={group.members} loading={loadingExpenses} />
                </div>
            </div>

            {isSettlementModalOpen && (
                <SettlementModal
                    group={group}
                    expenses={expenses}
                    onClose={() => setIsSettlementModalOpen(false)}
                />
            )}
        </div>
    );
};

export default GroupPage;
