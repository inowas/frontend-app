import {GeoJsonObject} from 'geojson';
import {geoJSON as leafletGeoJSON} from 'leaflet';
import {uniqueId} from 'lodash';
import React from 'react';
import {CircleMarker, GeoJSON, Map, TileLayer, Tooltip} from 'react-leaflet';
import BoundingBox from '../../../../../../core/model/geometry/BoundingBox';
import GridSize from '../../../../../../core/model/geometry/GridSize';
import {IObjectPosition} from '../../../../../../core/model/modflow/optimization/ObjectPosition.type';
import OptimizationObjectsCollection from '../../../../../../core/model/modflow/optimization/ObjectsCollection';
import OptimizationObject from '../../../../../../core/model/modflow/optimization/OptimizationObject';

interface IProps {
    area: any;
    bbox: BoundingBox;
    objects: OptimizationObjectsCollection;
    selectedObject: OptimizationObject;
    readonly: boolean;
    gridSize: GridSize;
}

const optimizationResultsMap = (props: IProps) => {

    const getBounds = (geometry: GeoJsonObject) => leafletGeoJSON(geometry).getBounds();

    const generateKeyFunction = (geometry: GeoJsonObject) => JSON.stringify(geometry);

    const drawObject = (location: IObjectPosition, label: string | null = null, color = 'red') => {
        const bbXmin = props.bbox.xMin;
        const bbYmin = props.bbox.yMin;
        const bbXmax = props.bbox.xMax;
        const bbYmax = props.bbox.yMax;

        const styles = {
            point: {
                color,
                weight: 0.3
            },
            polygon: {
                color: 'grey',
                weight: 0.3
            },
            mapFix: {
                zIndex: -1
            }
        };

        const dX = (bbXmax - bbXmin) / props.gridSize.nX;
        const dY = (bbYmax - bbYmin) / props.gridSize.nY;

        const cXres = location.col.result ? bbXmin + location.col.result * dX : 0;
        const cYres = location.row.result ? bbYmax - location.row.result * dY : 0;

        return (
            <div key={uniqueId()}>
                <CircleMarker
                    center={[
                        cYres,
                        cXres
                    ]}
                    {...styles.point}
                    radius={10}
                >
                    {label &&
                    <Tooltip
                        permanent={true}
                        direction="right"
                        offset={[10, 0]}
                        opacity={0.5}
                    >
                        <span>{label}</span>
                    </Tooltip>
                    }
                </CircleMarker>
            </div>
        );
    };

    const {area} = props;
    if (!props.bbox || !area) {
        return null;
    }

    return (
        <Map
            className="boundaryGeometryMap"
            bounds={getBounds(props.area)}
        >
            <TileLayer url="http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"/>
            <GeoJSON
                key={generateKeyFunction(area)}
                data={area}
            />
            {props.objects && props.objects.length > 0 &&
            <div>
                {
                    props.objects.all.map((object) => {
                        if (props.selectedObject && object.id === props.selectedObject.id) {
                            return drawObject(object.position, object.meta.name, 'red');
                        }
                        return drawObject(object.position, object.meta.name, 'blue');
                    })
                }
            </div>
            }
        </Map>
    );
};

export default optimizationResultsMap;
