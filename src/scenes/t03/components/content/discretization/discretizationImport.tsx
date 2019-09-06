import React from 'react';

import {Button, Dimmer, Divider, Grid, Header, List, Loader, Modal, Segment} from 'semantic-ui-react';
import {IBoundingBox} from '../../../../../core/model/geometry/BoundingBox.type';
import {ICells} from '../../../../../core/model/geometry/Cells.type';
import {GeoJson} from '../../../../../core/model/geometry/Geometry.type';
import {IGridSize} from '../../../../../core/model/geometry/GridSize.type';
import {
    BoundingBox,
    Cells,
    Geometry,
    GridSize,
    LengthUnit,
    ModflowModel,
    Stressperiods,
    TimeUnit
} from '../../../../../core/model/modflow';
import {ILengthUnit} from '../../../../../core/model/modflow/LengthUnit.type';
import {IDiscretizationImport} from '../../../../../core/model/modflow/ModflowModel.type';
import {IStressPeriods} from '../../../../../core/model/modflow/Stressperiods.type';
import {ITimeUnit} from '../../../../../core/model/modflow/TimeUnit.type';
import {JSON_SCHEMA_URL} from '../../../../../services/api';
import {validate} from '../../../../../services/jsonSchemaValidator';
import StressPeriodsDataTable from './stressperiodsDatatable';

interface IState {
    geometry: GeoJson | null;
    bounding_box: IBoundingBox | null;
    grid_size: IGridSize | null;
    cells: ICells | null;
    stressperiods: IStressPeriods | null;
    length_unit: ILengthUnit | null;
    time_unit: ITimeUnit | null;
    errors: any[] | null;
    isLoading: boolean;
    showImportModal: boolean;
}

interface IProps {
    model: ModflowModel;
    onChange: (model: ModflowModel) => void;
}

class DiscretizationImport extends React.Component<IProps, IState> {

    private fileReader: FileReader;

    constructor(props: IProps) {
        super(props);
        this.state = {
            geometry: null,
            bounding_box: null,
            grid_size: null,
            cells: null,
            stressperiods: null,
            length_unit: null,
            time_unit: null,
            errors: null,
            isLoading: false,
            showImportModal: false
        };

        this.fileReader = new FileReader();
        this.fileReader.onload = (event: any) => {
            if (event && event.target && event.target.result) {
                this.parseFileContent(event.target.result);
            }
        };
    }

    public render() {
        const {showImportModal} = this.state;
        return (
            <div>
                <Button
                    primary={true}
                    fluid={true}
                    icon={'download'}
                    content={'Import Discretization'}
                    labelPosition={'left'}
                    onClick={this.onClickUpload}
                />
                {showImportModal && this.renderImportModal()}
            </div>
        );
    }

    private onImportClick = () => {
        this.setState({
            showImportModal: false
        });

        const model = ModflowModel.fromObject(this.props.model.toObject());

        const {geometry, bounding_box, grid_size, cells, stressperiods, length_unit, time_unit} = this.state;

        if (geometry) {
            model.geometry = Geometry.fromObject(geometry);
        }

        if (bounding_box) {
            model.boundingBox = BoundingBox.fromObject(bounding_box);
        }

        if (grid_size) {
            model.gridSize = GridSize.fromObject(grid_size);
        }

        if (cells) {
            model.cells = Cells.fromObject(cells);
        }

        if (stressperiods) {
            model.stressperiods = Stressperiods.fromObject(stressperiods);
        }

        if (length_unit) {
            model.lengthUnit = LengthUnit.fromInt(length_unit);
        }

        if (time_unit) {
            model.timeUnit = TimeUnit.fromInt(time_unit);
        }

        return this.props.onChange(model);
    };

    private onCancel = () => {
        this.setState({
            showImportModal: false
        });
    };

    private handleFileData = (response: IDiscretizationImport) => {
        const {geometry, bounding_box, grid_size, stressperiods, length_unit, time_unit} = response;

        let recalculateCells = false;
        if (geometry) {
            this.setState({geometry});
            recalculateCells = true;
        }

        if (bounding_box) {
            this.setState({bounding_box});
            recalculateCells = true;
        }

        if (grid_size) {
            this.setState({grid_size});
            recalculateCells = true;
        }

        if (recalculateCells) {
            const cells = Cells.fromGeometry(
                geometry ? Geometry.fromGeoJson(geometry) : this.props.model.geometry,
                bounding_box ? BoundingBox.fromObject(bounding_box) : this.props.model.boundingBox,
                grid_size ? GridSize.fromObject(grid_size) : this.props.model.gridSize
            );

            this.setState({
                geometry: this.props.model.geometry.toObject(),
                bounding_box: this.props.model.boundingBox.toObject(),
                grid_size: this.props.model.gridSize.toObject(),
                cells: cells.toObject()
            });
        }

        if (stressperiods) {
            this.setState({stressperiods});
        }

        if (length_unit) {
            this.setState({length_unit});
        }

        if (time_unit) {
            this.setState({time_unit});
        }
    };

