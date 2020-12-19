import {
    EMethodType,
    ETimeResolution,
    IRTModellingHead,
    IRtModelling,
    IRtModellingData, IRtModellingResults,
    RTModellingObservationPoint
} from './RTModelling.type';
import {GenericObject} from '../../genericObject/GenericObject';
import {LineBoundary} from '../../modflow/boundaries';
import BoundaryCollection from '../../modflow/boundaries/BoundaryCollection';
import _, {cloneDeep} from 'lodash';
import uuid from 'uuid';

class RTModelling extends GenericObject<IRtModelling> {

    get id(): string {
        return this._props.id;
    }

    set id(value: string) {
        this._props.id = value;
    }

    get name(): string {
        return this._props.name;
    }

    set name(value: string) {
        this._props.name = value;
    }

    get data(): IRtModellingData {
        return this._props.data;
    }

    set data(value: IRtModellingData) {
        this._props.data = value;
    }

    get description(): string {
        return this._props.description;
    }

    set description(value: string) {
        this._props.description = value;
    }

    get heads(): IRTModellingHead[] | undefined {
        return this._props.data.head;
    }

    get permissions(): string {
        return this._props.permissions;
    }

    set permissions(value: string) {
        this._props.permissions = value;
    }

    get public(): boolean {
        return this._props.public;
    }

    set public(value: boolean) {
        this._props.public = value;
    }

    get results(): IRtModellingResults | null {
        if (!this._props.data.results) {
            return null;
        }
        return {
            boundaries: this._props.data.results.boundaries,
            model: this._props.data.results.model
        }
    }

    set results(value: IRtModellingResults | null) {
        this._props.data.results = value;
    }

    get startDate() {
        return new Date(this._props.data.start_date_time);
    }

    get timeResolution() {
        return this._props.data.time_resolution;
    }

    get tool(): string {
        return this._props.tool;
    }

    public static fromDefaults() {
        return new RTModelling({
            id: uuid.v4(),
            name: 'New Realtime Modelling',
            data: {
                model_id: null,
                automatic_calculation: false,
                start_date_time: '',
                time_resolution: ETimeResolution.DAILY,
                simulated_times: [],
            },
            description: '',
            permissions: 'rwx',
            public: true,
            tool: 'T20'
        });
    }

    public static fromObject(obj: IRtModelling) {
        return new RTModelling(obj);
    }

    public toObject(): IRtModelling {
        return cloneDeep(this._props);
    }

    public toQuery(): IRtModelling {
        const p = cloneDeep(this._props);

        return {
            ...p,
            data: {
                ...p.data,
                results: undefined,
                head: p.data.head ? p.data.head.map((h) => {
                    if (Array.isArray(h.data)) {
                        return {
                            ...h,
                            data: h.data.map((r) => {
                                return {
                                    ...r,
                                    values: null
                                };
                            })
                        };
                    }
                    const keys = Object.keys(h.data);
                    const data: { [k: string]: any } = {};
                    keys.forEach((key) => {
                        data[key] = (h.data as RTModellingObservationPoint)[key].map((m) => {
                            return {
                                ...m,
                                values: null
                            }
                        })
                    })
                    return {
                        ...h,
                        data
                    };
                }) : undefined
            }
        };
    }

    public updateHeadsFromBoundaries = (boundaries: BoundaryCollection) => {
        const heads: IRTModellingHead[] = this.heads ? _.cloneDeep(this.heads) : [];

        boundaries.all.forEach((b) => {
            const filtered = heads ? heads.filter((h) => h.boundary_id === b.id) : [];
            if (filtered.length === 0) {
                if (b instanceof LineBoundary) {
                    const data: RTModellingObservationPoint = {};
                    b.observationPoints.forEach((op) => {
                        data[op.id] = b.valueProperties.map(() => {
                            return {
                                method: EMethodType.CONSTANT,
                                values: null
                            };
                        });
                    });
                    heads.push({
                        boundary_id: b.id,
                        data
                    });
                } else {
                    heads.push({
                        boundary_id: b.id,
                        data: b.valueProperties.map(() => {
                            return {
                                method: EMethodType.CONSTANT,
                                values: null
                            };
                        })
                    });
                }
            }
        });

        this._props.data.head = heads;
        return this;
    }
}

export default RTModelling;
