import {JSON_SCHEMA_URL} from '../../../services/api';
import AbstractCommand from '../../../core/model/command/AbstractCommand';

class UserCommand extends AbstractCommand {

    public static archiveUser(userId: string) {
        const name = 'archiveUser';
        return new UserCommand(name, {
            user_id: userId
        }, JSON_SCHEMA_URL + '/commands/' + name);
    }

    public static changeUsername(userId: string, username: string) {
        const name = 'changeUsername';
        return new UserCommand(name, {
            user_id: userId,
            username
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

    public static changeUserProfile(userId: string, profile: { name: string, email: string }) {
        const name = 'changeUserProfile';
        return new UserCommand(name, {
            user_id: userId,
            profile
        }, JSON_SCHEMA_URL + '/commands/' + name);
    }

    public static createUser(username: string, password: string) {
        const name = 'createUser';
        return new UserCommand(name, {
            username,
            password
        }, JSON_SCHEMA_URL + '/commands/' + name);
    }

    public static deleteUser(userId: string) {
        const name = 'deleteUser';
        return new UserCommand(name, {
            user_id: userId
        }, JSON_SCHEMA_URL + '/commands/' + name);
    }

    public static demoteUser(userId: string, role: string) {
        const name = 'demoteUser';
        return new UserCommand(name, {
            user_id: userId,
            role
        }, JSON_SCHEMA_URL + '/commands/' + name);
    }

    public static disableUser(userId: string) {
        const name = 'disableUser';
        return new UserCommand(name, {
            user_id: userId
        }, JSON_SCHEMA_URL + '/commands/' + name);
    }

    public static enableUser(userId: string) {
        const name = 'enableUser';
        return new UserCommand(name, {
            user_id: userId
        }, JSON_SCHEMA_URL + '/commands/' + name);
    }

    public static promoteUser(userId: string, role: string) {
        const name = 'promoteUser';
        return new UserCommand(name, {
            user_id: userId,
            role
        }, JSON_SCHEMA_URL + '/commands/' + name);
    }

    public static reactivateUser(userId: string) {
        const name = 'reactivateUser';
        return new UserCommand(name, {
            user_id: userId,
        }, JSON_SCHEMA_URL + '/commands/' + name);
    }

    public static revokeLoginToken(userId: string) {
        const name = 'revokeLoginToken';
        return new UserCommand(name, {
            user_id: userId,
        }, JSON_SCHEMA_URL + '/commands/' + name);
    }

    public static signupUser(username: string, email: string, password: string) {
        const name = 'signupUser';
        return new UserCommand(name, {
            name: username,
            email,
            password
        }, JSON_SCHEMA_URL + '/commands/' + name);
    }
}

export default UserCommand;
