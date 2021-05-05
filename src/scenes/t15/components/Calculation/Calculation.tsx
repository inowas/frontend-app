import { Button, Segment, Tab} from 'semantic-ui-react';
import {IRootReducer} from '../../../../reducers';
import { makeQmraRequest } from '../../../../services/api';
import {updateResults} from '../../actions/actions';
import {useDispatch, useSelector} from 'react-redux';
import IResults from '../../../../core/model/qmra/result/Results.type';
import MeanLogReductionOfTreatmentSteps from './MeanLogReductionOfTreatmentSteps';
import MedianInflowConcentration from './MedianInflowConcentration';
import Qmra from '../../../../core/model/qmra/Qmra';
import React, { useState } from 'react';

interface IProps {
  onChange: (r: IResults) => void;
  qmra: Qmra;
}

const Calculation = ({ onChange, qmra }: IProps) => {
  const [isCalcilating, setIsCalculating] = useState<boolean>(false);

  const dispatch = useDispatch();

  const T15 = useSelector((state: IRootReducer) => state.T15);
  const results = T15.results;

  const handleClickCalculate = () => {
    const config = qmra.toPayload();

    setIsCalculating(true);
    makeQmraRequest(config).then((response: IResults) => {
      setIsCalculating(false);
      dispatch(updateResults(response));
    });
  };

  const renderTab1 = () => {
    if (!results) {
      return;
    }

    return (
      <Tab.Pane>
        <MedianInflowConcentration data={results.stats_total} />
      </Tab.Pane>
    );
  };

  const renderTab2 = () => {
    if (!results) {
      return;
    }

    return (
      <Tab.Pane>
        <MeanLogReductionOfTreatmentSteps data={results.stats_logremoval} />
      </Tab.Pane>
    );
  };

  const renderTabs = () => {
    if (!results) {
      return;
    }

    const panes = [
      { menuItem: 'Median Inflow Concentration', render: renderTab1 },
      { menuItem: 'Mean Log Reduction of Treatment Steps', render: renderTab2 }
    ];

    return <Tab panes={panes} />;
  };

  return (
    <React.Fragment>
      <Segment color="black">
        <Button loading={isCalcilating} fluid primary onClick={handleClickCalculate}>
          {!results ? 'Run Calculation' : 'Recalculate'}
        </Button>
      </Segment>
      {renderTabs()}
    </React.Fragment>
  );
};

export default Calculation;
