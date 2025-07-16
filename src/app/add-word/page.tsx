"use client";
import React from 'react';
import AddWord from '../../components/AddWord';

export default function AddWordPage() {
  return <AddWord wordInput={''} setWordInput={function (): void {
    throw new Error('Function not implemented.');
  } } translationResult={{
    definition: '',
    translation: ''
  }} isLoadingTranslation={false} suggestedExistingWord={null} onTranslate={function (): void {
    throw new Error('Function not implemented.');
  } } onSave={function (): void {
    throw new Error('Function not implemented.');
  } } />;
} 