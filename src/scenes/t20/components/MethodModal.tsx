import {Button, Form, Modal} from 'semantic-ui-react';
import {EMethodType} from '../../../core/model/rtm/modelling/RTModelling.type';
import React, {useState} from 'react';

interface IProps {
    method: EMethodType;
    onClose: () => void;
    onSave: () => void;
}

const MethodModal = (props: IProps) => {
    const [func, setFunc] = useState<string>();

    const renderForm = () => {
        if (props.method === EMethodType.SENSOR) {
            return (
                <Form>
                    <Form.Field>
                        <Form.Input
                            label="Function"
                            placeholder='Enter function ...'
                        />
                    </Form.Field>
                    <Form.Field>
                        <Form.Input
                            label="Function"
                            placeholder='Enter function ...'
                        />
                    </Form.Field>
                    <Form.Field>
                        <Form.Input
                            label="Function"
                            placeholder='Enter function ...'
                        />
                    </Form.Field>
                </Form>
            );
        }

        return (
          <Form>
              <Form.Field>
                  <Form.Input
                      label="Function"
                      placeholder='Enter function ...'
                  />
              </Form.Field>
          </Form>
        );
    }

    return (
        <Modal
            open={true}
        >
            <Modal.Header>Edit Method Details</Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    {renderForm()}
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                <Button color='black' onClick={props.onClose}>
                    Cancel
                </Button>
                <Button
                    content="Yep, that's me"
                    labelPosition='right'
                    icon='checkmark'
                    onClick={props.onSave}
                    positive
                />
            </Modal.Actions>
        </Modal>
    );
};

export default MethodModal;
