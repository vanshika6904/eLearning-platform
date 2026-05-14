import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Course from "../models/Course.js";
import Quiz from "../models/Quiz.js";

dotenv.config();

const makeQuestions = (items) =>
  items.map((item) => ({
    question: item.question,
    options: item.options,
    correctAnswer: item.correctAnswer
  }));

const seedData = [
  {
    title: "React Developer Masterclass",
    description:
      "Master React fundamentals, component architecture, hooks, routing, and API integration with practical projects.",
    thumbnail: "https://img.youtube.com/vi/bMknfKXIFA8/hqdefault.jpg",
    sections: [
      {
        title: "React Basics",
        lectures: [
          { title: "React in 100 Seconds", videoUrl: "https://www.youtube.com/watch?v=Tn6-PIqc4UM" },
          { title: "React Crash Course", videoUrl: "https://www.youtube.com/watch?v=bMknfKXIFA8" }
        ]
      },
      {
        title: "State and Effects",
        lectures: [
          { title: "useState and useEffect", videoUrl: "https://www.youtube.com/watch?v=O6P86uwfdR0" }
        ]
      }
    ],
    quizTitle: "React Developer Quiz",
    questions: makeQuestions([
      { question: "Which hook is used for side effects?", options: ["useRef", "useMemo", "useEffect", "useCallback"], correctAnswer: 2 },
      { question: "What does JSX compile to?", options: ["HTML", "CSS", "React.createElement calls", "TypeScript"], correctAnswer: 2 },
      { question: "Which prop is required when rendering list items?", options: ["id", "key", "index", "name"], correctAnswer: 1 },
      { question: "State updates in React are generally:", options: ["Synchronous always", "Asynchronous and batched", "Forbidden in events", "Only in class components"], correctAnswer: 1 },
      { question: "Which hook helps optimize expensive calculations?", options: ["useMemo", "useState", "useNavigate", "useLayout"], correctAnswer: 0 },
      { question: "How do you pass data from parent to child?", options: ["Context only", "Redux only", "Props", "Refs"], correctAnswer: 2 },
      { question: "React Router route params are read using:", options: ["useLocation", "useSearchParams", "useParams", "useRef"], correctAnswer: 2 },
      { question: "What is the default behavior of useEffect without dependency array?", options: ["Runs once", "Runs on every render", "Never runs", "Runs only on unmount"], correctAnswer: 1 },
      { question: "What is controlled component input managed by?", options: ["Browser DOM only", "Component state", "CSS", "Local storage"], correctAnswer: 1 },
      { question: "Which is the best place for API calls in function components?", options: ["Inside render return", "Inside useEffect", "Inside JSX props", "Inside CSS files"], correctAnswer: 1 }
    ])
  },
  {
    title: "Node.js API Engineering",
    description:
      "Build production-grade REST APIs with Express, middleware patterns, authentication, and MongoDB.",
    thumbnail: "https://img.youtube.com/vi/Oe421EPjeBE/hqdefault.jpg",
    sections: [
      {
        title: "Node and Express Core",
        lectures: [
          { title: "Node.js Crash Course", videoUrl: "https://www.youtube.com/watch?v=Oe421EPjeBE" },
          { title: "Express Fundamentals", videoUrl: "https://www.youtube.com/watch?v=SccSCuHhOw0" }
        ]
      },
      {
        title: "Authentication",
        lectures: [
          { title: "JWT Auth in Node", videoUrl: "https://www.youtube.com/watch?v=mbsmsi7l3r4" }
        ]
      }
    ],
    quizTitle: "Node.js API Quiz",
    questions: makeQuestions([
      { question: "Which module is used to create an Express app?", options: ["http", "express()", "router()", "mongoose()"], correctAnswer: 1 },
      { question: "JWT typically consists of how many parts?", options: ["2", "3", "4", "5"], correctAnswer: 1 },
      { question: "Status code for unauthorized request is:", options: ["200", "201", "401", "500"], correctAnswer: 2 },
      { question: "Middleware in Express receives:", options: ["req only", "res only", "req, res, next", "next only"], correctAnswer: 2 },
      { question: "Environment variables are commonly loaded using:", options: ["dotenv", "nodemon", "bcrypt", "cors"], correctAnswer: 0 },
      { question: "Which library helps hash passwords securely?", options: ["jsonwebtoken", "bcryptjs", "mongoose", "axios"], correctAnswer: 1 },
      { question: "MongoDB documents are stored in:", options: ["tables", "rows", "collections", "schemas only"], correctAnswer: 2 },
      { question: "Best HTTP verb for creating new records:", options: ["GET", "POST", "PATCH", "DELETE"], correctAnswer: 1 },
      { question: "CORS middleware is used to:", options: ["Hash data", "Allow cross-origin requests", "Validate JWT", "Create sockets"], correctAnswer: 1 },
      { question: "Mongoose model methods are typically asynchronous and return:", options: ["Numbers", "Promises", "Booleans only", "Strings"], correctAnswer: 1 }
    ])
  },
  {
    title: "MongoDB & Mongoose Essentials",
    description:
      "Design document databases, write efficient queries, define schemas, and model relations with Mongoose.",
    thumbnail: "https://img.youtube.com/vi/ofme2o29ngU/hqdefault.jpg",
    sections: [
      {
        title: "MongoDB Fundamentals",
        lectures: [
          { title: "MongoDB in 100 Seconds", videoUrl: "https://www.youtube.com/watch?v=-56x56UppqQ" },
          { title: "MongoDB Crash Course", videoUrl: "https://www.youtube.com/watch?v=ofme2o29ngU" }
        ]
      },
      {
        title: "Mongoose ODM",
        lectures: [
          { title: "Mongoose Tutorial", videoUrl: "https://www.youtube.com/watch?v=DZBGEVgL2eE" }
        ]
      }
    ],
    quizTitle: "MongoDB & Mongoose Quiz",
    questions: makeQuestions([
      { question: "MongoDB stores data as:", options: ["Rows", "XML", "Documents", "CSV"], correctAnswer: 2 },
      { question: "Mongoose schema is used to:", options: ["Style UI", "Define document structure", "Create sockets", "Run tests"], correctAnswer: 1 },
      { question: "Which operator is used to match by id in MongoDB?", options: ["$id", "_id", "$_id", "$matchId"], correctAnswer: 1 },
      { question: "populate() in Mongoose helps to:", options: ["Hash passwords", "Join referenced documents", "Delete indexes", "Enable CORS"], correctAnswer: 1 },
      { question: "findOne() returns:", options: ["Array always", "Single document or null", "Only count", "Boolean"], correctAnswer: 1 },
      { question: "Which method inserts a new document in Mongoose?", options: ["create()", "insertSQL()", "saveFile()", "append()"], correctAnswer: 0 },
      { question: "Timestamps option adds:", options: ["token and role", "createdAt and updatedAt", "id and slug", "name and value"], correctAnswer: 1 },
      { question: "Best choice for one-to-many embedded content like lectures:", options: ["Array of subdocuments", "CSS classes", "HTTP headers", "Socket rooms"], correctAnswer: 0 },
      { question: "What does lean() do in Mongoose queries?", options: ["Returns plain JS objects", "Adds indexes", "Creates schema", "Encrypts fields"], correctAnswer: 0 },
      { question: "Which status is appropriate when a document is not found?", options: ["200", "201", "404", "302"], correctAnswer: 2 }
    ])
  },
  {
    title: "JavaScript Interview Prep",
    description:
      "Strengthen core JavaScript concepts including closures, promises, event loop, and async patterns.",
    thumbnail: "https://img.youtube.com/vi/W6NZfCO5SIk/hqdefault.jpg",
    sections: [
      {
        title: "Core JS Concepts",
        lectures: [
          { title: "JavaScript Fundamentals", videoUrl: "https://www.youtube.com/watch?v=W6NZfCO5SIk" },
          { title: "Event Loop Explained", videoUrl: "https://www.youtube.com/watch?v=8aGhZQkoFbQ" }
        ]
      },
      {
        title: "Async JavaScript",
        lectures: [
          { title: "Promises and Async/Await", videoUrl: "https://www.youtube.com/watch?v=PoRJizFvM7s" }
        ]
      }
    ],
    quizTitle: "JavaScript Mastery Quiz",
    questions: makeQuestions([
      { question: "A closure is:", options: ["A CSS property", "Function with preserved lexical scope", "A DB transaction", "A package manager"], correctAnswer: 1 },
      { question: "Which keyword declares a block-scoped variable?", options: ["var", "let", "const", "Both let and const"], correctAnswer: 3 },
      { question: "Promise.resolve() returns:", options: ["Rejected promise", "Resolved promise", "String", "Function"], correctAnswer: 1 },
      { question: "Which queue has higher priority in JS runtime?", options: ["Macrotask", "Microtask", "Both same", "Render queue"], correctAnswer: 1 },
      { question: "setTimeout callback goes to:", options: ["Microtask queue", "Call stack directly", "Macrotask queue", "Heap"], correctAnswer: 2 },
      { question: "JSON.stringify is used to:", options: ["Parse JSON", "Convert JS object to JSON string", "Validate token", "Create array"], correctAnswer: 1 },
      { question: "=== compares:", options: ["Value only", "Type only", "Value and type", "Object references only"], correctAnswer: 2 },
      { question: "async function always returns:", options: ["Number", "Promise", "Boolean", "Array"], correctAnswer: 1 },
      { question: "Array.map returns:", options: ["New transformed array", "Single value", "Mutated object", "Promise only"], correctAnswer: 0 },
      { question: "Which statement catches async errors with await?", options: ["if/else", "switch", "try/catch", "forEach"], correctAnswer: 2 }
    ])
  }
];

