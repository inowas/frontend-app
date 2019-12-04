import AbstractCommand from '../../../core/model/command/AbstractCommand';
import {JSON_SCHEMA_URL} from '../../../services/api';

class UserCommand extends AbstractCommand {

    public static changeUserProfile(userId: string, profile: any) {
        const name = 'changeUserProfile';
        return new UserCommand(name, {
            user_id: userId,
            profile
        }, JSON_SCHEMA_URL + '/commands/' + name);
    }

    public static changeUserPassword(userId: string, password: string, newPassword: string) {
        const name = 'changeUserPassword';
        return new UserCommand(name, {
            user_id: userId,
            password,
            new_password: newPassword
        }, JSON_SCHEMA_URL + '/commands/' + name);
    }
}

export default UserCommand;
