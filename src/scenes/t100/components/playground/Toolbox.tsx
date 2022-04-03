import { Button, Card, Image, Label, Menu, Popup } from 'semantic-ui-react';
import { EGameObjectCategory, ITool } from '../../../../core/marPro/Tool.type';
import { getImage } from '../../assets/images';
import { useEffect, useState } from 'react';
import DraftGameObject from '../../../../core/marPro/DraftGameObject';
import Scenario from '../../../../core/marPro/Scenario';
import Tool from '../../../../core/marPro/Tool';
import happyPoints from '../../assets/happy-points.png';
import marCoin from '../../assets/mar-coin.png';

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

  const renderTool = (tool: ITool) => {
    return (
      <Menu.Item>
        <Card className="object">
          <Card.Content>
            <Image floated="right" size="mini" src={getImage(tool.name)} />
            <Card.Header>{tool.name}</Card.Header>
            <Card.Description>Property</Card.Description>
          </Card.Content>
          <Card.Content textAlign="center" extra>
            <Label image>
              <Image src={marCoin} />
              20
            </Label>
            <Label image>
              <Image src={happyPoints} />
              14
            </Label>
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
      {props.scenario.tools.filter((tool) => tool.category === categories[categoryKey]).map((tool) => renderTool(tool))}
      <Menu.Item icon="angle down" as="a" />
    </Menu>
  );
};

export default Toolbox;
