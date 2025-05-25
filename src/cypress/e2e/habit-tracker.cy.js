// cypress/e2e/habit-tracker.cy.js

describe('HabitTracker E2E', () => {
    beforeEach(() => {
      cy.clearLocalStorage();
      cy.visit('/habits');
      cy.contains('🎯 Трекер звичок').should('exist');
    });
  
    it('додає нову звичку вручну', () => {
      cy.get('input[placeholder="Нова звичка"]').type('Прогулянка');
      cy.get('button').contains('➕').click();
      cy.contains('Прогулянка').should('exist');
    });
  
    it('додає звичку з рекомендацій', () => {
      cy.get('button').contains('📋').click();
      cy.contains('Пити воду').click();
      cy.get('button').contains('➕').click();
      cy.contains('Пити воду').should('exist');
    });
  
  
    it('показує попередження при кліку не на сьогоднішній день', () => {
      cy.get('input[placeholder="Нова звичка"]').type('Тест');
      cy.get('button').contains('➕').click();
      cy.get('button').contains('◀').click();
      cy.get('.habit-circle[title]').first().click();
      cy.contains('Мітки можна ставити лише за сьогодні').should('exist');
    });
  

  
    it('перемикає тиждень', () => {
      cy.get('input[placeholder="Нова звичка"]').type('Дата');
      cy.get('button').contains('➕').click();
  
      cy.get('strong').then(($before) => {
        const beforeText = $before.text();
        cy.get('button').contains('▶').click();
        cy.get('strong').should(($after) => {
          expect($after.text()).not.to.eq(beforeText);
        });
      });
    });
  

  
    it('рендерить компонент HabitChart', () => {
      cy.contains('📈 Прогрес за тиждень').should('exist');
    });
  });
  