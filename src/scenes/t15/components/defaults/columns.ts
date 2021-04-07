import { ECsvColumnType } from '../../../shared/simpleTools/upload/types';
import { TColumns } from '../../../shared/simpleTools/upload/AdvancedCsvUpload';

export const exposureColumns: TColumns = [
    {key: 1, value: 'name', text: 'Name'},
    {key: 2, value: 'type', text: 'Type'},
    {key: 3, value: 'min', text: 'Min', type: ECsvColumnType.NUMBER},
    {key: 4, value: 'max', text: 'Max', type: ECsvColumnType.NUMBER},
    {key: 5, value: 'mode', text: 'Mode', type: ECsvColumnType.NUMBER},
    {key: 6, value: 'mean', text: 'Mean', type: ECsvColumnType.NUMBER}
  ];