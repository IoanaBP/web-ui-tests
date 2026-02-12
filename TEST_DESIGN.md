# TEST_DESIGN

## Why this structure?
- I used a **Page Object Model (POM)** to separate test intent from page selectors/actions.
- This keeps specs readable and makes maintenance easier: if the UI changes, updates are mostly isolated to `cypress/pages/*`.
- Fixtures and custom commands reduce duplication and improve consistency across tests.

## What I would add with 2 more hours?
- Add `cy.intercept()` + explicit waits for network calls to reduce flakiness (especially for the shopping flow).
- Improve selector strategy (prefer stable attributes, reduce reliance on text/CSS where possible).
- Add a simple CI pipeline (GitHub Actions) to run `cypress run` on every push/PR.
- Add reporting (screenshots on failure + junit/mochawesome report).

## Easy vs Fragile
**Easy to maintain**
- Visibility checks, basic content assertions, URL/domain validation (usually stable).

**Fragile to maintain**
- CSS assertions (font size/weight) and dynamic marketing counters (prone to redesigns).
- Retail/shopping flows (popups, changing markup, dynamic pricing).

**Mitigation**
- Keep selectors in POM, use fixtures for expected data, and prefer intercept-based waits over hard sleeps.
