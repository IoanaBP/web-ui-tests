Cypress.Commands.add("clickLinkAndVerifyDomain", (link, domain) => {
  link.should("have.attr", "href").then($a => {
    if ($a.attr("target")) $a.removeAttr("target");
  });
  link.click({ force: true });
  cy.location("href").should("include", domain);
});
