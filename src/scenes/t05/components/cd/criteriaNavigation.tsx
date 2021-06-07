import { CriteriaCollection } from '../../../../core/model/mcda/criteria';
import {Form, Icon, Input, InputOnChangeData, Menu, MenuItemProps, Segment} from 'semantic-ui-react';
import {MCDA} from '../../../../core/model/mcda';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import {criterionStep} from '../../defaults/defaults';
import React, {ChangeEvent, MouseEvent, useState} from 'react';

const styles = {
    noPaddingBottom: {
        paddingBottom: 0,
        paddingTop: 5
    }
};

interface IProps extends RouteComponentProps<any> {
    activeCriterion: string | null;
    onClick: (e: MouseEvent<HTMLAnchorElement>, {name}: MenuItemProps) => any;
    mcda: MCDA;
    readOnly: boolean;
}

const CriteriaNavigation = (props: IProps) => {
    const [searchTerm, setSearchTerm] = useState<string>('');

    const handleSearchCriterion = (e: ChangeEvent<HTMLInputElement>, {value}: InputOnChangeData) => {
        setSearchTerm(value);
    };

    const filteredCriteria = () => {
        const {mcda} = props;
        let criteria = mcda.criteriaCollection.toObject();

        if (mcda.withAhp) {
            criteria = mcda.criteriaCollection.findBy('parent', null, false);
        }

        if (searchTerm === '') {
            return criteria;
        }

        return CriteriaCollection.fromObject(criteria).filterBy('name', searchTerm);
    };

    const items = filteredCriteria().map((criterion, key) => (
        <Menu.Item
            active={props.activeCriterion !== null && criterion.id === props.activeCriterion}
            key={key}
            name={criterion.id}
            onClick={props.onClick}
        >
            {criterion.suitability && criterion.suitability.url !== '' &&
            criterion.step === criterionStep.AFTER_RECLASSIFICATION &&
            <Icon name="check circle" color="green"/>
            }
            {criterion.name}
        </Menu.Item>
    ));

    return (
        <Segment color={'black'}>
            <Menu secondary={true} vertical={true} style={{width: '100%'}}>
                <Menu.Item header={true} style={styles.noPaddingBottom}>Grid Size</Menu.Item>
                <Menu.Item style={styles.noPaddingBottom}>
                    <Form>
                        <Form.Group widths="equal">
                            <Form.Input
                                fluid={true}
                                readOnly={true}
                                type="number"
                                label="Columns"
                                name="n_x"
                                value={props.mcda.gridSize.nX}
                            />
                            <Form.Input
                                fluid={true}
                                readOnly={true}
                                type="number"
                                label="Rows"
                                name="n_y"
                                value={props.mcda.gridSize.nY}
                            />
                        </Form.Group>
                    </Form>
                </Menu.Item>
                <Menu.Item header={true} style={styles.noPaddingBottom}>Criteria</Menu.Item>
                <Menu.Item>
                    <Input
                        icon="search"
                        name="criteriaSearch"
                        value={searchTerm}
                        onChange={handleSearchCriterion}
                        placeholder="Search criterion..."
                    />
                </Menu.Item>
                {items}
            </Menu>
        </Segment>
    );
};

export default withRouter(CriteriaNavigation);
