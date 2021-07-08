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

  const handleMerge = () => {
    selectedColumns.shift();
    selectedRows.shift();

    const cGridSize = GridSize.fromObject(gridSize.toObject());
    cGridSize.distX = gridSize.distX.filter((d) => !selectedColumns.includes(d));
    cGridSize.distY = gridSize.distY.filter((d) => !selectedRows.includes(d));

    onChange(cGridSize);
  };

  const handleSplit = (mode?: string) => () => {
    const distX = gridSize.distX;
    if (mode === 'columns' || !mode) {
      for (let x = 0; x < gridSize.nX; x++) {
        if (selectedColumns.includes(gridSize.distX[x])) {
          distX.push(((gridSize.distX[x + 1] || 1) - gridSize.distX[x]) / 2 + gridSize.distX[x]);
        }
      }
    }

    const distY = gridSize.distY;
    if (mode === 'rows' || !mode) {
      for (let y = 0; y < gridSize.nY; y++) {
        if (selectedRows.includes(gridSize.distY[y])) {
          distY.push(((gridSize.distY[y + 1] || 1) - gridSize.distY[y]) / 2 + gridSize.distY[y]);
        }
      }
    }

    const cGridSize = GridSize.fromObject(gridSize.toObject());
    cGridSize.distX = distX.sort((a, b) => a - b);
    cGridSize.distY = distY.sort((a, b) => a - b);

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
      <Button positive onClick={handleSplit('rows')}>
        Split Rows
      </Button>
      <Button positive onClick={handleSplit('columns')}>
        Split Columns
      </Button>
      <Button positive onClick={handleSplit()}>
        Split All
      </Button>
    </Button.Group>
  );
};

export default GridRefinementPopup;
