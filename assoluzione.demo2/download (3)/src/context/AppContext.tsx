'use client';

import React, { createContext, useState, useCallback } from 'react';
import type { AppContextType, ConfessionState, Language, Profile, Answer } from '@/lib/types';
import type { PersonalizedGuiltReductionOutput } from '@/ai/flows/personalized-guilt-reduction';
import { getAuth, signOut } from 'firebase/auth';


const initialState: ConfessionState = {
  language: 'it',
  profile: null,
  answers: {},
  totalScore: 0,
  aiResponse: null,
  isLoadingAi: false,
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<ConfessionState>(initialState);

  const setLanguage = useCallback((lang: Language) => {
    setState((prevState) => ({ ...prevState, language: lang }));
  }, []);

  const setProfile = useCallback((profile: Profile | null) => {
    setState((prevState) => ({ ...prevState, profile }));
  }, []);

  const addAnswer = useCallback((answer: Answer) => {
    setState((prevState) => {
      const newAnswers = { ...prevState.answers, [answer.questionId]: answer };
      const newTotalScore = Object.values(newAnswers).reduce((sum, ans) => sum + ans.score, 0);
      return {
        ...prevState,
        answers: newAnswers,
        totalScore: newTotalScore,
      };
    });
  }, []);

  const setAiResponse = useCallback((response: PersonalizedGuiltReductionOutput | null) => {
    setState(prevState => ({ ...prevState, aiResponse: response }));
  }, []);
  
  const setIsLoadingAi = useCallback((loading: boolean) => {
    setState(prevState => ({ ...prevState, isLoadingAi: loading }));
  }, []);

  const resetState = useCallback(() => {
    try {
      const auth = getAuth();
      signOut(auth);
    } catch (e) {
      console.error("Error signing out: ", e)
    }
    setState(initialState);
  }, []);

  const value = {
    ...state,
    setLanguage,
    setProfile,
    addAnswer,
    setAiResponse,
    setIsLoadingAi,
    resetState,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
    