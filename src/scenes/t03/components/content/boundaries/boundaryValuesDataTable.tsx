import {AdvancedCsvUpload} from '../../../../shared/upload';
import {Boundary, LineBoundary} from '../../../../../core/model/modflow/boundaries';
import {Button, Icon, Input, Message, Pagination, PaginationProps, Table} from 'semantic-ui-react';
import {ISpValues} from '../../../../../core/model/modflow/boundaries/Boundary.type';
import {Stressperiods} from '../../../../../core/model/modflow';
import {cloneDeep} from 'lodash';
import CalculationModal from './calculationModal';
import React, {ChangeEvent, MouseEvent, useState} from 'react';
import moment from 'moment';

interface IActiveInput {
  col: number;
  name: string;
  row: number;
  value: string;
}

interface IProps {
  boundary: Boundary;
  onChange: (boundary: Boundary) => any;
  readOnly: boolean;
  selectedOP?: string;
  stressperiods: Stressperiods;
}

const BoundaryValuesDataTable = (props: IProps) => {
  const [activeInput, setActiveInput] = useState<IActiveInput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stressperiodsPerPage] = useState<number>(20);
  const [paginationPage, setPaginationPage] = useState<number>(1);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [showCalculationModal, setShowCalculationModal] = useState<boolean>(false);

  const {boundary, selectedOP} = props;

  const getSpValues = () => {
    if (boundary instanceof LineBoundary) {
      return selectedOP ? boundary.getSpValues(props.stressperiods, selectedOP) : null;
    }
    return boundary.getSpValues(props.stressperiods);
  };

  const spValues: ISpValues | null = getSpValues();

  const handleToggleUploadModal = () => setShowUploadModal(!showUploadModal);

  const handleToggleCalculationModal = () => setShowCalculationModal(!showCalculationModal);

  const handleChangePagination = (e: MouseEvent, {activePage}: PaginationProps) =>
    setPaginationPage(typeof activePage === 'number' ? activePage : 1);

  const handleLocalChange = (row: number, col: number) => (e: ChangeEvent<HTMLInputElement>) => setActiveInput({
    col,
    name: e.target.name,
    row,
    value: e.target.value
  });

  const handleSpValuesChange = () => {
    if (!activeInput) {
      return;
    }
    const {value, row, col} = activeInput;
    setActiveInput(null);

    if (spValues) {
      const updatedSpValues = Boundary.mergeStressperiodsWithSpValues(props.stressperiods, spValues)
        .map((spv, spvIdx) => {
          const newRow = cloneDeep(spv);
          if (row === spvIdx) {
            newRow[col] = parseFloat(value) || 0;
            return newRow;
          }
          return newRow;
        });
      boundary.setSpValues(updatedSpValues as ISpValues, selectedOP);
    }
    return props.onChange(boundary);
  };

  const handleImportCsv = (data: any[][]) => {
    if (spValues && data.length !== spValues.length) {
      setError('Number of rows in file must be equal to number of stressperiods, when assigning by keys. ' +
        'Try to assign rows by datetime.');
      return null;
    }
    if (spValues) {
      const updatedSpValues = spValues.map((spv, key) => {
        return data[key];
      });
      boundary.setSpValues(updatedSpValues, selectedOP);
    }
    setError(null);
    return props.onChange(boundary);
  };

  const getCellStyle = (numberOfCells: number) => {
    switch (numberOfCells) {
      case 2:
        return {
          maxWidth: '130px',
          padding: 0,
          border: 0
        };
      case 3:
        return {
          maxWidth: '130px',
          padding: 0,
          border: 0
        };
      default:
        return {
          maxWidth: '150px',
          padding: 0,
          border: 0
        };
    }
  };

  const body = () => {
    const {stressperiods} = props;

    const dateTimes = stressperiods.dateTimes;

    if (!spValues) {
      return (
        <Table.Row>
          <Table.Cell>There are no stress period values.</Table.Cell>
        </Table.Row>
      );
    }

    const startingIndex = (paginationPage - 1) * stressperiodsPerPage;
    const endingIndex = startingIndex + stressperiodsPerPage;

    return spValues.slice(startingIndex, endingIndex).map((spValue, spIdx) => (
      <Table.Row key={spIdx}>
        <Table.Cell width={4}>
          <Input
            style={getCellStyle(1)}
            disabled={true}
            id={spIdx}
            name={'dateTime'}
            type={'date'}
            value={moment(dateTimes[startingIndex + spIdx]).format('YYYY-MM-DD')}
          />
        </Table.Cell>
        {spValue.map((v, vIdx) => (
          <Table.Cell key={vIdx}>
            <Input
              style={getCellStyle(spValue.length)}
              disabled={props.readOnly}
              id={spIdx}
              col={vIdx}
              name={'dateTimeValue'}
              onBlur={handleSpValuesChange}
              onChange={handleLocalChange(startingIndex + spIdx, vIdx)}
              type={'number'}
              value={activeInput && activeInput.col === vIdx &&
              activeInput.row === (startingIndex + spIdx) ? activeInput.value : v}
            />
          </Table.Cell>
        ))}
      </Table.Row>
    ));
  };

  return (
    <div>
      {showUploadModal &&
      <AdvancedCsvUpload
        columns={
          boundary.valueProperties.map((p, key) => {
            return {
              key: key + 1,
              value: p.name.toLowerCase(),
              text: p.name
            };
          })
        }
        fixedDateTimes={props.stressperiods.dateTimes}
        onCancel={handleToggleUploadModal}
        onSave={handleImportCsv}
        useDateTimes={false}
      />
      }
      {showCalculationModal && spValues &&
      <CalculationModal
        onCancel={handleToggleCalculationModal}
        onSave={() => null}
        spValues={spValues}
        valueProperties={boundary.valueProperties}
      />
      }
      {!props.readOnly &&
      <p style={{marginTop: '10px'}}>
        <b>Time dependent boundary values{boundary instanceof LineBoundary ? ' observation point' : ''}</b>
        <Button
          icon={true}
          labelPosition="left"
          onClick={handleToggleUploadModal}
          primary={true}
          floated="right"
          size="mini"
        >
          <Icon name="upload"/>
          Upload csv
        </Button>
        {error && <Message error>{error}</Message>}
      </p>
      }
      {spValues && spValues.length > 20 &&
      <Pagination
        activePage={paginationPage}
        onPageChange={handleChangePagination}
        size="mini"
        totalPages={Math.ceil(spValues.length / stressperiodsPerPage)}
      />
      }
      <Table size={'small'} singleLine={true}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Start Date</Table.HeaderCell>
            {boundary.valueProperties.map((p, idx) => (
              <Table.HeaderCell key={idx}>{p.name} ({p.unit})</Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>{spValues && body()}</Table.Body>
      </Table>
    </div>
  );
};

export default BoundaryValuesDataTable;
