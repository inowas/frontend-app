import { Accordion, AccordionProps, Button, Form, Icon, Menu, SemanticICONS } from 'semantic-ui-react';
import { DomEvent, Layer, Util } from 'leaflet';
import { EditControl } from 'react-leaflet-draw';
import { IDrawEvents } from './types';
import { LayersControlProvider } from './layerControlContext';
import { MouseEvent, useEffect, useRef } from 'react';
import { ReactElement, useState } from 'react';
import { groupBy } from 'lodash';
import { useMapEvents } from 'react-leaflet';
import createControlledLayer from './controlledLayer';
import md5 from 'md5';

const POSITION_CLASSES: { [key: string]: string } = {
  bottomleft: 'leaflet-bottom leaflet-left',
  bottomright: 'leaflet-bottom leaflet-right',
  topleft: 'leaflet-top leaflet-left',
  topright: 'leaflet-top leaflet-right',
};

interface IProps {
  children: Array<ReactElement | null> | ReactElement;
  events?: IDrawEvents;
  position: string;
}

interface ILayerObj {
  layer: Layer;
  group: string;
  name: string;
  checked: boolean;
  id: number;
  radio?: boolean;
}

const groupIcons: { [key: string]: SemanticICONS } = {
  Boundaries: 'point',
  Cells: 'block layout',
  Data: 'area chart',
  Default: 'question circle',
  Discretization: 'thumb tack',
  Grid: 'grid layout',
};

const LayerControl = ({ position, children, events }: IProps) => {
  const [activeGroup, setActiveGroup] = useState<number>(0);
  const [collapsed, setCollapsed] = useState(true);
  const [layers, setLayers] = useState<ILayerObj[]>([]);
  const positionClass = (position && POSITION_CLASSES[position]) || POSITION_CLASSES.topright;

  const divRef = useRef<any>(null);

  useEffect(() => {
    if (divRef && divRef.current) {
      DomEvent.disableClickPropagation(divRef.current);
    }
  });

  const map = useMapEvents({
    layerremove: () => {
      //console.log(add);
    },
    layeradd: () => {
      //console.log(e);
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
          if (layer.id === layerObj.id) {
            return {
              ...layer,
              checked: false,
            };
          }
          return layer;
        })
      );
    } else {
      map.addLayer(layerObj.layer);
      setLayers(
        layers.map((layer) => {
          if (layer.id === layerObj.id) {
            return {
              ...layer,
              checked: true,
            };
          }
          return layer;
        })
      );
    }
  };

  const onRadioClick = (layerObj: ILayerObj) => {
    const layersInGroup = layers.filter((l) => l.id !== layerObj.id && l.group === layerObj.group);
    layersInGroup.forEach((l) => {
      map?.removeLayer(l.layer);
    });

    if (!map?.hasLayer(layerObj.layer)) {
      map.addLayer(layerObj.layer);
      setLayers(
        layers.map((layer) => {
          if (layer.group === layerObj.group && layer.id !== layerObj.id) {
            return {
              ...layer,
              checked: false,
            };
          }
          if (layer.id === layerObj.id) {
            return {
              ...layer,
              checked: true,
            };
          }
          return layer;
        })
      );
    }
  };

  const onGroupAdd = (layer: any, name: string, group: string, radio?: boolean) => {
    const cLayers = layers;
    cLayers.push({
      layer,
      group,
      name,
      checked: map?.hasLayer(layer),
      id: Util.stamp(layer),
      radio,
    });

    setLayers(cLayers);
  };

  const groupedLayers = groupBy(layers, 'group');

  const handleClickEdit = () => {
    console.log(groupedLayers);
    const filteredLayer = groupedLayers.Discretization?.filter((l) => l.name === 'Model Area');

    console.log(map);

    if (map && filteredLayer.length > 0) {
      const toolbar = (
        <EditControl
          edit={true}
          leaflet={{
            map,
            layerContainer: filteredLayer[0].layer,
          }}
        />
      );
      console.log(toolbar);
    }
  };

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
      <div className={positionClass} ref={divRef}>
        <div className="leaflet-control leaflet-bar">
          <div onMouseEnter={() => setCollapsed(false)} onMouseLeave={() => setCollapsed(true)}>
            {collapsed && (
              <div className="leaflet-draw leaflet-draw-toolbar-top">
                <span
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    textDecoration: 'none',
                    backgroundImage: 'none',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '300px 30px',
                    backgroundClip: 'padding-box',
                    backgroundColor: '#fff',
                    borderBottom: '1px solid #ccc',
                    width: '30px',
                    height: '30px',
                    lineHeight: '30px',
                    color: 'black',
                  }}
                >
                  <Icon link name="bars" fontSize="default" style={{ margin: '0' }} />
                </span>
              </div>
            )}
            {!collapsed && (
              <Accordion as={Menu} vertical>
                {events && events.onEdited && (
                  <Menu.Item>
                    <Button onClick={handleClickEdit} labelPosition="left" fluid icon>
                      <Icon name="edit" /> Edit
                    </Button>
                  </Menu.Item>
                )}
                {Object.keys(groupedLayers).map((section, index) => (
                  <Menu.Item key={md5(`${section} ${index}`)}>
                    <Accordion.Title
                      as={Menu.Header}
                      active={activeGroup === index}
                      onClick={handleClickGroup}
                      index={index}
                    >
                      <Icon name="dropdown" />
                      <Icon name={groupIcons[section] || groupIcons.Default} /> {section}
                    </Accordion.Title>
                    <Accordion.Content as={Menu.Menu} active={activeGroup === index} key={`accDetails_${index}`}>
                      <Form>
                        {groupedLayers[section]?.map((layerObj, index) => (
                          <Form.Field as={Menu.Item} key={md5(`${layerObj} ${index}`)}>
                            {layerObj.radio ? (
                              <Form.Radio
                                checked={layerObj.checked}
                                onChange={() => onRadioClick(layerObj)}
                                name="checkedB"
                                color="primary"
                                label={layerObj.name}
                              />
                            ) : (
                              <Form.Checkbox
                                checked={layerObj.checked}
                                onChange={() => onLayerClick(layerObj)}
                                name="checkedB"
                                color="primary"
                                label={layerObj.name}
                              />
                            )}
                          </Form.Field>
                        ))}
                      </Form>
                    </Accordion.Content>
                  </Menu.Item>
                ))}
              </Accordion>
            )}
          </div>
        </div>
        {children}
      </div>
    </LayersControlProvider>
  );
};

const GroupedLayer = createControlledLayer((layersControl, layer, name, group, radio) => {
  layersControl.addGroup(layer, name, group, radio);
});

export default LayerControl;
export { GroupedLayer };
