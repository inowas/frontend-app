import {BoundaryCollection} from '../../../../../core/model/modflow/boundaries';
import {BoundarySelection, BoundaryType} from '../../../../../core/model/modflow/boundaries/Boundary.type';
import {Button, Divider, Dropdown, DropdownProps, Grid, Header, Icon, Menu} from 'semantic-ui-react';
import {IBoundaryComparisonItem} from '../../../../../core/model/modflow/boundaries/BoundaryCollection';
import {ModflowModel, Soilmodel} from '../../../../../core/model/modflow';
import BoundaryDetailsImport from './boundaryDetailsImport';
import BoundarySynchronizer from './boundarySychronizer';
import React from 'react';

interface IBoundaryTypeObject {
    key: BoundarySelection;
    text: string;
    value: BoundarySelection;
}

interface IProps {
    currentBoundaries: BoundaryCollection;
    newBoundaries: BoundaryCollection;
    model: ModflowModel;
    soilmodel: Soilmodel;
    selectedBoundary: string | null;
    types?: BoundaryType[];
    onBoundaryClick: (bid: string) => void;
}

interface IState {
    boundaryList: IBoundaryComparisonItem[];
    selectedType: string;
}

class BoundaryComparator extends React.Component<IProps, IState> {
    public constructor(props: IProps) {
        super(props);
        this.state = {
            boundaryList: props.currentBoundaries.compareWith(props.model.stressperiods, props.newBoundaries),
            selectedType: props.types && props.types.length === 1 ? props.types[0] : 'all'
        };
    }

    public componentWillReceiveProps(nextProps: IProps) {
        this.setState({
            selectedType: nextProps.types && nextProps.types.length === 1 ? nextProps.types[0] : 'all',
            boundaryList: nextProps.currentBoundaries.compareWith(
                nextProps.model.stressperiods, nextProps.newBoundaries
            )
        });
    }

    public render() {
        const {types, selectedBoundary} = this.props;
        const {boundaryList} = this.state;

        if (selectedBoundary === null) {
            return null;
        }

        let boundary = this.props.newBoundaries.findById(selectedBoundary);
        if (!boundary) {
            boundary = this.props.currentBoundaries.findById(selectedBoundary);
        }

        return (
            <div>
                <Divider horizontal={true}>
                    <Header as="h4">
                        <Icon name="eye" />
                        Preview Changes
                    </Header>
                </Divider>

                    <Grid stackable={true}>
                        <Grid.Row>
                            <Grid.Column width={4}>
                                        {types && types.length === 1 ?
                                            <Button
                                                className="blue"
                                                fluid={true}
                                                icon={true}
                                                labelPosition="left"
                                            >
                                                <Icon name="plus"/>
                                                Add
                                            </Button>
                                            :
                                                <Button as="div" labelPosition="left">
                                                    <Dropdown
                                                        selection={true}
                                                        options={this.boundaryTypes().map((b) => {
                                                            let numberOfBoundaries = boundaryList.length;
                                                            if (b.value !== 'all') {
                                                                numberOfBoundaries = boundaryList
                                                                    .filter((e) => (e.type === b.value)).length;
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
                                                    />
                                                </Button>
                                        }

                                        {this.list()}

                            </Grid.Column>
                            <Grid.Column width={12}>
                                {boundary && <BoundaryDetailsImport
                                    boundary={boundary}
                                    boundaries={this.props.newBoundaries}
                                    model={this.props.model}
                                    soilmodel={this.props.soilmodel}
                                    onChange={this.noHandle}
                                    onClick={this.noHandle}
                                    readOnly={true}
                                />}
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                <BoundarySynchronizer
                    currentBoundaries={this.props.currentBoundaries}
                    newBoundaries={this.props.newBoundaries}
                    model={this.props.model}
                />
            </div>
        );
    }

    private noHandle = () => ({});

    private boundaryTypes = (): IBoundaryTypeObject[] => {
        if (this.props.types) {
            const types = this.props.types.length > 1 ?
                [{key: 'all' as BoundarySelection, value: 'all' as BoundarySelection, text: 'All'}] : [];
            return types.concat(this.props.types.map((type: BoundarySelection) => {
                return {key: type as BoundarySelection, value: type as BoundarySelection, text: type.toUpperCase()};
            }));
        }

        return [
            {key: 'all', value: 'all', text: 'All types'},
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
        const {selectedType, boundaryList} = this.state;
        let selectedBoundaryItems = boundaryList;
        if (selectedType !== 'all') {
            selectedBoundaryItems = selectedBoundaryItems.filter((b) => b.type === selectedType);
        }

        return (
            <Menu
                fluid={true}
                vertical={true}
                tabular={true}
            >
                {selectedBoundaryItems.map((b: IBoundaryComparisonItem) => (
                    <Menu.Item
                        name={b.name}
                        key={b.id}
                        active={b.id === this.props.selectedBoundary}
                        onClick={this.handleClick(b.id)}
                    >
                        {b.name}
                    </Menu.Item>
                ))}
            </Menu>
        );
    };

    private handleClick = (id: string) => () => this.props.onBoundaryClick(id);

    private handleLocalChange = (e: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => this.setState({
        selectedType: data.value as BoundarySelection
    });

}

export default BoundaryComparator;
