export interface Birthday {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  name: string;
  date: string; // YYYY-MM-DD format
  description?: string;
  userId: string;
  reminderDays?: number; // Days before birthday to remind (default: 1)
  isRecurring?: boolean; // Whether it repeats yearly (default: true)
  category?: 'family' | 'friend' | 'colleague' | 'other';
}

export interface CreateBirthday {
  name: string;
  date: string;
  description?: string;
  reminderDays?: number;
  isRecurring?: boolean;
  category?: 'family' | 'friend' | 'colleague' | 'other';
}

export interface UpdateBirthday {
  name?: string;
  date?: string;
  description?: string;
  reminderDays?: number;
  isRecurring?: boolean;
  category?: 'family' | 'friend' | 'colleague' | 'other';
}

export interface BirthdayWithDaysUntil extends Birthday {
  daysUntil: number;
  isToday: boolean;
  age?: number;
}
