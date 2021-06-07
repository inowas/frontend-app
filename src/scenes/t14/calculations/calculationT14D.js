import binomial from './binomial';
import erfc from './erfc';

const GP = [
    -0.949107912342759,
    -0.741531185599394,
    -0.405845151377397,
    0.0,
    0.405845151377397,
    0.741531185599394,
    0.949107912342759
];

const WT = [
    0.129484966168870,
    0.279705391489277,
    0.381830050505119,
    0.417959183673469,
    0.381830050505119,
    0.279705391489277,
    0.129484966168870
];


const FTerm = (dlam, alpha, dt) => {
    const Z = (alpha * dlam * Math.sqrt(dt) / 2) + 1 / (2 * alpha * Math.sqrt(dt));
    const Term1 = Math.exp(-1 / (4 * dt * alpha * alpha)) * Math.sqrt(dt / Math.PI);
    const X = dlam / 2 + ((dt * alpha * alpha * dlam * dlam) / 4);
    const Y = Z;
    const Term2 = Math.exp(X) * erfc(Y);
    return (
        Term1 - (alpha * dt * dlam / 2) * Term2
    );
};
const I0 = (x) => {
    const T = x / 3.750;
    let I0Approx = 0;
    if (x > -3.75 && x < 3.75) {
        I0Approx = 1.0 + 3.5156229 * (T ** 2) + 3.0899424 * (T ** 4) + 1.2067492 * (T ** 6) + 0.2659732 * (T ** 8) +
            0.0360768 * (T ** 10) + 0.0045813 * (T ** 12);
    } else if (x > 3.75) {
        I0Approx = (Math.exp(x) / Math.sqrt(x)) * (0.39894228 + 0.1328592E-01 / T +
            0.225319E-02 / (T ** 2) - 0.157565E-02 / (T ** 3) + 0.916281E-02 / (T ** 4)
            - 0.2057706E-01 / (T ** 5) + 0.2635537E-01 / (T ** 6) - 0.1647633E-01 / (T ** 7)
            + 0.392377E-02 / (T ** 8));
    } else {
        throw new Error('ERROR IN ARGUMENT TO MODIFIED BESSEL FUNCTION');
    }
    return I0Approx;
};
const FACTORIAL = (N) => {
    let FACT = 1;
    for (let I = N; I > 1; I--) {
        FACT = FACT * I;
    }
    return FACT;
};
const FACTLN = (N) => {
    let _FACTLN = Math.log(1);
    if (N <= 1) {
        return _FACTLN;
    }
    for (let I = N; I >= 1; I--) {
        _FACTLN = _FACTLN + Math.log(I);
    }
    return _FACTLN;
};
const P = (n, x) => {
    let sum = 0;
    if (n === 1) {
        sum = 1.0;
    } else if (n === 2) {
        sum = 1.0 + x;
    } else {
        sum = 1.0 + x + (x ** 2) / 2.0;
    }
    let TERM = 0;
    for (let I = 3; I < n - 1; I++) {
        if (I > 12) {
            TERM = Math.exp(I * Math.log(x) - FACTLN(I));
        } else {
            TERM = (x ** I) / (FACTORIAL(I));
        }
        sum = sum + TERM;
    }
    let PApprox = 1.0 - sum * Math.exp(-x);
    if (PApprox < 0) {
        PApprox = 0;
    }
    return PApprox;
};

const GTerm = (dk, deps, alpha, dt) => {
    const a = deps * dk * dt * (1 - alpha * alpha);
    const b = dk * dt * alpha * alpha;
    let Term1 = 0;

    if (dk < 1e-10) {return 0;}
    if ((a + b) < 80) {
        Term1 = Math.exp(-(a + b)) * I0(2 * Math.sqrt(a * b));
    } else {
        Term1 = 0;
    }
    let SUM = 0;
    const abterm = Math.sqrt(a * b) / (a + b);
    for (let i = 1; i < 100; i++) {
        const n = i - 1;
        const addTerm = binomial(2 * n, n) * P(2 * n + 1, a + b) * Math.pow(abterm, 2 * n);
        SUM = SUM + addTerm;
        if (addTerm < 1e-10) {
            break;
        }
    }
    return 0.5 * (1 - Term1 + ((b - a) / (a + b)) * SUM);
};

export const calcDQ = (d, S, T, t, lambda, Kdash, Bdashdash, Qw, deps, dlam, dk) => {
    if (t === 0) {
        return 0;
    }
    let Y = Math.sqrt((S * d * d) / (4 * T * t));
    const Term1 = erfc(Y);
    const X1 = (lambda * lambda * t) / (4 * S * T);
    const X2 = (lambda * d) / (2 * T);
    const X = X1 + X2;
    const Y1 = Math.sqrt((lambda * lambda * t) / (4 * S * T));
    const Y2 = Math.sqrt((S * d * d) / (4 * T * t));
    Y = Y1 + Y2;
    const Term2 = Math.exp(X) * erfc(Y);
    let SUM = Qw * (Term1 - Term2);

    const dt = (T * t) / (S * d * d);
    let corsum = 0.0;

    for (let IPT = 0; IPT < GP.length; IPT++) {
        // ALPHA RANGES FROM 0 TO 1, GAUSS POINTS ARE FOR -1 TO 1
        // USE CHANGE OF VARIABLE TO GET CORRECT ALPHA CORRESPONDING TO GAUSS POINTS
        const alpha = 0.5 + 0.50 * GP[IPT];
        const F = FTerm(dlam, alpha, dt);
        const G = GTerm(dk, deps, alpha, dt);
        corsum += F * G * WT[IPT];
    }

    // THE "0.5" IN THE NEXT LINE IS FROM THE CHANGE IN RANGE OF INTEGRATION
    // IN THE GAUSSIAN QUADRATURE FROM -1 -> 1 TO 0 -> 1.
    if (corsum < 0) {
        corsum = 0;
    }
    SUM = SUM - Qw * dlam * corsum * 0.5;
    return SUM;
};


export function calculateDiagramData(Qw, S, T, d, tMin, tMax, Kdash, bdash, Bdashdash, Sigma, W) {
    const lambda = Kdash * W / Bdashdash;
    const deps = S / Sigma;
    const dlam = lambda * d / T;
    const dk = ((Kdash / bdash) * d * d) / T;
    const dT = (tMax - tMin) / 25;
    const data = [];
    for (let t = tMin; t <= tMax; t += dT) {
        data.push({
            t: t,
            dQ: calcDQ(d, S, T, t, lambda, Kdash, Bdashdash, Qw, deps, dlam, dk)
        });
    }
    return data;
}
