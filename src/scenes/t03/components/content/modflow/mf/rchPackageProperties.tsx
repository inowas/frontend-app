import React, {useState} from 'react';
import {Checkbox, Form, Grid, Header, Input, Label} from 'semantic-ui-react';
import {FlopyModflowMfrch} from '../../../../../../core/model/flopy/packages/mf';
import {documentation} from '../../../../defaults/flow';
import FlopyModflow from '../../../../../../core/model/flopy/packages/mf/FlopyModflow';
import {IFlopyModflowMfrch} from "../../../../../../core/model/flopy/packages/mf/FlopyModflowMfrch";
import InfoPopup from "../../../../../shared/InfoPopup";

interface IProps {
    mfPackage: FlopyModflowMfrch;
    mfPackages: FlopyModflow;
    onChange: (pck: FlopyModflowMfrch) => void;
    readonly: boolean;
}

const rchPackageProperties = (props: IProps) => {

    const [mfPackage] = useState<IFlopyModflowMfrch>(props.mfPackage.toObject());
    const {readonly} = props;

    const spData2D = Object.values(mfPackage.rech)[0];
    // TODO : implement ibound
    /*
        class RchPackageProperties extends AbstractPackageProperties {

            render() {
                if (!this.state.mfPackage) {
                    return null;
                }

                const {mfPackage, mfPackages, readonly} = this.props;
                const spData2D = Object.values(mfPackage.stress_period_data)[0];

                const basPackage = mfPackages.getPackage('bas');
                const {ibound} = basPackage;
            }
        }
    */

    return (
        <Form>
            <Header as={'h3'} dividing={true}>RCH: Recharge Package</Header>
            <Grid divided={'vertically'}>
                <Grid.Row columns={2}>
                    <Grid.Column>
                        <Label>Stress period data (SP1)</Label>
                        {/*<RasterDataImage
                            data={spData2D}
                            gridSize={GridSize.fromData(ibound[0])}
                            unit={''}
                            border={'1px dotted black'}
                        />*/}
                    </Grid.Column>
                </Grid.Row>
            </Grid>

            <Form.Group>
                <Form.Field>
                    <label>Cell-by-cell budget data (ipakcb)</label>
                    <Checkbox
                        toggle
                        disabled={readonly}
                        name='ipakcb'
                        value={mfPackage.ipakcb || 0}
                    />
                </Form.Field>
                <Form.Field width={1}>
                    {<InfoPopup description={documentation.ipakcb} title={'IPAKCB'} position={'top right'} iconOutside={true}/>}
                </Form.Field>
            </Form.Group>

            <Form.Group widths='equal'>
                <Form.Field>
                    <label>Filename extension</label>
                    <Input
                        readOnly={true}
                        name='extension'
                        value={mfPackage.extension}
                        icon={<InfoPopup description={documentation.extension} title={'extension'}/>}
                    />
                </Form.Field>
                <Form.Field>
                    <label>File unit number</label>
                    <Input
                        readOnly={true}
                        type={'number'}
                        name='unitnumber'
                        value={mfPackage.unitnumber}
                        icon={<InfoPopup description={documentation.unitnumber} title={'unitnumber'}/>}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Filenames</label>
                    <Input
                        readOnly={true}
                        name='filenames'
                        value={mfPackage.filenames}
                        icon={<InfoPopup description={documentation.filenames} title={'filenames'}/>}
                    />
                </Form.Field>
            </Form.Group>
        </Form>
    );
};

export default rchPackageProperties;