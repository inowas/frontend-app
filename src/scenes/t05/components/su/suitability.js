import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {MCDA} from 'core/model/mcda';
import {WeightAssignmentsCollection} from 'core/model/mcda/criteria';
import {Button, Grid, Message, Radio, Segment, Table} from 'semantic-ui-react';
import {heatMapColors} from '../../defaults/gis';
import CriteriaRasterMap from '../cd/criteriaRasterMap';

const styles = {
    noMargin: {
        margin: 0
    },
    tableWrapper: {
        marginBottom: '10px'
    }
};

class Suitability extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showInfo: true
        }
    }

    handleDismiss = () => this.setState({showInfo: false});

    handleChangeWA = (parentId = null) => (e, {name}) => {
        const {mcda} = this.props;

        const wac = mcda.weightAssignmentsCollection.toArray().map(wa => {
            if (!mcda.withAhp) {
                wa.isActive = wa.id === name;
                return wa;
            }
            if (wa.id === name || (wa.isActive && parentId && wa.parent !== parentId)) {
                wa.isActive = true;
            }
            if (wa.isActive && parentId && (wa.parent === parentId || (!wa.parent && parentId === 'main')) && wa.id !== name) {
                wa.isActive = false;
            }
            return wa;
        });

        return this.props.handleChange({
            name: 'weights',
            value: WeightAssignmentsCollection.fromArray(wac)
        });
    };

    handleClickCalculation = () => {
        const mcda = this.props.mcda.calculate();
        return this.props.handleChange({
            name: 'mcda',
            value: mcda
        });
    };

    renderWATable() {
        const {mcda} = this.props;

        if (!mcda.withAhp) {
            return (
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell/>
                            <Table.HeaderCell>Method</Table.HeaderCell>
                            {mcda.criteriaCollection.all.map((c, ckey) =>
                                <Table.HeaderCell key={ckey}>{c.name}</Table.HeaderCell>
                            )}
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {mcda.weightAssignmentsCollection.all.map((wa, waKey) =>
                            <Table.Row key={waKey}>
                                <Table.Cell><Radio name={wa.id} onChange={this.handleChangeWA()}
                                                   checked={wa.isActive}/></Table.Cell>
                                <Table.Cell>{wa.name}</Table.Cell>
                                {wa.weightsCollection.all.map((w, wKey) =>
                                    <Table.Cell key={wKey}>{w.value.toFixed(3)}</Table.Cell>
                                )}
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table>
            );
        }

        const mainCriteria = mcda.criteriaCollection.findBy('parentId', null, {returnCollection: true});
        const mainCriteriaMethods = mcda.weightAssignmentsCollection.findBy('parent', null, {returnCollection: true});

        return (
            <div>
                <Segment textAlign='center' inverted color='grey' secondary style={styles.noMargin}>
                    Main Criteria
                </Segment>
                <div style={styles.tableWrapper}>
                    <Table>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell/>
                                <Table.HeaderCell>Method</Table.HeaderCell>
                                {mainCriteria.all.map((c, ckey) =>
                                    <Table.HeaderCell key={ckey}>{c.name}</Table.HeaderCell>
                                )}
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {mainCriteriaMethods.all.map((wa, cKey) =>
                                <Table.Row key={cKey}>
                                    <Table.Cell>
                                        <Radio name={wa.id} onChange={this.handleChangeWA('main')}
                                               checked={wa.isActive}/>
                                    </Table.Cell>
                                    <Table.Cell>{wa.name}</Table.Cell>
                                    {wa.weightsCollection.all.map((w, wKey) =>
                                        <Table.Cell key={wKey}>{w.value.toFixed(3)}</Table.Cell>
                                    )}
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                </div>
                {mainCriteria.all.map((mc, mcKey) =>
                    <div key={mcKey} style={styles.tableWrapper}>
                        <Segment textAlign='center' inverted color='grey' secondary style={styles.noMargin}>
                            {mc.name}
                        </Segment>
                        <Table style={styles.noMargin}>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell/>
                                    <Table.HeaderCell>Method</Table.HeaderCell>
                                    {mcda.criteriaCollection.findBy('parentId', mc.id).map((c, ckey) =>
                                        <Table.HeaderCell key={ckey}>{c.name}</Table.HeaderCell>
                                    )}
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {mcda.weightAssignmentsCollection.findBy('parent', mc.id).map((wa, cKey) =>
                                    <Table.Row key={cKey}>
                                        <Table.Cell>
                                            <Radio name={wa.id} onChange={this.handleChangeWA(mc.id)}
                                                   checked={wa.isActive}/>
                                        </Table.Cell>
                                        <Table.Cell>{wa.name}</Table.Cell>
                                        {wa.weightsCollection.all.map((w, wKey) =>
                                            <Table.Cell key={wKey}>{w.value.toFixed(3)}</Table.Cell>
                                        )}
                                    </Table.Row>
                                )}
                            </Table.Body>
                        </Table>
                    </div>
                )}
            </div>
        );
    }

    render() {
        const {mcda} = this.props;
        const {showInfo} = this.state;

        return (
            <div>
                {showInfo &&
                <Message onDismiss={this.handleDismiss}>
                    <Message.Header>Suitability</Message.Header>
                    <p>...</p>
                </Message>
                }
                <Grid columns={2}>
                    <Grid.Column>
                        {!mcda.withAhp &&
                        <Segment textAlign='center' inverted color='grey' secondary>
                            Select Weight Assignment
                        </Segment>
                        }
                        {this.renderWATable()}
                        <Button
                            disabled={mcda.weightAssignmentsCollection.findBy('isActive', true).length < 1}
                            onClick={this.handleClickCalculation}
                            primary
                            fluid
                        >
                            Start Calculation
                        </Button>
                    </Grid.Column>
                    <Grid.Column>
                        {mcda.suitability && mcda.suitability.data.length > 0 &&
                        <CriteriaRasterMap
                            raster={mcda.suitability}
                            showBasicLayer={true}
                            legend={mcda.suitability.generateRainbow(heatMapColors.default)}
                        />
                        }
                    </Grid.Column>
                </Grid>
            </div>
        )
    }
}

Suitability.proptypes = {
    handleChange: PropTypes.func.isRequired,
    mcda: PropTypes.instanceOf(MCDA).isRequired,
};

export default withRouter(Suitability);
