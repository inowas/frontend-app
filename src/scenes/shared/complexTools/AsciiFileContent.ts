interface IBoundingBox {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

class AsciiFileContent {
  nCols: number;
  nRows: number;
  xllCorner: number;
  yllCorner: number;
  cellSize: number;
  noDataValue: number;
  data: number[][];

  constructor() {
    this.nCols = 0;
    this.nRows = 0;
    this.xllCorner = 0;
    this.yllCorner = 0;
    this.cellSize = 0;
    this.noDataValue = -9999;
    this.data = [];
  }

  public static fromBoundingBoxAndData(boundingBox: IBoundingBox, data: number[][]): AsciiFileContent {
    const nCols = data[0].length;
    const nRows = data.length;
    const xllCorner = boundingBox.xMin;
    const yllCorner = boundingBox.yMin;
    const cellSize = (boundingBox.xMax - boundingBox.xMin) / nCols;
    const noDataValue = -9999;

    const c = new AsciiFileContent();
    c.nCols = nCols;
    c.nRows = nRows;
    c.xllCorner = xllCorner;
    c.yllCorner = yllCorner;
    c.cellSize = cellSize;
    c.noDataValue = noDataValue;
    c.data = data;
    return c;
  }

  public toBlob(): Blob {
    let content = '';
    content += `NCOLS ${this.nCols}\n`;
    content += `NROWS ${this.nRows}\n`;
    content += `XLLCORNER ${this.xllCorner}\n`;
    content += `YLLCORNER ${this.yllCorner}\n`;
    content += `CELLSIZE ${this.cellSize}\n`;
    content += `NODATA_VALUE ${this.noDataValue}\n`;
    content += '\n';

    this.data.forEach((row) => {
      content += row.map((v) => {
        if (!isFinite(v)) {
          return this.noDataValue;
        }

        return v;
      }).join(' ');
      content += '\n';
    });


    return new Blob([content], { type: 'text/plain' });
  }
}

export default AsciiFileContent;
