import { Button, Segment } from 'semantic-ui-react';
import { makeQmraRequest } from '../../../../services/api';
import Qmra from '../../../../core/model/qmra/Qmra';

interface IProps {
  qmra: Qmra;
}

const Calculation = ({ qmra }: IProps) => {
  const handleClickCalculate = () => {
    const config = qmra.toPayload().config;

    makeQmraRequest(config).then((response) => {
      console.log(response);
    });
  };

  return (
      <Segment color="black">
          <Button fluid primary onClick={handleClickCalculate}>Run Calculation</Button>
      </Segment>
  );
};
 
export default Calculation;
