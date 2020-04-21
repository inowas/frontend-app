import _ from 'lodash';
import React from 'react';
import {FeatureGroup, Polyline} from 'react-leaflet';
import {useDispatch, useSelector} from 'react-redux';
import FlopyPackages from '../../core/model/flopy/packages/FlopyPackages';
import {Cells} from '../../core/model/geometry';
import {ICell} from '../../core/model/geometry/Cells.type';
import {ModflowModel} from '../../core/model/modflow';
import {Boundary, BoundaryCollection} from '../../core/model/modflow/boundaries';
import {IRootReducer} from '../../reducers';
import {addMessage} from '../../scenes/t03/actions/actions';
import {messageError} from '../../scenes/t03/defaults/messages';

interface IProps {
    boundary: Boundary;
}

enum ECellType {
    AFFECTED = 'affected',
    DIFFERENCE = 'difference',
    MODEL = 'model',
    OTHER = 'other'
}

interface IAffectedCell {
    x: number;
    y: number;
    type: ECellType;
}

const affectedCellsLayer = (props: IProps) => {

    const T03 = useSelector((state: IRootReducer) => state.T03);
    const boundaries = T03.boundaries ? BoundaryCollection.fromObject(T03.boundaries) : null;
    const model = T03.model ? ModflowModel.fromObject(T03.model) : null;
    const packages = T03.packages.data ? FlopyPackages.fromObject(T03.packages.data) : null;

    if (!model || !boundaries || !packages) {
        return null;
    }

    const dispatch = useDispatch();

    const getIntersection = (a: IAffectedCell[], b: ICell[]) => {
        return a.filter((itemA) =>
            b.filter((itemB) => itemA.x === itemB[1] && itemA.y === itemB[0]).length > 0
        );
    };

    const overrideCellType = (
        cells: IAffectedCell[],
        affectedCells: ICell[],
        type: ECellType,
        addDifference = false
    ) => {
        let overwrittenCells = _.cloneDeep(cells);
        affectedCells.forEach((bc) => {
            let cellIsActive = false;
            overwrittenCells = overwrittenCells.map((c) => {
                if (c.x === bc[1] && c.y === bc[0]) {
                    cellIsActive = true;
                    c.type = type;
                }
                return c;
            });
            if (!cellIsActive && addDifference) {
                overwrittenCells.push({
                    x: bc[1],
                    y: bc[0],
                    type: ECellType.DIFFERENCE
                });
            }
        });
        return overwrittenCells;
    };

    const calculateGrid = () => {
        const basPackage = packages.mf.getPackage('bas');

        if (!basPackage) {
            dispatch(addMessage(messageError('affectedCells', 'No BAS-Package found!')));
            return null;
        }

        const affectedLayers = props.boundary.layers;

        let cells: IAffectedCell[] = model.cells.toObject().map((r) => ({
            x: r[1],
            y: r[0],
            type: ECellType.MODEL
        }));

        // 1) Active cells are either taken from model or affected layers ibound
        const ibound = basPackage.toObject().ibound;
        affectedLayers.forEach((ln) => {
            if (ibound.length > 0 && Array.isArray(ibound[ln])) {
                const iboundCells = Cells.fromRaster(ibound[ln]).toObject();
                cells = getIntersection(cells, iboundCells);
            }
        });

        // 2) Affected cells are taken from boundary
        // 3) Difference between 1 and 2 result in non-active affected cells
        cells = overrideCellType(cells, props.boundary.cells.toObject(), ECellType.AFFECTED, true);

        // 4) Affected cells from boundaries of the same type
        const sameTypeBoundaries = boundaries.all.filter(
            (b) => b.type === props.boundary.type && b.id !== props.boundary.id);
        sameTypeBoundaries.forEach((b) => {
            cells = overrideCellType(cells, b.cells.toObject(), ECellType.OTHER);
        });

        return cells;
    };

    const calculateGridCells = () => {
        const cells = calculateGrid();
        if (!cells) {
            return null;
        }

        const boundingBox = model.boundingBox;
        const gridSize = model.gridSize;

        const dX = boundingBox.dX / gridSize.nX;
        const dY = boundingBox.dY / gridSize.nY;
        const grid: Array<[number, number, number, number, ECellType]> = [];

        cells.forEach((a) => {
            const x = a.y;
            const y = a.x;

            const cXmin = boundingBox.xMin + x * dX;
            const cXmax = boundingBox.xMin + (x + 1) * dX;
            const cYmin = boundingBox.yMax - y * dY;
            const cYmax = boundingBox.yMax - (y + 1) * dY;

            grid.push([cXmin, cXmax, cYmin, cYmax, a.type]);
        });

        return grid;
    };

    const renderGridCell = (key: number, xMin: number, xMax: number, yMin: number, yMax: number, type: ECellType) => {
        return (
            <Polyline
                key={key}
                positions={[
                    {lng: xMin, lat: yMin},
                    {lng: xMin, lat: yMax},
                    {lng: xMax, lat: yMax},
                    {lng: xMax, lat: yMin},
                    {lng: xMin, lat: yMin}
                ]}
                weight={0.2}
                stroke={true}
                color={'#888888'}
                fill={true}
                fillColor={type === ECellType.AFFECTED ? '#393B89' :
                    type === ECellType.DIFFERENCE ? '#843C39' :
                        type === ECellType.MODEL ? '#888888' :
                            '#9C9EDE'}
                fillOpacity={0.8}
            />
        );
    };

    const gridCells = calculateGridCells();
    if (!gridCells) {
        return null;
    }

    return (
        <FeatureGroup>
            {gridCells.map((c, k) => renderGridCell(k, c[0], c[1], c[2], c[3], c[4]))}
        </FeatureGroup>
    );
};

export default affectedCellsLayer;
