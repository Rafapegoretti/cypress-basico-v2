Cypress.Commands.add('fillMandatoryFieldsAndSubmit', function () {
    cy.get('#firstName').type('Rafael')
    cy.get('#lastName').type('Pegoretti')
    cy.get('#email').type('rafael@pegoretti.com')
    cy.get('#open-text-area').type('Teste')
    cy.get('.button[type="submit"]').click()
})