import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Grid, Menu, Segment} from 'semantic-ui-react';
import {ModflowModel} from '../../../../../core/model/modflow';
import {BoundaryCollection} from '../../../../../core/model/modflow/boundaries';
import {IRootReducer} from '../../../../../reducers';
import {sendCommand} from '../../../../../services/api';
import {updateModel} from '../../../actions/actions';
import ModflowModelCommand from '../../../commands/modflowModelCommand';
import DiscretizationImport from './discretizationImport';
import GridEditor from './gridEditor';
import StressperiodsEditor from './stressperiodsEditor';

const discretization = () => {

        const menuItems = [
            {id: 'grid', name: 'Spatial discretization'},
            {id: 'stressperiods', name: 'Time discretization'}
        ];

        const [selected, setSelected] = useState<string>(menuItems[0].id);
        const [isDirty, setIsDirty] = useState<boolean>(false);
        const [isError, setIsError] = useState<boolean>(false);

        const dispatch = useDispatch();

        const handleChangeModel = (m: ModflowModel) => {
            dispatch(updateModel(m));
            setIsDirty(true);
        };

        const handleChangeSelected = (id: string) => () => setSelected(id);

        const T03 = useSelector((state: IRootReducer) => state.T03);
        const model = T03.model ? ModflowModel.fromObject(T03.model) : null;
        const boundaries = T03.boundaries ? BoundaryCollection.fromObject(T03.boundaries) : null;

        const handleSave = (m: ModflowModel) => {
            const command = ModflowModelCommand.updateModflowModelDiscretization(
                m.id,
                m.geometry.toObject(),
                m.boundingBox.toObject(),
                m.gridSize.toObject(),
                m.cells.toObject(),
                m.stressperiods.toObject(),
                m.lengthUnit.toInt(),
                m.timeUnit.toInt()
            );

            return sendCommand(command, () => {
                    setIsDirty(false);
                    setIsError(false);
                    dispatch(updateModel(m));
                }
            );
        };

        const renderDetails = (id: string) => {
            if (!model || !boundaries) {
                return null;
            }

            switch (id) {
                case 'grid': {
                    return (
                        <GridEditor
                            model={model}
                            boundaries={boundaries}
                            isDirty={isDirty}
                            isError={isError}
                            onChange={handleChangeModel}
                            onSave={handleSave}
                        />
                    );
                }
                case 'stressperiods': {
                    return (
                        <StressperiodsEditor
                            model={model}
                            boundaries={boundaries}
                            isDirty={isDirty}
                            isError={isError}
                            onChange={handleChangeModel}
                            onSave={handleSave}
                        />
                    );
                }
            }
        };

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

                                {model && !model.readOnly && boundaries && boundaries.length === 0 &&
                                <DiscretizationImport onChange={handleChangeModel} model={model}/>}
                            </Menu>
                        </Grid.Column>
                        <Grid.Column width={13}>
                            {renderDetails(selected)}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        );
    }
;

export default discretization;
