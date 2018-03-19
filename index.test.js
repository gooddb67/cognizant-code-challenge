const weatherTests = require('./script.js');

test('getWindChill returns an array', () => {
  expect(Array.isArray(weatherTests.getWindChill([1,2,3]))).toBe(true)
})
