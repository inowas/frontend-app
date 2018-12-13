import * as React from 'react';
import PropTypes from 'prop-types';
import {pure} from 'recompose';
import {Form, Input} from 'semantic-ui-react';
import SsmPackageDataTable from './SsmPackageDataTable';
import {SsmBoundaryValues, SsmSubstance} from 'core/model/modflow/mt3d';
import Boundary from 'core/model/modflow/boundaries/Boundary';
import {Stressperiods} from 'core/model/modflow';

const styles = {
    inputFix: {
        padding: '0',
        height: 'auto'
    }
};

class SsmSubstanceEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            substance: props.substance.toObject
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            substance: nextProps.substance.toObject
        });
    }

    getSsmBoundaryValuesOrDefault() {
        const {boundary, stressPeriods} = this.props;
        const substance = SsmSubstance.fromObject(this.state.substance);
        return substance.getBoundaryValuesByBoundaryId(this.props.boundary.id) ||
            SsmBoundaryValues.create(boundary, stressPeriods.count);
    }

    handleChangeName = (e) => {
        const substance = SsmSubstance.fromObject(this.state.substance);
        substance.name = e.target.value;
        return this.setState({
            substance: substance.toObject
        });
    };

    handleChangeData = (data) => {
        const values = data.map(d => d.value);
        const substance = SsmSubstance.fromObject(this.state.substance);
        const ssmBoundaryValues = this.getSsmBoundaryValuesOrDefault();
        ssmBoundaryValues.values = values;
        substance.updateBoundaryValues(ssmBoundaryValues);
        this.props.onChange(substance);
        this.setState({
            substance: substance.toObject
        });
    };

    render() {
        const substance = SsmSubstance.fromObject(this.state.substance);
        const ssmBoundaryValues = this.getSsmBoundaryValuesOrDefault();
        const rows = this.props.stressPeriods.dateTimes.map((dt, key) => {
            return {
                id: key,
                date_time: dt,
                value: ssmBoundaryValues.values[key]
            };
        });

        const config = [{property: 'value', label: 'Concentration'}];
        return (
            <Form>
                <Form.Field>
                    <label>Substance name</label>
                    <Input
                        placeholder={'Name'}
                        name={'name'}
                        value={substance.name}
                        onChange={this.handleChangeName}
                        onBlur={() => this.props.onChange(substance)}
                        style={styles.inputFix}
                    />
                </Form.Field>

                <SsmPackageDataTable
                    config={config}
                    readOnly={this.props.readOnly}
                    rows={rows}
                    onChange={this.handleChangeData}
                />
            </Form>
        );
    }
}

SsmSubstanceEditor.propTypes = {
    boundary: PropTypes.instanceOf(Boundary),
    onChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool.isRequired,
    stressPeriods: PropTypes.instanceOf(Stressperiods),
    substance: PropTypes.instanceOf(SsmSubstance),
};

export default pure(SsmSubstanceEditor);
