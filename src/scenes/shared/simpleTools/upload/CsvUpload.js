import React from 'react';
import PropTypes from 'prop-types';
import {Icon, Popup} from 'semantic-ui-react';
import * as Papa from 'papaparse';

class CsvUpload extends React.Component {

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
                <Popup
                    trigger={
                        <label htmlFor={'inputField'} className={classes}>
                            <Icon name='file excel'/>
                        </label>}
                    content={!uploadState.error ? 'Import CSV' : uploadState.errorMsg}
                    position='top center'
                />
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