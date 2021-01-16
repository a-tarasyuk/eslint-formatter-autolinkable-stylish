module.exports = {
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverageFrom: ['src/**/*.{js,ts}'],
  coverageReporters: ['text-summary', 'lcov'],
  collectCoverage: false,
  testEnvironment: 'node',
  transform: { '^.+\\.ts$': 'ts-jest' },
  testRegex: './tests/.+\\.test\\.ts$',
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json'
    }
  }
}
