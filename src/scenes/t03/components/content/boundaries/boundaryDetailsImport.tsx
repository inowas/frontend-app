import {Boundary, BoundaryCollection} from '../../../../../core/model/modflow/boundaries';
import {Label, Segment} from 'semantic-ui-react';
import {ModflowModel, Soilmodel} from '../../../../../core/model/modflow';
import {RechargeBoundary, WellBoundary} from '../../../../../core/model/modflow/boundaries';
import BoundaryMap from '../../maps/boundaryMap';
import EvapotranspirationBoundary from '../../../../../core/model/modflow/boundaries/EvapotranspirationBoundary';
import NoContent from '../../../../shared/complexTools/noContent';
import React from 'react';

interface IProps {
  boundary: Boundary;
  boundaries: BoundaryCollection;
  difference?: any;
  model: ModflowModel;
  soilmodel: Soilmodel;
  onChange: (boundary: Boundary) => any;
  readOnly: boolean;
}

const rechargeOptions = [
  {key: 0, value: 1, text: '1: Top grid layer'},
  {key: 1, value: 2, text: '2: Specified layer'},
  {key: 2, value: 3, text: '3: Highest active cell'}
];

const BoundaryDetailsImport = (props: IProps) => {
  const renderLayerSelection = () => {
    const {boundary} = props;

    if (!boundary.layers || ['riv'].includes(boundary.type)) {
      return null;
    }

    return (
      <React.Fragment>
        {(boundary instanceof RechargeBoundary || boundary instanceof EvapotranspirationBoundary) &&
        <Label basic={true} horizontal={true}>
          {rechargeOptions.filter((o) => o.value === boundary.optionCode)[0].text}
        </Label>
        }
        <Label basic={true} horizontal={true}>
          {boundary.layers.map(
            (l: number) => (props.soilmodel.layersCollection.toObject()[l].name)
          ).join(', ')}
        </Label>
      </React.Fragment>
    );
  };

  const {boundary, boundaries, model} = props;

  if (!boundary || !model.geometry) {
    return <NoContent message={'No objects.'}/>;
  }

  if (!boundary.layers || boundary.layers.length === 0) {
    return <NoContent message={'No layers.'}/>;
  }

  return (
    <div>
      <Segment basic={true} style={{padding: '0'}}>
        <Label basic={true} horizontal={true}>
          {boundary.type.toUpperCase()}
        </Label>
        <Label basic={true} horizontal={true}>
          {boundary.name}
        </Label>
        {boundary.type === 'wel' && boundary instanceof WellBoundary &&
        <Label basic={true} horizontal={true}>
          Well type:
          <Label.Detail>
            {WellBoundary.wellTypes.types
              .filter((wt) => wt.value === boundary.wellType)[0].name}
          </Label.Detail>
        </Label>
        }
        {renderLayerSelection()}
      </Segment>
      <BoundaryMap
        geometry={model.geometry}
        boundary={boundary}
        boundaries={boundaries}
      />
      {props.difference && <Segment inverted={false}>
        {JSON.stringify(props.difference)}
      </Segment>}
    </div>
  );
}

export default BoundaryDetailsImport;
