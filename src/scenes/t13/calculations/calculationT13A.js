export function calculateTravelTimeT13A(x, w, K, ne, L, hL, xMin) {
    const small = 1e-12;
    const xi = xMin;
    const alpha = L * L + K * hL * hL / w;
    const root1 = Math.sqrt(alpha / K / w);
    const root3 = Math.sqrt(1 / ((xi * xi) + small) - 1 / alpha);
    const root4 = Math.sqrt((alpha / ((xi * xi) + small)) - 1);
    const root2 = Math.sqrt(1 / (x * x) - 1 / alpha);
    const root5 = Math.sqrt((alpha / (x * x)) - 1);
    const ln = Math.log((Math.sqrt(alpha) / xi + root4) / (Math.sqrt(alpha) / x + root5));
    return ne * root1 * (x * root2 - xi * root3 + ln);
}
