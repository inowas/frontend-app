import moment from 'moment';
import React, {ChangeEvent} from 'react';
import {Input, InputOnChangeData, Table} from 'semantic-ui-react';
import {Boundary, Stressperiods} from '../../../../../core/model/modflow';
import {Substance} from '../../../../../core/model/modflow/transport';
import NoContent from '../../../../shared/complexTools/noContent';

interface IBoundaryConcentration {
    id: string;
    concentrations: number[];
}

interface IProps {
    selectedBoundaryId: string;
    onChange: (substance: Substance) => any;
    readOnly?: boolean;
    stressperiods: Stressperiods;
    substance: Substance;
}

interface IState {
    spValues: Array<number | string>;
}

export class SubstanceValuesDataTable extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            spValues: this.spValuesFromProps(props)
        };
    }

    public componentWillReceiveProps(nextProps: IProps) {
        this.setState({
            spValues: this.spValuesFromProps(nextProps)
        });
    }

    public spValuesFromProps(props: IProps) {
        const spValues = props.substance.boundaryConcentrations.filter((bc: IBoundaryConcentration) =>
            bc.id === props.selectedBoundaryId);
        if (spValues.length > 0) {
            return spValues[0].concentrations;
        }
        return [];
    }

    public handleLocalChange = (e: ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
        this.setState((prevState: IState) => (
            {
                spValues: prevState.spValues.map((value: number | string, key: number) => {
                    if (key === data.id) {
                        return data.value;
                    }
                    return value;
                })
            }
        ));
    };

    public handleBlur = () => {
        const substance = this.props.substance;
        substance.boundaryConcentrations = substance.boundaryConcentrations.map((bc: IBoundaryConcentration) => {
            if (bc.id === this.props.selectedBoundaryId) {
                return {
                    id: bc.id,
                    concentrations: this.state.spValues
                };
            }
            return bc;
        });
        return this.props.onChange(substance);
    };

    public body = () => {
        const {stressperiods} = this.props;
        const {spValues} = this.state;
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
                        disabled={this.props.readOnly}
                        id={spIdx}
                        name={'dateTimeValue'}
                        onBlur={this.handleBlur}
                        onChange={this.handleLocalChange}
                        type={'number'}
                        value={spValue}
                    />
                </Table.Cell>
            </Table.Row>
        ));
    };

    public render() {
        const {spValues} = this.state;

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
                    <Table.Body>{spValues.length > 0 && this.body()}</Table.Body>
                </Table>
            </div>
        );
    }
}
