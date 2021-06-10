const PLACEHOLDER = 'employeesPlaceholder'; // плейсхолдер список сотрудников 

const tool_buttons = Array('button-user-add');
const tool_widgets = Array('widget-user-add');

//очистка плейсхолдера для списка
function clearEmployeesPlaceholder() 
{
    document.getElementById(PLACEHOLDER).innerHTML = '';
}

// отобразить список сотрудников
function showEmployees(employees) 
{
    clearEmployeesPlaceholder();
    const ul = document.createElement("ul")
    ul.classList.add("list-group");
    for (let employee of employees)
    {
        const li = document.createElement("li");
        li.classList.add("list-group-item"); 
        ul.appendChild(li);
        li.innerHTML = employee.name+" "+employee.surname;
    }
    document.getElementById(PLACEHOLDER).appendChild(ul);
}

// toolbar 
for (let i = 0; i < tool_buttons.length; i++)
{
    document.getElementById(tool_buttons[i]).addEventListener('click', function() 
    {
        this.classList.toggle('active');
        document.getElementById(tool_widgets[i]).classList.toggle('d-none');
    });
}

// 
document.getElementById("form-user-add").addEventListener('submit', function formUserSubmit (event)
{
    let hasEror = false; 
    event.preventDefault();
    event.stopPropagation();

    let name_input = document.getElementById("name");
    let name = name_input.value; 
    if (name == "") 
    { 
        hasEror = true;
        name_input.classList.remove("is-valid");
        name_input.classList.add("is-invalid");
        if (document.getElementById("nameError")) document.getElementById("nameError").remove();
        let errorText = document.createElement("div"); 
        errorText.classList.add("invalid-feedback");
        errorText.id = "nameError";
        errorText.innerHTML = "Имя должно быть заполнено";
        name_input.parentNode.append (errorText);
    }
    else
    {
        name_input.classList.remove("is-invalid");
        name_input.classList.add("is-valid");
        if (document.getElementById("nameError")) document.getElementById("nameError").remove();
    }

    let surname_input = document.getElementById("surname");
    let surname = surname_input.value; 
    if (surname == "") 
    { 
        hasEror = true;
        surname_input.classList.remove("is-valid");
        surname_input.classList.add("is-invalid");
        if (document.getElementById("surnameError")) document.getElementById("surnameError").remove();
        let errorText = document.createElement("div"); 
        errorText.classList.add("invalid-feedback");
        errorText.id = "surnameError";
        errorText.innerHTML = "Фамилия должна быть заполнена";
        surname_input.parentNode.append (errorText);
    }
    else
    {
        surname_input.classList.remove("is-invalid");
        surname_input.classList.add("is-valid");
        if (document.getElementById("surnameError")) document.getElementById("surnameError").remove();
    }

    let birthdate_input = document.getElementById("birthdate");
    let birthdate = birthdate_input.value; 
    if (birthdate == "") 
    { 
        hasEror = true;
        birthdate_input.classList.remove("is-valid");
        birthdate_input.classList.add("is-invalid");
        if (document.getElementById("birthdateError")) document.getElementById("birthdateError").remove();
        let errorText = document.createElement("div"); 
        errorText.classList.add("invalid-feedback");
        errorText.id = "birthdateError";
        errorText.innerHTML = "Дата рождения должна быть заполнена";
        birthdate_input.parentNode.append (errorText);
    }
    else
    {
        let result = birthdate.match(/^(0?[1-9]|[12][0-9]|3[01])[\/\-\.](0?[1-9]|1[012])[\/\-\.]\d{4}$/) || []; 
        if (result.length == 0 || !moment(birthdate, "DD.MM.YYYY").isValid()) 
        { 
            hasEror = true;
            birthdate_input.classList.remove("is-valid");
            birthdate_input.classList.add("is-invalid");
            if (document.getElementById("birthdateError")) document.getElementById("birthdateError").remove();
            let errorText = document.createElement("div"); 
            errorText.classList.add("invalid-feedback");
            errorText.id = "birthdateError";
            errorText.innerHTML = "Дата рождения заполненна с ошибкой";
            birthdate_input.parentNode.append (errorText);
        }
        else
        {
            birthdate_input.classList.remove("is-invalid");
            birthdate_input.classList.add("is-valid");
            if (document.getElementById("birthdateError")) document.getElementById("birthdateError").remove();
        }
    } 

    if (!hasEror)
    {
        let newID = addEmployee(name, surname);
        showEmployees(DATA.employees);
        setDateOfBirth (newID, moment(birthdate, "DD.MM.YYYY").valueOf());
        name_input.value = "";
        surname_input.value = "";
        birthdate_input.value = "";
        name_input.classList.remove("is-valid");
        surname_input.classList.remove("is-valid");
        birthdate_input.classList.remove("is-valid");
        showEmployeesConsole();
    }
    return false;
});

// инициализирующая функция
function runUI()
{
    showEmployees(DATA.employees);
}