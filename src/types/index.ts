// Core Data Types
export interface WordItem {
    id: string;
    word: string;
    definition: string;
    translation: string;
    timestamp: number;
}

export interface SuggestedWord {
    word: string;
    upvotes: number;
    downvotes: number;
    definition: string;
    translation: string;
}

export interface FriendItem {
    id: string;
    friendId: string;
    friendName: string;
}

export interface LeaderboardUser {
    id: string;
    username: string;
    wordCount: number;
}

export interface LeaderboardWord {
    word: string;
    addedCount?: number;
    upvotes?: number;
    downvotes?: number;
    definition?: string;
    translation?: string;
}

export interface ViewingFriendWords {
    id: string;
    name: string;
}

// Component Props Types
export interface CustomModalProps {
    show: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
    showCancel?: boolean;
}

export interface WordItemProps {
    item: WordItem;
    isFriendView?: boolean;
    onDelete?: (id: string) => void;
    onGenerateSentence?: (word: string, itemId: string) => void;
    onGetSynonymsAntonyms?: (word: string, itemId: string) => void;
    wordGeneratedSentences?: Map<string, any>;
    wordSynonymAntonyms?: Map<string, { synonyms: string[]; antonyms: string[] }>;
    wordLLMLoading?: Map<string, string>;
}

export interface NavigationProps {
    currentView: string;
    onViewChange: (view: string) => void;
    myWordsCount: number;
}

export interface AddWordProps {
    wordInput: string;
    setWordInput: (value: string) => void;
    translationResult: { definition: string; translation: string };
    isLoadingTranslation: boolean;
    suggestedExistingWord: { word: string; definition: string; translation: string; addedCount: number } | null;
    onTranslate: () => void;
    onSave: () => void;
}

export interface MyListProps {
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

export interface SuggestionsProps {
    topic: string;
    setTopic: (value: string) => void;
    suggestedWords: SuggestedWord[];
    isLoading: boolean;
    onGetSuggestions: () => void;
    onWordRating: (word: string, type: string) => void;
}

export interface LeaderboardProps {
    data: (LeaderboardUser | LeaderboardWord)[];
    type: 'topUsers' | 'mostAddedWords' | 'mostLikedWords';
    setType: (type: 'topUsers' | 'mostAddedWords' | 'mostLikedWords') => void;
    isLoading: boolean;
}

export interface FriendsProps {
    friendInputId: string;
    setFriendInputId: (value: string) => void;
    friendsList: FriendItem[];
    onAddFriend: () => void;
    onViewFriendWords: (friendId: string, friendName: string) => void;
}

export interface ViewFriendWordsProps {
    friendWords: WordItem[];
    viewingFriend: ViewingFriendWords | null;
    isLoading: boolean;
    onBack: () => void;
    wordGeneratedSentences: Record<string, string[]>;
    wordSynonymAntonyms: Record<string, { synonyms: string[]; antonyms: string[] }>;
    wordLLMLoading: Record<string, boolean>;
    onGenerateSentence: (word: string) => void;
    onGetSynonymsAntonyms: (word: string) => void;
}

export interface ProfileProps {
    userId: string;
    username: string;
    wordCount: number;
    onBackToApp: () => void;
}

// API Response Types
export interface GeminiResponse {
    candidates?: Array<{
        content?: {
            parts?: Array<{
                text: string;
            }>;
        };
    }>;
}

export interface ResponseSchema {
    [key: string]: unknown;
}

// View Types
export type AppView = 'addWord' | 'myList' | 'suggestions' | 'leaderboard' | 'friends' | 'viewFriendWords' | 'myProfile';

// Color Theme Type
export interface ColorTheme {
    primary: string;
    secondary: string;
    highlight: string;
    complementary: string;
    tertiary: string;
    darkAccent: string;
}

export * from './word';
export * from './friend';
export * from './leaderboard';
export * from './modal';
export * from './view'; 