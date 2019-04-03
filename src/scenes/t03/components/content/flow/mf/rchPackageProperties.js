import PropTypes from 'prop-types';
import React from 'react';
import {Form, Input} from 'semantic-ui-react';

import AbstractPackageProperties from './AbstractPackageProperties';
import {FlopyModflowMfrch} from 'core/model/flopy/packages/mf';
import InfoPopup from '../../../../../shared/InfoPopup';
import {documentation} from '../../../../defaults/flow';

class RchPackageProperties extends AbstractPackageProperties {

    render() {
        if (!this.state.mfPackage) {
            return null;
        }

        const {mfPackage} = this.props;

        return (
            <Form>
                <Form.Group>
                    <Form.Field width={15}>
                        <label>Recharge option (nrchop)</label>
                        <Form.Dropdown
                            options={[
                                {key: 0, value: 'nrchop1', text: '1: Recharge to top grid layer only'},
                                {key: 1, value: 'nrchop2', text: '2: Recharge to layer defined in irch'},
                                {key: 2, value: 'nrchop3', text: '3: Recharge to highest active cell'}
                            ]}
                            placeholder='Recharge option'
                            name='nrchop'
                            selection
                            value={JSON.stringify(mfPackage.nrchop)}
                        />
                    </Form.Field>
                    <Form.Field width={1}>
                        <label>&nbsp;</label>
                        <InfoPopup description={documentation.nrchop} title='Model' position='top right' iconOutside={true} />
                    </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Cell-by-cell budget data (ipakcb)</label>
                        <Input readOnly
                               name='ipakcb'
                               value={JSON.stringify(mfPackage.ipakcb)}
                               icon={this.renderInfoPopup(documentation.ipakcb, 'ipakcb')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Recharge flux (rech)</label>
                        <Input readOnly
                               name='rech'
                               value={mfPackage.rech}
                               icon={this.renderInfoPopup(documentation.rech, 'rech')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Recharge layer (irch)</label>
                        <Input readOnly
                               name='irch'
                               value={mfPackage.irch}
                               icon={this.renderInfoPopup(documentation.irch, 'irch')}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Filename extension</label>
                        <Input readOnly
                               name='extension'
                               value={mfPackage.extension}
                               icon={this.renderInfoPopup(documentation.extension, 'extension')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>File unit number</label>
                        <Input readOnly
                               type={'number'}
                               name='unitnumber'
                               value={JSON.stringify(mfPackage.unitnumber)}
                               icon={this.renderInfoPopup(documentation.unitnumber, 'unitnumber')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Filenames</label>
                        <Input readOnly
                               name='filenames'
                               value={JSON.stringify(mfPackage.filenames)}
                               icon={this.renderInfoPopup(documentation.filenames, 'filenames')}
                        />
                    </Form.Field>
                </Form.Group>
            </Form>
        );
    }
}

RchPackageProperties.propTypes = {
    mfPackage: PropTypes.instanceOf(FlopyModflowMfrch),
    onChange: PropTypes.func.isRequired,
    readonly: PropTypes.bool.isRequired
};


export default RchPackageProperties;
