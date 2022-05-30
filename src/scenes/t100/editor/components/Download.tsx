import { Button, Segment } from 'semantic-ui-react';
import Scenario from '../../../../core/marPro/Scenario';

interface IProps {
  scenario: Scenario;
}

const Download = (props: IProps) => {
  const handleClickDownload = () => {
    const ds = props.scenario;

    const filename = 'scenario_' + props.scenario.id + '.json';
    const text = JSON.stringify(ds, null, 2);
    const blob = new Blob([text], {
      type: 'application/json;charset=utf-8;'
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (window.navigator.msSaveBlob) {
      // FOR IE BROWSER
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      navigator.msSaveBlob(blob, filename);
    } else {
      // FOR OTHER BROWSERS
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.style.visibility = 'hidden';
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  return (
    <Segment color="black"><Button fluid onClick={handleClickDownload}>Download</Button></Segment>
  )
}

export default Download;