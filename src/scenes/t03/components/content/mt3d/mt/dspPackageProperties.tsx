import React from 'react';
import {Form, Header, Input} from 'semantic-ui-react';
import {InfoPopup} from '../../../../../shared';
import {documentation} from '../../../../defaults/transport';
import AbstractPackageProperties from './AbstractPackageProperties';

class DspPackageProperties extends AbstractPackageProperties {
    public render() {

        if (!this.state.mtPackage) {
            return null;
        }

        const {readOnly} = this.props;
        const {mtPackage} = this.state;

        return (
            <Form>
                <Header as={'h3'}>DSP: Dispersion Package</Header>
                <Form.Group widths={'equal'}>
                    <Form.Field>
                        <label>Longitudinal dispersivity (AL)</label>
                        <Input
                            type={'number'}
                            name={'al'}
                            value={mtPackage.al}
                            disabled={readOnly}
                            onBlur={this.handleOnBlur(parseFloat)}
                            onChange={this.handleOnChange}
                            icon={<InfoPopup
                                description={documentation.dsp.al}
                                title={'AL'}
                                position={'top right'}
                            />}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Effective molecular diffusion coefficient (DMCOEF)</label>
                        <Input
                            type={'number'}
                            name={'dmcoef'}
                            value={mtPackage.dmcoef}
                            disabled={readOnly}
                            onBlur={this.handleOnBlur(parseFloat)}
                            onChange={this.handleOnChange}
                            icon={<InfoPopup
                                description={documentation.dsp.dmcoef}
                                title={'DMCOEF'}
                                position={'top right'}
                            />}
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Group widths={'equal'}>
                    <Form.Field>
                        <label>Horizontal dispersivity to AL ratio (TRPT)</label>
                        <Input
                            type={'number'}
                            name={'trpt'}
                            value={mtPackage.trpt}
                            disabled={readOnly}
                            onBlur={this.handleOnBlur(parseFloat)}
                            onChange={this.handleOnChange}
                            icon={<InfoPopup
                                    description={documentation.dsp.trpt}
                                    title={'TRPT'}
                                    position={'top left'}
                            />}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Vertical dispersivity to AL ratio (TRPV)</label>
                        <Input
                            type={'number'}
                            name={'trpv'}
                            value={mtPackage.trpv}
                            disabled={readOnly}
                            onBlur={this.handleOnBlur(parseFloat)}
                            onChange={this.handleOnChange}
                            icon={<InfoPopup
                                    description={documentation.dsp.trpv}
                                    title={'TRPV'}
                                    position={'top right'}
                            />}
                        />
                    </Form.Field>
                </Form.Group>
            </Form>
        );
    }
}

/*DspPackageProperties.propTypes = {
    mtPackage: PropTypes.instanceOf(FlopyMt3dMtdsp),
    onChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool.isRequired,
};*/

export default DspPackageProperties;
