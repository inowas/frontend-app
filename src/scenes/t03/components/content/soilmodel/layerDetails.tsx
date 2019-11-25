import React, {ChangeEvent, FormEvent, SyntheticEvent, useEffect, useState} from 'react';
import {
    DropdownProps,
    Form,
    Grid,
    InputOnChangeData,
    Menu,
    MenuItemProps,
    Popup,
    TextAreaProps
} from 'semantic-ui-react';
import {ModflowModel, Soilmodel} from '../../../../../core/model/modflow';
import {RasterParameter} from '../../../../../core/model/modflow/soilmodel';
import {ILayerParameter} from '../../../../../core/model/modflow/soilmodel/LayerParameter.type';
import {ILayerParameterZone} from '../../../../../core/model/modflow/soilmodel/LayerParameterZone.type';
import LayerParameterZonesCollection from '../../../../../core/model/modflow/soilmodel/LayerParameterZonesCollection';
import SoilmodelLayer from '../../../../../core/model/modflow/soilmodel/SoilmodelLayer';
import {ISoilmodelLayer} from '../../../../../core/model/modflow/soilmodel/SoilmodelLayer.type';
import {IParameter, otherParameters} from '../../../defaults/soilmodel';
import {Ibound, Regular} from './parameters';
import ZonesEditor from './zones/zonesEditor';

interface IProps {
    activeParam: string | null;
    layer: SoilmodelLayer;
    model: ModflowModel;
    onChange: (layer: SoilmodelLayer) => any;
    onChangeTab: (e: React.MouseEvent, {activeIndex}: MenuItemProps) => any;
    parameters: IParameter[];
    readOnly: boolean;
    soilmodel: Soilmodel;
}

interface ISmoothParameters {
    cycles: number;
    distance: number;
    parameterId: string;
}

