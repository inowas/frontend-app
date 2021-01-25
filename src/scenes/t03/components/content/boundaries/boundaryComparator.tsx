import {BoundaryCollection} from '../../../../../core/model/modflow/boundaries';
import {BoundarySelection, BoundaryType} from '../../../../../core/model/modflow/boundaries/Boundary.type';
import {
  Button,
  Checkbox,
  Divider,
  Dropdown,
  DropdownProps,
  Grid,
  Header,
  Icon,
  Menu,
  Segment
} from 'semantic-ui-react';
import {IBoundaryComparisonItem} from '../../../../../core/model/modflow/boundaries/BoundaryCollection';
import {ModflowModel, Soilmodel} from '../../../../../core/model/modflow';
import BoundaryDetailsImport from './boundaryDetailsImport';
import BoundarySynchronizer from './boundarySychronizer';
import React, {useEffect, useState} from 'react';

interface IBoundaryTypeObject {
  key: BoundarySelection;
  text: string;
  value: BoundarySelection;
}

interface IProps {
  currentBoundaries: BoundaryCollection;
  newBoundaries: BoundaryCollection;
  model: ModflowModel;
  soilmodel: Soilmodel;
  selectedBoundary: string | null;
  types?: BoundaryType[];
  onBoundaryClick: (bid: string) => void;
}

const BoundaryComparator = (props: IProps) => {
  const [boundaryList, setBoundaryList] = useState<IBoundaryComparisonItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<IBoundaryComparisonItem | null>(null);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [removeExistingBoundaries, setRemoveExistingBoundaries] = useState<boolean>(false);

  useEffect(() => {
    setSelectedType(props.types && props.types.length === 1 ? props.types[0] : 'all')
  }, [props.types]);

  useEffect(() => {
    setBoundaryList(props.currentBoundaries.compareWith(
      props.model.stressperiods, props.newBoundaries, removeExistingBoundaries
    ));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.currentBoundaries]);

  const noHandle = () => ({});

  const boundaryTypes = (): IBoundaryTypeObject[] => {
    if (props.types) {
      const types = props.types.length > 1 ?
        [{key: 'all' as BoundarySelection, value: 'all' as BoundarySelection, text: 'All'}] : [];
      return types.concat(props.types.map((type: BoundarySelection) => {
        return {key: type as BoundarySelection, value: type as BoundarySelection, text: type.toUpperCase()};
      }));
    }

    return [
      {key: 'all', value: 'all', text: 'All types'},
      {key: 'chd', value: 'chd', text: 'CHD'},
      {key: 'drn', value: 'drn', text: 'DRN'},
      {key: 'evt', value: 'evt', text: 'EVT'},
      {key: 'ghb', value: 'ghb', text: 'GHB'},
      {key: 'hob', value: 'hob', text: 'HOB'},
      {key: 'rch', value: 'rch', text: 'RCH'},
      {key: 'riv', value: 'riv', text: 'RIV'},
      {key: 'wel', value: 'wel', text: 'WEL'},
    ];
  };

  const handleChangeRemoveBoundaries = () => setRemoveExistingBoundaries(!removeExistingBoundaries);

  const handleClick = (id: string) => () => {
    const item = boundaryList.filter((i) => i.id === id);
    if (item.length > 0) {
      setSelectedItem(item[0]);
    }
    props.onBoundaryClick(id);
  }

  const handleLocalChange = (e: React.SyntheticEvent<HTMLElement>, data: DropdownProps) =>
    setSelectedType(data.value as BoundarySelection);

  const renderList = () => {
    let selectedBoundaryItems = boundaryList;
    if (selectedType !== 'all') {
      selectedBoundaryItems = selectedBoundaryItems.filter((b) => b.type === selectedType);
    }

    return (
      <Menu
        fluid={true}
        vertical={true}
        tabular={true}
      >
        {selectedBoundaryItems.map((b: IBoundaryComparisonItem) => (
          <Menu.Item
            name={b.name}
            key={b.id}
            active={b.id === props.selectedBoundary}
            onClick={handleClick(b.id)}
          >
            {b.name}
          </Menu.Item>
        ))}
        <Menu.Item>
          <BoundarySynchronizer
            currentBoundaries={props.currentBoundaries}
            newBoundaries={props.newBoundaries}
            model={props.model}
            removeExistingBoundaries={removeExistingBoundaries}
          />
        </Menu.Item>
      </Menu>
    );
  };

  const {types, selectedBoundary} = props;

  if (selectedBoundary === null) {
    return null;
  }

  let boundary = props.newBoundaries.findById(selectedBoundary);
  if (!boundary) {
    boundary = props.currentBoundaries.findById(selectedBoundary);
  }

  return (
    <div>
      <Divider horizontal={true}>
        <Header as="h4">
          <Icon name="eye"/>
          Preview Changes
        </Header>
      </Divider>
      <Segment>
        <Checkbox
          checked={removeExistingBoundaries}
          label='Remove existing boundaries, which are not updated by the uploaded file'
          onChange={handleChangeRemoveBoundaries}
        />
      </Segment>
      <Grid stackable={true}>
        <Grid.Row>
          <Grid.Column width={4}>
            {types && types.length === 1 ?
              <Button
                className="blue"
                fluid={true}
                icon={true}
                labelPosition="left"
              >
                <Icon name="plus"/>
                Add
              </Button>
              :
              <Button as="div" labelPosition="left">
                <Dropdown
                  selection={true}
                  options={boundaryTypes().map((b) => {
                    let numberOfBoundaries = boundaryList.length;
                    if (b.value !== 'all') {
                      numberOfBoundaries = boundaryList
                        .filter((e) => (e.type === b.value)).length;
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
                />
              </Button>
            }
            {renderList()}
          </Grid.Column>
          <Grid.Column width={12}>
            {boundary && <BoundaryDetailsImport
              boundary={boundary}
              boundaries={props.newBoundaries}
              model={props.model}
              difference={selectedItem ? selectedItem.diff : undefined}
              soilmodel={props.soilmodel}
              onChange={noHandle}
              readOnly={true}
            />}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
}

export default BoundaryComparator;
