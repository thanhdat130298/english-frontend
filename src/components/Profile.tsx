import React from 'react';
import '../styles/main.scss';

interface ProfileProps {
    userId: string;
    username: string;
    wordCount: number;
    onBackToApp: () => void;
}

const Profile: React.FC<ProfileProps> = ({
    userId,
    username,
    wordCount,
    onBackToApp
}) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-secondary animate-fadeIn space-y-4">
            <h3 className="text-xl font-semibold text-dark mb-4">Thông tin hồ sơ của bạn</h3>
            <p className="text-base text-dark">
                <span className="font-bold">ID người dùng:</span> <span className="font-mono bg-gray-100 p-1 rounded-md text-sm break-all select-all">{userId}</span>
            </p>
            <p className="text-base text-dark">
                <span className="font-bold">Tên người dùng:</span> <span className="font-mono bg-gray-100 p-1 rounded-md text-sm">{username}</span>
            </p>
            <p className="text-base text-dark">
                <span className="font-bold">Số từ đã thêm:</span> <span className="font-mono bg-gray-100 p-1 rounded-md text-sm">{wordCount}</span>
            </p>
            <button
                onClick={onBackToApp}
                className="mt-4 px-4 py-2 bg-dark text-white rounded-lg hover:bg-accent transition-colors duration-300 shadow-md"
            >
                Quay lại ứng dụng
            </button>
        </div>
    );
};

export default Profile; 