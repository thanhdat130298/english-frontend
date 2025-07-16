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