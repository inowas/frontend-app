import PropTypes from 'prop-types';
import React from 'react';
import {Form, Input, Select} from 'semantic-ui-react';
import AbstractPackageProperties from './AbstractPackageProperties';
import {documentation} from '../../../../defaults/transport';
import {FlopyMt3dMtgcg} from '../../../../../../core/model/flopy/packages/mt';

const styles = {
    accordionFix: {
        width: 'auto'
    },
    inputFix: {
        padding: '0',
        height: 'auto'
    }
};

class GcgPackageProperties extends AbstractPackageProperties {
    render() {
        if (!this.state.mtPackage) {
            return null;
        }

        const {readonly} = this.props;
        const {mtPackage} = this.state;

        return (
            <Form>
                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Maximum outer iterations (Mxiter)</label>
                        <Input
                            type={'number'}
                            name={'mxiter'}
                            value={mtPackage.mxiter}
                            disabled={readonly}
                            onBlur={this.handleOnBlur(parseInt)}
                            onChange={this.handleOnChange}
                            style={styles.inputFix}
                            icon={this.renderInfoPopup(documentation.mxiter, 'MXITER', 'top left')}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Maximum inner iterations (Iter1)</label>
                        <Input
                            type={'number'}
                            name={'iter1'}
                            value={mtPackage.iter1}
                            disabled={readonly}
                            onBlur={this.handleOnBlur(parseInt)}
                            onChange={this.handleOnChange}
                            style={styles.inputFix}
                            icon={this.renderInfoPopup(documentation.iter1, 'ITER1', 'top right')}
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Group>
                    <Form.Field width={15}>
                        <label>Preconditioners to be used with the Lanczos/ORTHOMIN acceleration scheme
                            (Isolve)</label>
                        <Select fluid
                                name={'isolve'}
                                value={mtPackage.isolve}
                                disabled={readonly}
                                onChange={this.handleOnSelect}
                                options={[
                                    {key: 0, value: 1, text: '1: Jacobi'},
                                    {key: 1, value: 2, text: '2: SSOR'},
                                    {key: 2, value: 3, text: '3: Modified Incomplete Cholesky (MIC)'},
                                ]}
                        />
                    </Form.Field>
                    <Form.Field width={1}>
                        <label>&nbsp;</label>
                        {this.renderInfoPopup(documentation.isolve, 'ISOLVE', 'top right', true)}
                    </Form.Field>
                </Form.Group>
                <Form.Group>
                    <Form.Field width={15}>
                        <label>Treatment of dispersion tensor cross terms (Ncrs)</label>
                        <Select fluid
                                name={'ncrs'}
                                value={mtPackage.ncrs}
                                disabled={readonly}
                                onChange={this.handleOnSelect}
                                options={[
                                    {
                                        key: 0,
                                        value: 0,
                                        text: '0: Lump all dispersion cross terms to the right-hand-side'
                                    },
                                    {key: 1, value: 1, text: '1: Include full dispersion tensor'},
                                ]}
                        />
                    </Form.Field>
                    <Form.Field width={1}>
                        <label>&nbsp;</label>
                        {this.renderInfoPopup(documentation.ncrs, 'NCRS', 'top right', true)}
                    </Form.Field>
                </Form.Group>
                <Form.Field>
                    <label>Relaxation factor for the SSOR option (Accl)</label>
                    <Input
                        type={'number'}
                        name={'accl'}
                        value={mtPackage.accl}
                        disabled={readonly}
                        onBlur={this.handleOnBlur(parseInt)}
                        onChange={this.handleOnChange}
                        style={styles.inputFix}
                        icon={this.renderInfoPopup(documentation.accl, 'ACCL', 'top right')}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Convergence criterion in terms of relative concentration (Cclose)</label>
                    <Input
                        type={'number'}
                        name={'cclose'}
                        value={mtPackage.cclose}
                        disabled={readonly}
                        onBlur={this.handleOnBlur(parseFloat)}
                        onChange={this.handleOnChange}
                        style={styles.inputFix}
                        icon={this.renderInfoPopup(documentation.cclose, 'CCLOSE', 'top right')}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Maximum concentration changes of each iteration (Iprgcg)</label>
                    <Input
                        type={'number'}
                        name={'iprgcg'}
                        value={mtPackage.iprgcg}
                        disabled={readonly}
                        onBlur={this.handleOnBlur(parseInt)}
                        onChange={this.handleOnChange}
                        style={styles.inputFix}
                        icon={this.renderInfoPopup(documentation.iprgcg, 'IPRGCG', 'top right')}
                    />
                </Form.Field>
            </Form>
        );
    }
}

GcgPackageProperties.propTypes = {
    mtPackage: PropTypes.instanceOf(FlopyMt3dMtgcg),
    onChange: PropTypes.func.isRequired,
    readonly: PropTypes.bool.isRequired,
};

export default GcgPackageProperties;
