import { AdvancedCsvUpload } from '../../../../shared/upload';
import { Boundary, LineBoundary } from '../../../../../core/model/modflow/boundaries';
import {
  Button,
  Icon,
  Input,
  InputProps,
  Label,
  Message,
  Pagination,
  PaginationProps,
  Popup,
  Table,
} from 'semantic-ui-react';
import { ISpValues } from '../../../../../core/model/modflow/boundaries/Boundary.type';
import { ModflowModel, Stressperiods } from '../../../../../core/model/modflow';
import { cloneDeep } from 'lodash';
import BoundaryDateTimeImporter from './boundaryDateTimeImporter';
import RasterParameter from '../../../../../core/model/modflow/soilmodel/RasterParameter';
import RasterfileUploadModal, { IData } from '../../../../shared/rasterData/rasterfileUploadModal';
import React, { ChangeEvent, FormEvent, MouseEvent, useMemo, useState } from 'react';
import moment from 'moment';

interface IActiveInput {
  col: number;
  name: string | 'raster' | 'dateTimeValue';
  row: number;
  value: string | number | number[][];
}

interface IProps {
  model: ModflowModel;
  boundary: Boundary;
  isScenario: boolean;
  onChange: (boundary: Boundary) => any;
  readOnly: boolean;
  selectedOP?: string;
  stressperiods: Stressperiods;
}

const dataTableCellsPerRow = 4;

