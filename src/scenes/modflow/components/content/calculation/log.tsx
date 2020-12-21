import {Calculation} from '../../../../../core/model/modflow';
import {Grid, Header, Icon, Popup, Segment} from 'semantic-ui-react';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import React, {useState} from 'react';
import Terminal from '../../../../shared/complexTools/Terminal';

interface IProps {
    calculation: Calculation | null;
}

const Log = (props: IProps) => {

    const [copyToClipBoardSuccessful, setCopyToClipBoardSuccessful] = useState<boolean>(false);

    const onCopyToClipboard = () => {
        if (!props.calculation) {
            return;
        }
        const {message} = props.calculation;
        const dummy = document.createElement('textarea');
        // to avoid breaking orgain page when copying more words
        // cant copy when adding below this code
        // dummy.style.display = 'none'
        document.body.appendChild(dummy);
        // Be careful if you use texarea.
        // setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
        dummy.value = message;
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
        setCopyToClipBoardSuccessful(true);
    };

    return (
        <Grid padded={true}>
            <Grid.Row>
                <Grid.Column>
                    <Header as={'h3'}>
                        Calculation logs &nbsp;
                        <Button icon={true} basic={true} onClick={onCopyToClipboard}>
                            <Popup
                                content={'Copy top clipboard'}
                                position={'right center'}
                                trigger={
                                    <Icon
                                        name={copyToClipBoardSuccessful ? 'clipboard check' : 'clipboard outline'}
                                        size={'small'}
                                    />
                                }
                            />
                        </Button>
                    </Header>
                    <Segment color={'grey'}>
                        {props.calculation && <Terminal content={props.calculation.message}/>}
                    </Segment>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

export default Log;
