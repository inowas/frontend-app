import {Image} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import React from 'react';
import {createGridData, min, max, rainbowFactory} from './helpers';
import ColorLegend from './ColorLegend';
import {GridSize} from '../../../core/model/geometry';
import Rainbow from 'rainbowvis.js';
import ColorLegendDiscrete from './ColorLegendDiscrete';

const styles = {
    canvas: {
        width: '100%',
        height: '100%'
    }
};

class RasterDataImage extends React.Component {
    componentDidMount() {
        if (this.canvas) {
            const {data, gridSize, legend} = this.props;
            const rainbowVis = legend || rainbowFactory({min: min(data), max: max(data)});
            const width = gridSize.nX;
            const height = gridSize.nY;
            this.drawCanvas(data, width, height, rainbowVis);
        }
    }

    shouldComponentUpdate(nextProps) {
        return this.props.legend !== nextProps.legend || this.props.data !== nextProps.data;
    }

    drawCanvas(data, width, height, rainbowVis) {
        const ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, width, height);
        const gridData = createGridData(data, width, height);

        gridData.forEach(d => {
            if (rainbowVis instanceof Rainbow) {
                if (isNaN(d.value)) {
                    ctx.fillStyle = 'rgba(255,255,255,0)';
                } else {
                    ctx.fillStyle = '#' + rainbowVis.colourAt(d.value);
                }
            } else {
                const data = rainbowVis[0].isContinuous ?
                    rainbowVis.filter(row => (row.fromOperator === '>' ? d.value > row.from : d.value >= row.from) && (row.toOperator === '<' ? d.value < row.to : d.value <= row.to)) :
                    rainbowVis.filter(row => row.value === d.value);
                ctx.fillStyle = data.length > 0 ? data[0].color : '#fff';
            }
            ctx.fillRect(d.x, d.y, 1, 1);
        });
    }

    drawLegend(rainbowVis, unit) {
        if (rainbowVis instanceof Rainbow) {
            // slice() to make an immutable copy
            const gradients = rainbowVis
                .getGradients()
                .slice()
                .reverse();
            const lastGradient = gradients[gradients.length - 1];
            const legend = gradients.map(gradient => ({
                color: '#' + gradient.getEndColour(),
                value: Number(gradient.getMaxNum()).toExponential()
            }));

            legend.push({
                color: '#' + lastGradient.getStartColour(),
                value: Number(lastGradient.getMinNum()).toExponential()
            });

            return <ColorLegend legend={legend} orientation={'horizontal'} unit={unit}/>;
        }
        return <ColorLegendDiscrete legend={rainbowVis} horizontal unit={''}/>;
    }

    handleClickCell = (e) => {
        const canvas = this.canvas;
        const rect = canvas.getBoundingClientRect();

        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = Math.floor((e.clientX - rect.left) * scaleX);
        const y = Math.floor((e.clientY - rect.top) * scaleY);

        return this.props.onClickCell({x, y});
    };

    render() {
        const {data, gridSize, unit, border} = this.props;

        let canvasStyle = styles.canvas;
        if (border) {
            canvasStyle = {...canvasStyle, border};
        }

        const rainbowVis = this.props.legend || rainbowFactory({min: min(data), max: max(data)});
        const width = gridSize.nX;
        const height = gridSize.nY;

        if (this.canvas) {
            this.drawCanvas(data, width, height, rainbowVis);
        }

        return (
            <div>
                <Image
                    fluid
                >
                    <canvas
                        style={canvasStyle}
                        ref={(canvas) => {
                            this.canvas = canvas;
                        }}
                        width={width}
                        height={height}
                        data-paper-resize
                        onClick={this.handleClickCell}
                    />
                </Image>
                {this.drawLegend(rainbowVis, unit)}
            </div>
        );
    }
}

RasterDataImage.propTypes = {
    onClickCell: PropTypes.func,
    data: PropTypes.oneOfType([PropTypes.array, PropTypes.number]).isRequired,
    gridSize: PropTypes.instanceOf(GridSize).isRequired,
    legend: PropTypes.oneOfType([PropTypes.array, PropTypes.instanceOf(Rainbow)]),
    unit: PropTypes.string.isRequired,
    border: PropTypes.string
};

export default RasterDataImage;
