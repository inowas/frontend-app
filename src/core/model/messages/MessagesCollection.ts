import {Collection} from '../collection/Collection';
import {IMessage} from './Message.type';

class MessagesCollection extends Collection<IMessage> {
    public static fromObject(obj: IMessage[]) {
        return new MessagesCollection(obj);
    }

    public toObject() {
        return this.all;
    }

    public filterByOrigin(origin: string) {
        return this.filterBy('origin', origin);
    }

    public getEditingState(origin: string): {
        dirty: IMessage | null,
        saving: IMessage | null
    } {
        const dirty = this.all.filter((m) => m.name === 'dirty' && m.origin === origin);
        const saving = this.all.filter((m) => m.name === 'saving' && m.origin === origin);
        return ({
            dirty: dirty.length > 0 ? dirty[0] : null,
            saving: saving.length > 0 ? saving[0] : null
        });
    }
}

export default MessagesCollection;
