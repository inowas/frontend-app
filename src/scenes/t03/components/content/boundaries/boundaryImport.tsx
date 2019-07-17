import PapaParse from 'papaparse';
import React, {ChangeEvent} from 'react';
import {Button, Dimmer, Grid, Header, List, Loader, Modal, Segment} from 'semantic-ui-react';
import {Stressperiod, Stressperiods} from '../../../../../core/model/modflow';
import {IStressPeriods} from '../../../../../core/model/modflow/Stressperiods.type';

interface IProps {
    onCancel: () => any;
    onChange: (stressperiods: Stressperiods) => any;
    timeunit?: number;
}

interface IState {
    errors: null;
    isLoading: boolean;
    showImportModal: boolean;
    stressPeriods: IStressPeriods | null;
    payload: any;
}

class BoundariesImport extends React.Component<IProps, IState> {
    private fileReader: FileReader;

    constructor(props: IProps) {
        super(props);
        this.state = {
            errors: null,
            isLoading: false,
            showImportModal: false,
            stressPeriods: null,
            payload: null
        };

        this.fileReader = new FileReader();
        this.fileReader.onload = () => {
            this.parseFileContent(this.fileReader.result);
        };
    }

    public sendImportCommand = () => {
        this.setState({
            showImportModal: false
        });
        return this.props.onChange(Stressperiods.fromObject(this.state.stressPeriods));
    };

    public handleJSON = (response: any) => {
        const stressPeriods = Stressperiods.fromImport({
            start_date_time: response.data[0].Date,
            end_date_time: response.data[response.data.length - 1].Date,
            stressperiods: [],
            time_unit: this.props.timeunit
        });

        for (let i = 0; i < response.data.length - 1; i++) {
            const sp = new Stressperiod();
            sp.startDateTime = response.data[i].Date;
            sp.nstp = response.data[i].nstp || 1;
            sp.tsmult = response.data[i].tsmult || 1;
            sp.steady = response.data[i].steady === 1;
            stressPeriods.addStressPeriod(sp);
        }

        return this.setState({
            stressPeriods: stressPeriods.toObject()
        });
    };

    public isValidCSV = (text: string) => {
        return true;
    };

    public isValidJson = (text: string) => {
        try {
            JSON.parse(text);
        } catch (e) {
            return false;
        }
        return true;
    };

    public parseFileContent = (text: string | ArrayBuffer | null) => {
        if (!(typeof text === 'string')) {
            return;
        }

        if (this.isValidJson(text)) {
            return this.handleJSON(JSON.parse(text));
        }
        if (this.isValidCSV(text)) {
            return PapaParse.parse(text, {
                complete: this.handleJSON,
                header: true,
                dynamicTyping: true
            });
        }
    };

    public handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;

        if (files && files.length > 0) {
            this.fileReader.readAsText(files[0]);
        }
    };

    public onClickUpload = () => this.setState({showImportModal: true});

    public renderMetaData = () => {
        return null;
    };

    public renderStressPeriods = () => {
        return null;
    };

    public renderValidationErrors = (errors: any) => {
        return (
            <Segment color="red" inverted={true}>
                <Header as="h3" style={{textAlign: 'left'}}>Validation Errors</Header>
                <List>
                    {errors.map((e: any, idx: number) => (
                        <List.Item key={idx}>
                            <List.Icon name="eye"/>
                            <List.Content>{e.message}</List.Content>
                        </List.Item>
                    ))}
                </List>
            </Segment>
        );
    };

    public renderImportModal = () => (
        <Modal open={true} onClose={this.props.onCancel} dimmer={'blurring'}>
            <Modal.Header>Import Boundaries</Modal.Header>
            <Modal.Content>
                <Grid>
                    <Grid.Row columns={2}>
                        <Grid.Column>
                            {this.state.isLoading &&
                            <Dimmer active={true} inverted={true}>
                                <Loader>Uploading</Loader>
                            </Dimmer>
                            }
                            {!this.state.isLoading &&
                            <Segment color={'green'}>
                                <Header as="h3" style={{textAlign: 'left'}}>File Requirements</Header>
                                <List bulleted={true}>
                                    <List.Item>
                                        The file has to be a csv or json-file.
                                    </List.Item>
                                    <List.Item>
                                        Examples can be found
                                        <a
                                            href="https://github.com/inowas/inowas-dss-cra/blob/master/imports"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            here
                                        </a>.
                                    </List.Item>
                                </List>
                                <Button
                                    primary={true}
                                    fluid={true}
                                    as="label"
                                    htmlFor={'inputField'}
                                    icon="file alternate"
                                    content="Select File"
                                    labelPosition="left"
                                />
                                <input
                                    hidden={true}
                                    type="file"
                                    id="inputField"
                                    onChange={this.handleUpload}
                                />
                            </Segment>
                            }
                        </Grid.Column>
                        <Grid.Column>
                            {this.state.payload && this.renderMetaData()}
                            {this.state.errors && this.renderValidationErrors(this.state.errors)}
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            {this.state.stressPeriods && this.renderStressPeriods()}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={this.handleClickCancel}>Cancel</Button>
                <Button
                    disabled={!this.state.stressPeriods}
                    positive={true}
                    onClick={this.sendImportCommand}
                >
                    Import
                </Button>
            </Modal.Actions>
        </Modal>
    );

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

    private handleClickCancel = () => this.setState({showImportModal: false});
}

export default BoundariesImport;
