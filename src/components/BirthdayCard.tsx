'use client';

import React, { useState } from 'react';
import { Birthday, BirthdayWithDaysUntil } from '@/types/birthday';
import { useBirthdays } from '@/context/BirthdayContext';

interface BirthdayCardProps {
  birthday: Birthday | BirthdayWithDaysUntil;
}

export default function BirthdayCard({ birthday }: BirthdayCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { deleteBirthday } = useBirthdays();

  // Check if it's a BirthdayWithDaysUntil
  const isExtendedBirthday = (b: Birthday | BirthdayWithDaysUntil): b is BirthdayWithDaysUntil => {
    return 'daysUntil' in b;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateShort = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'family':
        return '👨‍👩‍👧‍👦';
      case 'friend':
        return '👥';
      case 'colleague':
        return '💼';
      default:
        return '🎂';
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'family':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'friend':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'colleague':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteBirthday(birthday.$id);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting birthday:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const extendedBirthday = isExtendedBirthday(birthday) ? birthday : null;

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between">
          {/* Left side - Main content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-lg">{getCategoryIcon(birthday.category)}</span>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {birthday.name}
              </h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(birthday.category)}`}>
                {birthday.category || 'other'}
              </span>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                📅 {formatDate(birthday.date)}
              </p>
              
              {extendedBirthday && (
                <>
                  {extendedBirthday.isToday ? (
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">🎉</span>
                      <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                        Today is the day!
                      </span>
                      {extendedBirthday.age && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          (Turning {extendedBirthday.age})
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-blue-600 dark:text-blue-400">
                        🗓️ {extendedBirthday.daysUntil} days to go
                      </span>
                      {extendedBirthday.age && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          (Will turn {extendedBirthday.age })
                        </span>
                      )}
                    </div>
                  )}
                </>
              )}

              {birthday.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                  {birthday.description}
                </p>
              )}

              <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                {birthday.reminderDays !== undefined && (
                  <span>🔔 {birthday.reminderDays} days notice</span>
                )}
                {birthday.isRecurring && (
                  <span>🔄 Yearly</span>
                )}
              </div>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-1 ml-4">
            <button
              className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Edit birthday"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Delete birthday"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Special today indicator */}
        {extendedBirthday?.isToday && (
          <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-lg">🎂</span>
              <span className="text-sm font-medium text-green-800 dark:text-green-400">
                Happy Birthday {birthday.name}!
              </span>
              <span className="text-lg">🎉</span>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-sm w-full">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.08 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Delete Birthday
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Are you sure you want to delete <strong>{birthday.name}'s</strong> birthday? This action cannot be undone.
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting...
                    </span>
                  ) : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
