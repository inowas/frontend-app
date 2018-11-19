import erfc from './erfc';

export function calcDQ(Qw, d, S, T, t) {
    return Qw * erfc(Math.sqrt((d * d * S) / (4 * T * t)));
}

export function calculateDiagramData(Qw, S, T, d, tMin, tMax, dt) {
    const data = [];
    for (let t = tMin; t <= tMax; t += dt) {
        data.push({
            t: t,
            dQ: calcDQ(Qw, d, S, T, t)
        });
    }
    return data;
}
