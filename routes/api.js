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
const { response } = require("express");
const myStorage = storage.create({
  dir: ".node-persist/reviews",
  ttl: 9999999,
});
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
    console.log("helllo");
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
      }
    });

    Promise.all(responses).then((response) => {
      response = response.filter((item) => {
        return item !== undefined;
      });
      console.log(response);
      res.status(200).send(response);
    });
  } catch (err) {
    console.log(err);
  }
});

/**@GET GET all list of schedules from all authors */
router.get("/open/getAllSchedules", async (req, res, next) => {
  let keys = await storage.keys();
  try {
    responses = keys.map(async (key) => {
      let currentItem = await storage.get(key);
      return {
        scheduleName: key,
        author: currentItem[0].author,
        status: currentItem[1].status,
        time: currentItem[2].time,
        length: (currentItem.length - 3).toString(),
      };
    });

    Promise.all(responses).then((response) => {
      console.log(response);
      res.status(200).send(response);
    });
  } catch (err) {
    console.log(err);
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
  }
);
router.get("/open/getSchedule/:scheduleName", async (req, res, next) => {
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
});
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

/**@PUT UPDATE the schedule **/
router.put("/private/updateSchedule/:scheduleName", async function (req, res) {
  var scheduleName = req.params.scheduleName.toString();
  scheduleName = sanitizeHTML(scheduleName, {
    allowedTags: [],
    allowedAttributes: [],
  });
  var list = req.body;
  console.log(list);
  seen = [];
  let result = [];
  let filterCourses = [];
  for (let i = 3; i < list.length; i++) {
    filterCourses.push(list[i]);
  }
  filterCourses = filterCourses.filter(function (currentObject) {
    if (currentObject.course_code in seen) {
      return false;
    } else {
      seen[currentObject.course_code] = true;
      return true;
    }
  });
  filterCourses = filterCourses.filter(
    (course) => course.subject_code && course.course_code
  );

  result.push(list[0]);
  result.push(list[1]);
  result.push(list[2]);
  filterCourses.forEach((course) => result.push(course));

  try {
    if ((await storage.get(scheduleName)) != null) {
      storage.updateItem(scheduleName, result);

      res.status(200).json({
        data: result,
      });
    } else {
      res.status(404).send(`The schedule ${scheduleName} is not existed`);
    }
  } catch (err) {
    console.log(err);
  }
});
/** @POST review to a given courseID */
router.post(
  "/private/addReview/:courseID",
  passport.authenticate("jwt", { session: false }),
  async function (req, res, next) {
    let courseID = req.params.courseID;
    let reviews = req.body;
    let contain = false;

    timetables.forEach((timetable) => {
      if (timetable.course_info[0].class_nbr == courseID) {
        contain = true;
      }
    });
    if (contain) {
      if ((await myStorage.getItem(courseID)) === undefined)
        await myStorage.setItem(courseID, reviews);
      else {
        let currentReviews = await myStorage.getItem(courseID);
        await currentReviews.push(reviews[0]);
        await myStorage.setItem(courseID, currentReviews);
      }
      res.status(200).json({ message: "Successfully added" });
    } else {
      res.status(400).send("error");
    }
  }
);

/** */

/** @GET review from a course ID */
router.get("/private/getReview/:courseID", async function (req, res, next) {
  let courseID = req.params.courseID;
  if ((await myStorage.getItem(courseID)) === undefined) {
    res.status(400).send("There is currently no reviews yet");
  } else if (await myStorage.getItem(courseID)) {
    let result = await myStorage.getItem(courseID);

    res.status(200).send(result);
  }
});
/** @PUT set status of review to a given courseID */
router.put(
  "/private/updateReview/:courseID",
  passport.authenticate("jwt", { session: false }),
  async function (req, res, next) {
    let courseID = req.params.courseID;
    let reviews = req.body;
    let contain = false;
    console.log();
    timetables.forEach((timetable) => {
      if (timetable.course_info[0].class_nbr == courseID) {
        contain = true;
      }
    });
    if (contain) {
      let responses = await myStorage.getItem(courseID);

      responses.forEach((response) => {
        if (response.review === reviews[0].description) {
          response.hidden = true;
        }
        console.log(response);
      });
      let b = await myStorage.setItem(courseID, responses);
      res.send(responses);
    } else {
      res.status(400).send("error");
    }
  }
);

/** @PUT set the status of a schedule to public or private */
router.put(
  "/private/setScheduleStatus/:scheduleName",
  passport.authenticate("jwt", { session: false }),
  async function (req, res, next) {
    let name = req.params.scheduleName;
    if (await storage.get(name)) {
      let responses = await storage.get(name);
      responses.forEach((response) => {
        if (response.status) {
          if (response.status == "Public") response.status = "Private";
          else if (response.status == "Private") response.status = "Public";
        }
      });
      await storage.setItem(name, responses);
      responses = await storage.getItem(name);

      res.send(responses);
    } else {
      res.status(404).send("The schedule name does not exist");
    }
  }
);

module.exports = router;
