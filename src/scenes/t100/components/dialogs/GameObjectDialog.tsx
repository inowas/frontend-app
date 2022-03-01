import { List } from 'semantic-ui-react';
import Dialog from '../shared/Dialog';
import GameObject from '../../../../core/marPro/GameObject';
import React, { useState } from 'react';
import Slider from 'rc-slider';

interface IProps {
  gameObject: GameObject;
  onChange: (gameObject: GameObject) => void;
  onClose: (id: string) => void;
}

const GameObjectDialog = (props: IProps) => {
  const [activeValue, setActiveValue] = useState<number>();
  const [activeSlider, setActiveSlider] = useState<string | null>(null);

  const { gameObject } = props;

  const handleCloseDialog = () => props.onClose(gameObject.id);

  const handleChangeSlider = (id: string) => (value: number) => {
    setActiveSlider(id);
    setActiveValue(value);
  };

  const handleAfterChangeSlider = () => {
    if (!activeValue || !activeSlider) {
      return null;
    }
    const cGameObject = gameObject.toObject();
    cGameObject.parameters = cGameObject.parameters.map((p) => {
      if (p.id === activeSlider) {
        p.value = activeValue;
      }
      return p;
    });
    setActiveSlider(null);
    props.onChange(GameObject.fromObject(cGameObject));
  };

  return (
    <Dialog
      header={gameObject.type}
      image={gameObject.type}
      content={
        <List>
          <List.Item>object_id: {gameObject.id}</List.Item>
          <List.Item>
            [{gameObject.location.x}, {gameObject.location.y}]
          </List.Item>
          {gameObject.parameters.map((p) => (
            <React.Fragment key={`${gameObject.id}_${p.id}`}>
              <List.Item>
                {p.id}: {activeSlider === p.id ? activeValue : p.value}
              </List.Item>
              <List.Item>
                <Slider
                  min={p.min}
                  max={p.max}
                  step={1}
                  value={activeSlider === p.id ? activeValue : p.value}
                  onChange={handleChangeSlider(p.id)}
                  onAfterChange={handleAfterChangeSlider}
                />
              </List.Item>
              {p.relations &&
                p.relations.map((r) => (
                  <List.Item key={`${gameObject.id}_${p.id}_${r.resourceId}`}>
                    {r.resourceId}: {r.relation || '1:1'}
                  </List.Item>
                ))}
            </React.Fragment>
          ))}
        </List>
      }
      onClose={handleCloseDialog}
    />
  );
};

export default GameObjectDialog;
