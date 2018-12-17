import React from 'react';
import PropTypes from 'prop-types';

class SsmPackageDataTable extends React.Component {
    render() {
        return (
            <div/>
        );
    }
}

SsmPackageDataTable.propTypes = {
    config: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool.isRequired,
    rows: PropTypes.array.isRequired,
};

export default SsmPackageDataTable;
