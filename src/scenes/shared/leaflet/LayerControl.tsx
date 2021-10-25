import { Accordion, AccordionProps, Form, Icon, Menu, Segment } from 'semantic-ui-react';
import { Layer, LayerGroup, Util } from 'leaflet';
import { LayersControlProvider } from './layerControlContext';
import { ReactElement, useState } from 'react';
import { groupBy, isEmpty, uniqBy } from 'lodash';
import { useMapEvents } from 'react-leaflet';
import React, { MouseEvent } from 'react';
import createControlledLayer from './controlledLayer';

const POSITION_CLASSES: { [key: string]: string } = {
  bottomleft: 'leaflet-bottom leaflet-left',
  bottomright: 'leaflet-bottom leaflet-right',
  topleft: 'leaflet-top leaflet-left',
  topright: 'leaflet-top leaflet-right',
};

interface IProps {
  children: Array<ReactElement | null> | ReactElement;
  position: string;
}

interface ILayerObj {
  layer: Layer;
  group: string;
  name: string;
  checked: boolean;
  id: number;
}

const LayerControl = ({ position, children }: IProps) => {
  const [activeGroup, setActiveGroup] = useState<number>(0);
  const [collapsed, setCollapsed] = useState(true);
  const [layers, setLayers] = useState<ILayerObj[]>([]);
  const positionClass = (position && POSITION_CLASSES[position]) || POSITION_CLASSES.topright;

  const map = useMapEvents({
    layerremove: () => {
      //console.log('layer removed');
    },
    layeradd: () => {
      //console.log('layer add');
    },
    overlayadd: () => {
      //console.log(layers);
    },
  });

  const onLayerClick = (layerObj: ILayerObj) => {
    if (map?.hasLayer(layerObj.layer)) {
      map.removeLayer(layerObj.layer);
      setLayers(
        layers.map((layer) => {
          if (layer.id === layerObj.id)
            return {
              ...layer,
              checked: false,
            };
          return layer;
        })
      );
    } else {
      map.addLayer(layerObj.layer);
      setLayers(
        layers.map((layer) => {
          if (layer.id === layerObj.id)
            return {
              ...layer,
              checked: true,
            };
          return layer;
        })
      );
    }
  };

  const onGroupAdd = (layer: any, name: string, group: string) => {
    const cLayers = layers;
    cLayers.push({
      layer,
      group,
      name,
      checked: map?.hasLayer(layer),
      id: Util.stamp(layer),
    });

    setLayers(cLayers);
  };

  const groupedLayers = groupBy(layers, 'group');

  const handleClickGroup = (e: MouseEvent, titleProps: AccordionProps) => {
    const { index } = titleProps;
    const newIndex = activeGroup === index ? -1 : index;
    setActiveGroup(newIndex);
  };

  return (
    <LayersControlProvider
      value={{
        layers,
        addGroup: onGroupAdd,
      }}
    >
      <div className={positionClass}>
        <div className="leaflet-control leaflet-bar">
          <Segment onMouseEnter={() => setCollapsed(false)} onMouseLeave={() => setCollapsed(true)}>
            {collapsed && <Icon link name="bars" fontSize="default" />}
            {!collapsed && (
              <Accordion as={Menu} vertical>
                {Object.keys(groupedLayers).map((section, index) => (
                  <Menu.Item key={`${section} ${index}`}>
                    <Accordion.Title active={activeGroup === index} onClick={handleClickGroup} index={index}>
                      <Icon name="dropdown" />
                      {section}
                    </Accordion.Title>
                    <Accordion.Content active={activeGroup === index} key={`accDetails_${index}`}>
                      <Form>
                        {groupedLayers[section]?.map((layerObj, index) => (
                          <Form.Field key={`${layerObj} ${index}`}>
                            <Form.Checkbox
                              checked={layerObj.checked}
                              onChange={() => onLayerClick(layerObj)}
                              name="checkedB"
                              color="primary"
                              label={layerObj.name}
                            />
                          </Form.Field>
                        ))}
                      </Form>
                    </Accordion.Content>
                  </Menu.Item>
                ))}
              </Accordion>
            )}
          </Segment>
        </div>
        {children}
      </div>
    </LayersControlProvider>
  );
};

const GroupedLayer = createControlledLayer((layersControl, layer, name, group) => {
  layersControl.addGroup(layer, name, group);
});

export default LayerControl;
export { GroupedLayer };
