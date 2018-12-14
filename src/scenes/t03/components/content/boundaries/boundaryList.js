import React from 'react';
import PropTypes from 'prop-types';
import {Button, Dropdown, Icon, Menu, Popup} from 'semantic-ui-react';
import BoundaryCollection from 'core/model/modflow/boundaries/BoundaryCollection';

class BoundaryList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedType: 'all'
        }
    }

    boundaryTypes = () => ([
        {key: 'all', value: 'all', text: 'Show all boundaries'},
        {key: 'chd', value: 'chd', text: 'Constant head boundary'},
        {key: 'ghb', value: 'ghb', text: 'General head  boundary'},
        {key: 'rch', value: 'rch', text: 'Recharge boundary'},
        {key: 'riv', value: 'riv', text: 'River boundary'},
        {key: 'wel', value: 'wel', text: 'Well boundary'},
    ]);

    list = () => {
        const {selectedType} = this.state;
        let selectedBoundaries = this.props.boundaries.toObject();
        if (selectedType !== 'all') {
            selectedBoundaries = selectedBoundaries.filter(b => b.type === selectedType);
        }

        return (
            <Menu fluid vertical tabular>
                {selectedBoundaries.map(b => (
                    <Menu.Item
                        name={b.name}
                        key={b.id}
                        active={b.id === this.props.selected}
                        onClick={() => this.props.onClick(b.id)}
                    >
                        <Popup
                            trigger={<Icon name='ellipsis horizontal'/>}
                            content={
                                <div>
                                    <Button icon={'clone'} onClick={() => this.props.onClone(b.id)}/>
                                    <Button icon={'trash'} onClick={() => this.props.onRemove(b.id)}/>
                                </div>
                            }
                            on={'click'}
                            position={'right center'}
                        />
                        {b.name}
                    </Menu.Item>
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
                    value={this.state.selectedType}
                />
                {this.list()}
            </div>
        )
    }
}

BoundaryList.propTypes = {
    boundaries: PropTypes.instanceOf(BoundaryCollection).isRequired,
    onClick: PropTypes.func.isRequired,
    onClone: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    selected: PropTypes.string
};

export default BoundaryList;
