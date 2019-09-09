import React from 'react';
import {Button, Dropdown, DropdownProps, Form, Grid, Icon, Menu, Popup} from 'semantic-ui-react';
import {Boundary, BoundaryCollection} from '../../../../../core/model/modflow/boundaries';
import {BoundarySelection, BoundaryType} from '../../../../../core/model/modflow/boundaries/Boundary.type';

interface IBoundaryTypeObject {
    key: BoundarySelection;
    text: string;
    value: BoundarySelection;
}

interface IBoundaryListProps {
    boundaries: BoundaryCollection;
    onAdd: (type: BoundaryType) => any;
    onClick: (id: string) => any;
    onClone: (id: string) => any;
    onRemove: (id: string) => any;
    readOnly: boolean;
    selected?: string;
    types?: BoundaryType[];
}

interface IBoundaryListState {
    selectedType: BoundarySelection;
}

class BoundaryList extends React.Component<IBoundaryListProps, IBoundaryListState> {
    public constructor(props: IBoundaryListProps) {
        super(props);
        this.state = {
            selectedType: props.types && props.types.length === 1 ? props.types[0] : 'all'
        };
    }

    public componentWillReceiveProps(nextProps: IBoundaryListProps) {
        this.setState({
            selectedType: nextProps.types && nextProps.types.length === 1 ? nextProps.types[0] : 'all'
        });
    }

    public render() {
        const {boundaries, readOnly, types} = this.props;

        return (
            <Grid padded={true}>
                <Grid.Row style={{paddingTop: 0}}>
                    {types && types.length === 1 ?
                        <Button
                            className="blue"
                            fluid={true}
                            icon={true}
                            labelPosition="left"
                            onClick={this.handleAdd(types[0])}
                            disabled={readOnly}
                        >
                            <Icon name="plus"/>
                            Add
                        </Button>
                        :
                        <Form.Group>
                            <Button as="div" labelPosition="left">
                                <Dropdown
                                    selection={true}
                                    options={this.boundaryTypes().map((b) => {
                                        let numberOfBoundaries = boundaries.length;
                                        if (b.value !== 'all') {
                                            numberOfBoundaries = boundaries.findBy('type', b.value).length;
                                        }

                                        const name = `${b.text} (${numberOfBoundaries})`;

                                        return {
                                            ...b,
                                            disabled: b.value !== 'all' && numberOfBoundaries === 0,
                                            text: name
                                        };
                                    })}
                                    onChange={this.handleLocalChange}
                                    value={this.state.selectedType}
                                    style={{minWidth: '120px', width: '120px'}}
                                />
                                <Dropdown
                                    text="Add"
                                    icon="add"
                                    labeled={true}
                                    button={true}
                                    className="icon blue"
                                    disabled={readOnly}
                                >
                                    <Dropdown.Menu>
                                        <Dropdown.Header>Choose type</Dropdown.Header>
                                        {this.boundaryTypes()
                                            .filter((b) => b.value !== 'all')
                                            .map((o) =>
                                                <Dropdown.Item
                                                    key={o.value}
                                                    {...o}
                                                    onClick={this.handleAdd(o.value)}
                                                />
                                            )
                                        }
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Button>
                        </Form.Group>
                    }
                </Grid.Row>
                <Grid.Row>
                    {this.list()}
                </Grid.Row>
            </Grid>
        );
    }

    private boundaryTypes = (): IBoundaryTypeObject[] => {
        if (this.props.types) {
            const types = this.props.types.length > 1 ?
                [{key: 'all' as BoundarySelection, value: 'all' as BoundarySelection, text: 'All'}] : [];
            return types.concat(this.props.types.map((type: BoundarySelection) => {
                return {key: type as BoundarySelection, value: type as BoundarySelection, text: type.toUpperCase()};
            }));
        }

        return [
            {key: 'all', value: 'all', text: 'All'},
            {key: 'chd', value: 'chd', text: 'CHD'},
            {key: 'drn', value: 'drn', text: 'DRN'},
            {key: 'evt', value: 'evt', text: 'EVT'},
            {key: 'ghb', value: 'ghb', text: 'GHB'},
            {key: 'rch', value: 'rch', text: 'RCH'},
            {key: 'riv', value: 'riv', text: 'RIV'},
            {key: 'wel', value: 'wel', text: 'WEL'},
        ];
    };

    private list = () => {
        const {selectedType} = this.state;
        let selectedBoundaries = this.props.boundaries.boundaries;
        if (selectedType !== 'all') {
            selectedBoundaries = selectedBoundaries.filter((b) => b.type === selectedType);
        }

        return (
            <Menu
                fluid={true}
                vertical={true}
                tabular={true}
            >
                {selectedBoundaries.map((b: Boundary) => (
                    <Menu.Item
                        name={b.name}
                        key={b.id}
                        active={b.id === this.props.selected}
                        onClick={this.handleClick(b.id)}
                    >
                        {!this.props.readOnly && <Popup
                            trigger={<Icon name="ellipsis horizontal"/>}
                            content={
                                <div>
                                    <Button.Group size="small">
                                        <Popup
                                            trigger={<Button icon={'clone'} onClick={this.handleClone(b.id)}/>}
                                            content="Clone"
                                            position="top center"
                                            size="mini"
                                        />
                                        <Popup
                                            trigger={<Button icon={'trash'} onClick={this.handleRemove(b.id)}/>}
                                            content="Delete"
                                            position="top center"
                                            size="mini"
                                        />
                                    </Button.Group>
                                </div>
                            }
                            on={'click'}
                            position={'right center'}
                        />
                        }
                        {b.name}
                    </Menu.Item>
                ))}
            </Menu>
        );
    };

    private handleLocalChange = (e: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => this.setState({
        selectedType: data.value as BoundarySelection
    });

    private handleAdd = (type: BoundarySelection) => () => {
        if (type !== 'all') {
            this.props.onAdd(type);
        }
    };
    private handleClick = (id: string) => () => this.props.onClick(id);
    private handleClone = (id: string) => () => this.props.onClone(id);
    private handleRemove = (id: string) => () => this.props.onRemove(id);
}

export default BoundaryList;
