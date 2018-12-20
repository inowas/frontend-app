import {Image} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import React from 'react';
import {createGridData, min, max, rainbowFactory} from './helpers';
import ColorLegend from './ColorLegend';
import GridSize from 'core/model/modflow/GridSize';

const styles = {
    canvas: {
        width: '100%',
        height: '100%'
    }
};

class RasterDataImage extends React.Component {
    componentDidMount() {
        if (this.canvas) {
            const {data, gridSize} = this.props;
            const rainbowVis = rainbowFactory({min: min(data), max: max(data)});
            const width = gridSize.nX;
            const height = gridSize.nY;
            this.drawCanvas(data, width, height, rainbowVis);
        }
    }

    shouldComponentUpdate(nextProps) {
        return this.props.data !== nextProps.data;
    }

    drawCanvas(data, width, height, rainbowVis) {
        const ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, width, height);
        const gridData = createGridData(data, width, height);
        gridData.forEach(d => {
            ctx.fillStyle = '#' + rainbowVis.colourAt(d.value);
            ctx.fillRect(d.x, d.y, 1, 1);
        });
    }

    drawLegend(rainbowVis, unit) {
        // slice() to make an immutable copy
        const gradients = rainbowVis
            .getGradients()
            .slice()
            .reverse();
        const lastGradient = gradients[gradients.length - 1];
        const legend = gradients.map(gradient => ({
            color: '#' + gradient.getEndColour(),
            value: Number(gradient.getMaxNum()).toFixed(2)
        }));

        legend.push({
            color: '#' + lastGradient.getStartColour(),
            value: Number(lastGradient.getMinNum()).toFixed(2)
        });

        return <ColorLegend legend={legend} orientation={'horizontal'} unit={unit}/>;
    }

    render() {
        const {data, gridSize, unit} = this.props;

        const rainbowVis = rainbowFactory({min: min(data), max: max(data)});
        const width = gridSize.nX;
        const height = gridSize.nY;

        if (this.canvas) {
            this.drawCanvas(data, width, height, rainbowVis);
        }

        return (
            <div>
                <Image fluid>
                    <canvas
                        style={styles.canvas}
                        ref={(canvas) => {
                            this.canvas = canvas;
                        }}
                        width={width}
                        height={height}
                        data-paper-resize
                    />
                </Image>
                {this.drawLegend(rainbowVis, unit)}
            </div>
        );
    }
}

RasterDataImage.propTypes = {
    data: PropTypes.oneOfType([PropTypes.array, PropTypes.number]).isRequired,
    gridSize: PropTypes.instanceOf(GridSize).isRequired,
    unit: PropTypes.string.isRequired
};

export default RasterDataImage;
