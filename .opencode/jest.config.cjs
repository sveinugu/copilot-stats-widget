module.exports = {
  testEnvironment: 'node',
  // Ensure tests are discovered correctly from repo root
  rootDir: '..',
  testMatch: ['**/.opencode/plugins/*.test.js', '<rootDir>/tests/integration/**/*.test.js'],
}
