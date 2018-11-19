import {SETTINGS_CASE_FIXED_TIME, SETTINGS_CASE_VARIABLE_TIME, SETTINGS_INFILTRATION_ONE_TIME} from '../defaults';

export function calcC(t, x, vx, R, DL) {
    const term1 = erfc((x - (vx * t / R)) / (2 * Math.sqrt(DL * t / R)));
    const term2 = erfc((x + (vx * t / R)) / (2 * Math.sqrt(DL * t / R)));

    return 0.5 * (term1 + Math.exp(vx * x / DL) * term2);
}

export function erf(x) {
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    // Save the sign of x
    let sign = 1;
    if (x < 0) {
        sign = -1;
    }

    // get absX
    const absX = Math.abs(x);

    // A & S 7.1.26 with Horners Method
    const t = 1.0 / (1.0 + p * absX);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);
    return sign * y;
}

export function erfc(x) {
    return 1 - erf(x);
}


// this is for one time infiltration
export function calcCTau(t, x, vx, R, DL, tau) {
    const term1 = erfc((x - (vx * t / R)) / (2 * Math.sqrt(DL * t / R))) - erfc((x - (vx * (t - tau) / R)) / (2 * Math.sqrt(DL * (t - tau) / R)));
    let term2 = erfc((x + (vx * t / R)) / (2 * Math.sqrt(DL * t / R))) - erfc((x + (vx * (t - tau) / R)) / (2 * Math.sqrt(DL * (t - tau) / R)));
    term2 = Math.abs(term2) < 10e-16 ? 0 : term2;
    return 0.5 * (term1 + Math.exp(vx * x / DL) * term2);
}

export function calcT(xMax, vx, R, DL) {
    let c = 0;
    let t = 0;
    while (c < 0.9999) {
        c = calcC(t, xMax, vx, R, DL);
        t = t + 20;
    }

    return t;
}

export function calcX(tMax, vx, R, DL) {
    let c = 1;
    let x = 0;
    while (c > 0.0001) {
        c = calcC(tMax, x, vx, R, DL);
        x = x + 20;
    }
    return x;
}

export function calculateVx(K, ne, I) {
    return K * I / ne;
}

export function calculateDL(alphaL, vx) {
    return alphaL * vx;
}

export function calculateR(ne, Kd) {
    const rHob = (1 - ne) * 2.65;
    return 1 + Kd * rHob / ne;
}

export function calculateKd(kOw, cOrg) {
    const Koc = Math.exp(Math.log(kOw) - 0.21);
    return Koc * cOrg;
}

export function calculateDiagramData(settings, vx, DL, R, C0, xMax, tMax, tau) {
    let tauMax = 10e+8;
    if (settings.infiltration === SETTINGS_INFILTRATION_ONE_TIME) {
        tauMax = tau;
    }
    const data = [];
    if (settings.case === SETTINGS_CASE_VARIABLE_TIME) {
        const x = xMax;
        tMax = calcT(xMax, vx, R, DL);

        let dt = Math.floor(tMax / 25);

        // eslint-disable-next-line no-unused-vars
        let tStart = tMax - dt * 25;
        if (dt < 1) {
            tStart = 1;
            dt = 1;
        }
        for (let t = 0; t <= tMax; t += dt) {
            if (t < tauMax) {
                data.push({
                    t: t,
                    C: calcC(t, x, vx, R, DL)
                });
            } else {
                data.push({
                    t: t,
                    C: calcCTau(t, x, vx, R, DL, tau)
                });
            }
        }
    }

    if (settings.case === SETTINGS_CASE_FIXED_TIME) {
        const t = tMax;
        xMax = calcX(tMax, vx, R, DL);
        let dx = xMax / 25;

        // eslint-disable-next-line no-unused-vars
        let xStart = xMax - dx * 25;
        if (dx < 1) {
            xStart = 1;
            dx = 1;
        }
        for (let x = 0; x <= xMax; x += dx) {
            if (t < tauMax) {
                data.push({
                    x: x,
                    C: calcC(t, x, vx, R, DL)
                });
            } else {
                data.push({
                    x: x,
                    C: calcCTau(t, x, vx, R, DL, tau)
                });
            }
        }
    }
    return data;
}
