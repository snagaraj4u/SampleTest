/**
 * Utility class for generating test data.
 * Provides methods to create random data for testing purposes.
 */
export class TestDataGenerator {
  private static readonly CHARACTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  private static readonly NUMBERS = '0123456789';
  private static readonly SPECIAL_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  static generateRandomString(length: number): string {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += this.CHARACTERS.charAt(Math.floor(Math.random() * this.CHARACTERS.length));
    }
    return result;
  }

  static generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static generateRandomEmail(domain: string = 'test.com'): string {
    const username = this.generateRandomString(8).toLowerCase();
    const timestamp = Date.now();
    return `${username}${timestamp}@${domain}`;
  }

  static generateRandomPhoneNumber(): string {
    const areaCode = this.generateRandomNumber(200, 999);
    const prefix = this.generateRandomNumber(200, 999);
    const lineNumber = this.generateRandomNumber(1000, 9999);
    return `${areaCode}-${prefix}-${lineNumber}`;
  }

  static generateRandomPassword(length: number = 12, includeSpecial: boolean = true): string {
    let chars = this.CHARACTERS + this.NUMBERS;
    if (includeSpecial) {
      chars += this.SPECIAL_CHARS;
    }
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  static generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  static generateRandomDate(startYear: number = 1990, endYear: number = 2024): Date {
    const start = new Date(startYear, 0, 1);
    const end = new Date(endYear, 11, 31);
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

  static formatDate(date: Date, format: string = 'YYYY-MM-DD'): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return format
      .replace('YYYY', String(year))
      .replace('MM', month)
      .replace('DD', day);
  }

  static generateRandomFirstName(): string {
    const firstNames = [
      'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael',
      'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan',
      'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen', 'Daniel',
      'Nancy', 'Matthew', 'Lisa', 'Anthony', 'Betty', 'Mark', 'Margaret',
    ];
    return firstNames[Math.floor(Math.random() * firstNames.length)];
  }

  static generateRandomLastName(): string {
    const lastNames = [
      'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
      'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez',
      'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
      'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez',
    ];
    return lastNames[Math.floor(Math.random() * lastNames.length)];
  }

  static generateRandomFullName(): string {
    return `${this.generateRandomFirstName()} ${this.generateRandomLastName()}`;
  }

  static generateRandomAddress(): {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  } {
    const streets = ['Main St', 'Oak Ave', 'Maple Dr', 'Cedar Ln', 'Pine Rd', 'Elm Blvd'];
    const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia'];
    const states = ['NY', 'CA', 'IL', 'TX', 'AZ', 'PA'];

    return {
      street: `${this.generateRandomNumber(100, 9999)} ${streets[Math.floor(Math.random() * streets.length)]}`,
      city: cities[Math.floor(Math.random() * cities.length)],
      state: states[Math.floor(Math.random() * states.length)],
      zipCode: String(this.generateRandomNumber(10000, 99999)),
      country: 'USA',
    };
  }

  static generateRandomCreditCard(): {
    number: string;
    expiry: string;
    cvv: string;
  } {
    const cardNumber = Array.from({ length: 16 }, () => this.generateRandomNumber(0, 9)).join('');
    const formattedNumber = cardNumber.replace(/(\d{4})/g, '$1 ').trim();
    const expiryMonth = String(this.generateRandomNumber(1, 12)).padStart(2, '0');
    const expiryYear = String(this.generateRandomNumber(25, 30));

    return {
      number: formattedNumber,
      expiry: `${expiryMonth}/${expiryYear}`,
      cvv: String(this.generateRandomNumber(100, 999)),
    };
  }

  static generateTodoItem(): { title: string; completed: boolean } {
    const tasks = [
      'Buy groceries',
      'Complete project report',
      'Schedule meeting',
      'Review pull request',
      'Update documentation',
      'Fix bug in login page',
      'Write unit tests',
      'Deploy to staging',
      'Send weekly report',
      'Prepare presentation',
    ];

    return {
      title: tasks[Math.floor(Math.random() * tasks.length)],
      completed: Math.random() > 0.5,
    };
  }

  static generateMultipleTodoItems(count: number): Array<{ title: string; completed: boolean }> {
    return Array.from({ length: count }, () => this.generateTodoItem());
  }
}

export default TestDataGenerator;
