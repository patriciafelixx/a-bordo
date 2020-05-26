const { User, School, Subject, Student, Teacher, Guardian, Class, Course, Student_Guardian, Class_Student, Lesson, Attendance, Evaluation, Student_Evaluation, Repeater } = require("../models");
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
    renderHome: async (req, res) => {
        const user = req.session.user;

        const teacher = await Teacher.findOne({ where: { userId: user.id } });
        const courses = await Course.findAll({ where: { teacherId: teacher.id } });

        let subjectsIds = [];
        let classesIds = [];

        for (course of courses) {
            subjectsIds.push(course.subjectId);
            classesIds.push(course.classId);
        }
        let subjects = [];
        for (id of subjectsIds) {
            let subject = await Subject.findOne({ where: { id } });
            subjects.push(subject);
        }
        let classes = [];
        for (id of classesIds) {
            let c = await Class.findOne({ where: { id } });
            classes.push(c);
        }
        let schools = [];
        for (c of classes) {
            let school = await School.findOne({ where: { id: c.schoolId } });
            schools.push(school);
        }

        console.log(subjects);
        console.log(classes);
        console.log(schools);

        return res.render("teacher-home", { user, subjects, classes, schools });
    },
    renderRegistrationForm: (req, res) => {
        res.render("register-teacher");
    },
    registerTeacher: async (req, res) => {
        // CREATE USER
        const { forename, surname, email, phone, password } = req.body;
        const picture = req.file ? req.file.filename : null;

        const user = await User.create(
            {
                forename: forename.toUpperCase(),
                surname: surname.toUpperCase(),
                email: email.toUpperCase(),
                phone,
                password: bcrypt.hashSync(password, saltRounds),
                picture
            }
        );
        // MAKE THE USER A TEACHER
        const teacher = await Teacher.create({ userId: user.id });

        // CREATE SCHOOLS
        const objKeysSchool = Object.keys(req.body).filter(
            key => key.substr(0, 6) == "school"
        );
        let schoolsList = [];
        for (schoolKey of objKeysSchool) {
            schoolsList.push(
                {
                    name: req.body[schoolKey][2],
                    passingGrade: req.body[schoolKey][3],
                    academicTerms: req.body[schoolKey][4],
                    state: req.body[schoolKey][0],
                    municipality: req.body[schoolKey][1]
                }
            );
        };
        const schools = await School.bulkCreate(schoolsList);

        // CREATE CLASSES
        const objKeysClass = Object.keys(req.body).filter( // ex. return [ "class1-school1", "class2-school1", "class1-school2" ]
            key => key.substr(0, 5) == "class"
        );
        let classesList = [];
        for (let i = 0; i < schools.length; i++) {
            let thisSchoolClasses = objKeysClass.filter(
                thisClass => thisClass.includes(`school${i + 1}`)
            );
            for (aClass of thisSchoolClasses) {
                let lvl = req.body[aClass][1].split("-"); // ex. return [ "Ensino Fundamental ", " 6º ano" ]
                classesList.push(
                    {
                        schoolId: schools[i].id, // ASSOCIATE CLASSES TO A SCHOOL
                        code: req.body[aClass][2],
                        year: req.body[aClass][0],
                        levelOfEducation: lvl[0].trim(),
                        grade: lvl[1].trim()
                    }
                );
            };
        };
        const classes = await Class.bulkCreate(classesList);

        // CREATE COURSES
        const objKeysSubjects = Object.keys(req.body).filter( // ex. return [ "subjects-class1-school1", "subjects-class2-school1", "subjects-class1-school2" ]
            key => key.substr(0, 8) == "subjects"
        );
        let coursesList = [];
        for (let i = 0; i < classes.length; i++) {
            let thisClassSubjectsKey = objKeysSubjects.filter(
                subjects => subjects.includes(`class${i + 1}`)
            );
            let thisClassSubjects = req.body[thisClassSubjectsKey]; // array containing the subjects ids of only one class

            for (subjectId of thisClassSubjects) {
                let course = await Course.create(
                    {
                        teacherId: teacher.id,
                        subjectId,
                        classId: classes[i].id
                    }
                );
                coursesList.push(course);
            }
        }

        // CREATE STUDENTS
        const objKeysStudent = Object.keys(req.body).filter( // ex. return [ "student1-class1-school1", "student2-class1-school1", "student1-class2-school1" ]
            key => key.substr(0, 7) == "student"
        );
        for (let i = 0; i < classes.length; i++) {
            let thisClassStudentsKeys = objKeysStudent.filter(
                student => student.includes(objKeysClass[i])
            );
            let thisClassStudents = []; // array of arrays like ["student class number", "student name", "checkbox on", "retaken course subjectId"]
            for (key of thisClassStudentsKeys) {
                thisClassStudents.push(req.body[key]);
            }
            for (student of thisClassStudents) { // array of arrays

                // VALIDATE STUDENTS
                let registeredStudent = await Student.findOne({ where: { name: student[1].trim() } });
                if (registeredStudent) {
                    return res.render("register-teacher", { errors: ["Cadastre novos alunos."] })
                }

                // CREATE STUDENTS
                let newStudent = await Student.create(
                    {
                        name: student[1].trim()
                    }
                );

                // ASSOCIATE STUDENT TO CLASS
                await Class_Student.create(
                    {
                        classId: classes[i].id,
                        studentId: newStudent.id,
                        number: student[0]
                    }
                );

                // CREATE REPEATER
                let repeater = false;
                if (student[2] == "on") { repeater = true; } // checkbox checked

                if (repeater) {
                    let thisClassCourses = coursesList.filter(
                        course => course.classId == classes[i].id
                    );
                    let coursesIdsList = [];

                    for (let j = 3; j < student.length; j++) { // from student[3], there's a list of subjects ids the student is repeating

                        for (course of thisClassCourses) {
                            if (course.subjectId == student[j]) {
                                coursesIdsList.push(course.id);
                            }
                        }
                    }
                    for (courseId of coursesIdsList) {
                        await Repeater.create(
                            {
                                studentId: newStudent.id,
                                courseId
                            }
                        );
                    }
                }
            }
        }
        // SET A SESSION FOR THE TEACHER USER
        req.session.user = user;
        // AND REDIRECT HOME
        return res.redirect("/professor/home");
    },
    renderAttendanceSheet: (req, res) => {
        return res.render("attendance");
    },
    recordAttendances: (req, res) => {

    },
    renderGradeBook: (req, res) => {
        return res.render("set-notes");
    },
    recordGrades: (req, res) => {

    },
    renderRecordBook: (req, res) => {
        return res.render('daily');
    },
    renderUpdateForm: async (req, res) => {
        // LOAD USER FROM DB
        // PASS OBJECT USER INTO RENDER METHOD
        return res.render("update-teacher");
    },
    updateTeacher: async (req, res, next) => {
        // GET REQ.BODY CONTENT
        // AND UPDATE DATA IN DB
        // const result = await User.update({
        //     // DATA TO UPDATE
        // },
        // {
        //     where: {
        //         id
        //     }
        // });
    },
    deleteTeacher: async (req, res) => {
        // RETRIEVE USER ID,
        // AND DELETE ONLY TEACHER USER TYPE
        // OR DELETE USER FROM DB
        // const result = await User.destroy(
        //     {
        //         where: {

        //         }
        //     }
        // );
    },
};