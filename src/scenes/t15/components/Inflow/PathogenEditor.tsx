import {Button, Grid, Segment} from 'semantic-ui-react';
import {useEffect, useState} from 'react';
import ElementsList from '../ElementsList';
import IPathogen from '../../../../core/model/qmra/Pathogen.type';
import Pathogen from '../../../../core/model/qmra/Pathogen';
import PathogenForm from './PathogenForm';
import Qmra from '../../../../core/model/qmra/Qmra';
import _ from 'lodash';

interface IProps {
  onChange: (qmra: Qmra) => void;
  qmra: Qmra;
}

const defaultGroups = ['Bacteria', 'Protozoa', 'Virus'];

const PathogenEditor = ({qmra, onChange}: IProps) => {
  const [selectedElement, setSelectedElement] = useState<IPathogen>();

  useEffect(() => {
    if (!selectedElement && qmra.inflow.length > 0) {
      setSelectedElement(qmra.inflow[0].toObject());
    }
    if (selectedElement && qmra.inflow.length === 0) {
      setSelectedElement(undefined);
    }
  }, [qmra, selectedElement]);

  const handleDispatch = (e: IPathogen[]) => {
    const cQmra = qmra.toObject();
    cQmra.data.inflow = e;
    onChange(Qmra.fromObject(cQmra));
  };

  const handleChangeSelected = (p: Pathogen) => {
    setSelectedElement(p.toObject());
    const cInflow = qmra.inflow.map((e) => {
      if (e.id === p.id) {
        return p.toObject();
      }
      return e.toObject();
    });
    handleDispatch(cInflow);
  };

  const handleSelectElement = (id: number | string) => {
    const element = qmra.inflow.filter((e) => e.id === id);
    if (element.length > 0) {
      setSelectedElement(element[0].toObject());
    }
  };

  const handleAddElement = () => {
    const newElement = Pathogen.fromDefaults();
    newElement.id = qmra.inflow.length > 0 ? 1 + Math.max(...qmra.inflow.map((p) => p.id)) : 1;
    const cQmra = qmra.addElement(newElement);
    setSelectedElement(newElement.toObject());
    onChange(cQmra);
  };

  const handleCloneElement = (key: string | number) => {
    const elementToClone = qmra.toObject().data.inflow.filter((e) => e.id === key);
    if (elementToClone.length > 0) {
      const newElement = _.cloneDeep(elementToClone[0]);
      newElement.id = qmra.inflow.length > 0 ? 1 + Math.max(...qmra.inflow.map((p) => p.id)) : 1;
      const cQmra = qmra.addElement(Pathogen.fromObject(newElement));
      setSelectedElement(newElement);
      onChange(cQmra);
    }
  };

  const handleRemoveElement = (key: string | number) => {
    const elementToClone = qmra.toObject().data.inflow.filter((e) => e.id === key);
    if (elementToClone.length > 0) {
      const cQmra = qmra.removeElement(Pathogen.fromObject(elementToClone[0]));
      onChange(cQmra);
    }
  };

  return (
    <Segment color={'grey'}>  
      <Grid>
        <Grid.Row>
          <Grid.Column width={4}>
            <Button
              fluid={true}
              positive={true}
              icon="plus"
              labelPosition="left"
              onClick={handleAddElement}
              content="Add Pathogen"
              disabled={qmra.readOnly}
            />
          </Grid.Column>
          <Grid.Column width={12} />
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={4}>
            <ElementsList
              items={qmra.inflow.map((e) => ({id: e.id, name: e.name}))}
              onClick={handleSelectElement}
              onClone={handleCloneElement}
              onRemove={handleRemoveElement}
              readOnly={qmra.readOnly}
              selected={selectedElement ? selectedElement.id : undefined}
            />
          </Grid.Column>
          <Grid.Column width={12}>
            {selectedElement &&
            <PathogenForm
              groups={
                _.uniq(defaultGroups.concat(
                  qmra.inflow.filter((p) => !defaultGroups.includes(p.group)).map((p) => p.group)
                ))
              }
              onChange={handleChangeSelected}
              readOnly={qmra.readOnly}
              selectedPathogen={Pathogen.fromObject(selectedElement)}
            />
            }
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
};

export default PathogenEditor;
