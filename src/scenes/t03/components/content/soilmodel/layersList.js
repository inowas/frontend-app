import React from 'react';
import PropTypes from 'prop-types';
import {Button, Icon, Menu} from 'semantic-ui-react';
import LayersCollection from 'core/model/modflow/soilmodel/LayersCollection';
import {pure} from 'recompose';

const LayersList = ({addLayer, layers, onChange, selected}) => {
    return (
        <div>
            <Button onClick={addLayer} fluid>
                <Icon name='plus' />
                New Layer
            </Button>
            <Menu fluid vertical tabular>
                {layers.all.map(layer => (
                    <Menu.Item
                        name={layer.name}
                        key={layer.id}
                        active={layer.id === selected}
                        onClick={() => onChange(layer.id)}
                    />
                ))}
            </Menu>
        </div>
    );
};

LayersList.propTypes = {
    addLayer: PropTypes.func.isRequired,
    layers: PropTypes.instanceOf(LayersCollection).isRequired,
    onChange: PropTypes.func.isRequired,
    selected: PropTypes.string
};

export default pure(LayersList);
