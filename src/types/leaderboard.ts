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