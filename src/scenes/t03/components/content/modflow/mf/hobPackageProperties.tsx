import React, {ChangeEvent, useState} from 'react';
import {Form, Grid, Header, Input, PopupProps} from 'semantic-ui-react';
import {documentation} from "../../../../defaults/flow";
import {GridSize} from "../../../../../../core/model/modflow";
import RasterDataImage from "../../../../../shared/rasterData/rasterDataImage";
import {
    FlopyModflowMfbas,
    FlopyModflowMfdis,
    FlopyModflowMfhob
} from "../../../../../../core/model/flopy/packages/mf";
import FlopyModflow from "../../../../../../core/model/flopy/packages/mf/FlopyModflow";
import {IFlopyModflowMfhob} from "../../../../../../core/model/flopy/packages/mf/FlopyModflowMfhob";
import {InfoPopup} from "../../../../../shared";
import {RainbowOrLegend} from "../../../../../../services/rainbowvis/types";

interface IProps {
    mfPackage: FlopyModflowMfhob;
    mfPackages: FlopyModflow;
    onChange: (pck: FlopyModflowMfhob) => void;
    readonly: boolean;
}

const hobPackageProperties = (props: IProps) => {
    const [mfPackage, setMfPackage] = useState<IFlopyModflowMfhob>(props.mfPackage.toObject());
    const {mfPackages, readonly} = props;

    const basPackage: FlopyModflowMfbas = mfPackages.getPackage('bas') as FlopyModflowMfbas;
    const {ibound} = basPackage;
    const disPackage: FlopyModflowMfdis = mfPackages.getPackage('dis') as FlopyModflowMfdis;

    const affectedCellsLayers: number[][][] = [];
    for (let l = 0; l < disPackage.nlay; l++) {
        affectedCellsLayers[l] = [];
        for (let r = 0; r < disPackage.nrow; r++) {
            affectedCellsLayers[l][r] = [];
            for (let c = 0; c < disPackage.ncol; c++) {
                affectedCellsLayers[l][r][c] = 0;
            }
        }
    }
// TODO: adjust code for affectedCellsLayers
    /*class HobPackageProperties extends AbstractPackageProperties {
    render() {
        if (!this.state.mfPackage) {
            return null;
        }

        const {mfPackages, readonly} = this.props;
        const {mfPackage} = this.state;

        const basPackage = mfPackages.getPackage('bas');
        const {ibound} = basPackage;
        const affectedCellsLayers = ibound.map(l => l.map(r => r.map(() => 0)));
        mfPackage.obs_data.forEach(obs => {
            affectedCellsLayers[obs.layer][obs.row][obs.column] = 1;
        });


    }
}*/
    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        return setMfPackage({...mfPackage, [name]: value});
    };

    const handleOnBlur = (cast?: (v: any) => any) => (e: ChangeEvent<HTMLInputElement>) => {
        const {name} = e.target;
        let {value} = e.target;

        if (cast) {
            value = cast(value);
        }
        props.onChange(FlopyModflowMfhob.fromObject({...mfPackage, [name]: value}));
    };

    const renderInfoPopup = (
        description: string | JSX.Element,
        title: string,
        position: PopupProps['position'] | undefined = undefined,
        iconOutside: boolean | undefined = undefined
    ) => (
        <InfoPopup description={description} title={title} position={position} iconOutside={iconOutside}/>
    );

    return (
        <Form>
            <Grid divided={'vertically'}>
                <Header as={'h2'}>Head Observation Package</Header>
                <Grid.Row columns={2}>
                    {affectedCellsLayers.map((layer: any, idx) => (
                        <Grid.Column key={idx}>
                            <Header as={'p'}>Layer {idx + 1}</Header>
                            <RasterDataImage
                                data={layer}
                                gridSize={GridSize.fromData(layer)}
                                unit={''}
                                legend={[
                                    {value: 1, color: 'blue', label: 'HOB affected cells'},
                                ] as RainbowOrLegend}
                                border={'1px dotted black'}
                            />
                        </Grid.Column>
                    ))}
                </Grid.Row>
            </Grid>

            <Form.Group widths='equal'>
                <Form.Field>
                    <label>Unit number (iuhobsv)</label>
                    <Input
                        readOnly={readonly}
                        name='iuhobsv'
                        type='number'
                        value={mfPackage.iuhobsv || ''}
                        icon={renderInfoPopup(documentation.iuhobsv, 'iuhobsv')}
                        onBlur={handleOnBlur}
                        onChange={handleOnChange}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Dry cell equivalent (hobdry)</label>
                    <Input
                        readOnly={readonly}
                        name='hobdry'
                        type='number'
                        value={mfPackage.hobdry || ''}
                        icon={renderInfoPopup(documentation.hobdry, 'hobdry')}
                        onBlur={handleOnBlur}
                        onChange={handleOnChange}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Time step multiplier (tomulth)</label>
                    <Input
                        readOnly={readonly}
                        name='tomulth'
                        type='number'
                        value={mfPackage.tomulth || ''}
                        icon={renderInfoPopup(documentation.tomulth, 'tomulth')}
                        onBlur={handleOnBlur}
                        onChange={handleOnChange}
                    />
                </Form.Field>
            </Form.Group>
        </Form>
    );
};

export default hobPackageProperties;
