import React from 'react';
import { BulbOutlined, HeartOutlined, CloseOutlined } from '@ant-design/icons';
import { SuggestedWord } from '../types';
import '../styles/main.scss';

interface SuggestionsProps {
    topic: string;
    setTopic: (value: string) => void;
    suggestedWords: SuggestedWord[];
    isLoading: boolean;
    onGetSuggestions: () => void;
    onWordRating: (word: string, type: string) => void;
}

const Suggestions: React.FC<SuggestionsProps> = ({
    topic,
    setTopic,
    suggestedWords,
    isLoading,
    onGetSuggestions,
    onWordRating
}) => {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-4">Gợi ý từ vựng</h2>
                <p className="text-lg text-dark mb-6">Nhập chủ đề để nhận gợi ý từ vựng phù hợp</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Ví dụ: Technology, Food, Travel..."
                    className="flex-1 max-w-md p-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-lg shadow-sm"
                />
                <button
                    onClick={onGetSuggestions}
                    disabled={isLoading}
                    className="w-full sm:w-auto px-6 py-3 bg-accent text-white rounded-lg font-semibold text-lg hover:bg-secondary transition-colors duration-300 shadow-md transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                    {isLoading ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : <BulbOutlined style={{ fontSize: '20px' }} />}
                    <span>{isLoading ? 'Đang tạo...' : 'Lấy gợi ý'}</span>
                </button>
            </div>

            {suggestedWords.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-dark">Gợi ý cho chủ đề {topic}</h3>
                    <ul className="space-y-3">
                        {suggestedWords.map((word) => (
                            <li key={word.word} className="p-4 bg-white border border-secondary rounded-lg shadow-md flex justify-between items-center hover:bg-gray-50 transition-colors duration-200">
                                <div className="flex-grow">
                                    <p className="text-lg font-semibold text-dark">{word.word}</p>
                                    <p className="text-base text-dark opacity-80">{word.definition}</p>
                                </div>
                                <div className="flex items-center space-x-2 ml-4">
                                    <button
                                        onClick={() => onWordRating(word.word, 'like')}
                                        className="p-2 text-accent hover:text-primary transition-colors duration-200"
                                        title="Thích từ này"
                                    >
                                        <HeartOutlined style={{ fontSize: '18px' }} />
                                    </button>
                                    <button
                                        onClick={() => onWordRating(word.word, 'dislike')}
                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                                        title="Không thích từ này"
                                    >
                                        <CloseOutlined style={{ fontSize: '18px' }} />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Suggestions; 