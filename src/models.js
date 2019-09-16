import { Model } from 'radiks';

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
        }
    }
}

export class Post extends Model {
    static className = "Post";
    static schema = {
        title: {
            tpye: String,
            decrypted: true
        },
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
