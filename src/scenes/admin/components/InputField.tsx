import { Input } from 'semantic-ui-react';
import React, { useEffect, useState } from 'react';

interface IProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  validate?: (value: string) => boolean
}

const InputField = (props: IProps) => {

  const [value, setValue] = useState<string>(props.value);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  const handleBlur = () => {
    if (!props.validate) {
      return props.onChange(value);
    }
    if (props.validate && props.validate(value)) {
      return props.onChange(value);
    }
  };

  return (
    <Input
      error={props.validate && !props.validate(value)}
      readOnly={props.readOnly || false}
      type={'text'}
      value={value}
      onChange={(e, data) => setValue(data.value)}
      onBlur={handleBlur}
    />
  );
};

export default InputField;
