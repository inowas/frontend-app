import { IScenario } from '../../../../core/marPro/Scenario.type';
import { Icon, Segment, Step } from 'semantic-ui-react';
import { useState } from 'react';
import Georeferencation from './Georeferencing';
import Scenario from '../../../../core/marPro/Scenario';
import Setup from './Setup';

const Editor = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [scenario, setScenario] = useState<IScenario | null>(Scenario.fromDefaults().toObject());

  const handleChangeScenario = (s: Scenario) => setScenario(s.toObject());

  const handleChangeStep = (step: number) => () => setActiveStep(step);

  const renderContent = () => {
    if (!scenario) {
      return null;
    }

    if (activeStep === 0) {
      return <Setup onChange={handleChangeScenario} scenario={Scenario.fromObject(scenario)} />;
    }

    if (activeStep === 1) {
      return <Georeferencation onChange={handleChangeScenario} scenario={Scenario.fromObject(scenario)} />;
    }

    return <div>Select a Step!</div>;
  };

  return (
    <>
      <Segment>
        <Step.Group widths={4}>
          <Step onClick={handleChangeStep(0)} active={activeStep === 0}>
            <Icon name="file alternate" />
            <Step.Content>
              <Step.Title>Setup</Step.Title>
            </Step.Content>
          </Step>
          <Step onClick={handleChangeStep(1)} active={activeStep === 1}>
            <Icon name="map pin" />
            <Step.Content>
              <Step.Title>Model</Step.Title>
            </Step.Content>
          </Step>
          <Step onClick={handleChangeStep(2)} active={activeStep === 2}>
            <Icon name="paint brush" />
            <Step.Content>
              <Step.Title>Settings</Step.Title>
            </Step.Content>
          </Step>
          <Step onClick={handleChangeStep(3)} active={activeStep === 3}>
            <Icon name="play" />
            <Step.Content>
              <Step.Title>Test</Step.Title>
            </Step.Content>
          </Step>
        </Step.Group>
      </Segment>
      {renderContent()}
    </>
  );
};

export default Editor;
