const binomial = (n, k) => {
    if ((typeof n !== 'number') || (typeof k !== 'number')) {
        return false;
    }

    let coefficient = 1;
    for (let x = n - k + 1; x <= n; x++) {
        coefficient *= x;
    }

    for (let x = 1; x <= k; x++) {
        coefficient /= x;
    }

    return coefficient;
};

export default binomial;
