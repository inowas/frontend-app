import PropTypes from 'prop-types';
import React from 'react';
import {Header, Form, Input} from 'semantic-ui-react';

import AbstractPackageProperties from './AbstractPackageProperties';
import {FlopyModflowMfbas} from 'core/model/flopy/packages/mf';


class BasPackageProperties extends AbstractPackageProperties {

    render() {
        if (!this.state.mfPackage) {
            return null;
        }

        const {readonly, mfPackage} = this.props;

        return (
            <Form>
                <Header as={'h4'}>To be implemented</Header>
                <Form.Field>
                    <label>IBOUND array</label>
                    <Input readOnly
                        name='ibound'
                        value={JSON.stringify(mfPackage.ibound)}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Starting Heads</label>
                    <Input readOnly
                           name='strt'
                           value={JSON.stringify(mfPackage.strt)}
                    />
                </Form.Field>
                <Form.Field>
                    <label>ifrefm</label>
                    <Input readOnly
                           name='ifrefm'
                           value={JSON.stringify(mfPackage.ifrefm)}
                    />
                </Form.Field>
                <Form.Group>
                    <Form.Field>
                        <label>ichflg</label>
                        <Input readOnly
                               name='ichflg'
                               value={JSON.stringify(mfPackage.ichflg)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>stoper</label>
                        <Input readOnly
                               name='stoper'
                               value={JSON.stringify(mfPackage.stoper)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>hnoflo</label>
                        <Input readOnly
                               type={'number'}
                               name='hnoflo'
                               value={JSON.stringify(mfPackage.hnoflo)}
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
