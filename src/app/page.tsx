// Import React hooks
"use client"
import React, { useState, useEffect, useCallback } from 'react';
import type { JSX } from 'react';

// Import icons from Ant Design
// Make sure you have installed Ant Design icons: npm install @ant-design/icons
import { 
    PlusOutlined, BarsOutlined, BulbOutlined, TrophyOutlined, TeamOutlined, 
    ArrowLeftOutlined, BookOutlined, UserAddOutlined, EyeOutlined, SearchOutlined, 
    HeartOutlined, CloseOutlined, UserOutlined, MessageOutlined, ReadOutlined 
} from '@ant-design/icons';

// Type definitions
interface WordItem {
    id: string;
    word: string;
    definition: string;
    translation: string;
    timestamp: number;
}

interface SuggestedWord {
    word: string;
    upvotes: number;
    downvotes: number;
    definition: string;
    translation: string;
}

interface FriendItem {
    id: string;
    friendId: string;
    friendName: string;
}

interface LeaderboardUser {
    id: string;
    username: string;
    wordCount: number;
}

interface LeaderboardWord {
    word: string;
    addedCount?: number;
    upvotes?: number;
    downvotes?: number;
    definition?: string;
    translation?: string;
}

interface ViewingFriendWords {
    id: string;
    name: string;
}

interface CustomModalProps {
    show: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
    showCancel?: boolean;
}

// Define the new color palette
const colors = {
    primary: '#9EABA2',
    secondary: '#BDD1C5',
    highlight: '#EECC8C',
    complementary: '#E8B298',
    tertiary: '#D3A29D',
    darkAccent: '#A36361',
};

// Custom Modal Component (instead of alert/confirm)
const CustomModal: React.FC<CustomModalProps> = ({ show, title, message, onConfirm, onCancel, showCancel = false }) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full animate-fadeInUp">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">{title}</h3>
                <p className="text-gray-700 mb-6">{message}</p>
                <div className="flex justify-end space-x-3">
                    {showCancel && onCancel && (
                        <button
                            onClick={onCancel}
                            className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-all duration-200"
                        >
                            Hủy
                        </button>
                    )}
                    <button
                        onClick={onConfirm}
                        className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all duration-200 shadow-md"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

// Helper function to call the Gemini API for text generation
// NOTE: For a real application, you should handle API key securely (e.g., environment variables, backend proxy)
const callGeminiAPI = async (prompt: string, responseSchema: any = null): Promise<any> => {
    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });
    // Replace with your actual Gemini API Key
    const apiKey = "YOUR_GEMINI_API_KEY_HERE";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const headers = { 'Content-Type': 'application/json' };
    const payload: any = { contents: chatHistory };

    if (responseSchema) {
        payload.generationConfig = {
            responseMimeType: "application/json",
            responseSchema: responseSchema
        };
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            const text = result.candidates[0].content.parts[0].text;
            return responseSchema ? JSON.parse(text) : text;
        } else {
            console.error("Gemini API response structure unexpected:", result);
            return null;
        }
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return null;
    }
};

