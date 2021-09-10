import { AppContainer } from '../../shared';
import { DataSourceCollection, Rtm, Sensor } from '../../../core/model/rtm/monitoring';
import { Dimmer, Grid, Icon, Loader } from 'semantic-ui-react';
import { IRootReducer } from '../../../reducers';
import { IRtm } from '../../../core/model/rtm/monitoring/Rtm.type';
import { ISensor, ISensorParameter } from '../../../core/model/rtm/monitoring/Sensor.type';
import { IToolMetaDataEdit } from '../../shared/simpleTools/ToolMetaData/ToolMetaData.type';
import { ToolMetaData } from '../../shared/simpleTools';
import { clear, updateRtm } from '../actions/actions';
import { fetchUrl, sendCommand } from '../../../services/api';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import DataSources from '../components/setup/dataSources';
import Navigation from './Navigation';
import SensorMetaData from '../components/shared/sensorMetaData';
import Sensors from '../components/shared/sensors';
import SimpleToolsCommand from '../../shared/simpleTools/commands/SimpleToolsCommand';

const navigation = [
  {
    name: 'Documentation',
    path: 'https://inowas.com/tools',
    icon: <Icon name="file" />,
  },
];

interface IError {
  id: string;
  message: string;
}

const tool = 'T10';

const RtmTool = () => {
  const [errors, setErrors] = useState<IError[]>([]);
  const [isDirty, setDirty] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [selectedParameter, setSelectedParameter] = useState<ISensorParameter | null>(null);
  const [selectedSensor, setSelectedSensor] = useState<ISensor | null>(null);

  const dispatch = useDispatch();
  const history = useHistory();
  const { id, property } = useParams<{ id: string; property: string }>();

  const T10 = useSelector((state: IRootReducer) => state.T10);
  const rtm = T10.rtm ? Rtm.fromObject(T10.rtm) : null;

  useEffect(() => {
    return function () {
      dispatch(clear());
    };
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      setIsFetching(true);
      fetchUrl(
        `tools/${tool}/${id}`,
        (r: IRtm) => {
          dispatch(updateRtm(Rtm.fromObject(r)));

          if (r.data.sensors.length > 0) {
            const cSensor = Sensor.fromObject(r.data.sensors[0]);
            setSelectedSensor(cSensor.toObject());
            setSelectedParameter(cSensor.parameters.first);
          }

          setIsFetching(false);
          setDirty(false);
        },
        () => {
          setIsFetching(false);
        }
      );
      return;
    }
  }, [dispatch, history, id]);

  useEffect(() => {
    if (id && !property) {
      history.push(`/tools/${tool}/${id}/sensor-setup`);
    }
  }, [history, id, property]);

  const handleChange = () => {
    console.log('CHANGE');
  };

  const handleChangeSelectedParameter = (p: ISensorParameter | null) => {
    if (!p) {
      setSelectedParameter(null);
      return;
    }
    const dsc = DataSourceCollection.fromObject(p.dataSources);
    dsc.mergedData().then(() => {
      p.dataSources = dsc.toObject();
      setSelectedParameter(p);
    });
  };

  const handleChangeSelectedSensor = (s: Sensor | null) => {
    if (s?.id === selectedSensor?.id) {
      return null;
    }

    if (s && s?.parameters.length > 0) {
      setSelectedParameter(s.parameters.first);
    } else {
      setSelectedParameter(null);
    }

    setSelectedSensor(s ? s.toObject() : null);
  };

  const handleUpdateParameter = (p: ISensorParameter) => {
    if (!rtm || !selectedSensor) {
      return null;
    }

    handleChangeSelectedParameter(p);

    const cSensor = Sensor.fromObject(selectedSensor);
    cSensor.parameters = cSensor.parameters.update(p);

    const cRtm = Rtm.fromObject(rtm.toObject());
    cRtm.updateSensor(cSensor);
    handleSave(cRtm);
  };

  const handleUpdateSensor = (s: Sensor) => {
    if (!rtm) {
      return null;
    }

    setSelectedSensor(s.toObject());

    let sParameter = selectedParameter;
    if (selectedParameter && !s.parameters.findById(selectedParameter.id)) {
      sParameter = null;
    }
    if (!sParameter && s.parameters.length > 0) {
      sParameter = s.parameters.first;
    }
    handleChangeSelectedParameter(sParameter);

    const cRtm = Rtm.fromObject(rtm.toObject());
    cRtm.updateSensor(s);
    handleSave(cRtm);
  };

  const handleSaveMetaData = (tool: IToolMetaDataEdit) => {
    if (!rtm) {
      return;
    }
    const { name, description } = tool;
    const cRtm = rtm.toObject();
    cRtm.public = tool.public;
    cRtm.name = name;
    cRtm.description = description;
    handleSave(Rtm.fromObject(cRtm));
  };

  const handleSave = (r: Rtm) => {
    setIsSaving(true);
    sendCommand(SimpleToolsCommand.updateToolInstance(r.toObject()), () => {
      dispatch(updateRtm(r));
      setIsSaving(false);
    });
    if (selectedSensor && !r.sensors.findById(selectedSensor.id)) {
      setSelectedParameter(null);
      setSelectedSensor(null);
    }
  };

  if (!rtm) {
    return (
      <AppContainer navbarItems={navigation}>
        <Loader inverted={true}>Loading</Loader>
      </AppContainer>
    );
  }

  const renderContent = () => {
    if (!rtm) {
      return null;
    }

    return (
      <Sensors
        rtm={rtm}
        isDirty={isDirty}
        isError={errors.length > 0}
        onChange={handleChange}
        onChangeSelectedSensor={handleChangeSelectedSensor}
        onSave={handleSave}
        selectedSensor={selectedSensor ? Sensor.fromObject(selectedSensor) : null}
      >
        <SensorMetaData
          rtm={rtm}
          sensor={selectedSensor ? Sensor.fromObject(selectedSensor) : null}
          selectedParameter={selectedParameter}
          onChange={handleUpdateSensor}
          onChangeSelectedParameter={handleChangeSelectedParameter}
        />
        {selectedParameter && property === 'sensor-setup' && (
          <DataSources rtm={rtm} parameter={selectedParameter} onChange={handleUpdateParameter} />
        )}
      </Sensors>
    );
  };

  return (
    <AppContainer navbarItems={navigation} loading={isFetching}>
      {isSaving && (
        <Dimmer active inverted>
          <Loader inverted>Saving</Loader>
        </Dimmer>
      )}
      <ToolMetaData
        isDirty={isDirty}
        readOnly={false}
        tool={{
          tool: 'T10',
          name: rtm.name,
          description: rtm.description,
          public: rtm.public,
        }}
        onSave={handleSaveMetaData}
      />
      <Grid padded={true}>
        <Grid.Row>
          <Grid.Column width={3}>
            <Navigation isSaving={isSaving} property={property} />
          </Grid.Column>
          <Grid.Column width={13}>{renderContent()}</Grid.Column>
        </Grid.Row>
      </Grid>
    </AppContainer>
  );
};

export default RtmTool;
