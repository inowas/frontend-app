import PropTypes from 'prop-types';
import React from 'react';
import {Header, Form, Input} from 'semantic-ui-react';

import AbstractPackageProperties from './AbstractPackageProperties';
import {FlopyModflowMfdis} from 'core/model/flopy/packages/mf';


class DisPackageProperties extends AbstractPackageProperties {

    render() {
        if (!this.state.mfPackage) {
            return null;
        }

        const {readonly, mfPackage} = this.props;

        return (
            <Form>
                <Header as={'h4'}>To be implemented</Header>
                <Form.Field>
                    <label>Model object</label>
                    <Form.Dropdown
                        placeholder='Select model'
                        name='model'
                        selection
                        value={JSON.stringify(mfPackage.model)}
                    />
                </Form.Field>

                <Form.Group>
                    <Form.Field width={4}>
                        <label>Layers (nlay)</label>
                        <Input readOnly
                               type={'number'}
                               name='nlay'
                               value={mfPackage.nlay}
                        />
                    </Form.Field>
                    <Form.Field width={4}>
                        <label>Rows (nrow)</label>
                        <Input readOnly
                               type={'number'}
                               name='nrow'
                               value={mfPackage.nrow}
                        />
                    </Form.Field>
                    <Form.Field width={4}>
                        <label>Columns (ncol)</label>
                        <Input readOnly
                               type={'number'}
                               name='ncol'
                               value={mfPackage.ncol}
                        />
                    </Form.Field>
                    <Form.Field width={4}>
                        <label>Stress periods (nper)</label>
                        <Input readOnly
                               type={'number'}
                               name='nper'
                               value={mfPackage.nper}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group>
                    <Form.Field>
                        <label>Row spacing (delr)</label>
                        <Input readOnly
                               name='delr'
                               value={JSON.stringify(mfPackage.delr)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Column spacing (delc)</label>
                        <Input readOnly
                               name='delc'
                               value={JSON.stringify(mfPackage.delc)}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group>
                    <Form.Field>
                        <label>Confining bed (laycbd)</label>
                        <Input readOnly
                               name='laycbd'
                               value={JSON.stringify(mfPackage.laycbd)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Top elevation (top)</label>
                        <Input readOnly
                               name='top'
                               value={JSON.stringify(mfPackage.top)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Bottom elevation (botm)</label>
                        <Input readOnly
                               name='botm'
                               value={JSON.stringify(mfPackage.botm)}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group>
                    <Form.Field>
                        <label>Stress period lengths (perlen)</label>
                        <Input readOnly
                               name='perlen'
                               value={JSON.stringify(mfPackage.perlen)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Time steps in stress period (nstp)</label>
                        <Input readOnly
                               name='nstp'
                               value={JSON.stringify(mfPackage.nstp)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Time step multiplier (tsmult)</label>
                        <Input readOnly
                               name='tsmult'
                               value={JSON.stringify(mfPackage.tsmult)}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Field>
                    <label>State of stress period (steady)</label>
                    <Input readOnly
                           name='steady'
                           value={JSON.stringify(mfPackage.steady)}
                    />
                </Form.Field>

                <Form.Group>
                    <Form.Field>
                        <label>Time units (itmuni)</label>
                        <Input readOnly
                               type={'number'}
                               name='itmuni'
                               value={JSON.stringify(mfPackage.itmuni)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Length units (lenuni)</label>
                        <Input readOnly
                               type={'number'}
                               name='lenuni'
                               value={JSON.stringify(mfPackage.lenuni)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Filename extension</label>
                        <Input readOnly
                               name='extension'
                               value={mfPackage.extension}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>File unit number</label>
                        <Input readOnly
                               type={'number'}
                               name='unitnumber'
                               value={JSON.stringify(mfPackage.unitnumber)}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Field>
                    <label>Filenames</label>
                    <Input readOnly
                           name='filenames'
                           value={JSON.stringify(mfPackage.filenames)}
                    />
                </Form.Field>

                <Form.Group>
                    <Form.Field>
                        <label>Upper left corner x coordinate (xul)</label>
                        <Input readOnly
                               type={'number'}
                               name='xul'
                               value={JSON.stringify(mfPackage.xul)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Upper left corner y coordinate (yul)</label>
                        <Input readOnly
                               type={'number'}
                               name='yul'
                               value={JSON.stringify(mfPackage.yul)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Rotation</label>
                        <Input readOnly
                               type={'number'}
                               name='rotation'
                               value={JSON.stringify(mfPackage.rotation)}
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Field>
                    <label>proj4_str</label>
                    <Input readOnly
                           name='proj4_str'
                           value={mfPackage.proj4_str}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Starting date time (start_dateteim)</label>
                    <Input readOnly
                           type={'date'}
                           name='start_dateteim'
                           value={JSON.stringify(mfPackage.start_dateteim)}
                    />
                </Form.Field>
            </Form>
        );
    }
}

DisPackageProperties.propTypes = {
    mfPackage: PropTypes.instanceOf(FlopyModflowMfdis),
    onChange: PropTypes.func.isRequired,
    readonly: PropTypes.bool.isRequired
};


export default DisPackageProperties;
