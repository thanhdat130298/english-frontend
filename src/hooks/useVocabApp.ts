"use client";
import { useState, useEffect, useCallback } from 'react';
import { 
    WordItem, 
    SuggestedWord, 
    FriendItem, 
    LeaderboardUser, 
    LeaderboardWord, 
    ViewingFriendWords,
    AppView 
} from '../types';
import { callGeminiAPI } from '../utils/api';
import { MOCK_USER_ID, MOCK_USERNAME, MOCK_FRIENDS } from '../utils/constants';

export const useVocabApp = () => {
    const [currentView, setCurrentView] = useState<AppView>('addWord');
    const [wordInput, setWordInput] = useState<string>('');
    const [translationResult, setTranslationResult] = useState<{ definition: string; translation: string }>({ definition: '', translation: '' });
    const [isLoadingTranslation, setIsLoadingTranslation] = useState<boolean>(false);

    // Mock data for myWords
    const [myWords, setMyWords] = useState<WordItem[]>([
        { id: 'mock1', word: 'Serendipity', definition: 'The occurrence and development of events by chance in a happy or beneficial way.', translation: 'Sự tình cờ may mắn', timestamp: 1678886400000 },
        { id: 'mock2', word: 'Ephemeral', definition: 'Lasting for a very short time.', translation: 'Phù du, chóng tàn', timestamp: 1678972800000 },
        { id: 'mock3', word: 'Mellifluous', definition: '(Of a voice or words) sweet or musical; pleasant to hear.', translation: 'Ngọt ngào, du dương', timestamp: 1679059200000 },
    ]);

    const [suggestionTopic, setSuggestionTopic] = useState<string>('');
    const [suggestedWords, setSuggestedWords] = useState<SuggestedWord[]>([]);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState<boolean>(false);

    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalContent, setModalContent] = useState<string>('');

    // Leaderboard State
    const [leaderboardData, setLeaderboardData] = useState<(LeaderboardUser | LeaderboardWord)[]>([]);
    const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState<boolean>(false);
    const [leaderboardType, setLeaderboardType] = useState<'topUsers' | 'mostAddedWords' | 'mostLikedWords'>('topUsers');

    // Friends State
    const [friendInputId, setFriendInputId] = useState<string>('');
    const [friendsList, setFriendsList] = useState<FriendItem[]>([
        { id: 'f_mock_a', friendId: 'mockFriend456', friendName: 'Học_Văn_A' },
        { id: 'f_mock_b', friendId: 'mockFriend789', friendName: 'Ngữ_Pháp_B' },
    ]);
    const [viewingFriendWords, setViewingFriendWords] = useState<ViewingFriendWords | null>(null);
    const [friendWordsList, setFriendWordsList] = useState<WordItem[]>([]);
    const [isLoadingFriendWords, setIsLoadingFriendWords] = useState<boolean>(false);

    // My List Filters/Sort
    const [myListFilter, setMyListFilter] = useState<string>('');
    const [myListSort, setMyListSort] = useState<'newest' | 'oldest' | 'alphaAsc' | 'alphaDesc'>('newest');

    // Suggested existing word state
    const [suggestedExistingWord, setSuggestedExistingWord] = useState<{ word: string; definition: string; translation: string; addedCount: number } | null>(null);

    // State for LLM features on individual words
    const [wordGeneratedSentences, setWordGeneratedSentences] = useState<Map<string, unknown>>(new Map());
    const [wordSynonymAntonyms, setWordSynonymAntonyms] = useState<Map<string, { synonyms: string[]; antonyms: string[] }>>(new Map());
    const [wordLLMLoading, setWordLLMLoading] = useState<Map<string, string>>(new Map());

    // Show modal function
    const showInfoModal = (content: string): void => {
        setModalContent(content);
        setShowModal(true);
    };

    // Function to handle automatic translation and definition
    const getTranslationAndDefinition = async (): Promise<void> => {
        if (!wordInput.trim()) {
            showInfoModal("Vui lòng nhập một từ để dịch.");
            return;
        }

        setIsLoadingTranslation(true);
        setTranslationResult({ definition: '', translation: '' });
        setSuggestedExistingWord(null);

        const trimmedWord = wordInput.trim().toLowerCase();

        // Simulate checking if word already exists
        if (trimmedWord === 'mockword') {
            setSuggestedExistingWord({
                word: trimmedWord,
                definition: 'A word used for demonstration purposes.',
                translation: 'Một từ dùng để minh họa.',
                addedCount: 5
            });
            setTranslationResult({ definition: 'A word used for demonstration purposes.', translation: 'Một từ dùng để minh họa.' });
            setIsLoadingTranslation(false);
            return;
        }

        const prompt = `Provide the English definition and a common translation in Spanish for the word '${trimmedWord}'. Format the output as a JSON object with 'definition' and 'translation' keys. For example: {"definition": "a small, round, red fruit", "translation": "manzana"}.`;

        const schema = {
            type: "OBJECT",
            properties: {
                definition: { type: "STRING" },
                translation: { type: "STRING" }
            },
            required: ["definition", "translation"]
        };

        const result: unknown = await callGeminiAPI(prompt, schema);

        if (result && typeof result === 'object' && 'definition' in result && 'translation' in result) {
            setTranslationResult(result as { definition: string; translation: string });
        } else {
            showInfoModal("Không thể truy xuất bản dịch và định nghĩa. Vui lòng thử lại.");
            setTranslationResult({ definition: 'Không tìm thấy', translation: 'Không tìm thấy' });
        }
        setIsLoadingTranslation(false);
    };

    // Function to save word to 'My List'
    const saveWord = async (): Promise<void> => {
        if (!wordInput.trim() || !translationResult.definition || !translationResult.translation) {
            showInfoModal("Vui lòng dịch từ trước.");
            return;
        }

        const newWord = {
            id: `local_${Date.now()}`,
            word: wordInput.trim(),
            definition: translationResult.definition,
            translation: translationResult.translation,
            timestamp: Date.now()
        };

        setMyWords(prevWords => [...prevWords, newWord]);
        showInfoModal("Từ đã được lưu thành công vào danh sách của bạn!");
        setWordInput('');
        setTranslationResult({ definition: '', translation: '' });
        setSuggestedExistingWord(null);
    };

    // Function to delete word from 'My List'
    const deleteWord = async (id: string): Promise<void> => {
        setMyWords(prevWords => prevWords.filter(word => word.id !== id));
        showInfoModal("Từ đã được xóa thành công!");
    };

    // Function to get word suggestions by topic
    const getWordSuggestions = async (): Promise<void> => {
        if (!suggestionTopic.trim()) {
            showInfoModal("Vui lòng nhập một chủ đề để gợi ý.");
            return;
        }

        setIsLoadingSuggestions(true);
        setSuggestedWords([]);

        const prompt = `Suggest 10 English vocabulary words related to the topic '${suggestionTopic.trim()}'. Format the output as a JSON array of strings, e.g., ["word1", "word2"].`;

        const schema = {
            type: "ARRAY",
            items: { type: "STRING" }
        };

        const result: unknown = await callGeminiAPI(prompt, schema);

        if (Array.isArray(result) && result.length > 0) {
            const wordsWithRatings = result.map(word => ({
                word,
                upvotes: Math.floor(Math.random() * 100),
                downvotes: Math.floor(Math.random() * 20),
                definition: 'Mock definition',
                translation: 'Mock translation'
            }));
            setSuggestedWords(wordsWithRatings);
        } else {
            showInfoModal("Không thể nhận gợi ý cho chủ đề này. Vui lòng thử một chủ đề khác.");
            setSuggestedWords([]);
        }
        setIsLoadingSuggestions(false);
    };

    // Function to handle upvote/downvote for a suggested word
    const handleWordRating = async (word: string, type: string): Promise<void> => {
        showInfoModal(`Bạn đã ${type === 'upvote' ? 'upvoted' : 'downvoted'} từ '${word}'. (Chức năng đánh giá được mô phỏng)`);
    };

    // Function to fetch leaderboard data
    const fetchLeaderboard = useCallback(async (): Promise<void> => {
        setIsLoadingLeaderboard(true);
        await new Promise(resolve => setTimeout(resolve, 500));

        let data: LeaderboardUser[] | LeaderboardWord[] = [];
        if (leaderboardType === 'topUsers') {
            data = [
                { id: 'user1', username: 'Alice', wordCount: 150 },
                { id: 'user2', username: 'Bob', wordCount: 120 },
                { id: 'user3', username: 'Charlie', wordCount: 100 },
            ];
        } else if (leaderboardType === 'mostAddedWords') {
            data = [
                { word: 'innovation', addedCount: 75, definition: '...', translation: '...' },
                { word: 'sustainability', addedCount: 60, definition: '...', translation: '...' },
                { word: 'collaboration', addedCount: 50, definition: '...', translation: '...' },
            ];
        } else if (leaderboardType === 'mostLikedWords') {
            data = [
                { word: 'resilience', upvotes: 90, definition: '...', translation: '...' },
                { word: 'empathy', upvotes: 85, definition: '...', translation: '...' },
                { word: 'gratitude', upvotes: 80, definition: '...', translation: '...' },
            ];
        }
        setLeaderboardData(data);
        setIsLoadingLeaderboard(false);
    }, [leaderboardType]);

    // Function to add a friend
    const addFriend = async (): Promise<void> => {
        if (!friendInputId?.trim()) {
            showInfoModal("Vui lòng nhập ID người dùng của bạn bè.");
            return;
        }
        if (friendInputId.trim() === MOCK_USER_ID) {
            showInfoModal("Bạn không thể tự thêm mình làm bạn.");
            return;
        }

        if (!MOCK_FRIENDS.includes(friendInputId.trim())) {
            showInfoModal("ID người dùng không tìm thấy. Vui lòng đảm bảo ID chính xác.");
            return;
        }

        const newFriendName = `Bạn_${friendInputId.trim().substring(0, 5)}`;
        setFriendsList(prev => [...prev, { id: friendInputId.trim(), friendId: friendInputId.trim(), friendName: newFriendName }]);
        showInfoModal(`Đã thêm ${newFriendName} làm bạn!`);
        setFriendInputId('');
    };

    // Function to view a friend's words
    const viewFriendWords = async (friendId: string, friendName: string): Promise<void> => {
        setIsLoadingFriendWords(true);
        setFriendWordsList([]);
        setViewingFriendWords({ id: friendId, name: friendName });
        setCurrentView('viewFriendWords');

        await new Promise(resolve => setTimeout(resolve, 700));
        let mockFriendWords: WordItem[] = [];
        if (friendId === 'mockFriend456') {
            mockFriendWords = [
                { id: 'f456_w1', word: 'Ambivalent', definition: 'Having mixed feelings or contradictory ideas about something or someone.', translation: 'Mâu thuẫn trong cảm xúc', timestamp: 1679000000000 },
                { id: 'f456_w2', word: 'Ubiquitous', definition: 'Present, appearing, or found everywhere.', translation: 'Có mặt khắp nơi', timestamp: 1679100000000 },
            ];
        } else if (friendId === 'mockFriend789') {
            mockFriendWords = [
                { id: 'f789_w1', word: 'Conundrum', definition: 'A confusing and difficult problem or question.', translation: 'Câu hỏi khó, điều bí ẩn', timestamp: 1679200000000 },
            ];
        } else {
            mockFriendWords = [{ id: 'no_words', word: 'No words found', definition: 'This friend has no words added or list is private.', translation: 'Bạn này chưa thêm từ nào hoặc danh sách riêng tư.', timestamp: Date.now() }];
        }
        setFriendWordsList(mockFriendWords);
        setIsLoadingFriendWords(false);
    };

    // Function to generate example sentences using LLM
    const generateExampleSentence = async (word: string, itemId: string): Promise<void> => {
        setWordLLMLoading(prev => new Map(prev).set(itemId, 'sentence'));
        const prompt = `Generate one concise example sentence using the word "${word}". Only provide the sentence.`;

        const result: unknown = await callGeminiAPI(prompt);

        if (result) {
            setWordGeneratedSentences(prev => new Map(prev).set(itemId, result));
        } else {
            setWordGeneratedSentences(prev => new Map(prev).set(itemId, "Could not generate an example sentence."));
        }
        setWordLLMLoading(prev => {
            const newMap = new Map(prev);
            newMap.delete(itemId);
            return newMap;
        });
    };

    // Function to get synonyms and antonyms using LLM
    const getSynonymsAntonyms = async (word: string, itemId: string): Promise<void> => {
        setWordLLMLoading(prev => new Map(prev).set(itemId, 'synonymAntonym'));
        const prompt = `Provide 3 synonyms and 3 antonyms for the word "${word}". Format the output as a JSON object with 'synonyms' and 'antonyms' keys, each containing an array of strings. Example: {"synonyms": ["happy", "joyful"], "antonyms": ["sad", "unhappy"]}.`;

        const schema = {
            type: "OBJECT",
            properties: {
                synonyms: { type: "ARRAY", items: { type: "STRING" } },
                antonyms: { type: "ARRAY", items: { type: "STRING" } }
            },
            required: ["synonyms", "antonyms"]
        };

        const result: unknown = await callGeminiAPI(prompt, schema);

        if (result && typeof result === 'object' && 'synonyms' in result && 'antonyms' in result) {
            setWordSynonymAntonyms(prev => new Map(prev).set(itemId, result as { synonyms: string[]; antonyms: string[] }));
        } else {
            setWordSynonymAntonyms(prev => new Map(prev).set(itemId, { synonyms: ["Not found"], antonyms: ["Not found"] }));
        }
        setWordLLMLoading(prev => {
            const newMap = new Map(prev);
            newMap.delete(itemId);
            return newMap;
        });
    };

    // Effect to refetch leaderboard when leaderboard type changes
    useEffect(() => {
        if (currentView === 'leaderboard') {
            fetchLeaderboard();
        }
    }, [leaderboardType, currentView, fetchLeaderboard]);

    return {
        // State
        currentView,
        setCurrentView,
        wordInput,
        setWordInput,
        translationResult,
        isLoadingTranslation,
        myWords,
        suggestionTopic,
        setSuggestionTopic,
        suggestedWords,
        isLoadingSuggestions,
        showModal,
        setShowModal,
        modalContent,
        leaderboardData,
        isLoadingLeaderboard,
        leaderboardType,
        setLeaderboardType,
        friendInputId,
        setFriendInputId,
        friendsList,
        viewingFriendWords,
        friendWordsList,
        isLoadingFriendWords,
        myListFilter,
        setMyListFilter,
        myListSort,
        setMyListSort,
        suggestedExistingWord,
        wordGeneratedSentences,
        wordSynonymAntonyms,
        wordLLMLoading,
        
        // Functions
        showInfoModal,
        getTranslationAndDefinition,
        saveWord,
        deleteWord,
        getWordSuggestions,
        handleWordRating,
        fetchLeaderboard,
        addFriend,
        viewFriendWords,
        generateExampleSentence,
        getSynonymsAntonyms,
        
        // Constants
        userId: MOCK_USER_ID,
        username: MOCK_USERNAME
    };
}; 