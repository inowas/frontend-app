import {
  BoundaryCollection,
  Calculation,
  ModflowModel,
  Soilmodel,
  Transport,
  VariableDensity,
} from '../../../../core/model/modflow';
import { FlopyPackages } from '../../../../core/model/flopy';
import { IRootReducer } from '../../../../reducers';
import { List, Modal } from 'semantic-ui-react';
import { ReactNode, useEffect, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  clear,
  updateBoundaries,
  updateCalculation,
  updateModel,
  updatePackages,
  updateSoilmodel,
  updateTransport,
  updateVariableDensity,
} from '../../actions/actions';
import { fetchApiWithToken, fetchCalculationDetails } from '../../../../services/api';
import { loadSoilmodel } from '../../../../core/model/modflow/soilmodel/services';
import { useDispatch, useSelector } from 'react-redux';

interface IOwnProps {
  children: ReactNode;
  modelId: string;
}

type IProps = IOwnProps & RouteComponentProps<{ id: string }>;

const DataFetcherWrapper = (props: IProps) => {
  const dispatch = useDispatch();

  const [modelId, setModelId] = useState<string | null>(props.modelId);

  const [fetchingModel, setFetchingModel] = useState<boolean>(false);
  const [fetchingModelSuccess, setFetchingModelSuccess] = useState<boolean | null>(null);

  const [fetchingBoundaries, setFetchingBoundaries] = useState<boolean>(false);
  const [fetchingBoundariesSuccess, setFetchingBoundariesSuccess] = useState<boolean | null>(null);

  const [fetchingPackages, setFetchingPackages] = useState<boolean>(false);
  const [fetchingPackagesSuccess, setFetchingPackagesSuccess] = useState<boolean | null>(null);

  const [fetchingSoilmodel, setFetchingSoilmodel] = useState<boolean>(false);
  const [fetchingSoilmodelSuccess, setFetchingSoilmodelSuccess] = useState<boolean | null>(null);

  const [fetchingTransport, setFetchingTransport] = useState<boolean>(false);
  const [fetchingTransportSuccess, setFetchingTransportSuccess] = useState<boolean | null>(null);

  const [fetchingVariableDensity, setFetchingVariableDensity] = useState<boolean>(false);
  const [fetchingVariableDensitySuccess, setFetchingVariableDensitySuccess] = useState<boolean | null>(null);

  const [showModal, setShowModal] = useState<boolean>(true);

  const [soilmodelFetcher, setSoilmodelFetcher] = useState<{
    message: string;
    fetching: boolean;
  }>({
    message: 'Start Fetching Soilmodel ...',
    fetching: false,
  });

  const Modflow = useSelector((state: IRootReducer) => state.ModflowReducer);
  const { model, soilmodel, boundaries, packages, variableDensity, transport } = Modflow;

  useEffect(() => {
    dispatch(clear());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (modelId !== props.modelId) {
      setModelId(props.modelId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.modelId]);

  useEffect(() => {
    if (modelId) {
      fetchModel(modelId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelId]);

  const fetchModel = async (id: string) => {
    if (!fetchingModel) {
      setFetchingModel(true);
      try {
        const m = (await fetchApiWithToken(`modflowmodels/${id}`)).data;
        const mfModel = ModflowModel.fromObject(m);
        dispatch(updateModel(mfModel));
        setFetchingModel(false);
        setFetchingModelSuccess(true);

        setFetchingVariableDensity(true);
        setFetchingTransport(true);
        setFetchingBoundaries(true);
        setFetchingPackages(true);
        setFetchingSoilmodel(true);

        await fetchBoundaries(m.id);
        await fetchSoilmodel(m.id);
        await fetchTransport(m.id);
        await fetchVariableDensity(m.id);
        await fetchPackages(m.id);

        if (mfModel.calculationId) {
          fetchCalculationDetails(mfModel.calculationId)
            .then((cData) => dispatch(updateCalculation(Calculation.fromQuery(cData))))
            .catch((cError) => handleError(cError));
        }

        setFetchingModelSuccess(true);
      } catch (err) {
        setFetchingModelSuccess(false);
        handleError(err);
      } finally {
        setFetchingModel(false);
      }
    }
  };

  const fetchBoundaries = async (id: string) => {
    try {
      const b = (await fetchApiWithToken(`modflowmodels/${id}/boundaries`)).data;
      const bc = BoundaryCollection.fromQuery(b);
      dispatch(updateBoundaries(bc));
      setFetchingBoundariesSuccess(true);
    } catch (err) {
      setFetchingBoundariesSuccess(false);
      handleError(err);
    } finally {
      setFetchingBoundaries(false);
    }
  };

  const fetchSoilmodel = async (mId: string) => {
    try {
      const s = (await fetchApiWithToken(`modflowmodels/${mId}/soilmodel`)).data;

      return loadSoilmodel(
        s,
        (r) => setSoilmodelFetcher(r),
        (r) => {
          setSoilmodelFetcher({
            message: 'Finished fetching soilmodel.',
            fetching: false,
          });
          setFetchingSoilmodelSuccess(true);
          return dispatch(updateSoilmodel(Soilmodel.fromObject(r)));
        }
      );
    } catch (err) {
      setFetchingSoilmodelSuccess(false);
      handleError(err);
    } finally {
      setFetchingSoilmodel(false);
    }
  };

  const fetchPackages = async (mId: string) => {
    try {
      const p = (await fetchApiWithToken(`modflowmodels/${mId}/packages`)).data;
      const packages = FlopyPackages.fromQuery(p);
      if (packages instanceof FlopyPackages) {
        dispatch(updatePackages(packages));
      }

      setFetchingPackagesSuccess(true);
    } catch (err) {
      handleError(err);
      setFetchingPackagesSuccess(false);
    } finally {
      setFetchingPackages(false);
    }
  };

  const fetchTransport = async (mId: string) => {
    try {
      const t = (await fetchApiWithToken(`modflowmodels/${mId}/transport`)).data;
      dispatch(updateTransport(Transport.fromObject(t)));
      setFetchingTransportSuccess(true);
    } catch (err) {
      setFetchingTransportSuccess(false);
      handleError(err);
    } finally {
      setFetchingTransport(false);
    }
  };

  const fetchVariableDensity = async (mId: string) => {
    try {
      const v = (await fetchApiWithToken(`modflowmodels/${mId}/variableDensity`)).data;
      dispatch(updateVariableDensity(VariableDensity.fromObject(v)));
      setFetchingVariableDensitySuccess(true);
    } catch (err) {
      setFetchingVariableDensitySuccess(false);
      handleError(err);
    } finally {
      setFetchingVariableDensity(false);
    }
  };

  const handleError = (dError: any) => {
    if (!dError.response || !dError.response.status) {
      return;
    }
    const { response } = dError;
    const { status } = response;
    if (status === 422 || status === 403) {
      props.history.push('/tools');
    }
  };

  const renderList = (listItems: Array<{ name: string; loading: boolean; success: boolean | null }>) =>
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
    ));

  const everythingIsLoaded = () => {
    const eil: boolean = !!model && !!boundaries && !!soilmodel && !!transport && !!variableDensity && !!packages;
    if (eil) {
      setTimeout(() => setShowModal(false), 1000);
    }
    return eil;
  };

  const renderSoilmodel = () => (soilmodelFetcher.fetching ? `Soilmodel ... ${soilmodelFetcher.message}` : 'Soilmodel');

  return (
    <div>
      {everythingIsLoaded() && props.children}
      <Modal size={'small'} closeIcon={false} open={showModal} dimmer={'inverted'}>
        <Modal.Header>Loading Model Data</Modal.Header>
        <Modal.Content>
          <List>
            {renderList([
              { name: 'Main model', loading: fetchingModel, success: fetchingModelSuccess },
              { name: 'Boundaries', loading: fetchingBoundaries, success: fetchingBoundariesSuccess },
              {
                name: renderSoilmodel(),
                loading: fetchingSoilmodel || soilmodelFetcher.fetching,
                success: fetchingSoilmodelSuccess,
              },
              { name: 'Transport', loading: fetchingTransport, success: fetchingTransportSuccess },
              {
                name: 'Variable Density',
                loading: fetchingVariableDensity,
                success: fetchingVariableDensitySuccess,
              },
              { name: 'Packages', loading: fetchingPackages, success: fetchingPackagesSuccess },
            ])}
          </List>
        </Modal.Content>
      </Modal>
    </div>
  );
};

export default withRouter(DataFetcherWrapper);
