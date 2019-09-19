import {Array2D} from '../../geometry/Array2D.type';
import {ICriteriaRelation} from '../criteria/CriteriaRelation.type';

const getRandomIndex = (n: number) => {
    const indices = [0, 0, 0.58, 0.9, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49, 1.51, 1.48, 1.56, 1.57, 1.59];
    return indices[n - 1];
};

export const multiplyElementWise = (m1: Array2D<number>, m2: Array2D<number>) => {
    const dimCol = m1[0].length === m2[0].length ? m1[0].length : null;
    const dimRow = m1.length === m2.length ? m1.length : null;
    const m3 = new Array(dimRow).fill(0).map(() => new Array(dimCol).fill(0));

    if (!dimCol || !dimRow) {
        throw new Error('Matrices m1 and m2 need to have the same dimensions.');
    }

    for (let row = 0; row <= dimRow - 1; row++) {
        for (let col = 0; col <= dimCol - 1; col++) {
            if (isNaN(m1[row][col]) || isNaN(m2[row][col])) {
                m3[row][col] = NaN;
            } else {
                m3[row][col] = m1[row][col] * m2[row][col];
            }
        }
    }

    return m3;
};

/**
 * Calculates the weight of all criteria depending of the relations between each other.
 *
 * @param {array} criteria   Array of criteria ids.
 * @param {array} relations  Array of relations between criteria.
 *
 * @return {object} results   Object with properties ci, cv, lambda.
 */
export const calculatePwcWeights = (criteria: string[], relations: ICriteriaRelation[]) => {
    interface IResults {
        lambda: number;
        ci: number;
        cr: number;
        [criterion: string]: number | IResult;
    }

    interface IResult {
        cols: {
            [criterion: string]: number
        };
        cSum: number;
        cv: number;
        rSum: number;
        w: number;
        ws: number;
        wsv: {
            [criterion: string]: number
        };
    }

    const results: IResults = {
        lambda: 0,
        ci: 0,
        cr: 0
    };

    const n = criteria.length;

    criteria.forEach((cId) => {
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

    criteria.forEach((row: string) => {
        criteria.forEach((col: string) => {
            let value = 0;
            if (row === col) {
                value = 1;
            }
            /* TODO: this might be wrong (relation.id was originally relation.from) */
            const reld = relations.filter((relation) => relation.id === col && relation.to === row);
            if (reld.length > 0) {
                value = 1 / reld[0].value;
            }
            const reli = relations.filter((relation) => relation.id === row && relation.to === col);
            if (reli.length > 0) {
                value = reli[0].value;
            }
            (results[col] as IResult).cSum += value;
            (results[row] as IResult).cols[col] = value;
        });
    });

    criteria.forEach((row) => {
        criteria.forEach((col) => {
            (results[row] as IResult).rSum += (results[row] as IResult).cols[col] / (results[col] as IResult).cSum;
            (results[row] as IResult).w = (results[row] as IResult).rSum / n;
        });
    });

    criteria.forEach((row) => {
        criteria.forEach((col) => {
            const value1 = (results[row] as IResult).cols[col] * (results[col] as IResult).w;
            (results[row] as IResult).wsv[col] = value1;
            (results[row] as IResult).ws += value1;
        });
        const value2 = (results[row] as IResult).ws / (results[row] as IResult).w;
        (results[row] as IResult).cv = value2;
        results.lambda += value2;
    });

    results.lambda = results.lambda / n;
    results.ci = (results.lambda - n) / (n - 1);
    results.cr = results.ci / getRandomIndex(n);

    return results;
};
