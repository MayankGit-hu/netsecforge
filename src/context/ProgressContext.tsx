'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CURRICULUM_TOPICS } from '@/data/curriculum';
import { CERTIFICATIONS } from '@/data/certifications';

interface ProgressContextType {
  completedTopics: string[];
  toggleTopicCompleted: (topicId: string) => void;
  isTopicCompleted: (topicId: string) => boolean;
  completedLabs: string[];
  markLabCompleted: (labId: string) => void;
  isLabCompleted: (labId: string) => boolean;
  getOverallProgress: () => { completedCount: number; totalCount: number; percent: number };
  getTierProgress: (tierId: string) => { completedCount: number; totalCount: number; percent: number };
  getCertReadiness: (certId: string) => number;
  resetProgress: () => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  const [completedLabs, setCompletedLabs] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedTopics = localStorage.getItem('netsecforge_completed_topics');
      const storedLabs = localStorage.getItem('netsecforge_completed_labs');
      if (storedTopics) setCompletedTopics(JSON.parse(storedTopics));
      if (storedLabs) setCompletedLabs(JSON.parse(storedLabs));
    } catch (e) {
      console.error('Failed to load progress from localStorage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('netsecforge_completed_topics', JSON.stringify(completedTopics));
      localStorage.setItem('netsecforge_completed_labs', JSON.stringify(completedLabs));
    } catch (e) {
      console.error('Failed to save progress to localStorage', e);
    }
  }, [completedTopics, completedLabs, isLoaded]);

  const toggleTopicCompleted = (topicId: string) => {
    setCompletedTopics((prev) =>
      prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]
    );
  };

  const isTopicCompleted = (topicId: string) => completedTopics.includes(topicId);

  const markLabCompleted = (labId: string) => {
    setCompletedLabs((prev) => (prev.includes(labId) ? prev : [...prev, labId]));
  };

  const isLabCompleted = (labId: string) => completedLabs.includes(labId);

  const getOverallProgress = () => {
    const totalCount = CURRICULUM_TOPICS.length;
    const completedCount = completedTopics.length;
    const percent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);
    return { completedCount, totalCount, percent };
  };

  const getTierProgress = (tierId: string) => {
    const tierTopics = CURRICULUM_TOPICS.filter((t) => t.tierId === tierId);
    const totalCount = tierTopics.length;
    const completedCount = tierTopics.filter((t) => completedTopics.includes(t.id)).length;
    const percent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);
    return { completedCount, totalCount, percent };
  };

  const getCertReadiness = (certId: string) => {
    const cert = CERTIFICATIONS.find((c) => c.id === certId);
    if (!cert || cert.mappedTopicIds.length === 0) return 0;
    const completedMapped = cert.mappedTopicIds.filter((topicId) => completedTopics.includes(topicId)).length;
    return Math.round((completedMapped / cert.mappedTopicIds.length) * 100);
  };

  const resetProgress = () => {
    setCompletedTopics([]);
    setCompletedLabs([]);
  };

  return (
    <ProgressContext.Provider
      value={{
        completedTopics,
        toggleTopicCompleted,
        isTopicCompleted,
        completedLabs,
        markLabCompleted,
        isLabCompleted,
        getOverallProgress,
        getTierProgress,
        getCertReadiness,
        resetProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
