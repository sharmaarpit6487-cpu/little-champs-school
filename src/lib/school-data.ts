import { SCHOOL_IMAGES } from "./school-images";

export const SCHOOL_INFO = {
  name: "Little Champs School",
  tagline: "Where Young Minds Grow and Dreams Begin",
  motto: "Born To Win",
  established: "2017–2018",
  email: "littlechamps289@gmail.com",
  phone: "+91 79724 11485",
  alternatePhone: "+91 73873 26222",
  address: "Little Champs School, Sai Nagar, Kamatghar, Bhiwandi",
  city: "Bhiwandi",
  state: "Maharashtra",
  pincode: "421305",
  mapsLink: "https://maps.app.goo.gl/77RV5psNm45QGjGs5",
  mapsLat: 19.2719462,
  mapsLng: 73.0521086,
  mapsEmbedUrl:
    "https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1sLittle+Champs+School,Sai+Nagar,Kamatghar,Bhiwandi,421305!6i17",
  website: "www.littlechampsschool.com",
  classes: "Nursery to 8th Standard",
  type: "Preschool + Primary + Middle School",
  principal: {
    name: "Mrs. Khilna Shah",
    qualification: "B.Sc B.ed, M.ed",
    message:
      "At Little Champs School, we believe every child is unique and possesses unlimited potential. Our mission is to create a nurturing environment where students develop academically, socially, and emotionally through activity-based learning, caring teachers, and a safe campus.",
    image: SCHOOL_IMAGES.principal,
  },
  timings: {
    weekdays: "7:30 AM to 5:30 PM",
    saturday: "8:00 AM to 2:00 PM",
    office: "11:00 AM - 5:00 PM",
  },
  social: {
    facebook: "https://facebook.com/littlechamps",
    instagram: "https://www.instagram.com/little_champs_school?igsh=ODRidHZ0YWVza21o",
    twitter: "https://twitter.com/littlechamps",
    youtube: "https://youtube.com/@littlechampsbhiwandi?si=0REvqQh30wadL4_g",
  },
  stats: {
    students: 500,
    teachers: 20,
    years: 10,
    passRate: 98,
    alumni: 400,
    care: 100,
  },
};

export const ABOUT_FEATURES = [
  {
    title: "Safe Environment",
    description: "CCTV-monitored campus with trained staff ensuring every child feels secure and cared for.",
    icon: "shield",
    color: "bg-green-100 text-brand-green",
  },
  {
    title: "Experienced Teachers",
    description: "Dedicated educators with years of experience in early childhood and primary education.",
    icon: "users",
    color: "bg-blue-100 text-brand-blue",
  },
  {
    title: "Activity-Based Learning",
    description: "Hands-on projects, play-based methods, and creative activities that make learning fun.",
    icon: "sparkles",
    color: "bg-amber-100 text-amber-600",
  },
  {
    title: "Holistic Development",
    description: "Academics, sports, arts, and values education for well-rounded child growth.",
    icon: "heart",
    color: "bg-orange-100 text-brand-orange",
  },
];

export const PROGRAMS = [
  {
    title: "Nursery",
    age: "2.5 - 3.5 years",
    description: "Play-based introduction to learning with sensory activities, rhymes, and social skills.",
    icon: "baby",
    color: "from-pink-400 to-rose-400",
    bg: "bg-pink-50",
  },
  {
    title: "Junior KG",
    age: "3.5 - 4.5 years",
    description: "Building language, motor skills, and curiosity through structured play and stories.",
    icon: "blocks",
    color: "from-purple-400 to-violet-400",
    bg: "bg-purple-50",
  },
  {
    title: "Senior KG",
    age: "4.5 - 5.5 years",
    description: "School readiness with phonics, numbers, art, and confidence-building activities.",
    icon: "palette",
    color: "from-indigo-400 to-blue-400",
    bg: "bg-indigo-50",
  },
  {
    title: "Class 1-5",
    age: "Primary",
    description: "Strong foundation in core subjects with smart classrooms and creative learning.",
    icon: "book",
    color: "from-brand-blue to-brand-sky",
    bg: "bg-blue-50",
  },
  {
    title: "Class 6-8",
    age: "Middle School",
    description: "Advanced curriculum with science labs, computer education, and life skills.",
    icon: "graduation",
    color: "from-brand-orange to-brand-yellow",
    bg: "bg-orange-50",
  },
];

export const WHY_CHOOSE_US = [
  { title: "Smart Classrooms", description: "Interactive digital boards and modern teaching aids.", icon: "monitor", color: "bg-blue-500" },
  { title: "Computer Lab", description: "Latest computers with coding and digital literacy programs.", icon: "laptop", color: "bg-indigo-500" },
  { title: "Library", description: "Rich collection of books fostering a love for reading.", icon: "bookOpen", color: "bg-purple-500" },
  { title: "Sports Activities", description: "Outdoor games, yoga, and physical fitness programs.", icon: "trophy", color: "bg-brand-green" },
  { title: "Art & Music", description: "Creative expression through drawing, crafts, dance, and music.", icon: "music", color: "bg-pink-500" },
  { title: "Science Lab", description: "Hands-on experiments sparking scientific curiosity.", icon: "flask", color: "bg-cyan-500" },
  { title: "Transport Facility", description: "Safe, GPS-enabled buses covering major routes.", icon: "bus", color: "bg-brand-orange" },
  { title: "Safe Campus", description: "CCTV surveillance, secure entry, and trained security staff.", icon: "shield", color: "bg-red-500" },
];

