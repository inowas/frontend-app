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
