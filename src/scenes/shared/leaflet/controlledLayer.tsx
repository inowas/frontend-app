import { IDrawEvents } from './types';
import { Layer } from 'leaflet';
import { LeafletProvider, useLeafletContext } from '@react-leaflet/core';
import { ReactNode } from 'react';
import { useLayerControlContext } from './layerControlContext';
import { useMap } from 'react-leaflet';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import md5 from 'md5';

interface IProps {
  checked?: boolean;
  name: string;
  group: string;
  children: ReactNode[] | ReactNode;
  radio?: boolean;
  events?: IDrawEvents;
}

const createControlledLayer = (
  addLayerToControl: (
    layerContext: any,
    layer: Layer,
    name: string,
    group: string,
    radio?: boolean,
    events?: IDrawEvents
  ) => any
) => {
  const ControlledLayer = (props: IProps) => {
    const context = useLeafletContext();
    const layerContext = useLayerControlContext();
    const propsRef = useRef(props);
    const parentMap = useMap();

    const [layer, setLayer] = useState<Layer | null>(null);

    const addLayer = useCallback(
      (layerToAdd) => {
        if (propsRef.current.checked) {
          parentMap.addLayer(layerToAdd);
        }

        addLayerToControl(
          layerContext,
          layerToAdd,
          propsRef.current.name,
          propsRef.current.group,
          propsRef.current.radio,
          propsRef.current.events
        );
        setLayer(layerToAdd);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [context]
    );

    const removeLayer = useCallback(
      (layerToRemove) => {
        context.layersControl?.removeLayer(layerToRemove);
        setLayer(null);
      },
      [context]
    );

    const newContext = useMemo(() => {
      return context
        ? Object.assign({}, context, {
            layerContainer: {
              addLayer,
              removeLayer,
            },
          })
        : null;
    }, [context, addLayer, removeLayer]);

    useEffect(() => {
      if (layer !== null && propsRef.current !== props) {
        if (props.checked === true && (propsRef.current.checked == null || propsRef.current.checked === false)) {
          parentMap.addLayer(layer);
        } else if (propsRef.current.checked === true && (props.checked == null || props.checked === false)) {
          parentMap.removeLayer(layer);
        }

        propsRef.current = props;
      }

      return () => {
        if (layer !== null) {
          context.layersControl = context.layersControl?.removeLayer(layer);
        }
      };
    });

    const x = props.children
      ? React.createElement(
          LeafletProvider,
          {
            key: md5(propsRef.current.group + propsRef.current.name + propsRef.current.children?.toString()),
            value: newContext,
          },
          props.children
        )
      : null;

    return x;
  };

  return ControlledLayer;
};

export default createControlledLayer;
