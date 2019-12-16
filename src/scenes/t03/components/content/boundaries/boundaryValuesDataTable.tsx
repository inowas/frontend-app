import { cloneDeep } from 'lodash';
import moment from 'moment';
import React, {ChangeEvent, useState} from 'react';
import {Button, Icon, Input, Table} from 'semantic-ui-react';
import {Stressperiods} from '../../../../../core/model/modflow';
import {Boundary, LineBoundary} from '../../../../../core/model/modflow/boundaries';
import {ISpValues} from '../../../../../core/model/modflow/boundaries/Boundary.type';
import {AdvancedCsvUpload} from '../../../../shared/simpleTools/upload';

interface IActiveInput {
    col: number;
    name: string;
    row: number;
    value: string;
}

interface IProps {
    boundary: Boundary;
    onChange: (boundary: Boundary) => any;
    readOnly: boolean;
    selectedOP?: string;
    stressperiods: Stressperiods;
}

const boundaryValuesDataTable = (props: IProps) => {
    const [activeInput, setActiveInput] = useState<IActiveInput | null>(null);
    const [showUploadModal, setShowUploadModal] = useState<boolean>(false);

    const {boundary, selectedOP} = props;

    const getSpValues = () => {
        if (boundary instanceof LineBoundary) {
            return selectedOP ? boundary.getSpValues(props.stressperiods, selectedOP) : null;
        }
        return boundary.getSpValues(props.stressperiods);
    };

    const spValues: ISpValues | null = getSpValues();

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
            const updatedSpValues = props.stressperiods.getSpValues(spValues).map((spv, spvIdx) => {
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
        if (spValues) {
            const updatedSpValues = spValues.map((spv, key) => {
                return data[key];
            });
            boundary.setSpValues(updatedSpValues, selectedOP);
        }
        return props.onChange(boundary);
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
        const {stressperiods} = props;

        const dateTimes = stressperiods.dateTimes;

        if (!spValues) {
            return (
                <Table.Row>
                    <Table.Cell>There are no stress period values.</Table.Cell>
                </Table.Row>
            );
        }

        return spValues.map((spValue, spIdx) => (
            <Table.Row key={spIdx}>
                <Table.Cell width={4}>
                    <Input
                        style={getCellStyle(1)}
                        disabled={true}
                        id={spIdx}
                        name={'dateTime'}
                        type={'date'}
                        value={moment(dateTimes[spIdx]).format('YYYY-MM-DD')}
                    />
                </Table.Cell>
                {spValue.map((v, vIdx) => (
                    <Table.Cell key={vIdx}>
                        <Input
                            style={getCellStyle(spValue.length)}
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
            />
            }
            <p style={{marginTop: '10px'}}>
                <b>Time dependent boundary values{boundary instanceof LineBoundary ? ' observation point' : ''}</b>
                <Button
                    icon={true}
                    labelPosition="left"
                    onClick={handleToggleUploadModal}
                    primary={true}
                    floated="right"
                    size="mini"
                >
                    <Icon name="upload" />
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
                    </Table.Row>
                </Table.Header>
                <Table.Body>{spValues && body()}</Table.Body>
            </Table>
        </div>
    );
};

export default boundaryValuesDataTable;
