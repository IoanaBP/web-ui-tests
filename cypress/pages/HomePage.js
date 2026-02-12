class HomePage {
  visit() {
    cy.visit("https://airportlabs.com/", { failOnStatusCode: false });
  }

  sectionTitleExact(text) {
    return cy.contains("h1,h2,h3,h4", text, { matchCase: false, timeout: 20000 });
  }

  statLabel(labelText) {
  this.sectionTitleExact("Our Activity in Numbers")
    .scrollIntoView({ block: "center", duration: 500 });

  return cy
    .contains("h4.h4", new RegExp(labelText.replace(/\s+/g, "\\s+"), "i"), { timeout: 20000 })
    .scrollIntoView({ block: "center", duration: 500 })
    .should("exist");
}

  statValueNearLabel(labelText) {
  return this.statLabel(labelText).then(($label) => {
    const $value = $label.prev("h2.h2");
    return cy.wrap($value);
  });
}

  socialLinkByDomain(domainFragment) {
  // scroll to the footer area so icons become visible
  cy.get(".footer", { timeout: 20000 }).scrollIntoView();

  return cy
    .get(`.footer a[href*="${domainFragment}"]`, { timeout: 20000 })
    .first()
    .scrollIntoView()
    .should("be.visible");
}

  logo() {
    return cy.get("header img, img[alt*='logo' i], img[src*='logo' i]").first();
  }

  header() {
    return cy.get("header").first();
  }
}

export default new HomePage();
