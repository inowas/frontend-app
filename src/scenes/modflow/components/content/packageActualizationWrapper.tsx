import * as Content from './index';
import {CALCULATE_PACKAGES_INPUT} from '../../worker/t03.worker';
import {Calculation} from '../../../../core/model/modflow';
import {ICalculatePackagesInputData} from '../../worker/t03.worker.type';
import {IFlopyPackages} from '../../../../core/model/flopy/packages/FlopyPackages.type';
import {IT03Reducer} from '../../../t03/reducers';
import {IT20Reducer} from '../../../t20/reducers';
import {Loader, Segment} from 'semantic-ui-react';
import {asyncWorker} from '../../worker/worker';
import {useDispatch} from 'react-redux';
import BoundaryCollection from '../../../../core/model/modflow/boundaries/BoundaryCollection';
import FlopyPackages from '../../../../core/model/flopy/packages/FlopyPackages';
import ModflowModel from '../../../../core/model/modflow/ModflowModel';
import React, {useEffect, useState} from 'react';
import Soilmodel from '../../../../core/model/modflow/soilmodel/Soilmodel';
import Transport from '../../../../core/model/modflow/transport/Transport';
import VariableDensity from '../../../../core/model/modflow/variableDensity';

interface IProps {
    boundaries?: BoundaryCollection;
    model?: ModflowModel;
    property: string;
    reducer: IT03Reducer | IT20Reducer;
    updatePackages: (packages: FlopyPackages) => { type: string, payload: IFlopyPackages }
    startCalculation: () => { type: string };
}

const PackageActualizationWrapper = (props: IProps) => {
    const [isCalculating, setIsCalculating] = useState<boolean>(true);
    const [isError, setError] = useState<any>(false);

    const dispatch = useDispatch();
    const model = props.model || (props.reducer.model ? ModflowModel.fromObject(props.reducer.model) : null);
    const calculation = props.reducer.calculation ? Calculation.fromObject(props.reducer.calculation) : null;
    const boundaries = props.boundaries || (props.reducer.boundaries ? BoundaryCollection.fromObject(props.reducer.boundaries) : null);
    const soilmodel = props.reducer.soilmodel ? Soilmodel.fromObject(props.reducer.soilmodel) : null;
    const transport = props.reducer.transport ? Transport.fromObject(props.reducer.transport) : null;
    const variableDensity = props.reducer.variableDensity ? VariableDensity.fromObject(props.reducer.variableDensity) : null;
    const packages = props.reducer.packages.data ? FlopyPackages.fromObject(props.reducer.packages.data) : null;

    useEffect(() => {
        if (isCalculating) {
            recalculate();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [model, boundaries]);

    const recalculate = () => {
        if (!boundaries || !model || !soilmodel || !transport || !variableDensity) {
            return;
        }

        setIsCalculating(true);
        setError(false);
        asyncWorker({
            type: CALCULATE_PACKAGES_INPUT,
            data: {
                packages: packages ? packages.toObject() : null,
                model: model.toObject(),
                soilmodel: soilmodel.toObject(),
                boundaries: boundaries.toObject(),
                transport: transport.toObject(),
                variableDensity: variableDensity.toObject()
            } as ICalculatePackagesInputData
        }).then((data: IFlopyPackages) => {
            setIsCalculating(false);
            dispatch(props.updatePackages(FlopyPackages.fromObject(data)));
        }).catch(() => {
            setError(true);
            setIsCalculating(false);
        });
    };

    if (!model) {
        return <div>No model found!</div>;
    }

    if (!boundaries) {
        return <div>No boundaries found!</div>;
    }

    if (!soilmodel) {
        return <div>No soilmodel found!</div>;
    }

    if (!transport) {
        return <div>No transport found!</div>;
    }

    if (!variableDensity) {
        return <div>No variableDensity found!</div>;
    }

    if (isError) {
        return <div>Error in calculation found!</div>;
    }

    if (isCalculating) {
        return (
            <Segment>
                <Loader active={true} inline={'centered'}/>
            </Segment>
        );
    }

    const {property} = props;

    if (property === 'calculation') {
        return (
            <Content.Calculation
                model={model}
                packages={packages}
                calculation={calculation}
                startCalculation={props.startCalculation}
            />
        );
    }

    return null;
};

export default PackageActualizationWrapper;
