import {Boundary, BoundaryCollection} from '../../../../../core/model/modflow/boundaries';
import {BoundarySelection, BoundaryType} from '../../../../../core/model/modflow/boundaries/Boundary.type';
import {Button, Dropdown, DropdownProps, Form, Grid, Icon, Menu, Popup} from 'semantic-ui-react';
import React, {useEffect, useState} from 'react';

interface IBoundaryTypeObject {
  key: BoundarySelection;
  text: string;
  value: BoundarySelection;
}

interface IProps {
  boundaries: BoundaryCollection;
  onAdd: (type: BoundaryType) => any;
  onClick: (id: string) => any;
  onClone: (id: string) => any;
  onRemove: (id: string) => any;
  onToggle: (id: string) => any;
  readOnly: boolean;
  selected?: string;
  types?: BoundaryType[];
}

const BoundaryList = (props: IProps) => {
  const [selectedType, setSelectedType] = useState<BoundarySelection>(
    props.types && props.types.length === 1 ? props.types[0] : 'all'
  );

  useEffect(() => {
    setSelectedType(props.types && props.types.length === 1 ? props.types[0] : 'all')
  }, [props.types]);

  const boundaryTypes = (): IBoundaryTypeObject[] => {
    if (props.types) {
      const types = props.types.length > 1 ?
        [{key: 'all' as BoundarySelection, value: 'all' as BoundarySelection, text: 'All'}] : [];
      return types.concat(props.types.map((type: BoundarySelection) => {
        return {key: type as BoundarySelection, value: type as BoundarySelection, text: type.toUpperCase()};
      }));
    }

    return [
      {key: 'all', value: 'all', text: 'All'},
      {key: 'chd', value: 'chd', text: 'CHD'},
      {key: 'drn', value: 'drn', text: 'DRN'},
      {key: 'evt', value: 'evt', text: 'EVT'},
      {key: 'fhb', value: 'fhb', text: 'FHB'},
      {key: 'ghb', value: 'ghb', text: 'GHB'},
      {key: 'rch', value: 'rch', text: 'RCH'},
      {key: 'riv', value: 'riv', text: 'RIV'},
      {key: 'wel', value: 'wel', text: 'WEL'},
    ];
  };

  const list = () => {
    let selectedBoundaries = props.boundaries.boundaries;
    if (selectedType !== 'all') {
      selectedBoundaries = selectedBoundaries.filter((b) => b.type === selectedType);
    }

    return (
      <Menu
        fluid={true}
        vertical={true}
        tabular={true}
      >
        {selectedBoundaries.map((b: Boundary) => (
          <Menu.Item
            name={b.name}
            key={b.id}
            active={b.id === props.selected}
            onClick={handleClick(b.id)}
          >
            {!props.readOnly && <Popup
              trigger={<Icon name="ellipsis horizontal"/>}
              content={
                <div>
                  <Button.Group size="small">
                    <Popup
                      trigger={<Button icon={'clone'} onClick={handleClone(b.id)}/>}
                      content="Clone"
                      position="top center"
                      size="mini"
                    />
                    <Popup
                      trigger={<Button icon={'trash'} onClick={handleRemove(b.id)}/>}
                      content="Delete"
                      position="top center"
                      size="mini"
                    />
                  </Button.Group>
                </div>
              }
              on={'click'}
              position={'right center'}
            />
            }
            {b.isExcludedFromCalculation ? <s>{b.name}</s> : b.name}
            {!props.readOnly &&
            <Popup
              trigger={
                <Icon name={b.isExcludedFromCalculation ? 'toggle off' : 'toggle on'} onClick={handleToggle(b.id)}/>
              }
              content="Toggle"
              position="top center"
              size="mini"
            />
            }
          </Menu.Item>
        ))}
      </Menu>
    );
  };

  const handleLocalChange = (e: React.SyntheticEvent<HTMLElement>, data: DropdownProps) =>
    setSelectedType(data.value as BoundarySelection);

  const handleAdd = (type: BoundarySelection) => () => {
    if (type !== 'all') {
      props.onAdd(type);
    }
  };
  const handleClick = (id: string) => () => props.onClick(id);
  const handleClone = (id: string) => () => props.onClone(id);
  const handleRemove = (id: string) => () => props.onRemove(id);
  const handleToggle = (id: string) => () => props.onToggle(id);

  return (
    <Grid padded={true}>
      <Grid.Row style={{paddingTop: 0}}>
        {props.types && props.types.length === 1 ?
          <Button
            className="blue"
            fluid={true}
            icon={true}
            labelPosition="left"
            onClick={handleAdd(props.types[0])}
            disabled={props.readOnly}
          >
            <Icon name="plus"/>
            Add
          </Button>
          :
          <Form.Group>
            <Button as="div" labelPosition="left">
              <Dropdown
                selection={true}
                options={boundaryTypes().map((b) => {
                  let numberOfBoundaries = props.boundaries.length;
                  if (b.value !== 'all') {
                    numberOfBoundaries = props.boundaries.findBy('type', b.value).length;
                  }

                  const name = `${b.text} (${numberOfBoundaries})`;

                  return {
                    ...b,
                    disabled: b.value !== 'all' && numberOfBoundaries === 0,
                    text: name
                  };
                })}
                onChange={handleLocalChange}
                value={selectedType}
                style={{minWidth: '120px', width: '120px'}}
              />
              <Dropdown
                text="Add"
                icon="add"
                labeled={true}
                button={true}
                className="icon blue"
                disabled={props.readOnly}
              >
                <Dropdown.Menu>
                  <Dropdown.Header>Choose type</Dropdown.Header>
                  {boundaryTypes()
                    .filter((b) => b.value !== 'all')
                    .map((o) =>
                      // eslint-disable-next-line react/jsx-key
                      <Dropdown.Item
                        {...o}
                        onClick={handleAdd(o.value)}
                      />
                    )
                  }
                </Dropdown.Menu>
              </Dropdown>
            </Button>
          </Form.Group>
        }
      </Grid.Row>
      <Grid.Row>
        {list()}
      </Grid.Row>
    </Grid>
  );
}

export default BoundaryList;
