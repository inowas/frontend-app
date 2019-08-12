import React from 'react';
import {Button, Dimmer, Grid, Header, List, Loader, Modal, Segment} from 'semantic-ui-react';
import {
    ModflowModel,
} from '../../../../../core/model/modflow';
import BoundaryCollection from '../../../../../core/model/modflow/boundaries/BoundaryCollection';

import {IBoundary, IBoundaryImport} from '../../../../../core/model/modflow/boundaries/Boundary.type';
import {JSON_SCHEMA_URL} from '../../../../../services/api';
import {validate} from '../../../../../services/jsonSchemaValidator';

interface IState {
    boundaries: IBoundary[] | null;
    errors: any[] | null;
    isLoading: boolean;
    showImportModal: boolean;
}

interface IProps {
    model: ModflowModel;
    boundaries: BoundaryCollection;
    onChange: (boundaries: BoundaryCollection) => void;
}

class BoundariesImport extends React.Component<IProps, IState> {
    private fileReader: FileReader;

    constructor(props: IProps) {
        super(props);
        this.state = {
            boundaries: props.boundaries ? props.boundaries.toObject() : null,
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

    public componentWillReceiveProps(nextProps: Readonly<IProps>, nextContext: any): void {
        this.setState({
            boundaries: nextProps.boundaries.toObject(),
        });
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

        if (this.state.boundaries) {
            this.props.onChange(BoundaryCollection.fromObject(this.state.boundaries));
        }
    };

    private onCancel = () => {
        this.setState({
            showImportModal: false
        });
    };

    private handleFileData = (response: IBoundaryImport[]) => {
        const boundaries = BoundaryCollection.fromImport(
            response,
            this.props.model.boundingBox,
            this.props.model.gridSize,
        );

        if (boundaries) {
            this.setState({boundaries: boundaries.toObject()});
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
            boundaries: null,
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
                return this.setState({errors});
            }

            return this.handleFileData(data);
        });
    };

    private download = () => {
        const filename = 'boundaries.json';
        const boundaries: IBoundaryImport[] = this.props.boundaries.toImport();
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

    private renderBoundaries = () => {
        return null;
    };

    private renderImportModal = () => (
        <Modal
            open={true}
            onClose={this.onCancel}
            dimmer={'blurring'}
            size={'small'}
        >
            <Modal.Header>Import Boundaries</Modal.Header>
            <Modal.Content>
                <Grid stackable={true}>
                    <Grid.Row columns={2}>
                        <Grid.Column>
                            {this.state.isLoading &&
                            <Dimmer active={true} inverted={true}>
                                <Loader>Uploading</Loader>
                            </Dimmer>
                            }
                            {!this.state.isLoading &&
                            <Segment basic={true}>
                                <List bulleted={true}>
                                    <List.Item>The file has to be a csv or json-file.</List.Item>
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
                                />
                                <input
                                    hidden={true}
                                    type={'file'}
                                    id={'inputField'}
                                    onChange={this.handleUpload}
                                />
                            </Segment>
                            }
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
                    negative={true}
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

export default BoundariesImport;
