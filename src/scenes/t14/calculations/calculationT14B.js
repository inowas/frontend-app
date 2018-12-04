import erfc from './erfc';

export const calcDQ = (d, S, T, t, L, Qw) => {
    const erfc1 = erfc(Math.sqrt((d * d * S) / (4 * T * t)));
    const exp1 = Math.exp((T * t / (S * L * L)) + d / L);
    const erfc2 = erfc(Math.sqrt(T * t / (S * L * L)) + Math.sqrt((d * d * S) / (4 * T * t)));
    return Qw * (erfc1 - exp1 * erfc2);
};

export function calculateDiagramData(Qw, S, T, d, tMin, tMax, L, dt) {
    const data = [];
    for (let t = tMin; t < tMax; t += dt) {
        data.push({
            t: t,
            dQ: calcDQ(d, S, T, t, L, Qw)
        });
    }
    return data;
}

