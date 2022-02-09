import { IGameObject } from '../../../../core/marPro/GameObject.type';
import { ReactNode, useState } from 'react';
import Dialog from '../shared/Dialog';

interface IProps {
  children: ReactNode;
  gameObject: IGameObject;
}

const GameObject = (props: IProps) => {
  const [showDialog, setShowDialog] = useState<boolean>(false);

  const handleClickGameObject = (e: any) => setShowDialog(true);

  const handleCloseDialog = () => setShowDialog(false);

  return (
    <>
      {showDialog && <Dialog header="River" content="test" onClose={handleCloseDialog} />}
      <div onClick={handleClickGameObject}>{props.children}</div>
    </>
  );
};

export default GameObject;
