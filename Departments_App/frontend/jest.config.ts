import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.(ts|tsx|js|jsx)$': 'ts-jest'
    },
    moduleNameMapper: {
        '\\.(css|sass|scss)$': 'identity-obj-proxy'
    },
    verbose: true,
    collectCoverage: true,
    collectCoverageFrom: ['./src/**/*']
};

export default config;
