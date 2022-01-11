import { Array2D } from '../../../../../core/model/geometry/Array2D.type';
import { BoundaryCollection, Calculation, ModflowModel, Soilmodel } from '../../../../../core/model/modflow';
import { EResultType } from './flowResults';
import { FlopyModflowMfbas } from '../../../../../core/model/flopy/packages/mf';
import { FlopyPackages } from '../../../../../core/model/flopy';
import { Grid, Header, Segment } from 'semantic-ui-react';
import { fetchCalculationResultsFlow } from '../../../../../services/api';
import React, { useEffect, useState } from 'react';
import ResultsChart from '../../../../shared/complexTools/ResultsChart';
import ResultsMap from '../../maps/resultsMap';
import ResultsSelectorFlow from '../../../../shared/complexTools/ResultsSelectorFlow';

interface IProps {
  boundaries: BoundaryCollection;
  calculation: Calculation;
  model: ModflowModel;
  packages: FlopyPackages;
  soilmodel: Soilmodel;
}

const CrossSection = (props: IProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedLay, setSelectedLay] = useState<number>(0);
  const [selectedRow, setSelectedRow] = useState<number>(0);
  const [selectedCol, setSelectedCol] = useState<number>(0);
  const [selectedTotim, setSelectedTotim] = useState<number>(0);
  const [selectedType, setSelectedType] = useState<EResultType>(EResultType.HEAD);
  const [layerValues, setLayerValues] = useState<string[][] | null>(null);
  const [totalTimes, setTotalTimes] = useState<number[] | null>(null);
  const [data, setData] = useState<Array2D<number> | null>(null);
  const [ibound, setIbound] = useState<Array2D<number>>();

  const { boundaries, calculation, model, packages, soilmodel } = props;

  useEffect(() => {
    if (model === null || calculation === null) {
      return;
    }

    setSelectedCol(Math.floor(model.gridSize.nX / 2));
    setSelectedRow(Math.floor(model.gridSize.nY / 2));
    if (calculation && calculation.times) {
      fetchData({
        layer: selectedLay,
        totim: calculation.times.head.idx[calculation.times.head.idx.length - 1],
        type: selectedType,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (packages === null) {
      return;
    }
    const mfPackage = packages.mf.getPackage('bas');
    if (mfPackage instanceof FlopyModflowMfbas) {
      const cIbound = mfPackage.ibound;
      if (Array.isArray(cIbound) && Array.isArray(cIbound[0]) && cIbound.length > selectedLay) {
        const sIbound = cIbound as Array<Array2D<number>>;
        return setIbound(sIbound[selectedLay]);
      }
    }
    return setIbound(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLay]);

  useEffect(() => {
    if (calculation && calculation.times) {
      const times = selectedType === EResultType.HEAD ? calculation.times.head : calculation.times.drawdown;
      setLayerValues(calculation.layer_values);
      setSelectedTotim(times.idx.slice(-1)[0]);
      setTotalTimes(times.total_times);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calculation]);

  const fetchData = ({ layer, totim, type }: { layer: number; totim: number; type: EResultType }) => {
    if (!calculation) {
      return null;
    }
    const calculationId = calculation.id;
    setIsLoading(true);

    fetchCalculationResultsFlow(
      { calculationId, layer, totim, type },
      (cData: Array2D<number>) => {
        setSelectedLay(layer);
        setSelectedType(type);
        setSelectedTotim(totim);
        setData(cData);
        setIsLoading(false);
      },
      () => null
    );
  };

  const handleChangeSelector = ({ type, layer, totim }: { type: EResultType; layer: number; totim: number }) => {
    setSelectedType(type);
    setSelectedLay(layer);
    setSelectedTotim(totim);
    fetchData({ layer, totim, type });
  };

  const handleClickOnCell = (colRow: number[]) => {
    setSelectedRow(colRow[1]);
    setSelectedCol(colRow[0]);
  };

  return (
    <React.Fragment>
      {totalTimes && layerValues && (
        <ResultsSelectorFlow
          data={{
            type: selectedType,
            layer: selectedLay,
            totim: selectedTotim,
          }}
          onChange={handleChangeSelector}
          layerValues={layerValues}
          soilmodel={soilmodel}
          stressperiods={model.stressperiods}
          totalTimes={totalTimes}
        />
      )}
      <Segment color={'grey'} loading={isLoading}>
        {data && (
          <ResultsMap
            activeCell={[selectedCol, selectedRow]}
            boundaries={boundaries}
            data={data}
            ibound={ibound}
            mode="contour"
            model={model}
            onClick={handleClickOnCell}
          />
        )}
      </Segment>
      <Grid>
        <Grid.Row columns={2}>
          <Grid.Column>
            <Segment loading={isLoading} color={'blue'}>
              <Header textAlign={'center'} as={'h4'}>
                Horizontal cross section
              </Header>
              {data && (
                <ResultsChart data={data} col={selectedCol} row={selectedRow} show={'row'} yLabel={selectedType} />
              )}
            </Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment loading={isLoading} color={'blue'}>
              <Header textAlign={'center'} as={'h4'}>
                Vertical cross section
              </Header>
              {data && (
                <ResultsChart data={data} col={selectedCol} row={selectedRow} show={'col'} yLabel={selectedType} />
              )}
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </React.Fragment>
  );
};

export default CrossSection;