const BoundaryRasterValuesDataTable = (props: IProps) => {
  const [activeInput, setActiveInput] = useState<IActiveInput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stressperiodsPerPage] = useState<number>(20);
  const [paginationPage, setPaginationPage] = useState<number>(1);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);


  const [showRasterFileUploadModal, setShowRasterFileUploadModal] = useState<boolean>(false);

  const { boundary, selectedOP } = props;

  const getSpValues = () => {
    if (boundary instanceof LineBoundary) {
      return selectedOP ? boundary.getSpValues(props.stressperiods, selectedOP) : null;
    }
    return boundary.getSpValues(props.stressperiods);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const spValues: ISpValues | null = useMemo(() => getSpValues(), [boundary, selectedOP, props.stressperiods]);

  const handleToggleUploadModal = () => setShowUploadModal(!showUploadModal);

  const handleChangePagination = (e: MouseEvent, { activePage }: PaginationProps) =>
    setPaginationPage(typeof activePage === 'number' ? activePage : 1);

  const handleBlurPercentage = (id: number) => () => {
    if (!activeInput) {
      return null;
    }

    const cSpValues = getSpValues()?.map((row) => {
      let value = row[id];
      if (typeof value === 'number') {
        value += (value * parseFloat(activeInput.value as string)) / 100;
      }

      if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
          for (let j = 0; j < value[i].length; j++) {
            value[i][j] += (value[i][j] * parseFloat(activeInput.value as string)) / 100;
          }
        }
      }

      row[id] = value;
      return row;
    });

    if (cSpValues) {
      boundary.setSpValues(cSpValues as ISpValues, selectedOP);
      setActiveInput(null);
      return props.onChange(boundary);
    }
  };

  const handleChangePercentage = (e: FormEvent<HTMLInputElement>, { name, value }: InputProps) =>
    setActiveInput({ col: -1, name, row: -1, value });

  const handleChangeInputValue = (row: number, col: number) => (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setActiveInput({ col, name, row, value });
  };

  const handleUploadRasterData = (row: number, col: number) => ({ data }: IData) => {
    setActiveInput(null);
    if (spValues) {
      const updatedSpValues = spValues.map((spv, spvIdx) => {
        const newRow = cloneDeep(spv);
        if (row === spvIdx) {
          newRow[col] = data.map((row) => row.map((value) => (value < 0 ? 0 : value)));
          return newRow;
        }
        return newRow;
      });
      boundary.setSpValues(updatedSpValues as ISpValues, selectedOP);
      return props.onChange(boundary);
    }
  };

  const handleSpValuesChange = () => {
    if (!activeInput) {
      return;
    }

    const { row, col } = activeInput;
    let { value } = activeInput;
    setActiveInput(null);

    if (typeof value === 'string') {
      value = parseFloat(value) || 0;
    }

    if (spValues) {
      const updatedSpValues = Boundary.mergeStressperiodsWithSpValues(props.stressperiods, spValues).map(
        (spv, spvIdx) => {
          const newRow = cloneDeep(spv);
          if (row === spvIdx) {
            newRow[col] = value as number | number[][];
            return newRow;
          }
          return newRow;
        },
      );
      boundary.setSpValues(updatedSpValues as ISpValues, selectedOP);
    }
    return props.onChange(boundary);
  };

  const handleImportCsv = (data: any[][]) => {
    if (spValues && data.length !== spValues.length) {
      setError(
        'Number of rows in file must be equal to number of stressperiods, when assigning by keys. ' +
        'Try to assign rows by datetime.',
      );
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
    if (numberOfCells === 1) {
      return {
        maxWidth: '150px',
        padding: 0,
        border: 0,
      };
    }

    return {
      maxWidth: '120px',
      padding: 0,
      border: 0,
    };
  };

  const body = () => {
    const { boundary, stressperiods } = props;
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

    return spValues.slice(startingIndex, endingIndex)
      .map((spValue, spIdx) => {
        const numberOfRows = Math.ceil(boundary.valueProperties.length / dataTableCellsPerRow);
        return new Array(numberOfRows).fill(0).map((r, rIdx) => (
          <Table.Row key={`${spIdx}_${rIdx}`}>
            <Table.Cell width={4}>
              {rIdx === 0 && (
                <Input
                  style={getCellStyle(1)}
                  disabled={true}
                  id={spIdx}
                  name={'dateTime'}
                  type={'date'}
                  value={moment(dateTimes[startingIndex + spIdx]).format('YYYY-MM-DD')}
                />)
              }
            </Table.Cell>
            {spValue.slice(rIdx * dataTableCellsPerRow, (rIdx + 1) * dataTableCellsPerRow)
              .map((v, vIdx) => {
                const value = activeInput && activeInput.col === vIdx && activeInput.row === startingIndex + spIdx ? activeInput.value : v;
                const isNumber = typeof value === 'number' || typeof value === 'string';

                return (
                  <Table.Cell key={`${vIdx}_${rIdx}`}>
                    <Input
                      style={getCellStyle(spValue.length)}
                      disabled={props.readOnly}
                      id={spIdx}
                      col={vIdx}
                      name={'dateTimeValue'}
                      onBlur={handleSpValuesChange}
                      onChange={handleChangeInputValue(startingIndex + spIdx, vIdx)}
                      type={isNumber ? 'number' : 'text'}
                      value={isNumber ? value : 'Raster'}
                      icon={
                        <Icon
                          name={!isNumber ? 'cancel' : 'map pin'}
                          link={!isNumber}
                          onClick={isNumber ? null : () => setActiveInput({
                            col: vIdx,
                            name: 'dateTimeValue',
                            row: startingIndex + spIdx,
                            value: '0',
                          })}
                        />
                      }
                    />
                    <Button.Group size='small' style={{ marginLeft: 5 }}>
                      <Button
                        icon={true}
                        primary={true}
                        onClick={() => {
                          setShowRasterFileUploadModal(true);
                          setActiveInput({
                            col: vIdx,
                            name: 'raster',
                            row: startingIndex + spIdx,
                            value: '0',
                          });
                        }}
                        disabled={props.readOnly}
                      >
                        <Popup
                          trigger={<Icon name='upload' />}
                          content='Upload Raster'
                          size='mini'
                        />
                      </Button>
                    </Button.Group>
                  </Table.Cell>
                );
              })}
          </Table.Row>
        ));
      });
  };

  return (
    <div>
      {showUploadModal && (
        <AdvancedCsvUpload
          columns={boundary.valueProperties.map((p, key) => {
            return {
              key: key + 1,
              value: p.name.toLowerCase(),
              text: p.name,
            };
          })}
          fixedDateTimes={props.stressperiods.dateTimes}
          onCancel={handleToggleUploadModal}
          onSave={handleImportCsv}
          useDateTimes={false}
        />
      )}
      {showRasterFileUploadModal && !props.readOnly && activeInput && activeInput.name === 'raster' &&
        <RasterfileUploadModal
          gridSize={props.model.gridSize}
          parameter={RasterParameter.fromObject({
            defaultValue: 0,
            isActive: true,
            id: 'rech',
            unit: 'm',
            title: 'Recharge',
          })}
          onCancel={() => {
            setShowRasterFileUploadModal(false);
            setActiveInput(null);
          }}
          onChange={handleUploadRasterData(activeInput.row, activeInput.col)}
        />
      }
      {!props.readOnly && (
        <div>
          <p style={{ marginTop: '10px', float: 'left' }}>
            <b>Time dependent boundary values{boundary instanceof LineBoundary ? ' observation point' : ''}</b>
          </p>
          <Button.Group floated='right' size='mini'>
            <Button
              icon={true}
              labelPosition='left'
              onClick={handleToggleUploadModal}
              primary={true}
              floated='right'
              size='mini'
            >
              <Icon name='upload' />
              Upload csv
            </Button>
            <BoundaryDateTimeImporter
              boundary={boundary}
              onChange={props.onChange}
              selectedOP={props.selectedOP}
              stressPeriods={props.stressperiods}
            />
          </Button.Group>
        </div>
      )}
      {error && <Message error>{error}</Message>}
      {spValues && spValues.length > 20 && (
        <Pagination
          activePage={paginationPage}
          onPageChange={handleChangePagination}
          size='mini'
          totalPages={Math.ceil(spValues.length / stressperiodsPerPage)}
        />
      )}
      <Table size={'small'} singleLine={true}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Start Date</Table.HeaderCell>
            {new Array(dataTableCellsPerRow).fill(0).map((p, idx) => (
              <Table.HeaderCell key={idx}>
                {(boundary.valueProperties.length > idx) &&
                  <div>{boundary.valueProperties[idx].name} [{boundary.valueProperties[idx].unit}]</div>}
                {(boundary.valueProperties.length > (idx + dataTableCellsPerRow)) &&
                  <div>{boundary.valueProperties[idx + dataTableCellsPerRow].name} [{boundary.valueProperties[idx + dataTableCellsPerRow].unit}]</div>}
              </Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {props.isScenario && !props.readOnly && (
            <Table.Row>
              <Table.Cell>
                <Label>Change by %</Label>
              </Table.Cell>
              {boundary.valueProperties.map((p, idx) => (
                <Table.Cell key={`percentage_chance_${idx}`} width={2}>
                  <Input
                    label={{ icon: 'percent' }}
                    labelPosition='left corner'
                    name={`percentage_${idx}`}
                    onBlur={handleBlurPercentage(idx)}
                    onChange={handleChangePercentage}
                    placeholder='% Change'
                    type='number'
                    style={getCellStyle(boundary.valueProperties.length)}
                    value={activeInput && activeInput.name === `percentage_${idx}` ? activeInput.value : 0}
                  />
                </Table.Cell>
              ))}
            </Table.Row>
          )}
          {spValues && body()}
        </Table.Body>
      </Table>
    </div>
  );
};

export default BoundaryRasterValuesDataTable;
