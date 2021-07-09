import {Button, Input, InputOnChangeData, Segment} from 'semantic-ui-react';
import {ChangeEvent, useState} from 'react';
import {GridSize} from '../../../../../core/model/geometry';

interface IProps {
  gridSize: GridSize;
  onCancel: () => void;
  onChange: (g: GridSize) => void;
  selectedColumns: number[];
  selectedRows: number[];
}

const GridRefinementPopup = ({gridSize, onCancel, onChange, selectedRows, selectedColumns}: IProps) => {
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [activeValue, setActiveValue] = useState<string>('');
  const [columns, setColumns] = useState<number>(selectedColumns.length);
  const [rows, setRows] = useState<number>(selectedRows.length);

  const handleBlur = () => {
    const value = parseInt(activeValue, 10);
    if (activeInput === 'rows') {
      setRows(value < 1 ? 1 : value);
    }
    if (activeInput === 'columns') {
      setColumns(value < 1 ? 1 : value);
    }
    setActiveInput(null);
  }

  const handleCancel = () => onCancel();

  const handleChange = (e: ChangeEvent<HTMLInputElement>, {name, value}: InputOnChangeData) => {
    setActiveInput(name);
    setActiveValue(value);
  };

  const handleMerge = () => {
    selectedColumns.shift();
    selectedRows.shift();

    const cGridSize = GridSize.fromObject(gridSize.toObject());
    cGridSize.distX = gridSize.distX.filter((d) => !selectedColumns.includes(d));
    cGridSize.distY = gridSize.distY.filter((d) => !selectedRows.includes(d));

    onChange(cGridSize);
  };

  const handleSplit = () => {
    const xMin = Math.min(...selectedColumns);
    const xMax = gridSize.getDistanceXEnd(Math.max(...selectedColumns));
    const distX = gridSize.distX.filter((d) => d <= xMin || d >= xMax);
    for (let x = 1; x < columns; x++) {
      distX.push(xMin + x * ((xMax - xMin) / columns));
    }

    const yMin = Math.min(...selectedRows);
    const yMax = gridSize.getDistanceYEnd(Math.max(...selectedRows));
    const distY = gridSize.distY.filter((d) => d <= yMin || d >= yMax);
    for (let y = 1; y < rows; y++) {
      distY.push(yMin + y * ((yMax - yMin) / rows));
    }

    const cGridSize = GridSize.fromObject(gridSize.toObject());
    cGridSize.distX = distX.sort((a, b) => a - b);
    cGridSize.distY = distY.sort((a, b) => a - b);

    onChange(cGridSize);
  };

  return (
    <Segment style={{
      backgroundClip: 'padding-box',
      border: '1px solid rgba(0,0,0,0.1)',
      borderRadius: '2px',
      display: 'flex',
      flexDirection: 'column',
      padding: '7px'
    }}>
      <Button.Group size="mini" vertical>
        <Button onClick={handleCancel}>
          Cancel
        </Button>
        <Button positive onClick={handleMerge}>
          Merge
        </Button>
      </Button.Group>
      <br/>
      <Input
        attached="bottom"
        fluid
        icon="long arrow alternate right"
        iconPosition="left"
        name="rows"
        onBlur={handleBlur}
        onChange={handleChange}
        size="mini"
        type="number"
        value={activeInput === 'rows' ? activeValue : rows}
      />
      <Input
        fluid
        icon="long arrow alternate down"
        iconPosition="left"
        name="columns"
        onBlur={handleBlur}
        onChange={handleChange}
        size="mini"
        type="number"
        value={activeInput === 'columns' ? activeValue : columns}
      />
      <Button fluid onClick={handleSplit} size="mini" primary>Split</Button>
    </Segment>
  );
};

export default GridRefinementPopup;
