import { SemanticCOLORS } from 'semantic-ui-react/dist/commonjs/generic';
import _ from 'lodash';

interface IReferencePoint {
    fill: SemanticCOLORS;
    x: number;
    y: number;
    type: string;
}

export const calculateDomain = (
    data: Array<{
        x: number;
        obs: number;
        sim: number
    }>,
    points: IReferencePoint[]
): [number, number] => {
    const pointsOrderedByX = _.sortBy(points, 'x');
    const xMin = data[0].x < pointsOrderedByX[0].x ? data[0].x : pointsOrderedByX[0].x;
    const xMax = data[data.length - 1].x > pointsOrderedByX[pointsOrderedByX.length - 1].x ?
        data[data.length - 1].x : pointsOrderedByX[pointsOrderedByX.length - 1].x;
    return [xMin, xMax];
};

export const formatLabel = (label: string) => {
    label = label.replace(/_|-/g, ' ');
    label = label.replace(
        /\w\S*/g,
        (txt: string) => {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
    return label;
};