const temperatureViscosityTable = () => ({
    temp: [-30, -20, -10, -5, 0, 5, 10, 15, 20, 25, 30, 35, 40],
    visc: [8661.1, 4362.7, 2645.2, 2153.5, 1792.3, 1518.7, 1306.4, 1138, 1002, 890.45, 797.68, 719.62, 653.25]
});

const calcTv = (V, t) => (t / V);

const calcMFIData = (V, mfi, a) => (mfi * V + a);

const preprocessData = (params) => {
    return params.map(param => ({...param, tV: calcTv(param.V, param.t)}));
};

const viscosityCorrection = (temperature, mfi) => {
    const table = temperatureViscosityTable();
    let visc = 0;
    for (let i = 1; i < table.temp.length; i += 1) {
        if (table.temp[i] > temperature && table.temp[i - 1] < temperature) {
            visc = table.visc[i - 1] + ((table.visc[i] - table.visc[i - 1]) * (temperature - table.temp[i - 1]) / (table.temp[i] - table.temp[i - 1]));
        }
        if (table.temp[i] === temperature) {
            visc = table.visc[i];
        }
    }
    return mfi * 1002 / visc;
};

export const calculateDiagramData = (data, MFI, a) => {
    return preprocessData(data).map(param => ({...param, mfi: calcMFIData(param.V, MFI, a)}));
};

export const calcMFI = (data) => {
    const preprocessedData = preprocessData(data);

    // first pass: read in data, compute xBar and yBar
    let sumX = 0.0;
    let sumY = 0.0;
    // eslint-disable-next-line no-unused-vars
    let sumX2 = 0.0;

    preprocessedData.forEach(param => {
        sumX += param.V;
        sumX2 += param.V * param.V;
        sumY += param.tV;
    });

    const xBar = sumX / preprocessedData.length;
    const yBar = sumY / preprocessedData.length;

    // second pass: compute summary statistics
    let xxbar = 0.0;
    // eslint-disable-next-line no-unused-vars
    let yybar = 0.0;
    let xybar = 0.0;

    preprocessedData.forEach(param => {
        xxbar += (param.V - xBar) * (param.V - xBar);
        yybar += (param.tV - yBar) * (param.tV - yBar);
        xybar += (param.V - xBar) * (param.tV - yBar);
    });

    const MFI = xybar / xxbar;
    const a = yBar - MFI * xBar;

    return {MFI, a};
};

export const calculateMFIcor1 = (T, MFI, P, Af) => {
    return viscosityCorrection(T, MFI) * (P / 210) * (Af ** 2 / 0.00138 ** 2);
};

export const calculateD50 = (K) => {
    return (10 ** (-3) * (K / 150) ** 0.6);
};

export const calculateEPS = (D50) => {
    return D50 / 6;
};

export const calculateMFIcor2 = (MFIcor1, D, K) => {
    const D50 = calculateD50(K);
    const EPS = calculateEPS(D50);
    return MFIcor1 * ((D * 10 ** (-6)) ** 2 / EPS ** 2);
};

export const calculateVC = (MFIcor2, ueq, IR, K) => (2 * 10 ** (-6) * MFIcor2 * (ueq) * (IR ** 2 / (K / 150) ** 1.2));

export const calculateR2 = (data) => {
    let sumX = 0;
    data.forEach(param => {
        sumX += param.tV;
    });
    const tvBar = sumX / data.length;
    let SStot = 0;
    data.forEach(param => {
        SStot += (param.tV - tvBar) ** 2;
    });
    let SSres = 0;
    data.forEach(param => {
        SSres += (param.tV - param.mfi) ** 2;
    });
    if (SStot === 0) {
        SStot = 1e-12
    }

    return (1 - (SSres / SStot))
};
