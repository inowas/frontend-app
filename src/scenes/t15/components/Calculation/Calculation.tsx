import {AxiosError} from 'axios';
import {Button, Message, Segment} from 'semantic-ui-react';
import {IRootReducer} from '../../../../reducers';
import {makeQmraRequest} from '../../../../services/api';
import {updateResults} from '../../actions/actions';
import {useDispatch, useSelector} from 'react-redux';
import Export from './Export';
import Qmra from '../../../../core/model/qmra/Qmra';
import React, {useState} from 'react';

interface IProps {
  qmra: Qmra;
}

const Calculation = ({qmra}: IProps) => {
  const [error, setError] = useState<string | null>();
  const [isCalcilating, setIsCalculating] = useState<boolean>(false);

  const dispatch = useDispatch();

  const T15 = useSelector((state: IRootReducer) => state.T15);
  const results = T15.results;

  const handleClickCalculate = () => {
    const config = qmra.toPayload();

    setIsCalculating(true);
    makeQmraRequest(config, handleSuccess, handleError);
  };

  const handleError = (error: AxiosError) => {
    setIsCalculating(false);
    if (error.response && error.response.data) {
      setError(error.response.data);
    }
  };

  const handleSuccess = (r: any) => {
    setIsCalculating(false);
    dispatch(updateResults(r.data ? r.data : r));
  };

  return (
    <React.Fragment>
      <Segment color="black">
        <Button loading={isCalcilating} fluid primary onClick={handleClickCalculate}>
          {!results ? 'Run Calculation' : 'Recalculate'}
        </Button>
        {error &&
        <Message negative>
          <Message.Header>Error</Message.Header>
          <p>{error}</p>
        </Message>
        }
      </Segment>
      {results &&
      <Export
        results={results}
      />
      }
    </React.Fragment>
  );
};

export default Calculation;
