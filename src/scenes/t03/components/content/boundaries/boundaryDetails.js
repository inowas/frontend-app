import React from 'react';
import PropTypes from 'prop-types';
import {Form, Grid} from 'semantic-ui-react';

import BoundaryMap from '../../maps/boundaryMap';
import {Boundary, BoundaryFactory, Geometry, Soilmodel, Stressperiods} from 'core/model/modflow';
import BoundaryValuesDataTable from './boundaryValuesDataTable';

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
                    <Grid.Column width={6}>
                        <Form>
                            <Form.Input
                                label={'Name'}
                                name={'name'}
                                value={boundary.name}
                                onChange={this.handleChange}
                            />

                            <Form.Dropdown
                                label={'Selected layers'}
                                style={{zIndex: 1000}}
                                selection
                                fluid
                                options={this.props.soilmodel.layers.map(l => (
                                    {key: l.id, value: l.number, text: l.name}
                                ))}
                                value={boundary.affectedLayers[0]}
                                name={'affectedLayers'}
                                onChange={this.handleChange}
                            />

                            {boundary.subTypes &&
                            <Form.Dropdown
                                label={boundary.subTypes.name}
                                style={{zIndex: 1000}}
                                selection
                                fluid
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
                        {boundary.type === 'wel' &&
                            <BoundaryValuesDataTable
                                boundary={boundary}
                                onChange={this.props.onChange}
                                stressperiods={this.props.stressperiods}
                            />
                        }

                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

BoundaryDetails.proptypes = {
    boundary: PropTypes.instanceOf(Boundary).isRequired,
    geometry: PropTypes.instanceOf(Geometry).isRequired,
    soilmodel: PropTypes.instanceOf(Soilmodel).isRequired,
    stressperiods: PropTypes.instanceOf(Stressperiods).isRequired,
    onChange: PropTypes.func.isRequired
};

export default BoundaryDetails;
