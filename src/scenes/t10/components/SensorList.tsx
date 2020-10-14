import React from 'react';
import {Button, Grid, Icon, Menu, Popup} from 'semantic-ui-react';
import {Sensor} from '../../../core/model/rtm';

interface IProps {
    onAdd: () => void;
    sensors: Sensor[];
    selectedSensor: string | null;
    onChangeSelectedSensor: (id: string) => void;
    onClone: (id: string) => void;
    onRemove: (id: string) => void;
    readOnly: boolean;
}

const SensorList = (props: IProps) => {

    const handleClick = (id: string) => () => props.onChangeSelectedSensor(id);
    const handleClone = (id: string) => () => props.onClone(id);
    const handleRemove = (id: string) => () => props.onRemove(id);

    return (
        <Grid padded={true}>
            <Grid.Row style={{paddingTop: 0}}>
                <Button
                    className={'blue'}
                    fluid={true}
                    icon={true}
                    labelPosition={'left'}
                    onClick={props.onAdd}
                    disabled={props.readOnly}
                >
                    <Icon name={'plus'}/>
                    Add
                </Button>
            </Grid.Row>
            <Grid.Row>
                <Menu
                    fluid={true}
                    vertical={true}
                    tabular={true}
                >
                    {props.sensors.map((s: Sensor) => (
                        <Menu.Item
                            name={s.name}
                            key={s.id}
                            active={s.id === props.selectedSensor}
                            onClick={handleClick(s.id)}
                        >
                            {!props.readOnly && <Popup
                                trigger={<Icon name="ellipsis horizontal"/>}
                                content={
                                    <div>
                                        <Button.Group size="small">
                                            <Popup
                                                trigger={<Button icon={'clone'} onClick={handleClone(s.id)}/>}
                                                content="Clone"
                                                position="top center"
                                                size="mini"
                                            />
                                            <Popup
                                                trigger={<Button icon={'trash'} onClick={handleRemove(s.id)}/>}
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
                            {s.name}
                        </Menu.Item>
                    ))}

                </Menu>
            </Grid.Row>
        </Grid>
    );
};

export default SensorList;
