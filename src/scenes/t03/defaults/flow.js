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
    bas: {
        ibound: <div>The ibound array (the default is 1).</div>,
        strt: <div>An array of starting heads (the default is 1.0).</div>,
        ifrefm: <div>Indication if data should be read using free format (the default is True).</div>,
        ichflg: <div>Flag indicating that flows between constant head cells should be calculated (the default is
            False).</div>,
        stoper: <div>Percent discrepancy that is compared to the budget percent discrepancy continue when the solver
            convergence criteria are not met. Execution will unless the budget percent discrepancy is greater than
            stoper (default is None). MODFLOW-2005 only</div>,
        hnoflo: <div>Head value assigned to inactive cells (default is -999.99).</div>,
    },

    // CHD
    chd: {
        extension: <div>Filename extension (default is ‘chd’)</div>,
        unitnumber: <div>File unit number (default is None).</div>,
        filenames: <div>Filenames to use for the package. If filenames=None the package name will be created using the
            model name and package extension. If a single string is passed the package will be set to the string.
            Default is None.</div>
    },

    // DIS
    dis: {
        nlay: <div>Number of model layers (the default is 1).</div>,
        nrow: <div>Number of model rows (the default is 2).</div>,
        ncol: <div>Number of model columns (the default is 2).</div>,
        nper: <div>Number of model stress periods (the default is 1).</div>,
        delr: <div>An array of spacings along a row (the default is 1.0).</div>,
        delc: <div>An array of spacings along a column (the default is 0.0).</div>,
        laycbd: <div>An array of flags indicating whether or not a layer has a Quasi-3D confining bed below it.
            0 indicates no confining bed, and not zero indicates a confining bed. LAYCBD for the bottom layer must be 0.
            (the default is 0).</div>,
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
        extension: <div>Filename extension (default is ‘dis’)</div>,
        unitnumber: <div>File unit number (default is None).</div>,
        filenames: <div>Filenames to use for the package. If filenames=None the package name will be created using the
            model name and package extension. If a single string is passed the package will be set to the string.
            Default is None.</div>,
        xul: <div>x coordinate of upper left corner of the grid, default is None</div>,
        yul: <div>y coordinate of upper left corner of the grid, default is None</div>,
        rotation: <div>Clockwise rotation (in degrees) of the grid about the upper left corner. default is 0.0</div>,
        proj4_str: <div>PROJ4 string that defines the xul-yul coordinate system (.e.g. ‘+proj=longlat +ellps=WGS84
            +datum=WGS84 +no_defs ‘). Can be an EPSG code (e.g. ‘EPSG:4326’). Default is ‘EPSG:4326’</div>,
        start_datetime: <div>Starting datetime of the simulation. default is ‘1/1/1970’</div>
    },

    // FHB
    fhb: {
        nbdtim: <div>The number of times at which flow and head will be specified for all selected cells. (default is
            1)</div>,
        nflw: <div>Number of cells at which flows will be specified. (default is 0)</div>,
        nhed: <div>Number of cells at which heads will be specified. (default is 0)</div>,
        ifhbss: <div>FHB steady-state option flag. If the simulation includes any transient-state stress periods, the
            flag is read but not used; in this case, specified-flow, specified-head, and auxiliary-variable values will
            be interpolated for steady-state stress periods in the same way that values are interpolated for transient
            stress periods. If the simulation includes only steady-state stress periods, the flag controls how flow,
            head, and auxiliary-variable values will be computed for each steady-state solution. (default is 0)</div>,
        ipakcb:<div>A flag that is used to determine if cell-by-cell budget data should be saved. If ipakcb is non-zero
            cell-by-cell budget data will be saved. (default is None).</div>,
        nfhbx1: <div>Number of auxiliary variables whose values will be computed for each time step for each
            specified-flow cell. Auxiliary variables are currently not supported. (default is 0)</div>,
        nfhbx2: <div>Number of auxiliary variables whose values will be computed for each time step for each
            specified-head cell. Auxiliary variables are currently not supported. (default is 0)</div>,
        ifhbpt: <div>Flag for printing values of data list. Applies to datasets 4b, 5b, 6b, 7b, and 8b. If ifhbpt > 0,
            datasets read at the beginning of the simulation will be printed. Otherwise, the datasets will not be
            printed. (default is 0).</div>,
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
            iaux(int), sbhed[nbdtime](float). There are nflw entries. (default is None) The simplest form is a list of
            lists with the FHB flow boundaries.<br/>
            Note there should be nhed rows in ds7.</div>,
        extension: <div>Filename extension (default is ‘fhb’)</div>,
        unitnumber: <div>File unit number (default is None).</div>,
        filenames: <div>Filenames to use for the package and the output files. If filenames=None the package name will
            be created using the model name and package extension and the cbc output name will be created using the
            model name and .cbc extension (for example, modflowtest.cbc), if ipakcbc is a number greater than zero.
            If a single string is passed the package will be set to the string and cbc output names will be created
            using the model name and .cbc extension, if ipakcbc is a number greater than zero. To define the names for
            all package files (input and output) the length of the list of strings should be 2. Default is None.</div>
    },

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
    ghb: {
        ipakcb: <div>A flag that is used to determine if cell-by-cell budget data should be saved. If ipakcb is non-zero
            cell-by-cell budget data will be saved. (default is 0).</div>,
        stress_period_data: <div>Dictionary of boundaries.<br/>
            Each ghb cell is defined through definition of layer(int), row(int), column(int), stage(float),
            conductance(float) The simplest form is a dictionary with a lists of boundaries for each stress period,
            where each list of boundaries itself is a list of boundaries. Indices of the dictionary are the numbers of
            the stress period.</div>,
        no_print: <div>TODO!!</div>,
        options: <div>Package options. (default is None).</div>,
        extension: <div>Filename extension (default is ‘ghb’)</div>,
        unitnumber: <div>File unit number (default is None).</div>,
        filenames: <div>Filenames to use for the package and the output files. If filenames=None the package name will
            be created using the model name and package extension and the cbc output name will be created using the
            model name and .cbc extension (for example, modflowtest.cbc), if ipakcbc is a number greater than zero.
            If a single string is passed the package will be set to the string and cbc output names will be created
            using the model name and .cbc extension, if ipakcbc is a number greater than zero. To define the names for
            all package files (input and output) the length of the list of strings should be 2. Default is None.</div>
    },


    // HFB
    hfb: {
        nphfb: <div>Number of horizontal-flow barrier parameters. Note that for an HFB parameter to have an effect in
            the simulation, it must be defined and made active using NACTHFB to have an effect in the simulation
            (default is 0).</div>,
        mxfb: <div>Maximum number of horizontal-flow barrier barriers that will be defined using parameters
            (default is 0).</div>,
        nhfbnp: <div>Number of horizontal-flow barriers not defined by parameters. This is calculated automatically
            by FloPy based on the information in layer_row_column_data (default is 0).</div>,
        hfb_data: <div>In its most general form, this is a list of horizontal-flow barrier records. A barrier is
            conceptualized as being located on the boundary between two adjacent finite difference cells in the same
            layer. The innermost list is the layer, row1, column1, row2, column2, and hydrologic characteristics for
            a single hfb between the cells. The hydraulic characteristic is the barrier hydraulic conductivity divided
            by the width of the horizontal-flow barrier. (default is None).</div>,
        nacthfb: <div>The number of active horizontal-flow barrier parameters (default is 0).</div>,
        no_print: <div>When True or 1, a list of horizontal flow barriers will not be written to the Listing File
            (default is False)</div>
    },

    // HOB
    hob: {
        iuhobsv: <div>Unit number where output is saved. If iuhobsv is None, a unit number will be assigned (default is
            None).</div>,
        hobdry: <div>Value of the simulated equivalent written to the observation output file when the observation is
            omitted because a cell is dry (default is 0).</div>,
        tomulth: <div>Time step multiplier for head observations. The product of tomulth and toffset must produce a time
            value in units consistent with other model input. tomulth can be dimensionless or can be used to convert the
            units of toffset to the time unit used in the simulation (default is 1).</div>,
        obs_data: <div>A single HeadObservation instance or a list of HeadObservation instances containing all of the data
            for each observation. If obs_data is None a default HeadObservation with an observation in layer, row, column
            (0, 0, 0) and a head value of 0 at totim 0 will be created (default is None).</div>
    },

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

    // RIV
    riv: {
        ipakcb: <div>TODO!!</div>,
        options: <div>TODO!!</div>,
        extension: <div>Filename extension (default is ‘riv’)</div>,
        unitnumber: <div>File unit number (default is None).</div>,
        filenames: <div>Filenames to use for the package and the output files. If filenames=None the package name will
            be created using the model name and package extension and the cbc output name will be created using the
            model name and .cbc extension (for example, modflowtest.cbc), if ipakcbc is a number greater than zero.
            If a single string is passed the package will be set to the string and cbc output names will be created
            using the model name and .cbc extension, if ipakcbc is a number greater than zero. To define the names for
            all package files (input and output) the length of the list of strings should be 2. Default is None.</div>
    },

    // RCH
    rch: {
        nrchop: <div>Is the recharge option code. 1: Recharge to top grid layer only 2: Recharge to layer defined in irch 3:
            Recharge to highest active cell (default is 3).</div>,
        rech: <div>Is the recharge flux. (default is 1.e-3)</div>,
        irch: <div>Is the layer to which recharge is applied in each vertical column (only used when nrchop=2). (default is
            0).</div>,
        ipakcb: <div>TODO!!</div>,
        extension: <div>Filename extension (default is ‘rch’)</div>,
        unitnumber: <div>File unit number (default is None).</div>,
        filenames: <div>Filenames to use for the package and the output files. If filenames=None the package name will
            be created using the model name and package extension and the cbc output name will be created using the
            model name and .cbc extension (for example, modflowtest.cbc), if ipakcbc is a number greater than zero.
            If a single string is passed the package will be set to the string and cbc output names will be created
            using the model name and .cbc extension, if ipakcbc is a number greater than zero. To define the names for
            all package files (input and output) the length of the list of strings should be 2. Default is None.</div>
    },

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

    // WEL
    wel: {
        ipakcb: <div>A flag that is used to determine if cell-by-cell budget data should be saved.
            If ipakcb is non-zero cell-by-cell budget data will be saved. (default is 0).</div>,
        extension: <div>Filename extension (default is ‘wel’)</div>,
        options:<div>Package options (default is None).</div>,
        unitnumber: <div>File unit number (default is None).</div>,
        filenames: <div>Filenames to use for the package and the output files. If filenames=None the package name will
            be created using the model name and package extension and the cbc output name will be created using the
            model name and .cbc extension (for example, modflowtest.cbc), if ipakcbc is a number greater than zero.
            If a single string is passed the package will be set to the string and cbc output names will be created
            using the model name and .cbc extension, if ipakcbc is a number greater than zero. To define the names for
            all package files (input and output) the length of the list of strings should be 2. Default is None.</div>
    },

    // FLOW Packages

    // BCF
    bcf: {
        ipakcb: <div>A flag that is used to determine if cell-by-cell budget data should be saved.
            If ipakcb is non-zero cell-by-cell budget data will be saved. (default is 53)</div>,
        intercellt: <div>Intercell transmissivities, harmonic mean (0), arithmetic mean (1), logarithmetic mean (2),
            combination (3). (default is 0)</div>,
        laycon: <div>Layer type, confined (0), unconfined (1), constant T, variable S (2), variable T, variable S
            (default
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
        sf1: <div>specific storage (confined) or storage coefficient (unconfined), read when there is at least one
            transient
            stress period. (default is 1e-5)</div>,
        sf2: <div>specific yield, only read when laycon is 2 or 3 and there is at least one transient stress period
            (default
            is 0.15)</div>,
        vkcb: <div>TODO!!</div>,
        wetdry: <div>a combination of the wetting threshold and a flag to indicate which neighboring cells can cause a
            cell
            to become wet (default is -0.01)</div>,
        extension: <div>Filename extension (default is ‘bcf’)</div>,
        unitnumber: <div>File unit number (default is None).</div>,
        filenames: <div>Filenames to use for the package and the output files. If filenames=None the package name will
            be created using the model name and package extension and the cbc output name will be created using the
            model name and .cbc extension (for example, modflowtest.cbc), if ipakcbc is a number greater than zero.
            If a single string is passed the package will be set to the string and cbc output name will be created
            using the model name and .cbc extension, if ipakcbc is a number greater than zero. To define the names for
            all package files (input and output) the length of the list of strings should be 2. Default is None.</div>
    },

    // LPF
    lpf: {
        ipakcb: <div>A flag that is used to determine if cell-by-cell budget data should be saved.
            If ipakcb is non-zero cell-by-cell budget data will be saved. (default is 53)</div>,
        hdry: <div>Is the head that is assigned to cells that are converted to dry during a simulation.
            Although this value plays no role in the model calculations, it is useful as an indicator when looking
            at the resulting heads that are output from the model. HDRY is thus similar to HNOFLO in the Basic Package,
            which is the value assigned to cells that are no-flow cells at the start of a model simulation.
            (default is -1.e30).</div>,
        iwdflg: <div>Flag to indicate if wetting is inactive (0) or not (non zero) (default is 0)</div>,
        wetfct: <div>is a factor that is included in the calculation of the head that is initially established at a
            cell when it is converted from dry to wet. (default is 0.1).</div>,
        iwetit: <div>is the iteration interval for attempting to wet cells. Wetting is attempted every IWETIT iteration.
            If using the PCG solver (Hill, 1990), this applies to outer iterations, not inner iterations.
            If IWETIT less than or equal to 0, it is changed to 1. (default is 1).</div>,
        ihdwet: <div>is a flag that determines which equation is used to define the initial head at cells that become
            wet. (default is 0)</div>,
        wetdry: <div>is a combination of the wetting threshold and a flag to indicate which neighboring cells can cause
            a cell to become wet. (default is -0.01).</div>,
        storagecoefficient: <div>indicates that variable Ss and SS parameters are read as storage coefficient rather
            than specific storage. (default is False).</div>,
        constantcv: <div>indicates that vertical conductance for an unconfined cell is computed from the cell thickness
            rather than the saturated thickness. The CONSTANTCV option automatically invokes the NOCVCORRECTION option.
            (default is False).</div>,
        thickstrt: <div>indicates that layers having a negative LAYTYP are confined, and their cell thickness for
            conductance calculations will be computed as STRT-BOT rather than TOP-BOT. (default is False).</div>,
        nocvcorrection: <div>indicates that vertical conductance is not corrected when the vertical flow correction
            is applied. (default is False).</div>,
        novfc: <div>turns off the vertical flow correction under dewatered conditions. This option turns off the
            vertical flow calculation described on p. 5-8 of USGS Techniques and Methods Report 6-A16 and the vertical
            conductance correction described on p. 5-18 of that report. (default is False).</div>,
        extension: <div>Filename extension (default is ‘lpf’)</div>,
        unitnumber: <div>File unit number (default is None).</div>,
        filenames: <div>Filenames to use for the package and the output files. If filenames=None the package name will
            be created using the model name and package extension and the cbc output name will be created using the
            model name and .cbc extension (for example, modflowtest.cbc), if ipakcbc is a number greater than zero.
            If a single string is passed the package will be set to the string and cbc output name will be created
            using the model name and .cbc extension, if ipakcbc is a number greater than zero. To define the names for
            all package files (input and output) the length of the list of strings should be 2. Default is None.</div>
    },


    // SOLVER Packages

    // DE4
    de4: {
        itmx: <div>Maximum number of iterations for each time step. Specify ITMAX = 1 if iteration is not desired.
            Ideally iteration would not be required for direct solution. However, it is necessary to iterate if the flow
            equation is nonlinear or if computer precision limitations result in inaccurate calculations as indicated by
            a large water budget error (default is 50).</div>,
        mxup: <div>Maximum number of equations in the upper part of the equations to be solved. This value impacts the
            amount of memory used by the DE4 Package. If specified as 0, the program will calculate MXUP as half the
            number of cells in the model, which is an upper limit (default is 0).</div>,
        mxlow: <div>Maximum number of equations in the lower part of equations to be solved. This value impacts the
            amount of memory used by the DE4 Package. If specified as 0, the program will calculate MXLOW as half the
            number of cells in the model, which is an upper limit (default is 0).</div>,
        mxbw: <div>Maximum band width plus 1 of the lower part of the head coefficients matrix. This value impacts the
            amount of memory used by the DE4 Package. If specified as 0, the program will calculate MXBW as the product
            of the two smallest grid dimensions plus 1, which is an upper limit (default is 0).</div>,
        ifreq: <div>Flag indicating the frequency at which coefficients in head matrix change. IFREQ = 1 indicates that
            the flow equations are linear and that coefficients of simulated head for all stress terms are constant for
            all stress periods. IFREQ = 2 indicates that the flow equations are linear, but coefficients of simulated
            head for some stress terms may change at the start of each stress period. IFREQ = 3 indicates that a
            nonlinear flow equation is being solved, which means that some terms in the head coefficients matrix depend
            on simulated head (default is 3).</div>,
        mutd4: <div>Flag that indicates the quantity of information that is printed when convergence information is
            printed for a time step. MUTD4 = 0 indicates that the number of iterations in the time step and the maximum
            head change each iteration are printed. MUTD4 = 1 indicates that only the number of iterations in the time
            step is printed. MUTD4 = 2 indicates no information is printed (default is 0).</div>,
        accl: <div>Multiplier for the computed head change for each iteration. Normally this value is 1. A value greater
            than 1 may be useful for improving the rate of convergence when using external iteration to solve nonlinear
            problems (default is 1).</div>,
        iprd4: <div>Time step interval for printing out convergence information when iterating (ITMX > 1). If IPRD4 is
            2, convergence information is printed every other time step. A value must always be specified even if not
            iterating (default is 1).</div>,
        hclose: <div>Head change closure criterion. If iterating (ITMX > 1), iteration stops when the absolute value of
            head change at every node is less than or equal to HCLOSE. HCLOSE is not used if not iterating, but a value
            must always be specified (default is 1e-5).</div>,
        extension: <div>Filename extension (default is ‘de4’)</div>,
        unitnumber: <div>File unit number (default is None).</div>,
        filenames: <div>Filenames to use for the package. If filenames=None the package name will be created using the
            model name and package extension. If a single string is passed the package will be set to the string.
            Default is None.</div>,
    },

    // GMG
    gmg: {
        mxiter: <div>For linear problems, set to 1. For nonlinear problems, set to a higher number though it is usually
            unnecessary to go above 100.</div>,
        iiter: <div>is the maximum number of PCG iterations for each linear solution. A value of 100 is typically
            sufficient. It is frequently useful to specify a smaller number for nonlinear problems so as to prevent an
            excessive number of inner iterations.</div>,
        iadamp: <div>is a flag that controls adaptive damping. The possible values of <strong>iadamp</strong> and their
            meanings are as follows:<br/><br/>
            • If <strong>iadamp</strong> = 0, then the value assigned to <strong>damp</strong> is used as a constant
            damping parameter.<br/>
            • If <strong>iadamp</strong> = 1, the value of <strong>damp</strong> is used for the first nonlinear
            iteration. The damping parameter is adaptively varied on the basis of the head change, using Cooley’s method
            as described in Mehl and Hill (2001), for subsequent iterations.<br/>
            • If <strong>iadamp</strong> = 2, the relative reduced residual damping method documented in Mehl and Hill
            (2001) and modified by Banta (2006) is used.<br/><br/>
            When <strong>iadamp</strong> is specified as 2 and the value specified for <strong>damp</strong> is less
            than 0.5, the closure criterion for the inner iterations (DRCLOSE) is assigned simply
            as <strong>rclose</strong>. When <strong>damp</strong> is between 0.5 and 1.0, inclusive, or
            when <strong>iadamp</strong> is specified as 0 or 1, DRCLOSE is calculated according to equation 20 on p. 9
            of Wilson and Naff (2004).</div>,
        hclose: <div>is the head change convergence criterion for nonlinear problems. After each linear solve (inner
            iteration), the maxnorm of the head change is compared
            against <strong>hclose</strong>. <strong>hclose</strong> can be set to a large number for linear
            problems; <strong>hclose</strong> is ignored if <strong>mxiter</strong>=1.</div>,
        rclose: <div>is the residual convergence criterion for the inner iteration. The PCG algorithm computes the
            l2norm of the residual and compares it against <strong>rclose</strong>.
            Typically, <strong>rclose</strong> is set to the same value as <strong>hclose</strong> (see below).
            If <strong>rclose</strong> is set too high, then additional outer iterations may be required due to the
            linear equation not being solved with sufficient accuracy. On the other hand, a too restrictive setting
            for <strong>rclose</strong> for nonlinear problems may force an unnecessarily accurate linear solution. This
            may be alleviated with the IITER parameter or with damping.</div>,
        relax: <div>is a relaxation parameter for the ILU preconditioned conjugate gradient method.
            The <strong>relax</strong> parameter can be used to improve the spectral condition number of the ILU
            preconditioned system. The value of <strong>relax</strong> should be approximately one. However, the
            relaxation parameter can cause the factorization to break down. If this happens, then the GMG solver will
            report an assembly error and a value smaller than one for <strong>relax</strong> should be tried. This item
            is read only if ISC = 4.</div>,
        ioutgmg: <div>is a flag that controls the output of the GMG solver. The possible values
            of <strong>ioutgmg</strong> and their meanings are as follows:<br/><br/>
            • If <strong>ioutgmg</strong> = 0, then only the solver inputs are printed.<br/>
            • If <strong>ioutgmg</strong> =1, then for each linear solve, the number of PCG iterations, the value of the
            damping parameter, the l2norm of the residual, and the maxnorm of the head change and its location (column,
            row, layer) are printed. At the end of a time/stress period, the total number of GMG calls, PCG iterations,
            and a running total of PCG iterations for all time/stress periods are printed.<br/>
            • If <strong>ioutgmg</strong> = 2, then the convergence history of the PCG iteration is printed, showing the
            l2norm of the residual and the convergence factor for each iteration.<br/>
            • <strong>ioutgmg</strong> =3 is the same as <strong>ioutgmg</strong> =1 except output is sent to the
            terminal instead of the MF2K LIST output file.<br/>
            • <strong>ioutgmg</strong> =4 is the same as <strong>ioutgmg</strong> =2 except output is sent to the
            terminal instead of the MF2K LIST output file.
        </div>,
        iunitmhc: <div>is a flag and a unit number, which controls output of maximum head change values:<br/><br/>
            • If <strong>iunitmhc</strong> = 0, maximum head change values are not written to an output file.<br/>
            • If <strong>iunitmhc</strong> &#62; 0, maximum head change values are written to
            unit <strong>iunitmhc</strong>. Unit <strong>iunitmhc</strong> should be listed in the Name file with “DATA”
            as the file type.<br/>
            • If <strong>iunitmhc</strong> &#60; 0 or is not present, <strong>iunitmhc</strong> defaults to 0.
        </div>,
        ism: <div>is a flag that controls the type of smoother used in the multigrid preconditioner. The possible values
            for <strong>ism</strong> and their meanings are as follows:<br/><br/>
            • If <strong>ism</strong> = 0, then ILU(0) smoothing is implemented in the multigrid preconditioner. This
            smoothing requires an additional vector on each multigrid level to store the pivots in the ILU
            factorization.<br/>
            • If <strong>ism</strong> = 1, then Symmetric GaussSeidel (SGS) smoothing is implemented in the multigrid
            preconditioner. No additional storage is required for this smoother; users may want to use this option if
            available memory is exceeded or nearly exceeded when using <strong>ism</strong>=0. Using SGS smoothing is
            not as robust as ILU smoothing; additional iterations are likely to be required in reducing the residuals.
            In extreme cases, the solver may fail to converge as the residuals cannot be reduced sufficiently.</div>,
        isc: <div>is a flag that controls semicoarsening in the multigrid preconditioner. The possible values
            of <strong>isc</strong> and their meanings are given as follows:<br/><br/>
            • If <strong>isc</strong> = 0, then the rows, columns and layers are all coarsened.<br/>
            • If <strong>isc</strong> = 1, then the rows and columns are coarsened, but the layers are not.<br/>
            • If <strong>isc</strong> = 2, then the columns and layers are coarsened, but the rows are not.<br/>
            • If <strong>isc</strong> = 3, then the rows and layers are coarsened, but the columns are not.<br/>
            • If <strong>isc</strong> = 4, then there is no coarsening.<br/><br/>
            Typically, the value of <strong>isc</strong> should be 0 or 1. In the case that there are large vertical
            variations in the hydraulic conductivities, then a value of 1 should be used (see Remark 9 in “CoarseGrid
            Correction” section of Wilson and Naff (2004)). If no coarsening is implemented (<strong>isc</strong> = 4),
            then the GMG solver is comparable to the PCG2 ILU(0) solver described in Hill (1990) and uses the least
            amount of memory.</div>,
        damp: <div>is the value of the damping parameter. For linear problems, a value of 1.0 should be used. For
            nonlinear problems, a value less than 1.0 but greater than 0.0 may be necessary to achieve convergence. A
            typical value for nonlinear problems is 0.5. Damping also helps control the convergence criterion of the
            linear solve to alleviate excessive PCG iterations (see equation (20).</div>,
        dup: <div>is the maximum damping value that should be applied at any iteration when the solver is not
            oscillating; it is dimensionless. An appropriate value for <strong>dup</strong> will be problem-dependent.
            For moderately nonlinear problems, reasonable values for <strong>dup</strong> would be in the range 0.5 to
            1.0. For a highly nonlinear problem, a reasonable value for <strong>dup</strong> could be as small as 0.1.
            When the solver is oscillating, a damping value as large as 2.0*<strong>dup</strong> may be applied.</div>,
        dlow: <div>is the minimum damping value to be generated by the adaptive-damping procedure; it is dimensionless.
            An appropriate value for <strong>dlow</strong> will be problem-dependent and will be smaller than the value
            specified for <strong>dup</strong>. For a highly nonlinear problem, an appropriate value
            for <strong>dlow</strong> might be as small as 0.001. Note that the value specified for the next
            variable, <strong>chglimit</strong>, could result in application of a damping value smaller
            than <strong>dlow</strong>.</div>,
        chglimit: <div>is the maximum allowed head change at any cell between outer iterations; it has units of length.
            The effect of <strong>chglimit</strong> is to determine a damping value that, when applied to all elements
            of the head-change vector, will produce an absolute maximum head change equal to <strong>chglimit</strong>.
        </div>,
        extension: <div>Filename extension (default is ‘gmg’)</div>,
        unitnumber: <div>File unit number (default is None).</div>,
        filenames: <div>Filenames to use for the package and the output files. If filenames=None the package name will
            be created using the model name and package extension and the gmg output name will be created using the
            model name and .cbc extension (for example, modflowtest.gmg.out), if iunitmhc is a number greater than zero.
            If a single string is passed the package will be set to the string and gmg output names will be created
            using the model name and .gmg.out extension, if iunitmhc is a number greater than zero. To define the names
            for all package files (input and output) the length of the list of strings should be 2.
            Default is None.</div>,
    },

    // NWT
    nwt: {
        options: <div>SPECIFIED indicates that the optional solver input values listed for items 1 and 2 will be
            specified in the NWT input file by the user.<br/>
            SIMPLE indicates that default solver input values will be defined that work well for nearly linear models.
            This would be used for models that do not include nonlinear stress packages, and models that are either
            confined or consist of a single unconfined layer that is thick enough to contain the water table within a
            single layer.<br/>
            MODERATE indicates that default solver input values will be defined that work well for moderately nonlinear
            models. This would be used for models that include nonlinear stress packages, and models that consist of one
            or more unconfined layers. The MODERATE option should be used when the SIMPLE option does not result in
            successful convergence.<br/>
            COMPLEX indicates that default solver input values will be defined that work well for highly nonlinear
            models. This would be used for models that include nonlinear stress packages, and models that consist of one
            or more unconfined layers representing complex geology and sw/gw interaction. The COMPLEX option should be
            used when the MODERATE option does not result in successful convergence. (default is COMPLEX).</div>,
        headtol: <div>is the maximum head change between outer iterations for solution of the nonlinear problem.
            (default is 1e-4)</div>,
        fluxtol: <div>is the maximum root-mean-squared flux difference between outer iterations for solution of the
            nonlinear problem. (default is 500)</div>,
        maxiterout: <div>is the maximum number of iterations to be allowed for solution of the outer (nonlinear)
            problem. (default is 100).</div>,
        thickfact: <div>is the portion of the cell thickness (length) used for smoothly adjusting storage and
            conductance coefficients to zero. (default is 1e-5)</div>,
        linmeth: <div>is a flag that determines which matrix solver will be used. A value of 1 indicates GMRES will be
            used A value of 2 indicates XMD will be used. (default is 1)</div>,
        iprnwt: <div>is a flag that indicates whether additional information about solver convergence will be printed to
            the main listing file. (default is 0)</div>,
        ibotav: <div>is a flag that indicates whether corrections will be made to groundwater head relative to the
            cell-bottom altitude if the cell is surrounded by dewatered cells (integer). A value of 1 indicates that a
            correction will be made and a value of 0 indicates no correction will be made. (default is 0)</div>,
        Continue: <div>if the model fails to converge during a time step then it will continue to solve the following
            time step. (default is False). Note the capital C on this option so that it doesn’t conflict with a reserved
            Python language word.</div>,
        dbdtheta: <div>is a coefficient used to reduce the weight applied to the head change between nonlinear
            iterations. <strong>dbdtheta</strong> is used to control oscillations in head. Values range between 0.0 and
            1.0, and larger values increase the weight (decrease under-relaxation) applied to the head change. (default
            is 0.4)</div>,
        dbdkappa: <div>is a coefficient used to increase the weight applied to the head change between nonlinear
            iterations. <strong>dbdkappa</strong> is used to control oscillations in head. Values range between 0.0 and
            1.0, and larger values increase the weight applied to the head change. (default is 1.e-5)</div>,
        dbdgamma: <div>is a factor used to weight the head change for the previous and current iteration. Values range
            between 0.0 and 1.0, and greater values apply more weight to the head change calculated during the current
            iteration. (default is 0)</div>,
        momfact: <div>is the momentum coefficient and ranges between 0.0 and 1.0. Greater values apply more weight to
            the head change for the current iteration. (default is 0.1)</div>,
        backflag: <div>is a flag used to specify whether residual control will be used. A value of 1 indicates that
            residual control is active and a value of 0 indicates residual control is inactive. (default is 1)</div>,
        maxbackiter: <div>is the maximum number of reductions (backtracks) in the head change between nonlinear
            iterations (integer). A value between 10 and 50 works well. (default is 50)</div>,
        backtol: <div>is the proportional decrease in the root-mean-squared error of the groundwater-flow equation used
            to determine if residual control is required at the end of a nonlinear iteration. (default is 1.1)</div>,
        backreduce: <div>is a reduction factor used for residual control that reduces the head change between nonlinear
            iterations. Values should be between 0.0 and 1.0, where smaller values result in smaller head-change values.
            (default 0.7)</div>,
        maxitinner: <div>is the maximum number of iterations for the linear solution. (default is 50)</div>,
        ilumethod: <div>is the index for selection of the method for incomplete factorization (ILU) used as a
            preconditioner. (default is 2)<br/>
            • (1) ILU with drop tolerance and fill limit. Fill-in terms less than drop tolerance times the diagonal are
            discarded. The number of fill-in terms in each row of L and U is limited to the fill limit. The fill-limit
            largest elements are kept in the L and U factors.<br/>
            • (2) ILU(k), Order k incomplete LU factorization. Fill-in terms of higher order than k in the factorization
            are discarded.
        </div>,
        levfill: <div>is the fill limit for ILUMETHOD = 1 and is the level of fill for ilumethod = 2. Recommended
            values: 5-10 for method 1, 0-2 for method 2. (default is 5).</div>,
        stoptol: <div>is the tolerance for convergence of the linear solver. This is the residual of the linear
            equations scaled by the norm of the root mean squared error. Usually 1.e-8 to 1.e-12 works well. (default is
            1.e-10)</div>,
        msdr: <div>is the number of iterations between restarts of the GMRES Solver. (default is 15)</div>,
        iacl: <div>is a flag for the acceleration method:<br/>
            • 0 is conjugate gradient,<br/>
            • 1 is ORTHOMIN,<br/>
            • 2 is Bi-CGSTAB. (default is 2)</div>,
        norder: <div>is a flag for the scheme of ordering the unknowns: 0 is original ordering, 1 is RCM ordering, 2 is
            Minimum Degree ordering. (default is 1)</div>,
        level: <div>is the level of fill for incomplete LU factorization. (default is 5)</div>,
        north: <div>is the number of orthogonalization for the ORTHOMIN acceleration scheme. A number between 4 and 10
            is appropriate. Small values require less storage but more iterations may be required. This number should
            equal 2 for the other acceleration methods. (default is 7)</div>,
        iredsys: <div>is a flag for reduced system preconditioning (integer):<br/>
            • 0-do not apply reduced system preconditioning,<br/>
            • 1-apply reduced system preconditioning.<br/>
            (default is 0)</div>,
        rrctols: <div>is the residual reduction-convergence criteria. (default is 0)</div>,
        idroptol: <div>is a flag for using drop tolerance in the preconditioning:<br/>
            • 0-don’t use drop tolerance,<br/>
            • 1-use drop tolerance. (default is 1)</div>,
        epsrn: <div>is the drop tolerance for preconditioning. (default is 1.e-4)</div>,
        hclosexmd: <div>is the head closure criteria for inner (linear) iterations. (default is 1.e-4)</div>,
        mxiterxmd: <div>is the maximum number of iterations for the linear solution. (default is 50)</div>,
        extension: <div>TODO!</div>,
        unitnumber: <div>TODO!</div>,
        filenames: <div>TODO!</div>
    },

    // PCG
    pcg: {
        mxiter: <div>is the maximum number of outer iterations.<br/>
            For a linear problem <strong>mxiter</strong> should be 1, unless more than 50 inner iterations are required,
            when <strong>mxiter</strong> could be as large as 10. A larger number (generally less than 100) is required
            for a nonlinear problem. (default is 50)</div>,
        iter1: <div>is the number of inner iterations.<br/>
            For nonlinear problems, <strong>iter1</strong> usually ranges from 10 to 30; a value of 30 will be
            sufficient for most linear problems.</div>,
        npcond: <div>is the flag used to select the matrix conditioning method. (default is 1)<br/>
            • 1 is for Modified Incomplete Cholesky<br/>
            • 2 is for Polynomial</div>,
        ihcofadd: <div>is a flag that determines what happens to an active cell that is surrounded by dry cells.
            (default is 0).<br/>
            If <strong>ihcofadd</strong>=0, cell converts to dry regardless of HCOF value. This is the default, which is
            the way PCG2 worked prior to the addition of this option.<br/>
            If <strong>ihcofadd</strong>&#60;&#62;0, cell converts to dry only if HCOF has no head-dependent stresses or
            storage terms.</div>,
        hclose: <div>is the head change criterion for convergence, in units of length. When the maximum absolute value
            of head change from all nodes during an iteration is less than or equal to <strong>hclose</strong>, and the
            criterion for <strong>rclose</strong> is also satisfied, iteration stops.<br/>
            (default is 1e-5)</div>,
        rclose: <div>is the residual criterion for convergence, in units of cubic length per time.<br/>
            When the maximum absolute value of the residual at all nodes during an iteration is less than or equal
            to <strong>rclose</strong>, and the criterion for <strong>hclose</strong> is also satisfied (see above),
            iteration stops.<br/>
            For nonlinear problems, convergence is achieved when the convergence criteria are satisfied for the first
            inner iteration.<br/>
            (default is 1e-5)</div>,
        relax: <div>is the relaxation parameter used with <strong>npcond</strong> = 1.<br/>
            Usually, <strong>relax</strong> = 1.0, but for some problems a value of 0.99, 0.98, or 0.97 will reduce the
            number of iterations required for convergence. <strong>relax</strong> is not used
            if <strong>npcond</strong> is not 1.<br/>
            (default is 1.0)</div>,
        nbpol: <div>is only used when <strong>npcond</strong> = 2 to indicate whether the estimate of the upper bound on
            the maximum eigenvalue is 2.0, or whether the estimate will be calculated. <strong>nbpol</strong> = 2 is
            used to specify the value is 2.0; for any other value of <strong>nbpol</strong>, the estimate is calculated.
            Convergence is generally insensitive to this parameter. (default is 0).</div>,
        iprpcg: <div>is the printout interval for PCG. If <strong>iprpcg</strong> is equal to zero, it is changed to
            999. The maximum head change (positive or negative) and residual change are printed for each iteration of a
            time step whenever the time step is an even multiple of <strong>iprpcg</strong>. This printout also occurs
            at the end of each stress period regardless of the value of <strong>iprpcg</strong>.</div>,
        mutpcg: <div>is a flag that controls printing of convergence information from the solver:<br/>
            • 0 is for printing tables of maximum head change and residual each iteration<br/>
            • 1 is for printing only the total number of iterations<br/>
            • 2 is for no printing<br/>
            • 3 is for printing only if convergence fails. (default is 3).
        </div>,
        damp: <div>is the steady-state damping factor. (default is 1.)</div>,
        dampt: <div>is the transient damping factor. (default is 1.)</div>,
        extension: <div>Filename extension (default is ‘pcg’)</div>,
        unitnumber: <div>File unit number (default is None).</div>,
        filenames: <div>Filenames to use for the package. If filenames=None the package name will be created using the
            model name and package extension. If a single string is passed the package will be set to the string.
            Default is None.</div>,
    },

    // PCGN
    pcgn: {
        iter_mo: <div>The maximum number of Picard (outer) iterations allowed.<br/>
            For nonlinear problems, this variable must be set to some number greater than one, depending on the problem
            size and degree of nonlinearity.<br/>
            If <strong>iter_mo</strong> is set to 1, then the PCGN solver assumes that the problem is linear and the
            input requirements are greatly truncated.<br/>
            (default is 50)</div>,
        iter_mi: <div>The maximum number of PCG (inner) iterations allowed.<br/>
            Generally, this variable is set to some number greater than one, depending on the matrix size, degree of
            convergence called for, and the nature of the problem. For a nonlinear
            problem, <strong>iter_mi</strong> should be set large enough that the PCG iteration converges freely with
            the relative convergence parameter epsilon &#949; described in the <em>Parameters Related to Convergence of
                Inner Iteration: Line 4</em> subsection.<br/>
            (default is 30)</div>,
        close_r: <div>The residual-based stopping criterion for iteration. This parameter is used differently, depending
            on whether it is applied to a linear or nonlinear problem.<br/>
            • If <strong>iter_mo</strong> = 1: For a linear problem, the variant of the conjugate gradient method
            outlined in algorithm 2 is employed, but uses the absolute convergence criterion in place of the relative
            convergence criterion. <strong>close_r</strong> is used as the value in the absolute convergence criterion
            for quitting the PCG iterative solver. <strong>close_r</strong> is compared to the square root of the
            weighted residual norm. In particular, if the square root of the weighted residual norm is less
            than <strong>close_r</strong>, then the linear PCG iterative solve is said to have converged, causing the
            PCG iteration to cease and control of the program to pass out of the PCG solver.<br/><br/>
            • If <strong>iter_mo</strong> &#62; 1: For a nonlinear problem, <strong>close_r</strong> is used as a
            criterion for quitting the Picard (outer) iteration. <strong>close_r</strong> is compared to the square root
            of the inner product of the residuals (the residual norm) as calculated on entry to the PCG solver at the
            beginning of every Picard iteration. If this norm is less than <strong>close_r</strong>, then the Picard
            iteration is considered to have converged.</div>,
        close_h: <div>is used as an alternate stopping criterion for the Picard iteration needed to solve a nonlinear
            problem.<br/><br/>
            The maximum value of the head change is obtained for each Picard iteration, after completion of the inner,
            PCG iteration. If this maximum head change is less than <strong>close_h</strong>, then the Picard iteration
            is considered tentatively to have converged. However, as nonlinear problems can demonstrate oscillation in
            the head solution, the Picard iteration is not declared to have converged unless the maximum head change is
            less than <strong>close_h</strong> for three Picard iterations. If these Picard iterations are sequential,
            then a good solution is assumed to have been obtained. If the Picard iterations are not sequential, then a
            warning is issued advising that the convergence is conditional and the user is urged to examine the mass
            balance of the solution.</div>,
        relax: <div>is the relaxation parameter used for the modified incomplete Cholesky (MIC) preconditioner (see
            algorithms 7 and 11); under MIC preconditioning, row sum agreement between the original matrix and the
            preconditioning matrix is created by pivot modification.<br/><br/>
            When <strong>relax</strong> = 0, then the MIC corresponds to the ordinary incomplete Cholesky
            preconditioner, the effect of the modifications to the incomplete Cholesky having been nullified.
            When <strong>relax</strong> = 1, then these modifications are in full force.<br/><br/>
            Generally speaking, it is of advantage to use the modifications to the incomplete Cholesky algorithm; a
            value of <strong>relax</strong> such that 0.9 &#60; <strong>relax</strong> &#60; 1 is generally advised for
            most problems. Values <strong>relax</strong> = 1 are not advised, particularly when <strong>ifill</strong> =
            0, as poor performance of the PCG solver may result (van der Vorst, 2003). However, experience has shown
            that a value close to 1, such as <strong>relax</strong> = 0.99, usually provides good performance.</div>,
        ifill: <div>is the fill level of the MIC preconditioner. Preconditioners with fill levels of 0 and 1 are
            available (<strong>ifill</strong> = 0 and <strong>ifill</strong> = 1, respectively).<br/><br/>
            Generally, the higher the fill level, the more preconditioning imparted by a MIC preconditioner. However,
            the actual preconditioning provided is also influenced by the modification to the incomplete Cholesky
            algorithm (see <strong>relax</strong>).<br/><br/>
            For most well-behaved CCFD matrices, a MIC preconditioner with fill level 0 will slightly outperform a MIC
            preconditioner with fill level 1, provided <strong>relax</strong> ≈ 1.<br/>
            For problems where the matrix equation is not well behaved or for a nonlinear problem where convergence is
            not easily achieved, a fill level of 1 may provide the additional preconditioning necessary to obtain
            convergence.<br/>
            One should be aware that the PCGN solver computer memory requirements of the level 1 MIC preconditioner are
            about double those of the level 0 preconditioner.
        </div>,
        unit_pc: <div>is the unit number of an optional output file where progress for the inner PCG iteration can be
            written.<br/><br/>
            Progress diagnostics consist of the weighted residual norm νi for every iteration i of the PCG solver; this
            information is output for every time step and every Picard iteration in the simulation. If this option is
            used (<strong>unit_pc</strong> > 0), the integer value of the unit, along with the file name and type
            “DATA,” should be given in the MODFLOW Name file (Harbaugh and others, 2000). In many instances, asking for
            this information will cause very large data files to be produced; it is not expected that this option will
            be used by most modelers.
        </div>,
        unit_ts: <div>is the unit number of an optional output file where the actual time in the PCG solver is
            accumulated.<br/><br/>
            The object here is to capture actual PCG solver time rather than total run time. If this option is used
            (<strong>unit_ts</strong> > 0), the integer value of the unit, along with the file name and type “DATA,”
            should be given in the MODFLOW Name file. It is not expected that this option will be used by most modelers.
        </div>,
        adamp: <div>defines the mode of damping applied to the linear solution. In general, damping determines how much
            of the head changes vector &#916;<sub>j</sub> shall be applied to the hydraulic head vector h<sub>j</sub> in
            Picard iteration j: h<sub>j</sub> = h<sub>j</sub>−1 +θ&#916;<sub>j</sub>, where θ is the damping
            parameter.<br/><br/>
            • If <strong>adamp</strong> = 0, Ordinary damping is employed and a constant value of damping parameter will
            be used throughout the Picard iteration; this option requires a valid value
            for <strong>damp</strong>.<br/><br/>
            • If <strong>adamp</strong> = 1, Adaptive damping is employed.<br/><br/>
            • If <strong>adamp</strong> = 2, Enhanced damping algorithm in which the damping value is increased (but
            never decreased) provided the Picard iteration is proceeding satisfactorily.<br/>(default is 0)</div>,
        damp: <div>is the damping factor. (default is 1)<br/>
            Generally, 0 &#60; <strong>damp</strong> &#60; 1. Its function for the various modes
            of <strong>adamp</strong> are:<br/>
            • <strong>adamp</strong> = 0: The damping parameter θ takes on the value <strong>damp</strong> and is
            maintained constant throughout the simulation.<br/>
            • <strong>adamp</strong> > 0: The value of <strong>damp</strong> will be treated as the upper limit for θ in
            the enhanced damping or adaptive damping algorithms.
        </div>,
        damp_lb: <div>is the lower bound placed on the dampening;<br/>
            Generally, 0 &#60; <strong>damp_lb</strong> &#60; <strong>damp</strong>. For the various modes
            of <strong>adamp</strong> > 0, <strong>damp_lb</strong> serves the following purposes:<br/>
            • <strong>adamp</strong> = 1: In the adaptive damping algorithm, <strong>damp_lb</strong> represents the
            lower limit to which θ, under adverse adaptive damping conditions, will be allowed to fall.<br/>
            • <strong>adamp</strong> = 2: In the enhanced damping algorithm, <strong>damp_lb</strong> is the starting
            value (or a component of the starting value) for the damping parameter θ used in the initial Picard
            iteration of every stress period.<br/>
            (default is 0.001)</div>,
        rate_d: <div>is a rate parameter; generally, 0 &#60; <strong>rate_d</strong> &#60; 1.<br/>
            For the various modes of <strong>adamp</strong> > 0, <strong>rate_d</strong> serves the following
            purposes:<br/>
            • <strong>adamp</strong> = 1: <strong>rate_d</strong> sets the recovery rate for the damping factor θ in
            response to the progress in the Picard iteration; it also forms a limit on the response function to progress
            in the Picard iteration. See algorithm 1 for usage when <strong>adamp</strong> = 1; in this
            algorithm, <strong>rate_d</strong> = ψ. Typical values for <strong>rate_d</strong>, under this scenario, are
            0.01 &#60; <strong>rate_d</strong> &#60; 0.1. Under adaptive damping, if the user finds that the damping
            factor θ increases too rapidly, then reducing <strong>rate_d</strong> will slow the rate of increase.<br/>
            • <strong>adamp</strong> = 2: Provided the Picard iteration is progressing
            satisfactorily, <strong>rate_d</strong> adjusts the damping factor θ upward such that θj =
            θj−1+ <strong>rate_d</strong> θj−1, where j is the Picard iteration number. Typical values
            for <strong>rate_d</strong>, under this scenario, are 0.01 &#60; <strong>rate_d</strong> &#60; 0.1, although
            larger or smaller values may be used.<br/>
            (default is 0.1)</div>,
        chglimit: <div>this variable limits the maximum head change applicable to the updated hydraulic heads in a
            Picard iteration. If <strong>chglimit</strong> = 0.0, then adaptive damping proceeds without this
            feature.<br/>(default is 0.)</div>,
        acnvg: <div>defines the mode of convergence applied to the PCG solver.
            In general, the relative stopping criterion for PCG iteration is νi &#60; εν0, where ν0 is the weighted
            residual norm on entry to the PCG solver, ε is the relative convergence parameter, and νi is the same norm
            at PCG iteration i. The available convergence modes are:<br/>
            • <strong>acnvg</strong> = 0: The standard convergence scheme is employed using the variant of the conjugate
            gradient method outlined in algorithm 3. The standard relative convergence is denoted by εs and usually
            takes the value 0.1; this value is assigned to the relative convergence ε. No additional variables are used.<br/>
            • <strong>acnvg</strong> = 1: Adaptive convergence is employed using the variant of the conjugate gradient
            method outlined in algorithm 2. The adaptive convergence scheme adjusts the relative convergence ε of the
            PCG iteration based on a measure of the nonlinearity of the problem. Under this scheme, ε is allowed to vary
            such that CNVG_LB &#60; ε &#60; εs, where the exact value of ε is dependent on the measure of nonlinearity.
            This option requires a valid value for variable <strong>cnvg_lb</strong>.<br/>
            • <strong>acnvg</strong> = 2: Enhanced convergence is employed using variant of the conjugate gradient
            method outlined in algorithm 3. If the variable enhancement option is employed (<strong>rate_c</strong> >
            0), then εs is taken as the upper limit for ε; see <em>Limiting the Inner Iteration</em> subsection for
            details. This option requires valid values for variables <strong>mcnvg</strong> and <strong>rate_c</strong>.<br/>
            (default is 0)</div>,
        cnvg_lb: <div>is the minimum value that the relative convergence is allowed to take under the self-adjusting
            convergence option. <strong>cnvg_lb</strong> is used only in convergence mode <strong>acnvg</strong> = 1.
            (default is 0.001)</div>,
        mcnvg: <div>increases the relative PCG convergence criteria by a power equal
            to <strong>mcnvg</strong>. <strong>mcnvg</strong> is used only in convergence mode <strong>acnvg</strong> =
            2. (default is 2)</div>,
        rate_c: <div>this option results in variable enhancement of epsilon.<br/>
            If 0 &#60; <strong>rate_c</strong> &#60; 1, then enhanced relative convergence is allowed to decrease by
            increasing epsilon(<sub>j</sub>) = epsilon(<sub>j-1</sub>) + <strong>rate_c</strong> epsilon(<sub>j-1</sub>),
            where j is the Picard iteration number; this change in epsilon occurs so long as the Picard iteration is
            progressing satisfactorily.<br/>
            If <strong>rate_c</strong> &#60;= 0, then the value of epsilon set by <strong>mcnvg</strong> remains
            unchanged through the Picard iteration. It should be emphasized that <strong>rate_c</strong> must have a
            value greater than 0 for the variable enhancement to be effected; otherwise epsilon remains
            constant. <strong>rate_c</strong> is used only in convergence mode <strong>acnvg</strong> = 2. (default is
            -1.)</div>,
        ipunit: <div>enables progress reporting for the Picard iteration.<br/>
            If <strong>ipunit</strong> >= 0, then a record of progress made by the Picard iteration for each time step
            is printed in the MODFLOW Listing file (Harbaugh and others, 2000). This record consists of the total number
            of dry cells at the end of each time step as well as the total number of PCG iterations necessary to obtain
            convergence. In addition, if <strong>ipunit</strong> > 0, then extensive diagnostics for each Picard
            iteration is also written in comma-separated format to a file whose unit number corresponds
            to <strong>ipunit</strong>; the name for this file, along with its unit number and type ‘data’ should be
            entered in the modflow Name file. If <strong>ipunit</strong> &#60; 0 then printing of all progress
            concerning the Picard iteration is suppressed, as well as information on the nature of the convergence of
            the Picard iteration. (default is 0)</div>,
        extension: <div>Filename extension (default is ‘pcgn’)</div>,
        unitnumber: <div>File unit number (default is None).</div>,
        filenames: <div>Filenames to use for the package and the output files. If <strong>filenames</strong>=None the
            package name will be created using the model name and package extension and the PCGN output names will be
            created using the model name and .pcgni, .pcgnt, and .pcgno extensions. If a single string is passed the
            package will be set to the string and PCGN output names will be created using the model name and PCGN output
            extensions. To define the names for all package files (input and output) the length of the list of strings
            should be 4. Default is None.</div>,
    },

    // SIP
    sip: {
        mxiter: <div>The maximum number of times through the iteration loop in one time step in an attempt to solve the
            system of finite-difference equations. (default is 200)</div>,
        nparm: <div>The number of iteration variables to be used. Five variables are generally sufficient. (default is
            5)</div>,
        accl: <div>The acceleration variable, which must be greater than zero and is generally equal to one. If a zero
            is entered, it is changed to one. (default is 1)</div>,
        hclose: <div>The head change criterion for convergence. When the maximum absolute value of head change from all
            nodes during an iteration is less than or equal to <strong>hclose</strong>, iteration stops. (default is
            1e-5)</div>,
        ipcalc: <div>A flag indicating where the seed for calculating iteration variables will come from.<br/>
            0 is the seed entered by the user will be used.<br/>
            1 is the seed will be calculated at the start of the simulation from problem variables. (default is 0)
        </div>,
        wseed: <div>The seed for calculating iteration variables. <strong>wseed</strong> is always read, but is used
            only if <strong>ipcalc</strong> is equal to zero. (default is 0)</div>,
        iprsip: <div>if equal to zero, is changed to 999. The maximum head change (positive or negative) is printed for
            each iteration of a time step whenever the time step is an even multiple of <strong>iprsip</strong>. This
            printout also occurs at the end of each stress period regardless of the value of <strong>iprsip</strong>.
            (default is 0)</div>
    },

    // SMS
    sms: {
        options: <div>An optional keyword setting that activates solver options:<br/>
            • SIMPLE indicates that default solver input values will be defined that work well for nearly linear models.
            This would be used for models that do not include nonlinear stress packages (e.g. UZF, SFR) and models that
            are either confined or consist of a single unconfined layer that is thick enough to contain the water table
            within a single layer.<br/>
            • MODERATE indicates that default solver input values will be defined that work well for moderately
            nonlinear models. This would be used for models that include nonlinear stress packages and models that
            consist of one or more unconfined layers. The “MODERATE” option should be used when the “SIMPLE” option does
            not result in successful convergence.<br/>
            • COMPLEX indicates that default solver input values will be defined that work well for highly nonlinear
            models. This would be used for models that include nonlinear stress packages and models that consist of one
            or more unconfined layers representing complex geology and sw/gw interaction. The “COMPLEX” option should be
            used when the “MODERATE” option does not result in successful convergence.<br/>
            • CUSTOM indicates that no keyword will be included and the full list of applicable settings will be
            translated into the SMS package.</div>,
        hclose: <div>is the head change criterion for convergence of the outer (nonlinear) iterations, in units of
            length. When the maximum absolute value of the head change at all nodes during an iteration is less than or
            equal to <strong>hclose</strong>, iteration stops. Commonly, <strong>hclose</strong> equals 0.01.</div>,
        hiclose: <div>is the head change criterion for convergence of the inner (linear) iterations, in units of length.
            When the maximum absolute value of the head change at all nodes during an iteration is less than or equal
            to <strong>hiclose</strong>, the matrix solver assumes convergence. Commonly, <strong>hiclose</strong> is
            set an order of magnitude less than <strong>hclose</strong>.</div>,
        mxiter: <div>is the maximum number of outer (nonlinear) iterations – that is, calls to the solution routine. For
            a linear problem <strong>mxiter</strong> should be 1.</div>,
        iter1: <div>is the maximum number of inner (linear) iterations. The number typically depends on the
            characteristics of the matrix solution scheme being used. For nonlinear
            problems, <strong>iter1</strong> usually ranges from 60 to 600; a value of 100 will be sufficient for most
            linear problems.</div>,
        iprsms: <div>is a flag that controls printing of convergence information from the solver:<br/>
            • 0 is print nothing;<br/>
            • 1 is print only the total number of iterations and nonlinear residual reduction summaries;<br/>
            • 2 is print matrix solver information in addition to above.</div>,
        nonlinmeth: <div>is a flag that controls the nonlinear solution method and under- relaxation schemes.<br/>
            • 0 is Picard iteration scheme is used without any under-relaxation schemes involved.<br/>
            • &#62; 0 is Newton-Raphson iteration scheme is used with under-relaxation. Note that the Newton-Raphson
            linearization scheme is available only for the upstream weighted solution scheme of the BCF and LPF
            packages. <br/>
            • &#60; 0 is Picard iteration scheme is used with under-relaxation. The absolute value
            of <strong>nonlinmeth</strong> determines the underrelaxation scheme used.<br/>
            • 1 or -1, then Delta-Bar-Delta under-relaxation is used.<br/>
            • 2 or -2 then Cooley under-relaxation scheme is used. Note that the under-relaxation schemes are used in
            conjunction with gradient based methods, however, experience has indicated that the Cooley under-relaxation
            and damping work well also for the Picard scheme with the wet/dry options of MODFLOW.</div>,
        linmeth: <div>is a flag that controls the matrix solution method.<br/>
            • (1) use Ibaraki chi-MD matrix solver: an asymmetric matrix solver called ᵪMD (chi-MD) (Ibaraki,
            2005),<br/>
            • (2) use White-Hughes matrix solver: an unstructured preconditioned conjugate gradient (PCGU) solver
            developed by White and Hughes (2011) for symmetric equations,<br/>
            • (3) use SAMG matrix solver: the advanced/proprietary SAMG solver developed at the Frauenhofer Institute.
        </div>,
        theta: <div>is the reduction factor for the learning rate (under-relaxation term) of the delta-bar-delta
            algorithm. The value of <strong>theta</strong> is between zero and one. If the change in the variable (head)
            is of opposite sign to that of the previous iteration, the under-relaxation term is reduced by a factor
            of <strong>theta</strong>. The value usually ranges from 0.3 to 0.9; a value of 0.7 works well for most
            problems.</div>,
        akappa: <div>is the increment for the learning rate (under-relaxation term) of the delta-bar-delta algorithm.
            The value of <strong>akappa</strong> is between zero and one. If the change in the variable (head) is of the
            same sign to that of the previous iteration, the under-relaxation term is increased by an increment
            of <strong>akappa</strong>. The value usually ranges from 0.03 to 0.3; a value of 0.1 works well for most
            problems.</div>,
        gamma: <div>is the history or memory term factor of the delta-bar-delta algorithm. Gamma is between zero and 1
            but cannot be equal to one. When <strong>gamma</strong> is zero, only the most recent history (previous
            iteration value) is maintained. As <strong>gamma</strong> is increased, past history of iteration changes
            has greater influence on the memory term. The memory term is maintained as an exponential average of past
            changes. Retaining some past history can overcome granular behavior in the calculated function surface and
            therefore helps to overcome cyclic patterns of non-convergence. The value usually ranges from 0.1 to 0.3; a
            value of 0.2 works well for most problems.</div>,
        amomentum: <div>is the fraction of past history changes that is added as a momentum term to the step change for
            a nonlinear iteration. The value of <strong>amomentum</strong> is between zero and one. A large momentum
            term should only be used when small learning rates are expected. Small amounts of the momentum term help
            convergence. The value usually ranges from 0.0001 to 0.1; a value of 0.001 works well for most problems.
        </div>,
        numtrack: <div>is the maximum number of backtracking iterations allowed for residual reduction computations.
            If <strong>numtrack</strong> = 0 then the backtracking iterations are omitted. The value usually ranges from
            2 to 20; a value of 10 works well for most problems.</div>,
        btol: <div>is the tolerance for residual change that is allowed for residual reduction
            computations. <strong>btol</strong> should not be less than one to avoid getting stuck in local minima. A
            large value serves to check for extreme residual increases, while a low value serves to control step size
            more severely. The value usually ranges from 1.0 to 1e6 ; a value of 1e4 works well for most problems but
            lower values like 1.1 may be required for harder problems.</div>,
        breduc: <div>is the reduction in step size used for residual reduction computations. The value
            of <strong>breduc</strong> is between zero and one. The value usually ranges from 0.1 to 0.3; a value of 0.2
            works well for most problems.</div>,
        reslim: <div>is the limit to which the residual is reduced with backtracking. If the residual is smaller
            than <strong>reslim</strong>, then further backtracking is not performed. A value of 100 is suitable for
            large problems and residual reduction to smaller values may only slow down computations.</div>,
        iacl: <div>is the flag for choosing the acceleration method.<br/>
            • (0) is Conjugate Gradient; select this option if the matrix is symmetric.<br/>
            • (1) is ORTHOMIN.<br/>
            • (2) is BiCGSTAB.</div>,
        norder: <div>is the flag for choosing the ordering scheme.<br/>
            • (0) is original ordering<br/>
            • (1) is reverse Cuthill McKee ordering<br/>
            • (2) is Minimum degree ordering</div>,
        level: <div>is the level of fill for ILU decomposition. Higher levels of fill provide more robustness but also
            require more memory. For optimal performance, it is suggested that a large level of fill be applied (7 or 8)
            with use of drop tolerance.</div>,
        north: <div>is the number of orthogonalizations for the ORTHOMIN acceleration scheme. A number between 4 and 10
            is appropriate. Small values require less storage but more iteration may be required. This number should
            equal 2 for the other acceleration methods.</div>,
        iredsys: <div>is the index for creating a reduced system of equations using the red-black ordering scheme. 0 is
            do not create reduced system 1 is create reduced system using red-black ordering</div>,
        rrctol: <div>is a residual tolerance criterion for convergence. The root mean squared residual of the matrix
            solution is evaluated against this number to determine convergence. The solver assumes convergence if
            either <strong>hiclose</strong> (the absolute head tolerance value for the solver)
            or <strong>rrctol</strong> is achieved. Note that a value of zero ignores residual tolerance in favor of the
            absolute tolerance (<strong>hiclose</strong>) for closure of the matrix solver.</div>,
        idroptol: <div>is the flag to perform drop tolerance. 0 is do not perform drop tolerance 1 is perform drop
            tolerance.</div>,
        epsrn: <div>is the drop tolerance value. A value of 10<sup>-3</sup> works well for most problems.</div>,
        clin: <div>is an option keyword that defines the linear acceleration method used by the PCGU
            solver. <strong>clin</strong> is “CG”, then preconditioned conjugate gradient
            method. <strong>clin</strong> is “BCGS”, then preconditioned bi-conjugate gradient stabilized method.</div>,
        ipc: <div>is an integer value that defines the preconditioner.<br/>
            • <strong>ipc</strong> = 0, No preconditioning.<br/>
            • <strong>ipc</strong> = 1, Jacobi preconditioning.<br/>
            • <strong>ipc</strong> = 2, ILU(0) preconditioning.<br/>
            • <strong>ipc</strong> = 3, MILU(0) preconditioning (default).</div>,
        iscl: <div>is the flag for choosing the matrix scaling approach used.<br/>
            • (0) is no matrix scaling applied <br/>
            • (1) is symmetric matrix scaling using the scaling method by the POLCG preconditioner in Hill (1992). <br/>
            • (2) is symmetric matrix scaling using the l2 norm of each row of A (DR) and the l2 norm of each row of
            DRA.</div>,
        iord: <div>is the flag for choosing the matrix reordering approach used.<br/>
            • 0 = original ordering<br/>
            • 1 = reverse Cuthill McKee ordering<br/>
            • 2 = minimum degree ordering</div>,
        rclosepcgu: <div>is a real value that defines the flow residual tolerance for convergence of the PCGU linear
            solver. This value represents the maximum allowable residual at any single node. Value is in units of length
            cubed per time, and must be consistent with MODFLOW-USG length and time units. Usually a value of 1.0x10-1
            is sufficient for the flow-residual criteria when meters and seconds are the defined MODFLOW-USG length and
            time.</div>,
        relaxpcgu: <div>is a real value that defines the relaxation factor used by the MILU(0)
            preconditioner. <strong>relaxpcgu</strong> is unitless and should be greater than or equal to 0.0 and less
            than or equal to 1.0. <strong>relaxpcgu</strong> values of about 1.0 are commonly used, and experience
            suggests that convergence can be optimized in some cases with <strong>relaxpcgu</strong> values of 0.97.
            A <strong>relaxpcgu</strong> value of 0.0 will result in ILU(0)
            preconditioning. <strong>relaxpcgu</strong> is only specified if <strong>ipc</strong>=3.
            If <strong>relaxpcgu</strong> is not specified and <strong>ipc</strong>=3, then a default value of 0.97 will
            be assigned to <strong>relaxpcgu</strong>.</div>,
        extension: <div>TODO!</div>,
        unitnumber: <div>TODO!</div>,
        filenames: <div>TODO!</div>
    },

    // SOR
    sor: {
        mxiter: <div>is the maximum number of iterations allowed in a time step.</div>,
        accl: <div>is the acceleration variable, usually between 1.0 and 2.0.</div>,
        hclose: <div>is the head change criterion for convergence. When the maximum absolute value of head change from
            all nodes during an iteration is less than or equal to <strong>hclose</strong>, iteration stops.</div>,
        iprsor: <div>is the printout interval for SOR. IF <strong>iprsor</strong> is equal to zero, it is changed to
            999. The maximum head change (positive or negative) is printed for each iteration of a time step whenever
            the time step is an even multiple of <strong>iprsor</strong>. This printout also occurs at the end of each
            stress period regardless of the value of <strong>iprsor</strong>.</div>,
        extension: <div>Filename extension (default is ‘sor’)</div>,
        unitnumber: <div>File unit number (default is None).</div>,
        filenames: <div>Filenames to use for the package. If filenames=None the package name will be created using the
            model name and package extension. If a single string is passed the package will be set to the string.
            Default is None.</div>,
    }
};
