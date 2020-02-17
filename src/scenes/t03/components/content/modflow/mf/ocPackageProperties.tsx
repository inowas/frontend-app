import React, {ChangeEvent, SyntheticEvent, useState} from 'react';
import {
    Checkbox,
    DropdownProps,
    Form,
    Grid,
    Header,
    Input,
    InputOnChangeData,
    Segment,
    Table
} from 'semantic-ui-react';
import {FlopyModflowMfdis, FlopyModflowMfoc} from '../../../../../../core/model/flopy/packages/mf';
import FlopyModflow from '../../../../../../core/model/flopy/packages/mf/FlopyModflow';
import renderInfoPopup from '../../../../../shared/complexTools/InfoPopup';
import ToggleableInput from '../../../../../shared/complexTools/ToggleableInput';
import {PopupPosition} from '../../../../../types';
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

interface IProps {
    mfPackages: FlopyModflow;
    mfPackage: FlopyModflowMfoc;
    onChange: (p: FlopyModflowMfoc) => any;
    readonly: boolean;
}

const ocPackageProperties = (props: IProps) => {
    const [activeInput, setActiveInput] = useState<string | null>(null);
    const [activeValue, setActiveValue] = useState<string>('');

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>, {name, value}: InputOnChangeData) => {
        setActiveValue(value);
        setActiveInput(name);
    };

    const handleOnChangeToggleable = (name: string, value: string | number | null) => {
        const cMfPackage = props.mfPackage.toObject();
        cMfPackage[name] = value;
        return props.onChange(FlopyModflowMfoc.fromObject(cMfPackage));
    };

    const handleOnBlur = () => {
        if (!activeInput) {
            return null;
        }
        const cMfPackage = props.mfPackage.toObject();
        if (cMfPackage.hasOwnProperty(activeInput)) {
            cMfPackage[activeInput] = activeValue;
            props.onChange(FlopyModflowMfoc.fromObject(cMfPackage));
        }
        setActiveInput(null);
        setActiveValue('');
    };

    const handleOnSelect = (e: SyntheticEvent, {name, value}: DropdownProps) => {
        const cMfPackage = props.mfPackage.toObject();
        cMfPackage[name] = value;
        return props.onChange(FlopyModflowMfoc.fromObject(cMfPackage));
    };

    const handleChangeCompact = () => {
        const cMfPackage = props.mfPackage.toObject();
        cMfPackage.compact = !cMfPackage.compact;
        return props.onChange(FlopyModflowMfoc.fromObject(cMfPackage));
    };

    const handleToggleCheckBox = (per: number, stp: number, text: string) => {
        const cMfPackage = props.mfPackage.toObject();
        let {stress_period_data} = cMfPackage;

        stress_period_data = stress_period_data.map((spd) => {
            if (spd[0][0] === per && spd[0][1] === stp) {
                if (spd[1].includes(text)) {
                    spd[1] = spd[1].filter((d) => d !== text);
                    return spd;
                }

                spd[1].push(text);
                return spd;
            }
            return spd;
        });
        cMfPackage.stress_period_data = stress_period_data;
        return props.onChange(FlopyModflowMfoc.fromObject(cMfPackage));
    };

    const renderOCDataTable = () => {
        const stressPeriodData = props.mfPackage.stress_period_data;
        const disPackage = props.mfPackages.getPackage('dis');
        if (!(disPackage instanceof FlopyModflowMfdis)) {
            return null;
        }

        const {nper, nstp} = disPackage;

        let tableData: Array<[[number, number], string[]]> = [];
        for (let per = 0; per < nper; per++) {
            for (let stp = 0; stp < nstp; stp++) {
                tableData.push([[per, stp], []]);
            }
        }

        stressPeriodData.forEach((spd) => {
            tableData = tableData.map((d) => {
                if (d[0][0] === spd[0][0] && d[0][1] === spd[0][1]) {
                    return spd;
                }
                return d;
            });
        });

        return (
            <Table collapsing={true} size={'small'} className={'packages'}>
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
                                        onChange={() => handleToggleCheckBox(per, stp, 'save head')}
                                        checked={d[1].includes('save head')}
                                        disabled={props.readonly}
                                    />
                                </Table.Cell>
                                <Table.Cell>
                                    <Checkbox
                                        onChange={() => handleToggleCheckBox(per, stp, 'save drawdown')}
                                        checked={d[1].includes('save drawdown')}
                                        disabled={props.readonly}
                                    />
                                </Table.Cell>
                                <Table.Cell>
                                    <Checkbox
                                        onChange={() => handleToggleCheckBox(per, stp, 'save budget')}
                                        checked={d[1].includes('save budget')}
                                        disabled={props.readonly}
                                    />
                                </Table.Cell>
                            </Table.Row>
                        );
                    })}
                </Table.Body>
            </Table>
        );
    };
    if (!props.mfPackage) {
        return null;
    }
    return (
        <Form>
            <Header as={'h3'}>OC: Output Control Package</Header>
            <Segment>
                <Grid>
                    <Grid.Row columns={2}>
                        <Grid.Column>
                            <Form.Group>
                                <Form.Field width={14}>
                                    <label>Format for printing heads (ihedfm)</label>
                                    <Form.Dropdown
                                        options={formats.map((f) => ({
                                            key: f[0], value: f[0], text: `${f[0]}: ${f[1]}`
                                        }))}
                                        placeholder="Select ihedfm"
                                        name="ihedfm"
                                        selection={true}
                                        value={props.mfPackage.ihedfm}
                                        disabled={props.readonly}
                                        onChange={handleOnSelect}
                                    />
                                </Form.Field>
                                <Form.Field width={1}>
                                    <label>&nbsp;</label>
                                    {renderInfoPopup(documentation.ihedfm, 'ihedfm', PopupPosition.TOP_LEFT, true)}
                                </Form.Field>
                            </Form.Group>
                            <Form.Group>
                                <Form.Field width={14}>
                                    <label>Format for printing drawdowns (iddnfm)</label>
                                    <Form.Dropdown
                                        options={formats.map((f) => ({
                                            key: f[0], value: f[0], text: `${f[0]}: ${f[1]}`
                                        }))}
                                        placeholder="Select iddnfm"
                                        name="iddnfm"
                                        selection={true}
                                        value={props.mfPackage.iddnfm}
                                        disabled={props.readonly}
                                        onChange={handleOnSelect}
                                    />
                                </Form.Field>
                                <Form.Field width={1}>
                                    <label>&nbsp;</label>
                                    {renderInfoPopup(documentation.iddnfm, 'iddnfm', PopupPosition.TOP_LEFT, true)}
                                </Form.Field>
                            </Form.Group>
                            <Form.Group>
                                <Form.Field width={14}>
                                    <label>Compact budget form (compact)</label>
                                    <Checkbox
                                        toggle={true}
                                        disabled={props.readonly}
                                        name="compact"
                                        onChange={handleChangeCompact}
                                        checked={props.mfPackage.compact}
                                    />
                                </Form.Field>
                                <Form.Field width={1}>
                                    <label/>
                                    {renderInfoPopup(documentation.compact, 'compact', PopupPosition.TOP_LEFT, true)}
                                </Form.Field>
                            </Form.Group>
                        </Grid.Column>
                        <Grid.Column>
                            <Form.Field>
                                <label>Format for saving heads (chedfm)</label>
                                <ToggleableInput
                                    readOnly={props.readonly}
                                    name="chedfm"
                                    value={props.mfPackage.chedfm}
                                    onChange={handleOnChangeToggleable}
                                    placeholder=""
                                    type="string"
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Format for saving drawdowns (cddnfm)</label>
                                <ToggleableInput
                                    readOnly={props.readonly}
                                    name="cddnfm"
                                    value={props.mfPackage.cddnfm}
                                    onChange={handleOnChangeToggleable}
                                    placeholder=""
                                    type="string"
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Format for saving ibound (cboufm)</label>
                                <ToggleableInput
                                    readOnly={props.readonly}
                                    name="cboufm"
                                    value={props.mfPackage.cboufm}
                                    onChange={handleOnChangeToggleable}
                                    placeholder=""
                                    type="string"
                                />
                            </Form.Field>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
            <Segment>
                {renderOCDataTable()}
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>List of boundaries (stress_period_data)</label>
                        <Input
                            readOnly={props.readonly}
                            name="stress_period_data"
                            value={JSON.stringify(props.mfPackage.stress_period_data)}
                            icon={renderInfoPopup(documentation.stress_period_data, 'stress_period_data')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Label (label)</label>
                        <Input
                            readOnly={props.readonly}
                            name="label"
                            value={activeInput === 'label' ? activeValue : props.mfPackage.label}
                            icon={renderInfoPopup(documentation.label, 'label')}
                            onBlur={handleOnBlur}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                </Form.Group>
            </Segment>
            <Form.Group widths="equal">
                <Form.Field>
                    <label>Filename extension (extension)</label>
                    <Input
                        readOnly={true}
                        name="extension"
                        value={props.mfPackage.extension || ''}
                        icon={renderInfoPopup(documentation.extension, 'extension')}
                    />
                </Form.Field>
                <Form.Field>
                    <label>File unit number (unitnumber)</label>
                    <Input
                        readOnly={true}
                        name="unitnumber"
                        value={props.mfPackage.unitnumber || ''}
                        icon={renderInfoPopup(documentation.unitnumber, 'unitnumber')}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Filenames (filenames)</label>
                    <Input
                        readOnly={true}
                        name="filenames"
                        value={props.mfPackage.filenames || ''}
                        icon={renderInfoPopup(documentation.filenames, 'filenames')}
                    />
                </Form.Field>
            </Form.Group>
        </Form>
    );
};

export default ocPackageProperties;
