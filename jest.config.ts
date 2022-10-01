import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    projects: [
        {
            displayName: 'UNIT',
            testEnvironment: 'node',
            testMatch: ['<rootDir>/src/**/*.spec.ts', '<rootDir>/test/index.spec.ts', '<rootDir>/bin/index.spec.js'],
            moduleFileExtensions: ['js', 'ts', 'd.ts'],
            moduleNameMapper: {
                '\\.hbs$': '<rootDir>/src/templates/__mocks__/index.ts',
            },
        },
        {
            displayName: 'E2E',
            testEnvironment: 'node',
            testMatch: [
                '<rootDir>/test/e2e/v2.spec.ts',
                '<rootDir>/test/e2e/v3.spec.ts',
                '<rootDir>/test/e2e/client.spec.ts',
            ],
            modulePathIgnorePatterns: ['<rootDir>/test/e2e/generated'],
        },
    ],
    collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!<rootDir>/src/**/*.d.ts', '!<rootDir>/bin', '!<rootDir>/dist'],
};

export default config;
