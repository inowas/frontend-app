import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Grid, Menu, Segment} from 'semantic-ui-react';
import {ModflowModel} from '../../../../../core/model/modflow';
import {BoundaryCollection} from '../../../../../core/model/modflow/boundaries';
import {updateModel} from '../../../actions/actions';
import DiscretizationImport from './discretizationImport';
import GridEditor from './gridEditor';
import StressperiodsEditor from './stressperiodsEditor';

const menuItems = [
    {id: 'grid', name: 'Spatial discretization', component: <GridEditor/>},
    {id: 'stressperiods', name: 'Time discretization', component: <StressperiodsEditor/>}
];

const discretization = () => {

    const [selected, setSelected] = useState<string>(menuItems[0].id);

    const dispatch = useDispatch();
    const handleChangeModel = (m: ModflowModel) => dispatch(updateModel(m));
    const handleChangeSelected = (id: string) => () => setSelected(id);

    const T03 = useSelector((state: any) => state.T03);
    const model = T03.model && ModflowModel.fromObject(T03.model);
    const boundaries = T03.boundaries && BoundaryCollection.fromObject(T03.boundaries);

    return (
        <Segment color={'grey'}>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={3}>
                        <Menu
                            fluid={true}
                            vertical={true}
                            tabular={true}
                        >
                            <Menu.Item>&nbsp;</Menu.Item>
                            {menuItems.map((i) =>
                                <Menu.Item
                                    key={i.id}
                                    active={i.id === selected}
                                    onClick={handleChangeSelected(i.id)}
                                >
                                    {i.name}
                                </Menu.Item>
                            )}
                            <Menu.Item>&nbsp;</Menu.Item>

                            {model && !model.readOnly && boundaries.length === 0 &&
                            <DiscretizationImport onChange={handleChangeModel} model={model}/>}
                        </Menu>
                    </Grid.Column>
                    <Grid.Column width={13}>
                        {menuItems.filter((i) => i.id === selected)[0].component}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>
    );
};

export default discretization;
