import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import {Form, Grid} from 'semantic-ui-react';
import {BoundingBox, Cells, Geometry, GridSize, ModflowModel} from '../../../../../core/model/modflow';
import {BoundaryCollection} from '../../../../../core/model/modflow/boundaries';
import {calculateActiveCells} from '../../../../../services/geoTools';
import {dxCell, dyCell} from '../../../../../services/geoTools/distance';
import ContentToolBar from '../../../../shared/ContentToolbar2';
import {DiscretizationMap} from './index';

interface IProps {
    boundaries: BoundaryCollection;
    model: ModflowModel;
    onChange: (modflowModel: ModflowModel) => void;
    onSave: () => void;
    onUndo: () => void;
}

const gridEditor = (props: IProps) => {
    const [intersection, setIntersection] = useState<number>(50);
    const [gridSizeLocal, setGridSizeLocal] = useState<GridSize | null>(null);
    const intersectionRef = useRef<number>();

    useEffect(() => {
        setGridSizeLocal(props.model.gridSize);
        intersectionRef.current = 50;
    }, []);

    useEffect(() => {
        intersectionRef.current = intersection;
    }, [intersection]);

    useEffect(() => {
        if (gridSizeLocal && (gridSizeLocal.nX !== gridSize.nX || gridSizeLocal.nY !== gridSize.nY)) {
            setGridSizeLocal(props.model.gridSize);
        }
    }, [props.model.gridSize.nX, props.model.gridSize.nY]);

    const readOnly = props.model.readOnly;

    const calculate = (g: Geometry, bb: BoundingBox, gz: GridSize, i = 0) => {
        return new Promise((resolve: (cells: Cells) => void) => {
            resolve(calculateActiveCells(g, bb, gz, i / 100));
        });
    };

    const handleChangeIntersection = (i: number) => {
        setIntersection(i);
        calculate(props.model.geometry, props.model.boundingBox, props.model.gridSize, i).then(
            (c: Cells) => {
                const model = props.model.getClone();
                model.cells = Cells.fromObject(c.toObject());
                return props.onChange(model);
            }
        );
    };

    const handleGridSizeChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {type, target} = e;
        const {name, value} = target;

        if (type === 'change') {
            if (!gridSizeLocal) {
                return;
            }

            const gzl = gridSizeLocal.getClone();
            if (name === 'nX') {
                gzl.nX = parseInt(value, 10);
            }

            if (name === 'nY') {
                gzl.nY = parseInt(value, 10);
            }

            setGridSizeLocal(gzl);
        }

        if (type === 'blur') {
            if (!gridSizeLocal) {
                return;
            }

            const gz = GridSize.fromObject(gridSizeLocal.toObject());

            calculate(props.model.geometry, props.model.boundingBox, gz).then((c: Cells) => {
                const model = props.model.getClone();
                model.cells = Cells.fromObject(c.toObject());
                model.gridSize = GridSize.fromObject(gz.toObject());
                return props.onChange(model);
            });
        }
    };

    const handleChangeCells = (c: Cells) => {
        const model = props.model.getClone();
        model.cells = c;
        props.onChange(model);
    };

    const handleChangeGeometry = (g: Geometry) => {
        const bb = BoundingBox.fromGeoJson(g);
        calculate(g, bb, props.model.gridSize, intersectionRef.current || 0).then((c: Cells) => {
            const model = props.model.getClone();
            model.cells = Cells.fromObject(c.toObject());
            model.geometry = Geometry.fromObject(g.toObject());
            model.boundingBox = BoundingBox.fromObject(bb.toObject());
            return props.onChange(model);
        });
    };

    if (!gridSizeLocal) {
        return null;
    }

    const {boundingBox, geometry, gridSize} = props.model;

    return (
        <Grid>
            {!readOnly &&
            <Grid.Row>
                <Grid.Column width={16}>
                    <ContentToolBar
                        buttonSave={true}
                        onSave={props.onSave}
                        onUndo={props.onUndo}
                    />
                </Grid.Column>
            </Grid.Row>}
            <Grid.Row>
                <Grid.Column>
                    <Form>
                        <Form.Group>
                            <Form.Input
                                type="number"
                                label="Rows"
                                name={'nY'}
                                value={gridSizeLocal.nY}
                                onChange={handleGridSizeChange}
                                onBlur={handleGridSizeChange}
                                width={'6'}
                                readOnly={readOnly || props.boundaries.length > 0}
                            />
                            <Form.Input
                                type="number"
                                label="Columns"
                                name={'nX'}
                                value={gridSizeLocal.nX}
                                onChange={handleGridSizeChange}
                                onBlur={handleGridSizeChange}
                                width={'6'}
                                readOnly={readOnly || props.boundaries.length > 0}
                            />
                            <Form.Input
                                label="Cell height"
                                value={Math.round(dyCell(boundingBox, gridSize) * 10000) / 10}
                                width={'6'}
                                readOnly={true}
                            />
                            <Form.Input
                                label="Cell width"
                                value={Math.round(dxCell(boundingBox, gridSize) * 10000) / 10}
                                width={'6'}
                                readOnly={true}
                            />
                            <Form.Select
                                compact={true}
                                label="Length unit"
                                options={[{key: 2, text: 'meters', value: 2}]}
                                style={{zIndex: 10000}}
                                value={props.model.lengthUnit.toInt()}
                                disabled={readOnly || props.boundaries.length > 0}
                            />
                        </Form.Group>
                    </Form>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column>
                    <DiscretizationMap
                        cells={props.model.cells}
                        boundingBox={boundingBox}
                        boundaries={props.boundaries}
                        geometry={geometry}
                        gridSize={gridSize}
                        intersection={intersection}
                        onChangeGeometry={handleChangeGeometry}
                        onChangeCells={handleChangeCells}
                        onChangeIntersection={handleChangeIntersection}
                        readOnly={readOnly || props.boundaries.length > 0}
                    />
                </Grid.Column>
            </Grid.Row>

            <Grid.Row>
                <Grid.Column width={16}/>
            </Grid.Row>
        </Grid>
    );
};

export default gridEditor;
