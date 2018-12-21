import React from 'react';
import SubMenuWithContent from 'scenes/shared/complexTools/subMenuWithContent'
import Overview from './overview';
import Log from './log';
import Files from './files';

const menuItems = [
    {id: 'overview', name: 'Overview', component: <Overview/>},
 // {id: 'solver', name: 'Solver', component: <div>GridEditor</div>},
 // {id: 'flow', name: 'Flow Package', component: <div>GridEditor</div>},
    {id: 'logs', name: 'Calculation logs', component: <Log/>},
    {id: 'files', name: 'Modflow files', component: <Files/>},
 // {id: 'calibration', name: 'Calibration data', component: <div>GridEditor</div>},
];

const run = () => <SubMenuWithContent menuItems={menuItems}/>;

export default run;
