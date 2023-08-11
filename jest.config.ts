export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  clearMocks: true,
  extensionsToTreatAsEsm: [".ts"],
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  verbose: true,
};