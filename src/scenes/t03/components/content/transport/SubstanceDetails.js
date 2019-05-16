import React from 'react';
import PropTypes from 'prop-types';
import {Button, Form, Grid, Header, Table} from 'semantic-ui-react';
import {Substance} from '../../../../../core/model/modflow/transport';
import {BoundaryCollection} from '../../../../../core/model/modflow';


class SubstanceDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            substance: props.substance.toObject(),
            newBoundaryId: null,
            newBoundaryConcentration: 0
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            substance: nextProps.substance.toObject()
        });
    }

    handleSelectBoundary = (e, {value}) => {
        return this.setState({newBoundaryId: value})
    };

    handleChangeConcentration = (e, {value}) => {
        return this.setState({newBoundaryConcentration: parseFloat(value)})
    };

    handleLocalChange = (e, {name, value}) => {
        const {substance} = this.state;
        substance[name] = value;

        this.setState({
            substance
        });
    };

    addBoundary = () => {
        const substance = Substance.fromObject(this.state.substance);
        substance.addBoundaryId(this.state.newBoundaryId);
        substance.updateConcentration(this.state.newBoundaryId, this.state.newBoundaryConcentration);
        this.props.onChange(substance);
        return this.setState({
            newBoundaryId: null,
            newBoundaryConcentration: 0,
            substance: substance.toObject()
        })
    };

    removeBoundary = bid => {
        const substance = Substance.fromObject(this.state.substance);
        substance.removeBoundaryId(bid);
        return this.setState({
            substance: substance.toObject()
        })
    };

    handleChange = () => {
        return this.props.onChange(Substance.fromObject(this.state.substance))
    };

    render() {
        const {boundaries, readOnly} = this.props;
        const substance = Substance.fromObject(this.state.substance);
        const {boundaryConcentrations} = substance;

        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column>
                        <Form.Input
                            disabled={readOnly}
                            name='name'
                            value={substance.name}
                            label={'Substance name'}
                            onBlur={this.handleChange}
                            onChange={this.handleLocalChange}
                        />
                        <Header as={'h2'}>Selected Boundaries</Header>
                        <Table basic>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Boundary</Table.HeaderCell>
                                    <Table.HeaderCell>Concentration</Table.HeaderCell>
                                    <Table.HeaderCell>#</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>


                            <Table.Body>
                                {boundaryConcentrations.map((bc, idx) => {
                                    return (
                                        <Table.Row key={idx}>
                                            <Table.Cell>{boundaries.findById(bc.id).name}</Table.Cell>
                                            <Table.Cell>{bc.concentration}</Table.Cell>
                                            <Table.Cell>
                                                <Button
                                                    disabled={readOnly}
                                                    primary
                                                    onClick={() => this.removeBoundary(bc.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </Table.Cell>
                                        </Table.Row>
                                    )
                                })}
                                <Table.Row/>
                            </Table.Body>
                        </Table>

                        <Header as={'h2'}>Add Boundary</Header>
                        <Table basic>
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell>
                                        <Form.Select
                                            disabled={readOnly}
                                            name='boundaries'
                                            onChange={this.handleSelectBoundary}
                                            options={boundaries.all.map(b => ({
                                                value: b.id,
                                                text: b.name
                                            }))}
                                            value={this.state.newBoundaryId}
                                        />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Form.Input
                                            type={'number'}
                                            disabled={readOnly}
                                            value={this.state.newBoundaryConcentration}
                                            onChange={this.handleChangeConcentration}
                                        />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Button
                                            disabled={this.state.newBoundaryId === null}
                                            primary
                                            onClick={this.addBoundary}
                                        >
                                            Add
                                        </Button>
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

SubstanceDetails.propTypes = {
    boundaries: PropTypes.instanceOf(BoundaryCollection).isRequired,
    onChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool,
    substance: PropTypes.instanceOf(Substance).isRequired
};

export default SubstanceDetails;
