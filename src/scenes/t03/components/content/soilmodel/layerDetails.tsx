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
import {Layer, RasterParameter} from '../../../../../core/model/gis';
import {ILayerParameterZone} from '../../../../../core/model/gis/LayerParameterZone.type';
import LayerParameterZonesCollection from '../../../../../core/model/gis/LayerParameterZonesCollection';
import {ModflowModel, Soilmodel} from '../../../../../core/model/modflow';
import SoilmodelLayer from '../../../../../core/model/modflow/soilmodel/SoilmodelLayer';
import {ISoilmodelLayer} from '../../../../../core/model/modflow/soilmodel/SoilmodelLayer.type';
import ZonesEditor from '../../../../shared/zones/zonesEditor';
import {IParameter} from '../../../defaults/soilmodel';

interface IProps {
    activeParam: string | null;
    layer: SoilmodelLayer;
    model: ModflowModel;
    onChange: (layer: SoilmodelLayer) => any;
    onChangeRelations: (relations: LayerParameterZonesCollection) => any;
    onChangeTab: (e: React.MouseEvent, {activeIndex}: MenuItemProps) => any;
    parameters: IParameter[];
    readOnly: boolean;
    relations: LayerParameterZonesCollection;
    soilmodel: Soilmodel;
}

interface ISmoothParameters {
    cycles: number;
    distance: number;
    parameterId: string;
}

const layerDetails = (props: IProps) => {
    const [layer, setLayer] = useState<ISoilmodelLayer>(props.layer.toObject());

    const activeParameter = props.activeParam ? layer.parameters.filter((p) => p.id === props.activeParam) : undefined;

    useEffect(() => {
        setLayer(props.layer.toObject());
    }, [props.layer]);

    const handleAddRelation = (relation: ILayerParameterZone) => {
        const relations = props.relations;
        relations.add(relation);
        relations.reorderPriority(relation.layerId, relation.parameter);
        const cLayer = SoilmodelLayer.fromObject(layer).zonesToParameters(
            props.model.gridSize,
            relations,
            props.soilmodel.zonesCollection,
            activeParameter
        );
        props.onChange(cLayer);
        return props.onChangeRelations(relations);
    };

    const handleChange = () => props.onChange(SoilmodelLayer.fromObject(layer));

    const handleChangeRelations = (cRelations: LayerParameterZonesCollection) => {
        const relations = props.relations;
        cRelations.all.forEach((r) => {
            relations.update(r);
        });

        const cLayer = SoilmodelLayer.fromObject(layer).zonesToParameters(
            props.model.gridSize,
            relations,
            props.soilmodel.zonesCollection,
            activeParameter
        );
        props.onChange(cLayer);
        return props.onChangeRelations(relations);
    };

    const handleLocalChange = (
        e: ChangeEvent<HTMLInputElement> | FormEvent<HTMLTextAreaElement>,
        {name, value}: InputOnChangeData | TextAreaProps) => setLayer({
        ...layer,
        [name]: value
    });

    const handleRemoveRelation = (relation: ILayerParameterZone) => {
        const relations = LayerParameterZonesCollection.fromObject(props.relations.toObject());
        relations.removeById(relation.id);
        relations.reorderPriority(relation.layerId, relation.parameter);
        const cLayer = SoilmodelLayer.fromObject(layer).zonesToParameters(
            props.model.gridSize,
            relations,
            props.soilmodel.zonesCollection,
            activeParameter
        );
        props.onChange(cLayer);
        return props.onChangeRelations(relations);
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

        props.parameters.forEach((p, idx) =>
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
            )
        );

        return panes;
    };

    const renderContent = () => {
        const {activeParam, parameters, readOnly} = props;

        if (activeParam && parameters.filter((p) => p.name === activeParam).length > 0) {
            const parameter = props.soilmodel.parametersCollection.findById(activeParam);
            const iRelations = props.relations.all.filter((r) =>
                r.layerId === layer.id && r.parameter === activeParam
            );

            if (parameter) {
                return (
                    <ZonesEditor
                        boundingBox={props.model.boundingBox}
                        layer={Layer.fromObject(layer)}
                        gridSize={props.model.gridSize}
                        onAddRelation={handleAddRelation}
                        onChange={handleChangeRelations}
                        onRemoveRelation={handleRemoveRelation}
                        onSmoothLayer={handleSmoothLayer}
                        parameter={RasterParameter.fromObject(parameter)}
                        relations={LayerParameterZonesCollection.fromObject(iRelations)}
                        readOnly={readOnly}
                        zones={props.soilmodel.zonesCollection}
                    />
                );
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
