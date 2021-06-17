import * as Content from './index';
import { CALCULATE_PACKAGES_INPUT } from '../../../modflow/worker/t03.worker';
import {Calculation} from '../../../../core/model/modflow';
import { ICalculatePackagesInputData } from '../../../modflow/worker/t03.worker.type';
import { IFlopyPackages } from '../../../../core/model/flopy/packages/FlopyPackages.type';
import { IRootReducer } from '../../../../reducers';
import { Loader, Segment } from 'semantic-ui-react';
import { asyncWorker } from '../../../modflow/worker/worker';
import {startCalculation, updatePackages } from '../../actions/actions';
import { useDispatch, useSelector } from 'react-redux';
import BoundaryCollection from '../../../../core/model/modflow/boundaries/BoundaryCollection';
import FlopyPackages from '../../../../core/model/flopy/packages/FlopyPackages';
import ModflowModel from '../../../../core/model/modflow/ModflowModel';
import React, { useEffect, useState } from 'react';
import Soilmodel from '../../../../core/model/modflow/soilmodel/Soilmodel';
import Transport from '../../../../core/model/modflow/transport/Transport';
import VariableDensity from '../../../../core/model/modflow/variableDensity';

interface IProps {
  property: string;
}

const PackageActualizationWrapper = (props: IProps) => {

  const [isCalculating, setIsCalculating] = useState<boolean>(true);
  const [isError, setError] = useState<any>(false);

  const T03 = useSelector((state: IRootReducer) => state.T03);
  const dispatch = useDispatch();

  const model = T03.model ? ModflowModel.fromObject(T03.model) : null;
  const boundaries = T03.boundaries ? BoundaryCollection.fromObject(T03.boundaries) : null;
  const calculation = T03.calculation ? Calculation.fromObject(T03.calculation) : null;
  const soilmodel = T03.soilmodel ? Soilmodel.fromObject(T03.soilmodel) : null;
  const transport = T03.transport ? Transport.fromObject(T03.transport) : null;
  const variableDensity = T03.variableDensity ? VariableDensity.fromObject(T03.variableDensity) : null;
  const packages = T03.packages.data ? FlopyPackages.fromObject(T03.packages.data) : null;

  useEffect(() => {
    recalculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const recalculate = () => {
    if (!boundaries || !model || !soilmodel || !transport || !variableDensity) {
      return;
    }

    setIsCalculating(true);
    setError(false);
    asyncWorker({
      type: CALCULATE_PACKAGES_INPUT,
      data: {
        packages: packages ? packages.toObject() : null,
        model: model.toObject(),
        soilmodel: soilmodel.toObject(),
        boundaries: boundaries.toObject(),
        transport: transport.toObject(),
        variableDensity: variableDensity.toObject()
      } as ICalculatePackagesInputData
    }).then((data: IFlopyPackages) => {
      setIsCalculating(false);
      dispatch(updatePackages(FlopyPackages.fromObject(data)));
    }).catch(() => {
      setError(true);
      setIsCalculating(false);
    });
  };

  if (!model) {
    return <div>No model found!</div>;
  }

  if (!boundaries) {
    return <div>No boundaries found!</div>;
  }

  if (!soilmodel) {
    return <div>No soilmodel found!</div>;
  }

  if (!transport) {
    return <div>No transport found!</div>;
  }

  if (!variableDensity) {
    return <div>No variableDensity found!</div>;
  }

  if (isError) {
    return <div>Error in calculation found!</div>;
  }

  if (isCalculating) {
    return (
      <Segment>
        <Loader active={true} inline={'centered'} />
      </Segment>
    );
  }

  const { property } = props;

  if (property === 'modflow' && packages instanceof FlopyPackages) {
    return (
      <Content.Modflow
        boundaries={boundaries}
        model={model}
        packages={packages}
        soilmodel={soilmodel}
      />
    );
  }

  if (property === 'mt3d' && packages instanceof FlopyPackages) {
    return (
      <Content.Mt3d
        model={model}
        packages={packages}
        soilmodel={soilmodel}
        transport={transport}
      />
    );
  }

  if (property === 'seawat' && packages instanceof FlopyPackages) {
    return (
      <Content.Seawat
        boundaries={boundaries}
        model={model}
        packages={packages}
        transport={transport}
        variableDensity={variableDensity}
      />
    );
  }

  if (property === 'calculation') {
    return (<Content.Calculation
      calculation={calculation}
      model={model}
      packages={packages}
      startCalculation={startCalculation}
    />);
  }

  return null;
};

export default PackageActualizationWrapper;
