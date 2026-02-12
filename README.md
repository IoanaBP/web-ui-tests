# Web UI Tests

Cypress E2E automation project using:

- Page Object Model (POM)
- Custom Cypress commands
- Fixture-driven data tests
- Negative assertions

## Project Structure
- `cypress/e2e/` → specs (AirportLabs + Shopping)
- `cypress/pages/` → Page Objects (POM)
- `cypress/fixtures/` → fixture data for data-driven tests
- `cypress/support/` → custom commands + global setup
- `cypress.config.js` → Cypress configuration

## Cypress Version
Cypress: 13.6.6 (see 'package.json')

## Install
```bash
npm install

## Run
npx cypress open
npx cypress run
