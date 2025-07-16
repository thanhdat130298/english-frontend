"use client"
import React from 'react';
import ViewFriendWords from '../../../components/ViewFriendWords';

export default function ViewFriendWordsPage() {
  return <ViewFriendWords friendWords={[]} viewingFriend={null} isLoading={false} onBack={function (): void {
    throw new Error('Function not implemented.');
  } } wordGeneratedSentences={{}} wordSynonymAntonyms={{}} wordLLMLoading={{}} onGenerateSentence={function (): void {
    throw new Error('Function not implemented.');
  } } onGetSynonymsAntonyms={function (): void {
    throw new Error('Function not implemented.');
  } } />;
} 