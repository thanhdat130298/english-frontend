import React, { useCallback } from 'react';
import { SearchOutlined, SortAscendingOutlined } from '@ant-design/icons';
import { WordItem } from '../types';
import WordItemComponent from './WordItem';
import '../styles/main.scss';

interface MyListProps {
    words: WordItem[];
    filter: string;
    setFilter: (value: string) => void;
    sort: 'newest' | 'oldest' | 'alphaAsc' | 'alphaDesc';
    setSort: (value: 'newest' | 'oldest' | 'alphaAsc' | 'alphaDesc') => void;
    onDelete: (id: string) => void;
    wordGeneratedSentences: Record<string, string[]>;
    wordSynonymAntonyms: Record<string, { synonyms: string[]; antonyms: string[] }>;
    wordLLMLoading: Record<string, boolean>;
    onGenerateSentence: (word: string) => void;
    onGetSynonymsAntonyms: (word: string) => void;
}

const MyList: React.FC<MyListProps> = ({
    words,
    filter,
    setFilter,
    sort,
    setSort,
    onDelete,
    wordGeneratedSentences,
    wordSynonymAntonyms,
    wordLLMLoading,
    onGenerateSentence,
    onGetSynonymsAntonyms
}) => {
    // Function to filter and sort My Words
    const getFilteredAndSortedWords = useCallback((): WordItem[] => {
        const filteredWords = words.filter(item =>
            item.word.toLowerCase().includes(filter.toLowerCase()) ||
            item.definition.toLowerCase().includes(filter.toLowerCase()) ||
            item.translation.toLowerCase().includes(filter.toLowerCase())
        );

        switch (sort) {
            case 'newest':
                filteredWords.sort((a, b) => b.timestamp - a.timestamp);
                break;
            case 'oldest':
                filteredWords.sort((a, b) => a.timestamp - b.timestamp);
                break;
            case 'alphaAsc':
                filteredWords.sort((a, b) => a.word.localeCompare(b.word));
                break;
            case 'alphaDesc':
                filteredWords.sort((a, b) => b.word.localeCompare(a.word));
                break;
            default:
                break;
        }
        return filteredWords;
    }, [words, filter, sort]);

    const filteredAndSortedWords = getFilteredAndSortedWords();

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-4">Danh sách từ của tôi</h2>
                <p className="text-lg text-dark mb-6">Quản lý và học từ vựng của bạn</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                    <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        placeholder="Tìm kiếm từ vựng..."
                        className="w-full pl-10 pr-4 py-3 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-lg shadow-sm"
                    />
                </div>
                <div className="relative">
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value as 'newest' | 'oldest' | 'alphaAsc' | 'alphaDesc')}
                        className="w-full sm:w-auto p-3 pr-10 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-lg shadow-sm appearance-none bg-white"
                    >
                        <option value="newest">Mới nhất</option>
                        <option value="oldest">Cũ nhất</option>
                        <option value="alphaAsc">A-Z</option>
                        <option value="alphaDesc">Z-A</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                        </svg>
                    </div>
                </div>
            </div>
            
            {filteredAndSortedWords.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-lg text-dark opacity-70">
                        {filter ? 'Không tìm thấy từ vựng nào phù hợp.' : 'Chưa có từ vựng nào trong danh sách.'}
                    </p>
                </div>
            ) : (
                <ul className="space-y-4">
                    {filteredAndSortedWords.map((item) => (
                        <WordItemComponent
                            key={item.id}
                            item={item}
                            onDelete={onDelete}
                            onGenerateSentence={onGenerateSentence}
                            onGetSynonymsAntonyms={onGetSynonymsAntonyms}
                            wordGeneratedSentences={wordGeneratedSentences}
                            wordSynonymAntonyms={wordSynonymAntonyms}
                            wordLLMLoading={wordLLMLoading}
                        />
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MyList; 