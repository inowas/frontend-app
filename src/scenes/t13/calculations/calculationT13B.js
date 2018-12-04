export function calculateTravelTimeT13B(x, w, K, ne, L1, h1, xMin) {
    const xi = xMin;
    const alpha = L1 * L1 + K * h1 * h1 / w;
    const root1 = Math.sqrt(alpha / K / w);
    const root3 = Math.sqrt(1 / (xi * xi) - 1 / alpha);
    const root4 = Math.sqrt((alpha / (xi * xi)) - 1);
    const root2 = Math.sqrt(1 / (x * x) - 1 / alpha);
    const root5 = Math.sqrt((alpha / (x * x)) - 1);
    const ln = Math.log((Math.sqrt(alpha) / xi + root4) / (Math.sqrt(alpha) / x + root5));
    return ne * root1 * (x * root2 - xi * root3 + ln);
}

export function calculateXwd(L, K, w, hL, h0) {
    return (L / 2 + K * (hL * hL - h0 * h0) / (2 * w * L));
}
