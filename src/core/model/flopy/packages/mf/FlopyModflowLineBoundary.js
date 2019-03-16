import FlopyModflowBoundary from './FlopyModflowBoundary';

export default class FlopyModflowLineBoundary extends FlopyModflowBoundary {

    static calculateSpData = (boundaries, nper) => {

        const spData = [];

        for (let per = 0; per < nper; per++) {
            spData[per] = [];
        }

        boundaries.forEach(boundary => {
            const cells = boundary.cells;
            const layers = boundary.layers;
            const ops = boundary.observationPoints;

            for (let per = 0; per < nper; per++) {
                layers.forEach(lay => {
                    cells.forEach(cell => {
                        const col = cell[0];
                        const row = cell[1];
                        const value = cell[2] ? cell[2] : 0;
                        const sector = Math.trunc(value);
                        const factor = Number((value - sector).toFixed(4));

                        const spValues = [lay, row, col];
                        if (factor === 0) {
                            spData[per].push(spValues.concat(ops[sector].spValues[per]));
                            return;
                        }

                        const prevSpValues = ops[sector].spValues[per];
                        const nextSpValues = ops[sector + 1].spValues[per];

                        // Expecting 3 spValues
                        for (let spIdx = 0; spIdx < boundary.valueProperties.length; spIdx++) {
                            const value = prevSpValues[spIdx] + (nextSpValues[spIdx] - prevSpValues[spIdx]) * factor;
                            spValues.push(Number(value.toFixed(3)));
                        }

                        spData[per].push(spValues);
                    })
                });
            }
        });

        return FlopyModflowLineBoundary.arrayToObject(spData);
    };
}
