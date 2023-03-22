/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
import type { Config } from 'jest';

const config: Config = {
    roots: ['../tests'],
    transform: {
        '\\.[jt]sx?$': [
            'ts-jest',
            {
                useESM: true
            }
        ]
    },
    moduleNameMapper: {
        '(.+)\\.js': '$1'
    },
    extensionsToTreatAsEsm: ['.ts'],
    verbose: true,
    collectCoverage: true,
    collectCoverageFrom: ['../src/**/*']
};

export default config;
