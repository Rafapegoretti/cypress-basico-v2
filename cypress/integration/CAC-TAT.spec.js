/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function () {
    const THREE_SECONDS_IN_MS = 3000

    beforeEach(() => {
        cy.visit('./src/index.html')
    })

    it('verifica o título da aplicação', function () {
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })

    it('preenche os campos obrigatórios e envia o formulário', function () {

        cy.clock()

        cy.get('#firstName').type('Rafael')
        cy.get('#lastName').type('Pegoretti')
        cy.get('#email').type('rafael@pegoretti.com')
        cy.get('#open-text-area').type('Teste')
        cy.contains('button', 'Enviar').click()
        cy.get('.success').contains('Mensagem enviada com sucesso.').should('be.visible')
        cy.tick(THREE_SECONDS_IN_MS)
        cy.get('.success').contains('Mensagem enviada com sucesso.').should('not.be.visible')
    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function () {
        const longText = 'Lorem ipsum dolor sit amet. Sit earum ratione ut obcaecati omnis et laboriosam molestiae est delectus minus. Aut beatae pariatur eos quibusdam sint aut magni sint. Non consequatur illo nam maiores Quis et porro sint aut nihil reiciendis vel corrupti vitae et excepturi asperiores!'
        cy.clock()

        cy.get('#firstName').type('Rafael')
        cy.get('#lastName').type('Pegoretti')
        cy.get('#email').type('rafael.pegoretti.com')
        cy.get('#open-text-area').type(longText, { delay: 0 })
        cy.contains('button', 'Enviar').click()
        cy.get('.error').contains('Valide os campos obrigatórios!').should('be.visible')
        cy.tick(THREE_SECONDS_IN_MS)
        cy.get('.error').contains('Valide os campos obrigatórios!').should('not.be.visible')
    })

    it('campo telefone continua vazio quando preenchido com valor não numérico', () => {
        cy.get('#phone')
            .type('qweasdzxc')
            .should('have.value', '')
    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
        cy.clock()
        cy.get('#firstName').type('Rafael')
        cy.get('#lastName').type('Pegoretti')
        cy.get('#email').type('rafael@pegoretti.com')
        cy.get('#open-text-area').type('Teste')
        cy.get('#phone-checkbox').check()

        cy.contains('button', 'Enviar').click()
        cy.get('.error').contains('Valide os campos obrigatórios!').should('be.visible')
        cy.tick(THREE_SECONDS_IN_MS)
        cy.get('.error').contains('Valide os campos obrigatórios!').should('not.be.visible')
    })

    it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
        cy.get('#firstName').type('Rafael').should('have.value', 'Rafael').clear().should('have.value', '')
        cy.get('#lastName').type('Pegoretti').should('have.value', 'Pegoretti').clear().should('have.value', '')
        cy.get('#email').type('rafael@pegoretti.com').should('have.value', 'rafael@pegoretti.com').clear().should('have.value', '')
        cy.get('#phone').type('123123123').should('have.value', '123123123').clear().should('have.value', '')
    })

    it('envia o formuário com sucesso usando um comando customizado', () => {
        cy.clock()
        cy.fillMandatoryFieldsAndSubmit()
        cy.get('.success').contains('Mensagem enviada com sucesso.').should('be.visible')
        cy.tick(THREE_SECONDS_IN_MS)
        cy.get('.success').contains('Mensagem enviada com sucesso.').should('not.be.visible')
    })

    it('seleciona um produto (YouTube) por seu texto', () => {
        cy.get('#product')
            .select('YouTube')
            .should('have.value', 'youtube')
    })

    it('seleciona um produto (Mentoria) por seu valor (value)', () => {
        cy.get('#product')
            .select('mentoria')
            .should('have.value', 'mentoria')
    })

    it('seleciona um produto (Blog) por seu índice', () => {
        cy.get('#product')
            .select([1])
            .should('have.value', 'blog')
    })

    it('marca o tipo de atendimento "Feedback"', () => {
        cy.get('input[type="radio"][value="feedback"]').check().should('be.checked')
    })

    it('marca cada tipo de atendimento', () => {
        cy.get('input[type="radio"][value="ajuda"]').check().should('be.checked')
        cy.get('input[type="radio"][value="elogio"]').check().should('be.checked')
        cy.get('input[type="radio"][value="feedback"]').check().should('be.checked')
    })

    it('marca cada tipo de atendimento com each e wrap', () => {
        cy.get('input[type="radio"]')
            .should('have.length', 3)
            .each(($radio) => {
                cy.wrap($radio).check()
                cy.wrap($radio).should('be.checked')
            })
    })

    it('marca ambos checkboxes, depois desmarca o último', () => {
        cy.get('input[type="checkbox"]')
            .check()
            .should('be.checked')
            .last()
            .uncheck()
            .should('not.be.checked')
    })

    it('seleciona um arquivo da pasta fixtures', () => {
        cy.get('#file-upload')
            .should('not.have.value')
            .selectFile('./cypress/fixtures/example.json')
            .should(function ($input) {
                expect($input[0].files[0].name).to.be.equal('example.json')
            })
    })

    it('seleciona um arquivo simulando um drag-and-drop', () => {
        cy.get('#file-upload')
            .should('not.have.value')
            .selectFile('./cypress/fixtures/example.json', { action: 'drag-drop' })
            .should(function ($input) {
                expect($input[0].files[0].name).to.be.equal('example.json')
            })
    })

    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
        cy.fixture('example.json').as('sampleFile')
        cy.get('#file-upload')
            .selectFile('@sampleFile')
            .should(function ($input) {
                expect($input[0].files[0].name).to.be.equal('example.json')
            })
    })

    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
        cy.get('#privacy a').should('have.attr', 'target', '_blank')
    })

    it('acessa a página da política de privacidade removendo o target e então clicando no link', () => {
        cy.get('#privacy a')
            .invoke('removeAttr', 'target')
            .click()
        cy.contains('Talking About Testing').should('be.visible')
    })

    it('exibe e esconde as mensagens de sucesso e erro usando o .invoke()', () => {
        cy.get('.success')
            .should('not.be.visible')
            .invoke('show')
            .should('be.visible')
            .and('contain', 'Mensagem enviada com sucesso.')
            .invoke('hide')
            .should('not.be.visible')
        cy.get('.error')
            .should('not.be.visible')
            .invoke('show')
            .should('be.visible')
            .and('contain', 'Valide os campos obrigatórios!')
            .invoke('hide')
            .should('not.be.visible')
    })

    it('preenche a area de texto usando o comando invoke', () => {
        const longText = Cypress._.repeat('0123456789', 20)

        cy.get('#open-text-area')
            .invoke('val', longText)
            .should('have.value', longText)
    })

    it('faz uma requisição HTTP', () => {
        cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
            .should((response) => {
                const { status, statusText, body } = response // Desestruturação de objeto no javascript
                expect(status).to.be.equal(200)
                expect(statusText).to.be.equal('OK')
                expect(body).to.include('CAC TAT')

            })

    })

    it.only('encontre o gato 🐈', () => {
        cy.get('#cat')
            .invoke('show')
            .should('be.visible')
        cy.get('#title')
            .invoke('text', 'CAT TAT')
        cy.get('#subtitle')
            .invoke('text', 'eu ❤️ gatos')
    })

})