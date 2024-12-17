<?php
// File: local_teacherinfo/db/services.php

defined('MOODLE_INTERNAL') || die();

$services = [
    'Teacher Info Service' => [
        'functions' => ['local_teacherinfo_get_teachers_with_courses'],
        'restrictedusers' => 0,
        'enabled' => 1,
    ],
];

$functions = [
    'local_teacherinfo_get_teachers_with_courses' => [
        'classname' => 'local_teacherinfo_external',
        'methodname' => 'get_teachers_with_courses',
        'classpath' => 'local/teacherinfo/externallib.php',
        'description' => 'Retrieve all teachers and their enrolled courses with detailed information.',
        'type' => 'read',
        'ajax' => true,
    ],
];
