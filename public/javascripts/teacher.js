const endpoint = "http://localhost:3000/api/";

let teacher;
let classes;
let course;
let lessons;

// NAV SELECTS
const schoolSelect = document.getElementById("school");
const classSelect = document.getElementById("class");
const subjectSelect = document.getElementById("subject");
const termSelect = document.getElementById("term");

// NAV BUTTONS
const btnAttendanceSheet = document.getElementById("btn-attendance-sheet"); // form btn
const btnGradebook = document.getElementById("btn-gradebook"); // form btn
const btnRecords = document.getElementById("btn-records"); // reports btn
const btnStatistics = document.getElementById("btn-statistics"); // reports btn
const btnContact = document.getElementById("btn-contact"); // contact btn

// MAINS
const mainHome = document.getElementById("home");
const mainAttendanceSheet = document.getElementById("attendance-sheet");

// MAINS' ELEMENTS

// MAIN HOME
const ulStudents = document.getElementById("ul-students");

// MAIN ATTENDANCE SHEET
const periodSelect = document.getElementById("periods"); // attendance-related
const tbodyAttendanceSheet = document.getElementById("tbody-attendance-sheet");

const checkboxEvaluationDay = document.getElementById("evaluation-day"); // new-evaluation-related
const sectionSetEvaluation = document.getElementById("set-evaluation");
const divEvaluationInfo = document.getElementById("evaluation-info");



window.addEventListener("load", () => fetchData());

schoolSelect.addEventListener("change",
    () => {
        disableNavReportsAndContactBtns(),
            disableNavFormsBtns(),
            populateClassSelect(),
            populateTermSelect()
    });
classSelect.addEventListener("change",
    () => {
        populateSubjectSelect(),
            listStudents()
    });
subjectSelect.addEventListener("change",
    () => {
        enableTermSelect(),
            enableNavReportsAndContactBtns(),
            fetchCourseAndLessons()
    });
termSelect.addEventListener("change",
    () => {
        enableNavFormsBtns();
    });


btnAttendanceSheet.addEventListener("click", () => populateAttendanceSheetWithStudents()); // form btn

periodSelect.addEventListener("change", () => populateAttendanceSheetWithMarks());
checkboxEvaluationDay.addEventListener("change", () => createEvaluation());







const fetchData = () => {
    const userId = document.getElementById("userId").value;
    fetch(`${endpoint}teacher/user/${userId}`)
        .then(res => res.json())
        .then(data => {
            teacher = data;
            classes = data.classes;
            populateSchoolSelect();
        })
        .catch(error => console.log(error))
};

const fetchCourseAndLessons = async () => {
    const teacherId = teacher.id;
    const subjectId = getSelectedOption(subjectSelect).value;
    const classId = getSelectedOption(classSelect).value;
    await fetch(`${endpoint}lessons/teacher/${teacherId}/subject/${subjectId}/class/${classId}`)
        .then(res => res.json())
        .then(course => {
            course = course;
            lessons = course.lessons;

            // ATTENDANCE SHEET NECESSARY DATA

            const input = document.createElement("input");
            input.type = "hidden";
            input.name = "courseId";
            input.value = course.id;
            input.required = true;

            const sectionLesson = periodSelect.parentNode.parentNode;
            sectionLesson.append(input);
        })
        .catch(error => console.log(error))
};





const sortSelect = (select) => {
    let tmpAry = new Array();
    for (let i = 0; i < select.options.length; i++) {
        tmpAry[i] = new Array();
        tmpAry[i][0] = select.options[i].text;
        tmpAry[i][1] = select.options[i].value;
    }
    tmpAry.sort();
    tmpAry = removeDuplicates(tmpAry);
    while (select.options.length > 0) {
        select.options[0] = null;
    }
    for (let i = 0; i < tmpAry.length; i++) {
        let opt = new Option(tmpAry[i][0], tmpAry[i][1]);
        select.options[i] = opt;
    }
    return;
};

