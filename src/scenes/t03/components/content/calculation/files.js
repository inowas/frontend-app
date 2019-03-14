import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {Calculation} from 'core/model/modflow';
import {Grid, Header, List, Segment} from 'semantic-ui-react';
import Terminal from '../../../../shared/complexTools/Terminal';

import {fetchModflowFile} from 'services/api';

class Files extends React.Component {

    state = {
        isLoading: false,
        isError: false,
        selectedFile: 'mf.list',
        file: ''

    };


    fetchFile = () => {
        const {calculation} = this.props;
        if (!calculation) {
            return;
        }

        const calculationId = calculation.id;
        if (!calculationId || calculationId === '') {
            return;
        }

        const {selectedFile} = this.state;

        this.setState({isLoading: true}, () =>
            fetchModflowFile(calculationId, selectedFile,
                file => this.setState({file, isLoading: false}),
                e => {
                    this.setState({isError: true, isLoading: false});
                    console.error(e);
                })
        )
    };

    onClickFile = (file) => {
        this.setState({selectedFile: file}, () => this.fetchFile());
    };

    render() {
        const {calculation} = this.props;
        const {selectedFile} = this.state;

        if (!calculation) {
            return null;
        }

        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={4}>
                        <Header as={'h3'}>File list</Header>
                        <Segment color={'grey'}>
                            <List>
                                {calculation.files.map((f, idx) => (
                                    <List.Item
                                        as={selectedFile === f ? '' : 'a'}
                                        key={idx}
                                        onClick={() => this.onClickFile(f)}
                                    >
                                        <List.Icon name='file'/>{f}
                                    </List.Item>
                                ))}

                            </List>
                        </Segment>
                    </Grid.Column>
                    <Grid.Column width={12}>
                        <Header as={'h3'}>Content file: {this.state.selectedFile}</Header>
                        <Segment color={'grey'} loading={this.state.isLoading}>
                            <Terminal content={this.state.file.content}/>
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

Files.proptypes = {
    calculation: PropTypes.instanceOf(Calculation)
};

export default connect(mapStateToProps)(Files);
