import React from 'react';
import PropTypes from 'prop-types';
import {Form, Grid} from 'semantic-ui-react';
import {Boundary} from 'core/model/modflow/boundaries';
import ContentToolBar from '../../shared/contentToolbar';
import BoundaryMap from '../../maps/boundaryMap';
import {Geometry} from 'core/model/modflow';

class BoundaryDetails extends React.Component {
    render() {
        const {boundary, geometry} = this.props;
        if (!boundary || !geometry) {
            return null;
        }

        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column>
                        <ContentToolBar state={'saved'} save={{onclick: () => (1 + 2)}}/>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={6}>
                        <Form>
                            <Form.Input label={'Name'}/>
                            <Form.Input label={'Select layer'}/>
                            <Form.Input label={'Well type'}/>
                        </Form>
                        <BoundaryMap geometry={geometry} boundary={boundary}/>
                    </Grid.Column>
                    <Grid.Column width={10}>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

BoundaryDetails.proptypes = {
    boundary: PropTypes.instanceOf(Boundary).isRequired,
    geometry: PropTypes.instanceOf(Geometry).isRequired
};

export default BoundaryDetails;
