import React, {useEffect} from 'react';
import {IFlopyPackages} from '../../../core/model/flopy/packages/FlopyPackages.type';
import {ICells} from '../../../core/model/geometry/Cells.type';
import {IStatistics} from '../components/content/observation/statistics';
import {CALCULATE_CELLS_RESULT, CALCULATE_PACKAGES_RESULT, CALCULATE_STATISTICS_RESULT} from './t03.worker';

interface IProps {
    input: {
        type: string;
        data: any;
    };
    onProgressChanged?: (progress: number) => any;
    onProgressFinished: (data: any) => any;
}

let w: Worker | undefined;

const loadWorker = () => {
    let worker;
    try {
        // tslint:disable-next-line:no-var-requires
        worker = require('worker-loader!./t032.worker');
    } catch (e) {
        if (process.env.NODE_ENV !== 'test') {
            throw e;
        }
    }

    return new worker() as Worker;
};

const workerComponent = (props: IProps) => {
    useEffect(() => {
        w = loadWorker();
        w.addEventListener('message', handleMessage);

        return () => {
            if (w) {
                // @ts-ignore
                w.removeEventListener('message', handleMessage);
                w.terminate();
            }
        };
    }, []);

    useEffect(() => {
        if (w) {
            w.postMessage(props.input);
        }
    }, [props.input]);

    const handleMessage = (m: any) => {
        const messageType = m && m.data && m.data.type;
        let messageData;

        switch (messageType) {
            case CALCULATE_STATISTICS_RESULT:
                messageData = m.data.data as IStatistics;
                props.onProgressFinished(messageData);
                break;

            case CALCULATE_CELLS_RESULT:
                messageData = m.data.data as ICells;
                props.onProgressFinished(messageData);
                break;

            case CALCULATE_PACKAGES_RESULT:
                messageData = m.data.data as IFlopyPackages;
                props.onProgressFinished(messageData);
                break;
        }
    };

    return null;
};

export default workerComponent;
