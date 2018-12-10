import React from 'react';
import PropTypes from 'prop-types';
import {Header} from 'semantic-ui-react';
import {BoundingBox, Geometry, GridSize} from 'core/model/modflow';

class GridEditor extends React.Component{
    constructor(props){
        super(props);
        this.state = {

        }
    }

    render() {
        return(
            <Header as={'h2'}>GridEditor</Header>
        )
    }
}

GridEditor.proptypes = {
    boundingBox: PropTypes.instanceOf(BoundingBox).isRequired,
    geometry: PropTypes.instanceOf(Geometry).isRequired,
    gridSize: PropTypes.instanceOf(GridSize).isRequired,
    onChange: PropTypes.func.isRequired
};

export default GridEditor;
