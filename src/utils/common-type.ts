import { ObjectId } from 'mongodb';

/**
 * Date Types
 *
 * TimeZone with luxon
 *
 * let dateInputValue = '2020-12-30'
 *
 * --get current time as a Luxon DateTime object
 * const now = DateTime.now();
 *
 * --get current time as a string to put into input
 * DateTime.now().toFormat('yyyy-MM-dd')
 *
 * --get Luxon DateTime object from an input
 * let dateTimeLocal = DateTime.fromISO(dateInputValue + 'T00:00');
 *
 * --turn Luxon DateTime object to string with timezone
 * let stringIso= dateTimeLocal.toString()
 * "2024-03-22T00:00:00.000-04:00"
 *
 * --turn Luxon DateTime object to string without timezone
 * let formattedDate = dateTimeLocal.toFormat('yyyy/MM/dd hh:mm:ss a')
 *  '2020/12/30 12:00:00 AM'
 *
 * --from string to Luxon DateTime object
 * let dateTime = DateTime.fromISO(stringIso);
 *
 * --to local time
 * dateTime = dateTime.toLocal();
 *
 *
 * DB:           JSDate New Date()
 * backEnd:      Luxon :dateTimeLocal.toString() "2024-03-22T00:00:00.000-04:00"
 * Display:      2020/12/30 12:00:00 AM
 * Input input:  2020-12-30
 * Input output: 2020-12-30
 *
 * -In backend => string with timezone: "2024-03-22T00:00:00.000-04:00"
 * let backendTime= DateTime.now().toString();
 *
 *to DB:
 *
 * - data in db =>  string with timezone:
 * let dbTime=  JS Date;
 *
 * from DB to backend:
 * let timeNowBeToDb =new Date()
 * let timeFromDb = DateTime.fromJSDate(dbTime).toISO()
 *
 * - Get Data from backend to front: string with timezone => loacal time '2022-03-22'
 * let stateDate = DateTime.fromISO(beTime).toLocal().toFormat('yyyy-MM-dd');
 * let stateTime = DateTime.fromISO(beTime).toLocal().toFormat('yyyy/MM/dd hh:mm:ss a');
 *
 * - In app
 * let display = stateDate.replace(/-/g, '/')
 * let input = '2022-03-22' e.targrt.value
 *
 * -Get Date Now and use it in front end
 * let DateNowState = DateTime.now().toFormat('yyyy-MM-dd')
 *
 * - Get Time Now and send to backend directly:
 * let timenow = DateTime.now().toString();
 * 
 * - send to backend
 * let tobe=DateTime.fromISO(dateInputValue + 'T00:00').toSting();
 *
 * - Put Data in DB: string with timezone => "2024-03-22T00:00:00.000-04:00" to JS Date
 * let toDb =  new Date(timenow)
 *
 */

//categories
interface Category {
  _id: ObjectId;
  name: string;
  short: string;
  create_time: Date;
  long: string;
  topics: TopicInCategory[]; //topic_id array
  status: number; // as en.status
  language: string[]; // as en.options.language
  subscribed: string[]; // user_id array
  img:string;
}
interface TopicInCategory {
    topic_id: string;
    name: string;
    create_time: Date;
}

//topics
interface Topic {
  _id: ObjectId;
  language: string;
  name: string;
  create_time: Date;
  description: string;
  endtime: string;
  steps: Step[];
  category_id: ObjectId;
  category_name: string;
  example: string[];
  level: number; // as en.Level
  subscribed: string[]; // user_id array
}
interface Step {
  name: string;
  details: string;
}

//users
interface User {
  _id: string;
  name: string;
  plan: number;
  birthday: Date;
  categories: Category[];
  country: string;
  gender: string;
  img: string;
  language: string;
  learning: Learning[];
  createAt: string;
}
interface Learning {
  writing: string[];
  speaking: string[];
}

//articles
interface Article {
  _id: ObjectId;
  user_id: string;
  category_id: ObjectId;
  topic_id: ObjectId;
  content: string;
  last_save: Date | string;
  create_time: Date | string;
  language: string;
  category_name: string;
  name: string;
  endtime: string;
  feedback: Feedback;
  level: number;
  status: number;
}
interface Feedback {
    rating: number;
    comment: string;
    suggestion: string;
    article: string;
    highlights: Highlight[];
}
interface Highlight {
    word: string;
    explanation: string;
}

//news
interface News {
  _id: ObjectId;
  title: string;
  time:Date;
  author:string;
  content:string[];
  status:number;
}
//suggestions
interface Suggestion {
  _id: ObjectId;
  suggestion: string;
  userId: string;
  createdAt: Date;
}


export type { Category,Topic, Step, User, Learning, Article , News, Suggestion };
