import { Model, User } from 'radiks';

export class AnyListUser extends User {
    static className = 'AnyListUser';
    static schema = {
        ...User.schema,
        name: {
            type: String,
            decrypted: true
        },
        username: {
            type: String,
            decrypted: true
        },
        description: {
            type: String,
            decrypted: true
        },
        followedLists: Array,
    }

    static defaults = {
        followedLists: []
    }
}

export class List extends Model {
    static className = 'List';
    static schema = {
        title: {
            type: String,
            decrypted: true
        },
        description: {
            type: String,
            decrypted: true
        },
        listType: String,
        author: {
            type: String,
            decrypted: true
        }
    }
}

export class Post extends Model {
    static className = "Post";
    static schema = {
        listId: {
            type: String,
            decrypted: true
        },
        content: {
            type: String,
            decrypted: true
        }
    }
}
