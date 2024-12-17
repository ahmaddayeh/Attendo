<?php

defined('MOODLE_INTERNAL') || die();

require_once($CFG->libdir . '/externallib.php');

class local_studentinfo_external extends external_api {

    public static function get_students_with_courses_parameters() {
        return new external_function_parameters([]);
    }

    public static function get_students_with_courses() {
        global $DB;

        // Validate parameters
        self::validate_parameters(self::get_students_with_courses_parameters(), []);

        // Fetch all students with role id = 5 (typically students)
        $sql = "SELECT DISTINCT u.id AS userid, u.username, u.firstname, u.lastname, u.email, u.city, u.country, u.auth, u.lang, u.picture
                FROM {role_assignments} ra
                JOIN {user} u ON ra.userid = u.id
                JOIN {context} ctx ON ra.contextid = ctx.id
                WHERE ra.roleid = 5
                  AND ctx.contextlevel = 50"; // Ensure we're getting students assigned to course contexts

        $students = $DB->get_records_sql($sql);

        // Initialize result array for students
        $result = [];

        // Loop through each student and prepare base structure
        foreach ($students as $student) {
            $result[$student->userid] = [
                'studentinfo' => [
                    'id' => $student->userid,
                    'username' => $student->username,
                    'firstname' => $student->firstname,
                    'lastname' => $student->lastname,
                    'email' => $student->email,
                    'city' => $student->city,
                    'country' => $student->country,
                    'auth' => $student->auth,
                    'lang' => $student->lang,
                    'profile_url' => $student->picture ? moodle_url::make_pluginfile_url($student->userid, 'user', 'icon', $student->userid) : null
                ],
                'courses' => [] // Initialize an empty array for courses
            ];
        }

        // Fetch all courses the students are enrolled in
        $course_sql = "SELECT DISTINCT u.id AS userid, c.id AS courseid, c.idnumber AS courseidnumber, c.fullname, c.shortname, c.category, c.summary, c.startdate, c.enddate, c.visible, c.format
                       FROM {role_assignments} ra
                       JOIN {user} u ON ra.userid = u.id
                       JOIN {context} ctx ON ra.contextid = ctx.id
                       JOIN {course} c ON ctx.instanceid = c.id
                       WHERE ra.roleid = 5
                         AND ctx.contextlevel = 50
                       ORDER BY u.id, c.id"; // Ensuring proper order of users and courses

        $courses = $DB->get_records_sql($course_sql);

        // Loop through each course and append it to the respective student
        foreach ($courses as $course) {
            // Prepare course data
            $course_data = [
                'id' => $course->courseid,
                'idnumber' => $course->courseidnumber,
                'fullname' => $course->fullname,
                'shortname' => $course->shortname,
                'category' => $course->category,
                'summary' => $course->summary,
                'startdate' => $course->startdate,
                'enddate' => $course->enddate,
                'visible' => $course->visible,
                'format' => $course->format
            ];

            // Ensure we are correctly appending courses to each student
            if (isset($result[$course->userid])) {
                // Add the course to the student's course list
                $result[$course->userid]['courses'][] = $course_data;
            }
        }

        // Return the result as a sequential array of student data, including courses
        return array_values($result);
    }

    public static function get_students_with_courses_returns() {
        return new external_multiple_structure(
            new external_single_structure([
                'studentinfo' => new external_single_structure([
                    'id' => new external_value(PARAM_INT, 'Student ID'),
                    'username' => new external_value(PARAM_TEXT, 'Username'),
                    'firstname' => new external_value(PARAM_TEXT, 'First Name'),
                    'lastname' => new external_value(PARAM_TEXT, 'Last Name'),
                    'email' => new external_value(PARAM_EMAIL, 'Email Address'),
                    'city' => new external_value(PARAM_TEXT, 'City'),
                    'country' => new external_value(PARAM_TEXT, 'Country'),
                    'auth' => new external_value(PARAM_TEXT, 'Authentication Method'),
                    'lang' => new external_value(PARAM_TEXT, 'Language'),
                    'profile_url' => new external_value(PARAM_URL, 'Profile Picture URL', VALUE_OPTIONAL)
                ]),
                'courses' => new external_multiple_structure(
                    new external_single_structure([
                        'id' => new external_value(PARAM_INT, 'Course ID'),
                        'idnumber' => new external_value(PARAM_TEXT, 'Course ID Number'),
                        'fullname' => new external_value(PARAM_TEXT, 'Full Name'),
                        'shortname' => new external_value(PARAM_TEXT, 'Short Name'),
                        'category' => new external_value(PARAM_INT, 'Category ID'),
                        'summary' => new external_value(PARAM_RAW, 'Course Summary'),
                        'startdate' => new external_value(PARAM_INT, 'Start Date'),
                        'enddate' => new external_value(PARAM_INT, 'End Date', VALUE_OPTIONAL),
                        'visible' => new external_value(PARAM_INT, 'Visible Status'),
                        'format' => new external_value(PARAM_TEXT, 'Course Format')
                    ])
                )
            ])
        );
    }
}
