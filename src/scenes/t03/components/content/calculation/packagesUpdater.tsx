import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
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
import {fetchUrl} from '../../../../../services/api';
import {updatePackages} from '../../../actions/actions';

const packagesUpdater = () => {
    const T03 = useSelector((state: IRootReducer) => state.T03);
    const dispatch = useDispatch();

    useEffect(() => {
        if (T03.model) {
            fetchUrl(`modflowmodels/${T03.model.id}/packages`,
                (data) => {
                    const packages = FlopyPackages.fromQuery(data);
                    if (packages) {
                        dispatch(updatePackages(packages));
                    }
                }, () => ({}));
        }
    }, [T03.model]);

    useEffect(() => {
        const model = T03.model ? ModflowModel.fromObject(T03.model) : null;
        const boundaries = T03.boundaries ? BoundaryCollection.fromObject(T03.boundaries) : null;
        const soilmodel = T03.soilmodel ? Soilmodel.fromObject(T03.soilmodel) : null;
        const transport = T03.transport ? Transport.fromObject(T03.transport) : null;
        const variableDensity = T03.variableDensity ? VariableDensity.fromObject(T03.variableDensity) : null;
        const packages = T03.packages ? FlopyPackages.fromObject(T03.packages) : null;

        if (model && boundaries && soilmodel && transport && variableDensity) {
            let p;
            if (packages) {
                p = packages.update(model, soilmodel, boundaries, transport, variableDensity);
                dispatch(updatePackages(p));
                return;
            }

            p = FlopyPackages.create(
                model.id,
                FlopyModflow.create(model, soilmodel, boundaries),
                FlopyModpath.create(),
                FlopyMt3d.createFromTransport(transport),
                FlopySeawat.createFromVariableDensity(variableDensity)
            );

            dispatch(updatePackages(p));
        }
    }, [T03.model, T03.soilmodel, T03.boundaries, T03.transport, T03.variableDensity]);

    return null;
};

export default packagesUpdater;
