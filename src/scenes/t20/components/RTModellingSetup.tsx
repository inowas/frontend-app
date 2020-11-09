import {BasicTileLayer} from '../../../services/geoTools/tileLayers';
import {Checkbox, DropdownProps, Form, Grid, Segment} from 'semantic-ui-react';
import {DatePicker} from '../../shared/uiComponents';
import {ETimeResolution, IRtModellingData} from '../../../core/model/rtm/modelling/RTModelling.type';
import {IDatePickerProps} from '../../shared/uiComponents/DatePicker';
import {Map} from 'react-leaflet';
import {ModflowModel} from '../../../core/model/modflow';
import {renderAreaLayer} from '../../t03/components/maps/mapLayers';
import RTModelling from '../../../core/model/rtm/modelling/RTModelling';
import React, {SyntheticEvent, useEffect, useState} from 'react';

interface IProps {
    model: ModflowModel;
    onChange: (r: RTModelling) => void;
    rtm: RTModelling;
}

const style = {
    map: {
        height: '250px',
        width: '100%'
    }
};

const RTModellingSetup = (props: IProps) => {
    const [data, setData] = useState<IRtModellingData>(props.rtm.toObject().data);

    useEffect(() => {
        setData(props.rtm.toObject().data);
    }, [props.rtm]);

    const handleChangeCheckbox = () => handleSave({
        ...data,
        automatic_calculation: !data.automatic_calculation
    })

    const handleChangeResolution = (e: SyntheticEvent<HTMLElement, Event>, {value}: DropdownProps) => {
        if (value === ETimeResolution.DAILY) {
            handleSave({
                ...data,
                time_resolution: value
            })
        }
    };

    const handleChangeStartDate = (event: React.SyntheticEvent, d: IDatePickerProps) => {
        if (d.value) {
            handleSave({
                ...data,
                start_date_time: d.value.toDateString()
            });
        }
    }

    const handleSave = (d: IRtModellingData) => {
        const cRtm = props.rtm.toObject()
        cRtm.data = d;
        props.onChange(RTModelling.fromObject(cRtm));
    }

    const renderMap = () => {
        return (
            <Segment>
                <h3>{props.model.name}</h3>
                <p>{props.model.description}</p>
                <Map
                    style={style.map}
                    bounds={props.model.boundingBox.getBoundsLatLng()}
                >
                    <BasicTileLayer/>
                    {renderAreaLayer(props.model.geometry)}
                </Map>
            </Segment>
        )
    };

    return (
        <Segment color={'grey'}>
            <Form>
                <Grid padded={true} columns={2}>
                    <Grid.Row stretched={true}>
                        <Grid.Column width={8}>
                            {renderMap()}
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Segment>
                                <Form.Select
                                    label="Time resolution"
                                    options={[
                                        {key: 'daily', value: ETimeResolution.DAILY, text: 'Daily'}
                                    ]}
                                    onChange={handleChangeResolution}
                                    value={props.rtm.data.time_resolution}
                                />
                                <Grid>
                                    <Grid.Row>
                                        <Grid.Column width={10}>
                                            <Form.Field>
                                                <label>Start date</label>
                                                <DatePicker
                                                    value={props.rtm.startDate}
                                                    onChange={handleChangeStartDate}
                                                />
                                            </Form.Field>
                                        </Grid.Column>
                                        <Grid.Column width={6}>
                                            <Form.Field>
                                                <label>Automatic calculation</label>
                                                <Checkbox
                                                    toggle={true}
                                                    checked={data.automatic_calculation}
                                                    name="automaticCalculation"
                                                    onChange={handleChangeCheckbox}
                                                />
                                            </Form.Field>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Form>
        </Segment>
    );
};

export default RTModellingSetup;
