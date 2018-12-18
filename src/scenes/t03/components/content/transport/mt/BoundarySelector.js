import * as React from 'react';
import PropTypes from 'prop-types';
import {pure} from 'recompose';
import {Dropdown} from 'semantic-ui-react';
import {Boundary, BoundaryCollection, BoundaryFactory} from 'core/model/modflow/boundaries';

class BoundarySelector extends React.Component {

    componentWillMount() {
        if (!this.selectedBoundary) {
            this.props.onChange(this.props.boundaries.first.id);
        }
    }

    handleSelectBoundary = (e, {value}) => {
        return this.props.onChange(value);
    };

    get boundaryOptions() {
        return this.props.boundaries.boundaries.map(b => ({
            key: b.id,
            value: b.id,
            text: b.name
        }));
    }

    get selectedBoundary() {
        if (this.props.selected) {
            const boundaryObj = this.props.boundaries.findById(this.props.selected.id);
            if (boundaryObj.hasOwnProperty('active_cells')) {
                return BoundaryFactory.fromObjectData(boundaryObj);
            }
        }

        return null;
    }

    get layerOptions() {
        if (this.selectedBoundary instanceof Boundary) {
            return this.selectedBoundary.affectedLayers.map(l => ({
                key: l,
                value: l,
                text: l
            }));
        }

        return null;
    }

    render() {
        const selectedId = this.props.selected ? this.props.selected.id : null;

        return (
            <div>
                <Dropdown
                    placeholder="Select Boundary"
                    search
                    selection
                    options={this.boundaryOptions}
                    onChange={this.handleSelectBoundary}
                    value={selectedId}
                />

                {this.selectedBoundary &&
                <Dropdown
                    disabled
                    multiple
                    options={this.layerOptions}
                    placeholder={'Layers'}
                    selection
                    value={this.selectedBoundary.affectedLayers}
                />
                }

            </div>
        );
    }
}

BoundarySelector.propTypes = {
    boundaries: PropTypes.instanceOf(BoundaryCollection).isRequired,
    selected: PropTypes.instanceOf(Boundary),
    onChange: PropTypes.func.isRequired
};

export default pure(BoundarySelector);
