import React from 'react';
import SubMenuWithContent from '../../../../../scenes/shared/complexTools/subMenuWithContent';
import GridEditor from './gridEditor';
import StressperiodsEditor from './stressperiodsEditor';

const menuItems = [
    {id: 'grid', name: 'Spatial discretization', component: <GridEditor/>},
    {id: 'stressperiods', name: 'Time discretization', component: <StressperiodsEditor/>},
];

const discretization = () => <SubMenuWithContent menuItems={menuItems}/>;

export default discretization;
