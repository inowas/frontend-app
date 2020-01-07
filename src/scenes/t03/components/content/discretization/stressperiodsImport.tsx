import * as moment from 'moment';
import Papa from 'papaparse';
import React, {ChangeEvent, useState} from 'react';
import {Button, Divider, Grid, Header, List, Modal, Segment} from 'semantic-ui-react';
import Stressperiods from '../../../../../core/model/modflow/Stressperiods';
import {IStressPeriods} from '../../../../../core/model/modflow/Stressperiods.type';
import {StressperiodsDatatable} from './index';

interface IProps {
    onChange: (sp: Stressperiods) => any;
    stressperiods: Stressperiods;
}

const stressperiodsImport = (props: IProps) => {
    const [errors, setErrors] = useState<Array<{ message: string }>>([]);
    const [importedStressperiods, setImportedStressperiods] = useState<IStressPeriods | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showImportModal, setShowImportModal] = useState<boolean>(false);

    const handleCancel = () => setShowImportModal(false);

    const handleClickSubmit = () => {
        if (importedStressperiods) {
            setShowImportModal(false);
            return props.onChange(Stressperiods.fromObject(importedStressperiods));
        }
    };

    const handleDownload = () => {
        const filename = 'stressperiods.csv';
        const text = props.stressperiods.toCsv();
        const element: HTMLAnchorElement = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setIsLoading(true);
            Papa.parse(files[0], {
                dynamicTyping: true,
                header: true,
                complete: (results) => {
                    setIsLoading(false);
                    const firstRowData = results.data[0];
                    if (
                        ('start_date_time' in firstRowData) &&
                        ('nstp' in firstRowData) &&
                        ('tsmult' in firstRowData) &&
                        ('steady' in firstRowData)
                    ) {
                        const stressPeriods = new Stressperiods({
                            start_date_time: moment.utc(firstRowData.start_date_time).format(),
                            end_date_time: moment.utc(results.data.pop().start_date_time).format(),
                            stressperiods: results.data.map((d) => {
                                d.start_date_time = moment.utc(d.start_date_time).format();
                                d.steady = d.steady === true || d.steady === 1;
                                return d;
                            }),
                            time_unit: 4
                        });
                        return setImportedStressperiods(stressPeriods.toObject());
                    } else {
                        return setErrors(errors.concat([{message: 'Wrong file format.'}]));
                    }
                }
            });
        }
    };

    const handleClickUpload = () => setShowImportModal(true);

    const renderStressperiods = () => {
        if (importedStressperiods) {
            return (
                <StressperiodsDatatable
                    readOnly={true}
                    stressperiods={Stressperiods.fromObject(importedStressperiods)}
                />
            );
        }
    };

    const renderValidationErrors = () => (
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

    const render = () => {
        return (
            <Modal
                size={'small'}
                trigger={<Button>Show Modal</Button>}
                closeIcon={true}
                open={true}
                onClose={handleCancel}
                dimmer={'blurring'}
            >
                <Modal.Header>Import Stressperiods</Modal.Header>
                <Modal.Content>
                    <Grid stackable={true}>
                        <Grid.Row>
                            <Grid.Column>
                                <Segment basic={true} placeholder={true} style={{minHeight: '10rem'}}>
                                    <Grid columns={2} stackable={true} textAlign="center">
                                        <Divider vertical={true}/>
                                        <Grid.Row verticalAlign="top">
                                            <Grid.Column>
                                                {errors.length === 0 &&
                                                <div>
                                                    <Header as={'h3'}>
                                                        Download the list of stressperiods.
                                                    </Header>
                                                    <Button
                                                        basic={true}
                                                        color="blue"
                                                        htmlFor={'inputField'}
                                                        content={'Get CSV File'}
                                                        onClick={handleDownload}
                                                    />
                                                </div>
                                                }
                                                {errors.length > 0 && renderValidationErrors()}
                                            </Grid.Column>
                                            <Grid.Column>
                                                <Header as={'h3'}>
                                                    Upload Stressperiods
                                                </Header>
                                                <Button
                                                    color={'grey'}
                                                    as={'label'}
                                                    htmlFor={'inputField'}
                                                    icon={'file alternate'}
                                                    content={'Select File'}
                                                    labelPosition={'left'}
                                                    loading={isLoading}
                                                    size={'large'}
                                                />
                                                <input
                                                    hidden={true}
                                                    type={'file'}
                                                    id={'inputField'}
                                                    onChange={handleUpload}
                                                    onClick={handleClickUpload}
                                                    value={''}
                                                />
                                                <br/>
                                                <p>The file has to be a valid csv-file.</p>
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </Segment>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                {renderStressperiods()}
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        onClick={handleCancel}
                    >
                        Close
                    </Button>
                    {errors.length === 0 && importedStressperiods &&
                        <Button
                            onClick={handleClickSubmit}
                            primary={true}
                        >
                            Submit
                        </Button>
                    }
                </Modal.Actions>
            </Modal>
        );
    };

    return (
        <div>
            <Button
                primary={true}
                fluid={true}
                icon="download"
                content="Import Stressperiods"
                labelPosition="left"
                onClick={handleClickUpload}
            />
            {showImportModal && render()}
        </div>
    );
};

export default stressperiodsImport;
