import React, {ChangeEvent, SyntheticEvent, useState} from 'react';
import {DropdownProps, Form, Header, Input, PopupProps, Segment} from 'semantic-ui-react';

import {FlopyModflowMfpcg} from '../../../../../../core/model/flopy/packages/mf';
import {IFlopyModflowMfpcg} from '../../../../../../core/model/flopy/packages/mf/FlopyModflowMfpcg';
import {InfoPopup} from '../../../../../shared';
import {documentation} from '../../../../defaults/flow';

interface IProps {
    mfPackage: FlopyModflowMfpcg;
    onChange: (pck: FlopyModflowMfpcg) => void;
    readonly: boolean;
}

const PcgPackageProperties = (props: IProps) => {

    const [mfPackage, setMfPackage] = useState<IFlopyModflowMfpcg>(props.mfPackage.toObject());
    const handleOnSelect = (e: SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
        const {name, value} = data;
        setMfPackage({...mfPackage, [name]: value});
        props.onChange(FlopyModflowMfpcg.fromObject({...mfPackage, [name]: value}));
    };

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        return setMfPackage({...mfPackage, [name]: value});
    };

    const handleOnBlur = (cast?: (v: any) => any) => (e: ChangeEvent<HTMLInputElement>) => {
        const {name} = e.target;
        let {value} = e.target;

        if (cast) {
            value = cast(value);
        }

        setMfPackage({...mfPackage, [name]: value});
        props.onChange(FlopyModflowMfpcg.fromObject({...mfPackage, [name]: value}));
    };

    const renderInfoPopup = (
        description: string | JSX.Element,
        title: string,
        position: PopupProps['position'] | undefined = undefined,
        iconOutside: boolean | undefined = undefined
    ) => (
        <InfoPopup description={description} title={title} position={position} iconOutside={iconOutside}/>
    );

    const readOnly = props.readonly;

    if (!props.mfPackage) {
        return null;
    }

    return (
        <Form>
            <Header as={'h3'}>PCG: Preconditioned Conjugate-Gradient Package</Header>
            <Segment>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Maximum number of outer iterations (mxiter)</label>
                        <Input
                            readOnly={readOnly}
                            name="mxiter"
                            type={'number'}
                            value={mfPackage.mxiter}
                            icon={renderInfoPopup(documentation.pcg.mxiter, 'mxiter')}
                            onBlur={handleOnBlur(parseFloat)}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Maximum number of inner equations (iter1)</label>
                        <Input
                            readOnly={readOnly}
                            name="iter1"
                            type={'number'}
                            value={mfPackage.iter1}
                            icon={renderInfoPopup(documentation.pcg.iter1, 'iter1')}
                            onBlur={handleOnBlur(parseFloat)}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                    <Form.Field width={14}>
                        <label>Matrix conditioning method (npcond)</label>
                        <Form.Dropdown
                            options={[
                                {key: 0, value: 1, text: 'Modified Incomplete Cholesky'},
                                {key: 1, value: 2, text: 'Polynomial'},
                            ]}
                            placeholder="Select npcond"
                            name="npcond"
                            selection={true}
                            value={mfPackage.npcond}
                            disabled={readOnly}
                            onChange={handleOnSelect}
                        />
                    </Form.Field>
                    <Form.Field width={1}>
                        <label>&nbsp;</label>
                        {renderInfoPopup(documentation.pcg.npcond, 'npcond', 'top left', true)}
                    </Form.Field>
                    <Form.Field width={14}>
                        <label>Active cells surrounded by dry cells (ihcofadd)</label>
                        <Form.Dropdown
                            options={[
                                {key: 0, value: 0, text: '(0) Cell converts to dry'},
                                {key: 1, value: 1, text: '(1) Cell converts to dry only if HCOF coefficient is 0'},
                            ]}
                            name="ihcofadd"
                            selection={true}
                            value={mfPackage.ihcofadd}
                            disabled={readOnly}
                            onChange={handleOnSelect}
                        />
                    </Form.Field>
                    <Form.Field width={1}>
                        <label>&nbsp;</label>
                        {renderInfoPopup(documentation.pcg.ihcofadd, 'ihcofadd', 'top left', true)}
                    </Form.Field>
                </Form.Group>
            </Segment>
            <Segment>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Head change criterion (hclose)</label>
                        <Input
                            readOnly={readOnly}
                            name="hclose"
                            type={'number'}
                            value={mfPackage.hclose}
                            icon={renderInfoPopup(documentation.pcg.hclose, 'hclose')}
                            onBlur={handleOnBlur(parseFloat)}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Residual criterion (rclose)</label>
                        <Input
                            readOnly={readOnly}
                            name="rclose"
                            type={'number'}
                            value={mfPackage.rclose}
                            icon={renderInfoPopup(documentation.pcg.rclose, 'rclose')}
                            onBlur={handleOnBlur(parseFloat)}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Relaxation parameter (relax)</label>
                        <Input
                            readOnly={readOnly}
                            name="relax"
                            type={'number'}
                            value={mfPackage.relax}
                            icon={renderInfoPopup(documentation.pcg.relax, 'relax')}
                            onBlur={handleOnBlur(parseFloat)}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Eigenvalue upper bound (nbpol)</label>
                        <Input
                            disabled={readOnly}
                            name="nbpol"
                            type={'number'}
                            value={mfPackage.nbpol}
                            icon={renderInfoPopup(documentation.pcg.nbpol, 'nbpol')}
                            onBlur={handleOnBlur(parseFloat)}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Solver printout interval (iprpcg)</label>
                        <Input
                            readOnly={readOnly}
                            name="iprpcg"
                            type={'number'}
                            value={mfPackage.iprpcg}
                            icon={renderInfoPopup(documentation.pcg.iprpcg, 'iprpcg')}
                            onBlur={handleOnBlur(parseFloat)}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                    <Form.Field width={14}>
                        <label>Print options (mutpcg)</label>
                        <Form.Dropdown
                            options={[
                                {key: 0, value: 0, text:
                                        '(0) Tables of maximum head change and residual each interation'},
                                {key: 1, value: 1, text: '(1) Only total number of iterations'},
                                {key: 2, value: 2, text: '(2) No printing'},
                                {key: 3, value: 3, text: '(3) Printing only if convergence fails'},
                            ]}
                            placeholder="Select mutpcg"
                            name="mutpcg"
                            selection={true}
                            value={mfPackage.mutpcg}
                            disabled={readOnly}
                            onChange={handleOnSelect}
                        />
                    </Form.Field>
                    <Form.Field width={1}>
                        <label>&nbsp;</label>
                        {renderInfoPopup(documentation.pcg.mutpcg, 'mutpcg', 'top left', true)}
                    </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                    <Form.Field>
                        <label>Steady-state damping factor (damp)</label>
                        <Input
                            readOnly={readOnly}
                            name="damp"
                            type={'number'}
                            value={mfPackage.damp}
                            icon={renderInfoPopup(documentation.pcg.damp, 'damp')}
                            onBlur={handleOnBlur(parseFloat)}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Transient damping factor (dampt)</label>
                        <Input
                            readOnly={readOnly}
                            name="dampt"
                            type={'number'}
                            value={mfPackage.dampt}
                            icon={renderInfoPopup(documentation.pcg.dampt, 'dampt')}
                            onBlur={handleOnBlur(parseFloat)}
                            onChange={handleOnChange}
                        />
                    </Form.Field>
                </Form.Group>
            </Segment>

            <Form.Group widths="equal">
                <Form.Field>
                    <label>Filename extension (extension)</label>
                    <Input
                        readOnly={true}
                        name="extension"
                        value={mfPackage.extension || ''}
                        icon={renderInfoPopup(documentation.pcg.extension, 'extension')}
                    />
                </Form.Field>
                <Form.Field>
                    <label>File unit number (unitnumber)</label>
                    <Input
                        readOnly={true}
                        name="unitnumber"
                        value={mfPackage.unitnumber || ''}
                        icon={renderInfoPopup(documentation.pcg.unitnumber, 'unitnumber')}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Filenames (filenames)</label>
                    <Input
                        readOnly={true}
                        name="filenames"
                        value={mfPackage.filenames || ''}
                        icon={renderInfoPopup(documentation.pcg.filenames, 'filenames')}
                    />
                </Form.Field>
            </Form.Group>
        </Form>
    );
};

export default PcgPackageProperties;
