import React, {ChangeEvent, FormEvent, SyntheticEvent, useEffect, useState} from 'react';
import {
    DropdownProps,
    Form,
    Grid,
    InputOnChangeData,
    Menu,
    MenuItemProps,
    Popup,
    Tab,
    TextAreaProps
} from 'semantic-ui-react';
import {Layer, RasterParameter} from '../../../../../core/model/gis';
import {ILayerParameterZone} from '../../../../../core/model/gis/LayerParameterZone.type';
import LayerParameterZonesCollection from '../../../../../core/model/gis/LayerParameterZonesCollection';
import {ModflowModel, Soilmodel} from '../../../../../core/model/modflow';
import SoilmodelLayer from '../../../../../core/model/modflow/soilmodel/SoilmodelLayer';
import {ISoilmodelLayer} from '../../../../../core/model/modflow/soilmodel/SoilmodelLayer.type';
import ZonesEditor from '../../../../shared/zones/zonesEditor';
import {layerParameters} from '../../../defaults/soilmodel';

interface IProps {
    activeIndex?: number;
    layer: SoilmodelLayer;
    model: ModflowModel;
    onChange: (layer: SoilmodelLayer) => any;
    onChangeRelations: (relations: LayerParameterZonesCollection) => any;
    onChangeTab: (e: React.MouseEvent, {activeIndex}: MenuItemProps) => any;
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
            props.soilmodel.zonesCollection
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
            props.soilmodel.zonesCollection
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
            props.soilmodel.zonesCollection
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
        const {readOnly} = props;

        if (!layer) {
            return [];
        }

        const panes = [{
            menuItem: (<Menu.Item key={-1}>Properties</Menu.Item>),
            render: () => (
                <Tab.Pane>
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
                </Tab.Pane>
            )
        }];

        layerParameters.forEach((p, idx) => {
            if ((p.name === 'top' && layer.number > 0)) {
                return;
            }

            const parameter = props.soilmodel.parametersCollection.findById(p.name);
            const iRelations = props.relations.all.filter((r) =>
                r.layerId === layer.id && r.parameter === p.name
            );

            if (parameter) {
                panes.push({
                    menuItem: (
                        <Menu.Item key={idx}>
                            <Popup
                                trigger={<span>{p.name}</span>}
                                content={p.description}
                                size="tiny"
                            />
                        </Menu.Item>
                    ),
                    render: () => (
                        <Tab.Pane>
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
                        </Tab.Pane>
                    )
                });
            }
        });

        return panes;
    };

    return (
        <Form>
            <Tab
                menu={{secondary: true, pointing: true, className: 'soilmodel'}}
                activeIndex={props.activeIndex || 0}
                onTabChange={props.onChangeTab}
                panes={renderPanes()}
            />
        </Form>
    );
};

export default layerDetails;
