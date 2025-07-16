import { ColorTheme } from '../types';

// Define the new color palette - matching CSS variables
export const colors: ColorTheme = {
    primary: '#80EE98',      // Light green - highest priority
    secondary: '#46DFB1',    // Teal green - second priority
    highlight: '#80EE98',    // Same as primary
    complementary: '#46DFB1', // Same as secondary
    tertiary: '#09D1C7',     // Cyan - third priority
    darkAccent: '#0C6478',   // Darkest blue - fifth priority
};

// Mock user data
export const MOCK_USER_ID = "mockUserId123";
export const MOCK_USERNAME = "DemoUser";

// Mock friends data
export const MOCK_FRIENDS = ['mockFriend456', 'mockFriend789', 'mockFriendABC'];

// View titles mapping
export const VIEW_TITLES = {
    addWord: 'Thêm từ mới',
    myList: 'Danh sách từ vựng của tôi',
    suggestions: 'Nhận gợi ý từ',
    leaderboard: 'Bảng xếp hạng',
    friends: 'Bạn bè của tôi',
    myProfile: 'Hồ sơ của tôi'
} as const; 