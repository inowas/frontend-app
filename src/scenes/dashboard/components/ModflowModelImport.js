import React from 'react';
import {withRouter} from 'react-router-dom';

import Uuid from 'uuid';
import {Icon} from 'semantic-ui-react';
import {validate} from 'services/jsonSchemaValidator';
import {JSON_SCHEMA_URL, sendCommand} from 'services/api';
import ModflowModelCommand from '../../t03/commands/modflowModelCommand';
import {BoundaryCollection, BoundingBox, Cells, Geometry, GridSize, Soilmodel, Stressperiods} from 'core/model/modflow';
import PropTypes from 'prop-types';

class ModflowModelImport extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            errors: null
        };

        this.fileReader = new FileReader();

        this.fileReader.onload = (event) => {
            this.parseFileContent(event.target.result);
        }
    }

    parseFileContent = (text) => {
        const data = JSON.parse(text);
        const schemaUrl = JSON_SCHEMA_URL + 'import/modflowModel.json';
        validate(data, schemaUrl).then(([isValid, errors]) => {
            if (!isValid) {
                return this.setState({errors});
            }

            const id = Uuid.v4();
            const geometry = Geometry.fromGeoJson(data.discretization.geometry);
            const boundingBox = BoundingBox.fromGeoJson(data.discretization.geometry);
            const gridSize = Array.isArray(data.discretization.grid_size) ? GridSize.fromArray(data.discretization.grid_size) : GridSize.fromObject(data.discretization.grid_size);
            const stressperiods = Stressperiods.fromImport(data.discretization.stressperiods);
            const soilmodel = data.soilmodel;

            soilmodel.layers = soilmodel.layers.map(l => {
                l.id = Uuid.v4();
                return l;
            });

            const payload = {
                id,
                name: data.name,
                description: data.description,
                public: data.public,
                discretization: {
                    geometry: geometry.toObject(),
                    bounding_box: boundingBox.toArray(),
                    grid_size: gridSize.toObject(),
                    cells: Cells.fromGeometry(geometry, boundingBox, gridSize).toArray(),
                    stressperiods: stressperiods.toObject(),
                    length_unit: data.discretization.length_unit,
                    time_unit: data.discretization.time_unit,
                },
                soilmodel: {
                    layers: Soilmodel.fromObject(soilmodel).toObject().layers
                },
                boundaries: BoundaryCollection.fromImport(data.boundaries, boundingBox, gridSize).toObject()
            };

            sendCommand(ModflowModelCommand.importModflowModel(payload),
                () => this.props.history.push('/tools/T03/' + id)
            )
        })
    };

    handleUploadJson = (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            this.fileReader.readAsText(files[0]);
        }
    };

    render() {
        console.warn(this.state.errors);
        return (
            <span>
                <label htmlFor={'inputField'}>
                    <Icon name='file text'/> Import JSON
                </label>
                <input
                    type="file" id='inputField'
                    style={{display: 'none'}}
                    onChange={this.handleUploadJson}
                />
            </span>
        );
    }
}

ModflowModelImport.proptypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired
};

export default withRouter(ModflowModelImport);