const removeDuplicates = (arr) => {
    // OBS: arr == [ [option.text, option.value], [option.text, option.value] ]
    let uniqueOpts = []
    for (let i = 0; i < arr.length; i++) {
        if (i == 0) { uniqueOpts.push(arr[i]) } // because arr[i=0 - 1] == undefined
        else if (arr[i][0] != arr[i - 1][0]) { uniqueOpts.push(arr[i]); }
    }
    return uniqueOpts;
};

const getSelectedOption = (select) => {
    return select.options[select.selectedIndex];
};

const removeChildNodes = (elem) => {
    [...elem.childNodes].map(node => node.remove());
};

const setSelectTitle = (title, select) => {
    const option = document.createElement("option");
    option.innerText = title;
    option.disabled = true;
    if (select.options.length != 1) {
        option.selected = true;
    }
    select.prepend(option);
};

const createSelectOption = (value, innerText, select) => {
    const option = document.createElement("option");
    option.value = value;
    option.innerText = innerText;
    select.append(option);
};




const populateSchoolSelect = () => {

    classes.forEach(c => {
        createSelectOption(c.school.id, c.school.name, schoolSelect);
    });
    sortSelect(schoolSelect);

    setSelectTitle("Escola", schoolSelect);
    setSelectTitle("Disciplina", subjectSelect);
    setSelectTitle("Turma", classSelect);
    setSelectTitle("Etapa", termSelect);
}

const populateClassSelect = () => {
    const selectedSchool = getSelectedOption(schoolSelect);
    removeChildNodes(classSelect);
    removeChildNodes(ulStudents);
    if (subjectSelect.disabled == false) { // another school had already been selected
        removeChildNodes(subjectSelect);
        setSelectTitle("Disciplina", subjectSelect);
        subjectSelect.disabled = true;
        termSelect.disabled = true;
        disableNavReportsAndContactBtns();
    }

    classes.forEach(c => {
        if (selectedSchool.innerText == c.school.name) {
            createSelectOption(c.id, c.code, classSelect);
        }
    });
    if (classSelect.options.length < 2) { // there are many classes
        populateSubjectSelect();
        listStudents();
    }
    sortSelect(classSelect);
    setSelectTitle("Turma", classSelect);
    classSelect.disabled = false;
};

const populateSubjectSelect = () => {
    const selectedClass = getSelectedOption(classSelect);
    removeChildNodes(subjectSelect);
    classes.forEach(c => {
        if (selectedClass.value == c.id) {
            const subjects = c.subjects;
            subjects.forEach(s => {
                createSelectOption(s.id, s.name, subjectSelect);
            });
        }
    });
    if (subjectSelect.options.length > 1) { termSelect.disabled = true; }
    else {
        enableTermSelect();
        enableNavReportsAndContactBtns();
        fetchCourseAndLessons();
    }
    sortSelect(subjectSelect);
    setSelectTitle("Disciplina", subjectSelect);
    subjectSelect.disabled = false;
};

const populateTermSelect = () => {
    const selectedSchool = getSelectedOption(schoolSelect);
    removeChildNodes(termSelect);
    let yearDivision;
    classes.forEach(c => {
        if (selectedSchool.innerText == c.school.name) {
            const numberOfterms = c.school.academicTerms;
            yearDivision = numberOfterms == 3 ? "Trimestre" : "Bimestre";
            for (let i = 1; i <= numberOfterms; i++) {
                createSelectOption(i, `${i + "º " + yearDivision.toLowerCase()}`, termSelect);
            }
        }
    });
    sortSelect(termSelect);
    setSelectTitle(yearDivision, termSelect);
    termSelect.disabled = true;
};

const enableTermSelect = () => {
    termSelect.disabled = false;
};




const enableNavReportsAndContactBtns = () => {
    btnRecords.disabled = false;
    btnStatistics.disabled = false;
    btnContact.disabled = false;
};
const disableNavReportsAndContactBtns = () => {
    btnRecords.disabled = true;
    btnStatistics.disabled = true;
    btnContact.disabled = true;
};

const enableNavFormsBtns = () => {
    btnAttendanceSheet.disabled = false;
    btnGradebook.disabled = false;
};
const disableNavFormsBtns = () => {
    btnAttendanceSheet.disabled = true;
    btnGradebook.disabled = true;
};



