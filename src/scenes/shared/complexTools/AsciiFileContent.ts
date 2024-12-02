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

    // Calculate spacings
    const latSpacing = (boundingBox.yMax - boundingBox.yMin) / (nRows - 1);
    const lonSpacing = (boundingBox.xMax - boundingBox.xMin) / (nCols - 1);

    if (latSpacing === 0 || lonSpacing === 0) {
      throw new Error('Invalid bounding box');
    }

    // Set cellSize as the minimum spacing (or finer if desired)
    const cellSize = Math.min(latSpacing, lonSpacing);
    const noDataValue = -9999;

    const c = new AsciiFileContent();
    c.nCols = Math.ceil((boundingBox.xMax - boundingBox.xMin) / cellSize) + 1;
    c.nRows = Math.ceil((boundingBox.yMax - boundingBox.yMin) / cellSize) + 1;
    c.xllCorner = boundingBox.xMin;
    c.yllCorner = boundingBox.yMin;
    c.cellSize = cellSize;
    c.noDataValue = noDataValue;
    c.data = [];

    // Populate the grid with interpolated values
    for (let i = 0; i < c.nRows; i++) {
      c.data[i] = [];
      for (let j = 0; j < c.nCols; j++) {
        const lat = c.yllCorner + i * c.cellSize;
        const lon = c.xllCorner + j * c.cellSize;
        c.data[i][j] = AsciiFileContent.bilinearInterpolation(
          lat,
          lon,
          data,
          boundingBox,
          nRows,
          nCols,
        );
      }
    }

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

  public static bilinearInterpolation(
    lat: number,
    lon: number,
    data: number[][],
    boundingBox: IBoundingBox,
    nRows: number,
    nCols: number,
  ): number {
    const latSpacing = (boundingBox.yMax - boundingBox.yMin) / (nRows - 1);
    const lonSpacing = (boundingBox.xMax - boundingBox.xMin) / (nCols - 1);

    // Calculate fractional indices
    const i = (lat - boundingBox.yMin) / latSpacing;
    const j = (lon - boundingBox.xMin) / lonSpacing;

    // Get bounding indices
    const i0 = Math.floor(i);
    const i1 = Math.min(i0 + 1, nRows - 1);
    const j0 = Math.floor(j);
    const j1 = Math.min(j0 + 1, nCols - 1);

    // Interpolation weights
    const di = i - i0;
    const dj = j - j0;

    // Safeguard against out-of-bounds access
    const q00 = data[i0]?.[j0] ?? 0;
    const q01 = data[i0]?.[j1] ?? 0;
    const q10 = data[i1]?.[j0] ?? 0;
    const q11 = data[i1]?.[j1] ?? 0;

    // Bilinear interpolation formula
    return (1 - di) * (1 - dj) * q00 +
      (1 - di) * dj * q01 +
      di * (1 - dj) * q10 +
      di * dj * q11;
  }
}

export default AsciiFileContent;
