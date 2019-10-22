import React, {MouseEvent, useState} from 'react';
import {
    Button,
    Dropdown,
    DropdownItemProps,
    Grid,
    Icon,
    Menu, MenuItemProps,
    Message,
    Table
} from 'semantic-ui-react';
import {MCDA} from '../../../../core/model/mcda';
import {WeightAssignment} from '../../../../core/model/mcda/criteria';
import CriteriaCollection from '../../../../core/model/mcda/criteria/CriteriaCollection';
import {ICriterion} from '../../../../core/model/mcda/criteria/Criterion.type';
import {WeightAssignmentType} from '../../../../core/model/mcda/criteria/WeightAssignment.type';
import MultiInfluence from './multiInfluence';
import PairwiseComparison from './pairwise';
import Ranking from './ranking';
import Rating from './rating';

interface IProps {
    toolName: string;
    mcda: MCDA;
    selectedWeightAssignment?: WeightAssignment;
    onChange: (mcda: MCDA) => any;
    readOnly: boolean;
    routeTo?: (id: string) => any;
}

const weightAssignmentEditor = (props: IProps) => {
    const [showInfo, setShowInfo] = useState<boolean>(true);

    const handleDismiss = () => setShowInfo(false);

    const handleClickDelete = (id: string) => () => {
        return props.onChange(props.mcda.removeWeightAssignment(id));
    };

    const handleChange = (weightAssignment: WeightAssignment) => {
        return props.onChange(props.mcda.updateWeightAssignment(weightAssignment));
    };

    const handleClickNew = (cc: ICriterion[]) => (
        e: MouseEvent<HTMLAnchorElement | HTMLDivElement>, {name}: DropdownItemProps | MenuItemProps
    ) => {
        const wa = WeightAssignment.fromMethodAndCriteria(name, CriteriaCollection.fromObject(cc));
        if (props.mcda.withAhp) {
            wa.parent = cc[0].parent;
        }
        props.onChange(props.mcda.addWeightAssignment(wa));
        if (props.routeTo !== undefined) {
            return props.routeTo(wa.id);
        }
    };

    const renderContent = () => {
        const selectedWeightAssignment = props.selectedWeightAssignment || null;

        if (selectedWeightAssignment) {
            switch (selectedWeightAssignment.method) {
                case WeightAssignmentType.RATING:
                    return (
                        <Rating
                            weightAssignment={selectedWeightAssignment}
                            handleChange={handleChange}
                            readOnly={props.readOnly}
                        />
                    );
                case WeightAssignmentType.MULTI_INFLUENCE:
                    return (
                        <MultiInfluence
                            criteriaCollection={props.mcda.criteriaCollection}
                            toolName={props.toolName}
                            weightAssignment={selectedWeightAssignment}
                            handleChange={handleChange}
                            readOnly={props.readOnly}
                        />
                    );

                case WeightAssignmentType.PAIRWISE_COMPARISON:
                    return (
                        <PairwiseComparison
                            criteriaCollection={props.mcda.criteriaCollection}
                            weightAssignment={selectedWeightAssignment}
                            handleChange={handleChange}
                            readOnly={props.readOnly}
                        />
                    );

                default:
                    return (
                        <Ranking
                            weightAssignment={selectedWeightAssignment}
                            handleChange={handleChange}
                            readOnly={props.readOnly}
                        />
                    );
            }
        }
        return (
            <div>ERROR</div>
        );
    };

    const renderMethods = (name: string, criterion: ICriterion | null = null, key: number = -1) => {
        const subCriteria = !criterion ? mcda.criteriaCollection.findBy('parent', null) :
            mcda.criteriaCollection.findBy('parent', criterion.id);

        return (
            <Dropdown item={true} text={`${name} (${subCriteria.length})`} key={key}>
                <Dropdown.Menu>
                    <Dropdown.Item
                        name={WeightAssignmentType.RATING}
                        icon="write"
                        onClick={handleClickNew(subCriteria)}
                        text="Rating"
                    />
                    <Dropdown.Item
                        name={WeightAssignmentType.RANKING}
                        icon="ordered list"
                        onClick={handleClickNew(subCriteria)}
                        text="Ranking"
                    />
                    <Dropdown.Item
                        name={WeightAssignmentType.MULTI_INFLUENCE}
                        icon="fork"
                        onClick={handleClickNew(subCriteria)}
                        text="Multi-Influence"
                    />
                    <Dropdown.Item
                        name={WeightAssignmentType.PAIRWISE_COMPARISON}
                        icon="sliders horizontal"
                        onClick={handleClickNew(subCriteria)}
                        text="Pairwise Comparison"
                    />
                </Dropdown.Menu>
            </Dropdown>
        );
    };

    const renderMainCriterion = (parent: string | null) => {
        if (parent) {
            const parentCriterion = props.mcda.criteriaCollection.findById(parent);

            if (parentCriterion) {
                return parentCriterion.name;
            }
        }
        return 'Main Criertia';
    };

    const routeTo = (id: string) => () => props.routeTo !== undefined ? props.routeTo(id) : null;

    const {mcda, readOnly} = props;
    const mainCriteria = mcda.withAhp ?
        CriteriaCollection.fromObject(mcda.criteriaCollection.findBy('parent', null)) :
        mcda.criteriaCollection;

    if (props.selectedWeightAssignment) {
        return renderContent();
    }

    return (
        <Grid>
            {showInfo &&
            <Grid.Row>
                <Grid.Column width={16}>
                    <Message onDismiss={handleDismiss}>
                        <Message.Header>Weight Assignment</Message.Header>
                        <p>For suitability mapping it is necessary to give weight to each criterion. There are
                            different methods of weight assignment. Click on a method, to get further information
                            about it. You can perform as many weight assignments as you want, compare the results
                            and choose which method to use for the calculation in the end (Step suitability in the
                            left navigation).</p>
                        {mcda.withAhp &&
                        <p><b>Analytical hierarchy method:</b> You need to do a weight assignment for each criteria
                            set: the main criteria and each group of sub criteria.</p>
                        }
                    </Message>
                </Grid.Column>
            </Grid.Row>
            }
            <Grid.Row>
                <Grid.Column width={5}>
                    {!mcda.withAhp && !readOnly &&
                    <Menu icon="labeled" fluid={true} vertical={true}>
                        <Menu.Item
                            name={WeightAssignmentType.RATING}
                            onClick={handleClickNew(mainCriteria.toObject())}
                        >
                            <Icon name="write"/>
                            Rating
                        </Menu.Item>
                        <Menu.Item
                            name={WeightAssignmentType.RANKING}
                            onClick={handleClickNew(mainCriteria.toObject())}
                        >
                            <Icon name="ordered list"/>
                            Ranking
                        </Menu.Item>
                        <Menu.Item
                            name={WeightAssignmentType.MULTI_INFLUENCE}
                            onClick={handleClickNew(mainCriteria.toObject())}
                        >
                            <Icon name="fork"/>
                            Multi-Influence
                        </Menu.Item>
                        <Menu.Item
                            name={WeightAssignmentType.PAIRWISE_COMPARISON}
                            onClick={handleClickNew(mainCriteria.toObject())}
                        >
                            <Icon name="sliders horizontal"/>
                            Pairwise Comparison
                        </Menu.Item>
                    </Menu>
                    }
                    {mcda.withAhp && !readOnly &&
                    <Menu fluid={true} vertical={true}>
                        {renderMethods('Main Criteria')}
                        {mainCriteria.all.map((c, key) =>
                            renderMethods(`Sub Criteria of ${c.name}`, c, key)
                        )}
                    </Menu>
                    }
                </Grid.Column>
                <Grid.Column width={11}>
                    {mcda.weightAssignmentsCollection.length < 1 &&
                    <Message
                        icon="arrow left"
                        header="Adding new weight assignment methods"
                        content="You can do more than one weight assignment and compare your results and choose
                            which you want to use for the mcda in the end. Click on the appropriate icon on the left,
                            to add a new weight assignment."
                    />
                    }
                    {mcda.weightAssignmentsCollection.length > 0 &&
                    <Table>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Name</Table.HeaderCell>
                                {mcda.withAhp && <Table.HeaderCell>Criteria Group</Table.HeaderCell>}
                                <Table.HeaderCell/>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {mcda.weightAssignmentsCollection.all.map((wa) => (
                                <Table.Row key={wa.id}>
                                    <Table.Cell width={mcda.withAhp ? 8 : 14}>
                                        <Button
                                            basic={true}
                                            size="small"
                                            onClick={routeTo(wa.id)}
                                        >
                                            {wa.name}
                                        </Button>
                                    </Table.Cell>
                                    {mcda.withAhp &&
                                    <Table.Cell width={6}>
                                        {renderMainCriterion(wa.parent)}
                                    </Table.Cell>
                                    }
                                    <Table.Cell width={2} textAlign="right">
                                        {!readOnly &&
                                        <Button
                                            icon={true}
                                            negative={true}
                                            onClick={handleClickDelete(wa.id)}
                                            size="small"
                                        >
                                            <Icon name="trash"/>
                                        </Button>
                                        }
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                    }
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

export default weightAssignmentEditor;
