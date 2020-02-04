import {cloneDeep} from 'lodash';
import React from 'react';
import {Checkbox, Header} from 'semantic-ui-react';
import uuidv4 from 'uuid/v4';
import {Array2D} from '../../../../../../core/model/geometry/Array2D.type';
import {ModflowModel} from '../../../../../../core/model/modflow';
import BoundaryCollection from '../../../../../../core/model/modflow/boundaries/BoundaryCollection';
import {LayerParameterZonesCollection, RasterParameter} from '../../../../../../core/model/modflow/soilmodel';
import {ILayerParameterZone} from '../../../../../../core/model/modflow/soilmodel/LayerParameterZone.type';
import Soilmodel from '../../../../../../core/model/modflow/soilmodel/Soilmodel';
import SoilmodelLayer from '../../../../../../core/model/modflow/soilmodel/SoilmodelLayer';
import RasterDataImage from '../../../../../shared/rasterData/rasterDataImage';
import ZonesEditor from '../zones/zonesEditor';

interface IProps {
    boundaries: BoundaryCollection;
    defaultData: number | Array2D<number>;
    model: ModflowModel;
    layer: SoilmodelLayer;
    onChange: (layer: SoilmodelLayer) => any;
    parameter: RasterParameter;
    soilmodel: Soilmodel;
}

interface ISmoothParameters {
    cycles: number;
    distance: number;
    parameterId: string;
}

const regular = (props: IProps) => {
    const parameters = props.layer.toObject().parameters;
    const isDefault = parameters.filter((p) => p.id === props.parameter.id).length === 0;
    const activeParameter = props.layer.parameters.filter((p) => p.id === props.parameter.id);

    const handleAddRelation = (relation: ILayerParameterZone) => {
        const cLayer = SoilmodelLayer.fromObject(props.layer.toObject());
        cLayer.addRelation(relation);
        cLayer.relations = cLayer.relations.reorderPriority(relation.parameter);
        cLayer.zonesToParameters(
            props.model.gridSize,
            props.soilmodel.zonesCollection,
            activeParameter
        );
        return props.onChange(cLayer);
    };

    const handleChangeRelations = (cRelations: LayerParameterZonesCollection) => {
        const cLayer = SoilmodelLayer.fromObject(props.layer.toObject());
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

    const handleRemoveRelation = (relation: ILayerParameterZone) => {
        const relations = LayerParameterZonesCollection.fromObject(props.layer.relations.toObject());
        relations.removeById(relation.id);
        relations.reorderPriority(relation.parameter);
        const cLayer = SoilmodelLayer.fromObject(props.layer.toObject());
        cLayer.relations = relations;
        cLayer.zonesToParameters(
            props.model.gridSize,
            props.soilmodel.zonesCollection,
            activeParameter
        );
        return props.onChange(cLayer);
    };

    const handleSmoothLayer = (params: ISmoothParameters) => {
        const cLayer = SoilmodelLayer.fromObject(props.layer.toObject());
        cLayer.smoothParameter(props.model.gridSize, params.parameterId, params.cycles, params.distance);
        return props.onChange(cLayer);
    };

    const handleToggleDefault = () => {
        const cParameters = cloneDeep(parameters);

        if (cParameters.filter((p) => p.id === props.parameter.id).length === 0) {
            cParameters.push({
                id: props.parameter.id,
                data: {file: null},
                value: props.defaultData
            });
            const cLayer = props.layer.toObject();
            cLayer.parameters = cParameters;
            cLayer.relations.push({
                data: {file: null},
                id: uuidv4(),
                parameter: props.parameter.id,
                priority: 0,
                value: props.defaultData,
                zoneId: 'default'
            });

            return props.onChange(SoilmodelLayer.fromObject(cLayer));
        }

        const layer = props.layer.toObject();
        layer.parameters = parameters.filter((p) => p.id !== props.parameter.id);
        layer.relations = LayerParameterZonesCollection.fromObject(layer.relations)
            .removeBy('parameter', props.parameter.id).toObject();
        return props.onChange(SoilmodelLayer.fromObject(layer));
    };

    const renderData = () => {
        if (!isDefault) {
            return (
                <ZonesEditor
                    boundingBox={props.model.boundingBox}
                    boundaries={props.boundaries}
                    layer={props.layer}
                    gridSize={props.model.gridSize}
                    onAddRelation={handleAddRelation}
                    onChange={handleChangeRelations}
                    onRemoveRelation={handleRemoveRelation}
                    onSmoothLayer={handleSmoothLayer}
                    parameter={props.parameter}
                    readOnly={props.model.readOnly}
                    zones={props.soilmodel.zonesCollection}
                />
            );
        }
        return (
            <RasterDataImage
                data={props.defaultData}
                gridSize={props.model.gridSize}
                unit={props.parameter.unit}
            />
        );
    };

    return (
        <div>
            <Header as="h4">{props.parameter.title}, {props.parameter.id} [{props.parameter.unit}]
                <Checkbox
                    checked={isDefault}
                    disabled={props.model.readOnly}
                    label="Use default value."
                    onChange={handleToggleDefault}
                    style={{float: 'right'}}
                    toggle={true}
                />
            </Header>
            {renderData()}
        </div>
    );
};

export default regular;
