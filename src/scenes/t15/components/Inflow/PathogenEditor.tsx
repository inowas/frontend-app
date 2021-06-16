import {Button, Grid, Segment} from 'semantic-ui-react';
import {useEffect, useState} from 'react';
import DefaultModal from './DefaultModal';
import DoseResponse from '../../../../core/model/qmra/DoseResponse';
import ElementsList from '../ElementsList';
import Health from '../../../../core/model/qmra/Health';
import IDoseResponse from '../../../../core/model/qmra/DoseResponse.type';
import IHealth from '../../../../core/model/qmra/Health.type';
import IPathogen from '../../../../core/model/qmra/Pathogen.type';
import InfoBox from '../InfoBox';
import Pathogen from '../../../../core/model/qmra/Pathogen';
import PathogenForm from './PathogenForm';
import Qmra from '../../../../core/model/qmra/Qmra';
import _ from 'lodash';
import descriptions from '../defaults/descriptions.json';
import doseResponseDefaults from '../defaults/doseResponse.json';
import healthDefaults from '../defaults/health.json';
import pathogenDefaults from '../defaults/inflow.json';

interface IProps {
  onChange: (qmra: Qmra) => void;
  qmra: Qmra;
}

const defaultGroups = ['Bacteria', 'Protozoa', 'Viruses'];

