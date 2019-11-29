import React from 'react';
import SubMenuWithContent from '../../../../../scenes/shared/complexTools/subMenuWithContent';
import Files from './files';
import Log from './log';
import Overview from './overview';

const menuItems = [
    {id: 'overview', name: 'Overview', component: <Overview/>},
    {id: 'logs', name: 'Calculation logs', component: <Log/>},
    {id: 'files', name: 'Model files', component: <Files/>},
];

const calculation = () => <SubMenuWithContent menuItems={menuItems}/>;

export default calculation;
