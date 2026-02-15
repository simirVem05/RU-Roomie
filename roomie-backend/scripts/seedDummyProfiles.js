import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import { DB_URI } from "../config/env.js";

const INTERESTS = [
  "Traveling", "Working Out", "Sports", "Movies", "Music", "Nightlife", "Outdoors Activities",
  "Shopping", "Running", "Yoga", "Pilates", "Meditation", "Anime", "Art", "Dancing", "Photography",
  "Cooking", "Baking", "Politics", "Theatre", "Animals", "Philosophy", "Reading", "Video Games",
  "Cars", "Gardening",
];

const YEARS = ["Freshman", "Sophomore", "Junior", "Senior", "Grad"];
const GENDERS = ["Female", "Male", "Nonbinary", "Other"];
const SLEEP = ["Early Bird", "Night Owl", "Flexible"];
const CLEAN = ["Messy Slob", "Disorganized", "Organized", "Neat Freak"];
const NOISE = ["Very Little Noise", "Moderate Noise", "Heavy Noise", "Any Noise"];
const SOCIAL = ["Introvert", "Lean Introverted", "Lean Extroverted", "Extrovert"];
const HOME = ["Always Home", "Usually Home", "Mixed", "Usually Not At Home", "Never Home"];
const COMM = ["Only When Necessary", "We Can Be Cool", "Let's Be Friends", "Let's Be Best Friends"];
const HOUSING = ["Dorm", "Apartment", "House"];
const ROOM = ["Single", "Double"];
const GUEST = ["Never", "Rarely", "Sometimes", "Often"];

const FIRST_NAMES = [
  "Sam", "Ava", "Noah", "Maya", "Ethan", "Priya", "Liam", "Zoe", "Arjun", "Sofia",
  "Kai", "Nina", "Omar", "Leah", "Jay", "Isha", "Ryan", "Meera", "Ben", "Anya",
];
const LAST_NAMES = [
  "Patel", "Shah", "Singh", "Kim", "Nguyen", "Garcia", "Johnson", "Brown", "Miller", "Davis",
  "Martinez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Lee", "Clark", "Lewis",
];

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pickOne(arr) {
  return arr[randInt(0, arr.length - 1)];
}
function pickSomeUnique(arr, minCount, maxCount) {
  const n = randInt(minCount, maxCount);
  const copy = [...arr];
  const out = [];
  while (out.length < n && copy.length) {
    const idx = randInt(0, copy.length - 1);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}
function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/(^\.)|(\.$)/g, "");
}

/**
 * Generates stable "headshot" style photos from randomuser.me
 * - deterministic per profile (based on seed)
 * - roughly gender-matched (Male/Female); Nonbinary/Other uses mixed pool
 */
function makePeoplePhotos(seed, count, gender) {
  const urls = [];

  // RandomUser has portraits indexed 0-99
  // We'll pick deterministic indices so each seed gets consistent pics
  const baseIdx = seed % 100;

  // Map gender -> folder
  const folder =
    gender === "Male" ? "men" :
    gender === "Female" ? "women" :
    null; // Nonbinary/Other -> alternate men/women

  for (let i = 0; i < count; i++) {
    const idx = (baseIdx + i * 7) % 100; // step by 7 for variety but still deterministic

    if (folder) {
      urls.push(`https://randomuser.me/api/portraits/${folder}/${idx}.jpg`);
    } else {
      // alternate men/women for Nonbinary/Other so it still looks like people
      const altFolder = (i % 2 === 0) ? "men" : "women";
      urls.push(`https://randomuser.me/api/portraits/${altFolder}/${idx}.jpg`);
    }
  }

  return urls;
}

async function seed({ count = 30, wipeExisting = false } = {}) {
  const uri = DB_URI;
  if (!uri) {
    throw new Error("Missing DB_URI in your .env");
  }

  await mongoose.connect(uri);
  console.log("✅ Connected to MongoDB");

  if (wipeExisting) {
    console.log("⚠️ Wiping existing dummy data (Users/Profiles)...");
    await Profile.deleteMany({});
    await User.deleteMany({});
  }

  const created = [];

  for (let i = 0; i < count; i++) {
    const first = pickOne(FIRST_NAMES);
    const last = pickOne(LAST_NAMES);
    const fullName = `${first} ${last}`;
    const email = `${slugify(first)}.${slugify(last)}.${1000 + i}@ru-roomie.test`;

    const clerkUserId = `dummy_clerk_${Date.now()}_${i}`;
    const password = "dummyPassword123";

    const user = await User.create({
      name: fullName,
      email,
      password,
      clerkUserId,
    });

    const gender = pickOne(GENDERS);

    const profile = await Profile.create({
      user: user._id,

      displayName: first,
      age: randInt(17, 26),
      year: pickOne(YEARS),
      gender,

      bio: `Rutgers student looking for a solid roommate setup. I’m into ${pickOne(INTERESTS)} and ${pickOne(
        INTERESTS
      )}. Clean vibes, good communication.`,

      sleepSchedule: pickOne(SLEEP),
      cleanlinessType: pickOne(CLEAN),
      noiseToleration: pickOne(NOISE),
      socialType: pickOne(SOCIAL),
      timeAtHome: pickOne(HOME),
      desiredCommunication: pickOne(COMM),

      interests: pickSomeUnique(INTERESTS, 4, 9),

      desiredHousingType: pickOne(HOUSING),
      roomType: pickOne(ROOM),

      hasPet: Math.random() < 0.2,
      smokes: Math.random() < 0.15,
      drinks: Math.random() < 0.55,

      guestFrequency: pickOne(GUEST),

      // 👇 now real-looking headshots
      photos: makePeoplePhotos(i + 1, randInt(2, 6), gender),

      isOnboarded: true,
      onboardingStep: "complete",
    });

    created.push({
      userId: user._id.toString(),
      profileId: profile._id.toString(),
      email,
      clerkUserId,
      gender,
    });
  }

  console.log(`✅ Seeded ${created.length} users + profiles`);
  console.log(created.slice(0, 5));
  await mongoose.disconnect();
  console.log("✅ Done");
}

// Usage:
// node scripts/seedDummyProfiles.js
// node scripts/seedDummyProfiles.js --count 50
// node scripts/seedDummyProfiles.js --count 30 --wipe
const args = process.argv.slice(2);
const countArg = args.indexOf("--count");
const wipe = args.includes("--wipe");

const count = countArg !== -1 ? Number(args[countArg + 1]) : 30;

seed({ count, wipeExisting: wipe }).catch((e) => {
  console.error("❌ Seed failed:", e);
  process.exit(1);
});
