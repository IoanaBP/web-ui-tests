import HomePage from "../../pages/HomePage";

describe("Part 1 | AirportLabs Tests", () => {
  beforeEach(() => {
    HomePage.visit();
  });

  it("Scenario 1 | Section title style & responsive", () => {
    const titleText = "Our Activity in Numbers";

    cy.viewport(1280, 720);
    const desktopTitle = HomePage.sectionTitleExact(titleText);
    desktopTitle.should("be.visible");
    cy.expectFontSizePx(desktopTitle);
    cy.expectFontWeightMin(desktopTitle, 300);

    cy.viewport(390, 844);
    const mobileTitle = HomePage.sectionTitleExact(titleText);
    mobileTitle.should("be.visible");
    cy.expectFontSizePx(mobileTitle);
  });

  it("Scenario 2 | Statistic validation (fixture-driven)", () => {
    cy.fixture("activityStats.json").then((data) => {
      const { label, valuePattern, labelCss, valueCss } = data.stat;

      const labelEl = HomePage.statLabel(label);
      labelEl.should("be.visible").and("contain.text", label);
      cy.expectFontWeightMin(labelEl, labelCss["font-weight-min"]);

      const valueEl = HomePage.statValueNearLabel(label);
      valueEl.should("be.visible");
      valueEl.invoke("text").then((txt) => {
        expect(txt).to.include(valuePattern);
      });
      cy.expectFontWeightMin(valueEl, valueCss["font-weight-min"]);
    });
  });

  it("Scenario 3 | Social link validation", () => {
    cy.fixture("activityStats.json").then((data) => {
      const { hrefIncludes, domain } = data.social[0];
      const link = HomePage.socialLinkByDomain(hrefIncludes);

      link.should("be.visible");
      link.should("have.attr", "href").and("include", hrefIncludes);

      cy.clickLinkAndVerifyDomain(link, domain);
    });
  });

  it("Scenario 4 | Logo + negative assertion", () => {
    const logo = HomePage.logo();

    logo.should("be.visible").and(($img) => {
      expect($img[0].naturalWidth).to.be.greaterThan(0);
      expect($img[0].naturalHeight).to.be.greaterThan(0);
    });

    logo.should(($img) => {
      const src = ($img.attr("src") || "").trim();
      expect(src).to.not.equal("");
    });
  });

  it("Scenario 5 | Header visible with navigation", () => {
    HomePage.header().should("be.visible");
    cy.get("header a").filter(":visible").should("have.length.at.least", 1);
  });
});
