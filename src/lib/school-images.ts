/** Encode uploaded filenames that may contain spaces */
function asset(filename: string) {
  return `/images/${encodeURI(filename)}`;
}

/** Canonical paths for Little Champs School media */
export const SCHOOL_IMAGES = {
  logo: "/images/logo.jpg",
  principal: "/images/principal.jpeg",
  redDayBoys: "/images/red-day-boys.jpeg",
  redDayGirls: "/images/red-day-girls.jpeg",
  studentsAchievement: "/images/students-achievement.jpeg",
  campus: asset("Little champs school.jpeg"),
  campusWide: asset("Little champs school image.jpeg"),
  classroom: "/images/classroom.jpeg",
  studentsClassroom: asset("students classroom.jpeg"),
  classPhoto: asset("class photo.jpeg"),
  classImage: asset("class image.jpeg"),
  celebration: "/images/celebration.jpeg",
  competition: "/images/competition.jpeg",
  fancyDress: asset("fancy dress.jpeg"),
  fathersDay: asset("fathers day.jpeg"),
  fathersDayCelebration: asset("fathers day celebration.jpeg"),
  festivalCelebration: asset("festival celebration.jpeg"),
  fruitDay: asset("fruit day activity.jpeg"),
  digitalClass: asset("Digital class.jpeg"),
  digitalClassroom: asset("Digital classroom.jpeg"),
} as const;

/** Lightweight blur placeholder for lazy-loaded images */
export const IMAGE_BLUR =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAB//2Q==";

export const GALLERY_CATEGORIES = [
  "All",
  "Celebrations",
  "Classroom",
  "Activities",
  "Achievements",
] as const;

export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

export const GALLERY_ITEMS = [
  {
    id: 1,
    title: "Red Day — Boys",
    category: "Celebrations" as const,
    image: SCHOOL_IMAGES.redDayBoys,
    alt: "Little Champs School students celebrating Red Day",
  },
  {
    id: 2,
    title: "Red Day — Girls",
    category: "Celebrations" as const,
    image: SCHOOL_IMAGES.redDayGirls,
    alt: "Girls participating in Red Day activities at Little Champs School",
  },
  {
    id: 3,
    title: "Student Achievements",
    category: "Achievements" as const,
    image: SCHOOL_IMAGES.studentsAchievement,
    alt: "Little Champs School students with achievement awards",
  },
  {
    id: 4,
    title: "Our Campus",
    category: "Classroom" as const,
    image: SCHOOL_IMAGES.campus,
    alt: "Little Champs School campus in Bhiwandi",
  },
  {
    id: 5,
    title: "School Building",
    category: "Classroom" as const,
    image: SCHOOL_IMAGES.campusWide,
    alt: "Little Champs School building and entrance",
  },
  {
    id: 6,
    title: "Classroom Learning",
    category: "Classroom" as const,
    image: SCHOOL_IMAGES.classroom,
    alt: "Students learning in a Little Champs School classroom",
  },
  {
    id: 7,
    title: "Students in Class",
    category: "Classroom" as const,
    image: SCHOOL_IMAGES.studentsClassroom,
    alt: "Students engaged in classroom activities",
  },
  {
    id: 8,
    title: "Class Group Photo",
    category: "Classroom" as const,
    image: SCHOOL_IMAGES.classPhoto,
    alt: "Class group photo at Little Champs School",
  },
  {
    id: 9,
    title: "Learning Together",
    category: "Classroom" as const,
    image: SCHOOL_IMAGES.classImage,
    alt: "Students learning together at Little Champs School",
  },
  {
    id: 10,
    title: "Festival Celebration",
    category: "Celebrations" as const,
    image: SCHOOL_IMAGES.festivalCelebration,
    alt: "Festival celebration at Little Champs School",
  },
  {
    id: 11,
    title: "School Celebration",
    category: "Celebrations" as const,
    image: SCHOOL_IMAGES.celebration,
    alt: "Special celebration event at Little Champs School",
  },
  {
    id: 12,
    title: "Fancy Dress Day",
    category: "Activities" as const,
    image: SCHOOL_IMAGES.fancyDress,
    alt: "Fancy dress competition at Little Champs School",
  },
  {
    id: 13,
    title: "Fruit Day Activity",
    category: "Activities" as const,
    image: SCHOOL_IMAGES.fruitDay,
    alt: "Fruit day learning activity for young students",
  },
  {
    id: 14,
    title: "Father's Day",
    category: "Celebrations" as const,
    image: SCHOOL_IMAGES.fathersDay,
    alt: "Father's Day celebration at Little Champs School",
  },
  {
    id: 15,
    title: "Father's Day Celebration",
    category: "Celebrations" as const,
    image: SCHOOL_IMAGES.fathersDayCelebration,
    alt: "Students celebrating Father's Day with activities",
  },
  {
    id: 16,
    title: "Competition Day",
    category: "Achievements" as const,
    image: SCHOOL_IMAGES.competition,
    alt: "Students participating in a school competition",
  },
  {
    id: 17,
    title: "Digital Class",
    category: "Classroom" as const,
    image: SCHOOL_IMAGES.digitalClass,
    alt: "Digital smart board classroom at Little Champs School",
  },
  {
    id: 18,
    title: "Digital Classroom",
    category: "Classroom" as const,
    image: SCHOOL_IMAGES.digitalClassroom,
    alt: "Modern digital classroom with interactive display at Little Champs School",
  },
] as const;

/** Featured items for home page bento gallery */
export const GALLERY_FEATURED = [
  GALLERY_ITEMS[3],
  GALLERY_ITEMS[17],
  GALLERY_ITEMS[2],
  GALLERY_ITEMS[16],
  GALLERY_ITEMS[11],
  GALLERY_ITEMS[12],
] as const;

export const ACHIEVEMENT_CARDS = [
  { title: "State Level Competition", icon: "trophy" as const },
  { title: "Karate Championship", icon: "medal" as const },
  { title: "Academic Excellence", icon: "graduation" as const },
  { title: "Co-curricular Activities", icon: "sparkles" as const },
] as const;

export const ACHIEVEMENT_COUNTERS = [
  { value: 50, suffix: "+", label: "Awards" },
  { value: 100, suffix: "+", label: "Certificates" },
  { value: 200, suffix: "+", label: "Competition Participants" },
] as const;
