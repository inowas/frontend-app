import { ChangeEvent, useState } from 'react';
import { Form, Grid, InputProps, Segment, TextAreaProps } from 'semantic-ui-react';
import Scenario from '../../../../core/marPro/Scenario';

interface IProps {
  onChange: (scenario: Scenario) => any;
  scenario: Scenario;
}

const Setup = (props: IProps) => {
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [activeValue, setActiveValue] = useState<string>('');

  const handleBlurInput = () => {
    const scenario = props.scenario.toObject();

    if (activeInput === 'title') {
      scenario.title = activeValue;
    }
    if (activeInput === 'subtitle') {
      scenario.subtitle = activeValue;
    }
    if (activeInput === 'description') {
      scenario.description = activeValue;
    }

    setActiveInput(null);
    props.onChange(Scenario.fromObject(scenario));
  };

  const handleChangeInput = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    { name, value }: InputProps | TextAreaProps
  ) => {
    setActiveInput(name);
    setActiveValue(value);
  };

  return (
    <Grid>
      <Grid.Row>
        <Grid.Column width={16}>
          <Segment color="grey">
            <Form>
              <Form.Group widths="equal">
                <Form.Input
                  label="Scenario Title"
                  name="title"
                  onBlur={handleBlurInput}
                  onChange={handleChangeInput}
                  placeholder="Enter scenario title ..."
                  value={activeInput === 'title' ? activeValue : props.scenario.title}
                />
                <Form.Input
                  label="Scenario Sub Title"
                  name="subtitle"
                  onBlur={handleBlurInput}
                  onChange={handleChangeInput}
                  placeholder="Enter scenario sub title ..."
                  value={activeInput === 'subtitle' ? activeValue : props.scenario.subtitle}
                />
              </Form.Group>
              <Form.TextArea
                label="Scenario Description"
                name="description"
                onBlur={handleBlurInput}
                onChange={handleChangeInput}
                placeholder="Enter scenario description ..."
                value={activeInput === 'description' ? activeValue : props.scenario.description}
              />
            </Form>
          </Segment>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default Setup;
