import React, {useState} from 'react';
import {useSelector} from 'react-redux';

import {Grid, Header, Icon, Popup, Segment} from 'semantic-ui-react';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import {IRootReducer} from '../../../../../reducers';
import Terminal from '../../../../shared/complexTools/Terminal';

const log = () => {

    const [copyToClipBoardSuccessful, setCopyToClipBoardSuccessful] = useState<boolean>(false);

    const calculation = useSelector((state: IRootReducer) => state.T03.calculation);

    const onCopyToClipboard = () => {
        if (!calculation) {
            return;
        }
        const {message} = calculation;
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
                        {calculation && <Terminal content={calculation.message}/>}
                    </Segment>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

export default log;
