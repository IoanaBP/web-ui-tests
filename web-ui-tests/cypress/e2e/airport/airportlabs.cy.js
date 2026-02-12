import HomePage from '../../pages/HomePage';

describe('AirportLabs Tests', () => {

  beforeEach(() => {
    HomePage.visit();
  });

  it('Verify section title visibility', () => {
    HomePage.sectionTitle('Our Activity in Numbers')
      .should('be.visible');
  });

  it('Data-driven stat test', () => {
    cy.fixture('activityStats.json').then(data => {
      data.forEach(stat => {
        cy.contains(stat.label).should('exist');
      });
    });
  });

  it('Social link test', () => {
    const link = HomePage.socialLink('linkedin.com');
    cy.clickLinkAndVerifyDomain(link, 'linkedin.com');
  });

  it('Logo visible + negative test', () => {
    HomePage.logo().should('be.visible');
    cy.contains('ThisDoesNotExist').should('not.exist');
  });

});
