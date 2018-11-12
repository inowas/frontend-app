export function calculateQCrit(q, mu, xw) {
    return q * mu * xw;
}

export function calculateDiagramData(q, mu, xw) {
    const data = [];
    for (let x = 0; x < xw; x = x + 100) {
        const dataSet = {};
        dataSet.xw = Number(x);
        dataSet.Qcrit = calculateQCrit(q, mu, x);
        data.push(dataSet);
    }

    const dataSet = {};
    dataSet.xw = Number(xw);
    dataSet.Qcrit = calculateQCrit(q, mu, xw);
    data.push(dataSet);
    return data;
}

export function dRo(rhof, rhos) {
    return rhof / (rhos - rhof);
}

export function calcXt(k, b, q, Qw, xw, rhof, rhos) {
    const dRho = dRo(rhof, rhos);
    const lhs = 0.5*(1+dRho)*b*b/(dRho*dRho);
    let xt = lhs*k/q;
    let rhs = 0;

    do {
        const term1 = q*xt/k;
        const term2 = Qw*Math.log(Math.pow((xt-xw),2)/Math.pow((xt+xw),2))/(4*Math.PI*k);
        rhs = term1 + term2;
        xt = xt + (lhs - rhs);
    } while (Math.abs(lhs-rhs)>0.000001);
    return xt;
}

export function calcLambda(k, b, q, xw, rhof, rhos, AqType) {
    const dRho = dRo(rhof, rhos);
    if (AqType === 'unconfined') {
        return (k * b * b / (q * xw)) * ((1 + dRho) / (dRho * dRho));
    }

    // confined
    return (k * b * b / (q * xw * dRho));
}

export function calcMu(Lambda) {
    let iter = 1;
    let mu = 0.0000001;
    let rhs = 0;
    do {
        const term1 = 2 * Math.sqrt((1 - mu / Math.PI));
        const term2 = (mu / Math.PI) * Math.log((1 - Math.sqrt((1 - mu / Math.PI))) / (1 + Math.sqrt((1 - mu / Math.PI))));
        rhs = term1 + term2;
        mu = mu + Math.abs(Lambda - rhs) / Math.PI;
        if (mu < 0) {
            mu = 0.0000001;
        } // this should not happen
        iter = iter + 1;
    } while (iter < 100); // Lambda-rhs>0.000001
    return mu;
}