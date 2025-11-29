import { useState } from 'react';

export default function useSearchHistory() {
  const [history, setHistory] = useState<string[]>(() => {
    const stored = localStorage.getItem('searchHistory');
    return stored ? JSON.parse(stored) : [];
  });

  const addHistory = (term: string) => {
    setHistory(prev => {
      const updated = [term, ...prev.filter(t => t !== term)];
      localStorage.setItem('searchHistory', JSON.stringify(updated));
      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('searchHistory');
  };

  const deleteHistoryItem = (term: string) => {
    setHistory(prev => {
      const updated = prev.filter(t => t !== term);
      localStorage.setItem('searchHistory', JSON.stringify(updated));
      return updated;
    });
  };

  return { history, addHistory, clearHistory, deleteHistoryItem };
}
