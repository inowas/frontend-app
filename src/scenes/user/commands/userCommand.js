import AbstractCommand from '../../../core/model/command/AbstractCommand';
import {JSON_SCHEMA_URL} from '../../../services/api';

class UserCommand extends AbstractCommand {

    static changeUserProfile(userId, profile) {
        const name = 'changeUserProfile';
        return new UserCommand(name, {
            user_id: userId,
            profile
        }, JSON_SCHEMA_URL + '/commands/' + name);
    }

    static changeUserPassword(userId, password, newPassword) {
        const name = 'changeUserPassword';
        return new UserCommand(name, {
            user_id: userId,
            password,
            new_password: newPassword
        }, JSON_SCHEMA_URL + '/commands/' + name);
    }
}

export default UserCommand;
