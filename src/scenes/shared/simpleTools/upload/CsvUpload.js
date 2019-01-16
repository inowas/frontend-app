import React from 'react';
import PropTypes from 'prop-types';
import {Button, Header, Icon, List, Modal} from 'semantic-ui-react';
import * as Papa from 'papaparse';

class CsvUpload extends React.Component {
    state = {modalOpen: false};

    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            modalOpen: nextProps.uploadState.error
        });
    }

    handleUploadCSV = (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            Papa.parse(files[0], {
                complete: this.props.onUploaded,
                header: false,
                dynamicTyping: true
            });
        }
    };

    handleClose = () => this.setState({modalOpen: false});

    render() {
        const {uploadState} = this.props;

        let classes = 'ui icon button';

        if (uploadState.error) {
            classes = 'ui icon button negative';
        }
        if (uploadState.success) {
            classes = 'ui icon button positive disabled';
        }

        return (
            <span>
                {uploadState.error &&
                <Modal
                    open={this.state.modalOpen}
                    onClose={this.handleClose}
                    size='small'
                >
                    <Header>
                        Raster upload error
                    </Header>
                    <Modal.Content>
                        <List>
                            {
                                uploadState.errorMsg.map((error, key) =>
                                    <List.Item key={key}>{error}</List.Item>
                                )
                            }
                        </List>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={this.handleClose}>
                            Close
                        </Button>
                    </Modal.Actions>
                </Modal>
                }
                <label htmlFor={'inputField'} className={classes}>
                            <Icon name='file excel'/>
                        </label>
                <input
                    type="file" id='inputField'
                    style={{display: 'none'}}
                    onChange={this.handleUploadCSV}
                />
            </span>
        );
    }
}

CsvUpload.proptypes = {
    onUploaded: PropTypes.func.isRequired,
    uploadState: PropTypes.object
};

export default CsvUpload;