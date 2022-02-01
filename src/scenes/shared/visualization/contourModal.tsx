import { Array2D } from '../../../core/model/geometry/Array2D.type';
import { Button, Dimmer, Grid, Icon, Image, Loader, Modal } from 'semantic-ui-react';
import { IContourExport, contourDefaults } from './visualization.type';
import { useEffect, useState } from 'react';
import ContourForm from './contourForm';
import axios from 'axios';

interface IProps {
  data: Array2D<number>;
}

const ContourModal = (props: IProps) => {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [getUrl, setGetUrl] = useState<string | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [settings, setSettings] = useState<IContourExport>(contourDefaults);

  const getFullUrl = (settings: IContourExport) => {
    return (
      getUrl +
      '?' +
      Object.keys(settings)
        .filter((k) => settings[k] !== undefined && settings[k] !== '')
        .map((k: string) => {
          return encodeURIComponent(k) + '=' + encodeURIComponent(settings[k]);
        })
        .join('&')
    );
  };

  const getImage = async (settings: IContourExport) => {
    setIsFetching(true);
    const getResponse = await axios.get(getFullUrl(settings), { responseType: 'blob' });
    const objectUrl = URL.createObjectURL(getResponse.data);
    setObjectUrl(objectUrl);
    setIsFetching(false);
  };

  const postData = async (data: Array2D<number>) => {
    setIsFetching(true);
    const postResponse = await axios.post('https://processing.inowas.com/visualization/contour', data, {
      headers: {
        'Content-Type': 'application/json',
      },
      responseType: 'blob',
    });
    setGetUrl(postResponse.request.responseURL);
    setIsFetching(false);
  };

  useEffect(() => {
    if (showModal && !getUrl) {
      const data = props.data.map((row) => row.map((col) => (col === null ? -1 : col))) as Array2D<number>;
      postData(data);
    }
  }, [getUrl, props.data, showModal]);

  const handleChangeSettings = (settings: IContourExport) => {
    setSettings(settings);
    getImage(settings);
  };

  const handleClickDownload = () => {
    const tempLink = document.createElement('a');
    tempLink.href = getFullUrl(settings);
    tempLink.setAttribute('download', `${settings.name}.${settings.filetype}`);
    tempLink.target = '_blank';
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
  };

  const renderResult = () => {
    if (isFetching) {
      return (
        <Dimmer active inverted>
          <Loader inverted>Generating image ...</Loader>
        </Dimmer>
      );
    }
    if (!objectUrl) {
      return null;
    }

    return (
      <>
        <Image src={objectUrl} centered />
        <Button icon labelPosition="left" floated="right" onClick={handleClickDownload} primary>
          <Icon name="download" />
          Download
        </Button>
      </>
    );
  };

  return (
    <Modal
      onClose={() => setShowModal(false)}
      onOpen={() => setShowModal(true)}
      open={showModal}
      size="fullscreen"
      trigger={<Button>Export Graphic</Button>}
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
