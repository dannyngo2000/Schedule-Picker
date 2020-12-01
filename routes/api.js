const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const config = require("../config/database");
const bcrypt = require("bcryptjs");
const timetables = require("../Lab3-timetable-data.json");
const sanitizeHTML = require("sanitize-html");
const storage = require("node-persist");
var courses = [];

const reviewStorage = storage.create({ dir: "review", ttl: 3000 });
const scheduleListStorage = storage.create({ dir: "schedules", ttl: 3000 });

router.get("/open/getAllSubjects", (req, res, next) => {
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
module.exports = router;
