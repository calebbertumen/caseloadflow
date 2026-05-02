import { CURRENT_SCHEMA_VERSION, DEFAULT_SETTINGS } from "./constants";
import type { AppState, AvailabilityBlock, Session, Student } from "./types";

const students: Student[] = [
  {
    id: "stu-1",
    name: "Alex Rivera",
    grade: "2nd",
    teacher: "Ms. Patel",
    requiredMinutesPerWeek: 120,
    preferredSessionLength: 30,
    sessionType: "group",
    unavailableBlockIds: ["blk-stu-art"],
    notes: "Prefers morning groups.",
    color: "sky",
  },
  {
    id: "stu-2",
    name: "Jordan Lee",
    grade: "3rd",
    teacher: "Mr. Kim",
    requiredMinutesPerWeek: 60,
    preferredSessionLength: 30,
    sessionType: "individual",
    unavailableBlockIds: [],
    notes: "",
    color: "amber",
  },
  {
    id: "stu-3",
    name: "Sam Nguyen",
    grade: "1st",
    teacher: "Ms. Ortiz",
    requiredMinutesPerWeek: 90,
    preferredSessionLength: 20,
    sessionType: "flexible",
    unavailableBlockIds: [],
    notes: "Short bursts work best.",
    color: "emerald",
  },
];

const availabilityBlocks: AvailabilityBlock[] = [
  {
    id: "blk-lunch",
    label: "Lunch",
    type: "lunch",
    dayOfWeek: 2,
    startTime: "11:30",
    endTime: "12:15",
    appliesTo: "global",
    notes: "Whole school",
  },
  {
    id: "blk-recess",
    label: "Recess",
    type: "recess",
    dayOfWeek: 1,
    startTime: "10:00",
    endTime: "10:30",
    appliesTo: "global",
  },
  {
    id: "blk-iep",
    label: "IEP meetings (Wed AM)",
    type: "slp_unavailable",
    dayOfWeek: 2,
    startTime: "08:00",
    endTime: "09:30",
    appliesTo: "slp",
  },
  {
    id: "blk-stu-art",
    label: "Art pull-out",
    type: "specials",
    dayOfWeek: 0,
    startTime: "13:00",
    endTime: "13:45",
    appliesTo: "student",
    studentIds: ["stu-1"],
  },
];

const sessions: Session[] = [
  {
    id: "ses-1",
    dayOfWeek: 0,
    startTime: "09:00",
    endTime: "09:30",
    studentIds: ["stu-1", "stu-3"],
    sessionType: "group",
    location: "Speech room",
    notes: "Artic carryover",
    countsTowardMinutes: true,
  },
  {
    id: "ses-2",
    dayOfWeek: 0,
    startTime: "10:00",
    endTime: "10:30",
    studentIds: ["stu-2"],
    sessionType: "individual",
    location: "Speech room",
    countsTowardMinutes: true,
  },
  {
    id: "ses-3",
    dayOfWeek: 1,
    startTime: "08:30",
    endTime: "09:00",
    studentIds: ["stu-1"],
    sessionType: "group",
    countsTowardMinutes: true,
  },
];

/** Sample caseload for the “View demo” experience — realistic but small. */
export const demoAppState: AppState = {
  schemaVersion: CURRENT_SCHEMA_VERSION,
  onboardingCompleted: true,
  students,
  availabilityBlocks,
  sessions,
  settings: { ...DEFAULT_SETTINGS, slpDisplayName: "Demo SLP" },
};

export const emptyAppState: AppState = {
  schemaVersion: CURRENT_SCHEMA_VERSION,
  onboardingCompleted: false,
  students: [],
  availabilityBlocks: [],
  sessions: [],
  settings: { ...DEFAULT_SETTINGS },
};
