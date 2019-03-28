import PropTypes from 'prop-types';
import React from 'react';
import {Form, Input} from 'semantic-ui-react';

import AbstractPackageProperties from './AbstractPackageProperties';
import {FlopyModflowMfbas} from 'core/model/flopy/packages/mf';
import {documentation} from '../../../../defaults/flow';

const styles = {
    inputFix: {
        padding: '0',
        height: 'auto'
    }
};

class BasPackageProperties extends AbstractPackageProperties {

    render() {
        if (!this.state.mfPackage) {
            return null;
        }

        const {mfPackage} = this.props;

        return (
            <Form>
                <Form.Field>
                    <label>Ibound array</label>
                    <Input readOnly
                           name='ibound'
                           value={JSON.stringify(mfPackage.ibound)}
                           style={styles.inputFix}
                           icon={this.renderInfoPopup(documentation.ibound, 'ibound')}
                    />
                </Form.Field>
                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Starting Head (strt)</label>
                        <Input readOnly
                               name='strt'
                               value={JSON.stringify(mfPackage.strt)}
                               icon={this.renderInfoPopup(documentation.strt, 'strt')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Free format (ifrefm)</label>
                        <Input readOnly
                               name='ifrefm'
                               value={JSON.stringify(mfPackage.ifrefm)}
                               icon={this.renderInfoPopup(documentation.ifrefm, 'ifrefm')}
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Flow between chd cells (ichflg)</label>
                        <Input readOnly
                               name='ichflg'
                               value={JSON.stringify(mfPackage.ichflg)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.ichflg, 'ichflg')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Budget percent discrepancy (stoper)</label>
                        <Input readOnly
                               name='stoper'
                               value={JSON.stringify(mfPackage.stoper)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.stoper, 'stoper')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>hnoflo</label>
                        <Input readOnly
                               type={'number'}
                               name='hnoflo'
                               value={JSON.stringify(mfPackage.hnoflo)}
                               style={styles.inputFix}
                               icon={this.renderInfoPopup(documentation.hnoflo, 'hnoflo')}
                        />
                    </Form.Field>
                </Form.Group>

            </Form>
        );
    }
}

BasPackageProperties.propTypes = {
    mfPackage: PropTypes.instanceOf(FlopyModflowMfbas),
    onChange: PropTypes.func.isRequired,
    readonly: PropTypes.bool.isRequired
};


export default BasPackageProperties;
