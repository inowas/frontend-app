import React from 'react';

import {Button, Header} from 'semantic-ui-react';
import DataTable from './dataTable';

interface IProps {
    toggleSelect: (name: string) => void;
    handleReset: () => void;
    data: any[];
}

const parameters = (props: IProps) => (
    <div>
        <Header textAlign={'left'}>
            Selected Scenarios
            <Button compact={true} floated={'right'} size={'small'} onClick={props.handleReset}>
                Default
            </Button>
        </Header>
        <DataTable
            toggleSelect={props.toggleSelect}
            data={props.data.filter((r) => r.selected === true)}
            color={'orange'}
            icon={'trash'}
            filter={false}
        />

        <Header textAlign="left">
            Infiltration Scenarios
        </Header>
        <DataTable
            toggleSelect={props.toggleSelect}
            data={props.data.filter((r) => r.selected === false)}
            color={'grey'}
            icon={'add'}
            filter={['hlr', 'hlc', 'time', 'k', 'climate', 'scale']}
        />
    </div>
);

export default parameters;
