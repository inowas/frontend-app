import PropTypes from 'prop-types';
import React from 'react';
import {Form, Input} from 'semantic-ui-react';
import AbstractPackageProperties from './AbstractPackageProperties';
import {documentation} from '../../../../defaults/transport';
import {FlopyMt3dMtdsp} from 'core/model/flopy/packages/mt';

const styles = {
    inputFix: {
        padding: '0',
        height: 'auto'
    }
};

class DspPackageProperties extends AbstractPackageProperties {
    render() {

        if (!this.state.mtPackage) {
            return null;
        }

        const {readonly} = this.props;
        const {mtPackage} = this.state;

        return (
            <Form>
                <Form.Field>
                    <label>Longitudinal dispersivity (Al)</label>
                    <Input
                        type={'number'}
                        name={'al'}
                        value={mtPackage.al}
                        disabled={readonly}
                        onBlur={this.handleOnBlur(parseFloat)}
                        onChange={this.handleOnChange}
                        style={styles.inputFix}
                        icon={this.renderInfoPopup(documentation.al, 'AL', 'top right')}
                    />
                </Form.Field>
                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Trpt</label>
                        <Input
                            type={'number'}
                            name={'trpt'}
                            value={mtPackage.trpt}
                            disabled={readonly}
                            onBlur={this.handleOnBlur(parseFloat)}
                            onChange={this.handleOnChange}
                            style={styles.inputFix}
                            icon={this.renderInfoPopup(documentation.trpt, 'TRPT', 'top left')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Trpv</label>
                        <Input
                            type={'number'}
                            name={'trpv'}
                            value={mtPackage.trpv}
                            disabled={readonly}
                            onBlur={this.handleOnBlur(parseFloat)}
                            onChange={this.handleOnChange}
                            style={styles.inputFix}
                            icon={this.renderInfoPopup(documentation.trpv, 'TRPV', 'top right')}
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Effective molecular diffusion coefficient (dmcoef)</label>
                        <Input
                            type={'number'}
                            name={'dmcoef'}
                            value={mtPackage.dmcoef}
                            disabled={readonly}
                            onBlur={this.handleOnBlur(parseFloat)}
                            onChange={this.handleOnChange}
                            style={styles.inputFix}
                            icon={this.renderInfoPopup(documentation.dmcoef, 'DMCOEF', 'top right')}
                        />
                    </Form.Field>
                </Form.Group>
            </Form>
        );
    }
}

DspPackageProperties.propTypes = {
    mtPackage: PropTypes.instanceOf(FlopyMt3dMtdsp),
    onChange: PropTypes.func.isRequired,
    readonly: PropTypes.bool.isRequired,
};


export default DspPackageProperties;
