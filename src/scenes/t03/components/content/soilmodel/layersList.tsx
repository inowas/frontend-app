import {Button, Icon, Menu, Popup} from 'semantic-ui-react';
import {ISoilmodelLayer} from '../../../../../core/model/modflow/soilmodel/SoilmodelLayer.type';
import {LayersCollection} from '../../../../../core/model/modflow/soilmodel';
import React from 'react';
import SoilmodelLayer from '../../../../../core/model/modflow/soilmodel/SoilmodelLayer';

interface IProps {
    layers: LayersCollection;
    onClick: (layerId: string) => any;
    onClone: (layer: SoilmodelLayer) => any;
    onRemove: (layerId: string) => any;
    readOnly: boolean;
    selected?: string;
}

const LayersList = ({layers, onClick, onClone, onRemove, readOnly, selected}: IProps) => {

    const handleClick = (id: string) => {
        return () => onClick(id);
    };

    const handleClone = (layer: SoilmodelLayer) => {
        return () => onClone(layer);
    };

    const handleRemove = (id: string) => {
        return () => onRemove(id);
    };

    const rLayers: ISoilmodelLayer[] = layers.reorder().all as ISoilmodelLayer[];

    return (
        <div>
            <Menu fluid={true} vertical={true} secondary={true}>
                {rLayers.map((layer: ISoilmodelLayer) => (
                    <Menu.Item
                        name={layer.name}
                        key={layer.id}
                        active={layer.id === selected}
                        onClick={handleClick(layer.id)}
                    >
                        {!readOnly &&
                        <Popup
                            trigger={<Icon name="ellipsis horizontal"/>}
                            content={
                                <div>
                                    <Button.Group size="small">
                                        <Popup
                                            trigger={
                                                <Button
                                                    icon={'clone'}
                                                    onClick={handleClone(SoilmodelLayer.fromObject(layer))}
                                                />
                                            }
                                            content="Clone"
                                            position="top center"
                                            size="mini"
                                        />
                                        {layer.number !== 0 && <Popup
                                            trigger={
                                                <Button
                                                    icon={'trash'}
                                                    onClick={handleRemove(layer.id)}
                                                />
                                            }
                                            content="Delete"
                                            position="top center"
                                            size="mini"
                                        />}
                                    </Button.Group>
                                </div>
                            }
                            on={'click'}
                            position={'right center'}
                        />
                        }
                        {layer.number}: {layer.name}
                    </Menu.Item>
                ))}
            </Menu>
        </div>
    );
};

export default LayersList;
