import mongoose from 'mongoose';

const INTERESTS = ['Traveling', 'Working Out', 'Sports', 'Movies', 'Music', 'Nightlife', 'Outdoors Activities',
    'Shopping', 'Running', 'Yoga', 'Pilates', 'Meditation', 'Anime', 'Art', 'Dancing', 'Photography', 
    'Cooking', 'Baking', 'Politics', 'Theatre', 'Animals', 'Philosophy', 'Reading', 'Video Games', 
    'Cars', 'Gardening'
];

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
        unique: true,
    },
    age: {
        type: Number,
        required: true,
        min: 17,
    },
    year: {
        type: String,
        enum: ['Freshman', 'Sophomore', 'Junior', 'Senior'],
    },
    gender: {
        type: String,
        enum: ['Female', 'Male', 'Nonbinary', 'IDK'],
        required: [true, 'Gender is required']
    },
    bio: {
        type: String,
        required: [true, 'Bio is required'],
    },
    sleepSchedule: {
        type: String,
        enum: ['Early Bird', 'Night Owl', 'Flexible'],
    },
    cleanlinessType: {
        type: String,
        enum: ['Messy Slob', 'Disorganized', 'Organized', 'Neat Freak'],
    },
    noiseToleration: {
        type: String,
        enum: ['Very Little Noise', 'Moderate Noise', 'Heavy Noise', 'Any Noise'],
    },
    socialType: {
        type: String,
        enum: ['Introvert', 'Lean Introverted', 'Lean Extroverted', 'Extrovert'],
    },
    timeAtHome: {
        type: String,
        enum: ['Always Home', 'Usually Home', 'Mixed', 'Usually not at Home', 'Never Home'],
    },
    desiredCommunication: {
        type: String,
        enum: ['Only when necessary', 'We can be cool', 'Lets be friends', 'Lets be best friends'],
    },
    interests: {
        type: [{
            type: String,
            enum: INTERESTS,
        }],
        validate: {
            validator: (arr) => Array.isArray(arr) && arr.length > 0,
            message: 'At least one interest is required',
        },
    },
    desiredHousingType: {
        type: String,
        enum: ['Dorm', 'Apartment', 'House'],
        required: [true, 'Desired housing type is Required'],
    },
    roomType: {
        type: String,
        enum: ['Single', 'Double'],
        required: [true, 'Desired room type is required']
    },
    okWithPets: {
        type: Boolean,
        required: true,
    },
    smokes: {
        type: Boolean,
        default: false,
    },
    drinks: {
        type: Boolean,
        default: false,
    },
    guestFrequency: {
        type: String,
        enum: ['rarely', 'sometimes', 'often']
    },
    photos: [{
        type: String,
    }],
    isOnboarded: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;