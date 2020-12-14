import {Button, Message} from 'semantic-ui-react';
import {IFlopyPackages} from '../../../../../core/model/flopy/packages/FlopyPackages.type';
import {IT03Reducer} from '../../../../t03/reducers';
import {IT20Reducer} from '../../../../t20/reducers';
import {useDispatch} from 'react-redux';
import BoundaryCollection from '../../../../../core/model/modflow/boundaries/BoundaryCollection';
import FlopyModflow from '../../../../../core/model/flopy/packages/mf/FlopyModflow';
import FlopyModpath from '../../../../../core/model/flopy/packages/mp/FlopyModpath';
import FlopyMt3d from '../../../../../core/model/flopy/packages/mt/FlopyMt3d';
import FlopyPackages from '../../../../../core/model/flopy/packages/FlopyPackages';
import FlopySeawat from '../../../../../core/model/flopy/packages/swt/FlopySeawat';
import ModflowModel from '../../../../../core/model/modflow/ModflowModel';
import React, {useEffect, useState} from 'react';
import Soilmodel from '../../../../../core/model/modflow/soilmodel/Soilmodel';
import Transport from '../../../../../core/model/modflow/transport/Transport';
import VariableDensity from '../../../../../core/model/modflow/variableDensity/VariableDensity';

interface IProps {
    reducer: IT03Reducer | IT20Reducer;
    updateProcessedPackages: (packages: FlopyPackages) => {type: string; payload: IFlopyPackages};
    updateProcessingPackages: () => {type: string};
}

const PackagesUpdater = (props: IProps) => {
    const dispatch = useDispatch();

    const model = props.reducer.model ? ModflowModel.fromObject(props.reducer.model) : null;
    const boundaries = props.reducer.boundaries ? BoundaryCollection.fromObject(props.reducer.boundaries) : null;
    const soilmodel = props.reducer.soilmodel ? Soilmodel.fromObject(props.reducer.soilmodel) : null;
    const transport = props.reducer.transport ? Transport.fromObject(props.reducer.transport) : null;
    const variableDensity = props.reducer.variableDensity ? VariableDensity.fromObject(props.reducer.variableDensity) : null;
    const packages = props.reducer.packages.data ? FlopyPackages.fromObject(props.reducer.packages.data) : null;

    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    useEffect(() => {
        if (isProcessing) {
            recalculate();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isProcessing]);

    const recalculate = () => {
        if (model && boundaries && soilmodel && transport && variableDensity) {
            dispatch(props.updateProcessingPackages());
            setIsProcessing(true);

            let p;
            if (packages) {
                p = packages.update(model, soilmodel, boundaries, transport, variableDensity);
                dispatch(props.updateProcessedPackages(p));
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

            dispatch(props.updateProcessedPackages(p));
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
