import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Loader, Segment} from 'semantic-ui-react';
import FlopyPackages from '../../../../core/model/flopy/packages/FlopyPackages';
import {IFlopyPackages} from '../../../../core/model/flopy/packages/FlopyPackages.type';
import BoundaryCollection from '../../../../core/model/modflow/boundaries/BoundaryCollection';
import ModflowModel from '../../../../core/model/modflow/ModflowModel';
import Soilmodel from '../../../../core/model/modflow/soilmodel/Soilmodel';
import Transport from '../../../../core/model/modflow/transport/Transport';
import VariableDensity from '../../../../core/model/modflow/variableDensity';
import {IRootReducer} from '../../../../reducers';
import {updatePackages} from '../../actions/actions';
import {CALCULATE_PACKAGES_INPUT} from '../../worker/t03.worker';
import {ICalculatePackagesInputData} from '../../worker/t03.worker.type';
import {asyncWorker} from '../../worker/worker';
import * as Content from './index';

interface IProps {
    property: string;
}

const packageActualizationWrapper = (props: IProps) => {

    const [isCalculating, setIsCalculating] = useState<boolean>(true);
    const [isError, setError] = useState<boolean>(false);

    const T03 = useSelector((state: IRootReducer) => state.T03);
    const dispatch = useDispatch();

    const modelObj = useSelector((state: IRootReducer) => state.T03.model);
    const boundariesObj = useSelector((state: IRootReducer) => state.T03.boundaries);
    const soilmodelObj = useSelector((state: IRootReducer) => state.T03.soilmodel);
    const transportObj = useSelector((state: IRootReducer) => state.T03.transport);
    const variableDensityObj = useSelector((state: IRootReducer) => state.T03.variableDensity);

    const model = modelObj ? ModflowModel.fromObject(modelObj) : null;
    const boundaries = boundariesObj ? BoundaryCollection.fromObject(boundariesObj) : null;
    const soilmodel = soilmodelObj ? Soilmodel.fromObject(soilmodelObj) : null;
    const transport = transportObj ? Transport.fromObject(transportObj) : null;
    const variableDensity = variableDensityObj ? VariableDensity.fromObject(variableDensityObj) : null;
    const packages = T03.packages.data ? FlopyPackages.fromObject(T03.packages.data) : null;

    useEffect(() => {
        recalculate();
    }, []);

    const recalculate = () => {
        if (!boundaries || !model || !soilmodel || !transport || !variableDensity) {
            return;
        }

        setIsCalculating(true);
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
            dispatch(updatePackages(FlopyPackages.fromObject(data)));
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

    if (property === 'modflow') {
        return (
            <Content.Modflow
                model={model}
                boundaries={boundaries}
                soilmodel={soilmodel}
                packages={packages}
            />
        );
    }

    if (property === 'mt3d') {
        return (<Content.Mt3d/>);
    }

    if (property === 'seawat') {
        return (<Content.Seawat/>);
    }

    if (property === 'calculation') {
        return (<Content.Calculation/>);
    }

    return null;
};

export default packageActualizationWrapper;
