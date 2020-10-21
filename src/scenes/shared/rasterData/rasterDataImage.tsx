import React, {useEffect, useRef} from 'react';
import {Image} from 'semantic-ui-react';
import {GridSize} from '../../../core/model/geometry';
import {Array2D} from '../../../core/model/geometry/Array2D.type';
import {rainbowFactory} from '../../../services/rainbowvis/helpers';
import Rainbow from '../../../services/rainbowvis/Rainbowvis';
import {
    ILegendItem,
    ILegendItemContinuous,
    ILegendItemDiscrete,
    RainbowOrLegend
} from '../../../services/rainbowvis/types';
import {createGridData, max, min} from './helpers';
import {ColorLegend, ColorLegendDiscrete} from './index';

const styles = {
    canvas: {
        border: '0',
        width: '100%',
        height: '100%'
    }
};

interface IProps {
    onClickCell?: (obj: { x: number, y: number }) => any;
    data: number | Array2D<number>;
    gridSize: GridSize;
    legend?: RainbowOrLegend;
    unit: string;
    border?: string;
}

const RasterDataImage = (props: IProps) => {
    const {border, data, gridSize, legend, unit} = props;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rLegend = props.legend || rainbowFactory({min: min(data), max: max(data)});

    let canvasStyle = styles.canvas;
    if (border) {
        canvasStyle = {...canvasStyle, border};
    }

    useEffect(() => {
        const rainbowVis = legend || rainbowFactory({min: min(data), max: max(data)});
        const width = gridSize.nX;
        const height = gridSize.nY;
        drawCanvas(width, height, rainbowVis);
    });

    /*shouldComponentUpdate(nextProps) {
        return this.props.legend !== nextProps.legend || this.props.data !== nextProps.data;
    }*/

    const drawCanvas = (width: number, height: number, rainbowVis: RainbowOrLegend) => {
        if (canvasRef && canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, width, height);
                const gridData = createGridData(data, width, height);

                if (gridData) {
                    gridData.forEach((d) => {
                        if (rainbowVis instanceof Rainbow) {
                            if (isNaN(d.value)) {
                                ctx.fillStyle = 'rgba(255,255,255,0)';
                            } else {
                                ctx.fillStyle = '#' + rainbowVis.colorAt(d.value);
                            }
                        } else {
                            let cData: ILegendItemContinuous[] | ILegendItemDiscrete[] = [];
                            if (Array.isArray(rainbowVis) && rainbowVis[0].isContinuous) {
                                cData = (rainbowVis as ILegendItemContinuous[]).filter((row) =>
                                    (row.fromOperator === '>' ? d.value > row.from : d.value >= row.from) &&
                                    (row.toOperator === '<' ? d.value < row.to : d.value <= row.to));
                            }
                            if (Array.isArray(rainbowVis) && !rainbowVis[0].isContinuous) {
                                cData = (rainbowVis as ILegendItemContinuous[]).filter((row) => row.value === d.value);
                            }
                            ctx.fillStyle = cData.length > 0 ? cData[0].color : '#fff';
                        }
                        ctx.fillRect(d.x, d.y, 1, 1);
                    });
                }
            }
        }
    };

    const drawLegend = (rainbowVis: RainbowOrLegend) => {
        if (rainbowVis instanceof Rainbow) {
            // slice() to make an immutable copy
            const gradients = (rainbowVis as Rainbow)
                .gradients
                .slice()
                .reverse();
            const lastGradient = gradients[gradients.length - 1];
            const cLegend: ILegendItem[] = gradients.map((gradient) => ({
                color: '#' + gradient.endColor,
                value: Number(gradient.maxNum).toExponential()
            }));

            cLegend.push({
                color: '#' + lastGradient.startColor,
                value: Number(lastGradient.minNum).toExponential()
            });

            return <ColorLegend legend={cLegend} orientation={'horizontal'} unit={unit}/>;
        }
        return <ColorLegendDiscrete legend={rainbowVis as ILegendItemDiscrete[]} horizontal={true} unit={''}/>;
    };

    const handleClickCell = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        if (props.onClickCell && canvasRef && canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();

            const scaleX = canvasRef.current.width / rect.width;
            const scaleY = canvasRef.current.height / rect.height;

            const x = Math.floor((e.clientX - rect.left) * scaleX);
            const y = Math.floor((e.clientY - rect.top) * scaleY);

            return props.onClickCell({x, y});
        }
    };

    return (
        <div>
            <Image
                fluid={true}
            >
                <canvas
                    style={canvasStyle}
                    ref={canvasRef}
                    width={gridSize.nX}
                    height={gridSize.nY}
                    data-paper-resize={true}
                    onClick={handleClickCell}
                />
            </Image>
            {drawLegend(rLegend)}
        </div>
    );
};

export default RasterDataImage;
