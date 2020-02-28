import React from 'react';
import {Form, Header, Input, Segment, Select} from 'semantic-ui-react';
import {InfoPopup} from '../../../../../shared';
import {documentation} from '../../../../defaults/transport';
import AbstractPackageProperties from './AbstractPackageProperties';

class GcgPackageProperties extends AbstractPackageProperties {
    public render() {
        if (!this.state.mtPackage) {
            return null;
        }

        const {readOnly} = this.props;
        const {mtPackage} = this.state;

        return (
            <Form>
                <Header as={'h3'} dividing={true}>GCG: Generalized Conjugate Gradient Package</Header>
                <Segment.Group>
                    <Segment>
                        <Form.Group widths={'equal'}>
                            <Form.Field>
                                <label>Maximum outer iterations (MXITER)</label>
                                <Input
                                    type={'number'}
                                    name={'mxiter'}
                                    value={mtPackage.mxiter}
                                    disabled={readOnly}
                                    onBlur={this.handleOnBlur(parseInt)}
                                    onChange={this.handleOnChange}
                                    icon={<InfoPopup
                                        description={documentation.gcg.mxiter}
                                        title={'MXITER'}
                                        position={'top left'}
                                    />}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Maximum inner iterations (ITER1)</label>
                                <Input
                                    type={'number'}
                                    name={'iter1'}
                                    value={mtPackage.iter1}
                                    disabled={readOnly}
                                    onBlur={this.handleOnBlur(parseInt)}
                                    onChange={this.handleOnChange}
                                    icon={<InfoPopup
                                        description={documentation.gcg.iter1}
                                        title={'ITER1'}
                                        position={'top right'}
                                    />}
                                />
                            </Form.Field>
                        </Form.Group>
                    </Segment>
                    <Segment>
                        <Form.Group>
                            <Form.Field width={15}>
                                <label>Preconditioning Methods Lanczos/ORTHOMIN (ISOLVE)</label>
                                <Select
                                    fluid={true}
                                    name={'isolve'}
                                    value={mtPackage.isolve}
                                    disabled={readOnly}
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
                                <InfoPopup
                                    description={documentation.gcg.isolve}
                                    title={'ISOLVE'}
                                    position={'top right'}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Relaxation factor (ACCL)</label>
                                <Input
                                    type={'number'}
                                    name={'accl'}
                                    value={mtPackage.accl}
                                    disabled={readOnly}
                                    onBlur={this.handleOnBlur(parseInt)}
                                    onChange={this.handleOnChange}
                                    icon={<InfoPopup
                                        description={documentation.gcg.accl}
                                        title={'ACCL'}
                                        position={'top right'}
                                    />}
                                />
                            </Form.Field>
                        </Form.Group>
                    </Segment>
                    <Segment>
                        <Form.Group>
                            <Form.Field width={15}>
                                <label>Dispersion tensor cross terms (NCRS)</label>
                                <Select
                                    fluid={true}
                                    name={'ncrs'}
                                    value={mtPackage.ncrs}
                                    disabled={readOnly}
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
                                <InfoPopup description={documentation.gcg.ncrs} title={'NCRS'} position={'top right'} />
                            </Form.Field>
                        </Form.Group>
                        <Form.Group widths={'equal'}>
                            <Form.Field>
                                <label>Relative convergence criterion (CCLOSE)</label>
                                <Input
                                    type={'number'}
                                    name={'cclose'}
                                    value={mtPackage.cclose}
                                    disabled={readOnly}
                                    onBlur={this.handleOnBlur(parseFloat)}
                                    onChange={this.handleOnChange}
                                    icon={<InfoPopup
                                        description={documentation.gcg.cclose}
                                        title={'CCLOSE'}
                                        position={'top right'}
                                    />}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Max. concentration changes printing interval (IPRGCG)</label>
                                <Input
                                    type={'number'}
                                    name={'iprgcg'}
                                    value={mtPackage.iprgcg}
                                    disabled={readOnly}
                                    onBlur={this.handleOnBlur(parseInt)}
                                    onChange={this.handleOnChange}
                                    icon={<InfoPopup
                                        description={documentation.gcg.iprgcg}
                                        title={'IPRGCG'}
                                        position={'top right'}
                                    />}
                                />
                            </Form.Field>
                        </Form.Group>
                    </Segment>
                </Segment.Group>
            </Form>
        );
    }
}

export default GcgPackageProperties;
