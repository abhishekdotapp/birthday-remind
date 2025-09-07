'use client';

import React, { useState } from 'react';
import { useBirthdays } from '@/context/BirthdayContext';
import BirthdayCard from './BirthdayCard';
import { Birthday, BirthdayWithDaysUntil } from '@/types/birthday';

interface BirthdayListProps {
  showUpcoming?: boolean;
}

export default function BirthdayList({ showUpcoming = false }: BirthdayListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');
  
  const { birthdays, upcomingBirthdays, loading, error } = useBirthdays();

  // Get the birthdays to display
  const displayBirthdays = showUpcoming ? upcomingBirthdays : birthdays;

  // Filter and sort birthdays
  const filteredBirthdays = displayBirthdays
    .filter(birthday => {
      // Search filter
      const matchesSearch = birthday.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (birthday.description?.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Category filter
      const matchesCategory = selectedCategory === 'all' || birthday.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else {
        // Sort by date - upcoming birthdays by daysUntil, regular birthdays by date
        if ('daysUntil' in a && 'daysUntil' in b) {
          const aBirthday = a as BirthdayWithDaysUntil;
          const bBirthday = b as BirthdayWithDaysUntil;
          return aBirthday.daysUntil - bBirthday.daysUntil;
        }
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
    });

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4 animate-pulse">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-40"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-800 dark:text-red-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search birthdays..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex space-x-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Categories</option>
            <option value="family">👨‍👩‍👧‍👦 Family</option>
            <option value="friend">👥 Friends</option>
            <option value="colleague">💼 Colleagues</option>
            <option value="other">🎂 Other</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'name')}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      {searchTerm || selectedCategory !== 'all' ? (
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Showing {filteredBirthdays.length} of {displayBirthdays.length} birthdays
          {searchTerm && ` matching "${searchTerm}"`}
          {selectedCategory !== 'all' && ` in ${selectedCategory}`}
        </div>
      ) : null}

      {/* Birthday Cards */}
      {filteredBirthdays.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 text-6xl">
            {searchTerm || selectedCategory !== 'all' ? '🔍' : '🎂'}
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {searchTerm || selectedCategory !== 'all' 
              ? 'No birthdays found' 
              : showUpcoming 
                ? 'No upcoming birthdays' 
                : 'No birthdays added yet'
            }
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : showUpcoming
                ? 'Great! No birthdays coming up in the next 30 days.'
                : 'Start by adding your first birthday reminder to never miss an important date.'
            }
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredBirthdays.map(birthday => (
            <BirthdayCard key={birthday.$id} birthday={birthday} />
          ))}
        </div>
      )}

      {/* Today's birthdays highlight */}
      {showUpcoming && filteredBirthdays.some(b => 'isToday' in b && b.isToday) && (
        <div className="mt-8">
          <div className="bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 rounded-lg p-1">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-2xl">🎉</span>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Today's Celebrations!
                </h3>
                <span className="text-2xl">🎂</span>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {filteredBirthdays
                  .filter(b => 'isToday' in b && b.isToday)
                  .map(birthday => (
                    <div key={birthday.$id} className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-3 rounded-lg border-2 border-green-200 dark:border-green-700">
                      <BirthdayCard birthday={birthday} />
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
