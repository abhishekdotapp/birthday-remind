import { database } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';
import { Birthday, CreateBirthday, UpdateBirthday, BirthdayWithDaysUntil } from '@/types/birthday';

// Database and Collection IDs - you'll need to create these in your Appwrite console
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const BIRTHDAY_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_BIRTHDAY_COLLECTION_ID!;

class BirthdayService {
  // Create a new birthday
  async createBirthday(userId: string, birthdayData: CreateBirthday): Promise<Birthday> {
    try {
      const response = await database.createDocument(
        DATABASE_ID,
        BIRTHDAY_COLLECTION_ID,
        ID.unique(),
        {
          ...birthdayData,
          userId,
          reminderDays: birthdayData.reminderDays || 1,
          isRecurring: birthdayData.isRecurring !== false, // default to true
          category: birthdayData.category || 'other'
        }
      );
      return response as unknown as Birthday;
    } catch (error) {
      console.error('Error creating birthday:', error);
      throw error;
    }
  }

  // Get all birthdays for a user
  async getBirthdays(userId: string): Promise<Birthday[]> {
    try {
      const response = await database.listDocuments(
        DATABASE_ID,
        BIRTHDAY_COLLECTION_ID,
        [
          Query.equal('userId', userId),
          Query.orderAsc('date')
        ]
      );
      return response.documents as unknown as Birthday[];
    } catch (error) {
      console.error('Error fetching birthdays:', error);
      throw error;
    }
  }

  // Get upcoming birthdays (within next 30 days)
  async getUpcomingBirthdays(userId: string, days: number = 30): Promise<BirthdayWithDaysUntil[]> {
    try {
      const birthdays = await this.getBirthdays(userId);
      const today = new Date();
      
      return birthdays
        .map(birthday => this.calculateDaysUntilBirthday(birthday))
        .filter(birthday => birthday.daysUntil <= days)
        .sort((a, b) => a.daysUntil - b.daysUntil);
    } catch (error) {
      console.error('Error fetching upcoming birthdays:', error);
      throw error;
    }
  }

  // Update a birthday
  async updateBirthday(birthdayId: string, updates: UpdateBirthday): Promise<Birthday> {
    try {
      const response = await database.updateDocument(
        DATABASE_ID,
        BIRTHDAY_COLLECTION_ID,
        birthdayId,
        updates
      );
      return response as unknown as Birthday;
    } catch (error) {
      console.error('Error updating birthday:', error);
      throw error;
    }
  }

  // Delete a birthday
  async deleteBirthday(birthdayId: string): Promise<void> {
    try {
      await database.deleteDocument(
        DATABASE_ID,
        BIRTHDAY_COLLECTION_ID,
        birthdayId
      );
    } catch (error) {
      console.error('Error deleting birthday:', error);
      throw error;
    }
  }

  // Helper function to calculate days until birthday and age
  private calculateDaysUntilBirthday(birthday: Birthday): BirthdayWithDaysUntil {
    const today = new Date();
    const currentYear = today.getFullYear();
    
    // Parse the birthday date
    const [year, month, day] = birthday.date.split('-').map(Number);
    
    // Create birthday date for this year
    let birthdayThisYear = new Date(currentYear, month - 1, day);
    
    // If birthday has passed this year, use next year
    if (birthdayThisYear < today) {
      birthdayThisYear = new Date(currentYear + 1, month - 1, day);
    }
    
    // Calculate days until birthday
    const timeDiff = birthdayThisYear.getTime() - today.getTime();
    const daysUntil = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    // Check if birthday is today
    const isToday = daysUntil === 0;
    
    // Calculate age (if birth year is provided)
    let age: number | undefined;
    if (year && year > 1900) {
      age = currentYear - year;
      if (birthdayThisYear.getFullYear() > currentYear) {
        age -= 1;
      }
    }

    return {
      ...birthday,
      daysUntil,
      isToday,
      age
    };
  }

  // Search birthdays by name
  async searchBirthdays(userId: string, searchTerm: string): Promise<Birthday[]> {
    try {
      const response = await database.listDocuments(
        DATABASE_ID,
        BIRTHDAY_COLLECTION_ID,
        [
          Query.equal('userId', userId),
          Query.search('name', searchTerm)
        ]
      );
      return response.documents as unknown as Birthday[];
    } catch (error) {
      console.error('Error searching birthdays:', error);
      throw error;
    }
  }

  // Get birthdays by category
  async getBirthdaysByCategory(userId: string, category: string): Promise<Birthday[]> {
    try {
      const response = await database.listDocuments(
        DATABASE_ID,
        BIRTHDAY_COLLECTION_ID,
        [
          Query.equal('userId', userId),
          Query.equal('category', category),
          Query.orderAsc('date')
        ]
      );
      return response.documents as unknown as Birthday[];
    } catch (error) {
      console.error('Error fetching birthdays by category:', error);
      throw error;
    }
  }

  // Get birthday statistics
  async getBirthdayStats(userId: string) {
    try {
      const birthdays = await this.getBirthdays(userId);
      const upcoming = await this.getUpcomingBirthdays(userId, 30);
      
      const categories = birthdays.reduce((acc, birthday) => {
        const category = birthday.category || 'other';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        total: birthdays.length,
        upcoming: upcoming.length,
        today: upcoming.filter(b => b.isToday).length,
        categories
      };
    } catch (error) {
      console.error('Error fetching birthday stats:', error);
      throw error;
    }
  }
}

export const birthdayService = new BirthdayService();
