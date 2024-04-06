CREATE TABLE IF NOT EXISTS Students (
    student_id INTEGER PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    major_id INTEGER,
    secondary_language_id INTEGER,
    FOREIGN KEY(major_id) REFERENCES Majors(major_id),
    FOREIGN KEY(secondary_language_id) REFERENCES Languages(language_id)
);

CREATE TABLE IF NOT EXISTS TakesCourses (
    student_id INTEGER,
    course_id INTEGER,
    PRIMARY KEY(student_id, course_id),
    FOREIGN KEY(student_id) REFERENCES Students(student_id),
    FOREIGN KEY(course_id) REFERENCES Courses(course_id)
);

CREATE TABLE IF NOT EXISTS HasInterests (
    student_id INTEGER,
    interest_id INTEGER,
    PRIMARY KEY(student_id, interest_id),
    FOREIGN KEY(student_id) REFERENCES Students(student_id),
    FOREIGN KEY(interest_id) REFERENCES Interests(interest_id)
);

CREATE TABLE IF NOT EXISTS Majors (
    major_id INTEGER PRIMARY KEY,
    major_name TEXT NOT NULL UNIQUE
);


CREATE TABLE IF NOT EXISTS Languages (
    language_id INTEGER PRIMARY KEY,
    language_name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS Courses (
    course_id INTEGER PRIMARY KEY,
    major_id INTEGER,
    course_name TEXT NOT NULL UNIQUE,
    course_code TEXT NOT NULL UNIQUE,
    FOREIGN KEY(major_id) REFERENCES Majors(major_id)
);


CREATE TABLE IF NOT EXISTS Interests (
    interest_id INTEGER PRIMARY KEY,
    interest_name TEXT NOT NULL UNIQUE
);


