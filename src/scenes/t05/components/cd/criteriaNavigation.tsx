import React, {ChangeEvent, MouseEvent, useEffect, useState} from 'react';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import {Form, Icon, Input, InputOnChangeData, Menu, MenuItemProps, Segment} from 'semantic-ui-react';
import {GridSize} from '../../../../core/model/geometry';
import {IGridSize} from '../../../../core/model/geometry/GridSize.type';
import {MCDA} from '../../../../core/model/mcda';
import { CriteriaCollection } from '../../../../core/model/mcda/criteria';
import {criterionStep} from '../../defaults/defaults';

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
    handleChange: (mcda: MCDA) => any;
    readOnly: boolean;
}

const criteriaNavigation = (props: IProps) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [gridSize, setGridSize] = useState<IGridSize>(props.mcda.gridSize.toObject());

    useEffect(() => {
        setGridSize(props.mcda.gridSize.toObject());
    }, [props.mcda.gridSize]);

    const handleBlur = () => {
        const mcda = props.mcda;
        mcda.gridSize = GridSize.fromObject(gridSize);
        return props.handleChange(mcda);
    };

    const handleChangeGridSize = (e: ChangeEvent<HTMLInputElement>, {name, value}: InputOnChangeData) => {
        if (props.readOnly) {
            return;
        }
        return setGridSize({
                ...gridSize,
                [name]: value
            }
        );
    };

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

    const gridSizeEditable = props.mcda.criteriaCollection.all.filter((c) => c.raster.data.length > 0).length === 0;

    return (
        <Segment color={'black'}>
            <Menu secondary={true} vertical={true} style={{width: '100%'}}>
                <Menu.Item header={true} style={styles.noPaddingBottom}>Grid Size</Menu.Item>
                <Menu.Item style={styles.noPaddingBottom}>
                    <Form>
                        <Form.Group widths="equal">
                            <Form.Input
                                fluid={true}
                                disabled={!gridSizeEditable || props.readOnly}
                                type="number"
                                label="Columns"
                                name="n_x"
                                value={gridSize.n_x}
                                onBlur={handleBlur}
                                onChange={handleChangeGridSize}
                            />
                            <Form.Input
                                fluid={true}
                                disabled={!gridSizeEditable || props.readOnly}
                                type="number"
                                label="Rows"
                                name="n_y"
                                value={gridSize.n_y}
                                onBlur={handleBlur}
                                onChange={handleChangeGridSize}
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

export default withRouter(criteriaNavigation);
