'use client';

import Link from "next/link";

export default function Home() {
  // This is a client component that will be rendered on the client side
  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
      {/* Public section with authentication options */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Birthday Reminder</h1>
          <div className="flex space-x-4">
            <Link 
              href="/signin" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Sign In
            </Link>
            <Link 
              href="/signup" 
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-8">
        <div className="text-center max-w-2xl">
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
            Never forget a birthday again
          </h2>
          <p className="mt-5 text-xl text-gray-500 dark:text-gray-400">
            Keep track of all your friends and family birthdays in one place.
            Get reminders so you never miss an important date.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Get started
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Birthday Reminder. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
