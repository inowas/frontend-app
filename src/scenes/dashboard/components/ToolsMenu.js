import React from 'react';
import PropTypes from 'prop-types';
import {Icon, Menu} from 'semantic-ui-react';
import {includes} from 'lodash';
import {pure} from 'recompose';

import getConfig from '../../../config.default';

const {DISABLE_TOOL} = getConfig();

const disabledTools = DISABLE_TOOL.split(',').map(s => s.trim()).map(s => s.toUpperCase());
const isDisabled = (tool) => disabledTools.findIndex((e) => e === tool) >= 0;

const ToolsMenu = ({activeTool, onClick, roles, tools}) => {
    return (
        <Menu fluid vertical>
            <Menu.Item header icon size='small'><Icon name="horizontal sliders"/>Tools</Menu.Item>
            {tools.filter(t => includes(roles, t.role)).filter((t) => !isDisabled(t.slug))
                .map((tool, key) => (
                    <Menu.Item
                        key={key}
                        onClick={() => onClick(tool.slug)}
                        active={activeTool === tool.slug}
                    >
                        {tool.slug + ': ' + tool.name}
                    </Menu.Item>
                ))
            }
        </Menu>
    )
};

ToolsMenu.propTypes = {
    activeTool: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    roles: PropTypes.array.isRequired,
    tools: PropTypes.array.isRequired
};

export default pure(ToolsMenu);
