import React, {MouseEvent, useEffect, useState} from 'react';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import {Step, StepProps} from 'semantic-ui-react';
import {MCDA} from '../../../../core/model/mcda';
import RasterLayer from '../../../../core/model/mcda/gis/RasterLayer';
import {IMCDA} from '../../../../core/model/mcda/MCDA.type';
import {ITask, retrieveRasters} from '../../../../services/api/rasterHelper';
import {usePrevious} from '../../../shared/simpleTools/helpers/customHooks';
import SuitabilityClasses from './suitabilityClasses';
import SuitabilityResults from './suitabilityResults';
import SuitabilityWeightAssignment from './suitabilityWA';

interface IProps extends RouteComponentProps<any> {
    activeTool?: string;
    onChange: (mcda: MCDA) => any;
    onClickTool: (name: string) => any;
    mcda: MCDA;
    readOnly: boolean;
}

const suitabilityEditor = (props: IProps) => {
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [mcda, setMcda] = useState<IMCDA>(props.mcda.toObject());
    const prevMcda = usePrevious<IMCDA>(props.mcda.toObject());

    useEffect(() => {
        if (props.mcda) {
            setIsFetching(true);
            const newMcda = props.mcda;

            const tasks: ITask[] = [
                {
                    raster: RasterLayer.fromObject(mcda.suitability.raster),
                    oldUrl: prevMcda ? prevMcda.suitability.raster.url : '',
                    onSuccess: (raster: RasterLayer) => newMcda.suitability.raster = raster
                }
            ];

            retrieveRasters(tasks, () => {
                setIsFetching(false);
                setMcda(newMcda.toObject());
            });
        }
    }, [props.mcda]);

    const handleClickStep = (e: MouseEvent<HTMLAnchorElement>, {name}: StepProps) => props.onClickTool(name);

    const renderTool = () => {
        const iMcda = MCDA.fromObject(mcda);

        switch (props.activeTool) {
            case 'results':
                return (
                    <SuitabilityResults
                        mcda={iMcda}
                    />
                );
            case 'classes':
                return (
                    <SuitabilityClasses
                        mcda={iMcda}
                        handleChange={props.onChange}
                        readOnly={props.readOnly}
                    />
                );
            default:
                return (
                    <SuitabilityWeightAssignment
                        mcda={iMcda}
                        handleChange={props.onChange}
                        readOnly={props.readOnly}
                    />
                );
        }
    };

    return (
        <div>
            <Step.Group fluid={true} widths={3}>
                <Step
                    active={props.activeTool === 'weightAssignment' || !props.activeTool}
                    name="weightAssignment"
                    icon="calculator"
                    title="Calculation"
                    link={true}
                    onClick={handleClickStep}
                />
                <Step
                    active={props.activeTool === 'classes'}
                    name="classes"
                    icon="chart bar"
                    title="Classes"
                    link={true}
                    onClick={handleClickStep}
                />
                <Step
                    active={props.activeTool === 'results'}
                    name="results"
                    icon="map"
                    title="Results"
                    link={true}
                    onClick={handleClickStep}
                />
            </Step.Group>
            {renderTool()}
        </div>
    );
};

export default withRouter(suitabilityEditor);
