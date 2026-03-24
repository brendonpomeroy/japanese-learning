import { useContext } from 'react';
import { GrammarContext } from './GrammarContext';

export const useGrammar = () => {
  const context = useContext(GrammarContext);
  if (!context) {
    throw new Error('useGrammar must be used within a GrammarProvider');
  }
  return context;
};
