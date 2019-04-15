import PropTypes from 'prop-types';
import React from 'react';
import AbstractPackageProperties from './AbstractPackageProperties';
import {FlopyMt3dMtssm} from 'core/model/flopy/packages/mt';

class SsmPackageProperties extends AbstractPackageProperties {

    constructor(props) {
        super(props);
        this.state.selectedBoundary = null;
        this.state.selectedSubstanceId = null;
    }

    render() {
        return (
            <div>
                SsmPackageProperties
            </div>
        );
    }
}

SsmPackageProperties.propTypes = {
    mtPackage: PropTypes.instanceOf(FlopyMt3dMtssm),
    onChange: PropTypes.func.isRequired,
    readonly: PropTypes.bool.isRequired,
};


export default SsmPackageProperties;
