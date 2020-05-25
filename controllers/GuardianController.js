const { User, School, Subject, Student, Teacher, Guardian, Class, Course, Student_Guardian, Class_Student, Lesson, Attendance, Evaluation, Student_Evaluation, Repeater } = require("../models");
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
    renderHome: async (req, res) => {
        // GET GUARDIAN DATA FROM DB,
        // AND THEN...
        return res.render("guardian-home");
    },
    renderRegistrationForm: (req, res) => {
        res.render("register-guardian");
    },
    registerGuardian: async (req, res, next) => {

        // CREATE USER 
        const { forename, surname, email, phone, password } = req.bory;
        let picture = req.file ? req.file.name : null;

        const user = User.create({
            forename,
            surname,
            email,
            phone,
            password: bcrypt.hashSync(password, saltRounds),
            picture
        });

        // MAKE THE USER A GUARDIAN
        const guardian = await Guardian.create({ userId: user.id });

        const { selectState, selectCity } = req.body;

        // SCHOOL LIST
        const schools = await School.findAll({ where: { state: selectState, municipality: selectCity } });
        const school = req.body.selectSchool;

        // CLASS LIST
        const classes = await Class.findAll({ where: { schoolId: school.id } });
        const clas = req.body.selectClass;

        const classStudent = await Class_Student.findAll({ where: { classId: clas.id } });

        // STUDENT LIST
        const students = await Student.findAll({ where: { id: classStudent.studentId } });
        const selectStudent = req.body.selectStudent;
        const student = await Student.findOne({ where: { name: selectStudent } });

        // ASSOCIATE STUDENT TO GUARDIAN
        const student_guardian = await Student_Guardian.create({ studentId: student.id, guardianId: guardian.id });

        // SET A SESSION
        req.session.user = user;

        return res.redirect("/responsavel/home");
    },
    renderUpdateForm: async (req, res) => {

    },
    updateGuardian: async (req, res, next) => {
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
    deleteGuardian: async (req, res) => {
        // RETRIEVE USER ID,
        // AND DELETE ONLY GUARDIAN USER TYPE
        // OR DELETE USER FROM DB
        // const result = await User.destroy(
        //     {
        //         where: {

        //         }
        //     }
        // );
    }
};