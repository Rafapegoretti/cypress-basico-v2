Cypress._.times(5, () => {
    // O Cypress._ é o "import" do lodash
    it.only('testa a página da política de privacidade de forma independente', () => {
        cy.visit('./src/privacy.html')
        cy.get('#title').should('have.text', 'CAC TAT - Política de privacidade')
        // Teste
    })
})