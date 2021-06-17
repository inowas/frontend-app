import {BoundaryCollection} from '../../../core/model/modflow/boundaries';
import {Calculation, ModflowModel, Soilmodel, Transport, VariableDensity} from '../../../core/model/modflow';
import {IRootReducer} from '../../../reducers';
import {IRtModelling} from '../../../core/model/rtm/modelling/RTModelling.type';
import {IToolInstance} from '../../types';
import {List, Modal} from 'semantic-ui-react';
import {
  clear,
  updateBoundaries, updateCalculation,
  updateModel,
  updatePackages,
  updateRTModelling, updateSoilmodel,
  updateT10Instances,
  updateTransport, updateVariableDensity
} from '../actions/actions';
import {fetchApiWithToken, fetchCalculationDetails} from '../../../services/api';
import {loadSoilmodel} from '../../../core/model/modflow/soilmodel/services';
import {rtModellingFetcher} from '../services/rtmFetcher';
import {uniqBy} from 'lodash';
import {useDispatch, useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';
import FlopyPackages from '../../../core/model/flopy/packages/FlopyPackages';
import RTModelling from '../../../core/model/rtm/modelling/RTModelling';
import React, {ReactNode, useEffect, useState} from 'react';

interface IProps {
  children: ReactNode;
}

const DataFetcherWrapper = (props: IProps) => {
  const [rtmId, setRtmId] = useState<string | null>(null);

  const [fetchingBoundaries, setFetchingBoundaries] = useState<boolean>(true);
  const [fetchingBoundariesSuccess, setFetchingBoundariesSuccess] = useState<boolean | null>(null);

  const [fetchingCalculation, setFetchingCalculation] = useState<boolean>(true);
  const [fetchingCalculationSuccess, setFetchingCalculationSuccess] = useState<boolean | null>(null);

  const [fetchingInstances, setFetchingInstances] = useState<boolean>(true);
  const [fetchingInstancesSuccess, setFetchingInstancesSuccess] = useState<boolean | null>(null);

  const [fetchingModel, setFetchingModel] = useState<boolean>(true);
  const [fetchingModelSuccess, setFetchingModelSuccess] = useState<boolean | null>(null);

  const [fetchingPackages, setFetchingPackages] = useState<boolean>(true);
  const [fetchingPackagesSuccess, setFetchingPackagesSuccess] = useState<boolean | null>(null);

  const [fetchingRtm, setFetchingRtm] = useState<boolean>(true);
  const [fetchingRtmSuccess, setFetchingRtmSuccess] = useState<boolean | null>(null);

  const [fetchingSoilmodel, setFetchingSoilmodel] = useState<boolean>(true);
  const [fetchingSoilmodelSuccess, setFetchingSoilmodelSuccess] = useState<boolean | null>(null);

  const [fetchingTransport, setFetchingTransport] = useState<boolean>(true);
  const [fetchingTransportSuccess, setFetchingTransportSuccess] = useState<boolean | null>(null);

  const [fetchingVariableDensity, setFetchingVariableDensity] = useState<boolean>(true);
  const [fetchingVariableDensitySuccess, setFetchingVariableDensitySuccess] = useState<boolean | null>(null);

  const [showModal, setShowModal] = useState<boolean>(true);

  const [rtmFetcher, setRtmFetcher] = useState<{
    message: string;
    fetching: boolean;
  }>({
    message: 'Start Fetching RTM ...',
    fetching: true
  });

  const [soilmodelFetcher, setSoilmodelFetcher] = useState<{
    message: string;
    fetching: boolean;
  }>({
    message: 'Start Fetching Soilmodel ...',
    fetching: false
  });

  const dispatch = useDispatch();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const {id} = useParams();

  const T20 = useSelector((state: IRootReducer) => state.T20);
  const {model, boundaries, packages, rtmodelling, soilmodel, transport, t10instances, variableDensity} = T20;

  useEffect(() => {
    dispatch(clear());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (rtmId !== id) {
      setRtmId(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (rtmId) {
      fetchInstances();
      fetchRTModelling(rtmId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rtmId]);

  const fetchBoundaries = async (mId: string) => {
    setFetchingBoundaries(true);
    try {
      const b = (await fetchApiWithToken(`modflowmodels/${mId}/boundaries`)).data;
      const bc = BoundaryCollection.fromQuery(b);
      dispatch(updateBoundaries(bc));
      setFetchingBoundariesSuccess(true);
    } catch (err) {
      setFetchingBoundariesSuccess(false);
    } finally {
      setFetchingBoundaries(false);
    }
  };

  const fetchCalculation = async (cId: string) => {
    fetchCalculationDetails(cId)
      .then((cData) => dispatch(updateCalculation(Calculation.fromQuery(cData))))
      // tslint:disable-next-line:no-console
      .catch((cError) => console.log(cError));
  };

  const fetchInstances = async () => {
    setFetchingInstances(true);
    try {
      const privateT10Tools = (await fetchApiWithToken('tools/T10?public=false')).data;
      const publicT10Tools = (await fetchApiWithToken('tools/T10?public=true')).data;
      const tools = uniqBy(privateT10Tools.concat(publicT10Tools), (t: IToolInstance) => t.id);
      dispatch(updateT10Instances(tools));
      setFetchingInstancesSuccess(true);
    } catch (err) {
      setFetchingInstancesSuccess(false);
    } finally {
      setFetchingInstances(false);
    }
  };

  const fetchModflowModel = async (r: IRtModelling) => {
    setFetchingModel(true);
    try {
      const m = (await fetchApiWithToken(`modflowmodels/${r.data.model_id}`)).data
      dispatch(updateModel(ModflowModel.fromObject(m)));

      setFetchingVariableDensity(true);
      setFetchingTransport(true);
      setFetchingBoundaries(true);
      setFetchingPackages(true);
      setFetchingSoilmodel(true);

      await fetchBoundaries(m.id);
      await fetchPackages(m.id);
      await fetchSoilmodel(m.id);
      await fetchTransport(m.id);
      await fetchVariableDensity(m.id);

      setFetchingModelSuccess(true);
    } catch (err) {
      setFetchingModelSuccess(false);
    } finally {
      setFetchingModel(false);
    }
  };

  const fetchPackages = async (mId: string) => {
    try {
      const p = (await fetchApiWithToken(`modflowmodels/${mId}/packages`)).data
      dispatch(updatePackages(FlopyPackages.fromObject(p)));
      setFetchingPackagesSuccess(true);
    } catch (err) {
      setFetchingPackagesSuccess(false);
    } finally {
      setFetchingPackages(false);
    }
  };

  const fetchRTModelling = async (i: string) => {
    try {
      const r = (await fetchApiWithToken(`tools/t20/${i}`)).data
      const ri = RTModelling.fromObject(r);

      rtModellingFetcher(
        ri,
        (message) => {
          setRtmFetcher({message, fetching: true});
        },
        (result) => {
          setFetchingRtm(false);
          dispatch(updateRTModelling(result));
          fetchModflowModel(r);
          if (result.calculationId) {
            fetchCalculation(result.calculationId);
          } else {
            setFetchingCalculation(false);
            setFetchingCalculationSuccess(true);
          }
          setFetchingRtmSuccess(true);
          setRtmFetcher({message: 'Done', fetching: false});
        }
      );
    } catch (err) {
      setFetchingRtm(false);
      setFetchingRtmSuccess(false);
    }
  };

  const fetchSoilmodel = async (mId: string) => {
    try {
      const s = (await fetchApiWithToken(`modflowmodels/${mId}/soilmodel`)).data

      return loadSoilmodel(
        s,
        (r) => setSoilmodelFetcher(r),
        (r) => {
          setSoilmodelFetcher({
            message: 'Finished fetching soilmodel.',
            fetching: false
          });
          setFetchingSoilmodelSuccess(true);
          return dispatch(updateSoilmodel(Soilmodel.fromObject(r)));
        }
      );
    } catch (err) {
      setFetchingSoilmodelSuccess(false);
    } finally {
      setFetchingSoilmodel(false);
    }
  };

  const fetchTransport = async (mId: string) => {
    try {
      const t = (await fetchApiWithToken(`modflowmodels/${mId}/transport`)).data
      dispatch(updateTransport(Transport.fromObject(t)));
      setFetchingTransportSuccess(true);
    } catch (err) {
      setFetchingTransportSuccess(false);
    } finally {
      setFetchingTransport(false);
    }
  };

  const fetchVariableDensity = async (mId: string) => {
    try {
      const v = (await fetchApiWithToken(`modflowmodels/${mId}/variableDensity`)).data
      dispatch(updateVariableDensity(VariableDensity.fromObject(v)));
      setFetchingVariableDensitySuccess(true);
    } catch (err) {
      setFetchingVariableDensitySuccess(false);
    } finally {
      setFetchingVariableDensity(false);
    }
  };

  const renderList = (listItems: Array<{ name: string, loading: boolean, success: boolean | null }>) => (
    listItems.map((item, idx) => (
      <List.Item key={idx}>
        <List.Icon
          name={item.loading ? 'circle notched' : item.success ? 'check circle' : 'remove circle'}
          size={'large'}
          verticalAlign={'middle'}
          loading={item.loading}
        />
        <List.Content>
          <List.Header>{item.name}</List.Header>
        </List.Content>
      </List.Item>
    ))
  );

  const renderRtm = () => rtmFetcher.fetching ? `Real time modelling ... ${rtmFetcher.message}` : 'Real time modelling';

  const renderSoilmodel = () => soilmodelFetcher.fetching ? `Soilmodel ... ${soilmodelFetcher.message}` : 'Soilmodel';

  const everythingIsLoaded = () => {
    const eil: boolean = !!model && boundaries.length > 0 && !!rtmodelling && t10instances.length > 0 && !!soilmodel &&
      !!transport && !!variableDensity && !!packages;
    if (eil) {
      setTimeout(() => setShowModal(false), 1000);
    }
    return eil;
  };

  return (
    <div>
      {everythingIsLoaded() && props.children}
      <Modal size={'small'} closeIcon={false} open={showModal} dimmer={'inverted'}>
        <Modal.Header>Loading Data</Modal.Header>
        <Modal.Content>
          <List>
            {renderList([
              {name: 'T10 instances', loading: fetchingInstances, success: fetchingInstancesSuccess},
              {name: 'Main model', loading: fetchingModel, success: fetchingModelSuccess},
              {name: renderRtm(), loading: fetchingRtm, success: fetchingRtmSuccess},
              {name: 'Boundaries', loading: fetchingBoundaries, success: fetchingBoundariesSuccess},
              {name: 'Calculation', loading: fetchingCalculation, success: fetchingCalculationSuccess},
              {name: 'Packages', loading: fetchingPackages, success: fetchingPackagesSuccess},
              {
                name: renderSoilmodel(),
                loading: fetchingSoilmodel || soilmodelFetcher.fetching,
                success: fetchingSoilmodelSuccess
              },
              {name: 'Transport', loading: fetchingTransport, success: fetchingTransportSuccess},
              {
                name: 'Variable Density', loading: fetchingVariableDensity,
                success: fetchingVariableDensitySuccess
              }
            ])}
          </List>
        </Modal.Content>
      </Modal>
    </div>
  );
}

export default DataFetcherWrapper;
