import { Array2D } from '../../../core/model/geometry/Array2D.type';
import { Button, Grid, Image, Modal } from 'semantic-ui-react';
import { IContourExport } from './visualization.type';
import { useState } from 'react';
import ContourForm from './contourForm';
import axios from 'axios';

interface IProps {
  data: Array2D<number>;
}

const ContourModal = (props: IProps) => {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [result, setResult] = useState<any>();
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleChangeSettings = async (settings: IContourExport) => {
    const response = await axios
      .request({
        method: 'POST',
        url: 'https://processing.inowas.com/visualization/contour',
        headers: {
          'Content-Type': 'application/json',
        },
        data: props.data.map((row) => row.map((col) => (col === null ? -1 : col))),
      })

      .then((e: any) => {
        console.log('RESULT', e);
      })
      .catch((error) => {
        console.log(error.toJSON());
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        console.log(error.config);
      })
      .finally(() => {
        setIsFetching(false);
      });
    /*axios
      .request({
        method: 'POST',
        url: `https://processing.inowas.com/visualization/contour?xmin=${settings.xmin}&xmax=${settings.xmax}&ymin=${settings.ymin}&ymax=${settings.ymax}&clevels=${settings.clevels}&cmap=${settings.cmap}&target=${settings.target}&clabel=${settings.clabel}&xlabel=${settings.xlabel}&ylabel=${settings.ylabel}&zlabel=${settings.zlabel}`,
        headers: {
          'Content-Type': 'application/json',
        },
        data: props.data.map((row) => row.map((col) => (col === null ? -1 : col))),
      })
      .then((e: any) => {
        setResult(e);
      })
      .catch((e) => {
        console.log('ERROR', e);
      })
      .finally(() => {
        setIsFetching(false);
      });*/
  };

  const renderResult = () => {
    if (!result) {
      return null;
    }

    //const base64 = Buffer.from(result, 'binary').toString('base64');
    console.log(result);
    const blob = result.blob();
    const objectUrl = URL.createObjectURL(blob);

    console.log(objectUrl);

    // <img src={`data:image/png;base64,${Buffer.from(result, 'binary').toString('base64')}`} />
    return <img src={`data:image/png;base64,${objectUrl}`} />;
  };

  return (
    <Modal
      onClose={() => setShowModal(false)}
      onOpen={() => setShowModal(true)}
      open={showModal}
      size="fullscreen"
      trigger={<Button>Export Graphic</Button>}
      zIndex={1002}
    >
      <Modal.Header>Export Graphic</Modal.Header>
      <Modal.Content>
        <Grid>
          <Grid.Column width={8}>
            <ContourForm onChange={handleChangeSettings} isFetching={isFetching} />
          </Grid.Column>
          <Grid.Column width={8}>{renderResult()}</Grid.Column>
        </Grid>
      </Modal.Content>
    </Modal>
  );
};

export default ContourModal;
