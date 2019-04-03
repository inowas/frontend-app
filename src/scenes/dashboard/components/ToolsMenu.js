import React from 'react';
import PropTypes from 'prop-types';
import {Icon, Menu} from 'semantic-ui-react';
import {includes} from 'lodash';
import {pure} from 'recompose';

const ToolsMenu = ({activeTool, onClick, roles, tools}) => {
    return (
        <Menu fluid vertical>
            <Menu.Item header icon size='small'><Icon name="horizontal sliders"/>Tools</Menu.Item>
            {tools.filter(t => includes(roles, t.role))
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
