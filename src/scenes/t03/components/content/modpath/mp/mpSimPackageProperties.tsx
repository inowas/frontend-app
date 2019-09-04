import React, {MouseEvent, useState} from 'react';
import {
    Accordion,
    AccordionTitleProps,
    Form,
    Grid,
    Icon,
    Input
} from 'semantic-ui-react';
import {FlopyModpathMpsim} from '../../../../../../core/model/flopy/packages/mp';
import {ModflowModel} from '../../../../../../core/model/modflow';
import Soilmodel from '../../../../../../core/model/modflow/soilmodel/Soilmodel';
import renderInfoPopup from '../../../../../shared/complexTools/InfoPopup';
import InfoPopup from '../../../../../shared/InfoPopup';
import RasterDataFormGroup from '../../../../../shared/rasterData/rasterDataFormGroup';
import {documentation} from '../../../../defaults/modpath';

interface IProps {
    model: ModflowModel;
    mpPackage: FlopyModpathMpsim;
    onClickEdit: (layerId: string, parameter: string) => any;
    readOnly: boolean;
    soilmodel: Soilmodel;
}

const mpSimPackageProperties = (props: IProps) => {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [activeInput, setActiveInput] = useState<string | null>(null);
    const [activeValue, setActiveValue] = useState<string | null | number>('');
    const {mpPackage, readOnly} = props;

    const budgetOutputOptions: Array<{
        key: number;
        value: number;
        text: string;
    }> = [
        {key: 0, value: 0, text: 'No'},
        {key: 1, value: 1, text: 'Summary'},
        {key: 2, value: 2, text: 'Record summary'}
    ];

    const onOffOptions: Array<{
        key: number;
        value: number;
        text: string;
    }> = [
        {key: 0, value: 1, text: 'On'},
        {key: 1, value: 2, text: 'Off'}
    ];

    const simulationTypeOptions: Array<{
        key: number;
        value: number;
        text: string;
    }> = [
        {key: 0, value: 1, text: 'Endpoint'},
        {key: 1, value: 2, text: 'Pathline'}
    ];

    const stopTimeOptions: Array<{
        key: number;
        value: number;
        text: string;
    }> = [
        {key: 0, value: 1, text: 'Stop at end/beginning of MODFLOW simulation (1)'},
        {key: 1, value: 3, text: 'Stop particle tracking at specified tracking time (3)'}
    ];

    const trackingDirectionOptions: Array<{
        key: number;
        value: number;
        text: string;
    }> = [
        {key: 0, value: 1, text: 'Forward'},
        {key: 1, value: 2, text: 'Backward'}
    ];

    const weakSinkOptions: Array<{
        key: number;
        value: number;
        text: string;
    }> = [
        {key: 0, value: 1, text: 'Allow particles to pass through cells that contain weak sinks (1)'},
        {key: 1, value: 2, text: 'Stop particles when entering cells with weak sinks (2)'}
    ];

    const weakSourceOptions: Array<{
        key: number;
        value: number;
        text: string;
    }> = [
        {key: 0, value: 1, text: 'Allow particles to pass through cells that contain weak sources (1)'},
        {key: 1, value: 2, text: 'Stop particles when entering cells with weak sources (2)'}
    ];

    const handleChangeToggleableInput = (name: string, value: string | number | null) => {
        setActiveInput(name);
        setActiveValue(value);
    };

    const handleClickAccordion = (e: MouseEvent<HTMLDivElement>, {index}: AccordionTitleProps) => {
        return setActiveIndex(index as number);
    };

    const handleClickEdit = (layerId: string, parameter: string) => {
        return props.onClickEdit(layerId, parameter);
    };

    const handleOnSelect = () => {

    };

    return (
        <Grid style={{marginTop: '10px'}}>
            <Grid.Row>
                <Grid.Column>
                    <Form>
                        <Form.Field>
                            <label>Extension</label>
                            <Input
                                readOnly={true}
                                name="extension"
                                value={mpPackage.extension || ''}
                                icon={renderInfoPopup(documentation.extension, 'extension')}
                            />
                        </Form.Field>
                        <Accordion styled={true} fluid={true}>
                            <Accordion.Title active={activeIndex === 0} index={0} onClick={handleClickAccordion}>
                                <Icon name="dropdown"/>
                                Setup
                            </Accordion.Title>
                            <Accordion.Content active={activeIndex === 0}>
                                <Form.Group>
                                    <Form.Field width={7}>
                                        <label>Simulation type</label>
                                        <Form.Dropdown
                                            options={simulationTypeOptions}
                                            onChange={handleOnSelect}
                                            value={mpPackage.simulationType}
                                            disabled={readOnly}
                                            name={'simulationtype'}
                                            selection={true}
                                        />
                                    </Form.Field>
                                    <Form.Field width={1}>
                                        <label>&nbsp;</label>
                                        <InfoPopup
                                            description={documentation.simulationtype}
                                            title="Simulation type"
                                            position="top right"
                                            iconOutside={true}
                                        />
                                    </Form.Field>
                                    <Form.Field width={7}>
                                        <label>Tracking direction</label>
                                        <Form.Dropdown
                                            options={trackingDirectionOptions}
                                            onChange={handleOnSelect}
                                            value={mpPackage.trackingDirection}
                                            disabled={readOnly}
                                            name={'trackingdirection'}
                                            selection={true}
                                        />
                                    </Form.Field>
                                    <Form.Field width={1}>
                                        <label>&nbsp;</label>
                                        <InfoPopup
                                            description={documentation.trackingdirection}
                                            title="Tracking direction"
                                            position="top right"
                                            iconOutside={true}
                                        />
                                    </Form.Field>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Field width={15}>
                                        <label>Weak sink option</label>
                                        <Form.Dropdown
                                            options={weakSinkOptions}
                                            onChange={handleOnSelect}
                                            value={mpPackage.weakSinkOption}
                                            disabled={readOnly}
                                            name={'weaksinkoption'}
                                            selection={true}
                                        />
                                    </Form.Field>
                                    <Form.Field width={1}>
                                        <label>&nbsp;</label>
                                        <InfoPopup
                                            description={documentation.weaksinkoption}
                                            title="Weak sink option"
                                            position="top right"
                                            iconOutside={true}
                                        />
                                    </Form.Field>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Field width={15}>
                                        <label>Weak source option</label>
                                        <Form.Dropdown
                                            options={weakSourceOptions}
                                            onChange={handleOnSelect}
                                            value={mpPackage.weakSourceOption}
                                            disabled={readOnly}
                                            name={'weaksourceoption'}
                                            selection={true}
                                        />
                                    </Form.Field>
                                    <Form.Field width={1}>
                                        <label>&nbsp;</label>
                                        <InfoPopup
                                            description={documentation.weaksourceoption}
                                            title="Weak source option"
                                            position="top right"
                                            iconOutside={true}
                                        />
                                    </Form.Field>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Field width={15}>
                                        <label>Budget output option</label>
                                        <Form.Dropdown
                                            options={budgetOutputOptions}
                                            onChange={handleOnSelect}
                                            value={mpPackage.budgetOutputOption}
                                            disabled={true}
                                            name={'budgetoutputoption'}
                                            selection={true}
                                        />
                                    </Form.Field>
                                    <Form.Field width={1}>
                                        <label>&nbsp;</label>
                                        <InfoPopup
                                            description={documentation.budgetoutputoption}
                                            title="Budget output option"
                                            position="top right"
                                            iconOutside={true}
                                        />
                                    </Form.Field>
                                </Form.Group>
                            </Accordion.Content>
                            <Accordion.Title active={activeIndex === 1} index={1} onClick={handleClickAccordion}>
                                <Icon name="dropdown"/>
                                Retardation
                            </Accordion.Title>
                            <Accordion.Content active={activeIndex === 1}>
                                <Form.Group>
                                    <Form.Field width={15}>
                                        <label>Retardation factor option</label>
                                        <Form.Dropdown
                                            options={onOffOptions}
                                            onChange={handleOnSelect}
                                            value={mpPackage.retardationOption}
                                            disabled={readOnly}
                                            name={'retardationfactoroption'}
                                            selection={true}
                                        />
                                    </Form.Field>
                                    <Form.Field width={1}>
                                        <label>&nbsp;</label>
                                        <InfoPopup
                                            description={documentation.retardationfactoroption}
                                            title="retardationfactoroption"
                                            position="top right"
                                            iconOutside={true}
                                        />
                                    </Form.Field>
                                </Form.Group>
                                <RasterDataFormGroup
                                    parameter="retardation"
                                    onClickEdit={handleClickEdit}
                                    layers={props.soilmodel.layersCollection}
                                    model={props.model}
                                />
                            </Accordion.Content>
                            <Accordion.Title active={activeIndex === 2} index={2} onClick={handleClickAccordion}>
                                <Icon name="dropdown"/>
                                Zones
                            </Accordion.Title>
                            <Accordion.Content active={activeIndex === 2}>
                                <Form.Group>
                                    <Form.Field width={15}>
                                        <label>Zone data option</label>
                                        <Form.Dropdown
                                            options={onOffOptions}
                                            onChange={handleOnSelect}
                                            value={mpPackage.zoneArrayOption}
                                            disabled={readOnly}
                                            name={'zonedataoption'}
                                            selection={true}
                                        />
                                    </Form.Field>
                                    <Form.Field width={1}>
                                        <label>&nbsp;</label>
                                        <InfoPopup
                                            description={documentation.zonedataoption}
                                            title="zonedataoption"
                                            position="top right"
                                            iconOutside={true}
                                        />
                                    </Form.Field>
                                </Form.Group>
                                <RasterDataFormGroup
                                    parameter="zones"
                                    onClickEdit={handleClickEdit}
                                    layers={props.soilmodel.layersCollection}
                                    model={props.model}
                                />
                            </Accordion.Content>
                        </Accordion>
                    </Form>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

export default mpSimPackageProperties;