    private isValidJson = (text: string) => {
        try {
            JSON.parse(text);
        } catch (e) {
            return false;
        }
        return true;
    };

    private parseFileContent = (text: string) => {

        this.setState({
            geometry: null,
            bounding_box: null,
            grid_size: null,
            cells: null,
            stressperiods: null,
            length_unit: null,
            time_unit: null,
            errors: null
        });

        if (!this.isValidJson(text)) {
            return this.setState({
                errors: [['Invalid JSON']]
            });
        }

        const data = JSON.parse(text);
        const schemaUrl = JSON_SCHEMA_URL + '/import/discretization.json';

        validate(data, schemaUrl).then(([isValid, errors]) => {
            if (!isValid) {
                return this.setState({errors});
            }

            return this.handleFileData(data);
        });
    };

    private download = () => {
        const filename = 'discretization.json';
        const discretization = this.props.model.discretization;
        delete discretization.cells;
        const text = JSON.stringify(discretization, null, 2);

        const element: HTMLAnchorElement = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    private handleUpload = (e: any) => {
        const files = e.target.files;
        if (files.length > 0) {
            this.fileReader.readAsText(files[0]);
        }
    };

    private onClickUpload = () => this.setState({showImportModal: true});

    private renderStressPeriods() {
        if (!this.state.stressperiods) {
            return;
        }

        return (
            <StressPeriodsDataTable
                readOnly={true}
                stressperiods={Stressperiods.fromObject(this.state.stressperiods)}
            />
        );
    }

    private renderValidationErrors = (errors: Array<{ message: string }>) => (
        <Segment color="red" inverted={true}>
            <Header as="h3" style={{textAlign: 'left'}}>Validation Errors</Header>
            <List>
                {errors.map((e, idx) => (
                    <List.Item key={idx}>
                        <List.Icon name="eye"/>
                        <List.Content>{e.message}</List.Content>
                    </List.Item>
                ))}
            </List>
        </Segment>
    );

    private renderImportModal = () => (
        <Modal
            open={true}
            onClose={this.onCancel}
            dimmer={'blurring'}
            size={'small'}
        >
            <Modal.Header>Import Discretization</Modal.Header>
            <Modal.Content>
                <Grid stackable={true}>
                    <Grid.Row>
                        <Grid.Column>
                            {this.state.isLoading &&
                            <Dimmer active={true} inverted={true}>
                                <Loader>Uploading</Loader>
                            </Dimmer>
                            }
                            {!this.state.isLoading &&

                            <Segment basic={true} placeholder={true} style={{minHeight: '10rem'}}>
                                <Grid columns={2} stackable={true} textAlign="center">
                                    <Divider vertical={true} />
                                    <Grid.Row verticalAlign="top">
                                        <Grid.Column>
                                            {!this.state.errors &&
                                            <div>
                                                <Header as={'h3'}>
                                                    Download actual discretization.
                                                </Header>
                                                <Button
                                                    basic={true}
                                                    color="blue"
                                                    htmlFor={'inputField'}
                                                    content={'Get JSON File'}
                                                    onClick={this.download}
                                                />
                                            </div>
                                            }
                                            {this.state.errors && this.renderValidationErrors(this.state.errors)}
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Header as={'h3'}>
                                                Upload discretization file
                                            </Header>
                                            <Button
                                                color={'grey'}
                                                as={'label'}
                                                htmlFor={'inputField'}
                                                icon={'file alternate'}
                                                content={'Select File'}
                                                labelPosition={'left'}
                                                loading={this.state.isLoading}
                                                size={'large'}
                                            />
                                            <input
                                                hidden={true}
                                                type={'file'}
                                                id={'inputField'}
                                                onChange={this.handleUpload}
                                                onClick={this.onClickUpload}
                                                value={''}
                                            />
                                            <br/>
                                            <p>The file has to be a csv or json-file.</p>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Segment>
                            }
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            {this.renderStressPeriods()}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Content>
            <Modal.Actions>
                <Button
                    onClick={this.onCancel}
                >
                    Cancel
                </Button>
                <Button
                    disabled={!!this.state.errors}
                    onClick={this.onImportClick}
                    positive={true}
                >
                    Import
                </Button>
            </Modal.Actions>
        </Modal>
    );
}

export default DiscretizationImport;
