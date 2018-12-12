import PropTypes from 'prop-types';
import React from 'react';

class ColorLegend extends React.Component {

    renderVerticalLabels = (unit) => {
        const legend = this.props.legend;

        return legend.map((l, index) => {
            return (
                <div className="label" key={index}>{l.value} {unit}</div>
            );
        });
    };

    renderVerticalGradients = () => {
        const legend = this.props.legend;

        let gradient = 'linear-gradient(to bottom';
        legend.forEach((l, index) => {
            gradient += ', ' + l.color + ' ' + ( (index + 1) / legend.length * 100 ) + '%';
        });

        gradient += ')';

        return gradient;
    };

    renderVerticalColorLegend = (unit) => {
        const gradient = this.renderVerticalGradients();
        const labels = this.renderVerticalLabels(unit);
        const legend = this.props.legend;

        return (
            <div className="colorLegend">
                <div className="vertical">
                    <div className="stripe" style={{
                        backgroundImage: gradient,
                        height: (legend.length - 1) * 20
                    }}/>
                    <div className="labels">
                        {labels}
                    </div>
                </div>
            </div>
        );
    };

    renderHorizontalColorLegend = () => {
        const {legend, unit} = this.props;

        const reducedLegend = [];
        reducedLegend.push(legend[legend.length - 1]);
        reducedLegend.push(legend[Math.floor(legend.length / 2)]);
        reducedLegend.push(legend[0]);

        return (
            <div className="colorLegend">
                <div className="horizontal">
                    <ul className="legend">
                        <li><span style={{backgroundColor: reducedLegend[0].color}}/> {reducedLegend[0].value} {unit}
                        </li>
                        <li><span style={{backgroundColor: reducedLegend[1].color}}/> {reducedLegend[1].value} {unit}
                        </li>
                        <li><span style={{backgroundColor: reducedLegend[2].color}}/> {reducedLegend[2].value} {unit}
                        </li>
                    </ul>
                </div>
            </div>
        );
    };

    render() {
        const {orientation, unit = 'm'} = this.props;

        if (!orientation || orientation === 'vertical') {
            return this.renderVerticalColorLegend(unit);
        }

        return this.renderHorizontalColorLegend();
    }
}

ColorLegend.propTypes = {
    legend: PropTypes.array,
    orientation: PropTypes.string,
    unit: PropTypes.string
};

export default ColorLegend;
