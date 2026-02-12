class HomePage {
  visit() {
    cy.visit("https://airportlabs.com/", { failOnStatusCode: false });
  }

  sectionTitleExact(text) {
    return cy.contains("h1,h2,h3,h4", text, { matchCase: false, timeout: 20000 }).first()
      .scrollIntoView({block: "center", duration: 500 })
      .should("exist");
  }

  statLabel(labelText) {
    return cy.contains(".elementor-counter-title, [class*='counter-title']", labelText, {
      matchCase: false,
    });
  }

  statValueNearLabel(labelText) {
    return this.statLabel(labelText).then(($label) => {
      const $root = $label.closest(".elementor-counter, section, div");
      const $value = $root.find(
        ".elementor-counter-number, .elementor-counter-number-wrapper, [class*='counter-number']"
      );
      return cy.wrap($value.first());
    });
  }

  socialLinkByDomain(domainFragment) {
    return cy.get(`a[href*="${domainFragment}"]`).filter(":visible").first();
  }

  logo() {
    return cy.get("header img, img[alt*='logo' i], img[src*='logo' i]").first();
  }

  header() {
    return cy.get("header").first();
  }
}

export default new HomePage();