export const FACILITIES = [
  { title: "Our Campus", description: "A safe, welcoming campus in Bhiwandi", image: SCHOOL_IMAGES.campus },
  { title: "Smart Classrooms", description: "Digital boards and interactive learning technology", image: SCHOOL_IMAGES.digitalClassroom },
  { title: "Digital Learning", description: "Modern classrooms equipped for 21st-century education", image: SCHOOL_IMAGES.digitalClass },
  { title: "Activity Learning", description: "Hands-on sessions every day", image: SCHOOL_IMAGES.studentsClassroom },
  { title: "Festivals & Events", description: "Cultural celebrations year-round", image: SCHOOL_IMAGES.festivalCelebration },
  { title: "Competitions", description: "Students shine on every stage", image: SCHOOL_IMAGES.competition },
  { title: "Creative Activities", description: "Fancy dress, fruit day & more", image: SCHOOL_IMAGES.fancyDress },
];

export const TESTIMONIALS = [
  {
    name: "Vishal Lokhande",
    role: "Parent of Samiksha Lokhande",
    quote: "A Wonderful Place to Learn and Grow! We are extremely happy with the progress our child has made at Little Champs School. The loving teachers, engaging activities, and positive atmosphere make learning enjoyable. Thank you to the entire team for nurturing our child with care, patience, and dedication.",
    rating: 5,
  },
  {
    name: "Pranjali Patil",
    role: "Parent of Shlok Patil (1st standard Student)",
    quote: "Little Champs School has been a wonderful learning environment for my child. The teachers are caring, supportive, and dedicated towards every child’s overall development. We truly appreciate the school’s focus on academics, creativity, discipline, and good values. Our child has become more confident, independent, and enthusiastic about learning. We are very happy to be a part of the Little Champs family.",
    rating: 5,
  },
  {
    name: "Shabina Ansari",
    role: "Parent of a Student",
    quote: "Little Champs School provides a warm and joyful learning environment. We are extremely happy with our child’s growth and progress.",
    rating: 5,
  },
  {
    name: "Vinod Sankpal",
    role: "Parent of 7th standard Student",
    quote: "A beautiful journey of learning, friendship, and growth.",
    rating: 5,
  },
];

export { GALLERY_ITEMS as GALLERY_PREVIEW } from "./school-images";

export const ACHIEVEMENTS = [
  { title: "State Level Competition", description: "Our students excel at district and state-level events", year: 2025, icon: "trophy" },
  { title: "Karate Championship", description: "Proud winners in martial arts and sports competitions", year: 2025, icon: "medal" },
  { title: "Academic Excellence", description: "Consistent results across Nursery to Class 8", year: 2025, icon: "graduation" },
  { title: "Co-curricular Stars", description: "Fancy dress, fruit day, Red Day and festival celebrations", year: 2025, icon: "leaf" },
];

export const SUCCESS_STORIES = TESTIMONIALS;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/#programs", label: "Programs" },
  { href: "/#facilities", label: "Facilities" },
  { href: "/admissions", label: "Admissions" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export const FOOTER_PROGRAMS = [
  "Nursery",
  "Junior KG",
  "Senior KG",
  "Class 1-5",
  "Class 6-8",
];

export const FEE_STRUCTURE = [
  { class: "Nursery - KG", tuition: 3500, transport: 1500, exam: 500, total: 5500 },
  { class: "Class 1-5", tuition: 4500, transport: 1500, exam: 750, total: 6750 },
  { class: "Class 6-8", tuition: 5500, transport: 1800, exam: 1000, total: 8300 },
];

export const ADMISSION_STEPS = [
  { step: 1, title: "Inquiry", description: "Visit our campus or contact us to learn about programs and availability.", icon: "phone" },
  { step: 2, title: "Application", description: "Fill out the online admission form with student and parent details.", icon: "file" },
  { step: 3, title: "Interaction", description: "Attend a friendly interaction session with our admission team.", icon: "users" },
  { step: 4, title: "Admission Confirmation", description: "Receive admission letter and complete fee payment to secure the seat.", icon: "check" },
];

export const ACADEMIC_CALENDAR = [
  { month: "April", events: ["New Academic Year Begins", "Orientation Program"] },
  { month: "May", events: ["Summer Activities", "Parent-Teacher Meeting"] },
  { month: "June", events: ["Mid-Term Examinations", "Sports Day"] },
  { month: "July", events: ["Science Exhibition", "Art & Craft Week"] },
  { month: "August", events: ["Independence Day Celebration", "Annual Day Preparations"] },
  { month: "September", events: ["Half-Yearly Examinations", "Field Trip"] },
  { month: "October", events: ["Diwali Vacation", "Project Submissions"] },
  { month: "November", events: ["Annual Day", "Science Fair"] },
  { month: "December", events: ["Winter Break", "Christmas Celebration"] },
  { month: "January", events: ["New Year Activities", "Revision Classes"] },
  { month: "February", events: ["Annual Examinations", "Result Declaration"] },
  { month: "March", events: ["Farewell & Graduation", "Summer Camp Registration"] },
];
