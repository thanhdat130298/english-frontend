"use client";
/* eslint-disable */

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
      // @ts-expect-error
      wordGeneratedSentences={app.wordGeneratedSentences}
      // @ts-expect-error
      wordSynonymAntonyms={app.wordSynonymAntonyms}
      // @ts-expect-error
      wordLLMLoading={app.wordLLMLoading}
      // @ts-expect-error
      onGenerateSentence={app.generateExampleSentence}
      // @ts-expect-error
      onGetSynonymsAntonyms={app.getSynonymsAntonyms}
    />
  );
} 