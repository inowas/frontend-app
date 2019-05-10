import React from 'react';
import PropTypes from 'prop-types';
import {Button, Icon, Menu, Popup} from 'semantic-ui-react';
import {pure} from 'recompose';
import {Soilmodel} from '../../../../../core/model/modflow/soilmodel';

const LayersList = ({addLayer, soilmodel, onClick, onClone, onRemove, selected}) => {
    return (
        <div>
            <Button positive icon='plus' labelPosition='left'
                    onClick={addLayer}
                    content={'Add Layer'}
            >
            </Button>
            <Menu fluid vertical tabular>
                {soilmodel.layersCollection.reorder().all.map(layer => (
                    <Menu.Item
                        name={layer.name}
                        key={layer.id}
                        active={layer.id === selected}
                        onClick={() => onClick(layer.id)}
                    >
                        <Popup
                            trigger={<Icon name='ellipsis horizontal'/>}
                            content={
                                <div>
                                    <Button.Group size='small'>
                                        <Popup
                                            trigger={<Button icon={'clone'}
                                                             onClick={() => onClone(layer)}/>}
                                            content='Clone'
                                            position='top center'
                                            size='mini'
                                        />
                                        {layer.number !== 0 && <Popup
                                            trigger={<Button icon={'trash'}
                                                             onClick={() => onRemove(layer.id)}/>}
                                            content='Delete'
                                            position='top center'
                                            size='mini'
                                        />}
                                    </Button.Group>
                                </div>
                            }
                            on={'click'}
                            position={'right center'}
                        />
                        {layer.number}: {layer.name}
                    </Menu.Item>
                ))}
            </Menu>
        </div>
    );
};

LayersList.propTypes = {
    addLayer: PropTypes.func.isRequired,
    soilmodel: PropTypes.instanceOf(Soilmodel).isRequired,
    onClick: PropTypes.func.isRequired,
    onClone: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    selected: PropTypes.string
};

export default pure(LayersList);
