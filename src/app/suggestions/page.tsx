"use client";
import React from 'react';
import { Suggestions } from '../../components';
import { useVocabApp } from '../../hooks/useVocabApp';

export default function SuggestionsPage() {
  const app = useVocabApp();
  return (
    <Suggestions
      topic={app.suggestionTopic}
      setTopic={app.setSuggestionTopic}
      suggestedWords={app.suggestedWords}
      isLoading={app.isLoadingSuggestions}
      onGetSuggestions={app.getWordSuggestions}
      onWordRating={app.handleWordRating}
    />
  );
} 