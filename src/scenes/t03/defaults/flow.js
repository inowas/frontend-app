import React from 'react';

export const documentation = {
    // BAS
    ibound: <div>The ibound array (the default is 1).</div>,
    strt: <div>An array of starting heads (the default is 1.0).</div>,
    ifrefm: <div>Indication if data should be read using free format (the default is True).</div>,
    ichflg: <div>Flag indicating that flows between constant head cells should be calculated (the default is False).</div>,
    stoper: <div>Percent discrepancy that is compared to the budget percent discrepancy continue when the solver convergence criteria are not met. Execution will unless the budget percent discrepancy is greater than stoper (default is None). MODFLOW-2005 only</div>,
    hnoflo: <div>Head value assigned to inactive cells (default is -999.99).</div>,


    // DIS
    model: <div>The model object (of type flopy.modflow.Modflow) to which this package will be added.</div>,
    nlay: <div>Number of model layers (the default is 1).</div>,
    nrow: <div>Number of model rows (the default is 2).</div>,
    ncol: <div>Number of model columns (the default is 2).</div>,
    nper: <div>Number of model stress periods (the default is 1).</div>,
    delr: <div>An array of spacings along a row (the default is 1.0).</div>,
    delc: <div>An array of spacings along a column (the default is 0.0).</div>,
    laycbd: <div>An array of flags indicating whether or not a layer has a Quasi-3D confining bed below it. 0 indicates no confining bed, and not zero indicates a confining bed. LAYCBD for the bottom layer must be 0. (the default is 0).</div>,
    top: <div>An array of the top elevation of layer 1. For the common situation in which the top layer represents a water-table aquifer, it may be reasonable to set Top equal to land-surface elevation (the default is 1.0).</div>,
    botm: <div>An array of the bottom elevation for each model cell (the default is 0.).</div>,
    perlen: <div>An array of the stress period lengths.</div>,
    nstp: <div>Number of time steps in each stress period (default is 1).</div>,
    tsmult: <div>Time step multiplier (default is 1.0).</div>,
    steady: <div>True or False indicating whether or not stress period is steady state (default is True).</div>,
    itmuni: <div>Time units, default is days (4).</div>,
    lenuni: <div>Length units, default is meters (2)</div>,
    extension: <div>Filename extension (default is ‘dis’)</div>,
    unitnumber: <div>File unit number (default is None).</div>,
    filenames: <div>Filenames to use for the package. If filenames=None the package name will be created using the model name and package extension. If a single string is passed the package will be set to the string. Default is None.</div>,
    xul: <div>x coordinate of upper left corner of the grid, default is None</div>,
    yul: <div>y coordinate of upper left corner of the grid, default is None</div>,
    rotation: <div>Clockwise rotation (in degrees) of the grid about the upper left corner. default is 0.0</div>,
    proj4_str: <div>PROJ4 string that defines the xul-yul coordinate system (.e.g. ‘+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs ‘). Can be an EPSG code (e.g. ‘EPSG:4326’). Default is ‘EPSG:4326’</div>,
    start_dateteim: <div>Starting datetime of the simulation. default is ‘1/1/1970’</div>,


    // GHB
    ipakcb: <div>A flag that is used to determine if cell-by-cell budget data should be saved. If ipakcb is non-zero cell-by-cell budget data will be saved. (default is 0).</div>,
    stress_period_data: <div>Dictionary of boundaries.<br/>
        Each ghb cell is defined through definition of layer(int), row(int), column(int), stage(float), conductance(float) The simplest form is a dictionary with a lists of boundaries for each stress period, where each list of boundaries itself is a list of boundaries. Indices of the dictionary are the numbers of the stress period.</div>,
    dtype: <div>if data type is different from default</div>,
    options: <div>Package options. (default is None).</div>,


    // BCF
    intercellt: <div>Intercell transmissivities, harmonic mean (0), arithmetic mean (1), logarithmetic mean (2), combination (3). (default is 0)</div>,
    laycon: <div>Layer type, confined (0), unconfined (1), constant T, variable S (2), variable T, variable S (default is 3)</div>,
    trpy: <div>Horizontal anisotropy ratio (default is 1.0)</div>,
    hdry: <div>Head assigned when cell is dry - used as indicator(default is -1E+30)</div>,
    iwdflg: <div>Flag to indicate if wetting is inactive (0) or not (non zero) (default is 0)</div>,
    wetfct: <div>Factor used when cell is converted from dry to wet (default is 0.1)</div>,
    iwetit: <div>iteration interval in wetting/drying algorithm (default is 1)</div>,
    ihdwet: <div>flag to indicate how initial head is computd for cells that become wet (default is 0)</div>,
    tran: <div>transmissivity (only read if laycon is 0 or 2) (default is 1.0)</div>,
    hy: <div>hydraulic conductivity (only read if laycon is 1 or 3) (default is 1.0)</div>,
    vcont: <div>vertical leakance between layers (default is 1.0)</div>,
    sf1: <div>specific storage (confined) or storage coefficient (unconfined), read when there is at least one transient stress period. (default is 1e-5)</div>,
    sf2: <div>specific yield, only read when laycon is 2 or 3 and there is at least one transient stress period (default is 0.15)</div>,
    wetdry: <div>a combination of the wetting threshold and a flag to indicate which neighboring cells can cause a cell to become wet (default is -0.01)</div>,


    // FHB
    nbdtim: <div>The number of times at which flow and head will be specified for all selected cells. (default is 1)</div>,
    nflw: <div>Number of cells at which flows will be specified. (default is 0)</div>,
    nhed: <div>Number of cells at which heads will be specified. (default is 0)</div>,
    ifhbss: <div>FHB steady-state option flag. If the simulation includes any transient-state stress periods, the flag is read but not used; in this case, specified-flow, specified-head, and auxiliary-variable values will be interpolated for steady-state stress periods in the same way that values are interpolated for transient stress periods. If the simulation includes only steady-state stress periods, the flag controls how flow, head, and auxiliary-variable values will be computed for each steady-state solution. (default is 0)</div>,
    nfhbx1: <div>Number of auxiliary variables whose values will be computed for each time step for each specified-flow cell. Auxiliary variables are currently not supported. (default is 0)</div>,
    nfhbx2: <div>Number of auxiliary variables whose values will be computed for each time step for each specified-head cell. Auxiliary variables are currently not supported. (default is 0)</div>,
    ifhbpt: <div>Flag for printing values of data list. Applies to datasets 4b, 5b, 6b, 7b, and 8b. If ifhbpt > 0, datasets read at the beginning of the simulation will be printed. Otherwise, the datasets will not be printed. (default is 0).</div>,
    bdtimecnstm: <div>A constant multiplier for data list bdtime. (default is 1.0)</div>,
    bdtime: <div>Simulation time at which values of specified flow and (or) values of specified head will be read. nbdtim values are required. (default is 0.0)</div>,
    cnstm5: <div>A constant multiplier for data list flwrat. (default is 1.0)</div>,
    ds5: <div>Each FHB flwrat cell (dataset 5) is defined through definition of layer(int), row(int), column(int), iaux(int), flwrat[nbdtime](float). There are nflw entries. (default is None) The simplest form is a list of lists with the FHB flow boundaries.<br/>
        Note there should be nflw rows in ds7.</div>,
    cnstm7: <div>A constant multiplier for data list sbhedt. (default is 1.0)</div>,
    ds7: <div>Each FHB sbhed cell (dataset 7) is defined through definition of layer(int), row(int), column(int), iaux(int), sbhed[nbdtime](float). There are nflw entries. (default is None) The simplest form is a list of lists with the FHB flow boundaries.<br/>
        Note there should be nhed rows in ds7.</div>,


    // FLWOB

    nqfb: <div>Number of cell groups for the head-dependent flow boundary observations</div>,
    nqcfb: <div>Greater than or equal to the total number of cells in all cell groups</div>,
    nqtfb: <div>Total number of head-dependent flow boundary observations for all cell groups</div>,
    iufbobsv: <div>unit number where output is saved</div>,
    tomultfb: <div>Time-offset multiplier for head-dependent flow boundary observations. The product of tomultfb and toffset must produce a time value in units consistent with other model input. tomultfb can be dimensionless or can be used to convert the units of toffset to the time unit used in the simulation.</div>,
    nqobfb: <div>The number of times at which flows are observed for the group of cells</div>,
    nqclfb: <div>Is a flag, and the absolute value of nqclfb is the number of cells in the group. If nqclfb is less than zero, factor = 1.0 for all cells in the group.</div>,
    obsnam: <div>Observation name</div>,
    irefsp: <div>Stress period to which the observation time is referenced. The reference point is the beginning of the specified stress period.</div>,
    toffset: <div>Is the time from the beginning of the stress period irefsp to the time of the observation. toffset must be in units such that the product of toffset and tomultfb are consistent with other model input. For steady state observations, specify irefsp as the steady state stress period and toffset less than or equal to perlen of the stress period. If perlen is zero, set toffset to zero. If the observation falls within a time step, linearly interpolation is used between values at the beginning and end of the time step.</div>,
    flwobs: <div>Observed flow value from the head-dependent flow boundary into the aquifer (+) or the flow from the aquifer into the boundary (-)</div>,
    layer: <div>layer index for the cell included in the cell group</div>,
    row: <div>row index for the cell included in the cell group</div>,
    column: <div>column index of the cell included in the cell group</div>,
    factor: <div>Is the portion of the simulated gain or loss in the cell that is included in the total gain or loss for this cell group (fn of eq. 5).</div>,
    flowtype: <div>String that corresponds to the head-dependent flow boundary condition type (CHD, GHB, DRN, RIV)</div>,


    // HFB

    nphfb: <div>Number of horizontal-flow barrier parameters. Note that for an HFB parameter to have an effect in the simulation, it must be defined and made active using NACTHFB to have an effect in the simulation (default is 0).</div>,
    mxfb: <div>Maximum number of horizontal-flow barrier barriers that will be defined using parameters (default is 0).</div>,
    nhfbnp: <div>Number of horizontal-flow barriers not defined by parameters. This is calculated automatically by FloPy based on the information in layer_row_column_data (default is 0).</div>,
    hfb_data: <div>In its most general form, this is a list of horizontal-flow barrier records. A barrier is conceptualized as being located on the boundary between two adjacent finite difference cells in the same layer. The innermost list is the layer, row1, column1, row2, column2, and hydrologic characteristics for a single hfb between the cells. The hydraulic characteristic is the barrier hydraulic conductivity divided by the width of the horizontal-flow barrier. (default is None).</div>,
    nacthfb: <div>The number of active horizontal-flow barrier parameters (default is 0).</div>,
    no_print: <div>When True or 1, a list of horizontal flow barriers will not be written to the Listing File (default is False)</div>
};
