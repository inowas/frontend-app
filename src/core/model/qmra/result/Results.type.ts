import { IEvent } from './Event.type';
import {IPropertyValueObject} from '../../types';
import IStatsLogRemoval from './StatsLogRemoval.type';
import IStatsTotal from './StatsTotal.type';
import ITotal from './Total.type';

export default interface IResults extends IPropertyValueObject {
  events: IEvent[];
  stats_logremoval: IStatsLogRemoval[];
  stats_total: IStatsTotal[];
  total: ITotal[];
}