const seed = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in environment.");
    }

    await mongoose.connect(process.env.MONGO_URI);

    let instructor = await User.findOne({ email: "seed.instructor@learnhub.dev" });
    if (!instructor) {
      const hashedPassword = await bcrypt.hash("Instructor@123", 10);
      instructor = await User.create({
        name: "Seed Instructor",
        email: "seed.instructor@learnhub.dev",
        password: hashedPassword,
        role: "instructor"
      });
    }

    for (const courseSeed of seedData) {
      let course = await Course.findOne({ title: courseSeed.title });
      if (!course) {
        course = await Course.create({
          title: courseSeed.title,
          description: courseSeed.description,
          thumbnail: courseSeed.thumbnail,
          instructor: instructor._id,
          sections: courseSeed.sections
        });
      } else {
        course.description = courseSeed.description;
        course.thumbnail = courseSeed.thumbnail;
        course.instructor = instructor._id;
        course.sections = courseSeed.sections;
        await course.save();
      }

      const existingQuiz = await Quiz.findOne({ course: course._id });
      if (existingQuiz) {
        existingQuiz.title = courseSeed.quizTitle;
        existingQuiz.questions = courseSeed.questions;
        await existingQuiz.save();
      } else {
        await Quiz.create({
          course: course._id,
          title: courseSeed.quizTitle,
          questions: courseSeed.questions
        });
      }
    }

    console.log("Seeding complete: 4 courses + 4 quizzes (10 questions each).");
    console.log("Instructor login: seed.instructor@learnhub.dev / Instructor@123");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
};

seed();
