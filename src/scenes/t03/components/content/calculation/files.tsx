import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

import {Button, Grid, Header, Icon, List, Popup, Segment} from 'semantic-ui-react';
import {ModflowModel} from '../../../../../core/model/modflow';
import {IRootReducer} from '../../../../../reducers';
import {IModflowFile} from '../../../../../services/api/types';
import Terminal from '../../../../shared/complexTools/Terminal';

import {fetchModflowFile, MODFLOW_CALCULATION_URL} from '../../../../../services/api';

const modflowFiles = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [copyToClipBoardSuccessful, setCopyToClipBoardSuccessful] = useState<boolean>(false);
    const [file, setFile] = useState<IModflowFile | null>(null);

    const calculation = useSelector((state: IRootReducer) => state.T03.calculation);
    const model = useSelector((state: IRootReducer) => state.T03.model);

    useEffect(() => {
        if (!calculation) {
            return;
        }

        calculation.files.forEach((f) => {
            if (f.endsWith('.list')) {
                setSelectedFile(f);
                fetchFile(calculation.calculation_id, f);
            }
        });

    }, []);

    const fetchFile = (id: string, f: string) => {
        setIsLoading(true);
        fetchModflowFile(
            id,
            f,
            (fi) => {
                setFile(fi);
                setIsLoading(false);
            },
            () => {
                setIsError(false);
                setIsLoading(false);
            });
    };

    const onClickFile = (f: string) => {
        if (!calculation) {
            return;
        }

        setSelectedFile(f);
        setCopyToClipBoardSuccessful(false);
        fetchFile(calculation.calculation_id, f);
    };

    const onCopyToClipboard = () => {
        if (!file) {
            return;
        }

        const {content} = file;
        const dummy = document.createElement('textarea');
        // to avoid breaking orgain page when copying more words
        // cant copy when adding below this code
        // dummy.style.display = 'none'
        document.body.appendChild(dummy);
        // Be careful if you use texarea. setAttribute('value', value),
        // which works with "input" does not work with "textarea". – Eduard
        dummy.value = content;
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
        setCopyToClipBoardSuccessful(true);
    };

    if (!calculation || !model) {
        return null;
    }

    const files = calculation.files.filter((f) => !f.toLowerCase().startsWith('mt'))
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
                                    onClick={() => onClickFile(f)}
                                >
                                    <List.Icon name={'file'}/>{f}
                                </List.Item>
                            ))}

                        </List>
                    </Segment>
                    {!ModflowModel.fromObject(model).readOnly &&
                    <a
                        className="ui button positive fluid"
                        href={`${MODFLOW_CALCULATION_URL}/${calculation.calculation_id}/download`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Download
                    </a>
                    }
                </Grid.Column>
                <Grid.Column width={12}>
                    <Header as={'h3'}>
                        File content for {selectedFile} &nbsp;
                        <Button
                            icon={true}
                            basic={true}
                            onClick={onCopyToClipboard}
                        >
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
                    <Segment color={'grey'} loading={isLoading}>
                        {file && <Terminal content={file.content}/>}
                    </Segment>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

export default modflowFiles;