// Main App Component
// Export this as your default component for page.tsx
export default function VocabVaultApp() {
    const [currentView, setCurrentView] = useState<
        'addWord' | 'myList' | 'suggestions' | 'leaderboard' | 'friends' | 'viewFriendWords' | 'myProfile'
    >('addWord');
    const [wordInput, setWordInput] = useState<string>('');
    const [translationResult, setTranslationResult] = useState<{ definition: string; translation: string }>({ definition: '', translation: '' });
    const [isLoadingTranslation, setIsLoadingTranslation] = useState<boolean>(false);

    // Sử dụng mock data cho myWords khi không có Firebase
    const [myWords, setMyWords] = useState<WordItem[]>([
        { id: 'mock1', word: 'Serendipity', definition: 'The occurrence and development of events by chance in a happy or beneficial way.', translation: 'Sự tình cờ may mắn', timestamp: 1678886400000 },
        { id: 'mock2', word: 'Ephemeral', definition: 'Lasting for a very short time.', translation: 'Phù du, chóng tàn', timestamp: 1678972800000 },
        { id: 'mock3', word: 'Mellifluous', definition: '(Of a voice or words) sweet or musical; pleasant to hear.', translation: 'Ngọt ngào, du dương', timestamp: 1679059200000 },
    ]);

    const [suggestionTopic, setSuggestionTopic] = useState<string>('');
    const [suggestedWords, setSuggestedWords] = useState<SuggestedWord[]>([]);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState<boolean>(false);

    // Mock user ID and username
    const userId: string = "mockUserId123";
    const username: string = "DemoUser";

    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalContent, setModalContent] = useState<string>('');

    // Leaderboard State (using mock data)
    const [leaderboardData, setLeaderboardData] = useState<(LeaderboardUser | LeaderboardWord)[]>([]);
    const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState<boolean>(false);
    const [leaderboardType, setLeaderboardType] = useState<'topUsers' | 'mostAddedWords' | 'mostLikedWords'>('topUsers'); // 'topUsers', 'mostAddedWords', 'mostLikedWords'

    // Friends State (using mock data)
    const [friendInputId, setFriendInputId] = useState<string>('');
    const [friendsList, setFriendsList] = useState<FriendItem[]>([
        { id: 'f_mock_a', friendId: 'mockFriend456', friendName: 'Học_Văn_A' },
        { id: 'f_mock_b', friendId: 'mockFriend789', friendName: 'Ngữ_Pháp_B' },
    ]);
    const [isLoadingFriends, setIsLoadingFriends] = useState<boolean>(false);
    const [viewingFriendWords, setViewingFriendWords] = useState<ViewingFriendWords | null>(null);
    const [friendWordsList, setFriendWordsList] = useState<WordItem[]>([]); // Will be mocked dynamically
    const [isLoadingFriendWords, setIsLoadingFriendWords] = useState<boolean>(false);

    // My List Filters/Sort
    const [myListFilter, setMyListFilter] = useState<string>('');
    const [myListSort, setMyListSort] = useState<'newest' | 'oldest' | 'alphaAsc' | 'alphaDesc'>('newest');

    // Suggested existing word state (mocked)
    const [suggestedExistingWord, setSuggestedExistingWord] = useState<{ word: string; definition: string; translation: string; addedCount: number } | null>(null);

    // State for LLM features on individual words
    const [wordGeneratedSentences, setWordGeneratedSentences] = useState<Map<string, string>>(new Map());
    const [wordSynonymAntonyms, setWordSynonymAntonyms] = useState<Map<string, { synonyms: string[]; antonyms: string[] }>>(new Map());
    const [wordLLMLoading, setWordLLMLoading] = useState<Map<string, string>>(new Map());

    // Hiển thị modal tùy chỉnh
    const showInfoModal = (content: string): void => {
        setModalContent(content);
        setShowModal(true);
    };

    // Placeholder for auth state (since Firebase is removed)
    useEffect(() => {
        // In a real Next.js app, this might be handled by an external auth library or context
        console.log("App component mounted and ready. (Firebase removed for page.tsx)");
    }, []);

    // Function to handle automatic translation and definition (uses Gemini API)
    const getTranslationAndDefinition = async (): Promise<void> => {
        if (!wordInput.trim()) {
            showInfoModal("Vui lòng nhập một từ để dịch.");
            return;
        }

        setIsLoadingTranslation(true);
        setTranslationResult({ definition: '', translation: '' });
        setSuggestedExistingWord(null);

        const trimmedWord = wordInput.trim().toLowerCase();

        // Simulate checking if word already exists (no real database check here)
        if (trimmedWord === 'mockword') { // Example of a "known" word
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

        const result = await callGeminiAPI(prompt, schema);

        if (result && result.definition && result.translation) {
            setTranslationResult(result);
        } else {
            showInfoModal("Không thể truy xuất bản dịch và định nghĩa. Vui lòng thử lại.");
            setTranslationResult({ definition: 'Không tìm thấy', translation: 'Không tìm thấy' });
        }
        setIsLoadingTranslation(false);
    };

    // Function to save word to 'My List' (now uses local state/mock)
    const saveWord = async (): Promise<void> => {
        if (!wordInput.trim() || !translationResult.definition || !translationResult.translation) {
            showInfoModal("Vui lòng dịch từ trước.");
            return;
        }

        const newWord = {
            id: `local_${Date.now()}`, // Unique ID for mock data
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

    // Function to delete word from 'My List' (now uses local state/mock)
    const deleteWord = async (id: string, wordToRemove: string): Promise<void> => {
        setMyWords(prevWords => prevWords.filter(word => word.id !== id));
        showInfoModal("Từ đã được xóa thành công!");
    };

    // Function to get word suggestions by topic (uses Gemini API)
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

        const result = await callGeminiAPI(prompt, schema);

        if (Array.isArray(result) && result.length > 0) {
            // For mock, just return words with dummy ratings
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

    // Function to handle upvote/downvote for a suggested word (now mocks behavior)
    const handleWordRating = async (word: string, type: string): Promise<void> => {
        // In a real app, this would update a backend database.
        // For this mock, we just show a modal.
        showInfoModal(`Bạn đã ${type === 'upvote' ? 'upvoted' : 'downvoted'} từ '${word}'. (Chức năng đánh giá được mô phỏng)`);
        // You might want to update the local suggestedWords state here if you want to reflect the change visually without re-fetching from API.
    };


    // Function to fetch leaderboard data (now uses mock data)
    const fetchLeaderboard = async (): Promise<void> => {
        setIsLoadingLeaderboard(true);
        // Simulate API call delay
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
    };

    // Effect to refetch leaderboard when leaderboard type changes
    useEffect(() => {
        if (currentView === 'leaderboard') {
            fetchLeaderboard();
        }
    }, [leaderboardType, currentView]);


    // Function to add a friend (now mocks behavior)
    const addFriend = async (): Promise<void> => {
        if (!friendInputId.trim()) {
            showInfoModal("Vui lòng nhập ID người dùng của bạn bè.");
            return;
        }
        if (friendInputId.trim() === userId) {
            showInfoModal("Bạn không thể tự thêm mình làm bạn.");
            return;
        }

        // Simulate checking if friend exists
        const mockFriends = ['mockFriend456', 'mockFriend789', 'mockFriendABC'];
        if (!mockFriends.includes(friendInputId.trim())) {
            showInfoModal("ID người dùng không tìm thấy. Vui lòng đảm bảo ID chính xác.");
            return;
        }

        const newFriendName = `Bạn_${friendInputId.trim().substring(0, 5)}`; // Generate a mock name
        setFriendsList(prev => [...prev, { id: friendInputId.trim(), friendId: friendInputId.trim(), friendName: newFriendName }]);
        showInfoModal(`Đã thêm ${newFriendName} làm bạn!`);
        setFriendInputId('');
    };

    // Function to view a friend's words (now mocks behavior)
    const viewFriendWords = async (friendId: string, friendName: string): Promise<void> => {
        setIsLoadingFriendWords(true);
        setFriendWordsList([]);
        setViewingFriendWords({ id: friendId, name: friendName });
        setCurrentView('viewFriendWords');

        // Simulate fetching friend's words
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

    // Function to filter and sort My Words
    const getFilteredAndSortedMyWords = useCallback((): WordItem[] => {
        let filteredWords = myWords.filter(item =>
            item.word.toLowerCase().includes(myListFilter.toLowerCase()) ||
            item.definition.toLowerCase().includes(myListFilter.toLowerCase()) ||
            item.translation.toLowerCase().includes(myListFilter.toLowerCase())
        );

        switch (myListSort) {
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
    }, [myWords, myListFilter, myListSort]);

    const filteredAndSortedWords = getFilteredAndSortedMyWords();

    // Function to generate example sentences using LLM
    const generateExampleSentence = async (word: string, itemId: string): Promise<void> => {
        setWordLLMLoading(prev => new Map(prev).set(itemId, 'sentence'));
        const prompt = `Generate one concise example sentence using the word "${word}". Only provide the sentence.`;

        const result = await callGeminiAPI(prompt);

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

        const result = await callGeminiAPI(prompt, schema);

        if (result && (result.synonyms || result.antonyms)) {
            setWordSynonymAntonyms(prev => new Map(prev).set(itemId, result));
        } else {
            setWordSynonymAntonyms(prev => new Map(prev).set(itemId, { synonyms: ["Not found"], antonyms: ["Not found"] }));
        }
        setWordLLMLoading(prev => {
            const newMap = new Map(prev);
            newMap.delete(itemId);
            return newMap;
        });
    };

    // Render function for a word item in My List or Friend's List
    const renderWordItem = (item: WordItem, isFriendView = false): JSX.Element => (
        <li key={item.id} className="p-4 bg-white border border-indigo-200 rounded-lg shadow-md flex flex-col hover:bg-gray-50 transition-colors duration-200" style={{ borderColor: colors.complementary, backgroundColor: 'white' }}>
            <div className="flex-grow">
                <p className="text-xl font-bold text-indigo-800" style={{ color: colors.darkAccent }}>{item.word}</p>
                <p className="text-base text-gray-700 mt-1"><span className="font-semibold">Def:</span> {item.definition}</p>
                <p className="text-base text-gray-600"><span className="font-semibold">Trans:</span> {item.translation}</p>
            </div>
            <div className="flex flex-wrap gap-2 mt-3 justify-end">
                {wordLLMLoading.get(item.id) === 'sentence' ? (
                    <span className="text-sm text-gray-500 flex items-center space-x-1">
                        <svg className="animate-spin h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        <span>Đang tạo...</span>
                    </span>
                ) : (
                    <button
                        onClick={() => generateExampleSentence(item.word, item.id)}
                        className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm flex items-center space-x-1 hover:bg-blue-600 transition-colors duration-200 shadow-sm"
                        style={{ backgroundColor: colors.tertiary, color: 'white' }}
                    >
                        <MessageOutlined style={{ fontSize: '16px' }} /> {/* Ant Design icon */}
                        <span>Ví dụ</span>
                    </button>
                )}

                {wordLLMLoading.get(item.id) === 'synonymAntonym' ? (
                    <span className="text-sm text-gray-500 flex items-center space-x-1">
                        <svg className="animate-spin h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        <span>Đang tạo...</span>
                    </span>
                ) : (
                    <button
                        onClick={() => getSynonymsAntonyms(item.word, item.id)}
                        className="px-3 py-1 bg-green-500 text-white rounded-md text-sm flex items-center space-x-1 hover:bg-green-600 transition-colors duration-200 shadow-sm"
                        style={{ backgroundColor: colors.complementary, color: 'white' }}
                    >
                        <ReadOutlined style={{ fontSize: '16px' }} /> {/* Ant Design icon */}
                        <span>Đồng/Trái nghĩa</span>
                    </button>
                )}
                {!isFriendView && ( // Only show delete button for owner's list
                    <button
                        onClick={() => deleteWord(item.id, item.word)}
                        className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition-colors duration-300 shadow-sm"
                    >
                        Xóa
                    </button>
                )}
            </div>
            {wordGeneratedSentences.get(item.id) && (
                <div className="mt-3 p-3 bg-gray-100 rounded-md border border-gray-200 text-sm">
                    <span className="font-semibold">Câu ví dụ:</span> {wordGeneratedSentences.get(item.id) ?? ''}
                </div>
            )}
            {wordSynonymAntonyms.get(item.id) && (
                <div className="mt-3 p-3 bg-gray-100 rounded-md border border-gray-200 text-sm">
                    <p><span className="font-semibold">Đồng nghĩa:</span> {(wordSynonymAntonyms.get(item.id)?.synonyms ?? []).join(', ')}</p>
                    <p><span className="font-semibold">Trái nghĩa:</span> {(wordSynonymAntonyms.get(item.id)?.antonyms ?? []).join(', ')}</p>
                </div>
            )}
        </li>
    );

    return (
        <div className="min-h-screen flex flex-col lg:flex-row font-sans" style={{ backgroundColor: colors.primary }}>
            <CustomModal
                show={showModal}
                title="Thông báo ứng dụng"
                message={modalContent}
                onConfirm={() => setShowModal(false)}
            />

            {/* Thanh bên trái / Thanh điều hướng */}
            <nav className="bg-indigo-700 text-white p-4 sm:p-6 lg:min-h-screen lg:w-64 flex flex-col items-center lg:rounded-l-xl rounded-t-xl lg:rounded-tr-none shadow-xl mb-4 lg:mb-0" style={{ backgroundColor: colors.darkAccent }}>
                <header className="text-center mb-6 w-full">
                    <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight mt-2 text-white">
                        VocabVault
                    </h1>
                    <p className="text-sm sm:text-base text-indigo-200 mt-1" style={{ color: colors.secondary }}>Mở rộng thế giới của bạn</p>
                </header>

                <div className="flex flex-wrap lg:flex-col justify-center gap-2 w-full">
                    <button
                        onClick={() => { setCurrentView('addWord'); setTranslationResult({ definition: '', translation: '' }); setWordInput(''); }}
                        className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium text-lg text-center transition-all duration-300 transform hover:scale-105 shadow-md
                            ${currentView === 'addWord' ? `bg-[${colors.tertiary}] text-white` : `bg-[${colors.darkAccent}] text-[${colors.secondary}] hover:bg-[${colors.tertiary}]`}`}
                        style={{ backgroundColor: currentView === 'addWord' ? colors.tertiary : colors.darkAccent, color: currentView === 'addWord' ? 'white' : colors.secondary }}
                    >
                        <PlusOutlined style={{ fontSize: '20px' }} /> {/* Ant Design Icon */}
                        <span>Thêm từ</span>
                    </button>
                    <button
                        onClick={() => setCurrentView('myList')}
                        className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium text-lg text-center transition-all duration-300 transform hover:scale-105 shadow-md
                            ${currentView === 'myList' ? `bg-[${colors.tertiary}] text-white` : `bg-[${colors.darkAccent}] text-[${colors.secondary}] hover:bg-[${colors.tertiary}]`}`}
                        style={{ backgroundColor: currentView === 'myList' ? colors.tertiary : colors.darkAccent, color: currentView === 'myList' ? 'white' : colors.secondary }}
                    >
                        <BarsOutlined style={{ fontSize: '20px' }} /> {/* Ant Design Icon */}
                        <span>Danh sách của tôi ({myWords.length})</span>
                    </button>
                    <button
                        onClick={() => setCurrentView('suggestions')}
                        className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium text-lg text-center transition-all duration-300 transform hover:scale-105 shadow-md
                            ${currentView === 'suggestions' ? `bg-[${colors.tertiary}] text-white` : `bg-[${colors.darkAccent}] text-[${colors.secondary}] hover:bg-[${colors.tertiary}]`}`}
                        style={{ backgroundColor: currentView === 'suggestions' ? colors.tertiary : colors.darkAccent, color: currentView === 'suggestions' ? 'white' : colors.secondary }}
                    >
                        <BulbOutlined style={{ fontSize: '20px' }} /> {/* Ant Design Icon */}
                        <span>Gợi ý</span>
                    </button>
                    <button
                        onClick={() => { setCurrentView('leaderboard'); fetchLeaderboard(); }}
                        className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium text-lg text-center transition-all duration-300 transform hover:scale-105 shadow-md
                            ${currentView === 'leaderboard' ? `bg-[${colors.tertiary}] text-white` : `bg-[${colors.darkAccent}] text-[${colors.secondary}] hover:bg-[${colors.tertiary}]`}`}
                        style={{ backgroundColor: currentView === 'leaderboard' ? colors.tertiary : colors.darkAccent, color: currentView === 'leaderboard' ? 'white' : colors.secondary }}
                    >
                        <TrophyOutlined style={{ fontSize: '20px' }} /> {/* Ant Design Icon */}
                        <span>Bảng xếp hạng</span>
                    </button>
                    <button
                        onClick={() => setCurrentView('friends')}
                        className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium text-lg text-center transition-all duration-300 transform hover:scale-105 shadow-md
                            ${currentView === 'friends' ? `bg-[${colors.tertiary}] text-white` : `bg-[${colors.darkAccent}] text-[${colors.secondary}] hover:bg-[${colors.tertiary}]`}`}
                        style={{ backgroundColor: currentView === 'friends' ? colors.tertiary : colors.darkAccent, color: currentView === 'friends' ? 'white' : colors.secondary }}
                    >
                        <TeamOutlined style={{ fontSize: '20px' }} /> {/* Ant Design Icon */}
                        <span>Bạn bè</span>
                    </button>
                </div>

                <footer className="mt-auto text-center text-xs sm:text-sm pt-6" style={{ color: colors.secondary }}>
                    <p>&copy; {new Date().getFullYear()} VocabVault</p>
                </footer>
            </nav>

            {/* Main Content Area */}
            <main className="flex-grow flex flex-col p-4 sm:p-6 lg:p-8 bg-white lg:rounded-r-xl rounded-b-xl lg:rounded-bl-none shadow-2xl overflow-y-auto" style={{ backgroundColor: colors.secondary }}>
                {/* Header within main content area */}
                <div className="w-full mb-6 flex justify-between items-center bg-white p-4 rounded-lg shadow-md" style={{ backgroundColor: colors.highlight }}>
                    <h2 className="text-2xl font-bold text-gray-800">
                        {currentView === 'addWord' && 'Thêm từ mới'}
                        {currentView === 'myList' && 'Danh sách từ vựng của tôi'}
                        {currentView === 'suggestions' && 'Nhận gợi ý từ'}
                        {currentView === 'leaderboard' && 'Bảng xếp hạng'}
                        {currentView === 'friends' && 'Bạn bè của tôi'}
                        {currentView === 'viewFriendWords' && viewingFriendWords && `Từ vựng của ${viewingFriendWords.name}`}
                        {currentView === 'myProfile' && 'Hồ sơ của tôi'}
                    </h2>
                    {userId && (
                        <div
                            className="flex items-center space-x-2 cursor-pointer bg-white py-2 px-4 rounded-full shadow-sm hover:bg-gray-50 transition-colors duration-200"
                            onClick={() => setCurrentView('myProfile')}
                            style={{ backgroundColor: colors.complementary, color: colors.darkAccent }}
                        >
                            <UserOutlined style={{ fontSize: '20px' }} /> {/* Ant Design Icon */}
                            <span className="font-semibold text-sm">{username}</span>
                        </div>
                    )}
                </div>

                <div className="w-full max-w-2xl mx-auto flex-grow flex flex-col">
                    {/* User ID Display in My Profile or when no specific view */}
                    {(currentView === 'myProfile') && (
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 animate-fadeIn space-y-4" style={{ backgroundColor: colors.primary }}>
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Thông tin hồ sơ của bạn</h3>
                            <p className="text-base text-gray-700">
                                <span className="font-bold">ID người dùng:</span> <span className="font-mono bg-gray-100 p-1 rounded-md text-sm break-all select-all">{userId}</span>
                            </p>
                            <p className="text-base text-gray-700">
                                <span className="font-bold">Tên người dùng:</span> <span className="font-mono bg-gray-100 p-1 rounded-md text-sm">{username}</span>
                            </p>
                            <p className="text-base text-gray-700">
                                <span className="font-bold">Số từ đã thêm:</span> <span className="font-mono bg-gray-100 p-1 rounded-md text-sm">{myWords.length}</span>
                            </p>
                            <button
                                onClick={() => setCurrentView('addWord')}
                                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300 shadow-md"
                                style={{ backgroundColor: colors.darkAccent, color: 'white' }}
                            >
                                Quay lại ứng dụng
                            </button>
                        </div>
                    )}

                    {/* Add Word Section */}
                    {currentView === 'addWord' && (
                        <div className="space-y-6 flex-grow flex flex-col justify-center">
                            <div className="flex flex-col sm:flex-row gap-4 items-center">
                                <input
                                    type="text"
                                    value={wordInput}
                                    onChange={(e) => setWordInput(e.target.value)}
                                    placeholder="Nhập từ tiếng Anh"
                                    className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-lg shadow-sm"
                                    style={{ borderColor: colors.complementary }}
                                />
                                <button
                                    onClick={getTranslationAndDefinition}
                                    disabled={isLoadingTranslation}
                                    className="w-full sm:w-auto px-6 py-3 bg-indigo-500 text-white rounded-lg font-semibold text-lg hover:bg-indigo-600 transition-colors duration-300 shadow-md transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                    style={{ backgroundColor: colors.tertiary, color: 'white' }}
                                >
                                    {isLoadingTranslation ? (
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : <BookOutlined style={{ fontSize: '20px' }} />} {/* Ant Design Icon */}
                                    <span>{isLoadingTranslation ? 'Đang dịch...' : 'Dịch & Định nghĩa'}</span>
                                </button>
                            </div>

                            {suggestedExistingWord && (
                                <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200 shadow-inner" style={{ backgroundColor: colors.highlight, borderColor: colors.complementary }}>
                                    <p className="text-md font-semibold text-gray-800 mb-2">
                                        Từ này đã được người khác thêm vào! <span className="font-bold">'{suggestedExistingWord.word}'</span> đã được thêm <span className="font-bold text-lg">{suggestedExistingWord.addedCount}</span> lần.
                                    </p>
                                    <p className="text-base"><span className="font-bold">Định nghĩa:</span> {suggestedExistingWord.definition}</p>
                                    <p className="text-base"><span className="font-bold">Dịch (tiếng Tây Ban Nha):</span> {suggestedExistingWord.translation}</p>
                                </div>
                            )}

                            {translationResult.definition && (
                                <div className="mt-6 p-5 bg-indigo-50 rounded-lg border border-indigo-200 shadow-inner" style={{ backgroundColor: colors.secondary, borderColor: colors.primary }}>
                                    <h3 className="text-xl font-semibold text-indigo-700 mb-2">Kết quả:</h3>
                                    <p className="text-lg mb-2"><span className="font-bold">Định nghĩa:</span> {translationResult.definition}</p>
                                    <p className="text-lg"><span className="font-bold">Dịch (tiếng Tây Ban Nha):</span> {translationResult.translation}</p>
                                    <button
                                        onClick={saveWord}
                                        className="mt-4 w-full px-6 py-3 bg-green-500 text-white rounded-lg font-semibold text-lg hover:bg-green-600 transition-colors duration-300 shadow-md transform hover:scale-105 flex items-center justify-center space-x-2"
                                        style={{ backgroundColor: colors.darkAccent, color: 'white' }}
                                    >
                                        <PlusOutlined style={{ fontSize: '20px' }} /> {/* Ant Design Icon */}
                                        <span>Lưu vào danh sách của tôi</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* My List Section */}
                    {currentView === 'myList' && (
                        <div className="space-y-6 flex-grow">
                            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                                <div className="relative flex-grow">
                                    <input
                                        type="text"
                                        value={myListFilter}
                                        onChange={(e) => setMyListFilter(e.target.value)}
                                        placeholder="Lọc từ..."
                                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-lg shadow-sm"
                                        style={{ borderColor: colors.complementary }}
                                    />
                                    <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /> {/* Ant Design Icon */}
                                </div>
                                <div className="relative">
                                    <select
                                        value={myListSort}
                                        onChange={(e) => setMyListSort(e.target.value as 'newest' | 'oldest' | 'alphaAsc' | 'alphaDesc')}
                                        className="w-full sm:w-auto p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-lg shadow-sm appearance-none bg-white"
                                        style={{ borderColor: colors.complementary }}
                                    >
                                        <option value="newest">Mới nhất</option>
                                        <option value="oldest">Cũ nhất</option>
                                        <option value="alphaAsc">A-Z</option>
                                        <option value="alphaDesc">Z-A</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                    </div>
                                </div>
                            </div>
                            {filteredAndSortedWords.length === 0 ? (
                                <p className="text-center text-lg text-gray-500 italic p-8 rounded-lg" style={{ backgroundColor: colors.primary }}>
                                    Không tìm thấy từ nào phù hợp với tiêu chí của bạn.
                                </p>
                            ) : (
                                <ul className="space-y-4 flex-grow overflow-y-auto">
                                    {filteredAndSortedWords.map((item) => renderWordItem(item))}
                                </ul>
                            )}
                        </div>
                    )}

                    {/* Suggestions Section */}
                    {currentView === 'suggestions' && (
                        <div className="space-y-6 flex-grow">
                            <div className="flex flex-col sm:flex-row gap-4 items-center">
                                <input
                                    type="text"
                                    value={suggestionTopic}
                                    onChange={(e) => setSuggestionTopic(e.target.value)}
                                    placeholder="Ví dụ: Du lịch, Công nghệ, Thực phẩm, Thiên nhiên"
                                    className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-lg shadow-sm"
                                    style={{ borderColor: colors.complementary }}
                                />
                                <button
                                    onClick={getWordSuggestions}
                                    disabled={isLoadingSuggestions}
                                    className="w-full sm:w-auto px-6 py-3 bg-indigo-500 text-white rounded-lg font-semibold text-lg hover:bg-indigo-600 transition-colors duration-300 shadow-md transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                    style={{ backgroundColor: colors.tertiary, color: 'white' }}
                                >
                                    {isLoadingSuggestions ? (
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : <BulbOutlined style={{ fontSize: '20px' }} />} {/* Ant Design Icon */}
                                    <span>{isLoadingSuggestions ? 'Đang tạo...' : 'Lấy gợi ý'}</span>
                                </button>
                            </div>

                            {suggestedWords.length > 0 && (
                                <div className="mt-6 p-5 bg-indigo-50 rounded-lg border border-indigo-200 shadow-inner flex-grow overflow-y-auto" style={{ backgroundColor: colors.primary, borderColor: colors.complementary }}>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">Các từ được gợi ý:</h3>
                                    <ul className="grid grid-cols-1 gap-4">
                                        {suggestedWords.map((item, index) => (
                                            <li key={index} className="bg-white p-4 rounded-md shadow-sm border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center" style={{ borderColor: colors.complementary, backgroundColor: 'white' }}>
                                                <div className="flex-grow">
                                                    <p className="text-xl font-bold text-gray-800">{item.word}</p>
                                                    {item.definition && <p className="text-sm text-gray-700 mt-1"><span className="font-semibold">Định nghĩa:</span> {item.definition}</p>}
                                                    {item.translation && <p className="text-sm text-gray-600"><span className="font-semibold">Dịch:</span> {item.translation}</p>}
                                                </div>
                                                <div className="flex space-x-2 mt-3 sm:mt-0">
                                                    <button
                                                        onClick={() => handleWordRating(item.word, 'upvote')}
                                                        className="px-3 py-1 bg-green-500 text-white rounded-full text-sm flex items-center space-x-1 hover:bg-green-600 transition-colors duration-200 shadow-sm"
                                                    >
                                                        <HeartOutlined style={{ fontSize: '16px' }} /> {/* Ant Design Icon */}
                                                        <span>{item.upvotes}</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleWordRating(item.word, 'downvote')}
                                                        className="px-3 py-1 bg-red-500 text-white rounded-full text-sm flex items-center space-x-1 hover:bg-red-600 transition-colors duration-200 shadow-sm"
                                                    >
                                                        <CloseOutlined style={{ fontSize: '16px' }} /> {/* Ant Design Icon for HeartCrack */}
                                                        <span>{item.downvotes}</span>
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Leaderboard Section */}
                    {currentView === 'leaderboard' && (
                        <div className="space-y-6 flex-grow">
                            <div className="flex justify-center flex-wrap gap-2 mb-6">
                                <button
                                    onClick={() => setLeaderboardType('topUsers')}
                                    className={`px-4 py-2 rounded-full font-medium text-base transition-all duration-300 shadow-md
                                        ${leaderboardType === 'topUsers' ? `bg-[${colors.tertiary}] text-white` : `bg-[${colors.primary}] text-[${colors.darkAccent}] hover:bg-[${colors.tertiary}]`}`}
                                    style={{ backgroundColor: leaderboardType === 'topUsers' ? colors.tertiary : colors.primary, color: leaderboardType === 'topUsers' ? 'white' : colors.darkAccent }}
                                >
                                    Top Users
                                </button>
                                <button
                                    onClick={() => setLeaderboardType('mostAddedWords')}
                                    className={`px-4 py-2 rounded-full font-medium text-base transition-all duration-300 shadow-md
                                        ${leaderboardType === 'mostAddedWords' ? `bg-[${colors.tertiary}] text-white` : `bg-[${colors.primary}] text-[${colors.darkAccent}] hover:bg-[${colors.tertiary}]`}`}
                                    style={{ backgroundColor: leaderboardType === 'mostAddedWords' ? colors.tertiary : colors.primary, color: leaderboardType === 'mostAddedWords' ? 'white' : colors.darkAccent }}
                                >
                                    Most Added Words
                                </button>
                                <button
                                    onClick={() => setLeaderboardType('mostLikedWords')}
                                    className={`px-4 py-2 rounded-full font-medium text-base transition-all duration-300 shadow-md
                                        ${leaderboardType === 'mostLikedWords' ? `bg-[${colors.tertiary}] text-white` : `bg-[${colors.primary}] text-[${colors.darkAccent}] hover:bg-[${colors.tertiary}]`}`}
                                    style={{ backgroundColor: leaderboardType === 'mostLikedWords' ? colors.tertiary : colors.primary, color: leaderboardType === 'mostLikedWords' ? 'white' : colors.darkAccent }}
                                >
                                    Most Liked Words
                                </button>
                            </div>

                            {isLoadingLeaderboard ? (
                                <p className="text-center text-lg text-gray-500 italic p-8 rounded-lg flex items-center justify-center space-x-2" style={{ backgroundColor: colors.primary }}>
                                    <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Đang tải bảng xếp hạng...</span>
                                </p>
                            ) : (
                                leaderboardData.length === 0 ? (
                                    <p className="text-center text-lg text-gray-500 italic p-8 rounded-lg" style={{ backgroundColor: colors.primary }}>Chưa có dữ liệu trên bảng xếp hạng.</p>
                                ) : (
                                    <ul className="space-y-3 flex-grow overflow-y-auto">
                                        {leaderboardData.map((item, index) => {
                                            if (leaderboardType === 'topUsers' && 'id' in item && 'username' in item && 'wordCount' in item) {
                                                const user = item as LeaderboardUser;
                                                return (
                                                    <li key={user.id} className="p-4 bg-white border rounded-lg shadow-md flex justify-between items-center text-lg hover:bg-gray-50 transition-colors duration-200" style={{ borderColor: colors.complementary, backgroundColor: 'white' }}>
                                                        <span className="font-semibold">{index + 1}. {user.username}</span>
                                                        <span className="font-bold text-indigo-600">{user.wordCount} words</span>
                                                    </li>
                                                );
                                            } else if (leaderboardType === 'mostAddedWords' && 'word' in item && 'addedCount' in item) {
                                                const wordItem = item as LeaderboardWord;
                                                return (
                                                    <li key={wordItem.word} className="p-4 bg-white border rounded-lg shadow-md flex justify-between items-center text-lg hover:bg-gray-50 transition-colors duration-200" style={{ borderColor: colors.complementary, backgroundColor: 'white' }}>
                                                        <span className="font-semibold">{index + 1}. {wordItem.word}</span>
                                                        <span className="font-bold text-indigo-600">{wordItem.addedCount} additions</span>
                                                    </li>
                                                );
                                            } else if (leaderboardType === 'mostLikedWords' && 'word' in item && 'upvotes' in item) {
                                                const wordItem = item as LeaderboardWord;
                                                return (
                                                    <li key={wordItem.word} className="p-4 bg-white border rounded-lg shadow-md flex justify-between items-center text-lg hover:bg-gray-50 transition-colors duration-200" style={{ borderColor: colors.complementary, backgroundColor: 'white' }}>
                                                        <span className="font-semibold">{index + 1}. {wordItem.word}</span>
                                                        <span className="font-bold text-indigo-600 flex items-center space-x-1">
                                                            <HeartOutlined style={{ fontSize: '18px' }} />
                                                            <span>{wordItem.upvotes}</span>
                                                        </span>
                                                    </li>
                                                );
                                            } else {
                                                return null;
                                            }
                                        })}
                                    </ul>
                                )
                            )}
                        </div>
                    )}

                    {/* Friends Section */}
                    {currentView === 'friends' && (
                        <div className="space-y-6 flex-grow">
                            <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
                                <input
                                    type="text"
                                    value={friendInputId}
                                    onChange={(e) => setFriendInputId(e.target.value)}
                                    placeholder="Enter friend's User ID"
                                    className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-lg shadow-sm"
                                    style={{ borderColor: colors.complementary }}
                                />
                                <button
                                    onClick={addFriend}
                                    className="w-full sm:w-auto px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold text-lg hover:bg-blue-600 transition-colors duration-300 shadow-md transform hover:scale-105 flex items-center justify-center space-x-2"
                                    style={{ backgroundColor: colors.tertiary, color: 'white' }}
                                >
                                    <UserAddOutlined style={{ fontSize: '20px' }} /> {/* Ant Design Icon */}
                                    <span>Add Friend</span>
                                </button>
                            </div>

                            {friendsList.length === 0 ? (
                                <p className="text-center text-lg text-gray-500 italic p-8 rounded-lg" style={{ backgroundColor: colors.primary }}>
                                    You don't have any friends added yet.
                                </p>
                            ) : (
                                <ul className="space-y-4 flex-grow overflow-y-auto">
                                    {friendsList.map((friend) => (
                                        <li key={friend.id} className="p-4 bg-white border rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-gray-50 transition-colors duration-200" style={{ borderColor: colors.complementary, backgroundColor: 'white' }}>
                                            <div className="flex-grow">
                                                <p className="text-xl font-bold text-indigo-800" style={{ color: colors.darkAccent }}>{friend.friendName}</p>
                                                <p className="text-base text-gray-700 mt-1 break-all">ID: {friend.friendId}</p>
                                            </div>
                                            <button
                                                onClick={() => viewFriendWords(friend.friendId, friend.friendName)}
                                                className="mt-3 sm:mt-0 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors duration-300 shadow-sm text-sm transform hover:scale-105 flex items-center justify-center space-x-2"
                                                style={{ backgroundColor: colors.complementary, color: 'white' }}
                                            >
                                                <EyeOutlined style={{ fontSize: '18px' }} /> {/* Ant Design Icon */}
                                                <span>View Words</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}

                    {/* View Friend's Words Section */}
                    {currentView === 'viewFriendWords' && viewingFriendWords && (
                        <div className="space-y-6 flex-grow">
                            <button
                                onClick={() => setCurrentView('friends')}
                                className="mb-4 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors duration-300 shadow-md flex items-center justify-center space-x-2"
                                style={{ backgroundColor: colors.tertiary, color: 'white' }}
                            >
                                <ArrowLeftOutlined style={{ fontSize: '20px' }} /> {/* Ant Design Icon */}
                                <span>Back to Friends</span>
                            </button>
                            {isLoadingFriendWords ? (
                                <p className="text-center text-lg text-gray-500 italic p-8 rounded-lg flex items-center justify-center space-x-2" style={{ backgroundColor: colors.primary }}>
                                    <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Loading {viewingFriendWords.name}'s words...</span>
                                </p>
                            ) : (
                                friendWordsList.length === 0 ? (
                                    <p className="text-center text-lg text-gray-500 italic p-8 rounded-lg" style={{ backgroundColor: colors.primary }}>
                                        {viewingFriendWords.name} hasn't added any words yet, or their list is private.
                                    </p>
                                ) : (
                                    <ul className="space-y-4 flex-grow overflow-y-auto">
                                        {friendWordsList.map((item) => renderWordItem(item, true))}
                                    </ul>
                                )
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};
