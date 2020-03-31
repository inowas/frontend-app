import moment from 'moment';
import React, {ChangeEvent, useEffect, useState} from 'react';
import {Input, InputOnChangeData, Table} from 'semantic-ui-react';
import {Stressperiods} from '../../../../../core/model/modflow';
import {Substance} from '../../../../../core/model/modflow/transport';
import {IBoundaryConcentration} from '../../../../../core/model/modflow/transport/Substance.type';
import NoContent from '../../../../shared/complexTools/noContent';

interface IProps {
    selectedBoundaryId: string;
    onChange: (substance: Substance) => any;
    readOnly?: boolean;
    stressperiods: Stressperiods;
    substance: Substance;
}

const substanceValuesDataTable = (props: IProps) => {
    const [spValues, setSpValues] = useState<Array<number | string>>([]);

    useEffect(() => {
        setSpValues(spValuesFromProps(props));
    }, [props.substance, props.selectedBoundaryId]);

    const spValuesFromProps = (p: IProps) => {
        const cSpValues = p.substance.boundaryConcentrations.filter((bc: IBoundaryConcentration) =>
            bc.id === p.selectedBoundaryId);
        if (cSpValues.length > 0) {
            return cSpValues[0].concentrations;
        }
        return [];
    };

    const handleLocalChange = (e: ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
        setSpValues(spValues.map((value: number | string, key: number) => {
            if (key === data.id) {
                return data.value;
            }
            return value;
        }));
    };

    const handleBlur = () => {
        const substance = props.substance;
        substance.boundaryConcentrations = substance.boundaryConcentrations.map((bc: IBoundaryConcentration) => {
            if (bc.id === props.selectedBoundaryId) {
                return {
                    id: bc.id,
                    concentrations: spValues.map((v: string | number) => {
                        if (!v || v === '') {
                            return 0;
                        }
                        if (typeof v === 'string') {
                            return parseFloat(v);
                        }
                        return v;
                    })
                };
            }
            return bc;
        });
        return props.onChange(substance);
    };

    const body = () => {
        const {stressperiods} = props;
        const dateTimes = stressperiods.dateTimes;

        if (dateTimes.length !== spValues.length) {
            return;
        }

        return spValues.map((spValue, spIdx) => (
            <Table.Row key={spIdx}>
                <Table.Cell width={4}>
                    <Input
                        disabled={true}
                        id={spIdx}
                        name={'dateTime'}
                        type={'date'}
                        value={moment(dateTimes[spIdx]).format('YYYY-MM-DD')}
                    />
                </Table.Cell>
                <Table.Cell>
                    <Input
                        disabled={props.readOnly}
                        id={spIdx}
                        name={'dateTimeValue'}
                        onBlur={handleBlur}
                        onChange={handleLocalChange}
                        type={'number'}
                        value={spValue}
                    />
                </Table.Cell>
            </Table.Row>
        ));
    };

    if (!spValues || spValues.length === 0) {
        return <NoContent message={'Error: Try to remove this boundary and add it again.'}/>;
    }

    return (
        <div>
            <Table size={'small'} singleLine={true}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Start Date</Table.HeaderCell>
                        <Table.HeaderCell>Concentration</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>{spValues.length > 0 && body()}</Table.Body>
            </Table>
        </div>
    );
};

export default substanceValuesDataTable;
