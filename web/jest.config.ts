import type { Config } from 'jest';
import nextJest from 'next/jest';

const createJestConfig = nextJest({ dir: './' });

const customJestConfig: Config = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    
    '^@/(.*)$': '<rootDir>/app/$1',
    '^@features/(.*)$': '<rootDir>/app/features/$1',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

};

export default createJestConfig(customJestConfig);
