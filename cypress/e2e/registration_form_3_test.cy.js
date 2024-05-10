beforeEach(() => {
    cy.visit('cypress/fixtures/registration_form_3.html')
})

/*
BONUS TASK: add visual tests for registration form 3
Task list:
* Create test suite for visual tests for registration form 3 (describe block)
* Create tests to verify visual parts of the page:
    * radio buttons and its content
    * dropdown and dependencies between 2 dropdowns:
        * list of cities changes depending on the choice of country
        * if city is already chosen and country is updated, then city choice should be removed
    * checkboxes, their content and links
    * email format
 */

describe('Visual tests', () => {
    it('Check that logo is correct and has correct size', () => {
        cy.log('Will check logo source and size')
        cy.get('img').should('have.attr', 'src').should('include', 'cerebrum_hub_logo')
        cy.get('img').invoke('height').should('be.lessThan', 168)
            .and('be.greaterThan', 165)   
    });

    it('Check that radio button list is correct', () => {
        cy.log('Will check that radio button list is correct')
        cy.get('input[type="radio"]').should('have.length', 4)
        cy.get('input[type="radio"]').next().eq(0).should('have.text','Daily')
        cy.get('input[type="radio"]').next().eq(1).should('have.text','Weekly')
        cy.get('input[type="radio"]').next().eq(2).should('have.text','Monthly')
        cy.get('input[type="radio"]').next().eq(3).should('have.text','Never')
        cy.log('Will check that radio buttons are not checked by default')
        cy.get('input[type="radio"]').eq(0).should('not.be.checked')
        cy.get('input[type="radio"]').eq(1).should('not.be.checked')
        cy.get('input[type="radio"]').eq(2).should('not.be.checked')
        cy.get('input[type="radio"]').eq(3).should('not.be.checked')
        cy.log('Will check that only one radio button can be checked')
        cy.get('input[type="radio"]').eq(0).check().should('be.checked')
        cy.get('input[type="radio"]').eq(1).check().should('be.checked')
        cy.get('input[type="radio"]').eq(0).should('not.be.checked')
    });

    it('Country dropdown is correct and City dropdown is dependant of the Country dropdown menu', () => {
        cy.log('Will check that country dropdown is correct')
        cy.get('#country').select(1).screenshot('Country drop-down')
        cy.screenshot('Full page screenshot')
        cy.get('#country').children().should('have.length', 4)
        cy.get('#country').find('option').should('have.length', 4)
        cy.get('#country').find('option').eq(1).should('have.text', 'Spain')
        cy.log('Will check that cities changes according to the selected country')
        cy.get('#country').select('Spain')
        cy.get('#city').should('contain', 'Malaga')
        cy.get('#city').should('contain', 'Madrid')
        cy.get('#city').should('contain', 'Valencia')
        cy.get('#city').should('contain', 'Corralejo')
        cy.get('#country').select('Austria')
        cy.get('#city').should('contain', 'Vienna')
        cy.get('#city').should('contain', 'Salzburg')
        cy.get('#city').should('contain', 'Innsbruck')
        cy.log('Will check that when a city is chosen and then choosing a new country, the cities change')
        cy.get('#country').select('Spain')
        cy.get('#city').select('Madrid')
        cy.get('h1').contains('Registration').click()
        cy.get('#country').select('Austria')
        cy.get('#city').should('contain', 'Vienna')
        cy.get('#city').should('contain', 'Salzburg')
        cy.get('#city').should('contain', 'Innsbruck')

    });

    it('Check that checkboxes content is correct', () => {
        cy.log('Will check that checkboxes content is correct')
        cy.get('input[type="checkbox"]').should('have.length', 2)
        cy.get('input[type="checkbox"]').parent().should('contain', 'Accept our privacy policy')
        cy.get('input[type="checkbox"]').parent().get('a[href]').should('contain', 'Accept our cookie policy')
        cy.log('All checkboxes can be checked')
        cy.get('input[type="checkbox"][required]').check()
        cy.get('input[type="checkbox"][required]').should('be.checked')
    });

    it('Email should support only email format email@domain.com', () => {
        cy.get('input.email').should('have.attr', 'type', 'email')
    
    })
})

describe('Functional tests', () => {

    it('User can submit form with all fields added', ()=>{
        cy.get('#name').type('Maiakene')
        cy.get('input.email').type('maia@testing.com')
        cy.get('#country').select('Spain')
        cy.get('#city').select('Madrid')
        cy.get('label').contains('Date of registration').siblings('input').click()
        cy.get('label').contains('Date of registration').siblings('input').type('2024-05-10')
        cy.get('label').contains('Date of registration').siblings('input').should('have.value', '2024-05-10')
        cy.get('input[type="radio"]').eq(1).check().should('be.checked')
        cy.get('#birthday').type('1991-05-01')
        cy.get('#birthday').should('have.value', '1991-05-01')
        cy.get('input[type="checkbox"][required]').check()
        cy.get('h1').contains('Registration').click()
        cy.get('input[type="submit"]').should('be.enabled')

    })

    it('User can submit form with only mandatory fields added', ()=>{
        cy.get('#name').type('Maiakene')
        cy.get('input.email').type('maia@testing.com')
        cy.get('#country').select('Spain')
        cy.get('#city').select('Madrid')
        cy.get('input[type="checkbox"][required]').check()
        cy.get('h1').contains('Registration').click()
        cy.get('input[type="submit"]').should('be.enabled')
        
    })

    it('Submit button is not enabled when mandatory fields are absent', ()=>{
        cy.get('label').contains('Date of registration').siblings('input').click()
        cy.get('label').contains('Date of registration').siblings('input').type('2024-05-10')
        cy.get('label').contains('Date of registration').siblings('input').should('have.value', '2024-05-10')
        cy.get('input[type="radio"]').eq(1).check().should('be.checked')
        cy.get('#birthday').type('1991-05-01')
        cy.get('#birthday').should('have.value', '1991-05-01')
        cy.get('h1').contains('Registration').click()
        cy.get('input[type="submit"]').should('not.be.enabled')

    })

    it('Upload a file and submit it', ()=>{
        cy.get('input[type="file"]').selectFile('link false.png')
        cy.get('button[type="submit"]').click()
        cy.get('h1').should('have.text', 'Submission received')
        cy.url().should('contain', '/cypress/fixtures/upload_file.html?')

    })
})

/*
BONUS TASK: add functional tests for registration form 3
Task list:
* Create second test suite for functional tests
* Create tests to verify logic of the page:
    * all fields are filled in + corresponding assertions
    * only mandatory fields are filled in + corresponding assertions
    * mandatory fields are absent + corresponding assertions (try using function)
    * add file functionlity(google yourself for solution!)
 */