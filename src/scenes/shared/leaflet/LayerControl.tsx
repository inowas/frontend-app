import { Accordion, Button, Checkbox, Icon, Segment } from 'semantic-ui-react';
import { Layer, Util } from 'leaflet';
import { LayersControlProvider } from './layerControlContext';
import { useMapEvents } from 'react-leaflet';
import { useState } from 'react';
import _ from 'lodash';
import createControlledLayer from './controlledLayer';

const POSITION_CLASSES: { [key: string]: string } = {
  bottomleft: 'leaflet-bottom leaflet-left',
  bottomright: 'leaflet-bottom leaflet-right',
  topleft: 'leaflet-top leaflet-left',
  topright: 'leaflet-top leaflet-right'
};

interface IProps {
  position: string;
  children: Node;
}

const LayerControl = ({ position, children }: IProps) => {
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const [layers, setLayers] = useState<Layer[]>([]);
  const positionClass = (position && POSITION_CLASSES[position]) || POSITION_CLASSES.topright;

  const map = useMapEvents({
    layerremove: () => {
      // console.log("layer removed");
    },
    layeradd: () => {
      // console.log("layer add");
    },
    overlayadd: (layer: Layer, extra) => {
      // console.log(layer, extra);
    }
  });

  const onLayerClick = (layerObj) => {
    if (map?.hasLayer(layerObj.layer)) {
      map.removeLayer(layerObj.layer);
      setLayers(
        layers.map((layer: Layer) => {
          if (layer.id === layerObj.id) {
            return {
              ...layer,
              checked: false
            };
          }
          return layer;
        })
      );
    } else {
      map.addLayer(layerObj.layer);
      setLayers(
        layers.map((layer: Layer) => {
          if (layer.id === layerObj.id) {
            return {
              ...layer,
              checked: true
            };
          }
          return layer;
        })
      );
    }
  };

  const onGroupAdd = (layer: Layer, name: string, group: string) => {
    setLayers((_layers: Layer[]) => [
      ..._layers,
      {
        layer,
        group,
        name,
        checked: map?.hasLayer(layer),
        id: Util.stamp(layer)
      }
    ]);
  };

  const groupedLayers = _.groupBy(layers, 'group');

  return (
    <LayersControlProvider
      value={{
        layers,
        addGroup: onGroupAdd
      }}
    >
      <div className={positionClass}>
        <div className="leaflet-control leaflet-bar">
          {
            <Segment
              onMouseEnter={() => setCollapsed(false)}
              onMouseLeave={() => setCollapsed(true)}
            >
              {collapsed && (
                <Button icon>
                  <Icon fontSize="default" />
                </Button>
              )}
              {!collapsed && Object.keys(groupedLayers).map((section, index) => (
                <Accordion key={`${section} ${index}`}>
                  <Accordion.Title
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Icon name='dropdown' />{section}
                  </Accordion.Title>
                  {groupedLayers[section]?.map((layerObj, key) => (
                    <Accordion.Content key={key}>
                      <Checkbox
                        checked={layerObj.checked}
                        onChange={() => onLayerClick(layerObj)}
                        name="checkedB"
                        color="primary"
                      />{layerObj.name}
                    </Accordion.Content>
                  ))}
                </Accordion>
              ))}
            </Segment>
          }
        </div>
        {children}
      </div>
    </LayersControlProvider>
  );
}

const GroupedLayer = createControlledLayer(function addGroup(
  layersControl,
  layer,
  name,
  group
) {
  layersControl.addGroup(layer, name, group);
});

export default LayerControl;
export { GroupedLayer };
