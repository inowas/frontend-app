import { Button, Icon, Menu, Popup } from 'semantic-ui-react';
import React from 'react';

interface IProps {
  items: Array<{ id: number | string; name: string; isActive?: boolean; }>;
  onClick: (key: number | string) => any;
  onClone?: (key: number | string) => any;
  onRemove?: (key: number | string) => any;
  onToggle?: (key: number | string) => any;
  readOnly: boolean;
  selected?: number | string;
  type?: string;
}

const ElementsList = ({ items, onClick, onClone, onRemove, onToggle, readOnly, selected, type }: IProps) => {
  const handleClick = (key: number | string) => {
    return () => onClick(key);
  };

  const handleClone = (key: number | string) => {
    if (!onClone) {
      return;
    }
    return () => onClone(key);
  };

  const handleRemove = (key: number | string) => {
    if (!onRemove) {
      return;
    }
    return () => onRemove(key);
  };

  const handleToggle = (key: number | string) => {
    if (!onToggle) {
      return;
    }
    return () => onToggle(key);
  };

  return (
    <div>
      <Menu fluid={true} vertical={true} secondary={true}>
        {items.map((i, key) => (
          <Menu.Item name={i.name} key={key} active={i.id === selected} onClick={handleClick(i.id)}>
            {(!readOnly && (onClone || onRemove)) && (
                <Popup
                  trigger={<Icon name="ellipsis horizontal" />}
                  content={
                    <div>
                      <Button.Group size="small">
                        {!!onClone && (
                          <Popup
                            trigger={<Button icon={'clone'} onClick={handleClone(i.id)} />}
                            content="Clone"
                            position="top center"
                            size="mini"
                          />
                        )}
                        {!!onRemove && (
                          <Popup
                            trigger={<Button icon={'trash'} onClick={handleRemove(i.id)} />}
                            content="Delete"
                            position="top center"
                            size="mini"
                          />
                        )}
                      </Button.Group>
                    </div>
                  }
                  on={'click'}
                  position={'right center'}
                />
              )}
            {type === 'radio' && i.isActive ? <u>{i.name}</u> : i.name}
            {!readOnly && type === 'radio' &&
            <Popup
              trigger={
                <Icon name={i.isActive ? 'dot circle outline' : 'circle outline'} onClick={handleToggle(i.id)}/>
              }
              content="Toggle"
              position="top center"
              size="mini"
            />
            }
          </Menu.Item>
        ))}
      </Menu>
    </div>
  );
};

export default ElementsList;
