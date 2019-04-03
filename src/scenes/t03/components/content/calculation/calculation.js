import React from 'react';
import SubMenuWithContent from 'scenes/shared/complexTools/subMenuWithContent'
import Overview from './overview';
import Log from './log';
import Files from './files';

const menuItems = [
    {id: 'overview', name: 'Overview', component: <Overview/>},
    {id: 'logs', name: 'Calculation logs', component: <Log/>},
    {id: 'files', name: 'Modflow files', component: <Files/>},
];

const calculation = () => <SubMenuWithContent menuItems={menuItems}/>;

export default calculation;
