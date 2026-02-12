class ShoppingPage {
  // Navigation
  visitTVSearch() {
    cy.visit("https://www.walmart.com/search?q=tv", { failOnStatusCode: false });
    this.dismissPopupsIfAny();
  }

  search(query) {
    cy.visit(`https://www.walmart.com/search?q=${encodeURIComponent(query)}`, { failOnStatusCode: false });
    this.dismissPopupsIfAny();
  }

  goToCart() {
    cy.visit("https://www.walmart.com/cart", { failOnStatusCode: false });
  }

  // Popups / banners
  dismissPopupsIfAny() {
    cy.get("body", { timeout: 20000 }).then(($body) => {
      const buttons = [
        "Accept",
        "I agree",
        "Got it",
        "Continue",
        "No thanks",
        "Not now"
      ];
      buttons.forEach((txt) => {
        const found = $body.find(`button:contains("${txt}")`);
        if (found.length) cy.wrap(found.first()).click({ force: true });
      });
    });
  }

  // Filters
  applyBrandFilter(brand) {
    // Try to expand Brand facet
    cy.contains("h3, button, span", /^Brand$/i).then(($el) => {
      if ($el.is("button")) cy.wrap($el).click({ force: true });
    });

    // Click brand option (label/span/a)
    cy.contains("label, span, a", brand, { matchCase: false })
      .scrollIntoView()
      .click({ force: true });

    // Wait for refresh (in real projects prefer intercept)
    cy.wait(1500);
  }

  applyRatingAtLeast3() {
    // Expand Customer Rating facet if present
    cy.contains("h3, button, span", /Customer Rating/i).then(($el) => {
      if ($el.is("button")) cy.wrap($el).click({ force: true });
    });

    // Click "3 stars & up" style option (best-effort)
    cy.contains("label, span, a", /3\s*stars?/i)
      .scrollIntoView()
      .click({ force: true });

    cy.wait(1500);
  }

  // Results parsing
  productLinks(limit = 20) {
    return cy.get("a[href*='/ip/']").then(($links) => {
      const arr = [...$links].slice(0, limit);
      expect(arr.length).to.be.greaterThan(0);
      return cy.wrap(arr);
    });
  }

  // Extract candidate info from a product tile around an <a href="/ip/...">
  extractCandidateFromLink(aEl) {
    const $a = Cypress.$(aEl);
    const href = $a.attr("href");
    const $tile = $a.closest("div");

    const title = ($a.text() || "").trim() || ($tile.text() || "").trim();
    const priceText =
      $tile.find("[data-automation-id='product-price'], span:contains('$')").first().text().trim() ||
      (($tile.text() || "").match(/\$\s*\d[\d,]*(?:\.\d{2})?/g) || [])[0] ||
      "";

    const price = Number(String(priceText).replace(/[^0-9.]/g, "")) || 0;

    // return minimal candidate; title may be long
    return { href, title, price };
  }

  pickMostExpensiveFromResults(limit = 20) {
    return this.productLinks(limit).then((arr) => {
      const candidates = arr.map((i, el) => this.extractCandidateFromLink(el)).get();
      const filtered = candidates.filter((c) => c.href && c.price > 0);

      expect(filtered.length, "found priced candidates").to.be.greaterThan(0);

      filtered.sort((a, b) => b.price - a.price);
      const pick = filtered[0];

      cy.visit(`https://www.walmart.com${pick.href}`, { failOnStatusCode: false });
      this.dismissPopupsIfAny();
      return this.readPdpInfo();
    });
  }

  pickCheapestFromResults(limit = 20) {
    return this.productLinks(limit).then((arr) => {
      const candidates = arr.map((i, el) => this.extractCandidateFromLink(el)).get();
      const filtered = candidates.filter((c) => c.href && c.price > 0);

      expect(filtered.length, "found priced candidates").to.be.greaterThan(0);

      filtered.sort((a, b) => a.price - b.price);
      const pick = filtered[0];

      cy.visit(`https://www.walmart.com${pick.href}`, { failOnStatusCode: false });
      this.dismissPopupsIfAny();
      return this.readPdpInfo();
    });
  }

  // PDP
  readPdpInfo() {
    const titleChain = cy.get("h1", { timeout: 20000 }).first().invoke("text").then((t) => t.trim());

    const brandChain = cy.get("body").then(($body) => {
      // Try "Brand" field
      const text = $body.text();
      const m = text.match(/Brand\s*[:\-]?\s*([A-Za-z0-9 &.+-]{2,40})/i);
      if (m && m[1]) return m[1].trim();
      return null;
    });

    const priceChain = cy.get("body").invoke("text").then((text) => {
      const match = text.match(/\$\s*\d[\d,]*(?:\.\d{2})?/);
      return match ? Number(match[0].replace(/[^0-9.]/g, "")) : 0;
    });

    return cy.wrap(null).then(() => Promise.all([titleChain, brandChain, priceChain]))
      .then(([title, brandMaybe, price]) => {
        const brand = brandMaybe || (title.split(" ")[0] || "").trim();
        return { title, brand, price };
      });
  }

  addToCart() {
    cy.contains("button", /add to cart/i, { timeout: 20000 })
      .scrollIntoView()
      .click({ force: true });

    cy.wait(1500);
  }

  // Cart verification
  assertCartContainsItemTitleFragment(title, minChars = 12) {
    const frag = (title || "").trim().slice(0, minChars);
    expect(frag.length).to.be.greaterThan(3);
    cy.contains(frag, { matchCase: false }).should("exist");
  }

  readCartTotalHeuristic() {
    return cy.get("body").invoke("text").then((text) => {
      const matches = text.match(/\$\s*\d[\d,]*(?:\.\d{2})?/g) || [];
      const nums = matches.map((m) => Number(m.replace(/[^0-9.]/g, ""))).filter((n) => n > 0);
      const total = nums.sort((a, b) => b - a)[0] || 0;
      return total;
    });
  }
}

export default new ShoppingPage();
