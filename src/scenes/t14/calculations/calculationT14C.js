import erfc from './erfc';

export const calcDQ = (d, S, T, t, lambda, Qw) => {
    const erfc1 = erfc(Math.sqrt((d * d * S) / (4 * T * t)));
    const exp1 = Math.exp((lambda * lambda * t / (4 * S * T)) + lambda * d / (2 * T));
    const erfc2 = erfc(Math.sqrt((lambda * lambda * t / (4 * S * T))) + Math.sqrt((d * d * S) / (4 * T * t)));
    return Qw * (erfc1 - exp1 * erfc2);
};

export function calculateDiagramData(Qw, S, T, d, tMin, tMax, lambda, dt) {
    const data = [];
    for (let t = tMin; t < tMax; t += dt) {
        data.push({
            t: t,
            dQ: calcDQ(d, S, T, t, lambda, Qw)
        });
    }
    return data;
}
