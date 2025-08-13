import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    age: {
        type: int,
        required: true,
    },
    year: {
        type: String,
        enum: ['Freshman', 'Sophomore', 'Junior', 'Senior'],
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Nonbinary'],
    },
    bio: {
        type: String,
        required: [true, 'Bio is required'],
    },
    sleepSchedule: {
        type: String,
        enum: ['Early Bird', 'Night Owl', 'Flexible'],
    },
    sleeperType: {
        type: String,
        enum: ['Light sleeper', 'Moderate sleeper', 'Heavy sleeper'],
    },
    cleanlinessType: {
        type: String,
        enum: ['Messy Slob', 'Disorganized', 'Organized', 'Neat Freak'],
        required: [true, 'Cleanliness type is required']
    },
    noiseToleration: {
        type: String,
        enum: ['Very Little Noise', 'Moderate Noise', 'Heavy Noise', 'Any noise'],
        required: [true, 'Noise toleration is required'],
    },
    socialType: {
        type: String,
        enum: ['Introvert', 'Lean Introverted', 'Ambivert', 'Lean Extroverted', 'Extrovert'],
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
        type: [String],
        enum: ['Traveling', 'Gym', 'Sports', 'Movies', 'Music', 'Going Out', 'Outdoors Activities',
            'Shopping', 'Yoga', 'Pilates', 'Meditation', 'Anime', 'Art', 'Dancing', 'Photography', 
            'Cooking', 'Baking', 'Politics', 'Theatre', 'Animals', 'Finance', 'Chess',
            'Philosophy'
        ],
        required: [true, 'At least one interest is required'],
    },
    housingType: {
        type: String,
        enum: ['Dorm', 'Apartment', 'House'],
        required: [true, 'Housing type is Required'],
    },
    roomType: {
        type: String,
        enum: ['Single', 'Double'],
        required: [true, 'Room type is required']
    },
    needHousing: {
        type: String,
        enum: ['Yes', 'No'],
        required: [true, 'Must specify housing needs'],
    },
    okWithPets: {
        type: String,
        enum: ['Yes', 'No'],
        required: [true, 'Must specify if you are ok with pet'],
    },
}, { timestamps: true });

const Profile = new mongoose.model('Profile', profileSchema);

export default Profile;