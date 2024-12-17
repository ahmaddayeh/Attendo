<?php
// File: local_teacherinfo/db/services.php

defined('MOODLE_INTERNAL') || die();

$services = [
    'Student Info Service' => [
        'functions' => ['local_studentinfo_get_students_with_courses'],
        'restrictedusers' => 0,
        'enabled' => 1,
    ],
];

$functions = [
    'local_studentinfo_get_students_with_courses' => [
        'classname' => 'local_studentinfo_external',
        'methodname' => 'get_students_with_courses',
        'classpath' => 'local/studentinfo/externallib.php',
        'description' => 'Retrieve all students and their enrolled courses with detailed information.',
        'type' => 'read',
        'ajax' => true,
    ],
];
