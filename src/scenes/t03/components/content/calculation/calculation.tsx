import React from 'react';
import {useSelector} from 'react-redux';
import FlopyPackages from '../../../../../core/model/flopy/packages/FlopyPackages';
import {Calculation, ModflowModel} from '../../../../../core/model/modflow';
import {IRootReducer} from '../../../../../reducers';
import SubMenuWithContent from '../../../../../scenes/shared/complexTools/subMenuWithContent';
import Calculate from './calculate';
import Files from './files';
import Log from './log';

const calculationWrapper = () => {

    const T03 = useSelector((state: IRootReducer) => state.T03);

    const model = T03.model ? ModflowModel.fromObject(T03.model) : null;
    const packages = T03.packages.data ? FlopyPackages.fromObject(T03.packages.data) : null;
    const calculation = T03.calculation ? Calculation.fromObject(T03.calculation) : null;

    if (!model) {
        return null;
    }

    const menuItems = [
        {
            id: 'overview',
            name: 'Overview',
            component: <Calculate model={model} calculation={calculation} packages={packages}/>
        },
        {id: 'logs', name: 'Calculation logs', component: <Log/>},
        {id: 'files', name: 'Model files', component: <Files/>},
    ];

    return (
        <SubMenuWithContent menuItems={menuItems}/>
    );
};

export default calculationWrapper;
