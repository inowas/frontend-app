import React, {FormEvent, useEffect, useState} from 'react';
import {Button, CheckboxProps, Dimmer, Form, Grid, Loader, Message, Radio, Segment} from 'semantic-ui-react';
import GridSize from '../../../../core/model/geometry/GridSize';
import {MCDA} from '../../../../core/model/mcda';
import {Gis, RasterLayer} from '../../../../core/model/mcda/gis';
import {IGis} from '../../../../core/model/mcda/gis/Gis.type';
import {dropData} from '../../../../services/api';
import {ITask, retrieveRasters} from '../../../../services/api/rasterHelper';
import {usePrevious} from '../../../shared/simpleTools/helpers/customHooks';
import ConstraintsMap from './constraintsMap';

interface IProps {
    gridSize: GridSize;
    onChange: (mcda: MCDA) => any;
    mcda: MCDA;
    readOnly: boolean;
}

const ConstraintsEditor = (props: IProps) => {
    const [constraints, setConstraints] = useState<IGis>(props.mcda.constraints.toObject());
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [mode, setMode] = useState<string>('map');
    const [showInfo, setShowInfo] = useState<boolean>(true);
    const prevConstraints = usePrevious(props.mcda.constraints.toObject());

    useEffect(() => {
        if (!props.mcda.constraints.rasterLayer) {
            setConstraints(props.mcda.constraints.toObject());
        }

        if (props.mcda.constraints) {
            constraintsToState(prevConstraints ? prevConstraints : null, props.mcda.constraints.toObject());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.mcda.constraints]);

    const constraintsToState = (cPrevConstraints: IGis | null, cConstraints: IGis) => {
        setIsFetching(true);

        const newConstraints = cConstraints;

        const tasks: ITask[] = [
            {
                raster: RasterLayer.fromObject(cConstraints.rasterLayer),
                oldUrl: cPrevConstraints && cPrevConstraints.rasterLayer ? cPrevConstraints.rasterLayer.url : '',
                onSuccess: (cRaster: RasterLayer) => newConstraints.rasterLayer = cRaster.toObject()
            }
        ];

        retrieveRasters(tasks, () => {
            setIsFetching(false);
            setConstraints(newConstraints);
        });
    };

    const handleDismiss = () => setShowInfo(false);

    const handleChange = (cConstraints: Gis) => {
        if (props.readOnly) {
            return;
        }

        const mcda = props.mcda;
        mcda.constraints = Gis.fromObject(constraints);

        if (!constraints.rasterLayer || !constraints.rasterLayer.data) {
            return props.onChange(mcda);
        }

        dropData(
            JSON.stringify(constraints.rasterLayer.data),
            (response) => {
                mcda.constraints.rasterLayer.url = response.filename;
                props.onChange(mcda);
            },
            (response) => {
                throw new Error(response);
            }
        );
    };

    const handleCalculateActiveCells = () => {
        const cConstraints = Gis.fromObject(constraints);
        cConstraints.calculateActiveCells(props.gridSize);
        return handleChange(cConstraints);
    };

    const handleChangeMode = (e: FormEvent<HTMLInputElement>, {value}: CheckboxProps) => setMode(value as string);

    return (
        <div>
            {isFetching &&
            <Dimmer active={true} inverted={true}>
                <Loader indeterminate={true}>Preparing Files</Loader>
            </Dimmer>
            }
            {showInfo &&
            <Message onDismiss={handleDismiss}>
                <Message.Header>Global Constraints</Message.Header>
                <p>
                    Draw zones, which should not be respected in the suitability calculation. It is necessary to
                    click on the &apos;Cut and Process&apos; button, after making changes.
                </p>
            </Message>
            }
            <Grid>
                <Grid.Column width={5}>
                    <Segment textAlign="center" inverted={true} color="grey" secondary={true}>
                        Mode
                    </Segment>
                    <Form>
                        <Form.Group grouped={true}>
                            <Form.Field>
                                <Radio
                                    label="Constraints"
                                    name="mode"
                                    value="map"
                                    checked={mode === 'map'}
                                    onChange={handleChangeMode}
                                />
                            </Form.Field>
                            <Form.Field>
                                <Radio
                                    label="Raster"
                                    name="mode"
                                    value="raster"
                                    checked={mode === 'raster'}
                                    disabled={!constraints.rasterLayer || constraints.rasterLayer.data.length === 0}
                                    onChange={handleChangeMode}
                                />
                            </Form.Field>
                            <Form.Field>
                                <Radio
                                    label="Suitable Cells"
                                    name="mode"
                                    value="cells"
                                    checked={mode === 'cells'}
                                    disabled={!constraints.activeCells || constraints.activeCells.length === 0}
                                    onChange={handleChangeMode}
                                />
                            </Form.Field>
                        </Form.Group>
                    </Form>
                    {mode === 'map' &&
                    <div>
                        <Segment textAlign="center" inverted={true} color="grey" secondary={true}>
                            Commands
                        </Segment>
                        <Message>
                            <p>Click the button below, to cut out the created clip features from the project area
                                and
                                calculate the suitability grid according to the given grid size.</p>
                        </Message>
                        <Button
                            fluid={true}
                            positive={true}
                            onClick={handleCalculateActiveCells}
                            disabled={props.readOnly}
                        >
                            Cut and Process
                        </Button>
                    </div>
                    }
                </Grid.Column>
                <Grid.Column width={11}>
                    <ConstraintsMap
                        gridSize={props.gridSize}
                        map={Gis.fromObject(constraints)}
                        onChange={handleChange}
                        mode={mode}
                        readOnly={props.readOnly}
                    />
                </Grid.Column>
            </Grid>
        </div>
    );
};

export default ConstraintsEditor;
