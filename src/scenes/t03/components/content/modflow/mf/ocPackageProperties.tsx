import {
    Checkbox,
    DropdownProps,
    Form,
    Grid,
    Header,
    Input,
    InputOnChangeData, Pagination, PaginationProps,
    Segment,
    Table
} from 'semantic-ui-react';
import {FlopyModflowMfdis, FlopyModflowMfoc} from '../../../../../../core/model/flopy/packages/mf';
import {IFlopyModflowMfoc} from '../../../../../../core/model/flopy/packages/mf/FlopyModflowMfoc';
import {PopupPosition} from '../../../../../types';
import {documentation} from '../../../../defaults/flow';
import FlopyModflow from '../../../../../../core/model/flopy/packages/mf/FlopyModflow';
import React, {ChangeEvent, MouseEvent, SyntheticEvent, useState} from 'react';
import ToggleableInput from '../../../../../shared/complexTools/ToggleableInput';
import renderInfoPopup from '../../../../../shared/complexTools/InfoPopup';

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

const OcPackageProperties = (props: IProps) => {
    const [activeInput, setActiveInput] = useState<string | null>(null);
    const [activePage, setActivePage] = useState<number>(1);
    const [activeValue, setActiveValue] = useState<string>('');
    const [mfPackage, setMfPackage] = useState<IFlopyModflowMfoc>(props.mfPackage.toObject());

    const rowsPerPage = 20;

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>, {name, value}: InputOnChangeData) => {
        setActiveValue(value);
        setActiveInput(name);
    };

    const handleOnChangeToggleable = (name: string, value: string | number | null) => {
        mfPackage[name] = value;
        setMfPackage(mfPackage);
        return props.onChange(FlopyModflowMfoc.fromObject(mfPackage));
    };

    const handleOnBlur = () => {
        if (!activeInput) {
            return null;
        }
        if (mfPackage.hasOwnProperty(activeInput)) {
            mfPackage[activeInput] = activeValue;
            setMfPackage(mfPackage);
            props.onChange(FlopyModflowMfoc.fromObject(mfPackage));
        }
        setActiveInput(null);
        setActiveValue('');
    };

    const handleOnSelect = (e: SyntheticEvent, {name, value}: DropdownProps) => {
        if (mfPackage.hasOwnProperty(name)) {
            mfPackage[name] = value;
            setMfPackage(mfPackage);
            return props.onChange(FlopyModflowMfoc.fromObject(mfPackage));
        }
    };

    const handleChangeCompact = () => {
        mfPackage.compact = !mfPackage.compact;
        setMfPackage(mfPackage);
        return props.onChange(FlopyModflowMfoc.fromObject(mfPackage));
    };

    const handleChangePage = (e: MouseEvent<HTMLAnchorElement>, r: PaginationProps) => {
        if (typeof r.activePage === 'number') {
            setActivePage(r.activePage);
        }
    };

    const handleToggleAll = (text: string) => {
        let {stress_period_data} = mfPackage;
        const activateAll = stress_period_data.filter((row) => !row[1].includes(text)).length > 0;
        stress_period_data = stress_period_data.map((row) => {
            if (row[1].includes(text) && !activateAll) {
                row[1] = row[1].filter((t) => t !== text);
            }
            if (!row[1].includes(text) && activateAll) {
                row[1].push(text);
            }
            return row;
        });
        mfPackage.stress_period_data = stress_period_data;
        setMfPackage(mfPackage);
        return props.onChange(FlopyModflowMfoc.fromObject(mfPackage));
    };

    const handleToggleCheckBox = (per: number, stp: number, text: string) => {
        let {stress_period_data} = mfPackage;

        const isExisting = stress_period_data.filter((spd) => spd[0][0] === per && spd[0][1] === stp).length > 0;

        if (!isExisting) {
            stress_period_data.push([[per, stp], [text]]);
        } else {
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
        }

        mfPackage.stress_period_data = stress_period_data;
        setMfPackage(mfPackage);
        return props.onChange(FlopyModflowMfoc.fromObject(mfPackage));
    };

    const renderOCDataTable = () => {
        const stressPeriodData = mfPackage.stress_period_data;
        const disPackage = props.mfPackages.getPackage('dis');

        if (!(disPackage instanceof FlopyModflowMfdis)) {
            return null;
        }

        const {nper, nstp} = disPackage;

        let tableData: Array<[[number, number], string[]]> = [];
        for (let per = 0; per < nper; per++) {
            for (let stp = 0; stp < (Array.isArray(nstp) ? nstp[per] : nstp); stp++) {
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

        let showPagination = false;
        const startingIndex = (activePage - 1) * rowsPerPage;
        const endingIndex = startingIndex + rowsPerPage;
        const totalPages = Math.ceil(tableData.length / rowsPerPage);
        if (tableData.length > rowsPerPage) {
            showPagination = true;
            tableData = tableData.slice(startingIndex, endingIndex);
        }

        return (
            <React.Fragment>
                {showPagination &&
                <Pagination
                    activePage={activePage}
                    onPageChange={handleChangePage}
                    totalPages={totalPages}
                />
                }
                <Table size={'small'} className={'packages'}>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>SP</Table.HeaderCell>
                            <Table.HeaderCell>TS</Table.HeaderCell>
                            <Table.HeaderCell textAlign="center">Save Head</Table.HeaderCell>
                            <Table.HeaderCell textAlign="center">Save Drawdown</Table.HeaderCell>
                            <Table.HeaderCell textAlign="center">Save Budget</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {tableData.length > 1 &&
                        <Table.Row>
                            <Table.Cell/>
                            <Table.Cell/>
                            <Table.Cell textAlign="center">
                                <Checkbox
                                    onChange={() => handleToggleAll('save head')}
                                    checked={tableData.filter((row) => !row[1].includes('save head')).length === 0}
                                    disabled={props.readonly}
                                />
                            </Table.Cell>
                            <Table.Cell textAlign="center">
                                <Checkbox
                                    onChange={() => handleToggleAll('save drawdown')}
                                    checked={tableData.filter((row) => !row[1].includes('save drawdown')).length === 0}
                                    disabled={props.readonly}
                                />
                            </Table.Cell>
                            <Table.Cell textAlign="center">
                                <Checkbox
                                    onChange={() => handleToggleAll('save budget')}
                                    checked={tableData.filter((row) => !row[1].includes('save budget')).length === 0}
                                    disabled={props.readonly}
                                />
                            </Table.Cell>
                        </Table.Row>
                        }
                        {tableData.map((d, idx) => {
                            const [per, stp] = d[0];

                            return (
                                <Table.Row key={idx}>
                                    <Table.Cell>{per}</Table.Cell>
                                    <Table.Cell>{stp}</Table.Cell>
                                    <Table.Cell textAlign="center">
                                        <Checkbox
                                            onChange={() => handleToggleCheckBox(per, stp, 'save head')}
                                            checked={d[1].includes('save head')}
                                            disabled={props.readonly}
                                        />
                                    </Table.Cell>
                                    <Table.Cell textAlign="center">
                                        <Checkbox
                                            onChange={() => handleToggleCheckBox(per, stp, 'save drawdown')}
                                            checked={d[1].includes('save drawdown')}
                                            disabled={props.readonly}
                                        />
                                    </Table.Cell>
                                    <Table.Cell textAlign="center">
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
            </React.Fragment>
        );
    };
    if (!mfPackage) {
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
                                        value={mfPackage.ihedfm}
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
                                        value={mfPackage.iddnfm}
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
                                        checked={mfPackage.compact}
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
                                    value={mfPackage.chedfm}
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
                                    value={mfPackage.cddnfm}
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
                                    value={mfPackage.cboufm}
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
                            value={JSON.stringify(mfPackage.stress_period_data)}
                            icon={renderInfoPopup(documentation.stress_period_data, 'stress_period_data')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Label (label)</label>
                        <Input
                            readOnly={props.readonly}
                            name="label"
                            value={activeInput === 'label' ? activeValue : mfPackage.label}
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
                        value={mfPackage.extension || ''}
                        icon={renderInfoPopup(documentation.extension, 'extension')}
                    />
                </Form.Field>
                <Form.Field>
                    <label>File unit number (unitnumber)</label>
                    <Input
                        readOnly={true}
                        name="unitnumber"
                        value={mfPackage.unitnumber || ''}
                        icon={renderInfoPopup(documentation.unitnumber, 'unitnumber')}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Filenames (filenames)</label>
                    <Input
                        readOnly={true}
                        name="filenames"
                        value={mfPackage.filenames || ''}
                        icon={renderInfoPopup(documentation.filenames, 'filenames')}
                    />
                </Form.Field>
            </Form.Group>
        </Form>
    );
};

export default OcPackageProperties;
