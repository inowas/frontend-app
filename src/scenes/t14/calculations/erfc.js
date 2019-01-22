import erf from './erf';

export default function erfc(x) {
    return 1 - erf(x);
}
