import PropTypes from 'prop-types';
import React from 'react';
import {Checkbox, Form, Input, Table} from 'semantic-ui-react';

import AbstractPackageProperties from './AbstractPackageProperties';
import {FlopyModflow, FlopyModflowMfoc} from '../../../../../../core/model/flopy/packages/mf';
import {documentation} from '../../../../defaults/flow';

const formats = [
    [0, '10G11.4'],
    [1, '11G10.3'],
    [2, '9G13.6'],
    [3, '15F7.1'],
    [4, '15F7.2'],
    [5, '15F7.3'],
    [6, '15F7.4'],
    [7, '20F5.0'],
    [8, '20F5.1'],
    [9, '20F5.2'],
    [10, '20F5.3'],
    [11, '20F5.4'],
    [12, '10G11.4'],
    [13, '10F6.0'],
    [14, '10F6.1'],
    [15, '10F6.2'],
    [16, '10F6.3'],
    [17, '10F6.4'],
    [18, '10F6.5'],
    [19, '5G12.5'],
    [20, '6G11.4'],
    [21, '7G9.2'],
];

class OcPackageProperties extends AbstractPackageProperties {

    onToggleCheckBox = (per, stp, text) => {
        const mfPackage = FlopyModflowMfoc.fromObject(this.state.mfPackage);
        let {stress_period_data} = mfPackage;

        stress_period_data = stress_period_data.map(spd => {
            if (spd[0][0] === per && spd[0][1] === stp) {
                if (spd[1].includes(text)) {
                    spd[1] = spd[1].filter(d => d !== text);
                    return spd;
                }

                spd[1].push(text);
                return spd;
            }
            return spd;
        });

        mfPackage.stress_period_data = stress_period_data;
        this.props.onChange(mfPackage);
    };

    renderOCDataTable = (stress_period_data) => {

        const disPackage = this.props.mfPackages.getPackage('dis');
        const {nper, nstp} = disPackage;

        let tableData = [];
        for (let per = 0; per < nper; per++) {
            for (let stp = 0; stp < nstp; stp++) {
                tableData.push([[per, stp], []]);
            }
        }

        stress_period_data.forEach(spd => {
            tableData = tableData.map(d => {
                if (d[0][0] === spd[0][0] && d[0][1] === spd[0][1]) {
                    return spd;
                }
                return d;
            })
        });

        return (
            <Table basic>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>SP</Table.HeaderCell>
                        <Table.HeaderCell>TS</Table.HeaderCell>
                        <Table.HeaderCell>Save Head</Table.HeaderCell>
                        <Table.HeaderCell>Save Drawdown</Table.HeaderCell>
                        <Table.HeaderCell>Save Budget</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {tableData.map((d, idx) => {
                        const [per, stp] = d[0];

                        return (
                            <Table.Row key={idx}>
                                <Table.Cell>{per}</Table.Cell>
                                <Table.Cell>{stp}</Table.Cell>
                                <Table.Cell>
                                    <Checkbox
                                        onChange={() => this.onToggleCheckBox(per, stp, 'save head')}
                                        checked={d[1].includes('save head')}
                                        disabled={this.props.readonly}
                                    />
                                </Table.Cell>
                                <Table.Cell>
                                    <Checkbox
                                        onChange={() => this.onToggleCheckBox(per, stp, 'save drawdown')}
                                        checked={d[1].includes('save drawdown')}
                                        disabled={this.props.readonly}
                                    />
                                </Table.Cell>
                                <Table.Cell>
                                    <Checkbox
                                        onChange={() => this.onToggleCheckBox(per, stp, 'save budget')}
                                        checked={d[1].includes('save budget')}
                                        disabled={this.props.readonly}
                                    />
                                </Table.Cell>
                            </Table.Row>
                        )
                    })}
                </Table.Body>
            </Table>
        )
    };


