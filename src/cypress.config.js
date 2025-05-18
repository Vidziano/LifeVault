const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.js',
   // setupNodeEvents(_on, _config) {
      // нічого не потрібно — все в commands.js
  //  },
  },
});
