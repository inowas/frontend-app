import React, {MouseEvent, useState} from 'react';
import {
    Accordion,
    AccordionTitleProps,
    ButtonProps,
    Form,
    Grid,
    Icon,
    Input
} from 'semantic-ui-react';
import {FlopyModpathMp7sim} from '../../../../../../core/model/flopy/packages/mp';
import {
    BudgetOutputOptionType,
    OnOffType, SimulationType,
    StopTimeOptionType,
    TrackingDirectionType,
    WeakSinkSourceOptionType
} from '../../../../../../core/model/flopy/packages/mp/types';
import {ModflowModel} from '../../../../../../core/model/modflow';
import Soilmodel from '../../../../../../core/model/modflow/soilmodel/Soilmodel';
import renderInfoPopup from '../../../../../shared/complexTools/InfoPopup';
import ToggleableInput from '../../../../../shared/complexTools/ToggleableInput';
import InfoPopup from '../../../../../shared/InfoPopup';
import RasterDataFormGroup from '../../../../../shared/rasterData/rasterDataFormGroup';
import {documentation} from '../../../../defaults/modpath';

interface IProps {
    model: ModflowModel;
    mpPackage: FlopyModpathMp7sim;
    onClickEdit: (layerId: string, parameter: string) => any;
    readOnly: boolean;
    soilmodel: Soilmodel;
}

