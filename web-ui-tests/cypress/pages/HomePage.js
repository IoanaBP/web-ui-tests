class HomePage {
  visit() {
    cy.visit("https://airportlabs.com/", { failOnStatusCode: false });
  }

  sectionTitle(text) {
    return cy.contains("h1, h2, h3", text, { matchCase: false });
  }

  socialLink(domain) {
    return cy.get(`a[href*="${domain}"]`).first();
  }

  logo() {
    return cy.get("img").first();
  }
}

export default new HomePage();