const layerDetails = (props: IProps) => {
    const [layer, setLayer] = useState<ISoilmodelLayer>(props.layer.toObject());
    const [activeParameter, setActiveParameter] = useState<ILayerParameter>();

    useEffect(() => {
        const param = props.layer.parameters.filter((p) => p.id === props.activeParam);
        if (param.length > 0) {
            setActiveParameter(param[0]);
        }
    }, [props.activeParam]);

    useEffect(() => {
        setLayer(props.layer.toObject());
    }, [props.layer]);

    const handleAddRelation = (relation: ILayerParameterZone) => {
        const cLayer = SoilmodelLayer.fromObject(layer);
        cLayer.addRelation(relation);
        cLayer.relations = cLayer.relations.reorderPriority(relation.parameter);
        cLayer.zonesToParameters(
            props.model.gridSize,
            props.soilmodel.zonesCollection,
            activeParameter
        );
        return props.onChange(cLayer);
    };

    const handleChange = () => props.onChange(SoilmodelLayer.fromObject(layer));

    const handleChangeRelations = (cRelations: LayerParameterZonesCollection) => {
        const cLayer = SoilmodelLayer.fromObject(layer);
        cRelations.all.forEach((r) => {
            cLayer.updateRelation(r);
        });
        cLayer.zonesToParameters(
            props.model.gridSize,
            props.soilmodel.zonesCollection,
            activeParameter
        );
        return props.onChange(cLayer);
    };

    const handleLocalChange = (
        e: ChangeEvent<HTMLInputElement> | FormEvent<HTMLTextAreaElement>,
        {name, value}: InputOnChangeData | TextAreaProps) => setLayer({
        ...layer,
        [name]: value
    });

    const handleRemoveRelation = (relation: ILayerParameterZone) => {
        const relations = LayerParameterZonesCollection.fromObject(props.layer.relations.toObject());
        relations.removeById(relation.id);
        relations.reorderPriority(relation.parameter);
        const cLayer = SoilmodelLayer.fromObject(layer);
        cLayer.relations = relations;
        cLayer.zonesToParameters(
            props.model.gridSize,
            props.soilmodel.zonesCollection,
            activeParameter
        );
        return props.onChange(cLayer);
    };

    const handleSelect = (e: SyntheticEvent<HTMLElement, Event>, {name, value}: DropdownProps) => {
        const cLayer = {
            ...layer,
            [name]: value
        };

        return props.onChange(SoilmodelLayer.fromObject(cLayer));
    };

    const handleSmoothLayer = (params: ISmoothParameters) => {
        const cLayer = SoilmodelLayer.fromObject(layer);
        cLayer.smoothParameter(props.model.gridSize, params.parameterId, params.cycles, params.distance);
        return props.onChange(cLayer);
    };

    const renderPanes = () => {
        const {activeParam} = props;

        if (!layer) {
            return [];
        }

        const panes = [
            (
                <Menu.Item
                    active={!activeParam || activeParam === 'properties'}
                    key={0}
                    onClick={props.onChangeTab}
                    name="properties"
                >
                    Properties
                </Menu.Item>
            )
        ];

        props.parameters.forEach((p, idx) => {
                if (p.name === 'top' && props.layer.number !== 0) {
                    return;
                }
                panes.push(
                    <Menu.Item
                        active={activeParam === p.name}
                        key={idx + 1}
                        onClick={props.onChangeTab}
                        name={p.name}
                    >
                        <Popup
                            trigger={<span>{p.name}</span>}
                            content={p.description}
                            size="tiny"
                        />
                    </Menu.Item>
                );
            }
        );

        return panes;
    };

    const renderContent = () => {
        const {activeParam, parameters, readOnly} = props;
        if (activeParam && parameters.filter((p) => p.name === activeParam).length > 0) {
            const parameter = props.soilmodel.parametersCollection.findById(activeParam);

            if (parameter) {
                return (
                    <ZonesEditor
                        boundingBox={props.model.boundingBox}
                        layer={SoilmodelLayer.fromObject(layer)}
                        gridSize={props.model.gridSize}
                        onAddRelation={handleAddRelation}
                        onChange={handleChangeRelations}
                        onRemoveRelation={handleRemoveRelation}
                        onSmoothLayer={handleSmoothLayer}
                        parameter={RasterParameter.fromObject(parameter)}
                        readOnly={readOnly}
                        zones={props.soilmodel.zonesCollection}
                    />
                );
            }

            const oParameter = otherParameters.filter((p) => p.id === activeParam);

            if (oParameter.length > 0) {
                switch (activeParam) {
                    case 'ibound':
                        return (
                            <Ibound
                                model={props.model}
                                layer={SoilmodelLayer.fromObject(layer)}
                                onChange={props.onChange}
                                parameter={RasterParameter.fromObject(oParameter[0])}
                            />
                        );
                    case 'strt':
                        return (
                            <Regular
                                defaultData={props.soilmodel.top}
                                layer={SoilmodelLayer.fromObject(layer)}
                                model={props.model}
                                onChange={props.onChange}
                                parameter={RasterParameter.fromObject(oParameter[0])}
                                soilmodel={props.soilmodel}
                            />
                        );
                    default:
                        return (
                            <div>
                                PARAMETER DEFAULT
                            </div>
                        );
                }
            }
        }

        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={10}>
                        <Form.Input
                            readOnly={readOnly}
                            name="name"
                            value={layer.name}
                            label={'Layer name'}
                            onBlur={handleChange}
                            onChange={handleLocalChange}
                        />
                        <Form.TextArea
                            readOnly={readOnly}
                            name="description"
                            value={layer.description}
                            label={'Layer description'}
                            onBlur={handleChange}
                            onChange={handleLocalChange}
                        />
                    </Grid.Column>
                    <Grid.Column width={6}>
                        <Form.Select
                            disabled={readOnly}
                            label={'Layer type'}
                            value={layer.laytyp}
                            name="laytyp"
                            onChange={handleSelect}
                            options={[
                                {
                                    value: 0,
                                    text: 'confined',
                                },
                                {
                                    value: 1,
                                    text: 'convertible',
                                },
                                {
                                    value: -1,
                                    text: 'convertible (unless THICKSTRT)',
                                }
                            ]}
                        />
                        <Form.Select
                            disabled={readOnly}
                            label={'Layer average calculation'}
                            value={layer.layavg}
                            name="layavg"
                            onChange={handleSelect}
                            options={[
                                {
                                    value: 0,
                                    text: 'harmonic mean'
                                },
                                {
                                    value: 1,
                                    text: 'logarithmic mean'
                                },
                                {
                                    value: 2,
                                    text: 'arithmetic mean (saturated thickness) and logarithmic mean ' +
                                        '(hydraulic conductivity)'
                                }
                            ]}
                        />
                        <Form.Select
                            disabled={readOnly}
                            label={'Rewetting capability'}
                            value={layer.laywet}
                            name="laywet"
                            onChange={handleSelect}
                            options={[
                                {
                                    value: 0,
                                    text: 'No'
                                },
                                {
                                    value: 1,
                                    text: 'Yes'
                                },
                            ]}
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    };

    return (
        <Form>
            <Menu pointing={true} secondary={true}>
                {renderPanes()}
            </Menu>
            {renderContent()}
        </Form>
    );
};

export default layerDetails;
