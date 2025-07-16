import React from 'react';
import { HeartOutlined } from '@ant-design/icons';
import { LeaderboardUser, LeaderboardWord } from '../types';
import '../styles/main.scss';

interface LeaderboardProps {
    data: (LeaderboardUser | LeaderboardWord)[];
    type: 'topUsers' | 'mostAddedWords' | 'mostLikedWords';
    setType: (type: 'topUsers' | 'mostAddedWords' | 'mostLikedWords') => void;
    isLoading: boolean;
}

const Leaderboard: React.FC<LeaderboardProps> = ({
    data,
    type,
    setType,
    isLoading
}) => {
    const typeLabels = {
        topUsers: 'Top Người dùng',
        mostAddedWords: 'Từ được thêm nhiều nhất',
        mostLikedWords: 'Từ được thích nhiều nhất'
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-4">Bảng xếp hạng</h2>
                <div className="flex flex-wrap justify-center gap-2">
                    {Object.entries(typeLabels).map(([key, label]) => (
                        <button
                            key={key}
                            onClick={() => setType(key as 'topUsers' | 'mostAddedWords' | 'mostLikedWords')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                                type === key 
                                    ? 'bg-primary text-dark shadow-md' 
                                    : 'bg-white text-dark border border-secondary hover:bg-secondary hover:text-white'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-lg text-dark">Đang tải dữ liệu...</p>
                </div>
            ) : (
                <ul className="space-y-3">
                    {data.map((item, index) => {
                        if (type === 'topUsers' && 'username' in item && 'wordCount' in item) {
                            const userItem = item as LeaderboardUser;
                            return (
                                <li key={userItem.username} className="p-4 bg-white border border-secondary rounded-lg shadow-md flex justify-between items-center text-lg hover:bg-gray-50 transition-colors duration-200">
                                    <span className="font-semibold">{index + 1}. {userItem.username}</span>
                                    <span className="font-bold text-accent">{userItem.wordCount} từ</span>
                                </li>
                            );
                        } else if (type === 'mostAddedWords' && 'word' in item && 'addedCount' in item) {
                            const wordItem = item as LeaderboardWord;
                            return (
                                <li key={wordItem.word} className="p-4 bg-white border border-secondary rounded-lg shadow-md flex justify-between items-center text-lg hover:bg-gray-50 transition-colors duration-200">
                                    <span className="font-semibold">{index + 1}. {wordItem.word}</span>
                                    <span className="font-bold text-accent">{wordItem.addedCount} additions</span>
                                </li>
                            );
                        } else if (type === 'mostLikedWords' && 'word' in item && 'upvotes' in item) {
                            const wordItem = item as LeaderboardWord;
                            return (
                                <li key={wordItem.word} className="p-4 bg-white border border-secondary rounded-lg shadow-md flex justify-between items-center text-lg hover:bg-gray-50 transition-colors duration-200">
                                    <span className="font-semibold">{index + 1}. {wordItem.word}</span>
                                    <span className="font-bold text-accent flex items-center space-x-1">
                                        <HeartOutlined style={{ fontSize: '18px' }} />
                                        <span>{wordItem.upvotes}</span>
                                    </span>
                                </li>
                            );
                        } else {
                            return null;
                        }
                    })}
                </ul>
            )}
        </div>
    );
};

export default Leaderboard; 