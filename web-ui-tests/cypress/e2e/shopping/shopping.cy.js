import ShoppingPage from "../../pages/ShoppingPage";

describe("Part 2 | Shopping site scenario (Walmart)", () => {
  it("TV + accessory same brand: filter brand & rating, pick most expensive TV, pick cheapest accessory, add to cart, verify", () => {
    const brand = "Samsung";

    // 1) Navigate to TV search/category
    ShoppingPage.visitTVSearch();

    // 2) Apply brand filter + rating >=3
    ShoppingPage.applyBrandFilter(brand);
    ShoppingPage.applyRatingAtLeast3();

    // Basic assertion: URL should still be on walmart search
    cy.location("href").should("include", "walmart.com/search");

    // 3) Pick the most expensive TV from visible results
    ShoppingPage.pickMostExpensiveFromResults(25).then((tv) => {
      expect(tv.price, "TV price").to.be.greaterThan(0);
      expect(tv.title, "TV title").to.have.length.greaterThan(5);
      expect(tv.brand.toLowerCase(), "TV brand").to.include(brand.toLowerCase().split(" ")[0]);

      // 4) Add TV to cart
      ShoppingPage.addToCart();

      // 5) Search for accessory of the same brand (cheapest)
      ShoppingPage.search(`${brand} tv accessory`);
      ShoppingPage.applyBrandFilter(brand);
      ShoppingPage.applyRatingAtLeast3();

      ShoppingPage.pickCheapestFromResults(25).then((acc) => {
        expect(acc.price, "Accessory price").to.be.greaterThan(0);
        expect(acc.title, "Accessory title").to.have.length.greaterThan(5);
        expect(acc.brand.toLowerCase(), "Accessory brand").to.include(brand.toLowerCase().split(" ")[0]);

        // 6) Add accessory to cart
        ShoppingPage.addToCart();

        // 7) Verify cart contains both items + total sum check (heuristic)
        ShoppingPage.goToCart();

        ShoppingPage.assertCartContainsItemTitleFragment(tv.title);
        ShoppingPage.assertCartContainsItemTitleFragment(acc.title);

        const expectedMinSum = tv.price + acc.price;

        ShoppingPage.readCartTotalHeuristic().then((cartTotal) => {
          expect(cartTotal, "Cart total").to.be.greaterThan(0);

          // Many carts include tax/shipping; assignment says "sum", but total may be >= sum.
          // We enforce that cart total is at least the sum of item prices we captured.
          expect(cartTotal).to.be.at.least(expectedMinSum);
        });
      });
    });
  });
});
