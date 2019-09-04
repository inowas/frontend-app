import {
    FlopyModpathMp,
    FlopyModpathMpbas,
    FlopyModpathMpsim
} from './index';

export type SimulationType = 'endpoint' | 'pathline' | 'timeseries' | 'combined';

export type TrackingDirectionType = 'forward' | 'backward';

export type WeakSinkSourceOptionType = 'pass_through' | 'stop_at';

export type BudgetOutputOptionType = 'no' | 'summary' | 'record_summary';

export type StopTimeOptionType = 'total' | 'extend' | 'specified';

export type OnOffType = 'off' | 'on';

export type ModpathPackage =
    FlopyModpathMp
    | FlopyModpathMpbas
    | FlopyModpathMpsim;

export enum ModPathPackageType {
    MP7= 'mp7',
    MP7BAS = 'mp7bas',
    MP7PARTICLEDATA = 'mp7particledata',
    MP7PARTICLEGROUP = 'mp7particlegroup',
    MP7SIM = 'mp7sim'
}
