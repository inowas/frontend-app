export const colormaps = [
  'Accent', 'Accent_r', 'Blues', 'Blues_r', 'BrBG', 'BrBG_r', 'BuGn', 'BuGn_r', 'BuPu', 'BuPu_r', 'CMRmap',
  'CMRmap_r', 'Dark2', 'Dark2_r', 'GnBu', 'GnBu_r', 'Greens', 'Greens_r', 'Greys', 'Greys_r', 'OrRd', 'OrRd_r',
  'Oranges', 'Oranges_r', 'PRGn', 'PRGn_r', 'Paired', 'Paired_r', 'Pastel1', 'Pastel1_r', 'Pastel2', 'Pastel2_r',
  'PiYG', 'PiYG_r', 'PuBu', 'PuBuGn', 'PuBuGn_r', 'PuBu_r', 'PuOr', 'PuOr_r', 'PuRd', 'PuRd_r', 'Purples',
  'Purples_r', 'RdBu', 'RdBu_r', 'RdGy', 'RdGy_r', 'RdPu', 'RdPu_r', 'RdYlBu', 'RdYlBu_r', 'RdYlGn', 'RdYlGn_r',
  'Reds', 'Reds_r', 'Set1', 'Set1_r', 'Set2', 'Set2_r', 'Set3', 'Set3_r', 'Spectral', 'Spectral_r', 'Wistia',
  'Wistia_r', 'YlGn', 'YlGnBu', 'YlGnBu_r', 'YlGn_r', 'YlOrBr', 'YlOrBr_r', 'YlOrRd', 'YlOrRd_r', 'afmhot',
  'afmhot_r', 'autumn', 'autumn_r', 'binary', 'binary_r', 'bone', 'bone_r', 'brg', 'brg_r', 'bwr', 'bwr_r',
  'cividis', 'cividis_r', 'cool', 'cool_r', 'coolwarm', 'coolwarm_r', 'copper', 'copper_r', 'cubehelix',
  'cubehelix_r', 'flag', 'flag_r', 'gist_earth', 'gist_earth_r', 'gist_gray', 'gist_gray_r', 'gist_heat',
  'gist_heat_r', 'gist_ncar', 'gist_ncar_r', 'gist_rainbow', 'gist_rainbow_r', 'gist_stern', 'gist_stern_r',
  'gist_yarg', 'gist_yarg_r', 'gnuplot', 'gnuplot2', 'gnuplot2_r', 'gnuplot_r', 'gray', 'gray_r', 'hot', 'hot_r',
  'hsv', 'hsv_r', 'inferno', 'inferno_r', 'jet', 'jet_r', 'magma', 'magma_r', 'nipy_spectral', 'nipy_spectral_r',
  'ocean', 'ocean_r', 'pink', 'pink_r', 'plasma', 'plasma_r', 'prism', 'prism_r', 'rainbow', 'rainbow_r', 'seismic',
  'seismic_r', 'spring', 'spring_r', 'summer', 'summer_r', 'tab10', 'tab10_r', 'tab20', 'tab20_r', 'tab20b',
  'tab20b_r', 'tab20c', 'tab20c_r', 'terrain', 'terrain_r', 'turbo', 'turbo_r', 'twilight', 'twilight_r',
  'twilight_shifted', 'twilight_shifted_r', 'viridis', 'viridis_r', 'winter', 'winter_r'
];

export enum EFileType {
  JPG = 'jpg',
  PNG = 'png',
  SVG = 'svg'
}

export enum ELegendLocation {
  BEST = 'best',
  CENTER = 'center',
  CENTER_LEFT = 'center left',
  CENTER_RIGHT = 'center right',
  UPPER_CENTER = 'upper center',
  UPPER_LEFT = 'upper left',
  UPPER_RIGHT = 'upper right',
  LEFT = 'left',
  LOWER_CENTER = 'lower center',
  LOWER_LEFT = 'lower left',
  LOWER_RIGHT = 'lower right',
  RIGHT = 'right'
}

export interface IScatterPlot {
  dpi: number;
  filetype: EFileType;
  name: string;
  rotation?: number; // trendline == true
  trendline: boolean;
  x?: number; // trendline == true
  xaxis: string;
  xlabel: string;
  y?: number; // trendline == true
  yaxis: string;
  ylabel: string;
  title: string;
}

export interface ITimeSeries {
  asksti: boolean;
  dpi: number;
  filetype: EFileType;
  grid: boolean;
  leglocation: ELegendLocation;
  name: string;
  obdata: string;
  stidata: string;
  time: string;
  title: string;
  Xaxisformat?: string; // if time == 'Datetime':
  xlabel: string;
  ylabel: string;
}

export interface I3DVisualization {
  aspect: number;
  axislabelsize: number;
  c: number;
  cbarlabel: string;
  clblabel: string;
  cmap: string; // must match on of colormaps
  dpi: number;
  filetype: EFileType;
  name: string;
  scalebarsize: number;
  ticklabelsize: number;
  xmax: number;
  xmin: number;
  ymax: number;
  ymin: number;
}

export interface IContourExport {
  ask: boolean;
  c: number;
  clblabel: string;
  cmap: string; // must match on of colormaps
  distance: number;
  dpi: number;
  filetype: EFileType;
  name: string;
  rotation: number;
  tifname?: string; // If ask == true
  xmax: number;
  xmin: number;
  ymax: number;
  ymin: number;
}