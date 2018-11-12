export function dRho(rHof, rHos) {
    return rHof / (rHos - rHof);
}

export function calcXtQ0Flux(k, z0, dz, l, w, i, alpha) {
    const qi = i * k * z0;
    const q = qi + w * l;
    // const qmin = Math.sqrt((w * k * (1 + alpha) * z0 * z0) / (alpha * alpha));
    // const hT = z0 / alpha;
    // const xm = q / w;
    const xt = q / w - Math.sqrt((q * q) / (w * w) - (k * (1 + alpha) * z0 * z0) / (w * alpha * alpha));
    // const hm = Math.sqrt(2 / k * (xm - xt) * (q - (w / 2) * (xm + xt)) + (hT + z0) * (hT + z0));
    // const hTn = (dz + z0) / alpha;
    const xtSlr = q / w - Math.sqrt((q * q) / (w * w) - (k * (1 + alpha) * (z0 + dz) * (z0 + dz)) / (w * alpha * alpha));
    return [xt, xtSlr];
}

export function calcXtQ0Head(K, z0, dz, L, W, hi, alpha) {
    const zn = z0 + dz;
    const ht = z0 / alpha;
    const term1 = ((hi + zn) * (hi + zn) - (ht + zn) * (ht + zn)) * K / 2.0;
    let loop = 1;
    let q0 = 1; // start value
    let q0Old = q0;
    let xt = 0;
    let iter = 0;
    let maxIter = false;
    const iterMax = 100;
    // const q_min = Math.sqrt((W * K * (1 + alpha) * zn * zn) / (alpha * alpha));

    let valid = true;
    do {
        if ((q0 * q0 / (W * W)) < (K * (1 + alpha) * zn * zn) / (W * alpha * alpha)) {
            valid = false;
            break;
        }

        xt = (q0 / W) - Math.sqrt((q0 * q0 / (W * W)) - (K * (1 + alpha) * zn * zn) / (W * alpha * alpha));
        q0 = (term1 / (L - xt)) + W * (L + xt) / 2;
        if (Math.abs(q0Old - q0) < 0.0000001) loop = 0;
        q0Old = q0;
        iter++;
    } while (loop === 1 && iter < iterMax);

    if (iter === iterMax) {
        maxIter = true;
    }

    return [xt, q0, maxIter, valid];
}

export function calculateDiagramData(xt, z0, xtSlr, dz, isValid) {
    if (isValid === 'false') {
        return [{
            xt: 0,
            z0: 0,
            z0_new: 0
        }];
    }

    return [
        {
            xt: 0,
            z0: 0,
            z0_new: dz
        }, {
            xt: -xt,
            z0: -z0,
            z0_new: -((z0+dz) * (xt / xtSlr)-dz)
        }, {
            xt: -xtSlr,
            z0_new: -z0
        }
    ];
}
