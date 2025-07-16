"use client";
import React from 'react';
import { Leaderboard } from '../../components';
import { useVocabApp } from '../../hooks/useVocabApp';

export default function LeaderboardPage() {
  const app = useVocabApp();
  return (
    <Leaderboard
      data={app.leaderboardData}
      type={app.leaderboardType}
      setType={app.setLeaderboardType}
      isLoading={app.isLoadingLeaderboard}
    />
  );
} 