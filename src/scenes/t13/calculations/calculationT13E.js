export function calculateTravelTimeT13E(xi, h0, hL, x, ne, Qw) {
    return (0.95 * h0 + 0.05 * hL) * Math.PI * (xi ** 2 - x ** 2) * ne / Qw;
}
