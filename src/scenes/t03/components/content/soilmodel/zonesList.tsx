import React from 'react';
import {pure} from 'recompose';
import {Button, Icon, Menu, Popup} from 'semantic-ui-react';
import {Zone, ZonesCollection} from '../../../../../core/model/modflow/soilmodel';
import LayersCollection from '../../../../../core/model/modflow/soilmodel/LayersCollection';
import {IZone} from '../../../../../core/model/modflow/soilmodel/Zone.type';

interface IProps {
    layers: LayersCollection;
    zones: ZonesCollection;
    onClick: (zoneId: string) => any;
    onClone: (zone: Zone) => any;
    onRemove: (zoneId: string) => any;
    readOnly: boolean;
    selected?: string;
}

const ZonesList = ({layers, zones, onClick, onClone, onRemove, readOnly, selected}: IProps) => {

    const handleClick = (id: string) => {
        return () => onClick(id);
    };

    const handleClone = (zone: Zone) => {
        return () => onClone(zone);
    };

    const handleRemove = (id: string) => {
        if (!isAffectingLayers(id)) {
            return () => onRemove(id);
        }
    };

    const isAffectingLayers = (id: string) => layers.getAffectedByZone(id).length > 0;

    return (
        <div>
            <Menu fluid={true} vertical={true} secondary={true}>
                {zones.all.map((zone: IZone) => (
                    <Menu.Item
                        name={zone.name}
                        key={zone.id}
                        active={zone.id === selected}
                        onClick={handleClick(zone.id)}
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
                                                    onClick={handleClone(Zone.fromObject(zone))}
                                                />
                                            }
                                            content="Clone"
                                            position="top center"
                                            size="mini"
                                        />
                                        <Popup
                                            trigger={
                                                <Button
                                                    disabled={isAffectingLayers(zone.id)}
                                                    icon={'trash'}
                                                    onClick={handleRemove(zone.id)}
                                                />
                                            }
                                            content="Delete"
                                            position="top center"
                                            size="mini"
                                        />
                                    </Button.Group>
                                </div>
                            }
                            on={'click'}
                            position={'right center'}
                        />
                        }
                        {zone.name}
                    </Menu.Item>
                ))}
            </Menu>
        </div>
    );
};

export default pure(ZonesList);
