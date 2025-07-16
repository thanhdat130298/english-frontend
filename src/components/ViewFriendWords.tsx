import React from 'react';
import { ArrowLeftOutlined, UserOutlined } from '@ant-design/icons';
import WordItem from './WordItem';
import { ViewFriendWordsProps } from '../types';
import '../styles/main.scss';

const ViewFriendWords: React.FC<ViewFriendWordsProps> = ({
    friendWords,
    viewingFriend,
    isLoading,
    onBack,
    wordGeneratedSentences,
    wordSynonymAntonyms,
    wordLLMLoading,
    onGenerateSentence,
    onGetSynonymsAntonyms
}) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <button
                    onClick={onBack}
                    className="p-2 bg-accent text-white rounded-lg hover:bg-secondary transition-colors duration-200 shadow-sm"
                >
                    <ArrowLeftOutlined style={{ fontSize: '18px' }} />
                </button>
                <div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-dark">Từ vựng của bạn bè</h2>
                    {viewingFriend && (
                        <div className="flex items-center space-x-2 mt-2">
                            <UserOutlined style={{ fontSize: '20px', color: 'var(--color-accent)' }} />
                            <span className="text-lg text-dark opacity-80">{viewingFriend.name}</span>
                        </div>
                    )}
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-lg text-dark">Đang tải từ vựng...</p>
                </div>
            ) : friendWords.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-lg text-dark opacity-70">Bạn bè này chưa có từ vựng nào.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold text-dark">
                            {friendWords.length} từ vựng
                        </h3>
                    </div>
                    <ul className="space-y-4">
                        {friendWords.map((word) => (
                            <WordItem
                                key={word.id}
                                item={word}
                                isFriendView={true}
                                onGenerateSentence={onGenerateSentence}
                                onGetSynonymsAntonyms={onGetSynonymsAntonyms}
                                wordGeneratedSentences={wordGeneratedSentences}
                                wordSynonymAntonyms={wordSynonymAntonyms}
                                wordLLMLoading={wordLLMLoading}
                            />
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ViewFriendWords; 