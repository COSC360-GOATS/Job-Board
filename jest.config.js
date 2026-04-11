export default {
  projects: [
    {
      displayName: 'backend',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/testing/backend/**/*.test.js'],
      collectCoverageFrom: ['server/services/**/*.js'],
    },
    {
      displayName: 'frontend',
      testEnvironment: 'jsdom',
      roots: ['<rootDir>/testing/frontend'],
      setupFilesAfterEnv: ['<rootDir>/testing/setupTests.js'],
      transform: {
        '^.+\\.jsx$': 'babel-jest',
      },
      extensionsToTreatAsEsm: ['.jsx'],
      moduleFileExtensions: ['js', 'jsx', 'json'],
    },
  ],
};
