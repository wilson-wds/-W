
import React, { useState } from 'react';
import { User, Group } from './types';
import LoginPage from './components/LoginPage';
import GroupPage from './components/GroupPage';
import { LogoIcon } from './components/icons';
import { db } from './firebaseConfig';
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [currentGroup, setCurrentGroup] = useState<Group | null>(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (nickname: string) => {
        setLoading(true);
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("nickname", "==", nickname));
        
        try {
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                setCurrentUser({ id: userDoc.id, ...userDoc.data() } as User);
            } else {
                const docRef = await addDoc(usersRef, { nickname });
                setCurrentUser({ id: docRef.id, nickname });
            }
        } catch (error) {
            console.error("Error logging in: ", error);
            alert("登入時發生錯誤。");
        }
        setLoading(false);
    };

    const handleCreateGroup = async (groupName: string) => {
        if (!currentUser) return;
        setLoading(true);
        try {
            const docRef = await addDoc(collection(db, "groups"), {
                name: groupName,
                members: [currentUser],
                createdAt: serverTimestamp()
            });
            const newGroupDoc = await getDoc(docRef);
            setCurrentGroup({ id: newGroupDoc.id, ...newGroupDoc.data() } as Group);
        } catch (error) {
            console.error("Error creating group: ", error);
            alert("建立群組時發生錯誤。");
        }
        setLoading(false);
    };

    const handleJoinGroup = async (groupId: string) => {
        if (!currentUser) return;
        setLoading(true);
        const groupRef = doc(db, "groups", groupId.trim());
        try {
            const groupSnap = await getDoc(groupRef);
            if (groupSnap.exists()) {
                const groupData = { id: groupSnap.id, ...groupSnap.data() } as Group;
                const isMember = groupData.members.some(m => m.id === currentUser.id);
                if (!isMember) {
                   await updateDoc(groupRef, {
                       members: arrayUnion(currentUser)
                   });
                   groupData.members.push(currentUser);
                }
                setCurrentGroup(groupData);
            } else {
                alert('找不到群組！');
            }
        } catch (error) {
            console.error("Error joining group: ", error);
             alert('加入群組時發生錯誤。');
        }
        setLoading(false);
    };

    const handleLeaveGroup = () => {
        setCurrentGroup(null);
    };
    
    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex justify-center items-center h-64">
                    <div className="text-xl text-slate-500">載入中...</div>
                </div>
            );
        }
        if (!currentUser) {
            return <LoginPage onLogin={handleLogin} />;
        }
        if (!currentGroup) {
            return (
                 <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold text-center text-slate-700 mb-2">歡迎, {currentUser.nickname}!</h2>
                    <p className="text-center text-slate-500 mb-6">建立新群組或加入現有群組來開始記帳。</p>
                    
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-600 border-b pb-2">建立新群組</h3>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const groupName = (e.currentTarget.elements.namedItem('groupName') as HTMLInputElement).value;
                            if (groupName) handleCreateGroup(groupName);
                        }} className="flex gap-2">
                            <input
                                name="groupName"
                                type="text"
                                placeholder="例如：東京五日遊"
                                className="flex-grow w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                required
                            />
                            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition">
                                建立
                            </button>
                        </form>
                    </div>

                    <div className="my-6 flex items-center text-center">
                        <hr className="flex-grow border-t border-slate-300"/>
                        <span className="px-4 text-slate-500 font-medium">或</span>
                        <hr className="flex-grow border-t border-slate-300"/>
                    </div>

                     <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-600 border-b pb-2">加入群組</h3>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const groupId = (e.currentTarget.elements.namedItem('groupId') as HTMLInputElement).value;
                            if(groupId) handleJoinGroup(groupId);
                        }} className="flex gap-2">
                            <input
                                name="groupId"
                                type="text"
                                placeholder="輸入群組 ID"
                                className="flex-grow w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                required
                            />
                            <button type="submit" className="px-4 py-2 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition">
                                加入
                            </button>
                        </form>
                    </div>
                </div>
            );
        }
        return (
            <GroupPage
                group={currentGroup}
                currentUser={currentUser}
                onLeaveGroup={handleLeaveGroup}
            />
        );
    };

    return (
        <div className="min-h-screen bg-slate-100 font-sans">
            <header className="bg-white shadow-md">
                <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <LogoIcon className="h-8 w-8 text-indigo-600" />
                        <h1 className="text-2xl font-bold text-slate-800">Split Bill</h1>
                    </div>
                     {currentUser && (
                        <div className="flex items-center gap-4">
                           <span className="font-medium text-slate-600">使用者: {currentUser.nickname}</span>
                           <button 
                             onClick={() => {
                               setCurrentUser(null);
                               setCurrentGroup(null);
                             }}
                             className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold"
                           >
                             登出
                           </button>
                        </div>
                    )}
                </nav>
            </header>
            <main className="container mx-auto p-4">
                {renderContent()}
            </main>
        </div>
    );
};

export default App;
