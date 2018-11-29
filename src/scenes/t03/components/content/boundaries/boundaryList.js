import React from 'react';
import PropTypes from 'prop-types';
import {Dropdown, Menu} from 'semantic-ui-react';

class BoundaryList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedType: null,
            selectedBoundaries: props.boundaries
        }
    }

    boundaryTypes = () => ([
        {key: 'all', value: null, text: 'Show all boundaries'},
        {key: 'chd', value: 'chd', text: 'Constant head boundary'},
        {key: 'ghb', value: 'ghb', text: 'General head  boundary'},
        {key: 'rch', value: 'rch', text: 'Recharge boundary'},
        {key: 'riv', value: 'riv', text: 'River boundary'},
        {key: 'wel', value: 'wel', text: 'Well boundary'},
    ]);

    list = () => {
        const {selectedType} = this.state;
        let selectedBoundaries = this.props.boundaries;
        if (selectedType) {
            selectedBoundaries = selectedBoundaries.filter(b => b.type === selectedType);
        }

        return (
            <Menu fluid vertical tabular>
                {selectedBoundaries.map(b => (
                    <Menu.Item
                        name={b.name}
                        key={b.id}
                        active={b.id === this.props.selected}
                        onClick={() => this.props.onChange(b.id)}
                    />
                ))}
            </Menu>
        )
    };

    render() {
        return (
            <div>
                <Dropdown
                    selection
                    placeholder={'Filter type of boundary'}
                    options={this.boundaryTypes()}
                    onChange={(e, {value}) => this.setState({selectedType: value})}
                />
                {this.list()}
            </div>
        )
    }
}

BoundaryList.propTypes = {
    boundaries: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    selected: PropTypes.string
};

export default BoundaryList;
