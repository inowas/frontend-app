import React, {ChangeEvent, SyntheticEvent, useEffect, useState} from 'react';
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

const substanceDetails = (props: IProps) => {
    const [selectedBoundary, setSelectedBoundary] = useState<string | null>(null);
    const [substance, setSubstance] = useState<ISubstance | null>(null);

    useEffect(() => {
        setSelectedBoundary(props.substance && props.substance.boundaryConcentrations.filter(
            (bc) => bc.id === selectedBoundary
        ).length === 1 ? selectedBoundary : null);
        setSubstance(props.substance ? props.substance.toObject() : null);
    }, [props.substance]);

    const handleSelectBoundary = (id: string) => () => {
        setSelectedBoundary(id);
    };

    if (!substance) {
        return <NoContent message={'No substances defined.'}/>;
    }

    const addBoundary = (e: SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
        const value = data.value;
        const cSubstance = Substance.fromObject(substance);
        if (value && typeof value === 'string') {
            cSubstance.addBoundaryId(value);
            cSubstance.updateConcentrations(value, props.stressperiods.stressperiods.map(() => 0));
            setSelectedBoundary(value);
            setSubstance(cSubstance.toObject());
            return props.onChange(cSubstance);
        }
    };

    const removeBoundary = () => {
        const cSubstance = Substance.fromObject(substance);
        if (selectedBoundary) {
            cSubstance.removeBoundaryId(selectedBoundary);
            setSelectedBoundary(null);
            setSubstance(cSubstance.toObject());
            return props.onChange(cSubstance);
        }
    };

    const handleChange = () => props.onChange(Substance.fromObject(substance));

    const handleLocalChange = (e: ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => setSubstance({
        ...substance,
        [data.name]: data.value
    });

    const handleChangeSubstance = (s: Substance) => props.onChange(s);

    const {boundaryConcentrations} = substance;

    const filteredBoundaries = props.boundaries.all.filter((b) => boundaryConcentrations
        .filter((bc) => bc.id === b.id).length === 0);

    return (
        <Grid>
            <Grid.Row>
                <Grid.Column>
                    <Form>
                        <Form.Field>
                            <Form.Input
                                disabled={props.readOnly}
                                name="name"
                                value={substance.name}
                                label={'Substance name'}
                                onBlur={handleChange}
                                onChange={handleLocalChange}
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
                                onChange={addBoundary}
                                text="Add Boundary"
                            />
                            {selectedBoundary &&
                            <Button
                                disabled={props.readOnly}
                                labelPosition="left"
                                icon={true}
                                negative={true}
                                onClick={removeBoundary}
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
                                    {substance.boundaryConcentrations.map(
                                        (bc, key) => {
                                            const boundary = props.boundaries.all.filter((b) => b.id === bc.id);
                                            return (
                                                <Label
                                                    onClick={handleSelectBoundary(bc.id)}
                                                    color={selectedBoundary === bc.id ? 'blue' : 'grey'}
                                                    as="a"
                                                    key={key}
                                                >
                                                    {boundary.length > 0 ? boundary[0].name : 'UNDEFINED'}
                                                </Label>
                                            );
                                        }
                                    )}
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column>
                                    {selectedBoundary && props.substance &&
                                    <SubstanceValuesDataTable
                                        selectedBoundaryId={selectedBoundary}
                                        onChange={handleChangeSubstance}
                                        readOnly={props.readOnly}
                                        stressperiods={props.stressperiods}
                                        substance={props.substance}
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
};

export default substanceDetails;
