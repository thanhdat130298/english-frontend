import React from 'react';
import { 
    PlusOutlined, BarsOutlined, BulbOutlined, TrophyOutlined, TeamOutlined, BulbFilled
} from '@ant-design/icons';
import { useTheme } from '../context/ThemeContext';
import Link from 'next/link';
import '../styles/main.scss';

interface NavigationProps {
    myWordsCount: number;
}

const Navigation: React.FC<NavigationProps> = ({ myWordsCount }) => {
    const { theme, toggleTheme } = useTheme();

    const navItems = [
        {
            key: 'add-word',
            label: 'Thêm từ',
            icon: <PlusOutlined style={{ fontSize: 20 }} />,
            href: '/add-word'
        },
        {
            key: 'my-list',
            label: `Danh sách (${myWordsCount})`,
            icon: <BarsOutlined style={{ fontSize: 20 }} />,
            href: '/my-list'
        },
        {
            key: 'suggestions',
            label: 'Gợi ý',
            icon: <BulbOutlined style={{ fontSize: 20 }} />,
            href: '/suggestions'
        },
        {
            key: 'leaderboard',
            label: 'Bảng xếp hạng',
            icon: <TrophyOutlined style={{ fontSize: 20 }} />,
            href: '/leaderboard'
        },
        {
            key: 'friends',
            label: 'Bạn bè',
            icon: <TeamOutlined style={{ fontSize: 20 }} />,
            href: '/friends'
        }
    ];

    return (
        <nav className="p-4 sm:p-6 lg:min-h-screen lg:w-64 flex flex-col items-center lg:rounded-l-xl rounded-t-xl lg:rounded-tr-none shadow-xl mb-4 lg:mb-0 bg-dark">
            <header className="text-center mb-6 w-full">
                <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight mt-2 text-white">
                    VocabVault
                </h1>
                <p className="text-sm sm:text-base text-white opacity-90 mt-1">
                    Open your world!
                </p>
            </header>

            <div className="flex flex-wrap lg:flex-col justify-center gap-2 w-full">
                {navItems.map((item) => (
                    <Link 
                        href={item.href} 
                        key={item.key}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium text-lg text-center transition-all duration-300 transform hover:scale-105 shadow-md bg-white bg-opacity-10 hover:bg-opacity-20 text-white"
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </Link>
                ))}
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium text-lg text-center transition-all duration-300 transform hover:scale-105 shadow-md mt-4 bg-primary text-dark"
                >
                  <BulbFilled style={{ fontSize: 20 }} />
                  <span>{theme === 'dark' ? 'Chế độ Sáng' : 'Chế độ Tối'}</span>
                </button>
            </div>
        </nav>
    );
};

export default Navigation; 