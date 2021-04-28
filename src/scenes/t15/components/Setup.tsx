import {Form, Grid, InputProps, Segment} from 'semantic-ui-react';
import InfoBox from './InfoBox';
import Qmra from '../../../core/model/qmra/Qmra';
import React, {ChangeEvent, useState} from 'react';
import descriptions from './defaults/descriptions';

interface IProps {
  onChange: (qmra: Qmra) => void;
  qmra: Qmra;
}

const Setup = ({onChange, qmra}: IProps) => {
  const [activeInput, setActiveInput] = useState<null | string>(null);
  const [activeValue, setActiveValue] = useState<string>('');

  const handleBlur = () => {
    if (!activeInput) {
      return null;
    }

    qmra.numberOfRepeatings = parseFloat(activeValue);
    onChange(qmra);
    setActiveInput(null);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>, {name, value}: InputProps) => {
    setActiveInput(name);
    setActiveValue(value);
  };

  return (
    <Segment color={'grey'}>
      <Grid>
        <Grid.Row>
          <Grid.Column width={8}>
            <Form>
              <Form.Field>
                <Form.Input
                  label="Number of Monte Carlo runs"
                  name="numberOfRepeatings"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  readOnly={qmra.readOnly}
                  value={activeInput === 'numberOfRepeatings' ? activeValue : qmra.numberOfRepeatings}
                  type="number"
                />
              </Form.Field>
            </Form>
            <InfoBox header="Number of repeatings" description={descriptions.number_of_repeatings}/>
          </Grid.Column>
        </Grid.Row>
      </Grid>

    </Segment>
  );
};

export default Setup;
