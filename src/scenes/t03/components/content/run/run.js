import React from 'react';
import SubMenuWithContent from 'scenes/shared/complexTools/subMenuWithContent'
import Overview from './overview';

const menuItems = [
    {id: 'overview', name: 'Overview', component: <Overview/>},
    {id: 'solver', name: 'Solver', component: <div>GridEditor</div>},
    {id: 'flow', name: 'Flow Package', component: <div>GridEditor</div>},
    {id: 'logs', name: 'Calculation logs', component: <div>GridEditor</div>},
    {id: 'files', name: 'Modflow files', component: <div>GridEditor</div>},
    {id: 'calibration', name: 'Calibration data', component: <div>GridEditor</div>},
];

const run = () => <SubMenuWithContent menuItems={menuItems}/>;

export default run;
