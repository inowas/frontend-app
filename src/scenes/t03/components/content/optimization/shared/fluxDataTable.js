/* eslint-disable react/no-multi-comp */
import React from 'react';
import PropTypes from 'prop-types';

class FluxDataTable extends React.Component {
    constructor(props) {
        super(props);
    }

    // TODO
    render() {
        return (<div/>);
    }
}

FluxDataTable.propTypes = {
    config: PropTypes.array.isRequired,
    onChange: PropTypes.func,
    readOnly: PropTypes.bool.isRequired,
    rows: PropTypes.array.isRequired,
};

export default FluxDataTable;