import { Button, Dropdown, Icon, Menu, Popup } from 'semantic-ui-react';
import { useHistory, useParams } from 'react-router-dom';

interface IItem {
  id: string;
  name: string;
}

interface IType {
  disabled: boolean;
  items?: IType[];
  text: string;
  value: string;
}

interface IProps {
  items: IItem[];
  title: string;
  onAdd: (type?: string, subtype?: string) => void;
  onClone: (id: string) => void;
  onDelete: (id: string) => void;
  types?: IType[];
}

const baseUrl = '/tools/T100';

const ItemsList = (props: IProps) => {
  const history = useHistory();

  const { id, property, pid } = useParams<any>();

  const handleAdd = (type: string, subtype?: string) => () => {
    props.onAdd(type, subtype);
  };

  const handleClickItem = (nPid: string) => () => {
    history.push(`${baseUrl}/${id}/${property}/${nPid}`);
  };

  return (
    <Menu fluid vertical secondary>
      <Menu.Item>
        {props.types ? (
          <Dropdown text={`Add ${props.title}`} icon="add" labeled={true} button={true} fluid className="icon blue">
            <Dropdown.Menu>
              <Dropdown.Header>Choose type</Dropdown.Header>
              {props.types.map((type, key) => (
                <Dropdown.Item
                  key={key}
                  disabled={type.disabled}
                  onClick={type.items ? undefined : handleAdd(type.value)}
                >
                  {type.items ? (
                    <Dropdown text={type.text}>
                      <Dropdown.Menu>
                        {type.items.map((i, k) => (
                          <Dropdown.Item key={`${type.value}_${k}`} onClick={handleAdd(type.value, i.value)}>
                            {i.text}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  ) : (
                    type.value
                  )}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          <Button fluid positive icon labelPosition="left" onClick={() => props.onAdd()}>
            <Icon name="add" />
            Add {props.title}
          </Button>
        )}
      </Menu.Item>
      {props.items.map((r) => (
        <Menu.Item active={pid === r.id} key={r.id} onClick={handleClickItem(r.id)}>
          {r.name}
          <Popup
            trigger={<Icon name="ellipsis horizontal" />}
            content={
              <Button.Group floated="right" size="small">
                <Popup
                  trigger={<Button icon={'clone'} onClick={() => props.onClone(r.id)} />}
                  content="Clone"
                  position="top center"
                  size="mini"
                />
                <Popup
                  trigger={<Button icon={'trash'} onClick={() => props.onDelete(r.id)} />}
                  content="Delete"
                  position="top center"
                  size="mini"
                />
              </Button.Group>
            }
            on={'click'}
            position={'right center'}
          />
        </Menu.Item>
      ))}
    </Menu>
  );
};

export default ItemsList;
