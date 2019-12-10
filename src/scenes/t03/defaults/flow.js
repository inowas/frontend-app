import React from 'react';

export const documentation = {
    model: <div>The model object (of type flopy.modflow.Modflow) to which this package will be added.</div>,
    extension: <div>Filename extension</div>,
    unitnumber: <div>File unit number (default is None).</div>,
    filenames: <div>Filenames to use for the package. If filenames=None the package name will be created using the model
        name and package extension. If a single string is passed the package will be set to the string. Default is
        None.</div>,
    options: <div>Package options. (default is None).</div>,

    // MF
    exe_name: <div>The name of the executable to use (the default is ‘mf2005’).</div>,
    version: <div>Version of MODFLOW to use (the default is ‘mf2005’).</div>,
    verbose: <div>Print additional information to the screen (default is False).</div>,

    // BAS
    ibound: <div>The ibound array (the default is 1).</div>,
    strt: <div>An array of starting heads (the default is 1.0).</div>,
    ifrefm: <div>Indication if data should be read using free format (the default is True).</div>,
    ichflg: <div>Flag indicating that flows between constant head cells should be calculated (the default is
        False).</div>,
    stoper: <div>Percent discrepancy that is compared to the budget percent discrepancy continue when the solver
        convergence criteria are not met. Execution will unless the budget percent discrepancy is greater than stoper
        (default is None). MODFLOW-2005 only</div>,
    hnoflo: <div>Head value assigned to inactive cells (default is -999.99).</div>,

    // BCF
    intercellt: <div>Intercell transmissivities, harmonic mean (0), arithmetic mean (1), logarithmetic mean (2),
        combination (3). (default is 0)</div>,
    laycon: <div>Layer type, confined (0), unconfined (1), constant T, variable S (2), variable T, variable S (default
        is 3)</div>,
    trpy: <div>Horizontal anisotropy ratio (default is 1.0)</div>,
    hdry: <div>Head assigned when cell is dry - used as indicator(default is -1E+30)</div>,
    iwdflg: <div>Flag to indicate if wetting is inactive (0) or not (non zero) (default is 0)</div>,
    wetfct: <div>Factor used when cell is converted from dry to wet (default is 0.1)</div>,
    iwetit: <div>iteration interval in wetting/drying algorithm (default is 1)</div>,
    ihdwet: <div>flag to indicate how initial head is computd for cells that become wet (default is 0)</div>,
    tran: <div>transmissivity (only read if laycon is 0 or 2) (default is 1.0)</div>,
    hy: <div>hydraulic conductivity (only read if laycon is 1 or 3) (default is 1.0)</div>,
    vcont: <div>vertical leakance between layers (default is 1.0)</div>,
    sf1: <div>specific storage (confined) or storage coefficient (unconfined), read when there is at least one transient
        stress period. (default is 1e-5)</div>,
    sf2: <div>specific yield, only read when laycon is 2 or 3 and there is at least one transient stress period (default
        is 0.15)</div>,
    vkcb: <div>TODO!!</div>,
    wetdry: <div>a combination of the wetting threshold and a flag to indicate which neighboring cells can cause a cell
        to become wet (default is -0.01)</div>,

    // DIS
    nlay: <div>Number of model layers (the default is 1).</div>,
    nrow: <div>Number of model rows (the default is 2).</div>,
    ncol: <div>Number of model columns (the default is 2).</div>,
    nper: <div>Number of model stress periods (the default is 1).</div>,
    delr: <div>An array of spacings along a row (the default is 1.0).</div>,
    delc: <div>An array of spacings along a column (the default is 0.0).</div>,
    laycbd: <div>An array of flags indicating whether or not a layer has a Quasi-3D confining bed below it. 0 indicates
        no confining bed, and not zero indicates a confining bed. LAYCBD for the bottom layer must be 0. (the default is
        0).</div>,
    top: <div>An array of the top elevation of layer 1. For the common situation in which the top layer represents a
        water-table aquifer, it may be reasonable to set Top equal to land-surface elevation (the default is
        1.0).</div>,
    botm: <div>An array of the bottom elevation for each model cell (the default is 0.).</div>,
    perlen: <div>An array of the stress period lengths.</div>,
    nstp: <div>Number of time steps in each stress period (default is 1).</div>,
    tsmult: <div>Time step multiplier (default is 1.0).</div>,
    steady: <div>True or False indicating whether or not stress period is steady state (default is True).</div>,
    itmuni: <div>Time units, default is days (4).</div>,
    lenuni: <div>Length units, default is meters (2)</div>,
    xul: <div>x coordinate of upper left corner of the grid, default is None</div>,
    yul: <div>y coordinate of upper left corner of the grid, default is None</div>,
    rotation: <div>Clockwise rotation (in degrees) of the grid about the upper left corner. default is 0.0</div>,
    proj4_str: <div>PROJ4 string that defines the xul-yul coordinate system (.e.g. ‘+proj=longlat +ellps=WGS84
        +datum=WGS84 +no_defs ‘). Can be an EPSG code (e.g. ‘EPSG:4326’). Default is ‘EPSG:4326’</div>,
    start_datetime: <div>Starting datetime of the simulation. default is ‘1/1/1970’</div>,

    // FHB
    nbdtim: <div>The number of times at which flow and head will be specified for all selected cells. (default is
        1)</div>,
    nflw: <div>Number of cells at which flows will be specified. (default is 0)</div>,
    nhed: <div>Number of cells at which heads will be specified. (default is 0)</div>,
    ifhbss: <div>FHB steady-state option flag. If the simulation includes any transient-state stress periods, the flag
        is read but not used; in this case, specified-flow, specified-head, and auxiliary-variable values will be
        interpolated for steady-state stress periods in the same way that values are interpolated for transient stress
        periods. If the simulation includes only steady-state stress periods, the flag controls how flow, head, and
        auxiliary-variable values will be computed for each steady-state solution. (default is 0)</div>,
    nfhbx1: <div>Number of auxiliary variables whose values will be computed for each time step for each specified-flow
        cell. Auxiliary variables are currently not supported. (default is 0)</div>,
    nfhbx2: <div>Number of auxiliary variables whose values will be computed for each time step for each specified-head
        cell. Auxiliary variables are currently not supported. (default is 0)</div>,
    ifhbpt: <div>Flag for printing values of data list. Applies to datasets 4b, 5b, 6b, 7b, and 8b. If ifhbpt > 0,
        datasets read at the beginning of the simulation will be printed. Otherwise, the datasets will not be printed.
        (default is 0).</div>,
    bdtimecnstm: <div>A constant multiplier for data list bdtime. (default is 1.0)</div>,
    bdtime: <div>Simulation time at which values of specified flow and (or) values of specified head will be read.
        nbdtim values are required. (default is 0.0)</div>,
    cnstm5: <div>A constant multiplier for data list flwrat. (default is 1.0)</div>,
    ds5: <div>Each FHB flwrat cell (dataset 5) is defined through definition of layer(int), row(int), column(int),
        iaux(int), flwrat[nbdtime](float). There are nflw entries. (default is None) The simplest form is a list of
        lists with the FHB flow boundaries.<br/>
        Note there should be nflw rows in ds7.</div>,
    cnstm7: <div>A constant multiplier for data list sbhedt. (default is 1.0)</div>,
    ds7: <div>Each FHB sbhed cell (dataset 7) is defined through definition of layer(int), row(int), column(int),
        iaux(int), sbhed[nbdtime](float). There are nflw entries. (default is None) The simplest form is a list of lists
        with the FHB flow boundaries.<br/>
        Note there should be nhed rows in ds7.</div>,

    // FLWOB

    nqfb: <div>Number of cell groups for the head-dependent flow boundary observations</div>,
    nqcfb: <div>Greater than or equal to the total number of cells in all cell groups</div>,
    nqtfb: <div>Total number of head-dependent flow boundary observations for all cell groups</div>,
    iufbobsv: <div>unit number where output is saved</div>,
    tomultfb: <div>Time-offset multiplier for head-dependent flow boundary observations. The product of tomultfb and
        toffset must produce a time value in units consistent with other model input. tomultfb can be dimensionless or
        can be used to convert the units of toffset to the time unit used in the simulation.</div>,
    nqobfb: <div>The number of times at which flows are observed for the group of cells</div>,
    nqclfb: <div>Is a flag, and the absolute value of nqclfb is the number of cells in the group. If nqclfb is less than
        zero, factor = 1.0 for all cells in the group.</div>,
    obsnam: <div>Observation name</div>,
    irefsp: <div>Stress period to which the observation time is referenced. The reference point is the beginning of the
        specified stress period.</div>,
    toffset: <div>Is the time from the beginning of the stress period irefsp to the time of the observation. toffset
        must be in units such that the product of toffset and tomultfb are consistent with other model input. For steady
        state observations, specify irefsp as the steady state stress period and toffset less than or equal to perlen of
        the stress period. If perlen is zero, set toffset to zero. If the observation falls within a time step, linearly
        interpolation is used between values at the beginning and end of the time step.</div>,
    flwobs: <div>Observed flow value from the head-dependent flow boundary into the aquifer (+) or the flow from the
        aquifer into the boundary (-)</div>,
    layer: <div>layer index for the cell included in the cell group</div>,
    row: <div>row index for the cell included in the cell group</div>,
    column: <div>column index of the cell included in the cell group</div>,
    factor: <div>Is the portion of the simulated gain or loss in the cell that is included in the total gain or loss for
        this cell group (fn of eq. 5).</div>,
    flowtype: <div>String that corresponds to the head-dependent flow boundary condition type (CHD, GHB, DRN,
        RIV)</div>,

    // GHB
    ipakcb: <div>A flag that is used to determine if cell-by-cell budget data should be saved. If ipakcb is non-zero
        cell-by-cell budget data will be saved. (default is 0).</div>,
    stress_period_data: <div>Dictionary of boundaries.<br/>
        Each ghb cell is defined through definition of layer(int), row(int), column(int), stage(float),
        conductance(float) The simplest form is a dictionary with a lists of boundaries for each stress period, where
        each list of boundaries itself is a list of boundaries. Indices of the dictionary are the numbers of the stress
        period.</div>,
    dtype: <div>if data type is different from default</div>,

    // HFB

    nphfb: <div>Number of horizontal-flow barrier parameters. Note that for an HFB parameter to have an effect in the
        simulation, it must be defined and made active using NACTHFB to have an effect in the simulation (default is
        0).</div>,
    mxfb: <div>Maximum number of horizontal-flow barrier barriers that will be defined using parameters (default is
        0).</div>,
    nhfbnp: <div>Number of horizontal-flow barriers not defined by parameters. This is calculated automatically by FloPy
        based on the information in layer_row_column_data (default is 0).</div>,
    hfb_data: <div>In its most general form, this is a list of horizontal-flow barrier records. A barrier is
        conceptualized as being located on the boundary between two adjacent finite difference cells in the same layer.
        The innermost list is the layer, row1, column1, row2, column2, and hydrologic characteristics for a single hfb
        between the cells. The hydraulic characteristic is the barrier hydraulic conductivity divided by the width of
        the horizontal-flow barrier. (default is None).</div>,
    nacthfb: <div>The number of active horizontal-flow barrier parameters (default is 0).</div>,
    no_print: <div>When True or 1, a list of horizontal flow barriers will not be written to the Listing File (default
        is False)</div>,

    // HOB

    iuhobsv: <div>Unit number where output is saved. If iuhobsv is None, a unit number will be assigned (default is
        None).</div>,
    hobdry: <div>Value of the simulated equivalent written to the observation output file when the observation is
        omitted because a cell is dry (default is 0).</div>,
    tomulth: <div>Time step multiplier for head observations. The product of tomulth and toffset must produce a time
        value in units consistent with other model input. tomulth can be dimensionless or can be used to convert the
        units of toffset to the time unit used in the simulation (default is 1).</div>,
    obs_data: <div>A single HeadObservation instance or a list of HeadObservation instances containing all of the data
        for each observation. If obs_data is None a default HeadObservation with an observation in layer, row, column
        (0, 0, 0) and a head value of 0 at totim 0 will be created (default is None).</div>,

    // OC

    ihedfm: <div>is a code for the format in which heads will be printed. (default is 0).</div>,
    iddnfm: <div>is a code for the format in which drawdown will be printed. (default is 0).</div>,
    chedfm: <div>is a character value that specifies the format for saving heads. The format must contain 20 characters
        or less and must be a valid Fortran format that is enclosed in parentheses. The format must be enclosed in
        apostrophes if it contains one or more blanks or commas. The optional word LABEL after the format is used to
        indicate that each layer of output should be preceded with a line that defines the output (simulation time, the
        layer being output, and so forth). If there is no record specifying CHEDFM, then heads are written to a binary
        (unformatted) file. Binary files are usually more compact than text files, but they are not generally
        transportable among different computer operating systems or different Fortran compilers. (default is
        None)</div>,
    cddnfm: <div>is a character value that specifies the format for saving drawdown. The format must contain 20
        characters or less and must be a valid Fortran format that is enclosed in parentheses. The format must be
        enclosed in apostrophes if it contains one or more blanks or commas. The optional word LABEL after the format is
        used to indicate that each layer of output should be preceded with a line that defines the output (simulation
        time, the layer being output, and so forth). If there is no record specifying CDDNFM, then drawdowns are written
        to a binary (unformatted) file. Binary files are usually more compact than text files, but they are not
        generally transportable among different computer operating systems or different Fortran compilers. (default is
        None)</div>,
    cboufm: <div>is a character value that specifies the format for saving ibound. The format must contain 20 characters
        or less and must be a valid Fortran format that is enclosed in parentheses. The format must be enclosed in
        apostrophes if it contains one or more blanks or commas. The optional word LABEL after the format is used to
        indicate that each layer of output should be preceded with a line that defines the output (simulation time, the
        layer being output, and so forth). If there is no record specifying CBOUFM, then ibounds are written to a binary
        (unformatted) file. Binary files are usually more compact than text files, but they are not generally
        transportable among different computer operating systems or different Fortran compilers. (default is
        None)</div>,
    compact: <div>Save results in compact budget form.</div>,

    // RCH

    nrchop: <div>Is the recharge option code. 1: Recharge to top grid layer only 2: Recharge to layer defined in irch 3:
        Recharge to highest active cell (default is 3).</div>,
    rech: <div>Is the recharge flux. (default is 1.e-3)</div>,
    irch: <div>Is the layer to which recharge is applied in each vertical column (only used when nrchop=2). (default is
        0).</div>,

    // SOL

    itmx: <div>Maximum number of iterations for each time step. Specify ITMAX = 1 if iteration is not desired. Ideally
        iteration would not be required for direct solution. However, it is necessary to iterate if the flow equation is
        nonlinear or if computer precision limitations result in inaccurate calculations as indicated by a large water
        budget error (default is 50).</div>,
    mxup: <div>Maximum number of equations in the upper part of the equations to be solved. This value impacts the
        amount of memory used by the DE4 Package. If specified as 0, the program will calculate MXUP as half the number
        of cells in the model, which is an upper limit (default is 0).</div>,
    mxlow: <div>Maximum number of equations in the lower part of equations to be solved. This value impacts the amount
        of memory used by the DE4 Package. If specified as 0, the program will calculate MXLOW as half the number of
        cells in the model, which is an upper limit (default is 0).</div>,
    mxbw: <div>Maximum band width plus 1 of the lower part of the head coefficients matrix. This value impacts the
        amount of memory used by the DE4 Package. If specified as 0, the program will calculate MXBW as the product of
        the two smallest grid dimensions plus 1, which is an upper limit (default is 0).</div>,
    ifreq: <div>Flag indicating the frequency at which coefficients in head matrix change. IFREQ = 1 indicates that the
        flow equations are linear and that coefficients of simulated head for all stress terms are constant for all
        stress periods. IFREQ = 2 indicates that the flow equations are linear, but coefficients of simulated head for
        some stress terms may change at the start of each stress period. IFREQ = 3 indicates that a nonlinear flow
        equation is being solved, which means that some terms in the head coefficients matrix depend on simulated head
        (default is 3).</div>,
    mutd4: <div>Flag that indicates the quantity of information that is printed when convergence information is printed
        for a time step. MUTD4 = 0 indicates that the number of iterations in the time step and the maximum head change
        each iteration are printed. MUTD4 = 1 indicates that only the number of iterations in the time step is printed.
        MUTD4 = 2 indicates no information is printed (default is 0).</div>,
    accl: <div>Multiplier for the computed head change for each iteration. Normally this value is 1. A value greater
        than 1 may be useful for improving the rate of convergence when using external iteration to solve nonlinear
        problems (default is 1).</div>,
    hclose: <div>Head change closure criterion. If iterating (ITMX > 1), iteration stops when the absolute value of head
        change at every node is less than or equal to HCLOSE. HCLOSE is not used if not iterating, but a value must
        always be specified (default is 1e-5).</div>,
    iprd4: <div>Time step interval for printing out convergence information when iterating (ITMX > 1). If IPRD4 is 2,
        convergence information is printed every other time step. A value must always be specified even if not iterating
        (default is 1).</div>,

    // VDF

    mt3drhoflg: <div>The MT3DMS species number that will be used in the equation of state to compute fluid density. When
        equal to zero, the fluid density for each grid cell can be entered in the table at the bottom of the dialog. For
        INDENSE enter -1 to use values from previous stress period, 0 to use DENSREF, and 1 to enter values for DENSE
        column. When equal to -1, the fluid density will be calculated using one or more species entered in the table at
        the bottom of the dialog using species ID, DRHODC, and CRHOREF. Rows can be entered into the table with the tool
        bar below the table. When greater than or equal to 1 density is calculated using the corresponding species
        number.</div>,
    denseref: <div>The fluid density at the reference concentration, temperature, and pressure.</div>,
    drhodc: <div>The slope of the linear equation of state that relates fluid density to solute concentration.</div>,
    mfnadvfd: <div>Flag that determines the method for calculating the internodal density values used to conserve fluid
        mass. If MFNADVFD = 2, internodal conductance values used to conserve fluid mass are calculated using a
        central-in-space algorithm. If MFNADVFD = 2, internodal conductance values used to conserve fluid mass are
        calculated using an upstream-weighted algorithm.</div>,
    nswtcpl: <div>Flag used to determine the flow and transport coupling procedure. If NSWTCPL = 0 or 1, flow and
        transport will be explicitly coupled using a one-timestep lag. The explicit coupling option is normally much
        faster than the iterative option and is recommended for most applications. If NSWTCPL > 1, NSWTCPL is the
        maximum number of non-linear coupling iterations for the flow and transport solutions. SEAWAT-2000 will stop
        execution after NSWTCPL iterations if convergence between flow and transport has not occurred. If NSWTCPL = -1,
        the flow solution will be recalculated only for: The first transport step of the simulation, or The last
        transport step of the MODFLOW timestep, or The maximum density change at a cell is greater than DNSCRIT.</div>,
    dnscrit: <div>User-specified density value. If NSWTCPL is greater than 1, DNSCRIT is the convergence criterion, in
        units of fluid density, for convergence between flow and transport. If the maximum fluid density difference
        between two consecutive implicit coupling iterations is not less than DNSCRIT, the program will continue to
        iterate on the flow and transport equations, or will terminate if NSWTCPL is reached. If NSWTCPL is -1, DNSCRIT
        is the maximum density threshold, in units of fluid density. If the fluid density change (between the present
        transport timestep and the last flow solution) at one or more cells is greater than DNSCRIT, then SEAWAT_V4 will
        update the flow field (by solving the flow equation with the updated density field).</div>,
    densemin: <div>Minimum fluid density. If the resulting density value calculated with the equation of state is less
        than DENSEMIN, the density value is set to DENSEMIN. If DENSEMIN = 0, the computed fluid density is not limited
        by DENSEMIN (this is the option to use for most simulations). If DENSEMIN > 0, a computed fluid density less
        than DENSEMIN is automatically reset to DENSEMIN.</div>,
    densemax: <div>Maximum fluid density. If the resulting density value calculated with the equation of state is
        greater than DENSEMAX, the density value is set to DENSEMAX. If DENSEMAX = 0, the computed fluid density is not
        limited by DENSEMAX (this is the option to use for most simulations). If DENSEMAX > 0, a computed fluid density
        larger than DENSEMAX is automatically reset to DENSEMAX.</div>,
    iwtable: <div>Flag used to activate the variable-density water-table corrections (Guo and Langevin, 2002, eq. 82).
        If IWTABLE = 0, the water-table correction will not be applied. If IWTABLE > 0, the water-table correction will
        be applied.</div>,

    // VSC

    viscmin: <div>Minimum fluid viscosity. If the resulting viscosity value calculated with the equation is less than
        VISCMIN, the viscosity value is set to VISCMIN. If VISCMIN = 0, the computed fluid viscosity is not limited by
        VISCMIN (this is the option to use for most simulations). If VISCMIN > 0, a computed fluid viscosity less than
        VISCMIN is automatically reset to VISCMIN.</div>,
    viscmax: <div>Maximum fluid viscosity. If the resulting viscosity value calculated with the equation is greater than
        VISCMAX, the viscosity value is set to VISCMAX. If VISCMAX = 0, the computed fluid viscosity is not limited by
        VISCMAX (this is the option to use for most simulations). If VISCMAX > 0, a computed fluid viscosity larger than
        VISCMAX is automatically reset to VISCMAX.</div>,
    viscref: <div>Fluid viscosity at the reference concentration and reference temperature. For most simulations,
        VISCREF is specified as the viscosity of freshwater.</div>,
    dmudc: <div>Slope of the linear equation that relates fluid viscosity to solute concentration.</div>,
    cmuref: <div>Reference concentration</div>,
    mutempopt: <div>Flag that specifies the option for including the effect of temperature on fluid viscosity. If
        MUTEMPOPT = 0, the effect of temperature on fluid viscosity is not included or is a simple linear relation that
        is specified in item 3c. If MUTEMPOPT = 1, fluid viscosity is calculated using equation 18. The size of the
        AMUCOEFF array in item 3e is 4 (MUNCOEFF = 4). If MUTEMPOPT = 2, fluid viscosity is calculated using equation
        19. The size of the AMUCOEFF array in item 3e is 5 (MUNCOEFF = 5). If MUTEMPOPT = 3, fluid viscosity is
        calculated using equation 20. The size of the AMUCOEFF array in item 3e is 2 (MUNCOEFF = 2). If NSMUEOS and
        MUTEMPOPT are both set to zero, all fluid viscosities are set to VISCREF.</div>,
    amucoeff: <div>Coefficient array of size MUNCOEFF. AMUCOEFF is A in equations 18, 19, and 20.</div>,
    mtmuspec: <div>MT3DMS species number corresponding to the adjacent DMUDC and CMUREF.</div>,

    // DE4
    de4: {
        itmx: <div>TODO!</div>,
        mxup: <div>TODO!</div>,
        mxlow: <div>TODO!</div>,
        mxbw: <div>TODO!</div>,
        ifreq: <div>TODO!</div>,
        mutd4: <div>TODO!</div>,
        accl: <div>TODO!</div>,
        iprd4: <div>TODO!</div>,
        hclose: <div>TODO!</div>,
        extension: <div>TODO!</div>,
        unitnumber: <div>TODO!</div>,
        filenames: <div>TODO!</div>,
    },

    // GMG
    gmg: {
        mxiter: <div>For linear problems, set to 1. For nonlinear problems, set to a higher number though it is usually unnecessary to go above 100.</div>,
        iiter: <div>is the maximum number of PCG iterations for each linear solution. A value of 100 is typically sufficient. It is frequently useful to specify a smaller number for nonlinear problems so as to prevent an excessive number of inner iterations.</div>,
        iadamp: <div>is a flag that controls adaptive damping. The possible values of IADAMP and their meanings are as follows:<br/><br/>
            •	If IADAMP = 0, then the value assigned to DAMP is used as a constant damping parameter.<br/>
            •	If IADAMP = 1, the value of DAMP is used for the first nonlinear iteration. The damping parameter is adaptively varied on the basis of the head change, using Cooley’s method as described in Mehl and Hill (2001), for subsequent iterations.<br/>
            •	If IADAMP = 2, the relative reduced residual damping method documented in Mehl and Hill (2001) and modified by Banta (2006) is used.<br/><br/>
            When IADAMP is specified as 2 and the value specified for DAMP is less than 0.5, the closure criterion for the inner iterations (DRCLOSE) is assigned simply as RCLOSE. When DAMP is between 0.5 and 1.0, inclusive, or when IADAMP is specified as 0 or 1, DRCLOSE is calculated according to equation 20 on p. 9 of Wilson and Naff (2004).</div>,
        hclose: <div>is the head change convergence criterion for nonlinear problems. After each linear solve (inner iteration), the maxnorm of the head change is compared against HCLOSE. HCLOSE can be set to a large number for linear problems; HCLOSE is ignored if MXITER=1.</div>,
        rclose: <div>is the residual convergence criterion for the inner iteration. The PCG algorithm computes the l2norm of the residual and compares it against RCLOSE. Typically, RCLOSE is set to the same value as HCLOSE (see below). If RCLOSE is set too high, then additional outer iterations may be required due to the linear equation not being solved with sufficient accuracy. On the other hand, a too restrictive setting for RCLOSE for nonlinear problems may force an unnecessarily accurate linear solution. This may be alleviated with the IITER parameter or with damping.</div>,
        relax: <div>is a relaxation parameter for the ILU preconditioned conjugate gradient method. The RELAX parameter can be used to improve the spectral condition number of the ILU preconditioned system. The value of RELAX should be approximately one. However, the relaxation parameter can cause the factorization to break down. If this happens, then the GMG solver will report an assembly error and a value smaller than one for RELAX should be tried. This item is read only if ISC = 4.</div>,
        ioutgmg: <div>is a flag that controls the output of the GMG solver. The possible values of IOUTGMG and their meanings are as follows:<br/><br/>
            •	If IOUTGMG = 0, then only the solver inputs are printed.<br/>
            •	If IOUTGMG =1, then for each linear solve, the number of PCG iterations, the value of the damping parameter, the l2norm of the residual, and the maxnorm of the head change and its location (column, row, layer) are printed. At the end of a time/stress period, the total number of GMG calls, PCG iterations, and a running total of PCG iterations for all time/stress periods are printed.<br/>
            •	If IOUTGMG = 2, then the convergence history of the PCG iteration is printed, showing the l2norm of the residual and the convergence factor for each iteration.<br/>
            •	IOUTGMG =3 is the same as IOUTGMG =1 except output is sent to the terminal instead of the MF2K LIST output file.<br/>
            •	IOUTGMG =4 is the same as IOUTGMG =2 except output is sent to the terminal instead of the MF2K LIST output file.
        </div>,
        iunitmhc: <div>is a flag and a unit number, which controls output of maximum head change values:<br/><br/>
            •	If IUNITMHC = 0, maximum head change values are not written to an output file.<br/>
            •	If IUNITMHC &#62; 0, maximum head change values are written to unit IUNITMHC. Unit IUNITMHC should be listed in the Name file with “DATA” as the file type.<br/>
            •	If IUNITMHC &#60; 0 or is not present, IUNITMHC defaults to 0.
        </div>,
        ism: <div>is a flag that controls the type of smoother used in the multigrid preconditioner. The possible values for ISM and their meanings are as follows:<br/><br/>
            •	If ISM = 0, then ILU(0) smoothing is implemented in the multigrid preconditioner. This smoothing requires an additional vector on each multigrid level to store the pivots in the ILU factorization.<br/>
            •	If ISM = 1, then Symmetric GaussSeidel (SGS) smoothing is implemented in the multigrid preconditioner. No additional storage is required for this smoother; users may want to use this option if available memory is exceeded or nearly exceeded when using ISM=0. Using SGS smoothing is not as robust as ILU smoothing; additional iterations are likely to be required in reducing the residuals. In extreme cases, the solver may fail to converge as the residuals cannot be reduced sufficiently.</div>,
        isc: <div>is a flag that controls semicoarsening in the multigrid preconditioner. The possible values of ISC and their meanings are given as follows:<br/><br/>
            •	If ISC = 0, then the rows, columns and layers are all coarsened.<br/>
            •	If ISC = 1, then the rows and columns are coarsened, but the layers are not.<br/>
            •	If ISC = 2, then the columns and layers are coarsened, but the rows are not.<br/>
            •	If ISC = 3, then the rows and layers are coarsened, but the columns are not.<br/>
            •	If ISC = 4, then there is no coarsening.<br/><br/>
            Typically, the value of ISC should be 0 or 1. In the case that there are large vertical variations in the hydraulic conductivities, then a value of 1 should be used (see Remark 9 in “CoarseGrid Correction” section of Wilson and Naff (2004)). If no coarsening is implemented (ISC = 4), then the GMG solver is comparable to the PCG2 ILU(0) solver described in Hill (1990) and uses the least amount of memory.</div>,
        damp: <div>is the value of the damping parameter. For linear problems, a value of 1.0 should be used. For nonlinear problems, a value less than 1.0 but greater than 0.0 may be necessary to achieve convergence. A typical value for nonlinear problems is 0.5. Damping also helps control the convergence criterion of the linear solve to alleviate excessive PCG iterations (see equation (20).</div>,
        dup: <div>is the maximum damping value that should be applied at any iteration when the solver is not oscillating; it is dimensionless. An appropriate value for DUP will be problem-dependent. For moderately nonlinear problems, reasonable values for DUP would be in the range 0.5 to 1.0. For a highly nonlinear problem, a reasonable value for DUP could be as small as 0.1. When the solver is oscillating, a damping value as large as 2.0*DUP may be applied.</div>,
        dlow: <div>is the minimum damping value to be generated by the adaptive-damping procedure; it is dimensionless. An appropriate value for DLOW will be problem-dependent and will be smaller than the value specified for DUP. For a highly nonlinear problem, an appropriate value for DLOW might be as small as 0.001. Note that the value specified for the next variable, CHGLIMIT, could result in application of a damping value smaller than DLOW.</div>,
        chglimit: <div>is the maximum allowed head change at any cell between outer iterations; it has units of length. The effect of CHGLIMIT is to determine a damping value that, when applied to all elements of the head-change vector, will produce an absolute maximum head change equal to CHGLIMIT.
        </div>,
        extension: <div>TODO!</div>,
        unitnumber: <div>TODO!</div>,
        filenames: <div>TODO!</div>,
    },

    // PCG
    pcg: {
        mxiter: <div>TODO!</div>,
        iter1: <div>TODO!</div>,
        npcond: <div>TODO!</div>,
        hclose: <div>TODO!</div>,
        rclose: <div>TODO!</div>,
        relax: <div>TODO!</div>,
        nbpol: <div>TODO!</div>,
        iprpcg: <div>TODO!</div>,
        mutpcg: <div>TODO!</div>,
        damp: <div>TODO!</div>,
        dampt: <div>TODO!</div>,
        ihcofadd: <div>TODO!</div>,
        extension: <div>TODO!</div>,
        unitnumber: <div>TODO!</div>,
        filenames: <div>TODO!</div>,
    },

    // PCGN
    pcgn: {
        iter_mo: <div>TODO!</div>,
        iter_mi: <div>TODO!</div>,
        close_h: <div>TODO!</div>,
        close_r: <div>TODO!</div>,
        relax: <div>TODO!</div>,
        ifill: <div>TODO!</div>,
        unit_pc: <div>TODO!</div>,
        unit_ts: <div>TODO!</div>,
        adamp: <div>TODO!</div>,
        damp: <div>TODO!</div>,
        damp_lb: <div>TODO!</div>,
        rate_d: <div>TODO!</div>,
        chglimit: <div>TODO!</div>,
        acnvg: <div>TODO!</div>,
        cnvg_lb: <div>TODO!</div>,
        mcnvg: <div>TODO!</div>,
        rate_c: <div>TODO!</div>,
        ipunit: <div>TODO!</div>,
        extension: <div>TODO!</div>,
        unitnumber: <div>TODO!</div>,
        filenames: <div>TODO!</div>,
    },

    // SMS
    sms: {
        options: <div>An optional keyword setting that activates solver options:<br/>
            &#8226; SIMPLE indicates that default solver input values will be defined that work well for nearly linear models. This would be used for models that do not include nonlinear stress packages (e.g. UZF, SFR) and models that are either confined or consist of a single unconfined layer that is thick enough to contain the water table within a single layer.<br/>
            &#8226; MODERATE indicates that default solver input values will be defined that work well for moderately nonlinear models.  This would be used for models that include nonlinear stress packages and models that consist of one or more unconfined layers. The “MODERATE” option should be used when the “SIMPLE” option does not result in successful convergence.<br/>
            &#8226; COMPLEX indicates that default solver input values will be defined that work well for highly nonlinear models. This would be used for models that include nonlinear stress packages and models that consist of one or more unconfined layers representing complex geology and sw/gw interaction. The “COMPLEX” option should be used when the “MODERATE” option does not result in successful convergence.<br/>
            &#8226; CUSTOM indicates that no keyword will be included and the full list of applicable settings will be translated into the SMS package.</div>,
        hclose: <div>is the head change criterion for convergence of the outer (nonlinear) iterations, in units of length. When the maximum absolute value of the head change at all nodes during an iteration is less than or equal to HCLOSE, iteration stops. Commonly, HCLOSE equals 0.01.</div>,
        hiclose: <div>is the head change criterion for convergence of the inner (linear) iterations, in units of length. When the maximum absolute value of the head change at all nodes during an iteration is less than or equal to HICLOSE, the matrix solver assumes convergence. Commonly, HICLOSE is set an order of magnitude less than HCLOSE.</div>,
        mxiter: <div>is the maximum number of outer (nonlinear) iterations – that is, calls to the solution routine. For a linear problem MXITER should be 1.</div>,
        iter1: <div>is the maximum number of inner (linear) iterations. The number typically depends on the characteristics of the matrix solution scheme being used. For nonlinear problems, ITER1 usually ranges from 60 to 600; a value of 100 will be sufficient for most linear problems.</div>,
        iprsms: <div>is a flag that controls printing of convergence information from the solver:<br/>
            &#8226; 0 is print nothing;<br/>
            &#8226; 1 is print only the total number of iterations and nonlinear residual reduction summaries;<br/>
            &#8226; 2 is print matrix solver information in addition to above.</div>,
        nonlinmeth: <div>is a flag that controls the nonlinear solution method and under- relaxation schemes.<br/>
            &#8226; 0 is Picard iteration scheme is used without any under-relaxation schemes involved.<br/>
            &#8226; &#62; 0 is Newton-Raphson iteration scheme is used with under-relaxation. Note that the Newton-Raphson linearization scheme is available only for the upstream weighted solution scheme of the BCF and LPF packages. <br/>
            &#8226; &#60; 0 is Picard iteration scheme is used with under-relaxation. The absolute value of NONLINMETH determines the underrelaxation scheme used.<br/>
            &#8226; 1 or -1, then Delta-Bar-Delta under-relaxation is used.<br/>
            &#8226; 2 or -2 then Cooley under-relaxation scheme is used. Note that the under-relaxation schemes are used in conjunction with gradient based methods, however, experience has indicated that the Cooley under-relaxation and damping work well also for the Picard scheme with the wet/dry options of MODFLOW.</div>,
        linmeth: <div>is a flag that controls the matrix solution method.<br/>
            &#8226; (1) use Ibaraki chi-MD matrix solver: an asymmetric matrix solver called ᵪMD (chi-MD) (Ibaraki, 2005),<br/>
            &#8226; (2) use White-Hughes matrix solver: an unstructured preconditioned conjugate gradient (PCGU) solver developed by White and Hughes (2011) for symmetric equations,<br/>
            &#8226; (3) use SAMG matrix solver: the advanced/proprietary SAMG solver developed at the Frauenhofer Institute.</div>,
        theta: <div>is the reduction factor for the learning rate (under-relaxation term) of the delta-bar-delta algorithm. The value of THETA is between zero and one. If the change in the variable (head) is of opposite sign to that of the previous iteration, the under-relaxation term is reduced by a factor of THETA. The value usually ranges from 0.3 to 0.9; a value of 0.7 works well for most problems.</div>,
        akappa: <div>is the increment for the learning rate (under-relaxation term) of the delta-bar-delta algorithm. The value of AKAPPA is between zero and one. If the change in the variable (head) is of the same sign to that of the previous iteration, the under-relaxation term is increased by an increment of AKAPPA. The value usually ranges from 0.03 to 0.3; a value of 0.1 works well for most problems.</div>,
        gamma: <div>is the history or memory term factor of the delta-bar-delta algorithm. Gamma is between zero and 1 but cannot be equal to one. When GAMMA is zero, only the most recent history (previous iteration value) is maintained. As GAMMA is increased, past history of iteration changes has greater influence on the memory term. The memory term is maintained as an exponential average of past changes. Retaining some past history can overcome granular behavior in the calculated function surface and therefore helps to overcome cyclic patterns of non-convergence. The value usually ranges from 0.1 to 0.3; a value of 0.2 works well for most problems.</div>,
        amomentum: <div>is the fraction of past history changes that is added as a momentum term to the step change for a nonlinear iteration. The value of AMOMENTUM is between zero and one. A large momentum term should only be used when small learning rates are expected. Small amounts of the momentum term help convergence. The value usually ranges from 0.0001 to 0.1; a value of 0.001 works well for most problems.</div>,
        numtrack: <div>is the maximum number of backtracking iterations allowed for residual reduction computations. If NUMTRACK = 0 then the backtracking iterations are omitted. The value usually ranges from 2 to 20; a value of 10 works well for most problems.</div>,
        btol: <div>is the tolerance for residual change that is allowed for residual reduction computations. BTOL should not be less than one to avoid getting stuck in local minima. A large value serves to check for extreme residual increases, while a low value serves to control step size more severely. The value usually ranges from 1.0 to 1e6 ; a value of 1e4 works well for most problems but lower values like 1.1 may be required for harder problems.</div>,
        breduc: <div>is the reduction in step size used for residual reduction computations. The value of BREDUC is between zero and one. The value usually ranges from 0.1 to 0.3; a value of 0.2 works well for most problems.</div>,
        reslim: <div>is the limit to which the residual is reduced with backtracking. If the residual is smaller than RESLIM, then further backtracking is not performed. A value of 100 is suitable for large problems and residual reduction to smaller values may only slow down computations.</div>,
        iacl: <div>is the flag for choosing the acceleration method.<br/>
            &#8226; (0) is Conjugate Gradient; select this option if the matrix is symmetric.<br/>
            &#8226; (1) is ORTHOMIN.<br/>
            &#8226; (2) is BiCGSTAB.</div>,
        norder: <div>is the flag for choosing the ordering scheme.<br/>
            &#8226; (0) is original ordering<br/>
            &#8226; (1) is reverse Cuthill McKee ordering<br/>
            &#8226; (2) is Minimum degree ordering</div>,
        level: <div>is the level of fill for ILU decomposition. Higher levels of fill provide more robustness but also require more memory. For optimal performance, it is suggested that a large level of fill be applied (7 or 8) with use of drop tolerance.</div>,
        north: <div>is the number of orthogonalizations for the ORTHOMIN acceleration scheme. A number between 4 and 10 is appropriate. Small values require less storage but more iteration may be required. This number should equal 2 for the other acceleration methods.</div>,
        iredsys: <div>is the index for creating a reduced system of equations using the red-black ordering scheme. 0 is do not create reduced system 1 is create reduced system using red-black ordering</div>,
        rrctol: <div>is a residual tolerance criterion for convergence. The root mean squared residual of the matrix solution is evaluated against this number to determine convergence. The solver assumes convergence if either HICLOSE (the absolute head tolerance value for the solver) or RRCTOL is achieved. Note that a value of zero ignores residual tolerance in favor of the absolute tolerance (HICLOSE) for closure of the matrix solver.</div>,
        idroptol: <div>is the flag to perform drop tolerance. 0 is do not perform drop tolerance 1 is perform drop tolerance.</div>,
        epsrn: <div>is the drop tolerance value. A value of 10<sup>-3</sup> works well for most problems.</div>,
        clin: <div>is an option keyword that defines the linear acceleration method used by the PCGU solver. CLIN is “CG”, then preconditioned conjugate gradient method. CLIN is “BCGS”, then preconditioned bi-conjugate gradient stabilized method.</div>,
        ipc: <div>is an integer value that defines the preconditioner.<br/>
            &#8226; IPC = 0, No preconditioning.<br/>
            &#8226; IPC = 1, Jacobi preconditioning.<br/>
            &#8226; IPC = 2, ILU(0) preconditioning.<br/>
            &#8226; IPC = 3, MILU(0) preconditioning (default).</div>,
        iscl: <div>is the flag for choosing the matrix scaling approach used.<br/>
            &#8226; (0) is no matrix scaling applied <br/>
            &#8226; (1) is symmetric matrix scaling using the scaling method by the POLCG preconditioner in Hill (1992). <br/>
            &#8226; (2) is symmetric matrix scaling using the l2 norm of each row of A (DR) and the l2 norm of each row of DRA.</div>,
        iord: <div>is the flag for choosing the matrix reordering approach used.<br/>
            &#8226; 0 = original ordering<br/>
            &#8226; 1 = reverse Cuthill McKee ordering<br/>
            &#8226; 2 = minimum degree ordering</div>,
        rclosepcgu: <div>is a real value that defines the flow residual tolerance for convergence of the PCGU linear solver. This value represents the maximum allowable residual at any single node. Value is in units of length cubed per time, and must be consistent with MODFLOW-USG length and time units. Usually a value of 1.0x10-1 is sufficient for the flow-residual criteria when meters and seconds are the defined MODFLOW-USG length and time.</div>,
        relaxpcgu: <div>is a real value that defines the relaxation factor used by the MILU(0) preconditioner. RELAXPCGU is unitless and should be greater than or equal to 0.0 and less than or equal to 1.0. RELAXPCGU values of about 1.0 are commonly used, and experience suggests that convergence can be optimized in some cases with RELAXPCGU values of 0.97. A RELAXPCGU value of 0.0 will result in ILU(0) preconditioning. RELAXPCGU is only specified if IPC=3. If RELAXPCGU is not specified and IPC=3, then a default value of 0.97 will be assigned to RELAXPCGU.</div>
    },

    // SOR
    sor: {
        mxiter: <div>is the maximum number of iterations allowed in a time step.</div>,
        accl: <div>is the acceleration variable, usually between 1.0 and 2.0.</div>,
        hclose: <div>is the head change criterion for convergence. When the maximum absolute value of head change from all nodes during an iteration is less than or equal to HCLOSE, iteration stops.</div>,
        iprsor: <div>is the printout interval for SOR. IF IPRSOR is equal to zero, it is changed to 999. The maximum head change (positive or negative) is printed for each iteration of a time step whenever the time step is an even multiple of IPRSOR. This printout also occurs at the end of each stress period regardless of the value of IPRSOR.</div>,
    }
};
