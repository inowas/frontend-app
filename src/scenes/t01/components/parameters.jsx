import React from 'react';
import {pure} from 'recompose';
import PropTypes from 'prop-types';

import {Button, Header} from 'semantic-ui-react';
import DataTable from './dataTable';

class Parameters extends React.Component {
    render() {
        return (
            <div>
                <Header textAlign='left'>
                    Selected
                    <Button compact floated={'right'} size={'small'} onClick={this.props.handleReset}>
                        Default
                    </Button>
                </Header>
                <DataTable
                    toggleSelect={this.props.toggleSelect}
                    data={this.props.data.filter(r => r.selected === true)}
                    color={'red'}
                    icon={'trash'}
                    filter={false}
                />

                <Header textAlign='left'>
                    Data
                </Header>
                <DataTable
                    toggleSelect={this.props.toggleSelect}
                    data={this.props.data.filter(r => r.selected === false)}
                    color={'grey'}
                    icon={'add'}
                    filter={['hlr', 'hlc', 'time', 'k', 'climate', 'scale']}
                />
            </div>
        );
    }
}

Parameters.propTypes = {
    toggleSelect: PropTypes.func.isRequired,
    handleReset: PropTypes.func.isRequired,
    data: PropTypes.array.isRequired
};

export default pure(Parameters);
