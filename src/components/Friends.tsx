import React from 'react';
import { UserAddOutlined, TeamOutlined } from '@ant-design/icons';
import { FriendsProps } from '../types';
import '../styles/main.scss';

const Friends: React.FC<FriendsProps> = ({
    friendInputId = '',
    setFriendInputId,
    friendsList = [],
    onAddFriend,
    onViewFriendWords
}) => {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-4">Quản lý bạn bè</h2>
                <p className="text-lg text-dark mb-6">Kết nối và chia sẻ từ vựng với bạn bè</p>
            </div>

            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <input
                        type="text"
                        value={friendInputId}
                        onChange={(e) => setFriendInputId(e.target.value)}
                        placeholder="Nhập ID người dùng..."
                        className="flex-1 p-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-lg shadow-sm"
                    />
                    <button
                        onClick={onAddFriend}
                        disabled={!friendInputId?.trim()}
                        className="w-full sm:w-auto px-6 py-3 bg-accent text-white rounded-lg font-semibold text-lg hover:bg-secondary transition-colors duration-300 shadow-md transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                        <UserAddOutlined style={{ fontSize: '20px' }} />
                        <span>Thêm bạn</span>
                    </button>
                </div>

                {friendsList.length > 0 ? (
                    <div className="space-y-3">
                        <h3 className="text-xl font-semibold text-dark">Danh sách bạn bè ({friendsList.length})</h3>
                        <ul className="space-y-3">
                            {friendsList.map((friend) => (
                                <li key={friend.id} className="p-4 bg-white border border-secondary rounded-lg shadow-md flex justify-between items-center hover:bg-gray-50 transition-colors duration-200">
                                    <div className="flex items-center space-x-3">
                                        <TeamOutlined style={{ fontSize: '20px', color: 'var(--color-accent)' }} />
                                        <span className="font-semibold text-dark">{friend.friendName}</span>
                                    </div>
                                    <button
                                        onClick={() => onViewFriendWords(friend.friendId, friend.friendName)}
                                        className="px-4 py-2 bg-primary text-dark rounded-lg font-medium hover:bg-secondary hover:text-white transition-colors duration-200 shadow-sm"
                                    >
                                        Xem từ vựng
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <TeamOutlined style={{ fontSize: '48px', color: 'var(--color-accent)', marginBottom: '16px' }} />
                        <p className="text-lg text-dark opacity-70">Chưa có bạn bè nào. Hãy thêm bạn bè để chia sẻ từ vựng!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Friends; 