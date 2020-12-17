import {Checkbox, Form, Grid, Header, Input, Label} from 'semantic-ui-react';
import {FlopyModflowMfrch} from '../../../../../../core/model/flopy/packages/mf';
import {GridSize} from '../../../../../../core/model/modflow';
import {IFlopyModflowMfrch} from '../../../../../../core/model/flopy/packages/mf/FlopyModflowMfrch';
import {RasterDataImage} from '../../../../../shared/rasterData';
import {documentation} from '../../../../defaults/flow';
import FlopyModflow from '../../../../../../core/model/flopy/packages/mf/FlopyModflow';
import FlopyModflowMfbas from '../../../../../../core/model/flopy/packages/mf/FlopyModflowMfbas';
import React, {useState} from 'react';
import renderInfoPopup from '../../../../../shared/complexTools/InfoPopup';

interface IProps {
    mfPackage: FlopyModflowMfrch;
    mfPackages: FlopyModflow;
    onChange: (pck: FlopyModflowMfrch) => any;
    readonly: boolean;
}

const RchPackageProperties = (props: IProps) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [mfPackage, setMfPackage] = useState<IFlopyModflowMfrch>(props.mfPackage.toObject());
    const {readonly} = props;

    if (!mfPackage) {
        return null;
    }

    const {mfPackages} = props;
    const spData2D = Object.values(mfPackage.rech)[0];

    const basPackage = mfPackages.getPackage('bas');
    if (!basPackage || !(basPackage instanceof FlopyModflowMfbas)) {
        return null;
    }

    return (
        <Form>
            <Header as={'h3'} dividing={true}>RCH: Recharge Package</Header>
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

            <Form.Group widths="equal">
                <Form.Field>
                    <label>Save cell-by-cell budget data (ipakcb)</label>
                    <Checkbox
                        toggle={true}
                        readOnly={readonly}
                        name={'ipakcb'}
                        value={mfPackage.ipakcb ? 1 : 0}
                        icon={renderInfoPopup(documentation.rch.ipakcb, 'IPAKCB')}
                    />
                </Form.Field>
            </Form.Group>

            <Form.Group widths="equal">
                <Form.Field>
                    <label>Filename extension</label>
                    <Input
                        readOnly={readonly}
                        name="extension"
                        value={mfPackage.extension || ''}
                        icon={renderInfoPopup(documentation.rch.extension, 'extension')}
                    />
                </Form.Field>
                <Form.Field>
                    <label>File unit number</label>
                    <Input
                        readOnly={readonly}
                        type={'number'}
                        name="unitnumber"
                        value={mfPackage.unitnumber || ''}
                        icon={renderInfoPopup(documentation.rch.unitnumber, 'unitnumber')}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Filenames</label>
                    <Input
                        readOnly={readonly}
                        name="filenames"
                        value={mfPackage.filenames || ''}
                        icon={renderInfoPopup(documentation.rch.filenames, 'filenames')}
                    />
                </Form.Field>
            </Form.Group>
        </Form>
    );
};

export default RchPackageProperties;
