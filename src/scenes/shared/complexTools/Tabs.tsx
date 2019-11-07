import React from 'react';
import {Tab} from 'semantic-ui-react';

interface IProps {
    panes: Array<{
        name: string;
        component: React.ReactNode
    }>;
}

const tabs = (props: IProps) => {
    const panes = props.panes.map(((p, idx) => ({
        key: idx,
        menuItem: p.name,
        render: () => p.component
    })));

    return (
        <Tab panes={panes}/>
    );
};

export default tabs;
