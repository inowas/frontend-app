import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {Grid, Header, Menu, Segment} from 'semantic-ui-react';
import {BoundaryCollection, Calculation, ModflowModel} from 'core/model/modflow';
import {fetchUrl} from 'services/api';
import {last} from 'lodash';
import ResultsMap from '../../maps/resultsMap';
import ResultsChart from './resultsChart';

const menuItems = [
    {id: 'head', name: 'Heads'},
    {id: 'drawdown', name: 'Drawdowns'},
    {id: 'budget', name: 'Budgets'}
];

class Results extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedMenuItem: menuItems[0].id,
            metaData: null,
            isLoading: false,

            selectedCol: 0,
            selectedLay: 0,
            selectedRow: 0,
            selectedTotim: null,
            selectedType: null,
            data: null,
            fetching: false
        }
    }

    componentDidMount() {
        this.fetchMetaData();
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (!this.state.metadata) {
            this.fetchMetaData();
        }
    }

    fetchMetaData() {
        const {model} = this.props;
        const {calculation} = model;

        if (!calculation) {
            return null;
        }

        this.setState({isLoading: true},
            () => fetchUrl(`modflowmodels/${model.id}/results`,
                metaData => {
                    this.setState({metaData, isLoading: false});
                    this.onChangeTypeLayerOrTime({
                        type: this.state.selectedMenuItem,
                        totim: last(metaData.times.total_times),
                        layer: 0
                    });
                },
                (e) => this.setState({isError: e, isLoading: false}))
        );
    }

    fetchData({layer, totim, type}) {
        const calculationId = this.state.metaData.calculation_id;

        this.setState({fetching: true},
            () => fetchUrl(`calculations/${calculationId}/results/types/${type}/layers/${layer}/totims/${totim}`,
                data => this.setState({
                    selectedLay: layer,
                    selectedTotim: totim,
                    selectedType: type,
                    data,
                    fetching: false
                }),
                (e) => this.setState({isError: e})
            )
        )
    }

    onChangeTypeLayerOrTime = ({type = null, layer = null, totim = null}) => {
        const {selectedLay, selectedType, selectedTotim} = this.state;
        type = type || selectedType;
        layer = layer || selectedLay;
        totim = totim || selectedTotim;

        if (totim === selectedTotim && type === selectedType && layer === selectedLay) {
            return;
        }

        this.fetchData({layer, totim, type});
    };

    render() {
        const {selectedMenuItem, metaData, data, selectedCol, selectedRow} = this.state;
        const {model, boundaries} = this.props;

        if (!metaData) {
            return null;
        }

        return (
            <Segment color={'grey'} loading={this.state.isLoading}>
                <Grid padded>
                    <Grid.Row>
                        <Grid.Column width={3}>
                            <Menu fluid vertical tabular>
                                <Menu.Item>&nbsp;</Menu.Item>
                                {menuItems.map(i =>
                                    <Menu.Item
                                        name={i.name}
                                        key={i.id}
                                        active={i.id === selectedMenuItem}
                                        onClick={() => {
                                            this.onChangeTypeLayerOrTime({type: i.id});
                                            this.setState({selectedMenuItem: i.id})
                                        }}
                                    />
                                )}
                                <Menu.Item>&nbsp;</Menu.Item>
                            </Menu>
                        </Grid.Column>
                        <Grid.Column width={13}>
                            <Segment loading={this.state.fetching} color={'grey'}>
                                {data &&
                                <ResultsMap
                                    boundaries={boundaries}
                                    data={data}
                                    model={model}
                                    onClick={colRow => {this.setState({
                                        selectedRow: colRow[1],
                                        selectedCol: colRow[0]
                                    })}}
                                />
                                }
                            </Segment>

                            <Grid>
                                <Grid.Row columns={2}>
                                    <Grid.Column>
                                        <Segment loading={this.state.fetching} color={'blue'}>
                                            <Header textAlign={'center'} as={'h4'}>Horizontal cross section</Header>
                                            {data && <ResultsChart data={data} row={selectedRow} col={selectedCol} show={'row'}/>}
                                        </Segment>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Segment loading={this.state.fetching} color={'blue'}>
                                            <Header textAlign={'center'} as={'h4'}>Vertical cross section</Header>
                                            {data && <ResultsChart data={data} col={selectedCol} row={selectedRow} show={'col'}/>}
                                        </Segment>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        )
    }
}


const mapStateToProps = state => {
    return {
        model: ModflowModel.fromObject(state.T03.model),
        boundaries: BoundaryCollection.fromObject(state.T03.boundaries),
    };
};

Results.proptypes = {
    calculation: PropTypes.instanceOf(Calculation).isRequired,
    model: PropTypes.instanceOf(ModflowModel).isRequired,
};

export default connect(mapStateToProps)(Results);
