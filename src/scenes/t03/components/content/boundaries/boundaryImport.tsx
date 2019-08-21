import React from 'react';
import {Button, Grid, Header, List, Modal, Segment} from 'semantic-ui-react';
import {
    ModflowModel,
} from '../../../../../core/model/modflow';
import BoundaryCollection from '../../../../../core/model/modflow/boundaries/BoundaryCollection';

import {IBoundary, IBoundaryExport} from '../../../../../core/model/modflow/boundaries/Boundary.type';
import Soilmodel from '../../../../../core/model/modflow/soilmodel/Soilmodel';
import {JSON_SCHEMA_URL} from '../../../../../services/api';
import {validate} from '../../../../../services/jsonSchemaValidator';
import BoundaryComparator from './boundaryComparator';

interface IState {
    importedBoundaries: IBoundary[] | null;
    selectedBoundary: string | null;
    errors: any[] | null;
    isLoading: boolean;
    showImportModal: boolean;
}

interface IProps {
    model: ModflowModel;
    soilmodel: Soilmodel;
    boundaries: BoundaryCollection;
    onChange: (boundaries: BoundaryCollection) => void;
}

export default class BoundaryImport extends React.Component<IProps, IState> {
    private fileReader: FileReader;

    constructor(props: IProps) {
        super(props);
        this.state = {
            importedBoundaries: null,
            errors: null,
            isLoading: false,
            selectedBoundary: null,
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
                    icon="download"
                    content="Import Boundaries"
                    labelPosition="left"
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

        if (this.state.importedBoundaries) {
            // console.log(BoundaryCollection.fromObject(this.state.importedBoundaries));
        }
    };

    private onBoundaryClick = (id: string) => {
        this.setState({
            selectedBoundary: id
        });
    };

    private onCancel = () => {
        this.setState({
            showImportModal: false
        });
    };

    private handleFileData = (response: IBoundaryExport[]) => {
        const boundaries = BoundaryCollection.fromExport(
            response,
            this.props.model.boundingBox,
            this.props.model.gridSize,
        );

        if (boundaries) {
            this.setState({
                importedBoundaries: boundaries.toObject(),
                selectedBoundary: boundaries.first && boundaries.first.id,
                isLoading: false
            });
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
            importedBoundaries: null,
            errors: null,
        });

        if (!this.isValidJson(text)) {
            return this.setState({
                errors: [['Invalid JSON']]
            });
        }

        const data = JSON.parse(text);
        const schemaUrl = JSON_SCHEMA_URL + '/import/boundaries.json';

        validate(data, schemaUrl).then(([isValid, errors]) => {
            if (!isValid) {
                return this.setState({
                    isLoading: false,
                    errors
                });
            }

            return this.handleFileData(data);
        });
    };

    private download = () => {
        const filename = 'boundaries.json';
        const boundaries: IBoundaryExport[] = this.props.boundaries.toExport();
        const text = JSON.stringify(boundaries, null, 2);

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
            this.setState({isLoading: true});
            this.fileReader.readAsText(files[0]);
        }
    };

    private onClickUpload = () => this.setState({showImportModal: true});

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

    private onFileUploadClick = () => {
        this.setState({
            importedBoundaries: null
        });
    };

    private renderBoundaries = () => {
        if (this.state.importedBoundaries) {
            return (
                <BoundaryComparator
                    currentBoundaries={this.props.boundaries}
                    soilmodel={this.props.soilmodel}
                    newBoundaries={BoundaryCollection.fromObject(this.state.importedBoundaries)}
                    model={this.props.model}
                    selectedBoundary={this.state.selectedBoundary}
                    onBoundaryClick={this.onBoundaryClick}
                    onChange={this.onImportClick}
                />
            );
        }
    };

    private renderImportModal = () => (
        <Modal
            open={true}
            onClose={this.onCancel}
            dimmer={'blurring'}
            size={'large'}
        >
            <Modal.Header>Import Boundaries</Modal.Header>
            <Modal.Content>
                <Grid stackable={true}>
                    <Grid.Row columns={2}>
                        <Grid.Column>
                            <Segment basic={true}>
                                <List bulleted={true}>
                                    <List.Item>The file has to be a valid json-file.</List.Item>
                                    <List.Item
                                        as={'a'}
                                        onClick={this.download}
                                    >
                                        Download the list of boundaries.
                                    </List.Item>
                                </List>
                                <Button
                                    color={'grey'}
                                    as={'label'}
                                    htmlFor={'inputField'}
                                    icon={'file alternate'}
                                    content={'Select File'}
                                    labelPosition={'left'}
                                    loading={this.state.isLoading}
                                />
                                <input
                                    hidden={true}
                                    type={'file'}
                                    id={'inputField'}
                                    onChange={this.handleUpload}
                                    onClick={this.onFileUploadClick}
                                    value={''}
                                />
                            </Segment>
                        </Grid.Column>
                        <Grid.Column>
                            {this.state.errors && this.renderValidationErrors(this.state.errors)}
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            {this.renderBoundaries()}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Content>
            <Modal.Actions>
                <Button
                    onClick={this.onCancel}
                >
                    Close
                </Button>
            </Modal.Actions>
        </Modal>
    );
}
