import {cloneDeep} from 'lodash';
import moment, {DurationInputArg1, DurationInputArg2} from 'moment';
import React, {ChangeEvent, useState} from 'react';
import {Button, Icon, Input, InputOnChangeData, Table} from 'semantic-ui-react';
import {Stressperiods} from '../../../../../core/model/modflow';
import {
    Boundary,
    FlowAndHeadBoundary,
    HeadObservationWell
} from '../../../../../core/model/modflow/boundaries';
import {ISpValues} from '../../../../../core/model/modflow/boundaries/Boundary.type';
import {AdvancedCsvUpload} from '../../../../shared/simpleTools/upload';

interface IActiveInput {
    col: number;
    name: string;
    row: number;
    value: string;
}

interface IActiveString {
    idx: number;
    value: string;
}

interface IProps {
    boundary: HeadObservationWell | FlowAndHeadBoundary;
    onChange: (boundary: Boundary) => any;
    readOnly: boolean;
    selectedOP?: string;
    stressperiods: Stressperiods;
}

const boundaryDateTimeValuesDataTable = (props: IProps) => {
    const [activeInput, setActiveInput] = useState<IActiveInput | null>(null);
    const [activeDateTime, setActiveDateTime] = useState<IActiveString | null>(null);
    const [showUploadModal, setShowUploadModal] = useState<boolean>(false);

    const {boundary, selectedOP} = props;

    const getSpValues = () => {
        if (boundary instanceof FlowAndHeadBoundary) {
            return selectedOP ? boundary.getSpValues(props.stressperiods, selectedOP) : null;
        }
        return boundary.getSpValues(props.stressperiods);
    };

    const spValues: ISpValues | null = getSpValues();

    const handleChangeDateTime = () => {
        if (activeDateTime) {
            props.onChange(boundary.changeDateTime(activeDateTime.value, activeDateTime.idx, selectedOP));
        }
        return setActiveDateTime(null);
    };

    const handleLocalChangeDateTime = (
        e: ChangeEvent<HTMLInputElement>, {value, idx}: InputOnChangeData
    ) => setActiveDateTime({
        idx,
        value
    });

    const handleToggleUploadModal = () => setShowUploadModal(!showUploadModal);

    const handleLocalChange = (row: number, col: number) => (e: ChangeEvent<HTMLInputElement>) => setActiveInput({
        col,
        name: e.target.name,
        row,
        value: e.target.value
    });

    const handleSpValuesChange = () => {
        if (!activeInput) {
            return;
        }
        const {value, row, col} = activeInput;
        setActiveInput(null);

        if (spValues) {
            const updatedSpValues = boundary.getSpValues(props.stressperiods, selectedOP).map((spv, spvIdx) => {
                const newRow = cloneDeep(spv);
                if (row === spvIdx) {
                    newRow[col] = parseFloat(value) || 0;
                    return newRow;
                }
                return newRow;
            });
            boundary.setSpValues(updatedSpValues as ISpValues, selectedOP);
        }
        return props.onChange(boundary);
    };

    const handleImportCsv = (data: any[][]) => {
        const fData = cloneDeep(data).map((row) => {
            return row.splice(1, boundary.valueProperties.length);
        });
        const dateTimes = data.map((row) => {
            if (moment.isMoment(row[0])) {
                return row.shift();
            }
            return moment();
        });

        if (boundary instanceof FlowAndHeadBoundary && selectedOP) {
            boundary.updateDateTimeValues(selectedOP, fData, dateTimes);
            return props.onChange(boundary);
        }

        if (boundary instanceof HeadObservationWell) {
            boundary.dateTimes = dateTimes;
            boundary.setSpValues(fData);
            return props.onChange(boundary);
        }
    };

    const handleAddDateTime = (value: DurationInputArg1, unit: DurationInputArg2) => () => {
        return props.onChange(boundary.addDateTime(value, unit, selectedOP, props.stressperiods));
    };

    const handleRemoveDateTime = (idx: number) => () => {
        props.onChange(boundary.removeDateTime(idx, selectedOP));
    };

    const getCellStyle = (numberOfCells: number) => {
        switch (numberOfCells) {
            case 2:
                return {
                    maxWidth: '130px',
                    padding: 0,
                    border: 0
                };
            case 3:
                return {
                    maxWidth: '130px',
                    padding: 0,
                    border: 0
                };
            default:
                return {
                    maxWidth: '150px',
                    padding: 0,
                    border: 0
                };
        }
    };

    const body = () => {
        const dateTimes = boundary.getDateTimes(props.stressperiods, selectedOP);

        if (!spValues) {
            return (
                <Table.Row>
                    <Table.Cell>There are no stress period values.</Table.Cell>
                </Table.Row>
            );
        }

        return dateTimes.map((dt, spIdx) => (
            <Table.Row key={spIdx}>
                <Table.Cell width={4}>
                    <Input
                        style={getCellStyle(1)}
                        disabled={props.readOnly}
                        idx={spIdx}
                        name={'dateTime'}
                        onBlur={handleChangeDateTime}
                        onChange={handleLocalChangeDateTime}
                        type={'date'}
                        value={
                            activeDateTime && activeDateTime.idx === spIdx ? activeDateTime.value :
                                moment(dateTimes[spIdx]).format('YYYY-MM-DD')
                        }
                    />
                </Table.Cell>
                {spValues[spIdx].map((v, vIdx) => (
                    <Table.Cell key={vIdx}>
                        <Input
                            style={getCellStyle(spValues[spIdx].length)}
                            disabled={props.readOnly}
                            id={spIdx}
                            col={vIdx}
                            name={'dateTimeValue'}
                            onBlur={handleSpValuesChange}
                            onChange={handleLocalChange(spIdx, vIdx)}
                            type={'number'}
                            value={activeInput && activeInput.col === vIdx && activeInput.row === spIdx ?
                                activeInput.value : v}
                        />
                    </Table.Cell>
                ))}
                <Table.Cell>
                    {!props.readOnly &&
                    <Button
                        basic={true}
                        floated={'right'}
                        icon={'trash'}
                        onClick={handleRemoveDateTime(spIdx)}
                    />
                    }
                </Table.Cell>
            </Table.Row>
        ));
    };

    return (
        <div>
            {showUploadModal &&
            <AdvancedCsvUpload
                columns={
                    boundary.valueProperties.map((p, key) => {
                        return {
                            key: key + 1,
                            value: p.name.toLowerCase(),
                            text: p.name
                        };
                    })
                }
                onCancel={handleToggleUploadModal}
                onSave={handleImportCsv}
                useDateTimes={true}
            />
            }
            <p style={{marginTop: '10px'}}>
                <b>
                    Time dependent boundary
                    values{boundary instanceof FlowAndHeadBoundary ? ' observation point' : ''}
                </b>
                <Button
                    icon={true}
                    labelPosition="left"
                    onClick={handleToggleUploadModal}
                    primary={true}
                    floated="right"
                    size="mini"
                >
                    <Icon name="upload"/>
                    Upload csv
                </Button>
            </p>
            <Table size={'small'} singleLine={true}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Start Date</Table.HeaderCell>
                        {boundary.valueProperties.map((p, idx) => (
                            <Table.HeaderCell key={idx}>{p.name} ({p.unit})</Table.HeaderCell>
                        ))}
                        {!props.readOnly &&
                        <Table.HeaderCell/>
                        }
                    </Table.Row>
                </Table.Header>
                <Table.Body>{spValues && body()}</Table.Body>
            </Table>
            <Button.Group size="small">
                <Button icon={true} onClick={handleAddDateTime(1, 'days')}>
                    <Icon name="add circle"/> 1 Day</Button>
                <Button icon={true} onClick={handleAddDateTime(1, 'months')}>
                    <Icon name="add circle"/> 1 Month</Button>
                <Button icon={true} onClick={handleAddDateTime(1, 'years')}>
                    <Icon name="add circle"/> 1 Year</Button>
            </Button.Group>
        </div>
    );
};

export default boundaryDateTimeValuesDataTable;
