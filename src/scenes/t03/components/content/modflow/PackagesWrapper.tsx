import React, {ReactNode, useEffect} from 'react';
import {useSelector} from 'react-redux';
import FlopyPackages from '../../../../../core/model/flopy/packages/FlopyPackages';
import {ModflowModel} from '../../../../../core/model/modflow';
import BoundaryCollection from '../../../../../core/model/modflow/boundaries/BoundaryCollection';
import Soilmodel from '../../../../../core/model/modflow/soilmodel/Soilmodel';
import {IRootReducer} from '../../../../../reducers';

interface IProps {
    renderChildren: boolean;
    children: ReactNode;
}

const packagesWrapper = (props: IProps) => {

    if (!props.renderChildren) {
        return null;
    }

    const T03 = useSelector((state: IRootReducer) => state.T03);

    const model = T03.model ? ModflowModel.fromObject(T03.model) : null;
    const boundaries = T03.boundaries ? BoundaryCollection.fromObject(T03.boundaries) : null;
    const soilmodel = T03.soilmodel ? Soilmodel.fromObject(T03.soilmodel) : null;
    const packages = T03.packages ? FlopyPackages.fromObject(T03.packages) : null;

    if (!model || !boundaries || !soilmodel) {
        return null;
    }

    useEffect(() => {
    }, [T03.model, T03.boundaries, T03.soilmodel]);

    return (
        <div>
            {props.children}
        </div>
    );
};

export default packagesWrapper;
