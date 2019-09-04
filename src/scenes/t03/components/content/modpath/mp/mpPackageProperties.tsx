import React from 'react';
import {Form, Grid, Input} from 'semantic-ui-react';
import {FlopyModpathMp} from '../../../../../../core/model/flopy/packages/mp';
import renderInfoPopup from '../../../../../shared/complexTools/InfoPopup';
import {documentation} from '../../../../defaults/modpath';

interface IProps {
    mfPackage: FlopyModpathMp;
    readOnly: boolean;
}

const mpPackageProperties = (props: IProps) => {
    const {mfPackage} = props;

    return (
        <Grid style={{marginTop: '10px'}}>
            <Grid.Row>
                <Grid.Column>
                    <Form>
                        <Form.Group widths="equal">
                            <Form.Field>
                                <label>Basename</label>
                                <Input
                                    readOnly={true}
                                    name="modelname"
                                    value={mfPackage.modelname || ''}
                                    icon={renderInfoPopup(documentation.modelname, 'modelname')}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Simulation file</label>
                                <Input
                                    readOnly={true}
                                    name="simfile_ext"
                                    value={mfPackage.simfile_ext || ''}
                                    icon={renderInfoPopup(documentation.simfile_ext, 'simfile_ext')}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Name file</label>
                                <Input
                                    readOnly={true}
                                    name="namefile_ext"
                                    value={mfPackage.namefile_ext || ''}
                                    icon={renderInfoPopup(documentation.namefile_ext, 'namefile_ext')}
                                />
                            </Form.Field>
                        </Form.Group>
                        <Form.Group widths="equal">
                            <Form.Field>
                                <label>Version</label>
                                <Input
                                    readOnly={true}
                                    name="version"
                                    value={mfPackage.version || ''}
                                    icon={renderInfoPopup(documentation.version, 'version')}
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

export default mpPackageProperties;
