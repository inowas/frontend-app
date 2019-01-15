import React from 'react';
import PropTypes from 'prop-types';
import {Button, Dropdown, Form, Grid, Icon, Menu, Popup} from 'semantic-ui-react';
import BoundaryCollection from 'core/model/modflow/boundaries/BoundaryCollection';

class BoundaryList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedType: 'all'
        }
    }

    boundaryTypes = () => ([
        {key: 'all', value: 'all', text: 'Show All'},
        {key: 'chd', value: 'chd', text: 'CHD'},
        {key: 'ghb', value: 'ghb', text: 'GHB'},
        {key: 'rch', value: 'rch', text: 'RCH'},
        {key: 'riv', value: 'riv', text: 'RIV'},
        {key: 'wel', value: 'wel', text: 'WEL'},
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
                                    <Button.Group size='small'>
                                    <Popup
                                        trigger={<Button icon={'clone'} onClick={() => this.props.onClone(b.id)}/>}
                                        content='Clone'
                                        position='top center'
                                        size='mini'
                                        inverted
                                    />
                                    <Popup
                                        trigger={<Button icon={'trash'} onClick={() => this.props.onRemove(b.id)}/>}
                                        content='Delete'
                                        position='top center'
                                        size='mini'
                                        inverted
                                    />
                                    </Button.Group>
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
            <Grid padded>
                <Grid.Row>
                    <Form.Group>
                        <Button as='div' labelPosition='left'>
                            <Dropdown
                                selection
                                options={this.boundaryTypes()}
                                onChange={(e, {value}) => this.setState({selectedType: value})}
                                value={this.state.selectedType}
                                style={{minWidth: '120px', width: '120px'}}
                            />
                            <Dropdown text='Add' icon='add' labeled button className='icon blue'>
                                <Dropdown.Menu>
                                    <Dropdown.Header>Choose type</Dropdown.Header>
                                    {this.boundaryTypes()
                                        .filter(b => b.value !== 'all')
                                        .map(o => <Dropdown.Item
                                                key={o.value}
                                                {...o}
                                                onClick={() => this.props.onAdd(o.value)}
                                            />
                                        )
                                    }
                                </Dropdown.Menu>
                            </Dropdown>
                        </Button>
                    </Form.Group>
                </Grid.Row>
                <Grid.Row>
                    {this.list()}
                </Grid.Row>
            </Grid>
        )
    }
}

BoundaryList.propTypes = {
    boundaries: PropTypes.instanceOf(BoundaryCollection).isRequired,
    onAdd: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
    onClone: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    selected: PropTypes.string
};

export default BoundaryList;