/**************** 
    MAIN HOME
****************/

const listStudents = () => {
    const selectedClass = getSelectedOption(classSelect);
    removeChildNodes(ulStudents);
    classes.forEach(c => {
        if (c.code == selectedClass.value) {
            const students = c.students;
            students.forEach(student => {
                if (student.name) {
                    const li = document.createElement("li");
                    li.innerText = student.name;
                    ulStudents.append(li);
                }
            });
        }
    });
};



/**************************** 
    MAIN ATTENDANCE SHEET
****************************/

/**** ATTENDANCE ****/

const populateAttendanceSheetWithStudents = () => {

    mainHome.hidden = true;
    mainAttendanceSheet.hidden = false;

    if (btnAttendanceSheet.classList.contains("selected")) { return; }
    btnAttendanceSheet.classList.add("selected");

    const selectedClass = getSelectedOption(classSelect);
    removeChildNodes(tbodyAttendanceSheet);

    classes.forEach(c => {
        if (c.id == selectedClass.value) {
            const students = c.students;
            students.forEach(student => {
                if (student.name) {
                    const tr = document.createElement("tr");

                    const number = document.createElement("td");
                    number.className = "student-number";
                    number.innerText = student.number.number;

                    const name = document.createElement("td");
                    name.id = student.id;
                    name.className = "student-name";
                    name.innerText = student.name;

                    tbodyAttendanceSheet.append(tr);
                    tr.append(number, name);
                }
            });
        }
    });
};

const populateAttendanceSheetWithMarks = () => {

    const selected = getSelectedOption(periodSelect);
    const numberOfPeriods = selected.value;

    const rows = tbodyAttendanceSheet.childNodes;
    rows.forEach(row => {
        const tds = row.childNodes;
        if (tds.length == 3) {
            tds[2].remove();
        }
    });
    for (let student = 0; student < rows.length; student++) {

        const tdAttendanceCheck = document.createElement("td");
        tdAttendanceCheck.className = "attendance-check";
        rows[student].append(tdAttendanceCheck);

        const studentId = rows[student].childNodes[1].id;

        for (let period = 1; period <= numberOfPeriods; period++) {

            const divAttendanceCheck = document.createElement("div");
            divAttendanceCheck.className = "attendance-check";
            tdAttendanceCheck.append(divAttendanceCheck);

            const inputNameAttr = `attendance_student${studentId}-period${period}`;

            createAttendanceMark("present", "PRESENTE", inputNameAttr, "present", divAttendanceCheck);
            createAttendanceMark("absent", "FALTOU", inputNameAttr, "absent", divAttendanceCheck);
            createAttendanceMark("late", "ATRASADO", inputNameAttr, "late", divAttendanceCheck);
        }
    }

};

const createAttendanceMark = (className, innerText, name, value, divAttendanceCheck) => {
    const label = document.createElement("label");
    label.className = className;
    label.innerText = innerText;

    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = name;
    input.value = value;
    input.required = true;

    divAttendanceCheck.append(label);
    label.append(input);

    input.addEventListener("change", () => checkAttendance(input));
};

const checkAttendance = (input) => {

    const label = input.parentNode;
    const div = label.parentNode;

    if (input.checked) {
        [...div.childNodes].forEach(label => {
            label.hidden = true;
            label.childNodes[1].required = false; // hidden inputs cannot required
        });
        label.hidden = false;
        label.style.width = "36px";
        input.required = true;

        const text = label.innerText;
        label.innerText = text.charAt(0);
        label.append(input);

    } else {
        [...div.childNodes].forEach(label => label.hidden = false);
        label.style.width = "132px";

        const text = label.innerText;
        if (text == "P") {
            label.innerText = "PRESENTE";
            label.append(input);
        } else if (text == "F") {
            label.innerText = "FALTOU";
            label.append(input);
        } else if (text == "A") {
            label.innerText = "ATRASADO";
            label.append(input);
        }
    }
};

/**** NEW EVALUATION ****/

