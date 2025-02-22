// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// ***************************************************************
// - [#] indicates a test step (e.g. # Go to a page)
// - [*] indicates an assertion (e.g. * Check the title)
// - Use element ID when selecting an element. Create one if none.
// ***************************************************************

// Stage: @prod
// Group: @team_settings

import {getRandomId} from '../../utils';
import * as TIMEOUTS from '../../fixtures/timeouts';

describe('Division Settings', () => {
    let newUser;

    before(() => {
        cy.apiInitSetup().then(({team}) => {
            cy.apiCreateUser().then(({user}) => {
                newUser = user;
            });

            cy.visit(`/${team.name}`);
        });
    });

    it('MM-T388 - Invite new user to closed team with "Allow only users with a specific email domain to join this division" set to "sample.mattermost.com" AND include a non-sample.mattermost.com email address in the invites', () => {
        const emailDomain = 'sample.mattermost.com';
        const invalidEmail = `user.${getRandomId()}@invalid.com`;
        const userDetailsString = `@${newUser.username} - ${newUser.first_name} ${newUser.last_name} (${newUser.nickname})`;
        const inviteSuccessMessage = 'This member has been added to the division.';
        const inviteFailedMessage = `The following email addresses do not belong to an accepted domain: ${invalidEmail}. Please contact your System Administrator for details.`;

        // # Open team menu and click 'Division Settings'
        cy.uiOpenTeamMenu('Division Settings');

        // * Check that the 'Division Settings' modal was opened
        cy.get('#teamSettingsModal').should('exist').within(() => {
            // # Click on the 'Allow only users with a specific email domain to join this division' edit button
            cy.get('#allowed_domainsEdit').should('be.visible').click();

            // # Set 'sample.mattermost.com' as the only allowed email domain and save
            cy.wait(TIMEOUTS.HALF_SEC);
            cy.focused().type(emailDomain);
            cy.findByText('Save').should('be.visible').click();

            // # Close the modal
            cy.get('#teamSettingsModalLabel').find('button').should('be.visible').click();
        });

        // # Open team menu and click 'Invite People'
        cy.uiOpenTeamMenu('Invite People');

        // # Invite user with valid email domain that is not in the team
        inviteNewMemberToTeam(newUser.email);

        // * Assert that the user has successfully been invited to the team
        cy.get('.invitation-modal-confirm--sent').should('be.visible').within(() => {
            cy.get('.username-or-icon').find('span').eq(0).should('have.text', userDetailsString);
            cy.get('.InviteResultRow').find('div').eq(1).should('have.text', inviteSuccessMessage);
        });

        // # Click on the 'Invite More People button'
        cy.findByTestId('invite-more').click();

        // # Invite a user with an invalid email domain (not sample.mattermost.com)
        inviteNewMemberToTeam(invalidEmail);

        // * Assert that the invite failed and the correct error message is shown
        cy.get('.invitation-modal-confirm--not-sent').should('be.visible').within(() => {
            cy.get('.username-or-icon').find('span').eq(1).should('have.text', invalidEmail);
            cy.get('.InviteResultRow').find('div').eq(1).should('have.text', inviteFailedMessage);
        });
    });

    function inviteNewMemberToTeam(email) {
        cy.wait(TIMEOUTS.HALF_SEC);

        cy.findByRole('textbox', {name: 'Add or Invite People'}).type(email, {force: true}).wait(TIMEOUTS.HALF_SEC).type('{enter}');
        cy.get('#inviteMembersButton').click();
    }
});
