import {Button, DropdownProps, Form, InputProps, Label, Modal, Segment} from 'semantic-ui-react';
import {GridSize} from '../../../../../core/model/geometry';
import React, {ChangeEvent, SyntheticEvent, useState} from 'react';

interface IProps {
  gridSize: GridSize;
  onCancel: () => void;
  onChange: (g: GridSize) => void;
  selectedColumns: number[];
  selectedRows: number[];
}

const GridRefinementModal = ({gridSize, onCancel, onChange, selectedRows, selectedColumns}: IProps) => {
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [activeValue, setActiveValue] = useState<string>('');
  const [action, setAction] = useState<string>('split');
  const [mode, setMode] = useState<string>('rows');
  const [number, setNumber] = useState<number>(2);

  const handleCancel = () => onCancel();
  
  const handleConfirm = () => {
    const cGridSize = GridSize.fromObject(gridSize.toObject());
    if (action === 'merge' && mode === 'columns') {
      cGridSize.distX = gridSize.distX.filter(
        (d, i) => selectedColumns.filter((c) => c === i).length === 0
      );
    }
    if (action === 'merge' && mode === 'rows') {
      cGridSize.distY = gridSize.distY.filter(
        (d, i) => selectedRows.filter((c) => c === i).length === 0
      );
    }
    onChange(cGridSize);
  };

  const handleBlur = () => {
    setActiveInput(null);
    if (activeInput === 'number') {
      setNumber(parseInt(activeValue, 10));
    }
  };

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>, {name, value}: InputProps) => {
    setActiveInput(name);
    setActiveValue(value);
  };

  const handleChangeSelect = (e: SyntheticEvent, {name, value}: DropdownProps) => {
    if (name === 'mode' && typeof value === 'string') {
      setMode(value);
    }
    if (name === 'action' && typeof value === 'string') {
      setAction(value);
    }
  };

  return (
    <Modal
      open={true}
      size='small'
    >
      <Modal.Header>Grid Refinement</Modal.Header>
      <Modal.Content>
        <Segment>
          <h3>Selection</h3>
          {selectedRows.length > 0 && <Label.Group>
            {selectedRows.map((r, k) => <Label color="green" key={`label_row_${k}`}>Row {r}</Label>)}
          </Label.Group>}
          {selectedColumns.length > 0 && <Label.Group>
            {selectedColumns.map((c, k) => <Label color="yellow" key={`label_col_${k}`}>Column {c}</Label>)}
          </Label.Group>}
        </Segment>
        <Form>
          <Form.Group>
            <Form.Select
              name="action"
              onChange={handleChangeSelect}
              options={[
                {key: 'merge', value: 'merge', text: 'Merge'},
                {key: 'split', value: 'split', text: 'Split'}
              ]}
              value={action}
            />
            <Form.Select
              name="mode"
              onChange={handleChangeSelect}
              options={[
                {key: 'rows', value: 'rows', text: 'selected rows'},
                {key: 'columns', value: 'columns', text: 'selected columns'}
              ]}
              value={mode}
            />
            {action === 'split' &&
            <React.Fragment>
              <p style={{marginTop: '10px'}}>
                into
              </p>
              <Form.Input
                name="number"
                onBlur={handleBlur}
                onChange={handleChangeInput}
                type="number"
                value={activeInput === 'number' ? activeValue : number}
                width={2}
              />
              <p style={{marginTop: '10px'}}>
                {mode}
              </p>
            </React.Fragment>
            }
          </Form.Group>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={handleCancel}>
          Cancel
        </Button>
        <Button positive onClick={handleConfirm}>
          Confirm
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default GridRefinementModal;
