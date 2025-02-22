// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage} from 'react-intl';

import AddGroupsToTeamModal from 'components/add_groups_to_team_modal';
import ToggleModalButton from 'components/toggle_modal_button';
import AdminPanel from 'components/widgets/admin_console/admin_panel';

import {ModalIdentifiers} from 'utils/constants';
import {t} from 'utils/i18n';

import GroupList from '../../group';

export const TeamGroups = ({onGroupRemoved, syncChecked, team, onAddCallback, totalGroups, groups, removedGroups, setNewGroupRole, isDisabled}) => (
    <AdminPanel
        id='team_groups'
        titleId={syncChecked ? t('admin.team_settings.team_detail.syncedGroupsTitle') : t('admin.team_settings.team_detail.groupsTitle')}
        titleDefault={syncChecked ? 'Synced Groups' : 'Groups'}
        subtitleId={syncChecked ? t('admin.team_settings.team_detail.syncedGroupsDescription') : t('admin.team_settings.team_detail.groupsDescription')}
        subtitleDefault={syncChecked ? 'Add and remove team members based on their group membership.' : 'Group members will be added to the division.'}
        button={
            <ToggleModalButton
                id='addGroupsToTeamToggle'
                className='btn btn-primary'
                modalId={ModalIdentifiers.ADD_GROUPS_TO_TEAM}
                dialogType={AddGroupsToTeamModal}
                dialogProps={{
                    team,
                    onAddCallback,
                    skipCommit: true,
                    excludeGroups: groups,
                    includeGroups: removedGroups,
                }}
                isDisabled={isDisabled}
            >
                <FormattedMessage
                    id='admin.team_settings.team_details.add_group'
                    defaultMessage='Add Group'
                />
            </ToggleModalButton>
        }
    >
        <GroupList
            team={team}
            isModeSync={syncChecked}
            groups={groups}
            totalGroups={totalGroups}
            onGroupRemoved={onGroupRemoved}
            setNewGroupRole={setNewGroupRole}
            type='team'
            isDisabled={isDisabled}
        />
    </AdminPanel>);

TeamGroups.propTypes = {
    syncChecked: PropTypes.bool.isRequired,
    team: PropTypes.object.isRequired,
    totalGroups: PropTypes.number.isRequired,
    groups: PropTypes.arrayOf(PropTypes.object).isRequired,
    removedGroups: PropTypes.arrayOf(PropTypes.object).isRequired,
    onAddCallback: PropTypes.func.isRequired,
    onGroupRemoved: PropTypes.func.isRequired,
    setNewGroupRole: PropTypes.func.isRequired,
    isDisabled: PropTypes.bool,
};
