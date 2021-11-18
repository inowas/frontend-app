import { BoundaryCollection, ModflowModel, Soilmodel, Stressperiods } from '../../../core/model/modflow';
import { BoundaryFactory } from '../../../core/model/modflow/boundaries';
import { Button, Segment } from 'semantic-ui-react';
import { IBoundary } from '../../../core/model/modflow/boundaries/Boundary.type';
import { IModflowModel } from '../../../core/model/modflow/ModflowModel.type';
import { IRootReducer } from '../../../reducers';
import { appendBoundaryData } from './appendBoundaryData';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import BoundaryDetails from '../../t03/components/content/boundaries/boundaryDetails';
import RTModelling from '../../../core/model/rtm/modelling/RTModelling';
import _ from 'lodash';

const RTModellingBoundaryPreview = () => {
  const T20 = useSelector((state: IRootReducer) => state.T20);
  const boundaries = T20.boundaries ? BoundaryCollection.fromObject(T20.boundaries) : null;
  const model = T20.model ? ModflowModel.fromObject(T20.model) : null;
  const rtm = T20.rtmodelling ? RTModelling.fromObject(T20.rtmodelling) : null;
  const soilmodel = T20.soilmodel ? Soilmodel.fromObject(T20.soilmodel) : null;

  const [boundary, setBoundary] = useState<IBoundary>();
  const [updatedModel, setUpdatedModel] = useState<IModflowModel>();

  const history = useHistory();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { pid } = useParams();

  useEffect(() => {
    if (boundaries && model && rtm) {
      const result = appendBoundaryData(boundaries, model, rtm);
      if (result && result.boundaries) {
        const iBoundaries = result.boundaries.map((b) => BoundaryFactory.fromObject(b));
        const fBoundary = iBoundaries.filter((b) => b.id === pid);
        if (fBoundary.length > 0) {
          setBoundary(fBoundary[0].toObject());

          const cModel = _.cloneDeep(model);
          cModel.stressperiods = Stressperiods.fromObject(result.stressperiods);
          setUpdatedModel(cModel.toObject());
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!pid || !boundary || !updatedModel || !boundaries || !soilmodel) {
    return <div>Loading ...</div>;
  }

  return (
    <Segment color="grey">
      <Button onClick={() => history.goBack()}>Back</Button>
      <BoundaryDetails
        boundary={BoundaryFactory.fromObject(boundary)}
        boundaries={boundaries}
        model={ModflowModel.fromObject(updatedModel)}
        soilmodel={soilmodel}
        onChange={() => null}
        onClick={() => null}
        readOnly={true}
      />
    </Segment>
  );
};

export default RTModellingBoundaryPreview;
