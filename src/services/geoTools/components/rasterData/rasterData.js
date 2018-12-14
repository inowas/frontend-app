import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {Button, Grid, Header, Input, Modal, Segment} from 'semantic-ui-react';
import RasterfileUpload from './rasterfileUpload';
import RasterDataMap from './rasterDataMap';
import {mean} from 'lodash';
import {isValid} from './helpers';
import ModflowModel from 'core/model/modflow/ModflowModel';

const styles = {
    link: {
        cursor: 'pointer'
    },
    header: {
        textAlign: 'left'
    },
    input: {
        backgroundColor: 'transparent',
        padding: 0
    },
    modalHeader: {
        textAlign: 'center'
    },
    modalContent: {
        textAlign: 'center'
    }
};

class RasterData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            tempData: props.data,
            showEditValueModal: false,
            showEditRasterModal: false
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState(prevState => {
            return {
                ...prevState,
                data: nextProps.data,
                tempData: nextProps.data
            };
        });
    }

    handleValueChange = e => {
        this.setState({
            tempData: e.target.value
        });
    };

    handleCancel = () => {
        this.setState({
            showEditValueModal: false,
            showEditRasterModal: false
        });
    };

    handleSaveValue = () => {
        let data = this.state.tempData;

        if (typeof data === 'string') {
            data = parseFloat(data);
        }

        if (!isValid(data)) {
            return;
        }

        this.setState(prevState => {
            return {
                ...prevState,
                data: data,
                showEditValueModal: false,
                showEditRasterModal: false
            };
        });

        this.props.onChange(null, data);
    };

    handleSaveRaster = (data) => {
        this.setState(prevState => {
            return {
                ...prevState,
                data: data,
                showEditValueModal: false,
                showEditRasterModal: false
            };
        });

        this.props.onChange(null, data);
        return null;
    };

    handleFileUpload = e => {
        const files = e.target.files;
        const file = files[0];
        this.props.onUploadRasterfile(file, this.props.model.gridSize.nX, this.props.gridSize.nY);
    };

    showEditModal = (type, edit) => {
        if (type === 'value') {
            this.setState({
                showEditValueModal: edit
            });
        }

        if (type === 'raster') {
            this.setState({
                showEditRasterModal: edit
            });
        }
    };

    renderValueModal = button => (
        <Modal trigger={button} dimmer={'blurring'} open={this.state.showEditValueModal} size={'tiny'}>
            <Modal.Header style={styles.modalHeader}>Set {this.props.name} value for the entire layer</Modal.Header>
            <Modal.Content style={styles.modalContent}>
                <Modal.Description>
                    <Input
                        value={mean(this.state.tempData)}
                        label={{basic: true, content: this.props.unit}}
                        labelPosition="right"
                        style={styles.input}
                        type="text"
                        onChange={this.handleValueChange}
                    />
                    <br/>
                    <br/>
                    <Button.Group>
                        <Button onClick={this.handleSaveValue} positive>Save</Button>
                        <Button.Or/>
                        <Button onClick={this.handleCancel}>Cancel</Button>
                    </Button.Group>
                </Modal.Description>
            </Modal.Content>
        </Modal>
    );

    renderRasterModal = button => (
        <Modal trigger={button} dimmer={'blurring'} open={this.state.showEditRasterModal}>
            <Modal.Header style={styles.modalHeader}>
                Upload rasterfile for {this.props.name.toLowerCase()}
            </Modal.Header>
            <Modal.Content>
                <RasterfileUpload
                    handleFileUpload={this.handleFileUpload}
                    onCancel={this.handleCancel}
                    onSave={this.handleSaveRaster}
                    unit={this.props.unit}
                    uploadedFile={this.props.uploadedFile}
                />
            </Modal.Content>
        </Modal>
    );

    renderEditButtons = readOnly => {
        if (readOnly) {
            return null;
        }

        return (
            <Button.Group>
                {
                    this.renderValueModal(
                        <Button floated="left" onClick={() => this.showEditModal('value', true)}>
                            Set single value
                        </Button>)
                }
                <Button.Or/>
                {
                    this.renderRasterModal(
                        <Button floated="right" onClick={() => this.showEditModal('raster', true)}>
                            Upload rasterfile
                        </Button>)
                }
            </Button.Group>
        );
    };

    render() {
        const {data} = this.state;
        const {model, name, readOnly, unit} = this.props;

        return (
            <div>
                <Header as="h4" style={styles.header}>{name} [{unit}]</Header>
                <Grid columns={2} divided>
                    <Grid.Column>
                        <Segment>
                            <RasterDataMap data={data} model={model} unit={unit} />
                        </Segment>
                    </Grid.Column>
                    <Grid.Column>
                        <Header as="h4" style={styles.header}>Set raster data</Header>
                        <p>You can set a single value or upload a rasterfile.</p>
                        {this.renderEditButtons(readOnly)}
                    </Grid.Column>
                </Grid>
            </div>
        );
    }

}

const mapDispatchToProps = (dispatch) => ({
    onUploadRasterfile(file, width, height) {
        //TODO COMMAND
        //dispatch(Command.uploadRasterFile(file, width, height));
    },
});

const mapStateToProps = (state) => {
    /*const {rasterfiles} = state;
    return {
        uploadedFile: rasterfiles.files.filter(f => (f.hash === rasterfiles.current))[0] || null
    };*/
    return {};
};

RasterData.propTypes = {
    model: PropTypes.instanceOf(ModflowModel).isRequired,
    data: PropTypes.oneOfType([PropTypes.array, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onUploadRasterfile: PropTypes.func,
    readOnly: PropTypes.bool,
    unit: PropTypes.string.isRequired,
    uploadedFile: PropTypes.object,
};

// eslint-disable-next-line no-class-assign
RasterData = connect(mapStateToProps, mapDispatchToProps)(RasterData);

export default RasterData;
