import React from 'react';
import PropTypes from 'prop-types';
import {Criterion} from 'core/mcda/criteria';
import {Form, Grid, Message, Segment} from 'semantic-ui-react';
import {GeoJSON, Map} from 'react-leaflet';
import {BasicTileLayer} from 'services/geoTools/tileLayers';
import {getStyle} from '../../../t03/components/maps';
import md5 from 'md5';

const styles = {
    map: {
        width: '100%',
        height: '200px'
    }
};

class CriteriaDefinition extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            criterion: props.criterion.toObject(),
            showInfo: true
        }
    }

    handleChange = () => this.props.onChange(Criterion.fromObject(this.state.criterion));

    handleLocalChange = label => (e, {name, value}) => {
        const criterion = this.state.criterion;

        if (label === 'northEast' && name === 'lat') {
            criterion.raster.boundingBox[1][1] = value;
        }
        if (label === 'northEast' && name === 'lon') {
            criterion.raster.boundingBox[1][0] = value;
        }
        if (label === 'southWest' && name === 'lat') {
            criterion.raster.boundingBox[0][1] = value;
        }
        if (label === 'southWest' && name === 'lon') {
            criterion.raster.boundingBox[0][0] = value;
        }
        if (label === 'gridSize') {
            criterion.raster.gridSize[name] = value;
        }
        if (label === 'value') {
            criterion.raster[name] = value;
        }

        this.setState({
            criterion: criterion
        });
    };

    handleDismiss = () => this.setState({showInfo: false});

    render() {
        const {criterion, showInfo} = this.state;
        const raster = criterion.raster;
        const boundingBox = this.props.criterion.raster.boundingBox;

        return (
            <div>
                {showInfo &&
                <Message onDismiss={this.handleDismiss}>
                    <Message.Header>Criteria data definition</Message.Header>
                    <p>You can enter the necessary information by hand or upload a layer definition file from
                        QGIS.</p>
                </Message>
                }
                <Segment>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={11}>
                                <Form>
                                    <Form.Group widths='equal'>
                                        <Form.Input onBlur={this.handleChange}
                                                    onChange={this.handleLocalChange('northEast')} name='lat'
                                                    value={raster.boundingBox[1][1] || 0} fluid
                                                    label='Latitude Northeast'/>
                                        <Form.Input onBlur={this.handleChange}
                                                    onChange={this.handleLocalChange('northEast')} name='lon'
                                                    value={raster.boundingBox[1][0] || 0} fluid
                                                    label='Longitude Northeast'/>
                                    </Form.Group>
                                    <Form.Group widths='equal'>
                                        <Form.Input onBlur={this.handleChange}
                                                    onChange={this.handleLocalChange('southWest')} name='lat'
                                                    value={raster.boundingBox[0][1] || 0} fluid
                                                    label='Latitude Southwest'/>
                                        <Form.Input onBlur={this.handleChange}
                                                    onChange={this.handleLocalChange('southWest')} name='lon'
                                                    value={raster.boundingBox[0][0] || 0} fluid
                                                    label='Longitude Southwest'/>
                                    </Form.Group>
                                    <Form.Group widths='equal'>
                                        <Form.Input
                                            disabled={raster.data.length > 0}
                                            onBlur={this.handleChange}
                                            onChange={this.handleLocalChange('gridSize')} name='n_x'
                                            value={raster.gridSize.n_x} fluid label='GridSize X'/>
                                        <Form.Input
                                            disabled={raster.data.length > 0}
                                            onBlur={this.handleChange}
                                                    onChange={this.handleLocalChange('gridSize')} name='n_y'
                                                    value={raster.gridSize.n_y} fluid label='GridSize Y'/>
                                    </Form.Group>
                                    <Form.Group widths='equal'>
                                        <Form.Input
                                            onBlur={this.handleChange}
                                            onChange={this.handleLocalChange('value')} name='min'
                                            value={raster.min} fluid label='Minimum Value'/>
                                        <Form.Input
                                            onBlur={this.handleChange}
                                            onChange={this.handleLocalChange('value')} name='max'
                                            value={raster.max} fluid label='Maximum Value'/>
                                    </Form.Group>
                                </Form>
                            </Grid.Column>
                            <Grid.Column width={5}>
                                <Map
                                    style={styles.map}
                                    bounds={boundingBox.getBoundsLatLng()}
                                >
                                    <BasicTileLayer/>
                                    <GeoJSON
                                        key={md5(JSON.stringify(boundingBox.toArray()))}
                                        data={boundingBox.geoJson}
                                        style={getStyle('bounding_box')}
                                    />
                                </Map>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
            </div>
        );
    }
}

CriteriaDefinition.proptypes = {
    criterion: PropTypes.instanceOf(Criterion),
    onChange: PropTypes.func.isRequired
};

export default CriteriaDefinition;
