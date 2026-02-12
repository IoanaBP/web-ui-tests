describe('Shopping Scenario', () => {

  it('Basic shopping flow example', () => {
    cy.visit('https://www.demoblaze.com/');
    cy.contains('Monitors').click();
    cy.get('.card-title').first().click();
    cy.contains('Add to cart').click();
    cy.contains('Cart').click();
    cy.get('.success').should('exist');
  });

});
