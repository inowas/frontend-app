import { Button, Card, Image, Label, Menu, Popup } from 'semantic-ui-react';
import { EGameObjectCategory, ICost, ITool } from '../../../../core/marPro/Tool.type';
import { getImage } from '../../assets/images';
import { useEffect, useState } from 'react';
import DraftGameObject from '../../../../core/marPro/DraftGameObject';
import Scenario from '../../../../core/marPro/Scenario';
import Tool from '../../../../core/marPro/Tool';

interface IProps {
  gameObjectToAdd: DraftGameObject | null;
  onAddGameObject: (object: DraftGameObject) => any;
  scenario: Scenario;
}

const Toolbox = (props: IProps) => {
  const [categoryKey, setCategoryKey] = useState<number>(0);
  const [categories, setCategories] = useState<EGameObjectCategory[]>([]);

  useEffect(() => {
    const c: EGameObjectCategory[] = [];
    props.scenario.tools.forEach((tool) => {
      if (tool.category && !c.includes(tool.category)) {
        c.push(tool.category);
      }
    });
    setCategories(c);
  }, [props.scenario]);

  const handleAddObject = (tool: ITool) => () => {
    console.log('CLICK');
    const newGameObject = DraftGameObject.fromTool(Tool.fromObject(tool));
    props.onAddGameObject(newGameObject);
  };

  const handleClickChevron = (direction: string) => () => {
    if (direction === 'left' && categoryKey >= 1) {
      setCategoryKey(categoryKey - 1);
    }
    if (direction === 'left' && categoryKey === 0) {
      setCategoryKey(categories.length - 1);
    }
    if (direction === 'right' && categoryKey === categories.length - 1) {
      setCategoryKey(0);
    }
    if (direction === 'right' && categoryKey < categories.length - 1) {
      setCategoryKey(categoryKey + 1);
    }
  };

  const renderCost = (cost: ICost, tool: ITool, key: number) => {
    const resource = props.scenario.resources.filter((r) => r.id === cost.resource);
    const icon = resource.length > 0 ? resource[0].icon : 'NONE';

    return (
      <Label key={`cost_${tool.name}_${key}`} image>
        <Image src={getImage(icon)} />
        {cost.amount}
      </Label>
    );
  };

  const renderTool = (tool: ITool, key: number) => {
    return (
      <Menu.Item key={key}>
        <Card className="object">
          <Card.Content>
            <Image floated="right" size="mini" src={getImage(tool.name)} />
            <Card.Header>{tool.name}</Card.Header>
            <Card.Description>Property</Card.Description>
          </Card.Content>
          <Card.Content textAlign="center" extra>
            {tool.costs.map((cost, key) => renderCost(cost, tool, key))}
            {props.gameObjectToAdd && props.gameObjectToAdd.type === tool.name ? (
              <Popup
                trigger={<Button positive loading={true} circular icon="add" />}
                content="Click in the game scene to add an object."
                inverted
                open
                position="left center"
              />
            ) : (
              <Button positive onClick={handleAddObject(tool)} circular icon="add" />
            )}
          </Card.Content>
        </Card>
      </Menu.Item>
    );
  };

  return (
    <Menu className="objects" inverted vertical icon="labeled">
      <Menu.Item className="header">
        <Menu pagination secondary>
          {categories.length > 1 && <Menu.Item icon="chevron left" as="a" onClick={handleClickChevron('left')} />}
          <Menu.Item>
            <Button className="active">{categories[categoryKey]}</Button>
          </Menu.Item>
          {categories.length > 1 && <Menu.Item icon="chevron right" as="a" onClick={handleClickChevron('right')} />}
        </Menu>
      </Menu.Item>
      <Menu.Item icon="angle up" as="a" />
      {props.scenario.tools
        .filter((tool) => tool.category === categories[categoryKey])
        .map((tool, k) => renderTool(tool, k))}
      <Menu.Item icon="angle down" as="a" />
    </Menu>
  );
};

export default Toolbox;
