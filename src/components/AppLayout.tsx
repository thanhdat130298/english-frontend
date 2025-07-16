"use client";
import React from 'react';
import Navigation from './Navigation';
import { useVocabApp } from '../hooks/useVocabApp';
import '../styles/main.scss';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const app = useVocabApp();
  
  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-sans bg-primary">
      <Navigation myWordsCount={app.myWords.length} />
      <main className="flex-grow flex flex-col p-4 sm:p-6 lg:p-8 bg-white lg:rounded-r-xl rounded-b-xl lg:rounded-bl-none shadow-2xl overflow-y-auto">
        <div className="w-full max-w-2xl mx-auto flex-grow flex flex-col">
          {children}
        </div>
      </main>
    </div>
  );
}; 