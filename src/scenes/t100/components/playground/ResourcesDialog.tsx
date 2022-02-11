import { IResource } from '../../../../core/marPro/Resource.type';
import Dialog from '../shared/Dialog';

interface IProps {
  resources: IResource[];
}

const ResourcesDialog = (props: IProps) => {
  const renderContent = () => {
    return (
      <div>
        {props.resources.map((r, k) => (
          <p key={k}>
            {r.id}: {r.value}
          </p>
        ))}
      </div>
    );
  };

  return <Dialog header="Resources" content={renderContent()} />;
};

export default ResourcesDialog;
