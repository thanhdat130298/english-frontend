import React from 'react';
import { DeleteOutlined, MessageOutlined, BookOutlined } from '@ant-design/icons';
import type { WordItem } from '../types';
import '../styles/main.scss';

interface WordItemProps {
    item: WordItem;
    isFriendView?: boolean;
    onDelete?: (id: string) => void;
    onGenerateSentence?: (word: string) => void;
    onGetSynonymsAntonyms?: (word: string) => void;
    wordGeneratedSentences?: Record<string, string[]>;
    wordSynonymAntonyms?: Record<string, { synonyms: string[], antonyms: string[] }>;
    wordLLMLoading?: Record<string, boolean>;
}

const WordItem: React.FC<WordItemProps> = ({
    item,
    isFriendView = false,
    onDelete,
    onGenerateSentence,
    onGetSynonymsAntonyms,
    wordGeneratedSentences,
    wordSynonymAntonyms,
    wordLLMLoading
}) => {
    return (
        <li className="p-4 bg-white border border-secondary rounded-lg shadow-md flex flex-col hover:bg-gray-50 transition-colors duration-200">
            <div className="flex-grow">
                <p className="text-xl font-bold text-dark">{item.word}</p>
                <p className="text-base text-dark opacity-80 mt-1"><span className="font-semibold">Def:</span> {item.definition}</p>
                <p className="text-base text-dark opacity-70"><span className="font-semibold">Trans:</span> {item.translation}</p>
            </div>
            
            {!isFriendView && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                        {onGenerateSentence && (
                            <button
                                onClick={() => onGenerateSentence(item.word)}
                                disabled={wordLLMLoading?.[item.word]}
                                className="px-3 py-1 bg-accent text-white rounded-lg text-sm flex items-center space-x-1 hover:bg-secondary transition-colors duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <MessageOutlined style={{ fontSize: '14px' }} />
                                <span>{wordLLMLoading?.[item.word] ? 'Đang tạo...' : 'Tạo câu'}</span>
                            </button>
                        )}
                        {onGetSynonymsAntonyms && (
                            <button
                                onClick={() => onGetSynonymsAntonyms(item.word)}
                                disabled={wordLLMLoading?.[item.word]}
                                className="px-3 py-1 bg-primary text-dark rounded-lg text-sm flex items-center space-x-1 hover:bg-secondary hover:text-white transition-colors duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <BookOutlined style={{ fontSize: '14px' }} />
                                <span>{wordLLMLoading?.[item.word] ? 'Đang tải...' : 'Từ đồng nghĩa'}</span>
                            </button>
                        )}
                    </div>
                    {onDelete && (
                        <button
                            onClick={() => onDelete(item.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm flex items-center space-x-1 hover:bg-red-600 transition-colors duration-200 shadow-sm"
                        >
                            <DeleteOutlined style={{ fontSize: '14px' }} />
                            <span>Xóa</span>
                        </button>
                    )}
                </div>
            )}
            
            {wordGeneratedSentences?.[item.word] && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-dark mb-2">Câu ví dụ:</h4>
                    <ul className="space-y-1">
                        {wordGeneratedSentences[item.word].map((sentence, index) => (
                            <li key={index} className="text-sm text-dark opacity-80">• {sentence}</li>
                        ))}
                    </ul>
                </div>
            )}
            
            {wordSynonymAntonyms?.[item.word] && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-semibold text-dark mb-2">Từ đồng nghĩa:</h4>
                            <p className="text-sm text-dark opacity-80">
                                {wordSynonymAntonyms[item.word].synonyms.join(', ')}
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-dark mb-2">Từ trái nghĩa:</h4>
                            <p className="text-sm text-dark opacity-80">
                                {wordSynonymAntonyms[item.word].antonyms.join(', ')}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </li>
    );
};
export default WordItem;