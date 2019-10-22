import { Model } from 'radiks';

export class AnyListUser extends Model {
    static className = 'AnyListUser';
    static schema = {
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
        subbed_models: Array,
        other: {
            type: Object,
            decrypted: true
        }
    }

    static defaults = {
        followedLists: [],
        other: {}
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
        },
        other: {
            type: Object,
            decrypted: true
        }
    }

    static defaults = {
        other: {}
    }
}

export class Post extends Model {
    static className = "Post";
    static schema = {
        listId: {
            type: String,
            decrypted: true
        },
        metadata: {
            type: Object,
            decrypted: true
        },
        content: {
            type: Object,
            decrypted: true
        },
        other: {
            type: Object,
            decrypted: true
        }
    }

    static defaults = {
        other: {}
    }
}

export class Comment extends Model {
    static className = "Comment";
    static schema = {
        postId: {
            type: String,
            decrypted: true
        },
        metadata: {
            type: Object,
            decrypted: true
        },
        content: {
            type: Object,
            decrypted: true
        },
        other: {
            type: Object,
            decrypted: true
        }
    }
}

export class Notification extends Model {
    static className = "Notification";
    static schema = {
        notif_for: {
            type: String,
            decrypted: true
        },
        type: {
            type: String,
            decrypted: true
        },
        content: {
            type: Object,
            decrypted: true
        }
    }
}