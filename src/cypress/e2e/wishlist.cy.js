describe('WishList — всеохоплюючі E2E тести', () => {
  const categories = ['Книги', 'Подорожі', 'Фільми', 'Мрії', 'Покупки'];

  beforeEach(() => {
    cy.visit('/wishlist');
  });

  it('відображає головний екран з усіма категоріями', () => {
    cy.contains('💖 Список бажань').scrollIntoView();
    cy.contains('💖 Список бажань').should('be.visible');

    categories.forEach((label) => {
      cy.contains(label).scrollIntoView();
      cy.contains(label).should('exist');
      cy.contains(label).should('be.visible');
    });
  });

  it('перевіряє відкриття кожної категорії та повернення назад', () => {
    categories.forEach((label) => {
      cy.contains(label).scrollIntoView();
      cy.contains(label).click();

      cy.get('h2').should('contain', label);

      cy.get('button[title="Назад до списку бажань"]').scrollIntoView();
      cy.get('button[title="Назад до списку бажань"]').click();

      cy.contains('💖 Список бажань').scrollIntoView();
      cy.contains('💖 Список бажань').should('be.visible');
    });
  });

  it('перевіряє наявність медіа в кожній плитці', () => {
    cy.get('.category-tile').should('have.length.at.least', 1);
    cy.get('.category-tile').each(($tile) => {
      cy.wrap($tile).find('img, video').should('have.length.greaterThan', 0);
    });
  });

  it('стабільне перемикання між категоріями без збоїв', () => {
    cy.contains('Фільми').scrollIntoView();
    cy.contains('Фільми').click();
    cy.get('h2').should('contain', 'Фільми');

    cy.get('button[title="Назад до списку бажань"]').scrollIntoView();
    cy.get('button[title="Назад до списку бажань"]').click();

    cy.contains('Покупки').scrollIntoView();
    cy.contains('Покупки').click();
    cy.get('h2').should('contain', 'Покупки');

    cy.get('button[title="Назад до списку бажань"]').scrollIntoView();
    cy.get('button[title="Назад до списку бажань"]').click();

    cy.contains('💖 Список бажань').scrollIntoView();
    cy.contains('💖 Список бажань').should('be.visible');
  });

  it('повторне відкриття тієї ж категорії працює коректно', () => {
    cy.contains('Книги').scrollIntoView();
    cy.contains('Книги').click();
    cy.get('h2').should('contain', 'Книги');

    cy.get('button[title="Назад до списку бажань"]').scrollIntoView();
    cy.get('button[title="Назад до списку бажань"]').click();

    cy.contains('Книги').scrollIntoView();
    cy.contains('Книги').click();
    cy.get('h2').should('contain', 'Книги');
  });
});
