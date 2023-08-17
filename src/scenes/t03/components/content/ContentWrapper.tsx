import * as Content from './index';
import { BoundaryFactory } from '../../../../core/model/modflow/boundaries';
import { BoundaryType } from '../../../../core/model/modflow/boundaries/Boundary.type';
import { BudgetResults, FlowResults } from '../../../modflow/components/content/results';
import { IRootReducer } from '../../../../reducers';
import { Redirect, useLocation, useParams, useRouteMatch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import React from 'react';
import TransportResults from '../../../modflow/components/content/results/transportResults';

interface IRouterProps {
  id: string;
  property: string;
  type?: string;
}

const ContentWrapper = () => {
  const T03 = useSelector((state: IRootReducer) => state.T03);

  const params: IRouterProps = useParams();
  const { id, property, type } = params;
  const match = useRouteMatch();
  const location = useLocation();

  if (property === 'discretization') {
    return <Content.Discretization />;
  }

  if (property === 'soilmodel') {
    return <Content.SoilmodelEditor />;
  }

  if (property === 'boundaries') {
    if (type && BoundaryFactory.availableTypes.indexOf(type) > -1) {
      return <Content.CreateBoundary type={type as BoundaryType} />;
    }
    return <Content.Boundaries types={['chd', 'drn', 'evt', 'fhb', 'ghb', 'lak', 'rch', 'riv', 'wel']} />;
  }

  if (property === 'head_observations') {
    if (type === 'hob') {
      return <Content.CreateBoundary type="hob" />;
    }

    return <Content.Boundaries types={['hob']} />;
  }

  if (property === 'transport') {
    return <Content.Transport />;
  }

  if (property === 'variable_density') {
    return <Content.VariableDensityProperties />;
  }

  if (property === 'observations') {
    return <Content.Statistics />;
  }

  if (['modflow', 'mt3d', 'seawat', 'calculation'].includes(property)) {
    return <Content.PackageActualizationWrapper property={property} />;
  }

  if (property === 'flow') {
    return <FlowResults reducer={T03} />;
  }
  if (property === 'budget') {
    return <BudgetResults reducer={T03} />;
  }
  if (property === 'modpath') {
    return <Content.Modpath />;
  }
  if (property === 'concentration') {
    return <TransportResults reducer={T03} />;
  }
  if (property === 'optimization') {
    return <Content.Optimization />;
  }
  if (property === 'export') {
    return <Content.Export />;
  }

  const path = match.path;
  const basePath = path.split(':')[0];

  return <Redirect to={basePath + id + '/discretization' + location.search} />;
};

export default ContentWrapper;
