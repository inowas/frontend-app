import { Button, Card, Image, Menu } from 'semantic-ui-react';
import { EGameObjectCategory, ITool } from '../../../../core/marPro/Tool.type';
import { getImage } from '../../assets/images';
import { useEffect, useState } from 'react';
import Scenario from '../../../../core/marPro/Scenario';

interface IProps {
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
            <Image draggable floated="right" size="mini" src={getImage(tool.name)} />
            <Card.Header>{tool.name}</Card.Header>
            <Card.Description>Property</Card.Description>
          </Card.Content>
        </Card>
      </Menu.Item>
    );
  };

  return (
    <Menu
      className="objects"
      inverted
      vertical
      icon="labeled"
      style={{ left: '0', top: '45px', position: 'absolute', zIndex: 1000 }}
    >
      <Menu.Item className="header" style={{ backgroundColor: '#20b142' }}>
        <Menu pagination secondary>
          {categories.length > 1 && <Menu.Item icon="chevron left" as="a" onClick={handleClickChevron('left')} />}
          <Menu.Item>
            <Button className="active">{categories[categoryKey]}</Button>
          </Menu.Item>
          {categories.length > 1 && <Menu.Item icon="chevron right" as="a" onClick={handleClickChevron('right')} />}
        </Menu>
      </Menu.Item>
      <Menu.Item icon="angle up" as="a" style={{ padding: 0 }} />
      {props.scenario.tools.filter((tool) => tool.category === categories[categoryKey]).map((tool) => renderTool(tool))}
      <Menu.Item icon="angle down" as="a" style={{ padding: 0 }} />
    </Menu>
  );
};

export default Toolbox;
