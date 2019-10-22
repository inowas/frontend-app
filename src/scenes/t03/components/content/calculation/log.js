import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {Calculation} from '../../../../../core/model/modflow';
import {Grid, Header, Icon, Popup, Segment} from 'semantic-ui-react';
import Terminal from '../../../../shared/complexTools/Terminal';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';

class Log extends React.Component {

    state = {
        copyToClipBoardSuccessful: false
    };

    onCopyToClipboard = () => {
        const {message} = this.props.calculation;
        const dummy = document.createElement('textarea');
        // to avoid breaking orgain page when copying more words
        // cant copy when adding below this code
        // dummy.style.display = 'none'
        document.body.appendChild(dummy);
        //Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
        dummy.value = message;
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
        this.setState({copyToClipBoardSuccessful: true})
    };

    render() {
        const {calculation} = this.props;

        return (
            <Grid padded>
                <Grid.Row>
                    <Grid.Column>
                        <Header as={'h3'}>
                            Calculation logs &nbsp;
                            <Button icon basic={true} onClick={this.onCopyToClipboard}>
                                <Popup content={'Copy top clipboard'} position={'right center'} trigger={
                                    <Icon
                                        name={this.state.copyToClipBoardSuccessful ? 'clipboard check' : 'clipboard outline'}
                                        size={'small'}/>
                                }/>
                            </Button>
                        </Header>
                        <Segment color={'grey'}>
                            {calculation && <Terminal content={calculation.message}/>}
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

const mapStateToProps = state => {
    return {
        calculation: state.T03.calculation ? Calculation.fromObject(state.T03.calculation) : null
    };
};

Log.propTypes = {
    calculation: PropTypes.instanceOf(Calculation),
};

export default connect(mapStateToProps)(Log);
