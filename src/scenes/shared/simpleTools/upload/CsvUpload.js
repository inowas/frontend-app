import React from 'react';
import PropTypes from 'prop-types';
import {Button, Header, Icon, List, Modal} from 'semantic-ui-react';
import * as Papa from 'papaparse';

class CsvUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalOpen: true
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.uploadState.id !== this.props.uploadState.id) {
            this.setState({
                modalOpen: this.props.uploadState.error
            })
        }
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
        let baseClasses = this.props.baseClasses || 'ui icon button';

        if (!this.props.baseClasses) {

        }

        let classes = `${baseClasses} positive`;

        if (uploadState.error) {
            classes = `${baseClasses} positive`;
        }
        if (uploadState.success) {
            classes = `${baseClasses} positive disabled`;
        }

        return (
            <span style={this.props.style ? {...this.props.style} : {}}>
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
                    <Icon name='file excel'/> Import CSV
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
    baseClasses: PropTypes.string,
    onUploaded: PropTypes.func.isRequired,
    uploadState: PropTypes.object
};

export default CsvUpload;