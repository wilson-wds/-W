
import { Timestamp } from 'firebase/firestore';

export interface User {
    id: string;
    nickname: string;
}

export interface Group {
    id: string;
    name: string;
    members: User[];
    createdAt: Timestamp;
}

export interface Expense {
    id: string;
    groupId: string;
    description: string;
    amount: number;
    payerId: string;
    participants: string[]; // array of user IDs
    createdAt: Timestamp;
}

export interface Transaction {
    from: string; // nickname
    to: string; // nickname
    amount: number;
}
