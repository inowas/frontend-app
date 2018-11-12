const calcAlpha = ({w, k, df, ds}) => Math.sqrt((w * (ds - df)) / (k * ds));

const calcBeta = ({df, ds}) => df / (ds - df);

export const calcXt = ({k, z0, l, w, df, ds}) => {
    const alpha = calcAlpha({w, k, df, ds});
    const beta = calcBeta({df, ds});

    return Math.sqrt(
        Math.pow(l, 2) - Math.pow((z0 / (alpha * beta)), 2)
    );
};

export const calcDeltaXt = ({dz, k, z0, l, w, theta, df, ds}) => {
    const alpha = calcAlpha({w, k, df, ds});
    const beta = calcBeta({df, ds});

    return (
        Math.sqrt(
            Math.pow(l - (dz / Math.tan(theta * Math.PI / 180)), 2) -
            Math.pow((z0 + dz) / (alpha * beta), 2)
        ) -
        Math.sqrt(
            Math.pow(l, 2) - Math.pow((z0 / (alpha * beta)), 2)
        )
    );
};

export const calcNewXt = ({dz, k, z0, l, w, theta, df, ds}) => {
    const xt = calcXt({k, z0, l, w, df, ds});
    const deltaXt = calcDeltaXt({dz, k, z0, l, w, theta, df, ds});
    return xt + deltaXt;
};

export const calcH = ({k, l, w, x, df, ds}) => {
    const alpha = calcAlpha({w, k, df, ds});
    return alpha * Math.sqrt(Math.pow(l, 2) - Math.pow(x, 2));
};

export const calcI = ({dz, k, l, w, theta, x, df, ds}) => {
    const alpha = calcAlpha({w, k, df, ds});
    const h = calcH({k, l, w, x, df, ds});
    const tanTheta = Math.tan(theta * Math.PI / 180);

    return (
        dz + Math.sqrt(
            ((-Math.pow(alpha, 2) * dz) / (tanTheta)) *
            (2 * l - (dz / tanTheta)) +
            Math.pow(h, 2)
        ) - h
    );
};
