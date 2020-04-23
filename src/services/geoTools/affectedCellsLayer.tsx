import React, {useEffect, useState} from 'react';
import {FeatureGroup, LayersControl, Polyline} from 'react-leaflet';
import {useSelector} from 'react-redux';
import {BoundingBox, Cells, GridSize} from '../../core/model/geometry';
import {ICell} from '../../core/model/geometry/Cells.type';
import {ModflowModel, Soilmodel} from '../../core/model/modflow';
import {Boundary, BoundaryCollection} from '../../core/model/modflow/boundaries';
import {IRootReducer} from '../../reducers';

interface IProps {
    boundary: Boundary;
}

const styles = {
    affected: {
        stroke: false,
        fill: true,
        fillColor: '#393B89',
        fillOpacity: 0.6
    },
    inactive: {
        stroke: false,
        fill: true,
        fillColor: '#888888',
        fillOpacity: 0.6
    },
    other: {
        stroke: false,
        fill: true,
        fillColor: '#9C9EDE',
        fillOpacity: 0.6
    }
};

const affectedCellsLayer = (props: IProps) => {
    const [iBoundLayer, setIBoundLayer] = useState<ICell[]>();
    const [boundaryLayers, setBoundaryLayers] = useState<any[]>([]);

    const T03 = useSelector((state: IRootReducer) => state.T03);
    const boundaries = T03.boundaries ? BoundaryCollection.fromObject(T03.boundaries) : null;
    const model = T03.model ? ModflowModel.fromObject(T03.model) : null;
    const soilmodel = T03.soilmodel ? Soilmodel.fromObject(T03.soilmodel) : null;

    if (!model || !boundaries || !soilmodel) {
        return null;
    }

    useEffect(() => {
        setIBoundLayer(model.inactiveCells.toObject());
    }, [model]);

    useEffect(() => {
        setBoundaryLayers(boundaries.all.filter(
            (b) => b.type === props.boundary.type && b.id !== props.boundary.id
            ).map((b) => calculateGridCells(model.boundingBox, model.gridSize, b.cells).map(
            (c, k) => renderGridCell(k, c[0], c[1], c[2], c[3], styles.other)
            ))
        );
    }, [boundaries]);

    const renderGridCell = (key: number, xMin: number, xMax: number, yMin: number, yMax: number, style: any) => (
        <Polyline
            key={key}
            positions={[
                {lng: xMin, lat: yMin},
                {lng: xMin, lat: yMax},
                {lng: xMax, lat: yMax},
                {lng: xMax, lat: yMin},
                {lng: xMin, lat: yMin}
            ]}
            {...style}
        />
    );

    const calculateGridCells = (boundingBox: BoundingBox, gridSize: GridSize, cells: Cells) => {

        const dX = boundingBox.dX / gridSize.nX;
        const dY = boundingBox.dY / gridSize.nY;
        const cg: Array<[number, number, number, number]> = [];

        cells.cells.forEach((a) => {
            const x = a[0];
            const y = a[1];

            const cXmin = boundingBox.xMin + x * dX;
            const cXmax = boundingBox.xMin + (x + 1) * dX;
            const cYmin = boundingBox.yMax - y * dY;
            const cYmax = boundingBox.yMax - (y + 1) * dY;

            cg.push([cXmin, cXmax, cYmin, cYmax]);
        });

        return cg;
    };

    if (!iBoundLayer) {
        return null;
    }

    const gridCells = calculateGridCells(model.boundingBox, model.gridSize, Cells.fromObject(iBoundLayer));
    const affectedCells = calculateGridCells(model.boundingBox, model.gridSize, props.boundary.cells);

    return (
        <FeatureGroup>
            <LayersControl position="topright">
                <LayersControl.Overlay name="Inactive cells" checked={true}>
                    <FeatureGroup color={styles.inactive.fillColor}>
                        {gridCells.map((c, k) => renderGridCell(k, c[0], c[1], c[2], c[3], styles.inactive))}
                    </FeatureGroup >
                </LayersControl.Overlay>
                <LayersControl.Overlay name="Affected cells" checked={true}>
                    <FeatureGroup color={styles.affected.fillColor}>
                        {affectedCells.map((c, k) => renderGridCell(k, c[0], c[1], c[2], c[3], styles.affected))}
                    </FeatureGroup >
                </LayersControl.Overlay>
                <LayersControl.Overlay name={`Cells of other ${props.boundary.type} boundaries`} checked={true}>
                    <FeatureGroup color={styles.other.fillColor}>
                        {boundaryLayers}
                    </FeatureGroup >
                </LayersControl.Overlay>
            </LayersControl>
        </FeatureGroup>
    );
};

export default affectedCellsLayer;
