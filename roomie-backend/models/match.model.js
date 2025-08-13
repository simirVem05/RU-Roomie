import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
    users: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    matchStatus: {
        type: String,
        enum: ['Matched', 'Unmatched'],
        default: 'Matched',
    },
}, { timestamps: true });

const Match = mongoose.model('Match', matchSchema);

export default Match;