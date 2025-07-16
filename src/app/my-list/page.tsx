"use client";
import React from 'react';
import { MyList } from '../../components';
import { useVocabApp } from '../../hooks/useVocabApp';

export default function MyListPage() {
  const app = useVocabApp();
  return (
    <MyList
      words={app.myWords}
      filter={app.myListFilter}
      setFilter={app.setMyListFilter}
      sort={app.myListSort}
      setSort={app.setMyListSort}
      onDelete={app.deleteWord}
      wordGeneratedSentences={app.wordGeneratedSentences}
      wordSynonymAntonyms={app.wordSynonymAntonyms}
      wordLLMLoading={app.wordLLMLoading}
      onGenerateSentence={app.generateExampleSentence}
      onGetSynonymsAntonyms={app.getSynonymsAntonyms}
    />
  );
} 