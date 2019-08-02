import {
    FlopyModpathMp7,
    FlopyModpathMp7bas,
    FlopyModpathMp7particledata,
    FlopyModpathMp7particlegroup,
    FlopyModpathMp7sim
} from './index';

export type SimulationType = 'endpoint' | 'pathline' | 'timeseries' | 'combined';

export type TrackingDirectionType = 'forward' | 'backward';

export type WeakSinkSourceOptionType = 'pass_through' | 'stop_at';

export type BudgetOutOptionType = 'no' | 'summary' | 'record_summary';

export type StopTimeOptionType = 'total' | 'extend' | 'specified';

export type OnOffType = 'off' | 'on';

export type ModpathPackage =
    FlopyModpathMp7
    | FlopyModpathMp7bas
    | FlopyModpathMp7particledata
    | FlopyModpathMp7particlegroup
    | FlopyModpathMp7sim;

export enum ModPathPackageType {
    MP7= 'mp7',
    MP7BAS = 'mp7bas',
    MP7PARTICLEDATA = 'mp7particledata',
    MP7PARTICLEGROUP = 'mp7particlegroup',
    MP7SIM = 'mp7sim'
}
