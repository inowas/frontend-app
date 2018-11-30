import React from 'react';
import PropTypes from 'prop-types';
import {Dropdown, Form, Grid} from 'semantic-ui-react';
import {Boundary} from 'core/model/modflow/boundaries';
import ContentToolBar from '../../shared/contentToolbar';
import BoundaryMap from '../../maps/boundaryMap';
import {Geometry} from 'core/model/modflow';
import BoundaryFactory from 'core/model/modflow/boundaries/BoundaryFactory';

class BoundaryDetails extends React.Component {

    handleChange = (e, {name, value}) => {
        const boundary = BoundaryFactory.fromObjectData(this.props.boundary.toObject);
        boundary[name] = value;
        this.props.onChange(boundary);
    };

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
                            <Form.Input label={'Name'} name={'name'} value={boundary.name}
                                        onChange={this.handleChange}/>
                            <Form.Input label={'Selected layers'}/>

                            {boundary.subTypes &&
                            <Dropdown
                                label={boundary.subTypes.name}
                                style={{zIndex: 1000}}
                                selection
                                options={boundary.subTypes.types.map(t => (
                                    {key: t.value, value: t.value, text: t.name}
                                ))}
                                value={boundary.subType}
                                name={'subType'}
                                onChange={this.handleChange}
                            />
                            }

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
    geometry: PropTypes.instanceOf(Geometry).isRequired,
    onChange: PropTypes.func.isRequired
};

export default BoundaryDetails;
