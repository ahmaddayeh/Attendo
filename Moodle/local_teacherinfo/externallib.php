<?php
// File: local_teacherinfo/externallib.php

defined('MOODLE_INTERNAL') || die();

require_once($CFG->libdir . '/externallib.php');

class local_teacherinfo_external extends external_api {

    public static function get_teachers_with_courses_parameters() {
        return new external_function_parameters([]);
    }

    public static function get_teachers_with_courses() {
        global $DB;

        // Validate parameters.
        self::validate_parameters(self::get_teachers_with_courses_parameters(), []);

        // Fetch all teachers and their complete details.
        $sql = "SELECT u.*, c.id AS courseid, c.idnumber AS courseidnumber, c.*
                FROM {role_assignments} ra
                JOIN {user} u ON ra.userid = u.id
                JOIN {context} ctx ON ra.contextid = ctx.id
                JOIN {course} c ON ctx.instanceid = c.id
                WHERE ra.roleid = 3
                  AND ctx.contextlevel = 50";

        $records = $DB->get_records_sql($sql);

        $result = [];

        foreach ($records as $record) {
            if (!isset($result[$record->id])) {
                $result[$record->id] = [
                    'userinfo' => [
                        'id' => $record->id,
                        'username' => $record->username,
                        'firstname' => $record->firstname,
                        'lastname' => $record->lastname,
                        'email' => $record->email,
                        'city' => $record->city,
                        'country' => $record->country,
                        'auth' => $record->auth,
                        'lang' => $record->lang,
                        'profile_url' => $record->picture ? moodle_url::make_pluginfile_url($record->id, 'user', 'icon', $record->id) : null
                    ],
                    'courses' => []
                ];
            }

            $result[$record->id]['courses'][] = [
                'id' => $record->courseid,
                'idnumber' => $record->courseidnumber,
                'fullname' => $record->fullname,
                'shortname' => $record->shortname,
                'category' => $record->category,
                'summary' => $record->summary,
                'startdate' => $record->startdate,
                'enddate' => $record->enddate,
                'visible' => $record->visible,
                'format' => $record->format
            ];
        }

        return array_values($result);
    }

    public static function get_teachers_with_courses_returns() {
        return new external_multiple_structure(
            new external_single_structure([
                'userinfo' => new external_single_structure([
                    'id' => new external_value(PARAM_INT, 'User ID'),
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
