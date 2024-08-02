module.exports = {
  transform: {
    '^.+\\.m?js$': 'babel-jest', // Trasforma i file .js e .mjs con Babel
  },
  moduleFileExtensions: ['js', 'mjs'], // Assicurati che Jest riconosca i file .mjs
};
