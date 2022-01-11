import { Form, Input } from 'semantic-ui-react';
import FlopySeawatSwt from '../../../../../../core/model/flopy/packages/swt/FlopySeawatSwt';
import React from 'react';

interface IProps {
  swtPackage: FlopySeawatSwt;
}

const seawatPackageProperties = (props: IProps) => {
  const { swtPackage } = props;

  return (
    <Form>
      <Form.Group widths="equal">
        <Form.Field>
          <label>Executable name</label>
          <Input value={swtPackage.exe_name} readOnly={true} />
        </Form.Field>
        <Form.Field>
          <label>Version</label>
          <Input value={swtPackage.version} readOnly={true} />
        </Form.Field>
      </Form.Group>
    </Form>
  );
};

export default seawatPackageProperties;
