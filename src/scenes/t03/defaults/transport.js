import React from 'react';

export const documentation = {
    // ADV
    mixelm: <div>Integer flag for the advection solution option.
        <ul>
            <li><i>MIXELM</i> = 0 standard finite difference method with upstream
                or central-in-space weighting, depending on the value
                of NADVFD
            </li>
            <li><i>MIXELM</i> = 1 Forward-tracking method of characteristics (MOC)</li>
            <li><i>MIXELM</i> = 2 Backward-tracking modified method of characteristics (MMOC)</li>
            <li><i>MIXELM</i> = 3 Hybrid method of characteristics (HMOC) with MOC or MMOC automatically and
                dynamically selected.
            </li>
            <li><i>MIXELM</i> = -1 third-order TVD scheme (ULTIMATE)</li>
        </ul>
    </div>,
    percel: <div>Courant number, i.e., the number of cells (or a fraction of a cell) advection will be allowed in any
        direction in one transport step.<br/>For implicit finite-difference or particle tracking based schemes, there is
        no limit on PERCEL, but for accuracy reasons, it is generally not set much greater than one. Note, however,
        that the PERCEL limit is checked over the entire model grid. Thus, even if PERCEL > 1, advection may not be more
        than one cell’s length at most model locations.<br/><br/>For the explicit finite-difference or the third-order
        TVD scheme, PERCEL is also a stability constraint, which must not exceed one and will be automatically reset to
        one if a value greater than one is specified.</div>,
    nadvfd: <div>is an integer flag indicating which weighting scheme should be used. It is needed only when the
        advection term is solved using the implicit finite-difference method.
        <ul>
            <li><i>NADVFD</i> = 0 or 1 Upstream weighting (default)</li>
            <li><i>NADVFD</i> = 2 Central-in-space weighting</li>
        </ul>
    </div>,
    mxpart: <div>Maximum total number of moving particles allowed, and is used only when MIXELM = 1 or 3.</div>,
    itrack: <div>Flag indicating which particle tracking algorithm is selected for the Eulerian-Lagrangian methods.
        <ul>
            <li><i>ITRACK</i> = 1 First-order Euler algorithm is used.</li>
            <li><i>ITRACK</i> = 2 Fourth-order Runge-Kutta algorithm is used. This option is computationally demanding
                and may be needed only when PERCEL is set greater than one.
            </li>
            <li><i>ITRACK</i> = 3 Hybrid 1st and 4th order algorithm is used. The Runge-Kutta algorithm is used in
                sink/source cells and the cells next to sinks/sources while the Euler algorithm is used elsewhere.
            </li>
        </ul>
    </div>,
    wd: <div>Concentration weighting factor between 0.5 and 1. It is used for operator splitting in the particle
        tracking based methods. The value of 0.5 is generally adequate. The value of WD may be adjusted to achieve
        better mass balance. Generally, it can be increased toward 1.0 as advection becomes more dominant.</div>,
    dceps: <div>Small Relative Cell Concentration Gradient below which advective transport is considered negligible.
        A value around 10^-5 is generally adequate.</div>,
    nplane: <div>Flag indicating whether the random or fixed pattern is selected for initial placement of moving
        particles.
        <ul>
            <li><i>NPLANE</i> = 0 Random pattern is selected for initial placement. Particles are distributed randomly
                in both the horizontal and vertical directions by calling a random number generator. This option is
                usually preferred and leads to smaller mass balance discrepancy in nonuniform or diverging/converging
                flow fields.
            </li>
            <li><i>NPLANE</i> > 0 Fixed pattern is selected for initial placement. The value of NPLANE serves as the
                number of vertical “planes” on which initial particles are placed within each cell block. The fixed
                pattern may work better than the random pattern only in relatively uniform flow fields. For two
                dimensional simulations in plan view, set NPLANE = 1. For cross sectional or three-dimensional
                simulations, NPLANE = 2 is normally adequate. Increase NPLANE if more resolution in the vertical
                direction is desired.
            </li>
        </ul>
    </div>,
    npl: <div>Number of initial particles per cell to be placed at cells where the Relative Cell Concentration Gradient
        is less than or equal to DCEPS. Generally, NPL can be set to zero since advection is considered insignificant
        when the Relative Cell Concentration Gradient is less than or equal to DCEPS. Setting NPL equal to NPH causes a
        uniform number of particles to be placed in every cell over the entire grid (i.e., the uniform approach).</div>,
    nph: <div>Number of initial particles per cell to be placed at cells where the Relative Cell Concentration Gradient
        is greater than DCEPS. The selection of NPH depends on the nature of the flow field and also the computer memory
        limitation. Generally, use a smaller number in relatively uniform flow fields and a larger number in relatively
        nonuniform flow fields. However, values exceeding 16 in twodimensional simulation or 32 in three-dimensional
        simulation are rarely necessary. If the random pattern is chosen, NPH particles are randomly distributed within
        the cell block. If the fixed pattern is chosen, NPH is divided by NPLANE to yield the number of particles to be
        placed per vertical plane.</div>,
    npmin: <div>Minimum number of particles allowed per cell. If the number of particles in a cell at the end of a
        transport step is fewer than NPMIN, new particles are inserted into that cell to maintain a sufficient number of
        particles. NPMIN can be set to zero in relatively uniform flow fields, and a number greater than zero in
        diverging/converging flow fields. Generally, a value between zero and four is adequate. </div>,
    npmax: <div>Maximum number of particles allowed per cell. If the number of particles in a cell exceeds NPMAX, all
        particles are removed from that cell and replaced by a new set of particles equal to NPH to maintain mass
        balance. Generally, NPMAX can be set to approximately twice of NPH.</div>,
    nlsink: <div>Flag indicating whether the random or fixed pattern is selected for initial placement of particles to
        approximate sink cells in the MMOC scheme. The convention is the same as that for NPLANE. It is generally
        adequate to set NLSINK equivalent to NPLANE.</div>,
    npsink: <div>Number of particles used to approximate sink cells in the MMOC scheme. The convention is the same as
        that for NPH. It is generally adequate to set NPSINK equivalent to NPH.</div>,
    dchmoc: <div>Critical Relative Concentration Gradient for controlling the selective use of either MOC or MMOC in the
        HMOC solution scheme.<br/>The MOC solution is selected at cells where the Relative Concentration Gradient is
        greater than DCHMOC.<br/>The MMOC solution is selected at cells where the Relative Concentration Gradient is
        less than or equal to DCHMOC.</div>,

    // BTN
    btn: {
        ncomp: <div>Total number of chemical species included in the current simulation. For single-species simulation,
            set <i>NCOMP</i> = 1.</div>,
        mcomp: <div>Total number of “mobile” species, must be equal to or less than NCOMP. For single-species
            simulation, set <i>MCOMP</i> = 1.</div>,
        prsity: <div>“Effective” porosity of the porous medium in a single porosity system. Note that if a dual porosity
            system is simulated, <i>PRSITY</i> should be specified as the “mobile” porosity, i.e., the ratio of
            interconnected pore
            spaces filled with mobile waters over the bulk volume of the porous medium.</div>,
        icbund: <div>Boundary condition type shared by all species.
            <ul>
                <li><i>ICBUND</i> = 0 inactive concentration cell for all species</li>
                <li><i>ICBUND</i> {'<'} 0 constant concentration cell for all species</li>
                <li><i>ICBUND</i> {'>'} 0 active (variable) concentration cell where the concentration will be calculated
                </li>
            </ul>
        </div>,
        sconc: <div>Starting concentration (initial condition) at the beginning of the simulation (unit: ML-3).</div>,
        cinact: <div>Value for indicating an inactive concentration cell (<i>ICBUND</i> = 0). Even if it is not
            anticipated to have inactive cells in the model, a value for <i>CINACT</i> still must be submitted.</div>,
        thkmin: <div>Minimum saturated thickness in a cell, expressed as the decimal fraction of the model layer
            thickness, below which the cell is considered inactive. The default value is 0.01 (i.e., 1% of the model
            layer thickness).</div>,
        ifmtcn: <div>Flag indicating whether the calculated concentration should be printed to the standard output text
            file and also serves as a printing-format code if it is printed <ul>
                <li><i>IFMTCN</i> {'>'} 0 concentration is printed in the wrap form</li>
                <li><i>IFMTCN</i> {'<'} 0 concentration is printed in the strip form</li>
                <li><i>IFMTCN</i> = 0 concentration is not printed</li>
            </ul></div>,
        ifmtnp: <div>Flag indicating whether the number of particles in each cell (integers) should be printed and also
            serves as a printing-format code if they are printed. The convention is the same as that used for <i>IFMTCN</i>.
        </div>,
        ifmtrf: <div>Flag indicating whether the model-calculated retardation factor should be printed and also serves
            as a printing-format code if it is printed. The convention is the same as that used for <i>IFMTCN</i>.</div>,
        ifmtdp: <div>Flag indicating whether the model-calculated, distance weighted dispersion coefficient should be
            printed and also serves as a printing-format code if it is printed. The convention is the same as that
            used for <i>IFMTCN</i>.</div>,
        nprs: <div>Flag indicating the frequency of the output, and also indicating whether the output frequency is
            specified in terms of total elapsed simulation time or the transport step number. Note that what are
            actually printed or saved is controlled by the input values entered in the preceding record. <ul>
                <li><i>NPRS</i> {'>'} 0 simulation results will be printed to the standard output text file</li>
                <li><i>NPRS</i> {'<'} 0 simulation results will be printed or saved whenever the number of transport
                    steps is an even multiple of NPRS
                </li>
                <li><i>NPRS</i> = 0 simulation results will not be printed or saved except at the end of simulation</li>
            </ul></div>,
        nprobs: <div>Integer indicating how frequently the concentration at the specified observation points should be
            saved in the observation file. Concentrations are saved every NPROBS step.</div>,
        nprmas: <div>Integer indicating how frequently the mass budget information should be saved in the mass balance
            summary file. Mass budget information is saved every NPRMAS step.</div>,
        dt0: <div>Transport stepsize within each time step of the flow solution. DT0 is interpreted differently
            depending on whether the solution option chosen is explicit or implicit:
            <ul>
                <li>For explicit solutions (i.e., the GCG solver
                    is not used), the program will always calculate a maximum transport stepsize which meets the various
                    stability criteria. Setting DT0 to zero causes the model calculated transport stepsize to be used in
                    the simulation. However, the model-calculated DT0 may not always be optimal. In this situation, DT0
                    should be adjusted to find a value that leads to the best results. If DT0 is given a value greater
                    than the model-calculated stepsize, the model-calculated stepsize, instead of the user-specified
                    value, will be used in the simulation.
                </li>
                <li>For implicit solutions (i.e., the GCG solver is used), DT0 is the initial
                    transport stepsize. If it is specified as zero, the model-calculated value of DT0, based on the
                    user-specified Courant number in the Advection Package, will be used. The subsequent transport
                    stepsize may increase or remain constant depending on the user specified transport stepsize
                    multiplier TTSMULT and the solution scheme for the advection term.
                </li>
            </ul>
        </div>,
        mxstrn: <div>Maximum number of transport steps allowed within one time step of the flow solution. If the number
            of transport steps within a flow time step exceeds MXSTRN, the simulation is terminated. </div>,
        ttsmult: <div>Multiplier for successive transport steps within a flow time step, if the Generalized Conjugate
            Gradient (GCG) solver is used and the solution option for the advection term is the standard finite
            difference method. A value between 1.0 and 2.0 is generally adequate. If the GCG package is not used, the
            transport solution is solved explicitly as in the original MT3D code, and TTSMULT is always set to 1.0
            regardless of the user-specified input. Note that for the particle tracking based solution options and the
            3rd-order TVD scheme, TTSMULT does not apply.</div>,
        ttsmax: <div>Maximum transport stepsize allowed when transport stepsize multiplier TTSMULT > 1.0. Setting
            TTSMAX = 0 imposes no maximum limit.</div>
    },

    // DSP
    al: <div>Longitudinal dispersivity for every cell of the model grid (unit: L).</div>,
    trpt: <div>1D real array defining the ratio of the horizontal transverse dispersivity to the longitudinal
        dispersivity. Each value in the array corresponds to one model layer. Some recent field studies suggest
        that TRPT is generally not greater than 0.1.</div>,
    trpv: <div>Ratio of the vertical transverse dispersivity to the longitudinal dispersivity. Each value
        in the array corresponds to one model layer. Some recent field studies suggest that TRPT is generally not
        greater than 0.01. Set TRPV equal to TRPT to use the standard isotropic dispersion model. Otherwise, the
        modified isotropic dispersion model is used.</div>,
    dmcoef: <div>Effective molecular diffusion coefficient (unit: L^2T^-1). Set DMCOEF = 0 if the effect of molecular
        diffusion is considered unimportant. Each value in the array corresponds to one model layer.</div>,
    // GCG
    mxiter: <div>Maximum number of outer iterations. It should be set to an integer greater than one only when a
        nonlinear sorption isotherm is included in simulation.</div>,
    iter1: <div>Maximum number of inner iterations. A value of 30 - 50 should be adequate for most problems.</div>,
    isolve: <div>Type of preconditioners to be used with the Lanczos/ORTHOMIN acceleration scheme.
        <ul>
            <li><i>ISOLVE</i> = 1 Jacobi</li>
            <li><i>ISOLVE</i> = 2 SSOR</li>
            <li><i>ISOLVE</i> = 3 Modified Incomplete Cholesky (MIC usually converges faster, but it needs significantly
                more memory)
            </li>
        </ul>
    </div>,
    ncrs: <div>Integer flag for treatment of dispersion tensor cross terms.
        <ul>
            <li><i>NCRS</i> = 0 Lump all dispersion cross terms to the right-hand-side (approximate but highly
                efficient).
            </li>
            <li><i>NCRS</i> = 1 Include full dispersion tensor (memory intensive).</li>
        </ul>
    </div>,
    accl: <div>Relaxation factor for the SSOR option. A value of 1.0 is generally adequate.</div>,
    cclose: <div>Convergence criterion in terms of relative concentration. A real value between 10^-4 and 10^-6 is
        generally adequate.</div>,
    iprgcg: <div>Interval for printing the maximum concentration changes of each iteration. Set IPRGCG to 0 as default
        for printing at the end of each stress period.</div>,
    // RCT
    isothm: <div>A flag indicating which type of sorption (or dual-domain mass transfer) is simulated: isothm = 0, no
        sorption is simulated; isothm = 1, linear isotherm (equilibrium-controlled); isothm = 2, Freundlich isotherm
        (equilibrium-controlled); isothm = 3, Langmuir isotherm (equilibrium-controlled); isothm = 4, first-order
        kinetic sorption (nonequilibrium); isothm = 5, dual-domain mass transfer (without sorption); isothm = 6,
        dual-domain mass transfer (with sorption). (default is 0).</div>,
    ireact: <div>A flag indicating which type of kinetic rate reaction is simulated: ireact = 0, no kinetic rate
        reaction is simulated; ireact = 1, first-order irreversible reaction, ireact = 100, zero-order reactions (decay
        or production). Note that this reaction package is not intended for modeling chemical reactions between species.
        An add-on reaction package developed specifically for that purpose may be used. (default is 0).</div>,
    igetsc: <div>An integer flag indicating whether the initial concentration for the nonequilibrium sorbed or immobile
        phase of all species should be read when nonequilibrium sorption (ISOTHM=4) or dual-domain mass transfer
        (ISOTHM=5 or 6) is simulated:
        <ul>
            <li>IGETSC=0, the initial concentration for the sorbed or immobile phase is not read. By default, the sorbed
                phase is assumed to be in equilibrium with the dissolved phase (ISOTHM=4), and the immobile domain is
                assumed to have zero concentration (ISOTHM=5 or 6).
            </li>
            <li>>0, the initial concentration for the sorbed phase or immobile liquid phase of all species will be
                read.
            </li>
        </ul>
    </div>,
    rhob: <div>Bulk density of the aquifer medium (unit, ML-3). rhob is used if isothm = 1, 2, 3, 4, or 6. If rhob is
        not user-specified and isothm is not 5 then rhob is set to 1.8e3. (default is None)</div>,
    prsity2: <div>Porosity of the immobile domain, i.e., the ratio of pore spaces filled with immobile fluids over the
        bulk volume of the aquifer medium, when the simulation is intended to represent a dual-domain system.</div>,
    srconc: <div>User-specified initial concentration for the sorbed phase of the first species if isothm = 4 (unit,
        MM-1). Note that for equilibrium-controlled sorption, the initial concentration for the sorbed phase cannot be
        specified. srconc is the user-specified initial concentration of the first species for the immobile liquid phase
        if isothm = 5 or 6 (unit, ML-3). If srconc is not user-specified and isothm = 4, 5, or 6 then srconc is set to
        0. (default is None).</div>,
    sp1: <div>SP1 is the first sorption parameter. The use of SP1 depends on the type
        of sorption selected (i.e., the value of ISOTHM): <ul>
            <li>For linear sorption (ISOTHM=1) and nonequilibrium sorption (ISOTHM=4), SP1 is the distribution
                coefficient (Kd) (unit: L3 M-1).
            </li>
            <li>For Freundlich sorption (ISOTHM=2), SP1 is the Freundlich equilibrium constant (Kf) (the unit depends on
                the Freundlich exponent a).
            </li>
            <li>For Langmuir sorption (ISOTHM=3), SP1 is the Langmuir equilibrium constant (Kl) (unit: L3 M-1 ).
            </li>
            <li>For dual-domain mass transfer without sorption (ISOTHM=5), SP1 is not used, but still must be entered.
            </li>
            <li>For dual-domain mass transfer with sorption (ISOTHM=6), SP1 is also the distribution coefficient (Kd)
                (unit: L3 M-1).
            </li>
        </ul></div>,
    sp2: <div>SP2 is the second sorption or dual-domain model parameter. The use of SP2 depends on the type of sorption
        or dual-domain model selected:
        <ul>
            <li>For linear sorption (ISOTHM=1), SP2 is read but not used.</li>
            <li>For Freundlich sorption (ISOTHM=2), SP2 is the Freundlich exponent a.</li>
            <li>For Langmuir sorption (ISOTHM=3), SP2 is the total concentration of the sorption sites available ( S )
                (unit: MM-1).
            </li>
            <li>For nonequilibrium sorption (ISOTHM=4), SP2 is the first-order mass transfer rate between the dissolved
                and sorbed phases (unit: T-1).
            </li>
            <li>For dual-domain mass transfer (ISOTHM=5 or 6), SP2 is the first-order mass transfer rate between the two
                domains (unit: T-1).
            </li>
        </ul></div>,
    rc1: <div>First-order reaction rate for the dissolved (liquid) phase (unit: T-1). If a dual-domain system is
        simulated, the reaction rates for the liquid phase in the mobile and immobile domains are assumed to be
        equal.</div>,
    rc2: <div>First-order reaction rate for the sorbed phase (unit: T-1). If a dual-domain system is simulated, the
        reaction rates for the sorbed phase in the mobile and immobile domains are assumed to be equal. Generally, if
        the reaction is radioactive decay, RC2 should be set equal to RC1, while for biodegradation, RC2 may be
        different from RC1. Note that RC2 is read but not used, if no sorption is included in the simulation.</div>
};
