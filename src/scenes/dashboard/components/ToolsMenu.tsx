import {includes} from 'lodash';
import React from 'react';
import {pure} from 'recompose';
import {Icon, Menu} from 'semantic-ui-react';
import getConfig from '../../../config.default';
import {ITool} from '../defaults/tools';

interface IProps {
    activeTool: ITool;
    onClick: (tool: string) => any;
    roles: string[];
    tools: ITool[];
}

const {DISABLE_TOOL} = getConfig();

const disabledTools = DISABLE_TOOL.split(',').map((s) => s.trim()).map((s) => s.toUpperCase());
const isDisabled = (tool: string) => disabledTools.findIndex((e) => e === tool) >= 0;

const toolsMenu = ({activeTool, onClick, roles, tools}: IProps) => {
    return (
        <Menu fluid={true} vertical={true}>
            <Menu.Item header={true} icon={true} size="small">
                <Icon name="sliders horizontal"/>
                Tools
            </Menu.Item>
            {tools.filter((t) => includes(roles, t.role)).filter((t) => !isDisabled(t.slug))
                .map((tool, key) => (
                    <Menu.Item
                        key={key}
                        onClick={() => onClick(tool.slug)}
                        active={activeTool.slug === tool.slug}
                    >
                        {tool.slug + ': ' + tool.name}
                    </Menu.Item>
                ))
            }
        </Menu>
    );
};

export default pure(toolsMenu);
