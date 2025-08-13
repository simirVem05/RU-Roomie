import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    matchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Match',
        required: true,
    },
    messageContent: {
        type: String,
        required: true,
        minLength: 1,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

export default Message;