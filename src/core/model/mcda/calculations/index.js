const getRandomIndex = n => {
    const indices = [0, 0, 0.58, 0.9, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49, 1.51, 1.48, 1.56, 1.57, 1.59];
    return indices[n - 1];
};

/**
 * Calculates the weight of all criteria depending of the relations between each other.
 *
 * @param {array} criteria   Array of criteria ids.
 * @param {array} relations  Array of relations between criteria.
 *
 * @return {object} results   Object with properties ci, cv, lambda.
 */
export const calculatePwcWeights = (criteria, relations) => {
    const results = {
        lambda: 0,
        ci: 0,
        cr: 0
    };

    const n = criteria.length;

    criteria.forEach(cId => {
        results[cId] = {
            w: 0,
            wsv: {},
            ws: 0,
            cv: 0,
            rSum: 0,
            cols: {},
            cSum: 0
        };
    });

    criteria.forEach(row => {
        criteria.forEach(col => {
            let value = 0;
            if (row === col) {
                value = 1;
            }
            const reld = relations.filter(relation => relation.from === col && relation.to === row);
            if (reld.length > 0) {
                value = 1 / reld[0].value;
            }
            const reli = relations.filter(relation => relation.from === row && relation.to === col);
            if (reli.length > 0) {
                value = reli[0].value;
            }
            results[col].cSum += value;
            results[row].cols[col] = value;
        })
    });

    criteria.forEach(row => {
        criteria.forEach(col => {
            results[row].rSum += results[row].cols[col] / results[col].cSum;
            results[row].w = results[row].rSum / n;
        });
    });

    criteria.forEach(row => {
        criteria.forEach(col => {
            const value = results[row].cols[col] * results[col].w;
            results[row].wsv[col] = value;
            results[row].ws += value;
        });
        const value = results[row].ws / results[row].w;
        results[row].cv = value;
        results.lambda += value;
    });

    results.lambda = results.lambda / n;
    results.ci = (results.lambda - n) / (n - 1);
    results.cr = results.ci / getRandomIndex(n);

    return results;
};

