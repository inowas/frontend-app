import React, {ChangeEvent, CSSProperties, SyntheticEvent, useState} from 'react';
import {ColorResult, SketchPicker} from 'react-color';
import {Button, DropdownProps, Form, InputOnChangeData, List, Message, Modal} from 'semantic-ui-react';
import {Rule} from '../../../../core/model/mcda/criteria';
import {IRule} from '../../../../core/model/mcda/criteria/Rule.type';

const styles = {
    popover: {
        position: 'absolute',
        zIndex: '2',
    },
    cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
    }
};

interface IProps {
    rule: Rule;
    onSave: (rule: Rule) => any;
    onClose: () => any;
    valueIsStatic?: boolean;
}

const CriteriaReclassificationModal = (props: IProps) => {
    const [activeInput, setActiveInput] = useState<string | null>(null);
    const [activeValue, setActiveValue] = useState<string>('');
    const [displayColorPicker, setDisplayColorPicker] = useState<boolean>(false);
    const [rule, setRule] = useState<IRule>(props.rule.toObject());

    const handleCloseColorPicker = () => setDisplayColorPicker(false);

    const handleChangeColor = (color: ColorResult) => setRule({
        ...rule,
        color: color.hex
    });

    const handleChangeColorPicker = () => setDisplayColorPicker(true);

    const handleLocalChange = (e: ChangeEvent<HTMLInputElement> | SyntheticEvent<HTMLElement>,
                               {name, value}: InputOnChangeData | DropdownProps) => setRule({
        ...rule,
        [name]: value
    });

    const handleChangeNumber = (e: ChangeEvent<HTMLInputElement>, {name, value}: InputOnChangeData) => {
        setActiveValue(value);
        setActiveInput(name);
    };

    const handleBlurNumber = () => {
        if (activeInput) {
            setRule({
                ...rule,
                [activeInput]: parseFloat(activeValue)
            });
            setActiveInput(null);
            setActiveValue('');
        }
    };

    const handleSave = () => {
        return props.onSave(Rule.fromObject(rule));
    };

    return (
        <Modal size="small" open={!!rule} dimmer={'blurring'}>
            <Modal.Header>Edit reclassification rule</Modal.Header>
            <Modal.Content>
                <Form>
                    <Form.Group>
                        <Form.Button
                            onClick={handleChangeColorPicker}
                            fluid={true}
                            style={{color: rule.color}}
                            icon="circle"
                            label="Color"
                            name="name"
                            width={3}
                        />
                        {displayColorPicker &&
                        <div style={styles.popover as CSSProperties}>
                            <div style={styles.cover as CSSProperties} onClick={handleCloseColorPicker}/>
                            <SketchPicker
                                disableAlpha={true}
                                color={rule.color}
                                onChange={handleChangeColor}
                            />
                        </div>
                        }
                        <Form.Input
                            fluid={true}
                            label="Class Name"
                            name="name"
                            type="text"
                            onChange={handleLocalChange}
                            value={rule.name}
                            width={13}
                        />
                    </Form.Group>
                    <Form.Group widths="equal">
                        <Form.Select
                            fluid={true}
                            label="From operator"
                            options={[
                                {key: 0, text: '>', value: '>'},
                                {key: 1, text: '>=', value: '>='}
                            ]}
                            placeholder="Operator"
                            name={'fromOperator'}
                            onChange={handleLocalChange}
                            value={rule.fromOperator}
                        />
                        <Form.Input
                            fluid={true}
                            label="From value"
                            name="from"
                            onBlur={handleBlurNumber}
                            onChange={handleChangeNumber}
                            type="number"
                            value={activeInput === 'from' ? activeValue : rule.from}
                        />
                    </Form.Group>
                    <Form.Group widths="equal">
                        <Form.Select
                            fluid={true}
                            label="To operator"
                            options={[
                                {key: 0, text: '<', value: '<'},
                                {key: 1, text: '<=', value: '<='}
                            ]}
                            placeholder="Operator"
                            name="toOperator"
                            onChange={handleLocalChange}
                            value={rule.toOperator}
                        />
                        <Form.Input
                            fluid={true}
                            label="To value"
                            type="number"
                            onBlur={handleBlurNumber}
                            onChange={handleChangeNumber}
                            name="to"
                            value={activeInput === 'to' ? activeValue : rule.to}
                        />
                    </Form.Group>
                    {!props.valueIsStatic &&
                    <Form.Group widths="equal">
                        <Form.Select
                            fluid={true}
                            label="Rule type"
                            options={[
                                {key: 0, text: 'Fixed suitability index', value: 'fixed'},
                                {key: 1, text: 'Calculation formula', value: 'calc'}
                            ]}
                            placeholder="Rule type"
                            name="type"
                            onChange={handleLocalChange}
                            value={rule.type}
                        />
                        {rule.type === 'fixed' ?
                            <Form.Input
                                fluid={true}
                                label="Standardized value"
                                icon="pencil"
                                iconPosition="left"
                                onChange={handleLocalChange}
                                type="number"
                                name="value"
                                value={rule.value}
                            /> :
                            <Form.Input
                                fluid={true}
                                label="Standardization function"
                                icon="calculator"
                                iconPosition="left"
                                onChange={handleLocalChange}
                                type="text"
                                name="expression"
                                value={rule.expression}
                            />
                        }
                    </Form.Group>
                    }
                </Form>
                {rule.type === 'calc' &&
                <Message>
                    <Message.Header>Suitability Calculation</Message.Header>
                    <p>
                        To get suitability values out of the raster data, you can use a calculation formula. The
                        following commands are available:
                    </p>
                    <List>
                        <List.Item>value represents the value of the raster cell</List.Item>
                        <List.Item>max represents the biggest value of inside the raster</List.Item>
                        <List.Item>min represents the lowest value of inside the raster</List.Item>
                    </List>
                </Message>
                }
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={props.onClose}>Cancel</Button>
                <Button primary={true} onClick={handleSave}>Save</Button>
            </Modal.Actions>
        </Modal>
    );
};

export default CriteriaReclassificationModal;
