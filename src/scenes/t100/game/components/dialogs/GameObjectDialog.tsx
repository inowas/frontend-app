import { Button, Grid, Icon, List } from 'semantic-ui-react';
import { ICost } from '../../../../../core/marPro/Tool.type';
import { IParameterRelation } from '../../../../../core/marPro/Parameter.type';
import { isArray } from 'lodash';
import Dialog from '../shared/Dialog';
import GameObject from '../../../../../core/marPro/GameObject';
import React, { useState } from 'react';
import ResourceLabel from '../shared/ResourceLabel';
import ResourceSettings from '../../../../../core/marPro/ResourceSettings';
import Scenario from '../../../../../core/marPro/Scenario';
import Slider from 'rc-slider';

interface IProps {
  gameObject: GameObject;
  scenario: Scenario;
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
      const diff = activeValue - (!isArray(parameter[0].value) ? parameter[0].value : parameter[0].value[0]);
      parameter[0].relations?.forEach((relation) => {
        costs.push({
          id: relation.id,
          amount: (relation.relation || 1) * diff,
          resource: relation.resourceId,
        });
      });
    }

    props.onChange(GameObject.fromObject(cGameObject), costs);
    setActiveSlider(null);
    setIsAfterChange(false);
  };

  const renderRelation = (relation: IParameterRelation, diff: number) => {
    const amount = Math.abs((relation.relation || 1) * diff);
    const resource = props.scenario.resources.filter((r) => r.id === relation.resourceId);

    if (resource.length === 0) {
      return (
        <Grid.Row key={relation.resourceId}>
          <Grid.Column width={16} textAlign="center">
            {relation.resourceId}: {amount}
          </Grid.Column>
        </Grid.Row>
      );
    }

    return (
      <Grid.Row key={relation.resourceId}>
        <Grid.Column width={16} textAlign="center">
          <ResourceLabel amount={amount} resource={ResourceSettings.fromObject(resource[0])} />
        </Grid.Column>
      </Grid.Row>
    );
  };

  const handleSell = () => {
    let costs: ICost[] = [];

    // Remove all resources which had been manipulated by this gameObject
    gameObject.parameters.forEach((parameter) => {
      const value = parameter.value;
      parameter.relations?.forEach((relation) => {
        const diff = (relation.relation || 1) * (!isArray(value) ? value : value[0]);
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
            id: relation.id,
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
    if (parameter.length > 0 && !isArray(parameter[0].value)) {
      const diff = activeValue - parameter[0].value;

      return (
        <Dialog
          header={gameObject.type}
          image={gameObject.type}
          content={
            <Grid textAlign="center" style={{ minWidth: '20rem', width: 'min-content' }}>
              <Grid.Row>
                <Grid.Column>
                  <p>
                    Change the value of parameter <span className="parameter-name">{parameter[0].name}</span> to{' '}
                    <strong>{activeValue}</strong>?
                  </p>
                  {parameter[0].relations.length > 0 && (
                    <p>
                      This will <b>{diff < 0 ? 'earn' : 'cost'}</b> you:
                    </p>
                  )}
                </Grid.Column>
              </Grid.Row>
              {parameter[0].relations && parameter[0].relations.map((relation) => renderRelation(relation, diff))}
              <Grid.Row>
                <Grid.Column>
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
          {gameObject.parameters.map((p) => (
            <React.Fragment key={`${gameObject.id}_${p.id}`}>
              <List.Item>
                {p.name || p.id}: {activeSlider === p.id ? activeValue : p.value}
              </List.Item>
              {!p.isFixed && !isArray(p.value) && (
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
                Remove
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
