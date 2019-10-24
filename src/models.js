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
        followedPosts: Array,
        other: {
            type: Object,
            decrypted: true
        }
    }

    static defaults = {
        followedLists: [],
        followedPosts: [],
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

/**
 * notif_for: id of a list or post
 * notif_with: id of the post or comment thats created with the notification
 * 
 * notif_with will is used when deleting a comment or post.
 *  the notification should be deleted with it
 */

export class Notification extends Model {
    static className = "Notification";
    static schema = {
        notif_for: {
            type: String,
            decrypted: true
        },
        notif_with: {
            tpye: String,
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