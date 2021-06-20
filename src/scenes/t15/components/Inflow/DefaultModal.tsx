import {Button, Label, Modal, Segment} from 'semantic-ui-react';
import {ReactNode, useState} from 'react';
import DoseResponse from '../../../../core/model/qmra/DoseResponse';
import DoseResponseForm from '../DoseResponse/DoseResponseForm';
import Health from '../../../../core/model/qmra/Health';
import HealthForm from '../Health/HealthForm';
import IDoseResponse from '../../../../core/model/qmra/DoseResponse.type';
import IHealth from '../../../../core/model/qmra/Health.type';
import IPathogen from '../../../../core/model/qmra/Pathogen.type';
import Pathogen from '../../../../core/model/qmra/Pathogen';
import PathogenForm from './PathogenForm';

interface IProps {
  onAccept: (d: DoseResponse | null, h: Health | null, p: Pathogen | null) => void;
  onClose: () => void;
  doseResponeDefaults: DoseResponse[];
  healthDefaults: Health[];
  pathogenDefaults: Pathogen[];
}

const DefaultModal = (props: IProps) => {
  const [doseResponse, setDoseResponse] = useState<IDoseResponse | null>(null);
  const [health, setHealth] = useState<IHealth | null>(null);
  const [pathogen, setPathogen] = useState<IPathogen | null>(null);

  const handleAcceptModal = () => {
    props.onAccept(
      doseResponse ? DoseResponse.fromObject(doseResponse) : null,
      health ? Health.fromObject(health) : null,
      pathogen ? Pathogen.fromObject(pathogen) : null
    );
  };

  const handleClickLabel = (element: DoseResponse | Health | Pathogen | string) => () => {
    if (element === 'Dose Response') {
      return setDoseResponse(null);
    }
    if (element === 'Pathogen') {
      return setPathogen(null);
    }
    if (element === 'Health') {
      return setHealth(null);
    }
    if (element instanceof DoseResponse) {
      return setDoseResponse(element.toObject());
    }
    if (element instanceof Health) {
      return setHealth(element.toObject());
    }
    if (element instanceof Pathogen) {
      return setPathogen(element.toObject());
    }
  };

  const renderDefaultForm = (
    defaultsArray: DoseResponse[] | Health[] | Pathogen[],
    formComponent: ReactNode,
    name: string
  ) => {
    if (defaultsArray.length >= 1) {
      return (
        <Segment>
          {defaultsArray.length > 0 &&
            <Label.Group>
              <Label color="blue" ribbon>
                {name}
              </Label>
              <Label
                color={
                  (defaultsArray[0] instanceof DoseResponse && !doseResponse) ||
                  (defaultsArray[0] instanceof Health && !health) ||
                  (defaultsArray[0] instanceof Pathogen && !pathogen) ? 'blue' : undefined
                }
                onClick={handleClickLabel(name)}
                as="a"
              >
                No Import
              </Label>
              {defaultsArray.map((d, i) => <Label
                color={
                  (d instanceof DoseResponse && doseResponse && d.id === doseResponse.id) ||
                  (d instanceof Health && health && d.id === health.id) ||
                  (d instanceof Pathogen && pathogen && d.id === pathogen.id) ? 'blue' : undefined
                }
                key={i}
                as="a"
                onClick={handleClickLabel(d)}
              >Default {i + 1}</Label>)}
            </Label.Group>
          }
          {formComponent}
        </Segment>
      );
    }
    return null;
  };

  return (
    <Modal onClose={props.onClose} open={true}>
      <Modal.Header>Do you want to import the defaults for this pathogen?</Modal.Header>
      <Modal.Content>
        {renderDefaultForm(
          props.pathogenDefaults,
          pathogen ? <PathogenForm readOnly={true} selectedPathogen={Pathogen.fromObject(pathogen)} /> : <div />,
          'Pathogen'
        )}
        {renderDefaultForm(
          props.doseResponeDefaults,
          doseResponse ? <DoseResponseForm readOnly={true} selectedDoseResponse={DoseResponse.fromObject(doseResponse)}/> : <div />,
          'Dose Response'
        )}
        {renderDefaultForm(
          props.healthDefaults,
          health ? <HealthForm readOnly={true} selectedHealth={Health.fromObject(health)}/> : <div />,
          'Health'
        )}
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={props.onClose}>No</Button>
        <Button content="Yes" icon="checkmark" labelPosition="right" primary onClick={handleAcceptModal}/>
      </Modal.Actions>
    </Modal>
  );
};

export default DefaultModal;
