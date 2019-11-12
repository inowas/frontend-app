import {LatLngBoundsExpression, LatLngExpression} from 'leaflet';
import {uniqueId} from 'lodash';
import React, {useEffect, useRef, useState} from 'react';
import {FeatureGroup, GeoJSON, Map, Polygon} from 'react-leaflet';
import {EditControl} from 'react-leaflet-draw';
import {BoundingBox, Cells, Geometry, GridSize} from '../../../../../core/model/geometry';
import {IGeometry} from '../../../../../core/model/geometry/Geometry.type';
import ActiveCellsLayer from '../../../../../services/geoTools/activeCellsLayer';
import {BasicTileLayer} from '../../../../../services/geoTools/tileLayers';
import {getStyle} from '../../maps';

interface IProps {
    boundingBox: BoundingBox;
    cells: Cells | null;
    geometry: Geometry | null;
    gridSize: GridSize;
    readOnly: boolean;
    onChangeCells: (cells: Cells) => void;
    onChangeGeometry: (geometry: Geometry) => void;
}

const style = {
    map: {
        height: '400px',
        width: '100%'
    }
};

const discretizationMap = (props: IProps) => {

    const cellsRef = useRef<Cells | null>(null);
    const [geometry, setGeometry] = useState<IGeometry | null>(null);

    useEffect(() => {
        if (props.cells) {
            cellsRef.current = props.cells;
        }

        if (props.geometry) {
            setGeometry(props.geometry.toObject());
        }
    }, []);

    useEffect(() => {
        if (props.cells) {
            cellsRef.current = props.cells;
        }
    }, [props.cells]);

    const onCreated = (e: any) => {
        const polygon = e.layer;
        const g = Geometry.fromGeoJson(polygon.toGeoJSON());
        setGeometry(g.toObject());
        props.onChangeGeometry(g);
    };

    const onEdited = (e: any) => {
        e.layers.eachLayer((layer: any) => {
            const g = Geometry.fromGeoJson(layer.toGeoJSON());
            setGeometry(g.toObject());
            props.onChangeGeometry(g);
        });
    };

    const getBoundsLatLng = () => {
        if (props.boundingBox) {
            return props.boundingBox.getBoundsLatLng();
        }

        if (geometry) {
            return BoundingBox.fromGeoJson(Geometry.fromObject(geometry));
        }

        return [[60, 10], [45, 30]];
    };

    const handleClickOnMap = ({latlng}: { latlng: any }) => {

        if (!cellsRef.current || !props.boundingBox || !props.gridSize) {
            return null;
        }

        const x = latlng.lng;
        const y = latlng.lat;

        const c: Cells = cellsRef.current;
        c.toggle([x, y], props.boundingBox, props.gridSize);
        cellsRef.current = c;
        props.onChangeCells(c);
    };

    return (
        <Map
            style={style.map}
            bounds={getBoundsLatLng() as LatLngBoundsExpression}
            onClick={handleClickOnMap}
        >
            <BasicTileLayer/>

            {/* EDIT CONTROL */}
            {!props.readOnly && <FeatureGroup>
                <EditControl
                    position="topright"
                    draw={{
                        circle: false,
                        circlemarker: false,
                        marker: false,
                        polyline: false,
                        rectangle: false,
                        polygon: geometry == null
                    }}
                    edit={{
                        edit: geometry != null,
                        remove: false
                    }}
                    onCreated={onCreated}
                    onEdited={onEdited}
                />

                {geometry &&
                <Polygon
                    key={uniqueId()}
                    positions={Geometry.fromObject(geometry).coordinatesLatLng as LatLngExpression[]}
                />}

            </FeatureGroup>}

            {props.boundingBox &&
            <GeoJSON
                key={uniqueId()}
                data={props.boundingBox.geoJson}
                style={getStyle('bounding_box')}
            />}

            {props.cells &&
            <ActiveCellsLayer
                boundingBox={props.boundingBox}
                gridSize={props.gridSize}
                cells={props.cells}
                styles={getStyle('active_cells')}
            />}
        </Map>
    );
};

export default discretizationMap;
