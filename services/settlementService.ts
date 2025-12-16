
import { Expense, Group, Transaction, User } from '../types';

export const calculateSettlement = (group: Group, expenses: Expense[]): Transaction[] => {
    const balances: { [userId: string]: number } = {};
    group.members.forEach(member => {
        balances[member.id] = 0;
    });

    expenses.forEach(expense => {
        if (expense.participants.length === 0) return;

        const amountPerPerson = expense.amount / expense.participants.length;

        // Payer gets credited
        balances[expense.payerId] += expense.amount;

        // Participants get debited
        expense.participants.forEach(participantId => {
            balances[participantId] -= amountPerPerson;
        });
    });
    
    const creditors: { id: string, amount: number }[] = [];
    const debtors: { id: string, amount: number }[] = [];

    Object.entries(balances).forEach(([userId, balance]) => {
        if (balance > 0.01) {
            creditors.push({ id: userId, amount: balance });
        } else if (balance < -0.01) {
            debtors.push({ id: userId, amount: balance });
        }
    });

    const transactions: Transaction[] = [];
    
    creditors.sort((a, b) => b.amount - a.amount);
    debtors.sort((a, b) => a.amount - b.amount);

    let i = 0;
    let j = 0;

    while (i < creditors.length && j < debtors.length) {
        const creditor = creditors[i];
        const debtor = debtors[j];
        const debtorAmount = Math.abs(debtor.amount);
        const creditorAmount = creditor.amount;

        const settlementAmount = Math.min(debtorAmount, creditorAmount);

        const fromUser = group.members.find(m => m.id === debtor.id)?.nickname || 'Unknown';
        const toUser = group.members.find(m => m.id === creditor.id)?.nickname || 'Unknown';

        transactions.push({
            from: fromUser,
            to: toUser,
            amount: settlementAmount,
        });

        creditor.amount -= settlementAmount;
        debtor.amount += settlementAmount;

        if (Math.abs(creditor.amount) < 0.01) {
            i++;
        }

        if (Math.abs(debtor.amount) < 0.01) {
            j++;
        }
    }

    return transactions;
};
