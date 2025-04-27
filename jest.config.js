/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
  preset: "ts-jest",
  forceExit: true,
  testMatch: ['**/tests/**/*.test.ts'], // <-- or wherever you put your tests
};
