import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {Calculation, ModflowModel} from '../../../../../core/model/modflow';
import {Grid, Header, List, Segment} from 'semantic-ui-react';
import Terminal from '../../../../shared/complexTools/Terminal';

import {fetchModflowFile, MODFLOW_CALCULATION_URL} from '../../../../../services/api';

class Files extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isError: false,
            selectedFile: null,
            file: null
        };
    }

    componentDidMount() {

        if (!this.props.calculation) {
            return;
        }

        this.props.calculation.files.forEach(f => {
            if (f.endsWith('.list')) {
                this.setState({selectedFile: f}, this.fetchFile);
            }
        });
    }


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
        if (!this.props.calculation) {
            return null;
        }

        const {calculation} = this.props;
        const {selectedFile} = this.state;

        let {files} = calculation;

        files = files.filter(f => !f.toLowerCase().startsWith('mt'))
            .sort((a, b) => a.localeCompare(b, undefined, {sensitivity: 'base'}));

        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={4}>
                        <Header as={'h3'}>File list</Header>
                        <Segment color={'grey'}>
                            <List>
                                {files.map((f, idx) => (
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
                        {!this.props.readOnly &&
                        <a className="ui button positive fluid" href={`${MODFLOW_CALCULATION_URL}/${calculation.id}/download`} target="_blank"
                           rel="noopener noreferrer">
                            Download
                        </a>
                        }
                    </Grid.Column>
                    <Grid.Column width={12}>
                        <Header as={'h3'}>Content file: {this.state.selectedFile}</Header>
                        <Segment color={'grey'} loading={this.state.isLoading}>
                            {this.state.file && <Terminal content={this.state.file.content}/>}
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

const mapStateToProps = state => ({
    calculation: state.T03.calculation ? Calculation.fromObject(state.T03.calculation) : null,
    readOnly: state.T03.model ? ModflowModel.fromObject(state.T03.model).readOnly : false
});

Files.propTypes = {
    calculation: PropTypes.instanceOf(Calculation),
    readOnly: PropTypes.bool,
};

export default connect(mapStateToProps)(Files);
