import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {ModflowModel} from 'core/model/modflow';
import {Grid, Header, List, Segment} from 'semantic-ui-react';
import Terminal from '../../../../shared/complexTools/Terminal';

import {fetchUrl} from 'services/api';

class Files extends React.Component {

    state = {
        isLoading: false,
        isError: false,
        selectedFile: 'mf.list',
        fileList: [],
        file: ''

    };

    componentDidMount() {
        this.fetchFileList();
    }


    fetchFile = () => {
        const {model} = this.props;
        if (!(model instanceof ModflowModel)) {
            return;
        }

        const {calculation} = model;
        if (!calculation) {
            return;
        }

        const calculationId = calculation.id;
        if (!calculationId || calculationId === '') {
            return;
        }

        const {selectedFile} = this.state;
        const extension = selectedFile.split('.')[1];
        this.setState({isLoading: true}, () =>
            fetchUrl(`calculations/${calculationId}/file/${extension}`,
                (file) => this.setState({file, isLoading: false})
            ))
    };

    fetchFileList = () => {
        const {model} = this.props;
        if (!(model instanceof ModflowModel)) {
            return;
        }

        const {calculation} = model;
        if (!calculation) {
            return;
        }

        const calculationId = calculation.id;
        if (!calculationId || calculationId === '') {
            return;
        }

        this.setState({isLoading: true}, () =>
            fetchUrl(`calculations/${calculationId}/filelist`,
                (fileList) => this.setState({fileList, isLoading: false}, () => this.fetchFile()),
                (e) => this.setState({isError: e})
            )
        );
    };

    onClickFile = (file) => {
        this.setState({selectedFile: file}, () => this.fetchFile());
    };

    render() {
        const {model} = this.props;
        const {selectedFile} = this.state;
        const {calculation} = model;

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
                            <Terminal content={this.state.file}/>
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

const mapStateToProps = state => {
    return {
        model: ModflowModel.fromObject(state.T03.model)
    };
};

Files.proptypes = {
    model: PropTypes.instanceOf(ModflowModel).isRequired
};

export default connect(mapStateToProps)(Files);
