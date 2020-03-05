import React, {ChangeEvent, SyntheticEvent} from 'react';
import {
    Button,
    Dropdown,
    DropdownProps,
    Form,
    Grid,
    Header,
    Icon,
    InputOnChangeData,
    Label,
    Segment
} from 'semantic-ui-react';
import {Stressperiods} from '../../../../../core/model/modflow';
import {BoundaryCollection} from '../../../../../core/model/modflow/boundaries';
import {Substance} from '../../../../../core/model/modflow/transport';
import {ISubstance} from '../../../../../core/model/modflow/transport/Substance.type';
import NoContent from '../../../../shared/complexTools/noContent';
import {SubstanceValuesDataTable} from './index';

interface IProps {
    boundaries: BoundaryCollection;
    onChange: (substance: Substance) => any;
    readOnly?: boolean;
    substance?: Substance;
    stressperiods: Stressperiods;
}

interface IState {
    selectedBoundaryId: string | null;
    substance?: ISubstance;
}

class SubstanceDetails extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            selectedBoundaryId: null,
            substance: props.substance && props.substance.toObject()
        };
    }

    public componentWillReceiveProps(nextProps: IProps) {
        this.setState({
            selectedBoundaryId: nextProps.substance && nextProps.substance.boundaryConcentrations
                .filter((bc) => bc.id === this.state.selectedBoundaryId).length === 1
                ? this.state.selectedBoundaryId : null,
            substance: nextProps.substance && nextProps.substance.toObject()
        });
    }

    public handleSelectBoundary = (id: string) => () => {
        return this.setState({selectedBoundaryId: id});
    };

    public addBoundary = (e: SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
        if (!this.state.substance) {
            return null;
        }
        const value = data.value;
        const substance = Substance.fromObject(this.state.substance);
        if (value && typeof value === 'string') {
            substance.addBoundaryId(value);
            substance.updateConcentrations(value, this.props.stressperiods.stressperiods.map(() => 0));
            return this.setState({
                selectedBoundaryId: value,
                substance: substance.toObject()
            }, this.props.onChange(substance));
        }
    };

    public removeBoundary = () => {
        if (!this.state.substance) {
            return null;
        }
        const {selectedBoundaryId} = this.state;
        const substance = Substance.fromObject(this.state.substance);
        if (selectedBoundaryId) {
            substance.removeBoundaryId(selectedBoundaryId);
            return this.setState({
                selectedBoundaryId: null,
                substance: substance.toObject()
            }, this.props.onChange(substance));
        }
    };

    public handleChange = () => {
        if (!this.state.substance) {
            return null;
        }
        return this.props.onChange(Substance.fromObject(this.state.substance));
    };

    public handleLocalChange = (e: ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
        if (!this.state.substance) {
            return null;
        }
        return this.setState((prevState: IState) => ({
            substance: {
                ...prevState.substance,
                [data.name]: data.value
            } as ISubstance
        }));
    };

    public handleChangeSubstance = (substance: Substance) => {
        return this.props.onChange(substance);
    };

    public renderBoundary(boundaryId: string, key: number) {
        const boundary = this.props.boundaries.all.filter((b) => b.id === boundaryId);

        if (boundary.length !== 1) {
            return;
        }

        return (
            <Label
                onClick={this.handleSelectBoundary(boundary[0].id)}
                color={this.state.selectedBoundaryId === boundary[0].id ? 'blue' : 'grey'}
                as="a"
                key={key}
            >
                {boundary[0].name}
            </Label>
        );
    }

    public render() {
        const {boundaries, readOnly} = this.props;
        const {selectedBoundaryId} = this.state;

        if (!this.state.substance) {
            return <NoContent message={'No substances defined.'}/>;
        }

        const substance = Substance.fromObject(this.state.substance);
        const {boundaryConcentrations} = substance;

        const filteredBoundaries = boundaries.all.filter((b) => boundaryConcentrations
            .filter((bc) => bc.id === b.id).length === 0);

        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column>
                        <Form>
                            <Form.Field>
                                <Form.Input
                                    disabled={readOnly}
                                    name="name"
                                    value={substance.name}
                                    label={'Substance name'}
                                    onBlur={this.handleChange}
                                    onChange={this.handleLocalChange}
                                    width={'8'}
                                />
                            </Form.Field>
                            <Form.Field>
                                <Dropdown
                                    button={true}
                                    disabled={filteredBoundaries.length === 0}
                                    className="icon"
                                    floating={true}
                                    labeled={true}
                                    icon="plus"
                                    options={filteredBoundaries.map((b, key) => ({
                                        key,
                                        value: b.id,
                                        text: b.name
                                    }))}
                                    onChange={this.addBoundary}
                                    text="Add Boundary"
                                />
                                {selectedBoundaryId &&
                                <Button
                                    disabled={readOnly}
                                    labelPosition="left"
                                    icon={true}
                                    negative={true}
                                    onClick={this.removeBoundary}
                                >
                                    <Icon name="trash"/> Remove Boundary
                                </Button>
                                }
                            </Form.Field>
                        </Form>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Segment>
                            <Grid>
                                <Grid.Row>
                                    <Grid.Column>
                                        <Header as={'h5'}>Boundary Conditions:</Header>
                                        {boundaryConcentrations.map((bc, key) => this.renderBoundary(bc.id, key))}
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column>
                                        {selectedBoundaryId && this.props.substance &&
                                        <SubstanceValuesDataTable
                                            selectedBoundaryId={selectedBoundaryId}
                                            onChange={this.handleChangeSubstance}
                                            readOnly={readOnly}
                                            stressperiods={this.props.stressperiods}
                                            substance={this.props.substance}
                                        />
                                        }
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Segment>
                    </Grid.Column>
                </Grid.Row>

            </Grid>
        );
    }
}

export default SubstanceDetails;
