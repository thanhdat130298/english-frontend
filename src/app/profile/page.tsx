"use client";
import React from 'react';
import { Profile } from '../../components';
import { useVocabApp } from '../../hooks/useVocabApp';

export default function ProfilePage() {
  const app = useVocabApp();
  return (
    <Profile
      userId={app.userId}
      username={app.username}
      wordCount={app.myWords.length}
      onBackToApp={() => {}}
    />
  );
} 