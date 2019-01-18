import PropTypes from 'prop-types';
import React from 'react';
import {Criterion} from 'core/mcda/criteria';
import {Button} from 'semantic-ui-react';
import CriteriaRasterMap from './criteriaRasterMap';
import {Raster} from 'core/mcda/gis';

class CriteriaDataResults extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            criterion: this.props.criterion.toObject()
        }
    }

    handleChangeRaster = () => {
        console.log('TEST');
    };

    handleClickCalculate = () => {
        const criterion = this.props.criterion;
        criterion.calculateSuitability();
        this.setState({
            criterion: criterion.toObject()
        });
    };

    render() {
        const {criterion} = this.state;

        return (
            <div>
                <Button primary onClick={this.handleClickCalculate}>Calculate Suitability</Button>
                {criterion.suitability.data.length > 0 &&
                    <CriteriaRasterMap
                        onChange={this.handleChangeRaster}
                        raster={Raster.fromObject(criterion.suitability)}
                        showBasicLayer={false}
                    />
                }
            </div>
        );
    }
}

CriteriaDataResults.propTypes = {
    criterion: PropTypes.instanceOf(Criterion).isRequired,
    onChange: PropTypes.func.isRequired
};

export default CriteriaDataResults;