const PathogenEditor = ({qmra, onChange}: IProps) => {
  const [filteredDoseResponseDefaults, setFilteredDoseResponseDefaults] = useState<IDoseResponse[]>([]);
  const [filteredHealthDefaults, setFilteredHealthDefaults] = useState<IHealth[]>([]);
  const [filteredPathogenDefaults, setFilteredPathogenDefaults] = useState<IPathogen[]>([]);
  const [selectedElement, setSelectedElement] = useState<IPathogen>();

  const [selectedDoseResponse, setSelectedDoseResponse] = useState<IDoseResponse>();
  const [selectedHealth, setSelectedHealth] = useState<IHealth>();

  useEffect(() => {
    if (!selectedElement && qmra.inflow.length > 0) {
      setSelectedElement(qmra.inflow[0].toObject());
    }
    if (selectedElement && qmra.inflow.length === 0) {
      setSelectedElement(undefined);
    }
  }, [qmra, selectedElement]);

  const handleChangeSelected = (p: Pathogen) => {
    const cQmra = qmra.toObject();
    const doseResponses = cQmra.data.doseResponse.filter((d) => d.pathogenId === p.id);
    const healths = cQmra.data.health.filter((h) => h.pathogenId === p.id);
    if (doseResponses.length < 1 || healths.length < 1 || !selectedElement) {
      return;
    }
    const cDoseResponse = doseResponses[0];
    cDoseResponse.pathogenName = p.name;
    cDoseResponse.pathogenGroup = p.group;

    const cHealth = healths[0];
    cHealth.pathogenName = p.name;

    setSelectedDoseResponse(DoseResponse.fromObject(cDoseResponse).toObject());
    setSelectedHealth(Health.fromObject(cHealth).toObject());

    if (p.name !== selectedElement.name) {
      setSelectedElement(p.toObject());

      const dDefaults: IDoseResponse[] = doseResponseDefaults
        .filter((d) => d.pathogenName === p.name).map((d) => {
          return {
            ...d,
            id: cDoseResponse.id,
            pathogenId: p.id,
            k: d.k || null,
            alpha: d.alpha || null,
            n50: d.n50 || null
          }
        });

      const hDefaults = healthDefaults.filter((h) => h.pathogenName === p.name).map((h) => {
        return {
          ...h,
          id: cHealth.id,
          pathogenId: p.id
        };
      });

      const pDefaults: IPathogen[] = pathogenDefaults.filter((pd) => pd.name === p.name).map((pd, i) => {
        return {
          ...pd,
          id: i,
          simulate: 0
        }
      });

      setFilteredDoseResponseDefaults(dDefaults);
      setFilteredHealthDefaults(hDefaults);
      setFilteredPathogenDefaults(pDefaults);


      if (dDefaults.length > 0 || hDefaults.length > 0 || pDefaults.length > 0) {
        return;
      }
    }

    handleDispatch(
      p,
      [DoseResponse.fromObject(cDoseResponse), Health.fromObject(cHealth)]
    );
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
    const newDoseResponse = DoseResponse.fromPathogen(newElement);
    const newHealth = Health.fromPathogen(newElement);
    const cQmra = Qmra.fromObject(qmra.toObject()).addElement(newElement).addElement(newDoseResponse)
      .addElement(newHealth);
    setSelectedElement(newElement.toObject());
    onChange(cQmra);
  };

  const handleCloneElement = (key: string | number) => {
    const elementToClone = qmra.toObject().data.inflow.filter((e) => e.id === key);
    if (elementToClone.length > 0) {
      const newElement = _.cloneDeep(elementToClone[0]);
      newElement.id = qmra.inflow.length > 0 ? 1 + Math.max(...qmra.inflow.map((p) => p.id)) : 1;
      const newDoseResponse = DoseResponse.fromPathogen(Pathogen.fromObject(newElement));
      const newHealth = Health.fromPathogen(Pathogen.fromObject(newElement));
      const cQmra = Qmra.fromObject(qmra.toObject()).addElement(Pathogen.fromObject(newElement))
        .addElement(newDoseResponse).addElement(newHealth);
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

  const handleToggleElement = (key: string | number) => {
    const cPathogens = qmra.inflow.map((p) => {
      if (p.id === key) {
        p.simulate = p.simulate === 1 ? 0 : 1;
      }
      return p.toObject();
    })

    const cQmra = qmra.toObject();
    cQmra.data.inflow = cPathogens;
    onChange(Qmra.fromObject(cQmra));
  };

  const handleDispatch = (p: Pathogen, elements: Array<DoseResponse | Health>) => {
    setSelectedElement(p.toObject());

    const cQmra = Qmra.fromObject(qmra.toObject()).updateElement(p);
    elements.forEach((e) => {
      cQmra.updateElement(e);
    });

    onChange(cQmra);
    setSelectedDoseResponse(undefined);
    resetDefaults();
  };

  const handleAcceptModal = (
    d: DoseResponse | null, h: Health | null, p: Pathogen | null
  ) => {
    if (!selectedElement || !selectedDoseResponse || !selectedHealth ||
      (filteredDoseResponseDefaults.length === 0 && filteredHealthDefaults.length === 0 &&
        filteredPathogenDefaults.length === 0)) {
      resetDefaults();
      return;
    }
    let cPathogen = selectedElement;
    const elements = [];
    if (d) {
      elements.push(d);
    } else {
      elements.push(DoseResponse.fromObject(selectedDoseResponse))
    }
    if (h) {
      elements.push(h);
    } else {
      elements.push(Health.fromObject(selectedHealth))
    }
    if (p) {
      cPathogen = p.toObject();
      cPathogen.id = selectedElement.id;
      cPathogen.simulate = selectedElement.simulate;
    }
    handleDispatch(Pathogen.fromObject(cPathogen), elements);
    resetDefaults();
  };

  const handleCloseModal = () => {
    if (!selectedElement || (!selectedDoseResponse && !selectedHealth)) {
      resetDefaults()
      return;
    }
    const elements = [];
    if (selectedDoseResponse) {
      elements.push(DoseResponse.fromObject(selectedDoseResponse));
    }
    if (selectedHealth) {
      elements.push(Health.fromObject(selectedHealth));
    }
    handleDispatch(Pathogen.fromObject(selectedElement), elements);
    resetDefaults();
  };

  const resetDefaults = () => {
    setFilteredDoseResponseDefaults([]);
    setFilteredHealthDefaults([]);
    setFilteredPathogenDefaults([]);
  }

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
          <Grid.Column width={12}/>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={4}>
            <ElementsList
              items={qmra.inflow.map((e) => ({id: e.id, name: e.name, isActive: e.simulate === 1}))}
              onClick={handleSelectElement}
              onClone={handleCloneElement}
              onRemove={handleRemoveElement}
              onToggle={handleToggleElement}
              readOnly={qmra.readOnly}
              selected={selectedElement ? selectedElement.id : undefined}
              type="checkbox"
            />
          </Grid.Column>
          <Grid.Column width={12}>
            {selectedElement && (
              <PathogenForm
                groups={_.uniq(
                  defaultGroups.concat(qmra.inflow.filter((p) => !defaultGroups.includes(p.group)).map((p) => p.group))
                )}
                onChange={handleChangeSelected}
                readOnly={qmra.readOnly}
                selectedPathogen={Pathogen.fromObject(selectedElement)}
              />
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <InfoBox header="Inflow concentration of pathogens" description={descriptions.inflow}/>
      {(filteredDoseResponseDefaults.length > 0 || filteredHealthDefaults.length > 0 ||
        filteredPathogenDefaults.length > 0) && <DefaultModal
        onAccept={handleAcceptModal}
        onClose={handleCloseModal}
        doseResponeDefaults={filteredDoseResponseDefaults.map((d) => DoseResponse.fromObject(d))}
        healthDefaults={filteredHealthDefaults.map((h) => Health.fromObject(h))}
        pathogenDefaults={filteredPathogenDefaults.map((p) => Pathogen.fromObject(p))}
      />}
    </Segment>
  );
};

export default PathogenEditor;
