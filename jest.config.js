module.exports = {
  transform: {
    "^.+\\.jsx?$": "./jest-transformer.js"
  },
  // Set resetMocks: true
  // This clears mock state + implementation between each test() statement
  resetMocks: true,
  // Set resetModules: false
  // Setting to true will cause issues with React Testing Libray cleanup &
  // React instances for Hooks
  // Manually isolate instead, if needing to clear module state between tests
  // https://jestjs.io/docs/en/jest-object#jestisolatemodulesfn
  resetModules: false,
  globals: {
    __DEV__: true
  }
};
