import * as Papa from 'papaparse';
import {ParseResult} from 'papaparse';
import React, {ChangeEvent, useEffect, useState} from 'react';
import {Button, Header, Icon, List, Modal} from 'semantic-ui-react';
import {usePrevious} from '../helpers/customHooks';

interface IProps {
    baseClasses?: string;
    onUploaded: (response: ParseResult) => any;
    uploadState: IUploadState;
}

interface IUploadState {
    activeInput: null;
    error: boolean;
    errorMsg: [];
    id: string;
    success: boolean;
}

const CsvUpload = (props: IProps) => {
    const [modalOpen, setModalOpen] = useState<boolean>(true);
    const prevUploadState = usePrevious<IUploadState>(props.uploadState);

    useEffect(() => {
        if (!prevUploadState || prevUploadState.id !== props.uploadState.id) {
            setModalOpen(props.uploadState.error);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.uploadState]);

    const handleUploadCSV = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            Papa.parse(files[0], {
                complete: props.onUploaded,
                header: false,
                dynamicTyping: true
            });
        }
    };

    const handleClose = () => setModalOpen(false);

    const {uploadState} = props;
    const baseClasses = props.baseClasses || 'ui icon button';

    let classes = `${baseClasses} positive`;

    if (uploadState.error) {
        classes = `${baseClasses} positive`;
    }
    if (uploadState.success) {
        classes = `${baseClasses} positive disabled`;
    }

    return (
        <span>
            {uploadState.error &&
            <Modal
                open={modalOpen}
                onClose={handleClose}
                size="small"
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
                    <Button onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Actions>
            </Modal>
            }
            <label
                htmlFor={'inputField'}
                className={classes}
            >
                    <Icon name="file excel"/>
                    Import CSV
            </label>
            <input
                type="file"
                id="inputField"
                style={{display: 'none'}}
                onChange={handleUploadCSV}
            />
        </span>
    );
};

export default CsvUpload;