const mp7simPackageProperties = (props: IProps) => {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [activeInput, setActiveInput] = useState<string | null>(null);
    const [activeValue, setActiveValue] = useState<string | null | number>('');
    const {mpPackage, readOnly} = props;

    const budgetOutputOptions: Array<{
        key: number;
        value: BudgetOutputOptionType;
        text: string;
    }> = [
        {key: 0, value: 'no', text: 'No'},
        {key: 1, value: 'summary', text: 'Summary'},
        {key: 2, value: 'record_summary', text: 'Record summary'}
    ];

    const onOffOptions: Array<{
        key: number;
        value: OnOffType;
        text: string;
    }> = [
        {key: 0, value: 'on', text: 'On'},
        {key: 1, value: 'off', text: 'Off'}
    ];

    const simulationTypeOptions: Array<{
        key: number;
        value: SimulationType;
        text: string;
    }> = [
        {key: 0, value: 'endpoint', text: 'Endpoint'},
        {key: 1, value: 'pathline', text: 'Pathline'},
        {key: 2, value: 'timeseries', text: 'Timeseries'},
        {key: 3, value: 'combined', text: 'Combined'}
    ];

    const stopTimeOptions: Array<{
        key: number;
        value: StopTimeOptionType;
        text: string;
    }> = [
        {key: 0, value: 'total', text: 'Total'},
        {key: 1, value: 'extend', text: 'Extend'},
        {key: 2, value: 'specified', text: 'Specified'}
    ];

    const trackingDirectionOptions: Array<{
        key: number;
        value: TrackingDirectionType;
        text: string;
    }> = [
        {key: 0, value: 'forward', text: 'Forward'},
        {key: 1, value: 'backward', text: 'Backward'}
    ];

    const weakSinkOptions: Array<{
        key: number;
        value: WeakSinkSourceOptionType;
        text: string;
    }> = [
        {key: 0, value: 'pass_through', text: 'Pass through'},
        {key: 1, value: 'stop_at', text: 'Stop at'}
    ];

    const handleChangeToggleableInput = (name: string, value: string | number | null) => {
        setActiveInput(name);
        setActiveValue(value);
    };

    const handleClickAccordion = (e: MouseEvent<HTMLDivElement>, {index}: AccordionTitleProps) => {
        return setActiveIndex(index as number);
    };

    const handleClickEdit = (property: string) => (e: MouseEvent<HTMLButtonElement>, data: ButtonProps) => {
        return props.onClickEdit(data.value, property);
    };

    const handleOnSelect = () => {

    };

    return (
        <Grid style={{marginTop: '10px'}}>
            <Grid.Row>
                <Grid.Column>
                    <Form>
                        <Accordion styled={true} fluid={true}>
                            <Accordion.Title active={activeIndex === 0} index={0} onClick={handleClickAccordion}>
                                <Icon name="dropdown"/>
                                Setup
                            </Accordion.Title>
                            <Accordion.Content active={activeIndex === 0}>
                                <Form.Field>
                                    <label>Extension</label>
                                    <Input
                                        readOnly={true}
                                        name="extension"
                                        value={mpPackage.extension || ''}
                                        icon={renderInfoPopup(documentation.extension, 'extension')}
                                    />
                                </Form.Field>
                                <Form.Group widths="equal">
                                    <Form.Field>
                                        <label>Name file</label>
                                        <Input
                                            readOnly={true}
                                            name="mpnamefilename"
                                            value={mpPackage.mpnamefilename || ''}
                                            icon={renderInfoPopup(documentation.mpnamefilename, 'mpnamefilename')}
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Listing file</label>
                                        <Input
                                            readOnly={true}
                                            name="listingfilename"
                                            value={mpPackage.listingfilename || ''}
                                            icon={renderInfoPopup(documentation.listingfilename, 'listingfilename')}
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Endpoint file</label>
                                        <Input
                                            readOnly={true}
                                            name="endpointfilename"
                                            value={mpPackage.endpointfilename || ''}
                                            icon={renderInfoPopup(documentation.endpointfilename, 'endpointfilename')}
                                        />
                                    </Form.Field>
                                </Form.Group>
                                <Form.Group widths="equal">
                                    <Form.Field>
                                        <label>Path line file</label>
                                        <Input
                                            readOnly={true}
                                            name="pathlinefilename"
                                            value={mpPackage.pathlinefilename || ''}
                                            icon={renderInfoPopup(documentation.pathlinefilename, 'pathlinefilename')}
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Time series file</label>
                                        <Input
                                            readOnly={true}
                                            name="timeseriesfilename"
                                            value={mpPackage.timeseriesfilename || ''}
                                            icon={renderInfoPopup(
                                                documentation.timeseriesfilename, 'timeseriesfilename')}
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Trace file</label>
                                        <Input
                                            readOnly={true}
                                            name="tracefilename"
                                            value={mpPackage.tracefilename || ''}
                                            icon={renderInfoPopup(documentation.tracefilename, 'tracefilename')}
                                        />
                                    </Form.Field>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Field width={7}>
                                        <label>Simulation type</label>
                                        <Form.Dropdown
                                            options={simulationTypeOptions}
                                            onChange={handleOnSelect}
                                            value={mpPackage.simulationtype}
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
                                            value={mpPackage.trackingdirection}
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
                                    <Form.Field width={7}>
                                        <label>Weak sink option</label>
                                        <Form.Dropdown
                                            options={weakSinkOptions}
                                            onChange={handleOnSelect}
                                            value={mpPackage.weaksinkoption}
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
                                    <Form.Field width={7}>
                                        <label>Weak source option</label>
                                        <Form.Dropdown
                                            options={weakSinkOptions}
                                            onChange={handleOnSelect}
                                            value={mpPackage.weaksourceoption}
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
                                            value={mpPackage.budgetoutputoption}
                                            disabled={readOnly}
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
                                <Form.Group>
                                    <Form.Field width={7}>
                                        <label>Trace particle data</label>

                                    </Form.Field>
                                    <Form.Field width={1}>
                                        <label>&nbsp;</label>
                                        <InfoPopup
                                            description={documentation.traceparticledata}
                                            title="Trace particle data"
                                            position="top right"
                                            iconOutside={true}
                                        />
                                    </Form.Field>
                                    <Form.Field width={7}>
                                        <label>Budget cell numbers</label>

                                    </Form.Field>
                                    <Form.Field width={1}>
                                        <label>&nbsp;</label>
                                        <InfoPopup
                                            description={documentation.budgetcellnumbers}
                                            title="Budget cell numbers"
                                            position="top right"
                                            iconOutside={true}
                                        />
                                    </Form.Field>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Field width={8}>
                                        <label>Reference time option</label>
                                        <Form.Dropdown
                                            options={[
                                                {key: 0, value: 0, text: 'None'},
                                                {key: 1, value: 1, text: 'Float or tuple with single float'},
                                                {key: 2, value: 2, text: 'Relative time position'}
                                            ]}
                                            onChange={handleOnSelect}
                                            value={!mpPackage.referencetime ? 0 : 1}
                                            disabled={readOnly}
                                            name={'referencetimeoption'}
                                            selection={true}
                                        />
                                    </Form.Field>
                                    <Form.Field width={7}>
                                        <label>Reference time</label>
                                        <ToggleableInput
                                            readOnly={readOnly}
                                            name="referencetime"
                                            value={1/*mpPackage.referencetime*/}
                                            onChange={handleChangeToggleableInput}
                                            placeholder="Reference time"
                                            type="number"
                                        />
                                    </Form.Field>
                                    <Form.Field width={1}>
                                        <label>&nbsp;</label>
                                        <InfoPopup
                                            description={documentation.referencetime}
                                            title="Reference time"
                                            position="top right"
                                            iconOutside={true}
                                        />
                                    </Form.Field>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Field width={7}>
                                        <label>Stop time option</label>
                                        <Form.Dropdown
                                            options={stopTimeOptions}
                                            onChange={handleOnSelect}
                                            value={mpPackage.stoptimeoption}
                                            disabled={readOnly}
                                            name={'stoptimeoption'}
                                            selection={true}
                                        />
                                    </Form.Field>
                                    <Form.Field width={1}>
                                        <label>&nbsp;</label>
                                        <InfoPopup
                                            description={documentation.budgetcellnumbers}
                                            title="Budget cell numbers"
                                            position="top right"
                                            iconOutside={true}
                                        />
                                    </Form.Field>
                                    <Form.Field width={8}>
                                        <label>Stop time</label>
                                        <Input
                                            readOnly={readOnly || mpPackage.stoptimeoption !== 'specified'}
                                            name="stoptime"
                                            value={mpPackage.stoptime || ''}
                                            icon={renderInfoPopup(documentation.stoptime, 'stoptime')}
                                        />
                                    </Form.Field>
                                </Form.Group>
                                {['timeseries', 'combined'].includes(mpPackage.simulationtype) &&
                                <Form.Group widths="equal">
                                    <Form.Field>
                                        <label>Time point count</label>

                                    </Form.Field>
                                    <Form.Field>
                                        <label>Time point data</label>

                                    </Form.Field>
                                </Form.Group>
                                }
                                <Form.Group>
                                    <Form.Field width={7}>
                                        <label>Zone data option</label>
                                        <Form.Dropdown
                                            options={onOffOptions}
                                            onChange={handleOnSelect}
                                            value={mpPackage.zonedataoption}
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
                                    <Form.Field width={8}>
                                        <label>Stop zone</label>
                                        <Input
                                            readOnly={readOnly || mpPackage.zonedataoption !== 'on'}
                                            name="stoptime"
                                            value={mpPackage.stopzone || ''}
                                            icon={renderInfoPopup(documentation.stopzone, 'stopzone')}
                                        />
                                    </Form.Field>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Field width={15}>
                                        <label>Particle groups</label>

                                    </Form.Field>
                                    <Form.Field width={1}>
                                        <label>&nbsp;</label>
                                        <InfoPopup
                                            description={documentation.particlegroups}
                                            title="particlegroups"
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
                                            value={mpPackage.retardationfactoroption}
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
                                    data={mpPackage.retardation}
                                    onClickEdit={handleClickEdit('retardation')}
                                    layers={props.soilmodel.layersCollection}
                                    model={props.model}
                                />
                            </Accordion.Content>
                            <Accordion.Title active={activeIndex === 2} index={2} onClick={handleClickAccordion}>
                                <Icon name="dropdown"/>
                                Zones
                            </Accordion.Title>
                            <Accordion.Content active={activeIndex === 2}>
                                <RasterDataFormGroup
                                    data={mpPackage.zones}
                                    onClickEdit={handleClickEdit('zones')}
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

export default mp7simPackageProperties;
