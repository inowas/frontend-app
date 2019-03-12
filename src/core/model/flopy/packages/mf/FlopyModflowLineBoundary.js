import FlopyModflowBoundary from './FlopyModflowBoundary';

export default class FlopyModflowLineBoundary extends FlopyModflowBoundary {

    static calculateSpData = (boundaries, nper) => {

        const spData = [];

        boundaries.forEach(boundary => {
            const cells = boundary.cells;
            const layers = boundary.layers;
            const ops = boundary.observationPoints;

            for (let per = 0; per < nper; per++) {
                spData[per] = [];

                layers.forEach(lay => {
                    cells.forEach(cell => {
                        const col = cell[0];
                        const row = cell[1];
                        const sector = Math.trunc(cell[2]);
                        const factor = Number((cell[2] - sector).toFixed(4));

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
