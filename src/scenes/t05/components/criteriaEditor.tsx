import React, {ChangeEvent, SyntheticEvent, useEffect, useState} from 'react';
import {
    Button,
    DropdownProps,
    Grid,
    Header,
    Icon,
    Input,
    InputOnChangeData,
    Message,
    Radio,
    Segment,
    Select,
    Table
} from 'semantic-ui-react';
// import Graph from 'vis-react';
import {MCDA} from '../../../core/model/mcda';
import {CriteriaCollection, Criterion} from '../../../core/model/mcda/criteria';
import {CriteriaType, CriterionIndex, ICriterion} from '../../../core/model/mcda/criteria/Criterion.type';

const styles = {
    graph: {
        minHeight: '300px'
    },
    nodes: {
        color: {
            background: '#ffffff',
            border: '#000000'
        },
        shadow: true,
        shape: 'box',
        shapeProperties: {
            borderRadius: 0
        }
    },
    link: {
        lineHeight: '0.2em',
        backgroundColor: 'none'
    }
};

interface IProps {
    mcda: MCDA;
    toolName: string;
    onChange: (mcda: MCDA) => any;
    readOnly: boolean;
    routeTo: (route: string) => void;
}

const CriteriaEditor = (props: IProps) => {
    const [criteria, setCriteria] = useState<ICriterion[]>(props.mcda.criteriaCollection.toObject());
    const [showInfo, setShowInfo] = useState<boolean>(true);
    // const network = useRef<any>(null);

    useEffect(() => {
        setCriteria(props.mcda.criteriaCollection.toObject());
    }, [props.mcda]);

    const handleDismiss = () => setShowInfo(false);

    const handleAddCriteria = () => {
        if (props.readOnly) {
            return;
        }
        return props.onChange(props.mcda.addCriterion(Criterion.fromDefaults()));
    };

    const handleAddSubCriterion = (id: string) => () => {
        if (props.readOnly) {
            return;
        }
        return props.onChange(props.mcda.addSubCriterion(id));
    };

    const handleChangeCriterion = (criterion: Criterion) => {
        if (props.readOnly) {
            return;
        }
        return props.onChange(props.mcda.updateCriterion(criterion));
    };

    const handleClickAhp = () => {
        if (props.readOnly) {
            return;
        }
        return props.onChange(props.mcda.toggleAhp());
    };

    const handleRemoveCriterion = (id: string) => () => {
        if (props.readOnly) {
            return;
        }
        return props.onChange(props.mcda.removeCriterion(id));
    };

    const handleSelectChange = (id: string) => (e: SyntheticEvent<HTMLElement>, {name, value}: DropdownProps) => {
        const criteriaCollection = CriteriaCollection.fromObject(criteria);
        const criterion = criteriaCollection.findById(id);

        if (props.readOnly || !criterion) {
            return;
        }

        criterion[name as CriterionIndex] = value as CriteriaType;
        return handleChangeCriterion(Criterion.fromObject(criterion));
    };

    const handleBlur = (id: string) => () => {
        const criteriaCollection = CriteriaCollection.fromObject(criteria);
        const criterion = criteriaCollection.findById(id);

        if (props.readOnly || !criterion) {
            return;
        }

        return handleChangeCriterion(Criterion.fromObject(criterion));
    };

    const handleLocalChange = (id: string) => (
        e: ChangeEvent<HTMLInputElement>, {name, value}: InputOnChangeData
    ) => {
        const criteriaCollection = CriteriaCollection.fromObject(criteria);
        const criterion = criteriaCollection.findById(id);

        if (props.readOnly || !criterion) {
            return;
        }

        criterion[name as CriterionIndex] = value;
        return setCriteria(criteriaCollection.update(criterion).toObject());
    };

    let mainCriteria = criteria;

    if (props.mcda.withAhp) {
        mainCriteria = criteria.filter((c) => !c.parent);
    }

    // const options = {
    //     height: '500px',
    //     interaction: {
    //         dragNodes: true,
    //         dragView: true
    //     },
    //     manipulation: {
    //         enabled: false
    //     },
    //     nodes: styles.nodes,
    //     layout: {
    //         hierarchical: {
    //             direction: 'UD'
    //         }
    //     },
    //     edges: {
    //         color: '#000000'
    //     },
    //     physics: false
    // };
    //
    // const graph = {
    //     nodes: [{id: '0', label: props.toolName, level: 0}].concat(
    //         criteria.map((c) => {
    //                 return {
    //                     id: c.id,
    //                     label: c.name,
    //                     level: !c.parent ? 1 : 2
    //                 };
    //             }
    //         )
    //     ),
    //     edges: criteria.map((c, key) => {
    //         return {
    //             id: key,
    //             from: c.parent || 0,
    //             to: c.id
    //         };
    //     })
    // };

    const handleClickRouteToT04 = (route: string) => () => {
        return props.routeTo(route);
    };

    return (
        <Grid>
            <Grid.Row>
                <Grid.Column width={13}>
                    {showInfo &&
                    <Message onDismiss={handleDismiss}>
                        <Message.Header>Choose your criteria</Message.Header>
                        <p>For managed aquifer recharge (MAR) MCDA you can find information of former scientific
                            works and recommendations for criteria in our database:
                            <Button
                                basic={true}
                                style={styles.link}
                                onClick={handleClickRouteToT04('/tools/t04')}
                            >
                                T04
                            </Button>
                            Do not forget to specify, if a criteria is described by continuous or discrete values.
                        </p>
                        <p><b>Analytical Hierarchy Process</b> <i>(Saaty, 1980)</i>: Choose this method, to separate
                            your criteria in main and sub criteria. It is recommended, to use it for large numbers
                            of criteria. You should decide to use this method before adding criteria. </p>
                    </Message>
                    }
                </Grid.Column>
                <Grid.Column width={3}>
                    <Segment textAlign="center">
                        <Header as="h5" icon={true}>
                            <Icon name="sitemap"/>
                            Analytical Hierarchy Process</Header>
                        <Radio
                            checked={props.mcda.withAhp}
                            onChange={handleClickAhp}
                            toggle={true}
                            readOnly={props.readOnly}
                        />
                    </Segment>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column width={16}>
                    {props.mcda.weightAssignmentsCollection && props.mcda.weightAssignmentsCollection.length > 0 &&
                    <Message
                        content="To change, delete or add criteria, you have to delete all weight assignments first or
                        start a new project."
                        icon="lock"
                        warning={true}
                    />
                    }
                    {mainCriteria.length > 0 &&
                    <Table>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell/>
                                <Table.HeaderCell>Name</Table.HeaderCell>
                                <Table.HeaderCell>Type</Table.HeaderCell>
                                <Table.HeaderCell>Unit</Table.HeaderCell>
                                <Table.HeaderCell/>
                            </Table.Row>
                        </Table.Header>
                        {mainCriteria.map((c, key) =>
                            <Table.Body key={key}>
                                <Table.Row>
                                    <Table.Cell>{key + 1}</Table.Cell>
                                    <Table.Cell>
                                        <Input
                                            name={CriterionIndex.NAME}
                                            disabled={props.readOnly}
                                            value={c.name}
                                            onBlur={handleBlur(c.id)}
                                            onChange={handleLocalChange(c.id)}
                                        />
                                    </Table.Cell>
                                    <Table.Cell>
                                        {!props.mcda.withAhp &&
                                        <Select
                                            name={CriterionIndex.TYPE}
                                            disabled={props.readOnly}
                                            value={c.type}
                                            onChange={handleSelectChange(c.id)}
                                            options={[
                                                {key: 'discrete', value: CriteriaType.DISCRETE, text: 'Discrete'},
                                                {key: 'continuous', value: CriteriaType.CONTINUOUS, text: 'Continuous'}
                                            ]}
                                        />
                                        }
                                    </Table.Cell>
                                    <Table.Cell>
                                        {!props.mcda.withAhp &&
                                        <Input
                                            name={CriterionIndex.UNIT}
                                            disabled={props.readOnly}
                                            value={c.unit}
                                            onBlur={handleBlur(c.id)}
                                            onChange={handleLocalChange(c.id)}
                                        />
                                        }
                                    </Table.Cell>
                                    <Table.Cell textAlign="right">
                                        {!props.readOnly &&
                                        <Button.Group>
                                            {props.mcda.withAhp &&
                                            <Button
                                                icon={true}
                                                labelPosition="left"
                                                positive={true}
                                                onClick={handleAddSubCriterion(c.id)}
                                            >
                                                <Icon name="plus"/>
                                                Add sub criterion
                                            </Button>
                                            }
                                            <Button
                                                negative={true}
                                                icon="trash"
                                                onClick={handleRemoveCriterion(c.id)}
                                            />
                                        </Button.Group>
                                        }
                                    </Table.Cell>
                                </Table.Row>
                                {props.mcda.withAhp && criteria.filter((cc) => cc.parent === c.id).map((cc, ckey) =>
                                    <Table.Row key={cc.id}>
                                        <Table.Cell>{key + 1}.{ckey + 1}</Table.Cell>
                                        <Table.Cell>
                                            <Input
                                                name={CriterionIndex.NAME}
                                                disabled={props.readOnly}
                                                value={cc.name}
                                                onBlur={handleBlur(cc.id)}
                                                onChange={handleLocalChange(cc.id)}
                                            />
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Select
                                                name={CriterionIndex.TYPE}
                                                disabled={props.readOnly}
                                                value={cc.type}
                                                onChange={handleSelectChange(cc.id)}
                                                options={[
                                                    {key: 'discrete', value: 'discrete', text: 'Discrete'},
                                                    {key: 'continuous', value: 'continuous', text: 'Continuous'}
                                                ]}
                                            />
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Input
                                                name={CriterionIndex.UNIT}
                                                disabled={props.readOnly}
                                                value={cc.unit}
                                                onBlur={handleBlur(cc.id)}
                                                onChange={handleLocalChange(cc.id)}
                                            />
                                        </Table.Cell>
                                        <Table.Cell textAlign="right">
                                            {!props.readOnly &&
                                            <Button.Group>
                                                <Button
                                                    negative={true}
                                                    icon="trash"
                                                    onClick={handleRemoveCriterion(cc.id)}
                                                />
                                            </Button.Group>
                                            }
                                        </Table.Cell>
                                    </Table.Row>
                                )}
                            </Table.Body>
                        )}
                    </Table>
                    }
                    {!props.readOnly &&
                    <Button
                        fluid={true}
                        onClick={handleAddCriteria}
                    >
                        Add new {props.mcda.withAhp ? 'main' : ''} criterion
                    </Button>
                    }
                </Grid.Column>
            </Grid.Row>
            {/*{props.mcda.withAhp &&*/}
            {/*<Grid.Row>*/}
            {/*    <Grid.Column with={16}>*/}
            {/*        <Graph*/}
            {/*            ref={network}*/}
            {/*            graph={graph}*/}
            {/*            options={options}*/}
            {/*            style={styles.graph}*/}
            {/*        />*/}
            {/*    </Grid.Column>*/}
            {/*</Grid.Row>*/}
            {/*}*/}
        </Grid>
    );
};

export default CriteriaEditor;
