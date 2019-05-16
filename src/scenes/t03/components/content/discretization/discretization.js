import React from 'react';
import SubMenuWithContent from '../../../../../scenes/shared/complexTools/subMenuWithContent'
import StressperiodsEditor from './stressperiodsEditor';
import GridEditor from './gridEditor';

const menuItems = [
    {id: 'grid', name: 'Spatial discretization', component: <GridEditor/>},
    {id: 'stressperiods', name: 'Time discretization', component: <StressperiodsEditor/>},
];

const discretization = () => <SubMenuWithContent menuItems={menuItems}/>;

export default discretization;