const createEvaluation = async () => {
    if (!checkboxEvaluationDay.checked) {
        sectionSetEvaluation.style.marginTop = "0";
        sectionSetEvaluation.style.marginBottom = "0";
        sectionSetEvaluation.style.backgroundColor = "";
        removeChildNodes(divEvaluationInfo);
    } else {
        let evaluationsCount = 0;
        const term = getSelectedOption(termSelect).value;
        lessons.forEach(lesson => {
            if (lesson.academicTerm == term && lesson.evaluations.length) {
                evaluationsCount++;
            }
        });
        sectionSetEvaluation.style.marginTop = "0.75rem";
        sectionSetEvaluation.style.marginBottom = "0.75rem";
        sectionSetEvaluation.style.backgroundColor = "#B6ECFD";

        /**** CREATE ELEMENTS ****/

        // EVALUATION TITLE
        const evalTitle = document.createElement("input");
        evalTitle.type = "text";
        evalTitle.name = "evaluation-title";
        evalTitle.className = "eval-data";
        evalTitle.value = `Aval. ${evaluationsCount + 1}`;
        evalTitle.required = true;

        // EVALUATION COLOR
        const colorBox = createColorBox();

        // EVALUATION TYPE
        const evalType = document.createElement("select");
        evalType.name = "evaluation-type";
        evalType.className = "eval-data";
        evalType.required = true;

        createSelectOption("Prova", "Prova", evalType);
        createSelectOption("Teste", "Teste", evalType);
        createSelectOption("Trabalho", "Trabalho", evalType);
        setSelectTitle("Tipo", evalType);

        // EVALUATION VALUE
        const evalValue = document.createElement("input");
        evalValue.type = "number";
        evalValue.name = "evaluation-value";
        evalValue.className = "eval-data";
        evalValue.min = "0.5";
        evalValue.step = "0.5";
        evalValue.placeholder = "Valor máx.";
        evalValue.required = true;

        /**** APPEND ELEMENTS ****/

        divEvaluationInfo.append(evalTitle, colorBox, evalType, evalValue);
    }
};

const createColorBox = () => {

    const colors = {
        blue: "#54A2EB", // selected by default
        pink: "#FF92AA", yellow: "#FAE155", violet: "#C979FB", orange: "#FFAC60", green: "#41E5AA"
    };

    // CREATE ELEMENTS
    const colorBox = document.createElement("div");
    colorBox.className = "eval-data";
    colorBox.id = "color-box"

    const evalColor = document.createElement("input");
    evalColor.type = "text";
    evalColor.name = "evaluation-color";
    evalColor.value = colors.blue;
    evalColor.hidden = true;
    evalColor.required = true;

    const selectedColor = document.createElement("div");
    selectedColor.id = "selected-color";
    selectedColor.style.backgroundColor = colors.blue;

    const colorPicker = document.createElement("div");
    colorPicker.id = "color-picker";
    colorPicker.hidden = true;

    for (color in colors) {
        createColorOption(colors[color], colorPicker, selectedColor, evalColor);
    }
    colorPicker.firstChild.classList.add("selected");

    // APPEND ELEMENTS
    colorBox.append(evalColor, selectedColor, colorPicker);
    // LISTEN TO EVENT
    colorBox.addEventListener("mousedown", () => toggleColorPicker(colorPicker));
    // RETURN
    return colorBox;
};

const createColorOption = (color, colorPicker, selectedColor, evalColor) => {
    const divColorOption = document.createElement("div");
    divColorOption.className = "color-option";
    divColorOption.style.backgroundColor = color;

    colorPicker.append(divColorOption);
    divColorOption.addEventListener("mousedown", () => selectColor(divColorOption, color, colorPicker, selectedColor, evalColor));
};

const selectColor = (divColorOption, color, colorPicker, selectedColor, evalColor) => {

    [...colorPicker.childNodes].forEach(div => {
        if (div.classList.contains("selected")) {
            div.classList.remove("selected");
        }
    });
    divColorOption.classList.add("selected");
    selectedColor.style.backgroundColor = color;
    evalColor.value = color;
};

const toggleColorPicker = (colorPicker) => {
    if (colorPicker.hidden) { colorPicker.hidden = false; }
    else { colorPicker.hidden = true; }
};