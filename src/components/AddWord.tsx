import React from 'react';
import { TranslationOutlined, SaveOutlined } from '@ant-design/icons';
import { AddWordProps } from '../types';
import '../styles/main.scss';

const AddWord: React.FC<AddWordProps> = ({
    wordInput = '',
    setWordInput,
    translationResult,
    isLoadingTranslation,
    suggestedExistingWord,
    onTranslate,
    onSave
}) => {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-4">Thêm từ mới</h2>
                <p className="text-lg text-dark mb-6">Dịch và lưu từ vựng mới vào danh sách của bạn</p>
            </div>

            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <input
                        type="text"
                        value={wordInput}
                        onChange={(e) => setWordInput(e.target.value)}
                        placeholder="Nhập từ tiếng Anh..."
                        className="flex-1 p-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-lg shadow-sm"
                    />
                    <button
                        onClick={onTranslate}
                        disabled={isLoadingTranslation || !wordInput?.trim()}
                        className="w-full sm:w-auto px-6 py-3 bg-accent text-white rounded-lg font-semibold text-lg hover:bg-secondary transition-colors duration-300 shadow-md transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                        {isLoadingTranslation ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : <TranslationOutlined style={{ fontSize: '20px' }} />}
                        <span>{isLoadingTranslation ? 'Đang dịch...' : 'Dịch'}</span>
                    </button>
                </div>

                {translationResult?.definition && (
                    <div className="p-4 bg-white border border-secondary rounded-lg shadow-md space-y-3">
                        <div>
                            <h3 className="font-semibold text-dark mb-1">Định nghĩa:</h3>
                            <p className="text-dark opacity-80">{translationResult.definition}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-dark mb-1">Bản dịch:</h3>
                            <p className="text-dark opacity-80">{translationResult.translation}</p>
                        </div>
                        <button
                            onClick={onSave}
                            className="w-full px-4 py-2 bg-primary text-dark rounded-lg font-semibold text-lg hover:bg-secondary hover:text-white transition-colors duration-300 shadow-md transform hover:scale-105 flex items-center justify-center space-x-2"
                        >
                            <SaveOutlined style={{ fontSize: '18px' }} />
                            <span>Lưu từ</span>
                        </button>
                    </div>
                )}

                {suggestedExistingWord && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg shadow-md">
                        <h3 className="font-semibold text-dark mb-2">Từ này đã tồn tại:</h3>
                        <p className="text-dark opacity-80"><strong>{suggestedExistingWord.word}</strong> - {suggestedExistingWord.definition}</p>
                        <p className="text-dark opacity-70">Đã được thêm {suggestedExistingWord.addedCount} lần</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddWord; 