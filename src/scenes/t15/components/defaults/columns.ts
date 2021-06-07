import { ECsvColumnType } from '../../../shared/simpleTools/upload/types';
import { TColumns } from '../../../shared/simpleTools/upload/AdvancedCsvUpload';

export const exposureColumns: TColumns = [
  { key: 1, value: 'name', text: 'Name' },
  { key: 2, value: 'description', text: 'Description' },
  { key: 3, value: 'eventsPerYear', text: 'Events per year', type: ECsvColumnType.NUMBER },
  { key: 4, value: 'litresPerEvent', text: 'Litres per event', type: ECsvColumnType.NUMBER },
  { key: 5, value: 'link', text: 'Link'},
  { key: 6, value: 'reference', text: 'Reference'}
];

export const pathogenColumns: TColumns = [
  { key: 1, value: 'PathogenID', text: 'Pathogen ID', type: ECsvColumnType.NUMBER },
  { key: 2, value: 'PathogenName', text: 'Pathogen Name' },
  { key: 3, value: 'PathogenGroup', text: 'Pathogen Group' },
  { key: 4, value: 'simulate', text: 'Simulate', type: ECsvColumnType.NUMBER },
  { key: 5, value: 'type', text: 'Type' },
  { key: 6, value: 'min', text: 'Min', type: ECsvColumnType.NUMBER },
  { key: 7, value: 'max', text: 'Max', type: ECsvColumnType.NUMBER },
];

export const doseresponseColumns: TColumns = [
  { key: 1, value: 'PathogenID', text: 'Pathogen ID', type: ECsvColumnType.NUMBER },
  { key: 2, value: 'PathogenName', text: 'Pathogen Name' },
  { key: 3, value: 'PathogenGroup', text: 'Pathogen Group' },
  { key: 4, value: 'Best fit model*', text: 'Best fit model*' },
  { key: 5, value: 'alpha', text: 'alpha', type: ECsvColumnType.NUMBER },
  { key: 6, value: 'k', text: 'k', type: ECsvColumnType.NUMBER },
  { key: 7, value: 'N50', text: 'N50', type: ECsvColumnType.NUMBER },
  { key: 8, value: 'Host type', text: 'Host type' },
  { key: 9, value: 'Dose units', text: 'Dose units' },
  { key: 10, value: 'Route', text: 'Route' },
  { key: 11, value: 'Response', text: 'Response' },
  { key: 12, value: 'Reference', text: 'Reference' },
  { key: 13, value: 'Link', text: 'Link' },
];

export const healthColumns: TColumns = [
  { key: 1, value: 'PathogenID', text: 'Pathogen ID', type: ECsvColumnType.NUMBER },
  { key: 2, value: 'PathogenName', text: 'Pathogen Name' },
  { key: 3, value: 'infection_to_illness', text: 'Infection to illness', type: ECsvColumnType.NUMBER },
  { key: 4, value: 'dalys_per_case', text: 'Dalys per case', type: ECsvColumnType.NUMBER },
];

export const processColumns: TColumns = [
  { key: 1, value: 'TreatmentID', text: 'Treatment ID', type: ECsvColumnType.NUMBER },
  { key: 2, value: 'TreatmentName', text: 'Treatment Name' },
  { key: 3, value: 'TreatmentGroup', text: 'Treatment Group' },
  { key: 4, value: 'PathogenGroup', text: 'Pathogen Group' },
  { key: 5, value: 'type', text: 'Type' },
  { key: 6, value: 'min', text: 'Min', type: ECsvColumnType.NUMBER },
  { key: 7, value: 'max', text: 'Max', type: ECsvColumnType.NUMBER },
];

export const schemeColumns: TColumns = [
  { key: 1, value: 'TreatmentSchemeID', text: 'Treatment Scheme ID', type: ECsvColumnType.NUMBER },
  { key: 2, value: 'TreatmentSchemeName', text: 'Treatment Scheme Name' },
  { key: 3, value: 'TreatmentID', text: 'Treatment ID', type: ECsvColumnType.NUMBER },
  { key: 4, value: 'TreatmentName', text: 'Treatment Name' },
];
