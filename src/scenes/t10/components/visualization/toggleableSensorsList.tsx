import { Checkbox, CheckboxProps, Icon, List } from 'semantic-ui-react';
import { FormEvent } from 'react';
import { IParameterWithMetaData } from './types';

interface IProps {
  parameters: IParameterWithMetaData[];
  onChange: (sensors: IParameterWithMetaData[]) => any;
}

const ToggleableSensorsList = (props: IProps) => {
  const handleChangeCheckbox = (e: FormEvent, { name, value }: CheckboxProps) => {
    if (name === '_all') {
      if (props.parameters.filter((s) => !s.meta.active).length === 0) {
        return props.onChange(
          props.parameters.map((p) => {
            p.meta.active = false;
            return p;
          })
        );
      }
      return props.onChange(
        props.parameters.map((p) => {
          p.meta.active = true;
          return p;
        })
      );
    }
    if (typeof value === 'string') {
      const sensors = props.parameters.map((p) => {
        if (p.parameter.id === value) {
          p.meta.active = !p.meta.active;
        }
        return p;
      });
      return props.onChange(sensors);
    }
  };

  const getSymbol = (p: IParameterWithMetaData) => {
    if (p.meta.strokeDasharray === '2 2') {
      return <Icon style={{ color: p.meta.color }} name="ellipsis horizontal" />;
    }
    if (p.meta.strokeDasharray === '4 4') {
      return (
        <span>
          <Icon style={{ color: p.meta.color }} name="minus" size="tiny" />
          <Icon style={{ color: p.meta.color }} name="minus" size="tiny" />
        </span>
      );
    }
    return <Icon style={{ color: p.meta.color }} name="minus" />;
  };

  return (
    <List>
      {props.parameters.map((p, pIdx) => {
        return (
          <List.Item key={pIdx}>
            <Checkbox
              checked={p.meta.active}
              label={{
                children: (
                  <div>
                    {getSymbol(p)}
                    {p.sensor.name}
                  </div>
                ),
              }}
              onChange={handleChangeCheckbox}
              value={p.parameter.id}
            />
          </List.Item>
        );
      })}
      <List.Item className="ui divider" />
      <List.Item>
        <Checkbox
          checked={props.parameters.filter((p) => !p.meta.active).length === 0}
          label="Toggle all"
          onChange={handleChangeCheckbox}
          name="_all"
        />
      </List.Item>
    </List>
  );
};

export default ToggleableSensorsList;
