import { ChangeEvent, useEffect, useState } from 'react';
import { FileDataSource } from '../../../../core/model/rtm/monitoring';
import { IDateTimeValue, IFileDataSource } from '../../../../core/model/rtm/monitoring/Sensor.type';
import { cloneDeep } from 'lodash';
import Papa, { ParseResult } from 'papaparse';
import moment from 'moment';

export const useFileDatasource = (ds: FileDataSource | null) => {
  const [dataSource, setDataSource] = useState<IFileDataSource | null>(ds ? ds.toObject() : null);
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [metadata, setMetadata] = useState<ParseResult<any> | null>(null);

  useEffect(() => {
    if (ds) {
      const ld = async () => {
        ds.data = await ds.loadData();
        setDataSource(ds.toObject());
      };

      ld().then().catch();
    }
  }, [ds]);

  const updateData = async (
    firstRowIsHeader: boolean,
    dateTimeColumn: number,
    parameterColumn: number,
    dateTimeFormat: string
  ) => {
    if (!metadata) {
      return;
    }

    const fData = cloneDeep(metadata.data);
    if (firstRowIsHeader) {
      fData.shift();
    }
    const cData: IDateTimeValue[] = fData
      .map((r) => ({
        timeStamp: moment.utc(r[dateTimeColumn], dateTimeFormat).unix(),
        value: parseFloat(r[parameterColumn]),
      }))
      .filter((r) => !isNaN(r.value) && !isNaN(r.timeStamp));

    if (!dataSource) {
      const cDataSource = await FileDataSource.fromData(cData);
      console.log(cDataSource);
      return setDataSource(cDataSource.toObject());
    }

    const cDataSource = FileDataSource.fromObject(dataSource);
    cDataSource.data = cData;
    setDataSource(cDataSource.toObject());
  };

  const updateDataSource = async (ds: FileDataSource) => {
    ds.data = await ds.loadData();
    setDataSource(ds.toObject());
  };

  const uploadFile = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const file = files && files.length > 0 ? files[0] : null;
    if (file) {
      setIsParsing(true);
      Papa.parse(file, {
        complete: (results) => {
          setMetadata(results);
          setIsParsing(false);
        },
      });
    }
  };

  return {
    dataSource: dataSource ? FileDataSource.fromObject(dataSource) : null,
    isParsing,
    metadata,
    updateData,
    updateDataSource,
    uploadFile,
  };
};
