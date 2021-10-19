import { DataSourceCollection } from '../../../../core/model/rtm/monitoring';
import { ECutRule, ITimeProcessing } from '../../../../core/model/rtm/processing/Processing.type';
import { IDateTimeValue } from '../../../../core/model/rtm/monitoring/Sensor.type';
import { TimeProcessing } from '../../../../core/model/rtm/processing';
import { cloneDeep } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import moment from 'moment';
import uuid from 'uuid';

export const useTimeProcessing = (tp: TimeProcessing | null, dsc: DataSourceCollection) => {
  const [processing, setProcessing] = useState<ITimeProcessing | null>(tp ? tp.toObject() : null);
  const [processedData, setProcessedData] = useState<IDateTimeValue[] | null>(null);

  const process = useCallback(
    async (p: TimeProcessing) => {
      setProcessing(p.toObject());
      const mData = await dsc.mergedData();
      try {
        const pData = await p.apply(cloneDeep(mData));
        setProcessedData(pData);
      } catch {
        console.log('ERROR');
      }
    },
    [dsc]
  );

  const mergeData = useCallback(async () => {
    const rawData = await dsc.mergedData();
    const begin = rawData ? rawData[0].timeStamp : moment().subtract(1, 'week').unix();
    const end = rawData ? rawData[rawData.length - 1].timeStamp : moment().unix();

    const cProcessing = TimeProcessing.fromObject({
      id: uuid.v4(),
      type: 'time',
      begin,
      end,
      rule: '1d',
      method: 'time',
      cut: ECutRule.NONE,
    });
    process(cProcessing);
  }, [dsc, process]);

  useEffect(() => {
    if (!tp) {
      mergeData();
    } else {
      process(tp);
    }
  }, [mergeData, process, tp]);

  const updateProcessing = (t: TimeProcessing) => process(t);

  return {
    processedData,
    processing: processing ? TimeProcessing.fromObject(processing) : null,
    updateProcessing,
  };
};
