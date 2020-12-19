import {DropdownProps, Form, Grid, Header, Segment} from 'semantic-ui-react';
import {Stressperiods} from '../../../core/model/modflow';
import Moment from 'moment';
import React, {useEffect, useState} from 'react';
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

interface IProps {
    data: {
        type: string;
        totim: number;
    };
    onChange: (response: any) => any;
    stressperiods: Stressperiods;
    totalTimes: number[] | null;
}

const ResultsSelectorBudget = (props: IProps) => {
    const [temporaryTotim, setTemporaryTotim] = useState<number | null>(null);

    const {type} = props.data;

    useEffect(() => {
        if (props.totalTimes) {
            setTemporaryTotim(props.totalTimes[props.data.totim]);
        }
    }, [props.data, props.totalTimes]);

    const typeOptions = () => {
        return [
            {key: 0, value: 'cumulative', text: 'Cumulative Volumes'},
            {key: 1, value: 'incremental', text: 'Rates'}
        ];
    };

    const handleChangeType = (e: React.SyntheticEvent<HTMLElement, Event>, {value}: DropdownProps) => {
        if (!props.totalTimes || !temporaryTotim) {
            return;
        }
        const totim = props.totalTimes.indexOf(temporaryTotim);
        return props.onChange({
            totim: totim,
            type: value
        });
    };

    const handleChangeSlider = (value: number) => {
        const {totalTimes} = props;

        if (!totalTimes) {
            return;
        }

        const differences = totalTimes.map((tt, idx) => ({id: idx, value: Math.abs(tt - value)}));
        differences.sort((a, b) => a.value - b.value);
        setTemporaryTotim(totalTimes[differences[0].id]);
    };

    const handleAfterChangeSlider = () => {
        if (!props.totalTimes || !temporaryTotim) {
            return;
        }
        const totim = props.totalTimes.indexOf(temporaryTotim);
        return props.onChange({totim, type});
    };

    const sliderMarks = () => {
        const maxNumberOfMarks = 10;
        let {totalTimes} = props;

        if (!totalTimes) {
            return;
        }

        if (totalTimes.length > maxNumberOfMarks) {
            const minTotim = totalTimes[0];
            const maxTotim = totalTimes[totalTimes.length - 1];
            const dTotim = Math.round((maxTotim - minTotim) / maxNumberOfMarks);

            totalTimes = new Array(maxNumberOfMarks).fill(0).map((value, key) => (minTotim + key * dTotim));
            totalTimes.push(maxTotim);
        }

        const marks: any = {};
        totalTimes.forEach((value) => {
            marks[value] = value;
        });
        return marks;
    };

    const formatTimestamp = (key: number) => () => {
        const {totalTimes} = props;

        if (!totalTimes) {
            return undefined;
        }

        return Moment.utc(
            props.stressperiods.dateTimes[0]
        ).add(totalTimes[key], 'days').format('L');
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
                                    value={type}
                                    onChange={handleChangeType}
                                />
                            </Form.Group>
                        </Form>
                    </Segment>
                </Grid.Column>
                <Grid.Column width={10}>
                    <Segment color={'grey'}>
                        <Header textAlign={'center'} as={'h4'}>Select total time [days]</Header>
                        {props.totalTimes && temporaryTotim &&
                        <SliderWithTooltip
                            dots={props.totalTimes.length < 20}
                            dotStyle={styles.dot}
                            trackStyle={styles.track}
                            defaultValue={temporaryTotim}
                            min={Math.floor(props.totalTimes[0])}
                            max={Math.ceil(props.totalTimes[props.totalTimes.length - 1])}
                            marks={sliderMarks()}
                            value={temporaryTotim}
                            onAfterChange={handleAfterChangeSlider}
                            onChange={handleChangeSlider}
                            tipFormatter={formatTimestamp(props.totalTimes.indexOf(temporaryTotim))}
                        />
                        }
                    </Segment>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

export default ResultsSelectorBudget;
