import {Button, Icon, Input, InputProps, Segment, Table} from 'semantic-ui-react';
import {ChangeEvent, useState} from 'react';
import {downloadFile} from '../../../shared/simpleTools/helpers';
import IResults from '../../../../core/model/qmra/result/Results.type';

interface IProps {
  results: IResults;
}

const Export = ({results}: IProps) => {
  const [activeInput, setActiveInput] = useState<number | null>(null);
  const [activeValue, setActiveValue] = useState<string>('');
  const [filenames, setFilenames] = useState<string[]>(Object.keys(results).map((r) => r));

  const handleBlur = () => {
    if (activeInput === null) {
      return null;
    }

    console.log({activeInput, activeValue});

    if (filenames.length > activeInput) {
      filenames[activeInput] = activeValue;
      setFilenames(filenames);
    }
    setActiveInput(null);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>, {name, value}: InputProps) => {
    setActiveInput(name);
    setActiveValue(value);
  };

  const handleDownloadCSV = (k: string, n: number) => () => {
    if (k in results) {
      const filename = filenames.length > n ? filenames[n] + '.csv' : 'undefined.csv';

      const keys = Object.keys(results[k][0]);

      let content = 'data:text/csv;charset=utf-8,';
      content += keys.join(',');
      content += '\r\n';

      results[k].forEach((row: any) => {
        content += Object.values(row).join(',');
        content += '\r\n';
      });

      const encodedUri = encodeURI(content);

      downloadFile(filename, encodedUri);
    }
  };

  const handleDownloadJSON = (k: string, n: number) => () => {
    if (k in results) {
      const filename = filenames.length > n ? filenames[n] + '.json' : 'undefined.json';
      const content = JSON.stringify(results[k], null, 2);

      const element: HTMLAnchorElement = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
      element.setAttribute('download', filename);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const keys = Object.keys(results);

  return (
    <Segment color="blue">
      <Table celled striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell textAlign='center'>Filename</Table.HeaderCell>
            <Table.HeaderCell textAlign='center'>Download</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {keys.map((k, n) => (
            <Table.Row key={k}>
              <Table.Cell>{k}</Table.Cell>
              <Table.Cell textAlign='center'>
                <Input
                  name={n}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Filename"
                  size="mini"
                  value={activeInput === n ? activeValue : (filenames.length > n ? filenames[n] : 'undefined')}
                />
              </Table.Cell>
              <Table.Cell textAlign='center'>
                  <Button
                    onClick={handleDownloadCSV(k, n)}
                    size="mini"
                    icon labelPosition='left'
                  >
                    CSV
                    <Icon name='file' />
                  </Button>
                  <Button
                    onClick={handleDownloadJSON(k, n)}
                    size="mini"
                    icon labelPosition='left'
                  >
                    JSON
                    <Icon name='file' />
                  </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Segment>
  );
};

export default Export;
