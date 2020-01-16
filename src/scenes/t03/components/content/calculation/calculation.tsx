import React from 'react';
import SubMenuWithContent from '../../../../../scenes/shared/complexTools/subMenuWithContent';
import Calculate from './calculate';
import Files from './files';
import Log from './log';

const menuItems = [
    {id: 'overview', name: 'Overview', component: <Calculate/>},
    {id: 'logs', name: 'Calculation logs', component: <Log/>},
    {id: 'files', name: 'Model files', component: <Files/>},
];

const calculation = () => <SubMenuWithContent menuItems={menuItems}/>;

export default calculation;
