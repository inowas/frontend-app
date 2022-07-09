import { Image, Label } from 'semantic-ui-react';
import { getImage } from '../../../assets/images';
import ResourceSettings from '../../../../../core/marPro/ResourceSettings';

interface IProps {
  amount: number;
  resource: ResourceSettings;
}

const ResourceLabel = ({ amount, resource }: IProps) => {
  return (
    <Label image>
      <Image src={getImage(resource.icon)} />
      {amount}
    </Label>
  );
};

export default ResourceLabel;
