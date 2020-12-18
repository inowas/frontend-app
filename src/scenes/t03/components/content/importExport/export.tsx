import {BoundaryCollection, ModflowModel, Soilmodel} from '../../../../../core/model/modflow';
import {Grid, Segment} from 'semantic-ui-react';
import {IRootReducer} from '../../../../../reducers';
import {useSelector} from 'react-redux';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import React, {useState} from 'react';

const ExportUI = () => {
    const [copyToClipBoardSuccessful, setCopyToClipBoardSuccessful] = useState<boolean>(false);
    const T03 = useSelector((state: IRootReducer) => state.T03);
    const getExportDataStructure = () => {
        if (!T03 || !T03.model) {
            return null;
        }

        const modflowModel = ModflowModel.fromObject(T03.model);

        return {
            name: modflowModel.name,
            description: modflowModel.description,
            public: modflowModel.isPublic,
            discretization: modflowModel.discretization,
            soilmodel: Soilmodel.fromObject(T03.soilmodel).toExport(),
            boundaries: BoundaryCollection.fromObject(T03.boundaries).toExport(modflowModel.stressperiods)
        };
    };

    const download = () => {
        const ds = getExportDataStructure();
        if (!ds || !T03.model) {
            return;
        }
        const filename = 'modflowmodel_' + T03.model.id + '.json';
        const text = JSON.stringify(ds, null, 2);
        const blob = new Blob([text], {
            type: 'application/json;charset=utf-8;'
        });

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (window.navigator.msSaveBlob) {
            // FOR IE BROWSER
            navigator.msSaveBlob(blob, filename);
        } else {
            // FOR OTHER BROWSERS
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.style.visibility = 'hidden';
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const onCopyToClipboard = () => {
        const ds = getExportDataStructure();

        if (!ds) {
            return;
        }

        const dummy = document.createElement('textarea');
        // to avoid breaking page when copying more words
        // cant copy when adding below this code
        // dummy.style.display = 'none'
        document.body.appendChild(dummy);
        // Be careful if you use texarea.
        // setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
        dummy.value = JSON.stringify(ds, null, 2);
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
        setCopyToClipBoardSuccessful(true);
    };

    return (
        <Segment color={'grey'}>
            <Grid padded={true}>
                <Grid.Row>
                    <Grid.Column>
                        <Button onClick={onCopyToClipboard} size={'large'} disabled={copyToClipBoardSuccessful}>
                            Copy to clipboard
                        </Button>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Button onClick={download} size={'large'}>Download json-file</Button>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>
    );
};

export default ExportUI;
