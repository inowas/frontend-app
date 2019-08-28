import React from 'react';

export const documentation = {
    exe_name: <div>The name of the executable to use (the default is ‘mp7’).</div>,
    extension: <div>Filename extension</div>,
    model: <div>The model object (of type flopy.modflow.Modflow) to which this package will be added.</div>,
    modelname: <div>Basename for MODPATH 7 input and output files (default is ‘modpath7test’).</div>,
    namefile_ext: <div>Filename extension of the MODPATH 7 namefile (default is ‘mpnam’).</div>,
    simfile_ext: <div>Filename extension of the MODPATH 7 simulation file (default is ‘mpsim’).</div>,
    unitnumber: <div>File unit number (default is None).</div>,
    version: <div>String that defines the MODPATH version. Valid versions are ‘modpath7’ (default is ‘modpath7’).</div>,

    // BAS
    porosity: <div>The porosity array.</div>,

    // SIM
    budgetcellnumbers: (
        <div>Cell numbers (zero-based) for which detailed water budgets are computed. If
            budgetcellnumbers is None, detailed water budgets are not calculated (default is None).
        </div>
    ),
    budgetoutputoption: (
        <div>MODPATH 7 budget output option. Valid budget output options are ‘no’ - individual cell
        water balance errors are not computed and budget record headers are not printed, ‘summary’ - a summary of
        individual cell water balance errors for each time step is printed in the listing file without record headers,
        or ‘record_summary’ - a summary of individual cell water balance errors for each time step is printed in the
        listing file with record headers (default is ‘summary’).
        </div>
    ),
    endpointfilename: (
        <div>Filename of the MODPATH 7 endpoint file. If endpointfilename is not defined it will be
        generated from the model name (default is None).
        </div>
    ),
    listingfilename: (
        <div>Filename of the MODPATH 7 listing file. If listingfilename is not defined it will be generated
        from the model name (default is None).</div>
    ),
    mpnamefilename: (
        <div>Filename of the MODPATH 7 name file. If mpnamefilename is not defined it will be generated from
        the model name (default is None).</div>
    ),
    particlegroups: (
        <div>ParticleGroup or list of ParticlesGroups that contain data for individual particle groups. If
        None is specified, a particle in the center of node 0 will be created (default is None).</div>
    ),
    pathlinefilename: (
        <div>Filename of the MODPATH 7 pathline file. If pathlinefilename is not defined it will be
        generated from the model name (default is None).</div>
    ),
    referencetime: (
        <div>Specified reference time if a float or a list/tuple with a single float value is provided
        (reference time option 1). Otherwise a list or tuple with a zero-based stress period (int) and time step (int)
        and a float defining the relative time position in the time step is provided (reference time option 2). If
        referencetime is None, reference time is set to 0 (default is None).</div>
    ),
    retardation: (
        <div>Array of retardation factors that are only used if retardationfactoroption is ‘on’ (default is
        1).</div>
    ),
    retardationfactoroption: (
        <div>If retardationfactoroption is ‘off’, retardation array data are not read and a
        retardation factor of 1 is applied to all cells. If retardationfactoroption is ‘on’, retardation factor array
        data are read (default is ‘off’).</div>
    ),
    simulationtype: (
        <div>MODPATH 7 simulation type. Valid simulation types are ‘endpoint’, ‘pathline’, ‘timeseries’, or
        ‘combined’ (default is ‘pathline’).</div>
    ),
    stoptime: (
        <div>User-specified value of tracking time at which to stop a particle tracking simulation. Stop time is
        only used if the stop time option is ‘specified’. If stoptime is None amd the stop time option is ‘specified’
        particles will be terminated at the end of the last time step if ‘forward’ tracking or the beginning of the
        first time step if ‘backward’ tracking (default is None).</div>
    ),
    stoptimeoption: (
        <div>String indicating how a particle tracking simulation is terminated based on time. If stop time
        option is ‘total’, particles will be stopped at the end of the final time step if ‘forward’ tracking is
        simulated or at the beginning of the first time step if backward tracking. If stop time option is ‘extend’,
        initial or final steady-state time steps will be extended and all particles will be tracked until they reach a
        termination location. If stop time option is ‘specified’, particles will be tracked until they reach a
        termination location or the specified stop time is reached (default is ‘extend’).</div>
    ),
    stopzone: (
        <div>A zero-based specified integer zone value that indicates an automatic stopping location for particles
        and is only used if zonedataoption is ‘on’. A value of -1 indicates no automatic stop zone is used. Stopzone
        values less than -1 are not allowed. If stopzone is None, stopzone is set to -1 (default is None).</div>
    ),
    timepointdata: (
        <div>List or tuple with 2 items that is only used if simulationtype is ‘timeseries’ or ‘combined’. If
        the second item is a float then the timepoint data corresponds to time point option 1 and the first entry is the
        number of time points (timepointcount) and the second entry is the time point interval. If the second item is a
        list, tuple, or np.ndarray then the timepoint data corresponds to time point option 2 and the number of time
        points entries (timepointcount) in the second item and the second item is an list, tuple, or array of
        user-defined time points. If Timepointdata is None, time point option 1 is specified and the total simulation
        time is split into 100 intervals (default is None).</div>
    ),
    timeseriesfilename: (
        <div>Filename of the MODPATH 7 timeseries file. If timeseriesfilename is not defined it will be
        generated from the model name (default is None).</div>
    ),
    tracefilename: (
        <div>Filename of the MODPATH 7 tracefile file. If tracefilename is not defined it will be generated
        from the model name (default is None).</div>
    ),
    traceparticledata: (
        <div>List or tuple with two ints that define the particle group and particle id (zero-based) of
        the specified particle that is followed in detail. If traceparticledata is None, trace mode is off (default is
        None).</div>
    ),
    trackingdirection: (
        <div>MODPATH 7 tracking direction. Valid tracking directions are ‘forward’ or ‘backward’ (default
        os ‘forward’).</div>
    ),
    weaksinkoption: (
        <div>MODPATH 7 weak sink option. Valid weak sink options are ‘pass_through’ or ‘stop_at’ (default
        value is ‘stop_at’).</div>
    ),
    weaksourceoption: (
        <div>MODPATH 7 weak source option. Valid weak source options are ‘pass_through’ or ‘stop_at’
        (default value is ‘stop_at’).</div>
    ),
    zonedataoption: (
        <div>If zonedataoption is ‘off’, zone array data are not read and a zone value of 1 is applied to
        all cells. If zonedataoption is ‘on’, zone array data are read (default is ‘off’).</div>
    ),
    zones: (
        <div>Array of zero-based positive integer zones that are only used if zonedataoption is ‘on’ (default is
        0).</div>
    )

};
