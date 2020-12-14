import {Calculation, ModflowModel} from '../../../../../core/model/modflow';
import Calculate from './calculate';
import Files from './files';
import FlopyPackages from '../../../../../core/model/flopy/packages/FlopyPackages';
import Log from './log';
import React from 'react';
import SubMenuWithContent from '../../../../../scenes/shared/complexTools/subMenuWithContent';

interface IProps {
    calculation: Calculation | null;
    model: ModflowModel;
    packages: FlopyPackages | null;
    startCalculation: () => { type: string };
}

// tslint:disable-next-line:variable-name
const CalculationWrapper = (props: IProps) => {
    if (!props.model) {
        return null;
    }

    const menuItems = [
        {
            id: 'overview',
            name: 'Overview',
            component: <Calculate model={props.model} calculation={props.calculation} packages={props.packages}
                                  startCalculation={props.startCalculation}/>
        },
        {id: 'logs', name: 'Calculation logs', component: <Log/>},
        {id: 'files', name: 'Model files', component: <Files/>},
    ];

    return (
        <SubMenuWithContent menuItems={menuItems}/>
    );
};

export default CalculationWrapper;
