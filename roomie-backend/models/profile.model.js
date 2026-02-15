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
    displayName: {
        type: String,
        required: [true, 'Display name is required'],
        trim: true,
        minlength: 2,
        maxlength: 30,
    },
    age: {
        type: Number,
        required: [true, 'Age is required'],
        min: 17,
    },
    year: {
        type: String,
        enum: ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Grad'],
        required: [true, 'Year is required']
    },
    gender: {
        type: String,
        enum: ['Female', 'Male', 'Nonbinary', 'Other'],
        required: [true, 'Gender is required']
    },
    bio: {
        type: String,
        required: [true, 'Bio is required'],
        trim: true,
        maxlength: 500,
    },
    sleepSchedule: {
        type: String,
        enum: ['Early Bird', 'Night Owl', 'Flexible'],
        required: [true, 'Sleep Schedule is required'],
    },
    cleanlinessType: {
        type: String,
        enum: ['Messy Slob', 'Disorganized', 'Organized', 'Neat Freak'],
        required: [true, ['Cleanliness is required']],
    },
    noiseToleration: {
        type: String,
        enum: ['Very Little Noise', 'Moderate Noise', 'Heavy Noise', 'Any Noise'],
        required: [true, 'Noise toleration is required'],
    },
    socialType: {
        type: String,
        enum: ['Introvert', 'Lean Introverted', 'Lean Extroverted', 'Extrovert'],
        required: [true, 'Social type is required'],
    },
    timeAtHome: {
        type: String,
        enum: ['Always Home', 'Usually Home', 'Mixed', 'Usually Not At Home', 'Never Home'],
        required: [true, 'Time at home is required'],
    },
    desiredCommunication: {
        type: String,
        enum: ['Only When Necessary', 'We Can Be Cool', "Let's Be Friends", "Let's Be Best Friends"],
        required: [true, 'Desired communication is required']
    },
    interests: {
        type: [{
            type: String,
            enum: INTERESTS,
        }],
        default: [],
    },
    desiredHousingType: {
        type: String,
        enum: ['Dorm', 'Apartment', 'House'],
        required: [true, 'Desired housing type is required'],
    },
    roomType: {
        type: String,
        enum: ['Single', 'Double'],
        required: [true, 'Desired room type is required']
    },
    hasPet: {
        type: Boolean,
        default: false,
        required: [true, 'Answer required']
    },
    smokes: {
        type: Boolean,
        default: false,
        required: [true, 'Answer required']
    },
    drinks: {
        type: Boolean,
        default: false,
        required: [true, 'Answer required']
    },
    guestFrequency: {
        type: String,
        enum: ['Never', 'Rarely', 'Sometimes', 'Often'],
        required: [true, 'Guest frequency is required'],
    },
    photos: {
        type: [String],
        default: [],
        validate: {
            validator: (arr) => !arr || arr.length <= 6,
            message: "You can upload up to 6 photos",
        },
    },
    isOnboarded: {
        type: Boolean,
        default: false,
    },
    onboardingStep: {
        type: String,
        enum: ["basic-info", "preferences", "interests", "photos", "bio", "complete"],
        default: "basic-info",
    },
    feedSessionIndex: {
        type: Number, 
        default: 0,
    },
}, { timestamps: true });

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;