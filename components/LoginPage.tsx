
import React, { useState } from 'react';

interface LoginPageProps {
    onLogin: (nickname: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const [nickname, setNickname] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (nickname.trim()) {
            onLogin(nickname.trim());
        }
    };

    return (
        <div className="max-w-sm mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-center text-slate-700 mb-6">登入或註冊</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="nickname" className="block text-sm font-medium text-slate-600 mb-1">
                        輸入您的暱稱
                    </label>
                    <input
                        id="nickname"
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        placeholder="例如：小明"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                >
                    進入
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
