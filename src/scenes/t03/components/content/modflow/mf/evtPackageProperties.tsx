import {Checkbox, DropdownProps, Form, Grid, Header, Input, Label} from 'semantic-ui-react';
import React, {SyntheticEvent, useState} from 'react';

import {FlopyModflowMfevt} from '../../../../../../core/model/flopy/packages/mf';
import {GridSize} from '../../../../../../core/model/modflow';
import {IFlopyModflowMfevt} from '../../../../../../core/model/flopy/packages/mf/FlopyModflowMfevt';
import {RasterDataImage} from '../../../../../shared/rasterData';
import {documentation} from '../../../../defaults/flow';
import FlopyModflow from '../../../../../../core/model/flopy/packages/mf/FlopyModflow';
import FlopyModflowMfbas from '../../../../../../core/model/flopy/packages/mf/FlopyModflowMfbas';
import InfoPopup from '../../../../../shared/InfoPopup';

interface IProps {
    mfPackage: FlopyModflowMfevt;
    mfPackages: FlopyModflow;
    onChange: (pck: FlopyModflowMfevt) => any;
    readonly: boolean;
}

const EvtPackageProperties = (props: IProps) => {
    const [mfPackage, setMfPackage] = useState<IFlopyModflowMfevt>(props.mfPackage.toObject());
    const {mfPackages, readonly} = props;
    const spData2D = Object.values(mfPackage.evtr)[0];
    const basPackage = mfPackages.getPackage('bas');
    if (!basPackage || !(basPackage instanceof FlopyModflowMfbas)) {
        return null;
    }

    const handleOnSelect = (e: SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
        const {name, value} = data;
        setMfPackage({...mfPackage, [name]: value});
        props.onChange(FlopyModflowMfevt.fromObject({...mfPackage, [name]: value}));
    };

    if (!mfPackage) {
        return null;
    }
    return (
        <Form>
            <Header as={'h3'} dividing={true}>EVT: Evapotranspiration Package</Header>
            <Grid divided={'vertically'}>
                <Grid.Row columns={2}>
                    <Grid.Column>
                        <Label>Stress period data (SP1)</Label>
                        <RasterDataImage
                            data={spData2D}
                            gridSize={GridSize.fromData(spData2D)}
                            unit={''}
                            border={'1px dotted black'}
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>

            <Form.Group widths={'equal'}>
                <Form.Field width={14}>
                    <label>Save cell-by-cell budget data (IPAKCB)</label>
                    <Checkbox
                        toggle={true}
                        disabled={readonly}
                        name={'ipakcb'}
                        value={mfPackage.ipakcb ? 1 : 0}
                    />
                </Form.Field>
                <Form.Field width={1}>
                    <InfoPopup
                        description={documentation.evt.ipakcb}
                        title={'IPAKCB'}
                        position={'top right'}
                        iconOutside={true}
                    />
                </Form.Field>
                <Form.Field>
                    <label>ET option (NEVTOP)</label>
                    <Form.Dropdown
                        options={[
                            {key: 1, value: 1, text: '1: ET is calculated only for cells in the top grid layer'},
                            {key: 2, value: 2, text: '2: ET to layer defined in ievt'},
                            {key: 3, value: 3, text: '3: ET to highest active cell'},
                        ]}
                        name={'ipakcb'}
                        selection={true}
                        value={mfPackage.nevtop}
                        disabled={readonly}
                        onChange={handleOnSelect}
                    />
                </Form.Field>
                <Form.Field width={1}>
                    <label>&nbsp;</label>
                    <InfoPopup
                        description={documentation.evt.nevtop}
                        title={'NEVTOP'}
                        position={'top right'}
                        iconOutside={true}
                    />
                </Form.Field>
            </Form.Group>

            <Form.Group widths={'equal'}>
                <Form.Field>
                    <label>Filename extension (EXTENSION)</label>
                    <Input
                        readOnly={readonly}
                        name={'extension'}
                        value={mfPackage.extension || ''}
                        icon={<InfoPopup description={documentation.evt.extension} title={'EXTENSION'}/>}
                    />
                </Form.Field>
                <Form.Field>
                    <label>File unit number (UNITNUMBER)</label>
                    <Input
                        readOnly={readonly}
                        type={'number'}
                        name={'unitnumber'}
                        value={mfPackage.unitnumber || ''}
                        icon={<InfoPopup description={documentation.evt.unitnumber} title={'UNITNUMBER'}/>}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Filenames (FILENAMES)</label>
                    <Input
                        readOnly={readonly}
                        name={'filenames'}
                        value={mfPackage.filenames || ''}
                        icon={<InfoPopup description={documentation.evt.filenames} title={'FILENAMES'}/>}
                    />
                </Form.Field>
            </Form.Group>
        </Form>
    );
};

export default EvtPackageProperties;
