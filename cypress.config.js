const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    
      "chromeWebSecurity": false,
      "env": {
        "host": "http://localhost:3000",
        "email": "user@test.fr",
        "password": "user@test.fr",
        "paypalUsername": "sb-wgprh8470180@personal.example.com",
        "paypalPassword": "D\"L2&T5t"
      },
    
      "video": true,
      "screenshotOnRunFailure": false,
      "defaultCommandTimeout": 5000,
      "pageLoadTimeout": 120000,
      "e2e": {
        "defaultCommandTimeout": 10000,
        "slowTestThreshold": 5000
      },
      "component": {
        "slowTestThreshold": 150
      }
    
    
  },
});