    render() {
        if (!this.state.mfPackage) {
            return null;
        }

        const mfPackage = FlopyModflowMfoc.fromObject(this.state.mfPackage);
        const readOnly = this.props.readonly;

        return (
            <Form>
                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Format for printing head (ihedfm)</label>
                        <Form.Dropdown
                            options={formats.map(f => ({
                                key: f[0], value: f[0], text: `${f[0]}: ${f[1]}`
                            }))}
                            placeholder='Select ihedfm'
                            name='ihedfm'
                            selection
                            value={mfPackage.ihedfm}
                            disabled={readOnly}
                            onChange={this.handleOnSelect}
                        />
                    </Form.Field>
                    <Form.Field width={1}>
                        <label>&nbsp;</label>
                        {this.renderInfoPopup(documentation.ihedfm, 'ihedfm', 'top left', true)}
                    </Form.Field>

                    <Form.Field>
                        <label>Format for printing drawdown (iddnfm)</label>
                        <Form.Dropdown
                            options={formats.map(f => ({
                                key: f[0], value: f[0], text: `${f[0]}: ${f[1]}`
                            }))}
                            placeholder='Select iddnfm'
                            name='iddnfm'
                            selection
                            value={mfPackage.iddnfm}
                            disabled={readOnly}
                            onChange={this.handleOnSelect}
                        />
                    </Form.Field>
                    <Form.Field width={1}>
                        <label>&nbsp;</label>
                        {this.renderInfoPopup(documentation.iddnfm, 'iddnfm', 'top left', true)}
                    </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Format saving head (chedfm)</label>
                        <Input
                            readOnly={readOnly}
                            name='chedfm'
                            value={mfPackage.chedfm || ''}
                            icon={this.renderInfoPopup(documentation.chedfm, 'chedfm')}
                            onBlur={this.handleOnBlur}
                            onChange={this.handleOnChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Format saving drawdown (cddnfm)</label>
                        <Input
                            readOnly={readOnly}
                            name='cddnfm'
                            value={mfPackage.cddnfm || ''}
                            icon={this.renderInfoPopup(documentation.cddnfm, 'cddnfm')}
                            onBlur={this.handleOnBlur}
                            onChange={this.handleOnChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Format saving ibound (cboufm)</label>
                        <Input
                            readOnly={readOnly}
                            name='cboufm'
                            value={mfPackage.cboufm || ''}
                            icon={this.renderInfoPopup(documentation.cboufm, 'cboufm')}
                            onBlur={this.handleOnBlur}
                            onChange={this.handleOnChange}
                        />
                    </Form.Field>
                </Form.Group>

                {this.renderOCDataTable(mfPackage.stress_period_data)}

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>List of boundaries (stress_period_data)</label>
                        <Input
                            readOnly={readOnly}
                            name='stress_period_data'
                            value={JSON.stringify(mfPackage.stress_period_data)}
                            icon={this.renderInfoPopup(documentation.stress_period_data, 'stress_period_data')}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Compact budget form (compact)</label>
                        <Form.Dropdown
                            options={[
                                {key: 0, value: false, text: 'false'},
                                {key: 1, value: true, text: 'true'},
                            ]}
                            placeholder='Select compact'
                            name='compact'
                            selection
                            value={mfPackage.compact}
                            disabled={readOnly}
                            onChange={this.handleOnSelect}
                        />
                    </Form.Field>
                    <Form.Field width={1}>
                        <label>&nbsp;</label>
                        {this.renderInfoPopup(documentation.compact, 'compact', 'top left', true)}
                    </Form.Field>

                    <Form.Field>
                        <label>Label (label)</label>
                        <Input
                            readOnly={readOnly}
                            name='label'
                            value={mfPackage.label}
                            icon={this.renderInfoPopup(documentation.label, 'label')}
                            onBlur={this.handleOnChange}
                            onChange={this.handleOnChange}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Filename extension (extension)</label>
                        <Input
                            readOnly
                            name='extension'
                            value={mfPackage.extension || ''}
                            icon={this.renderInfoPopup(documentation.extension, 'extension')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>File unit number (unitnumber)</label>
                        <Input
                            readOnly
                            name='unitnumber'
                            value={mfPackage.unitnumber || ''}
                            icon={this.renderInfoPopup(documentation.unitnumber, 'unitnumber')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Filenames (filenames)</label>
                        <Input
                            readOnly
                            name='filenames'
                            value={mfPackage.filenames || ''}
                            icon={this.renderInfoPopup(documentation.filenames, 'filenames')}
                        />
                    </Form.Field>
                </Form.Group>
            </Form>
        );
    }
}

OcPackageProperties.propTypes = {
    mfPackages: PropTypes.instanceOf(FlopyModflow),
    mfPackage: PropTypes.instanceOf(FlopyModflowMfoc),
    onChange: PropTypes.func.isRequired,
    readonly: PropTypes.bool.isRequired
};


export default OcPackageProperties;
