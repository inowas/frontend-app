import React from 'react';
import {Form, Grid, Icon, Input, Popup} from 'semantic-ui-react';
import {FlopyModpathMp7} from '../../../../../../core/model/flopy/packages/mp';
import renderInfoPopup from '../../../../../shared/complexTools/InfoPopup';
import {documentation} from '../../../../defaults/modpath';

interface IProps {
    mfPackage: FlopyModpathMp7;
    readOnly: boolean;
}

const Mp7PackageProperties = (props: IProps) => {
    const {mfPackage, readOnly} = props;

    return (
        <Grid style={{marginTop: '10px'}}>
            <Grid.Row>
                <Grid.Column>
                    <Form>
                        <Form.Group widths="equal">
                            <Form.Field>
                                <label>Version</label>
                                <Input
                                    readOnly={true}
                                    name="extension"
                                    value={mfPackage.version || ''}
                                    icon={renderInfoPopup(documentation.extension, 'extension')}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Exe name</label>
                                <Input
                                    readOnly={true}
                                    name="unitnumber"
                                    value={mfPackage.exe_name || ''}
                                    icon={renderInfoPopup(documentation.unitnumber, 'unitnumber')}
                                />
                            </Form.Field>
                        </Form.Group>
                    </Form>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

export default Mp7PackageProperties;
