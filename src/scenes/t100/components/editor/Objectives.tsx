import { CheckboxProps, Divider, Form, Image, InputProps, List, Radio } from 'semantic-ui-react';
import { FormEvent, useState } from 'react';
import { IResourceSettings } from '../../../../core/marPro/Resource.type';
import { icons } from '../../assets/images';
import ColorPicker from '../../../shared/complexTools/ColorPicker';
import { EObjectiveType, TObjective } from '../../../../core/marPro/Objective.type';
import Objective from '../../../../core/marPro/Objective';

interface IProps {
  onChange: (objective: Objective) => void;
  objective: Objective;
}

const Objectives = (props: IProps) => {
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [activeValue, setActiveValue] = useState<string>('');

  const handleBlur = (isNumeric: boolean, placeholder?: number) => () => {
    if (!activeInput) {
      return;
    }

    const cObjective: TObjective = {
      ...props.objective.toObject(),
      [activeInput]: isNumeric ? (activeValue === '' ? placeholder : parseFloat(activeValue)) : activeValue,
    };

    setActiveInput(null);
    props.onChange(Objective.fromObject(cObjective));
  };

  const handleChange = (_: FormEvent, { name, value }: InputProps) => {
    setActiveInput(name);
    setActiveValue(value);
  };

  if (props.objective.type === EObjectiveType.BY_OBSERVATION) {
    return <Form></Form>;
  }

  return <Form></Form>;
};

export default Objectives;
