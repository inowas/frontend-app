import {ICell} from '../../../core/model/geometry/Cells.type';
import {List, Popup} from 'semantic-ui-react';
import React, {ReactNode} from 'react';

export type CellAnalyzerParameters = Array<{ name: string; value: number; }>;

interface IProps {
  cell?: ICell;
  children: ReactNode;
  latlng?: [number, number];
  onDismiss: () => void;
  open: boolean;
  parameters?: CellAnalyzerParameters;
}

const CellAnalyzer = (props: IProps) => {
  const renderCellInfo = () => {
    return (
      <List>
        <List.Item><List.Header>Coordinates</List.Header></List.Item>
        {props.latlng &&
        <React.Fragment>
          <List.Item>
            <span style={{float: 'left'}}>lat:</span>&nbsp;
            <span style={{float: 'right'}}>{props.latlng[1].toFixed(4)}</span>
          </List.Item>
          <List.Item>
            <span style={{float: 'left'}}>lng:</span>&nbsp;
            <span style={{float: 'right'}}>{props.latlng[0].toFixed(4)}</span>
          </List.Item>
        </React.Fragment>
        }
        {props.cell &&
        <React.Fragment>
          <List.Item><List.Header>Cell</List.Header></List.Item>
          <List.Item>
            <span style={{float: 'left'}}>row:</span>&nbsp;
            <span style={{float: 'right'}}>{props.cell[1]}</span>
          </List.Item>
          <List.Item>
            <span style={{float: 'left'}}>col:</span>&nbsp;
            <span style={{float: 'right'}}>{props.cell[0]}</span>
          </List.Item>
        </React.Fragment>
        }
        {props.parameters &&
        <React.Fragment>
          <List.Item><List.Header>Parameters</List.Header></List.Item>
          {props.parameters.map((p, key) => (
            <List.Item key={key}>
              <span style={{float: 'left'}}>{p.name}:</span>&nbsp;
              <span style={{float: 'right'}}>
                {p.value && p.value.toString().length > 10 ? p.value.toExponential(4) : (p.value || '-')}
              </span>
            </List.Item>
          ))}
        </React.Fragment>
        }
      </List>
    );
  };

  return (
    <Popup
      open={props.open}
      onClose={props.onDismiss}
      position='right center'
      trigger={props.children}
    >
      {renderCellInfo()}
    </Popup>
  );
};

export default CellAnalyzer;
