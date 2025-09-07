'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Birthday, CreateBirthday, UpdateBirthday, BirthdayWithDaysUntil } from '@/types/birthday';
import { birthdayService } from '@/services/birthdayService';
import { useAuth } from './AuthContext';

interface BirthdayContextType {
  birthdays: Birthday[];
  upcomingBirthdays: BirthdayWithDaysUntil[];
  loading: boolean;
  error: string | null;
  
  // CRUD operations
  createBirthday: (birthdayData: CreateBirthday) => Promise<Birthday>;
  updateBirthday: (id: string, updates: UpdateBirthday) => Promise<Birthday>;
  deleteBirthday: (id: string) => Promise<void>;
  
  // Utility functions
  refreshBirthdays: () => Promise<void>;
  searchBirthdays: (searchTerm: string) => Promise<Birthday[]>;
  getBirthdaysByCategory: (category: string) => Promise<Birthday[]>;
  getBirthdayStats: () => Promise<any>;
}

const BirthdayContext = createContext<BirthdayContextType | null>(null);

interface BirthdayProviderProps {
  children: ReactNode;
}

export function BirthdayProvider({ children }: BirthdayProviderProps) {
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [upcomingBirthdays, setUpcomingBirthdays] = useState<BirthdayWithDaysUntil[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();

  // Load birthdays when user is available
  useEffect(() => {
    if (user?.$id) {
      refreshBirthdays();
    }
  }, [user?.$id]);

  const refreshBirthdays = async () => {
    if (!user?.$id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const [allBirthdays, upcoming] = await Promise.all([
        birthdayService.getBirthdays(user.$id),
        birthdayService.getUpcomingBirthdays(user.$id, 30)
      ]);
      
      setBirthdays(allBirthdays);
      setUpcomingBirthdays(upcoming);
    } catch (err) {
      console.error('Error loading birthdays:', err);
      setError('Failed to load birthdays');
    } finally {
      setLoading(false);
    }
  };

  const createBirthday = async (birthdayData: CreateBirthday): Promise<Birthday> => {
    if (!user?.$id) throw new Error('User not authenticated');
    
    setLoading(true);
    setError(null);
    
    try {
      const newBirthday = await birthdayService.createBirthday(user.$id, birthdayData);
      await refreshBirthdays(); // Refresh to get updated lists
      return newBirthday;
    } catch (err) {
      console.error('Error creating birthday:', err);
      setError('Failed to create birthday');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateBirthday = async (id: string, updates: UpdateBirthday): Promise<Birthday> => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedBirthday = await birthdayService.updateBirthday(id, updates);
      await refreshBirthdays(); // Refresh to get updated lists
      return updatedBirthday;
    } catch (err) {
      console.error('Error updating birthday:', err);
      setError('Failed to update birthday');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteBirthday = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      await birthdayService.deleteBirthday(id);
      await refreshBirthdays(); // Refresh to get updated lists
    } catch (err) {
      console.error('Error deleting birthday:', err);
      setError('Failed to delete birthday');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const searchBirthdays = async (searchTerm: string): Promise<Birthday[]> => {
    if (!user?.$id) return [];
    
    try {
      return await birthdayService.searchBirthdays(user.$id, searchTerm);
    } catch (err) {
      console.error('Error searching birthdays:', err);
      throw err;
    }
  };

  const getBirthdaysByCategory = async (category: string): Promise<Birthday[]> => {
    if (!user?.$id) return [];
    
    try {
      return await birthdayService.getBirthdaysByCategory(user.$id, category);
    } catch (err) {
      console.error('Error getting birthdays by category:', err);
      throw err;
    }
  };

  const getBirthdayStats = async () => {
    if (!user?.$id) return null;
    
    try {
      return await birthdayService.getBirthdayStats(user.$id);
    } catch (err) {
      console.error('Error getting birthday stats:', err);
      throw err;
    }
  };

  const value: BirthdayContextType = {
    birthdays,
    upcomingBirthdays,
    loading,
    error,
    createBirthday,
    updateBirthday,
    deleteBirthday,
    refreshBirthdays,
    searchBirthdays,
    getBirthdaysByCategory,
    getBirthdayStats,
  };

  return (
    <BirthdayContext.Provider value={value}>
      {children}
    </BirthdayContext.Provider>
  );
}

export function useBirthdays() {
  const context = useContext(BirthdayContext);
  if (!context) {
    throw new Error('useBirthdays must be used within a BirthdayProvider');
  }
  return context;
}
