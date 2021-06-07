import {AdvancedCsvUpload} from '../../../../shared/simpleTools/upload';
import {Button, Divider, Grid, Header, Icon, List, Modal, Segment} from 'semantic-ui-react';
import {ECsvColumnType} from '../../../../shared/simpleTools/upload/types';
import {IStressPeriods} from '../../../../../core/model/modflow/Stressperiods.type';
import {ITimeUnit} from '../../../../../core/model/modflow/TimeUnit.type';
import React, {useState} from 'react';
import Stressperiods from '../../../../../core/model/modflow/Stressperiods';

interface IProps {
    onChange: (sp: Stressperiods) => any;
    stressperiods: Stressperiods;
}

const StressperiodsImport = (props: IProps) => {
    const [errors] = useState<Array<{ message: string }>>([]);
    const [showImportModal, setShowImportModal] = useState<boolean>(false);
    const [showAdvancedImportModal, setShowAdvancedImportModal] = useState<boolean>(false);

    const handleCancel = () => {
        setShowAdvancedImportModal(false);
        setShowImportModal(false);
    };

    const handleClickAdvanced = () => {
        setShowAdvancedImportModal(true);
        setShowImportModal(false);
    };

    const handleSubmitAdvancedModal = (result: any[][]) => {
        setShowAdvancedImportModal(false);

        if (result[0].length !== 4) {
            return null;
        }

        const stressPeriods: IStressPeriods = {
            start_date_time: result[0][0],
            end_date_time: result[result.length - 1][0],
            stressperiods: result.filter((sp, sKey) => sKey < (result.length - 1)).map((row) => {
                return {
                    start_date_time: row[0],
                    nstp: row[1],
                    tsmult: row[2],
                    steady: row[3]
                };
            }),
            time_unit: ITimeUnit.days
        };
        return props.onChange(Stressperiods.fromObject(stressPeriods));
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

    const handleClickUpload = () => setShowImportModal(true);

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

    const renderAdvancedImportModal = () => {
        return (
            <AdvancedCsvUpload
                columns={[
                    {key: 0, value: 'start_date_time', text: 'Start date', type: ECsvColumnType.DATE_TIME},
                    {key: 1, value: 'nstp', text: 'NSTP'},
                    {key: 2, value: 'tsmult', text: 'TSMULT'},
                    {key: 3, value: 'steady', text: 'Steady', type: ECsvColumnType.BOOLEAN}
                ]}
                onSave={handleSubmitAdvancedModal}
                onCancel={handleCancel}
            />
        );
    };

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
                                            <Divider vertical={true}/>
                                            <Grid.Column>
                                                <Header as={'h3'}>
                                                    Upload Stressperiods
                                                </Header>
                                                <Button
                                                    fluid={true}
                                                    icon={true}
                                                    labelPosition={'left'}
                                                    onClick={handleClickAdvanced}
                                                    primary={true}
                                                >
                                                    <Icon name="upload"/>
                                                    Upload
                                                </Button>
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </Segment>
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
            {showAdvancedImportModal && renderAdvancedImportModal()}
        </div>
    );
};

export default StressperiodsImport;
