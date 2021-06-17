import {Message} from 'semantic-ui-react';
import {useState} from 'react';

interface IProps {
  header: string;
  description: string;
}

const InfoBox = ({header, description}: IProps) => {
  const [showInfo, setShowInfo] = useState<boolean>(true);

  const handleToggleInfo = () => setShowInfo(!showInfo);

  if (!showInfo) {
    return null;
  }

  return (
    <Message
      onDismiss={handleToggleInfo}
      header={header}
      icon="info circle"
      content={description}
    />
  );
};

export default InfoBox;
