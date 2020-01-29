import moment from 'moment';
import Slider, {createSliderWithTooltip} from 'rc-slider';
import React, {useState} from 'react';
import {Button, Grid} from 'semantic-ui-react';

interface IProps {
    onChange: (ts: number) => any;
    onTogglePlay: () => any;
    activeTimestamp: number;
    isAnimated: boolean;
    timestamps: number[];
}

const styles = {
    dot: {
        border: '1px solid #e9e9e9',
        borderRadius: 0,
        marginLeft: 0,
        width: '1px'
    },
    slider: {
        zIndex: 1000
    },
    track: {
        backgroundColor: '#e9e9e9'
    }
};

// tslint:disable-next-line:variable-name
const SliderWithTooltip = createSliderWithTooltip(Slider);

const timeSlider = (props: IProps) => {
    const [temporaryTotim, setTemporaryTotim] = useState<number | null>(null);

    const handleAfterChange = () => {
        if (temporaryTotim && !props.isAnimated) {
            setTemporaryTotim(null);
            return props.onChange(props.timestamps[temporaryTotim]);
        }
    };

    const handleChangeSlider = (value: number) => setTemporaryTotim(value);

    return (
        <Grid>
            <Grid.Column width={1}>
                <Button icon={props.isAnimated ? 'pause' : 'play'} size="mini" onClick={props.onTogglePlay}/>
            </Grid.Column>
            <Grid.Column width={15}>
                <SliderWithTooltip
                    dots={props.timestamps.length < 20}
                    dotStyle={styles.dot}
                    trackStyle={styles.track}
                    defaultValue={0}
                    min={0}
                    max={props.timestamps.length - 1}
                    value={temporaryTotim !== null ? temporaryTotim : props.activeTimestamp}
                    onAfterChange={!props.isAnimated ? handleAfterChange : undefined}
                    onChange={!props.isAnimated ? handleChangeSlider : undefined}
                    style={styles.slider}
                    tipFormatter={(ds: number) => moment.unix(props.timestamps[ds]).format('YYYY/MM/DD HH:mm:ss')}
                />
            </Grid.Column>
        </Grid>
    );
};

export default timeSlider;
