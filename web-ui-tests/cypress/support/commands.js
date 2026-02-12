Cypress.Commands.add("clickLinkAndVerifyDomain", (linkChainable, expectedDomain) => {
  linkChainable
    .should("be.visible")
    .and("have.attr", "href")
    .then(($a) => {
      if ($a.attr("target")) $a.removeAttr("target");
    });

  linkChainable.click({ force: true });
  cy.location("href", { timeout: 20000 }).should("include", expectedDomain);
});

Cypress.Commands.add("expectFontWeightMin", (chainable, minWeight) => {
  chainable.invoke("css", "font-weight").then((fw) => {
    const w = Number(fw) || (fw === "bold" ? 700 : 400);
    expect(w).to.be.at.least(minWeight);
  });
});

Cypress.Commands.add("expectFontSizePx", (chainable) => {
  chainable.invoke("css", "font-size").then((fs) => {
    expect(fs).to.match(/^\d+px$/);
    const n = Number(fs.replace("px", ""));
    expect(n).to.be.greaterThan(0);
  });
});

/**
 * Utility: parse money like "$1,299.99" -> 1299.99
 */
Cypress.Commands.add("parseMoney", (txt) => {
  const cleaned = String(txt || "").replace(/[^0-9.]/g, "");
  const num = Number(cleaned);
  return cy.wrap(Number.isFinite(num) ? num : 0);
});
