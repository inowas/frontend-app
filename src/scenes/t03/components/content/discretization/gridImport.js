import React from 'react';

import {Button, Dimmer, Grid, Header, Modal, List, Loader, Segment, Tab} from 'semantic-ui-react';

import PapaParse from 'papaparse';
import {Stressperiod, Stressperiods} from '../../../../../core/model/modflow';
import Proptypes from 'prop-types';
import StressPeriodsDataTable from './stressperiodsDatatable';

class GridImport extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            errors: null,
            isLoading: false,
            showImportModal: false
        };

        this.fileReader = new FileReader();
        this.fileReader.onload = event => {
            this.parseFileContent(event.target.result);
        }
    }

    sendImportCommand = () => {
        this.setState({
            showImportModal: false
        });
        return this.props.onChange(Stressperiods.fromObject(this.state.stressPeriods));
    };

    handleJSON = response => {
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
        })
    };

    isValidCSV = text => {
        return true;
    };

    isValidJson = text => {
        try {
            JSON.parse(text);
        } catch (e) {
            return false;
        }
        return true;
    };

    parseFileContent = text => {
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

    handleUpload = e => {
        const files = e.target.files;

        if (files.length > 0) {
            this.fileReader.readAsText(files[0]);
        }
    };

    onClickUpload = () => this.setState({showImportModal: true});

    renderStressPeriods() {
        const stressPeriods = Stressperiods.fromObject(this.state.stressPeriods);

        return (
            <StressPeriodsDataTable
                readOnly
                onChange={() => {
                }}
                stressperiods={stressPeriods}
            />
        );
    };

    renderValidationErrors = errors => {
        console.log(errors);
        return (
            <Segment color="red" inverted>
                <Header as="h3" style={{'textAlign': 'left'}}>Validation Errors</Header>
                <List>
                    {errors.map((e, idx) => (
                        <List.Item key={idx}>
                            <List.Icon name="eye"/>
                            <List.Content>{e.message}</List.Content>
                        </List.Item>
                    ))}
                </List>
            </Segment>
        )
    };

    renderImportModal = () => {
        const panes = [
            {
                menuItem: 'Import',
                pane: {
                    key: 'tab1',
                    content: (
                        <div>
                            {!this.state.isLoading &&
                            <Segment basic>
                                <Button
                                    color={'grey'}
                                    as='label'
                                    htmlFor={'inputField'}
                                    icon='file alternate'
                                    content='Select File'
                                    labelPosition='left'
                                />
                                <input
                                    hidden
                                    type='file'
                                    id='inputField'
                                    onChange={this.handleUpload}
                                />
                                <List bulleted>
                                    <List.Item>
                                        The file has to be a csv or json-file.
                                    </List.Item>
                                    <List.Item>
                                        Examples can be found <a
                                        href='https://github.com/inowas/inowas-dss-cra/blob/master/imports'
                                        target='_blank' rel='noopener noreferrer'>here</a>.
                                    </List.Item>
                                </List>
                            </Segment>
                            }
                        </div>
                    )
                }
            },
            {
                menuItem: 'Export',
                pane: (
                    <Tab.Pane key='tab2'>
                        <p>Test</p>
                    </Tab.Pane>
                )
            }

    ];
        return (
            <Modal open onClose={this.props.onCancel} dimmer={'blurring'} size={'small'}>
                <Modal.Header>Configure Spacial Grid</Modal.Header>
                <Modal.Content>
                    <Tab menu={{secondary: true, widths: 2}} renderActiveOnly={false} panes={panes}/>
                    <Grid stackable>
                        <Grid.Row>
                            <Grid.Column>
                                {this.state.isLoading &&
                                <Dimmer active inverted>
                                    <Loader>Uploading</Loader>
                                </Dimmer>
                                }
                                {!this.state.isLoading &&
                                <Segment basic>
                                    <Button
                                        color={'grey'}
                                        as='label'
                                        htmlFor={'inputField'}
                                        icon='file alternate'
                                        content='Select File'
                                        labelPosition='left'
                                    />
                                    <input
                                        hidden
                                        type='file'
                                        id='inputField'
                                        onChange={this.handleUpload}
                                    />
                                    <List bulleted>
                                        <List.Item>
                                            The file has to be a csv or json-file.
                                        </List.Item>
                                        <List.Item>
                                            Examples can be found <a
                                            href='https://github.com/inowas/inowas-dss-cra/blob/master/imports'
                                            target='_blank' rel='noopener noreferrer'>here</a>.
                                        </List.Item>
                                    </List>
                                </Segment>
                                }
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                {this.state.payload && this.renderMetaData(this.state.payload)}
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
                    <Button
                        disabled={!this.state.stressPeriods}
                        positive
                        onClick={this.sendImportCommand}
                    >
                        Import
                    </Button>
                    <Button onClick={() => this.setState({showImportModal: false})}>Cancel</Button>
                </Modal.Actions>
            </Modal>
        );
    }

    render() {
        const {showImportModal} = this.state;
        return (
            <div>
                <Button
                    primary
                    fluid
                    icon='file'
                    content='Configuration File'
                    labelPosition='left'
                    onClick={this.onClickUpload}
                />
                {showImportModal && this.renderImportModal()}
            </div>
        );
    }
}

GridImport.prototypes = {
    onChange: Proptypes.func.isRequired,
    onChangeTab: Proptypes.func.isRequired
};

export default GridImport;
