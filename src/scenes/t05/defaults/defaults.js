import uuidv4 from 'uuid';
import MCDA from "../components/MCDA";

export const defaults = () => {
    return {
        id: uuidv4(),
        name: 'New Multi-criteria decision analysis',
        description: 'Description of multi-criteria decision analysis.',
        permissions: 'rwx',
        public: false,
        type: 'T05',
        data: {
            mcda: (new MCDA()).toObject
        }
    };
};
