import { IModflowModel } from '../../../../core/model/modflow/ModflowModel.type';
import { IScenario } from '../../../../core/marPro/Scenario.type';
import { IToolInstance } from '../../../types';
import { Icon, Segment, Step } from 'semantic-ui-react';
import { ModflowModel } from '../../../../core/model/modflow';
import { fetchApiWithToken, fetchUrl } from '../../../../services/api';
import { uniqBy } from 'lodash';
import { useEffect, useState } from 'react';
import Georeferencation from './Georeferencing';
import Scenario from '../../../../core/marPro/Scenario';
import Settings from './Settings';
import Setup from './Setup';
import uuid from 'uuid';

const Editor = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [errors, setErrors] = useState<Array<{ id: string; message: string }>>([]);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [scenario, setScenario] = useState<IScenario | null>(Scenario.fromDefaults().toObject());
  const [selectedModel, setSelectedModel] = useState<IModflowModel>();
  const [t03Instances, setT03Instances] = useState<IToolInstance[]>();

  useEffect(() => {
    const fetchInstances = async () => {
      try {
        setIsFetching(true);
        const privateT03Instances = (await fetchApiWithToken('tools/T03?public=false')).data;
        const publicT03Instances = (await fetchApiWithToken('tools/T03?public=true')).data;

        const tools = uniqBy(privateT03Instances.concat(publicT03Instances), (t: IToolInstance) => t.id);
        setT03Instances(tools);
      } catch (err) {
        setErrors(errors.concat([{ id: uuid.v4(), message: 'Fetching t03 instances failed.' }]));
      } finally {
        setIsFetching(false);
      }
    };

    fetchInstances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchModel = (id: string) => {
    setIsFetching(true);
    fetchUrl(
      `modflowmodels/${id}`,
      (data) => {
        const mfModel = ModflowModel.fromQuery(data);

        if (scenario) {
          const cScenario = Scenario.fromObject(scenario);
          cScenario.modelId = id;
          cScenario.referencePoints = mfModel.boundingBox.getBoundsLatLng();
          setScenario(cScenario.toObject());
        }

        setSelectedModel(mfModel.toObject());
        setIsFetching(false);
      },
      () => {
        setErrors(errors.concat([{ id: uuid.v4(), message: 'Fetching model failed.' }]));
        setIsFetching(false);
      }
    );
  };

  const handleChangeScenario = (s: Scenario) => setScenario(s.toObject());

  const handleChangeStep = (step: number) => () => setActiveStep(step);

  const renderContent = () => {
    if (!scenario) {
      return null;
    }

    if (activeStep === 0) {
      return <Setup onChange={handleChangeScenario} scenario={Scenario.fromObject(scenario)} />;
    }

    if (activeStep === 1 && t03Instances) {
      return (
        <Georeferencation
          model={selectedModel ? ModflowModel.fromObject(selectedModel) : undefined}
          onChange={handleChangeScenario}
          onChangeModel={fetchModel}
          scenario={Scenario.fromObject(scenario)}
          t03Instances={t03Instances}
        />
      );
    }

    if (activeStep === 2) {
      return <Settings onChange={handleChangeScenario} scenario={Scenario.fromObject(scenario)} />;
    }

    return <div>Select a Step!</div>;
  };

  return (
    <>
      <Segment loading={isFetching}>
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
