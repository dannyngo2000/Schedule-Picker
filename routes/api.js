const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const config = require("../config/database");
const bcrypt = require("bcryptjs");
const timetables = require("../Lab3-timetable-data.json");
const sanitizeHTML = require("sanitize-html");
const stringSimilarity = require("string-similarity");
var courses = [];
let authorSchedule = [];
const storage = require("node-persist");
const myStorage = storage.create({ dir: ".node-persist/reviews", ttl: 90000 });
let initializePersist = async function () {
  await storage.init();
  await myStorage.init();
};
initializePersist();

router.get("/open/subjects", (req, res, next) => {
  var temp = [];
  timetables.forEach((timetable) => {
    temp.push({
      subject: timetable.subject.toString(),
      className: timetable.className.toString(),
    });
  });
  var seen = {};
  temp = temp.filter(function (currentObject) {
    if (currentObject.className in seen) {
      return false;
    } else {
      seen[currentObject.className] = true;
      return true;
    }
  });
  try {
    res.status(200).send(temp);
  } catch (err) {
    console.log(err);
  }
});

/**@GET GET all course codes (property name: catalog_nbr) for a given subject code. **/
router.get("/open/courseCode/:subjectName", (req, res) => {
  let subjectName = req.params.subjectName;
  subjectName = sanitizeHTML(subjectName, {
    allowedTags: [],
    allowedAttributes: [],
  });
  var courseCode = [];
  timetables.forEach((timetable) => {
    if (timetable.subject === subjectName) {
      courseCode.push({ course_code: timetable.catalog_nbr.toString() });
    }
  });
  if (courseCode.length > 0) {
    res.status(200).send(courseCode);
  } else {
    res.status(404).send(`The subject ${subjectName} is not available`);
  }
});
/** @GET GET  the timetable entry for a given subject code,
 *  a course code and an optional course component.
 * Return an error if the subject code or course code doesn’t exist. If the course component is not specified, return time table entries for all components.
 **/
router.get(
  "/open/timetable/:subjectCode/:courseCode/:component?",
  (req, res, next) => {
    var { subjectCode, courseCode, component } = req.params;
    subjectCode = sanitizeHTML(subjectCode, {
      allowedTags: [],
      allowedAttributes: [],
    });
    courseCode = sanitizeHTML(courseCode, {
      allowedTags: [],
      allowedAttributes: [],
    });
    component = sanitizeHTML(component, {
      allowedTags: [],
      allowedAttributes: [],
    });
    var data = [];

    timetables.forEach((timetable) => {
      if (
        timetable.subject == subjectCode &&
        timetable.catalog_nbr.toString() == courseCode
      ) {
        if (component) {
          data.push({
            courseCode: timetable.catalog_nbr,
            subject: timetable.subject,
            start_time: timetable.course_info[0].start_time,
            end_time: timetable.course_info[0].end_time,
            class_nbr: timetable.course_info[0].class_nbr,
            campus: timetable.course_info[0].campus,
            ssr_component: timetable.course_info[0].ssr_component,
            class_section: timetable.course_info[0].class_section,
            className: timetable.className,
          });
        } else if (!component) {
          data.push({
            courseCode: timetable.catalog_nbr,
            subject: timetable.subject,
            start_time: timetable.course_info[0].start_time,
            end_time: timetable.course_info[0].end_time,
            class_nbr: timetable.course_info[0].class_nbr,
            campus: timetable.course_info[0].campus,
            ssr_component: timetable.course_info[0].ssr_component,
            class_section: timetable.course_info[0].class_section,
            className: timetable.className,
          });
        }
      }
    });

    if (data.length !== 0) {
      res.status(201).send(data);
    } else {
      res.status(401).json({
        message: `${courseCode} or ${subjectCode} does not exist`,
      });
    }
  }
);
/**@GET course codes given subject names */
router.get("/open/getAllCourseCodes/:subjectCode", (req, res, next) => {
  var { subjectCode } = req.params;
  subjectCode = sanitizeHTML(subjectCode, {
    allowedTags: [],
    allowedAttributes: [],
  });
  var data = [];

  timetables.forEach((timetable) => {
    if (timetable.subject == subjectCode) {
      data.push({
        courseCode: timetable.catalog_nbr,
        subject: timetable.subject,
        start_time: timetable.course_info[0].start_time,
        end_time: timetable.course_info[0].end_time,
        class_nbr: timetable.course_info[0].class_nbr,
        campus: timetable.course_info[0].campus,
        ssr_component: timetable.course_info[0].ssr_component,
        class_section: timetable.course_info[0].class_section,
        className: timetable.className,
      });
    }
  });

  if (data.length !== 0) {
    res.status(201).send(data);
  } else {
    res.status(401).json({
      message: `${subjectCode} does not exist`,
    });
  }
});
/**@GET GET course by keyword of ClassName */
router.get("/open/getKeywordClassName/:keyword", (req, res, next) => {
  let { keyword } = req.params;
  let result = [];
  timetables.forEach((timetable) => {
    let num = stringSimilarity.compareTwoStrings(
      keyword.toLowerCase(),
      timetable.className.toLowerCase()
    );
    if (num >= 0.3) {
      result.push({
        courseCode: timetable.catalog_nbr,
        subject: timetable.subject,
        start_time: timetable.course_info[0].start_time,
        end_time: timetable.course_info[0].end_time,
        class_nbr: timetable.course_info[0].class_nbr,
        campus: timetable.course_info[0].campus,
        ssr_component: timetable.course_info[0].ssr_component,
        class_section: timetable.course_info[0].class_section,
        className: timetable.className,
      });
    }
  });
  if (result.length != 0) res.status(200).send(result);
  else res.status(404).send(`The ${keyword} does not match`);
});
/**@GET GET Keyword Class NUM */
router.get("/open/getKeywordClassNum/:keyword", (req, res, next) => {
  let { keyword } = req.params;
  let result = [];
  timetables.forEach((timetable) => {
    let num = stringSimilarity.compareTwoStrings(
      keyword.toLowerCase(),
      timetable.catalog_nbr.toString().toLowerCase()
    );
    if (num >= 0.4) {
      result.push({
        courseCode: timetable.catalog_nbr,
        subject: timetable.subject,
        start_time: timetable.course_info[0].start_time,
        end_time: timetable.course_info[0].end_time,
        class_nbr: timetable.course_info[0].class_nbr,
        campus: timetable.course_info[0].campus,
        ssr_component: timetable.course_info[0].ssr_component,
        class_section: timetable.course_info[0].class_section,
        className: timetable.className,
      });
    }
  });
  if (result.length != 0) res.status(200).send(result);
  else res.status(404).send(`The ${keyword} does not match`);
});

