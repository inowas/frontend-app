import {Button} from 'semantic-ui-react';
import {GridSize} from '../../../../../core/model/geometry';

interface IProps {
  gridSize: GridSize;
  onCancel: () => void;
  onChange: (g: GridSize) => void;
  selectedColumns: number[];
  selectedRows: number[];
}

const GridRefinementPopup = ({gridSize, onCancel, onChange, selectedRows, selectedColumns}: IProps) => {

  const handleCancel = () => onCancel();

  const handleConfirm = () => {
    const cGridSize = GridSize.fromObject(gridSize.toObject());
    onChange(cGridSize);
  };

  const handleMerge = () => {

    console.log({gs: gridSize.distY, selectedRows});

    selectedColumns.shift();
    selectedRows.shift();

    const cGridSize = GridSize.fromObject(gridSize.toObject());
    cGridSize.distX = gridSize.distX.filter((d) => !selectedColumns.includes(d));
    cGridSize.distY = gridSize.distY.filter((d) => !selectedRows.includes(d));

    console.log(gridSize.distX.filter((d) => !selectedColumns.includes(d)));


    onChange(cGridSize);
  };

  return (
    <Button.Group size="mini" vertical>
      <Button onClick={handleCancel}>
        Cancel
      </Button>
      <Button positive onClick={handleMerge}>
        Merge
      </Button>
      <Button positive onClick={handleConfirm}>
        Split
      </Button>
    </Button.Group>
  );
};

export default GridRefinementPopup;
