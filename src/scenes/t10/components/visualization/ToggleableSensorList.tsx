import {Checkbox, CheckboxProps, Icon, List} from 'semantic-ui-react';
import {IParameterWithMetaData} from './types';
import React, {FormEvent} from 'react';

interface IProps {
    parameters: IParameterWithMetaData[];
    onChange: (sensors: IParameterWithMetaData[]) => any;
}

const ToggleableSensorList = (props: IProps) => {

    const handleChangeCheckbox = (e: FormEvent, {name, value}: CheckboxProps) => {
        if (name === '_all') {
            if (props.parameters.filter((s) => !s.meta.active).length === 0) {
                return props.onChange(props.parameters.map((p) => {
                    p.meta.active = false;
                    return p;
                }));
            }
            return props.onChange(props.parameters.map((p) => {
                p.meta.active = true;
                return p;
            }));
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

    return (
        <List>
            {props.parameters.map((p, pIdx) => {
                return (
                    <List.Item
                        key={pIdx}
                    >
                        <Checkbox
                            checked={p.meta.active}
                            label={{
                                children:
                                    <div>
                                        <Icon
                                            style={{
                                                color: p.meta.color
                                            }}
                                            name="circle"
                                        />
                                        {p.sensor.name}
                                    </div>
                            }}
                            onChange={handleChangeCheckbox}
                            value={p.parameter.id}
                        />
                    </List.Item>
                );
            })}
            <List.Item className="ui divider"/>
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

export default ToggleableSensorList;
