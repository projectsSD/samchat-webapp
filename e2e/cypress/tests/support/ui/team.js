// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

Cypress.Commands.add('uiInviteMemberToCurrentTeam', (username) => {
    // # Open member invite screen
    cy.uiOpenTeamMenu('Invite People');

    // # Open members section if licensed for guest accounts
    cy.findByTestId('invitationModal').
        then((container) => container.find('[data-testid="inviteMembersLink"]')).
        then((link) => link && link.click());

    // # Enter bot username and submit
    cy.get('.users-emails-input__control input').type(username, {force: true}).as('input');
    cy.get('.users-emails-input__option ').contains(`@${username}`);
    cy.get('@input').type('{enter}', {force: true});
    cy.get('#inviteMembersButton').click();

    // * Verify user invited to team
    cy.get('.invitation-modal-confirm--sent .InviteResultRow').
        should('contain.text', `@${username}`).
        and('contain.text', 'This member has been added to the division.');

    // # Close, return
    cy.findByTestId('confirm-done').click();
});
