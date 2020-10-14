import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Button, Message} from 'semantic-ui-react';
import FlopyPackages from '../../../../../core/model/flopy/packages/FlopyPackages';
import FlopyModflow from '../../../../../core/model/flopy/packages/mf/FlopyModflow';
import FlopyModpath from '../../../../../core/model/flopy/packages/mp/FlopyModpath';
import FlopyMt3d from '../../../../../core/model/flopy/packages/mt/FlopyMt3d';
import FlopySeawat from '../../../../../core/model/flopy/packages/swt/FlopySeawat';
import BoundaryCollection from '../../../../../core/model/modflow/boundaries/BoundaryCollection';
import ModflowModel from '../../../../../core/model/modflow/ModflowModel';
import Soilmodel from '../../../../../core/model/modflow/soilmodel/Soilmodel';
import Transport from '../../../../../core/model/modflow/transport/Transport';
import VariableDensity from '../../../../../core/model/modflow/variableDensity/VariableDensity';
import {IRootReducer} from '../../../../../reducers';
import {
    updateProcessedPackages,
    updateProcessingPackages
} from '../../../actions/actions';

const PackagesUpdater = () => {
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

    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    useEffect(() => {
        if (isProcessing) {
            recalculate();
        }
    }, [isProcessing]);

    const recalculate = () => {
        if (model && boundaries && soilmodel && transport && variableDensity) {
            dispatch(updateProcessingPackages());
            setIsProcessing(true);

            let p;
            if (packages) {
                p = packages.update(model, soilmodel, boundaries, transport, variableDensity);
                dispatch(updateProcessedPackages(p));
                setIsProcessing(false);
                return;
            }

            p = FlopyPackages.create(
                model.id,
                FlopyModflow.create(model, soilmodel, boundaries),
                FlopyModpath.create(),
                FlopyMt3d.create(transport, boundaries),
                FlopySeawat.create(variableDensity)
            );

            dispatch(updateProcessedPackages(p));
            setIsProcessing(false);
        }
    };

    return (
        <Message color={'blue'}>
            <Message.Header as={'h4'}>Packages Updater</Message.Header>
            <Message.Content>
                {isProcessing && 'PROCESSING'}
                <Button
                    positive={true}
                    fluid={true}
                    onClick={() => setIsProcessing(true)}
                    disabled={model ? model.readOnly : true}
                >
                    Process
                </Button>
            </Message.Content>
        </Message>
    );
};

export default PackagesUpdater;
