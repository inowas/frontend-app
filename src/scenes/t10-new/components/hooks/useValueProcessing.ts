import { DataSourceCollection } from '../../../../core/model/rtm/monitoring';
import { IValueProcessing } from '../../../../core/model/rtm/processing/Processing.type';
import { ValueProcessing } from '../../../../core/model/rtm/processing';
import { useCallback, useEffect, useState } from 'react';
import moment from 'moment';
import uuid from 'uuid';

export const useValueProcessing = (vp: ValueProcessing | null, dsc: DataSourceCollection) => {
  const [processing, setProcessing] = useState<IValueProcessing | null>(vp ? vp.toObject() : null);

  const mergeData = useCallback(async () => {
    const rawData = await dsc.mergedData();
    const begin = rawData ? rawData[0].timeStamp : moment().subtract(1, 'week').unix();
    const end = rawData ? rawData[rawData.length - 1].timeStamp : moment().unix();

    const cProcessing = ValueProcessing.fromObject({
      id: uuid.v4(),
      type: 'value',
      begin,
      end,
      operator: '*',
      value: 1,
    });
    setProcessing(cProcessing.toObject());
  }, [dsc]);

  useEffect(() => {
    if (!vp) {
      mergeData();
    } else {
      setProcessing(vp.toObject());
    }
  }, [mergeData, vp]);

  const updateProcessing = (v: ValueProcessing) => setProcessing(v.toObject());

  return {
    processing: processing ? ValueProcessing.fromObject(processing) : null,
    updateProcessing,
  };
};
