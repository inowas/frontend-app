import uuidv4 from 'uuid';
import {MCDA} from '../../../core/model/mcda';
import {IToolMetaData} from '../../shared/simpleTools/ToolMetaData/ToolMetaData.type';

export const defaults = (): IToolMetaData => {
    return {
        id: uuidv4(),
        name: 'New Multi-criteria decision analysis',
        description: 'Description of multi-criteria decision analysis.',
        permissions: 'rwx',
        public: false,
        tool: 'T05',
        type: 'T05',
        data: (MCDA.fromDefaults()).toObject()
    };
};
