import { Button, Grid, Icon, List } from 'semantic-ui-react';
import { ICost } from '../../../../core/marPro/Tool.type';
import Dialog from '../shared/Dialog';
import GameObject from '../../../../core/marPro/GameObject';
import React, { useState } from 'react';
import Slider from 'rc-slider';

interface IProps {
  gameObject: GameObject;
  onChange: (gameObject: GameObject, costs: ICost[]) => void;
  onClose: (id: string) => void;
  onDelete: (gameObject: GameObject, costs: ICost[]) => void;
}

const GameObjectDialog = (props: IProps) => {
  const [activeValue, setActiveValue] = useState<number>(0);
  const [activeSlider, setActiveSlider] = useState<string | null>(null);
  const [isAfterChange, setIsAfterChange] = useState<boolean>(false);

  const { gameObject } = props;

  const handleCloseDialog = () => props.onClose(gameObject.id);

  const handleChangeSlider = (id: string) => (value: number) => {
    setActiveSlider(id);
    setActiveValue(value);
  };

  const handleAfterChangeSlider = () => setIsAfterChange(true);

  const handleCancelChange = () => {
    setActiveSlider(null);
    setIsAfterChange(false);
  };

  const handleConfirmChange = () => {
    if (!activeSlider) {
      return null;
    }
    const cGameObject = gameObject.toObject();
    cGameObject.parameters = cGameObject.parameters.map((p) => {
      if (p.id === activeSlider) {
        p.value = activeValue;
      }
      return p;
    });

    const costs: ICost[] = [];
    const parameter = gameObject.parameters.filter((p) => p.id === activeSlider);
    if (parameter.length > 0) {
      const diff = activeValue - parameter[0].value;
      parameter[0].relations?.forEach((relation) => {
        costs.push({
          amount: (relation.relation || 1) * diff,
          resource: relation.resourceId,
        });
      });
    }

    props.onChange(GameObject.fromObject(cGameObject), costs);
    setActiveSlider(null);
    setIsAfterChange(false);
  };

  const handleSell = () => {
    let costs: ICost[] = [];

    // Remove all resources which had been manipulated by this gameObject
    gameObject.parameters.forEach((parameter) => {
      const value = parameter.value;
      parameter.relations?.forEach((relation) => {
        const diff = (relation.relation || 1) * value;
        const fCosts = costs.filter((c) => c.resource === relation.resourceId);
        if (fCosts.length > 0) {
          costs = costs.map((cost) => {
            if (cost.resource === relation.resourceId) {
              cost.amount += diff;
            }
            return cost;
          });
        } else {
          costs.push({
            amount: -1 * diff,
            resource: relation.resourceId,
          });
        }
      });
    });

    props.onDelete(gameObject, costs);
  };

  if (isAfterChange && activeSlider) {
    const parameter = gameObject.parameters.filter((p) => p.id === activeSlider);
    if (parameter.length > 0) {
      const diff = activeValue - parameter[0].value;

      return (
        <Dialog
          header={gameObject.type}
          image={gameObject.type}
          content={
            <Grid style={{ width: '400px' }}>
              <Grid.Row>
                <Grid.Column width={16} textAlign="center">
                  Do you really want to change the value of parameter {parameter[0].id} to {activeValue}? It will{' '}
                  <b>{diff < 0 ? 'give' : 'cost'}</b> you:
                </Grid.Column>
              </Grid.Row>
              {parameter[0].relations &&
                parameter[0].relations.map((relation) => (
                  <Grid.Row key={relation.resourceId}>
                    <Grid.Column width={16} textAlign="center">
                      {Math.abs((relation.relation || 1) * diff)} {relation.resourceId}
                    </Grid.Column>
                  </Grid.Row>
                ))}
              <Grid.Row>
                <Grid.Column width={16}>
                  <Button.Group fluid widths={2}>
                    <Button negative onClick={handleCancelChange}>
                      Cancel
                    </Button>
                    <Button.Or />
                    <Button positive onClick={handleConfirmChange}>
                      Confirm
                    </Button>
                  </Button.Group>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          }
          onClose={handleCloseDialog}
        />
      );
    }
  }

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
              {!p.isFixed && (
                <>
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
                </>
              )}
            </React.Fragment>
          ))}
          {!gameObject.locationIsFixed && (
            <List.Item>
              <Button icon labelPosition="left" negative floated="right" onClick={handleSell}>
                <Icon name="eraser" />
                Sell
              </Button>
            </List.Item>
          )}
        </List>
      }
      onClose={handleCloseDialog}
    />
  );
};

export default GameObjectDialog;
