import React from 'react';
import {Form, Grid, Icon, Input, Popup} from 'semantic-ui-react';
import {FlopyModpathMp7} from '../../../../../core/model/flopy/packages/modpath';
import {documentation} from '../../../defaults/flow';

interface IProps {
    mfPackage: FlopyModpathMp7;
    readOnly: boolean;
}

type PopupPosition = 'top left' | 'top right' | 'bottom left' | 'bottom right';

const modpathSetup = (props: IProps) => {
    const {mfPackage, readOnly} = props;

    const renderInfoPopup = (description: JSX.Element, title: string, position: PopupPosition = 'top left',
                             iconOutside: boolean = false) => {
        return (
            <Popup
                className="popupFix"
                trigger={
                    <Icon
                        className={iconOutside ? 'iconOutside' : 'iconFix'}
                        name="info"
                        circular={true}
                        link={true}
                    />
                }
                data-html="true"
                position={position}
            >
                <Popup.Header>
                    {title}
                </Popup.Header>
                <Popup.Content
                    className="contentFix"
                >
                    {description}
                </Popup.Content>
            </Popup>
        );
    };

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

export default modpathSetup;
