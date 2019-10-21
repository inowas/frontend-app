import React, {MouseEvent, useEffect, useState} from 'react';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import {Dimmer, Loader, MenuItemProps, Message, Step} from 'semantic-ui-react';
import {MCDA} from '../../../../core/model/mcda';
import {Criterion} from '../../../../core/model/mcda/criteria';
import {ICriterion} from '../../../../core/model/mcda/criteria/Criterion.type';
import {RasterLayer} from '../../../../core/model/mcda/gis';
import {ITask, retrieveRasters} from '../../../../services/api/rasterHelper';
import {usePrevious} from '../../../shared/simpleTools/helpers/customHooks';
import {criterionStep} from '../../defaults/defaults';
import CriteriaDataConstraints from './criteriaDataConstraints';
import CriteriaDataResults from './criteriaDataResults';
import {CriteriaRasterUpload, CriteriaReclassification} from './index';

interface IProps extends RouteComponentProps<any> {
    activeTool?: string;
    criterion?: Criterion;
    onChange: (mcda: MCDA) => any;
    mcda: MCDA;
    onClickTool: (id: string, name: string) => any;
    readOnly: boolean;
}

const criteriaDataEditor = (props: IProps) => {
    const [criterion, setCriterion] = useState<ICriterion | null>(null);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const prevCriterion = usePrevious<ICriterion | null>(props.criterion ? props.criterion.toObject() : null);

    useEffect(() => {
        const nextCriterion = props.criterion;

        const fetchRasters = (!prevCriterion && nextCriterion) ||
            (prevCriterion && nextCriterion && prevCriterion.id !== nextCriterion.id) ||
            (prevCriterion && nextCriterion && (
                (nextCriterion.raster.url !== prevCriterion.raster.url) ||
                (nextCriterion.constraintRaster.url !== prevCriterion.constraintRaster.url) ||
                (nextCriterion.suitability.url !== prevCriterion.suitability.url)
            ));

        if (fetchRasters) {
            getRasterData();
            return;
        }

        if (prevCriterion && nextCriterion && !fetchRasters) {
            const newCriterion = nextCriterion.toObject();

            setCriterion({
                ...newCriterion,
                raster: prevCriterion.raster,
                constraintRaster: prevCriterion.constraintRaster,
                suitability: prevCriterion.suitability
            });
        }
    }, [props.criterion]);

    const getRasterData = () => {
        setIsFetching(true);
        const cCriterion = props.criterion;

        if (!cCriterion) {
            return null;
        }

        const tasks: ITask[] = [
            {
                raster: cCriterion.raster,
                oldUrl: prevCriterion ? prevCriterion.raster.url : '',
                onSuccess: (response: RasterLayer) => {
                    cCriterion.raster = response;
                }
            },
            {
                raster: cCriterion.constraintRaster,
                oldUrl: prevCriterion ? prevCriterion.constraintRaster.url : '',
                onSuccess: (response: RasterLayer) => {
                    cCriterion.constraintRaster = response;
                }
            },
            {
                raster: cCriterion.suitability,
                oldUrl: prevCriterion ? prevCriterion.suitability.url : '',
                onSuccess: (response: RasterLayer) => {
                    cCriterion.suitability = response;
                }
            },
        ];

        retrieveRasters(tasks, () => {
            setCriterion(cCriterion.toObject());
            setIsFetching(false);
        });
    };

    const handleChange = (cCriterion: Criterion) => {
        const mcda = props.mcda;
        mcda.criteriaCollection = mcda.criteriaCollection.update(cCriterion.toObject());
        return props.onChange(mcda);
    };

    const handleClickStep = (e: MouseEvent<HTMLAnchorElement>, {name}: MenuItemProps) => {
        if (props.criterion && typeof name === 'string') {
            props.onClickTool(props.criterion.id, name);
        }
    };

    const renderTool = () => {
        if (criterion) {
            const rCriterion = Criterion.fromObject(criterion);

            switch (props.activeTool) {
                case 'reclassification':
                    if (rCriterion.step < criterionStep.AFTER_CONSTRAINTS) {
                        return props.onClickTool(rCriterion.id, 'upload');
                    }
                    return (
                        <CriteriaReclassification
                            criterion={rCriterion}
                            onChange={handleChange}
                            readOnly={props.readOnly}
                        />
                    );
                case 'constraints':
                    if (rCriterion.step < criterionStep.AFTER_UPLOAD) {
                        return props.onClickTool(rCriterion.id, 'upload');
                    }
                    return (
                        <CriteriaDataConstraints
                            criterion={rCriterion}
                            gridSize={props.mcda.gridSize}
                            onChange={handleChange}
                            readOnly={props.readOnly}
                        />
                    );
                case 'results':
                    if (rCriterion.step < criterionStep.AFTER_RECLASSIFICATION) {
                        return props.onClickTool(rCriterion.id, 'upload');
                    }
                    return (
                        <CriteriaDataResults
                            criterion={rCriterion}
                            gridSize={props.mcda.gridSize}
                            onChange={handleChange}
                        />
                    );
                default:
                    return (
                        <CriteriaRasterUpload
                            criterion={rCriterion}
                            gridSize={props.mcda.gridSize}
                            onChange={handleChange}
                            readOnly={props.readOnly}
                        />
                    );
            }
        }
    };

    return (
        <div>
            {isFetching &&
            <Dimmer active={true} inverted={true}>
                <Loader indeterminate={true}>Preparing Files</Loader>
            </Dimmer>
            }
            {!criterion ?
                <Message
                    content="Select a criterion from the navigation on the bottom left. Don't forget to set gridSize
                    first."
                    icon="lock"
                    warning={true}
                />
                :
                <div>
                    <Step.Group fluid={true}>
                        <Step
                            active={props.activeTool === 'upload'}
                            name="upload"
                            icon="upload"
                            title="Upload"
                            link={true}
                            onClick={handleClickStep}
                        />
                        <Step
                            active={props.activeTool === 'constraints'}
                            disabled={criterion.step < criterionStep.AFTER_UPLOAD}
                            name="constraints"
                            icon="eraser"
                            title="Constraints"
                            link={true}
                            onClick={handleClickStep}
                        />
                        <Step
                            active={props.activeTool === 'reclassification'}
                            disabled={criterion.step < criterionStep.AFTER_CONSTRAINTS}
                            name="reclassification"
                            icon="chart bar"
                            title="Reclassification"
                            link={true}
                            onClick={handleClickStep}
                        />
                        <Step
                            active={props.activeTool === 'results'}
                            disabled={criterion.step < criterionStep.AFTER_RECLASSIFICATION}
                            name="results"
                            icon="map"
                            title="Results"
                            link={true}
                            onClick={handleClickStep}
                        />
                    </Step.Group>
                    {
                        renderTool()
                    }
                </div>
            }
        </div>
    );
};

export default withRouter(criteriaDataEditor);
