import {DropdownProps, Form, Grid, Header, Segment} from 'semantic-ui-react';
import {IPropertyValueObject} from '../../../core/model/types';
import {Soilmodel, Stressperiods} from '../../../core/model/modflow';
import {flatten, uniq, upperFirst} from 'lodash';
import Moment from 'moment';
import React, {SyntheticEvent, useState} from 'react';
import SliderWithTooltip from './SliderWithTooltip';

const styles = {
    dot: {
        border: '1px solid #e9e9e9',
        borderRadius: 0,
        marginLeft: 0,
        width: '1px'
    },
    track: {
        backgroundColor: '#e9e9e9'
    }
};

enum EResultType {
    DRAWDOWN = 'drawdown',
    HEAD = 'head'
}

interface IProps {
    data: {
        type: EResultType,
        layer: number,
        totim: number       // ID
    };
    onChange: (result: {
        type: EResultType,
        layer: number,
        totim: number
    }) => any;
    layerValues: string[][];
    totalTimes: number[];
    soilmodel: Soilmodel;
    stressperiods: Stressperiods;
}

const ResultsSelectorFlow = (props: IProps) => {
    const [temporaryTotim, setTemporaryTotim] = useState<number>(props.totalTimes[props.data.totim]);

    const sliderMarks = () => {
        const maxNumberOfMarks = 10;
        let {totalTimes} = props;

        if (totalTimes.length > maxNumberOfMarks) {
            const minTotim = Math.floor(totalTimes[0]);
            const maxTotim = Math.ceil(totalTimes[totalTimes.length - 1]);
            const dTotim = Math.round((maxTotim - minTotim) / maxNumberOfMarks);

            totalTimes = new Array(maxNumberOfMarks).fill(0).map((value, key) => (minTotim + (key * dTotim)));
            totalTimes.push(maxTotim);
        }

        const cMarks: IPropertyValueObject = {};
        totalTimes.forEach((value) => {
            cMarks[value] = value;
        });
        return cMarks;
    };

    const layerOptions = () => props.soilmodel.layersCollection.reorder().all.map((l, idx) => (
        {key: l.id, value: idx, text: l.name}
    ));

    const typeOptions = () => {
        const {layerValues} = props;
        if (!layerValues) {
            return [];
        }

        const types = uniq(flatten(layerValues));
        return types.filter((t) => t === EResultType.HEAD || t === EResultType.DRAWDOWN)
            .map((v, id) => ({key: id, value: v, text: upperFirst(v)}));
    };

    const formatTimestamp = (key: number) => () => {
        return Moment.utc(
            props.stressperiods.dateTimes[0]
        ).add(props.totalTimes[key], 'days').format('L');
    };

    const handleChangeType = (e: SyntheticEvent, {value}: DropdownProps) => props.onChange({
        layer: props.data.layer,
        totim: props.data.totim,
        type: value as EResultType
    });

    const handleChangeLayer = (e: SyntheticEvent, {value}: DropdownProps) => props.onChange({
        layer: value as number,
        totim: props.data.totim,
        type: props.data.type
    });

    const handleChangeSlider = (value: number) => {
        const {totalTimes} = props;
        const differences = totalTimes.map((tt, idx) => ({id: idx, value: Math.abs(tt - value)}));
        differences.sort((a, b) => a.value - b.value);
        return setTemporaryTotim(totalTimes[differences[0].id]);
    };

    const handleAfterChangeSlider = () => {
        const totim = props.totalTimes.indexOf(temporaryTotim);
        return props.onChange({layer: props.data.layer, totim: totim > -1 ? totim : 0, type: props.data.type});
    };

    return (
        <Grid columns={2}>
            <Grid.Row stretched={true}>
                <Grid.Column width={6}>
                    <Segment color={'grey'}>
                        <Form>
                            <Form.Group inline={true}>
                                <label>Select type</label>
                                <Form.Dropdown
                                    selection={true}
                                    style={{zIndex: 1002, minWidth: '8em'}}
                                    options={typeOptions()}
                                    value={props.data.type}
                                    onChange={handleChangeType}
                                />
                            </Form.Group>
                            <Form.Select
                                loading={!props.soilmodel}
                                style={{zIndex: 1001}}
                                fluid={true}
                                options={layerOptions()}
                                value={props.data.layer}
                                name={'affectedLayers'}
                                onChange={handleChangeLayer}
                            />
                        </Form>
                    </Segment>
                </Grid.Column>
                <Grid.Column width={10}>
                    <Segment color={'grey'}>
                        <Header textAlign={'center'} as={'h4'}>Select total time [days]</Header>
                        <SliderWithTooltip
                            dots={props.totalTimes.length < 20}
                            dotStyle={styles.dot}
                            trackStyle={styles.track}
                            defaultValue={props.totalTimes[props.data.totim]}
                            min={Math.floor(props.totalTimes[0])}
                            max={Math.ceil(props.totalTimes[props.totalTimes.length - 1])}
                            marks={sliderMarks()}
                            value={temporaryTotim}
                            onAfterChange={handleAfterChangeSlider}
                            onChange={handleChangeSlider}
                            tipFormatter={formatTimestamp(props.totalTimes.indexOf(temporaryTotim))}
                        />
                    </Segment>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

export default ResultsSelectorFlow;
