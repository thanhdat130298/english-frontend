"use client"
import React from 'react';
import { useVocabApp } from '../hooks/useVocabApp';
import { CustomModal } from '../components';
import { useTheme } from '../context/ThemeContext';
import Link from 'next/link';
import { 
  PlusOutlined, 
  BarsOutlined, 
  BulbOutlined, 
  TrophyOutlined, 
  TeamOutlined,
  UserOutlined 
} from '@ant-design/icons';

export default function HomePage() {
  const app = useVocabApp();
  const { theme } = useTheme();

  const dashboardItems = [
    {
      title: 'Thêm từ mới',
      description: 'Dịch và lưu từ vựng mới',
      icon: <PlusOutlined style={{ fontSize: '24px' }} />,
      href: '/add-word',
      color: 'bg-primary'
    },
    {
      title: 'Danh sách của tôi',
      description: `${app.myWords.length} từ đã lưu`,
      icon: <BarsOutlined style={{ fontSize: '24px' }} />,
      href: '/my-list',
      color: 'bg-secondary'
    },
    {
      title: 'Gợi ý từ',
      description: 'Khám phá từ vựng theo chủ đề',
      icon: <BulbOutlined style={{ fontSize: '24px' }} />,
      href: '/suggestions',
      color: 'bg-accent'
    },
    {
      title: 'Bảng xếp hạng',
      description: 'Xem top người dùng và từ vựng',
      icon: <TrophyOutlined style={{ fontSize: '24px' }} />,
      href: '/leaderboard',
      color: 'bg-success'
    },
    {
      title: 'Bạn bè',
      description: 'Kết nối và chia sẻ từ vựng',
      icon: <TeamOutlined style={{ fontSize: '24px' }} />,
      href: '/friends',
      color: 'bg-info'
    },
    {
      title: 'Hồ sơ',
      description: 'Thông tin cá nhân',
      icon: <UserOutlined style={{ fontSize: '24px' }} />,
      href: '/profile',
      color: 'bg-dark'
    }
  ];

  return (
    <>
      <CustomModal
        show={app.showModal}
        title="Thông báo ứng dụng"
        message={app.modalContent}
        onConfirm={() => app.setShowModal(false)}
      />
      
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-dark">
            Chào mừng đến với VocabVault!
          </h1>
          <p className="text-lg text-secondary mb-6">
            Nền tảng học từ vựng tiếng Anh hiệu quả
          </p>
          <div className="bg-accent p-4 rounded-lg inline-block">
            <p className="text-dark font-semibold">
              Chế độ hiện tại: {theme === 'dark' ? 'Tối' : 'Sáng'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardItems.map((item, index) => (
            <Link 
              href={item.href} 
              key={index}
              className={`${item.color} p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-white`}
            >
              <div className="flex items-center space-x-4">
                <div className="text-white">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-white opacity-90">{item.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border">
          <h2 className="text-2xl font-bold mb-4 text-dark">Thống kê nhanh</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-primary rounded-lg text-white">
              <div className="text-2xl font-bold">{app.myWords.length}</div>
              <div>Từ đã lưu</div>
            </div>
            <div className="text-center p-4 bg-secondary rounded-lg text-white">
              <div className="text-2xl font-bold">{app.friendsList.length}</div>
              <div>Bạn bè</div>
            </div>
            <div className="text-center p-4 bg-accent rounded-lg text-dark">
              <div className="text-2xl font-bold">{app.suggestedWords.length}</div>
              <div>Từ gợi ý</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