/** @POST POST CREATE new timetable name **/
router.post(
  "/private/schedule/:scheduleName/:author/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    var scheduleName = req.params.scheduleName.toString();
    let author = req.params.author.toString();
    let status = req.body.status;
    console.log(status);
    scheduleName = sanitizeHTML(scheduleName, {
      allowedTags: [],
      allowedAttributes: [],
    });
    let time = getTime();
    try {
      if ((await storage.get(scheduleName)) == null && scheduleName != "") {
        await storage.setItem(scheduleName, [
          { author: author },
          { status: status },
          { time: time },
        ]);
        await res.status(201).json({
          msg: `Added ${scheduleName}`,
        });
      } else {
        res
          .status(403)
          .send(`The name ${scheduleName} is already existed or not valid`);
      }
    } catch (err) {
      console.log(err);
    }
  }
);
//@GET a list of schedule name and number of courses are saved in each schedule from an author

router.get("/private/getAuthorSchedule/:authorName", async (req, res, next) => {
  let name = req.params.authorName;
  let keys = await storage.keys();
  try {
    responses = keys.map(async (key) => {
      let currentItem = await storage.get(key);
      if (currentItem[0].author == name) {
        return {
          scheduleName: key,
          author: currentItem[0].author,
          status: currentItem[1].status,
          time: currentItem[2].time,
          length: (currentItem.length - 3).toString(),
        };
      } else {
      }
    });
    Promise.all(responses).then((response) => {
      if (response != null) res.status(200).send(response);
    });
  } catch (err) {
    console.log(rrr);
  }
});
//@GET GET list of subject and course codes from a given schedule of an author
router.get(
  "/private/getSchedule/:scheduleName",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    var scheduleNamed = req.params.scheduleName;

    scheduleNamed = sanitizeHTML(scheduleNamed, {
      allowedTags: [],
      allowedAttributes: [],
    });
    try {
      const existing = await storage.get(scheduleNamed);
      if (existing) {
        //var list = await storage.get(scheduleNamed);

        res.status(200).send(existing);
      } else {
        res.status(404).send(`The schedule ${scheduleNamed} is not existed`);
      }
    } catch (err) {
      console.log(err);
    }
    res.send("hi");
  }
);
let getTime = function () {
  var currentDate = new Date();
  var dateTime =
    currentDate.getDate() +
    "/" +
    (currentDate.getMonth() + 1) +
    "/" +
    currentDate.getFullYear() +
    " @ " +
    currentDate.getHours() +
    ":" +
    currentDate.getMinutes() +
    ":" +
    currentDate.getSeconds();
  return dateTime;
};
/**@DELETE schedule */
router.delete("/private/schedule/:scheduleName", async (req, res) => {
  var scheduleName = req.params.scheduleName.toString();
  scheduleName = sanitizeHTML(scheduleName, {
    allowedTags: [],
    allowedAttributes: [],
  });
  try {
    await storage.removeItem(scheduleName);
    res.status(204).json({
      msg: `successfully removed ${scheduleName}`,
    });
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
