import React from 'react';
import PropTypes from 'prop-types';
import {Button, Icon, Menu} from 'semantic-ui-react';
import {pure} from 'recompose';
import {Soilmodel} from 'core/model/modflow/soilmodel';

const LayersList = ({addLayer, soilmodel, onChange, selected}) => {
    return (
        <div>
            <Button onClick={addLayer} fluid>
                <Icon name='plus' />
                New Layer
            </Button>
            <Menu fluid vertical tabular>
                {soilmodel.layersCollection.all.map(layer => (
                    <Menu.Item
                        name={layer.name}
                        key={layer.id}
                        active={layer.id === selected}
                        onClick={() => onChange(layer.id)}
                    >
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
    onChange: PropTypes.func.isRequired,
    selected: PropTypes.string
};

export default pure(LayersList);
