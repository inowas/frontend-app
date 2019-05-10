import React from 'react';
import SubMenuWithContent from '../../../../../scenes/shared/complexTools/subMenuWithContent'
import Overview from './overview';
import Log from './log';
import Files from './files';

const menuItems = [
    {id: 'overview', name: 'Overview', component: <Overview/>},
    {id: 'logs', name: 'Calculation logs', component: <Log/>},
    {id: 'files-modflow', name: 'Modflow files', component: <Files type={'mf'}/>},
    {id: 'files-md3d', name: 'Mt3d file', component: <Files type={'mt'}/>}
];

const calculation = () => <SubMenuWithContent menuItems={menuItems}/>;

export default calculation;
