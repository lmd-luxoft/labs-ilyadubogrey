import { DATA } from './employees-json.js';
import {DeleteEmployeeByID, setEmployeeManager, searchEmployees, addEmployee, setDateOfBirth, findByID, showEmployeesConsole} from './service.js'
import moment from 'moment';

const PLACEHOLDER = 'employeesPlaceholder'; // плейсхолдер список сотрудников 

const tool_buttons = Array('button-user-add', 'button-user-view', 'button-user-edit', 'button-user-search');
const tool_widgets = Array('widget-user-add', 'widget-user-view', 'widget-user-edit', 'widget-user-search');

//очистка плейсхолдера для списка
function clearEmployeesPlaceholder() 
{
    document.getElementById(PLACEHOLDER).innerHTML = '';
}

// отобразить список сотрудников
function showEmployees(employees, searchFl = false) 
{
    clearEmployeesPlaceholder();
    const ul = document.createElement("ul")
    ul.classList.add("list-group");
    ul.classList.add("employees");
    let count_empl = 0;
    for (let employee of employees)
    {
        let managerHTML = ""; 
        const managerSel = document.createElement("select");
        managerSel.className = 'form-select form-select-sm employees--item-select';
        managerSel.addEventListener('click', (event) => { event.stopPropagation(); });
        managerSel.addEventListener('change', (event) => { let managerRef = event.target.value - 0; setEmployeeManager(employee.id, managerRef); showEmployees(DATA.employees); event.stopPropagation(); });
        if (employee.managerRef > 0) 
        { 
            let manager = findByID(employee.managerRef); 
            console.log (manager);
            managerHTML = "<small class='employees--item-manager'>" + manager.name + " " + manager.surname + "</small>";
            fillSelect (managerSel, getEmployeesOptions(employee.id), employee.managerRef); 
        }
        else 
        {
            fillSelect (managerSel, getEmployeesOptions(employee.id)); 
        }

        const li = document.createElement("li");
        li.classList.add("list-group-item");
        li.classList.add("employees--item"); 
        ul.appendChild(li);
        li.innerHTML = employee.name+" "+employee.surname + managerHTML;
        li.addEventListener('click', 
            (event) => { showEmployeeUI(employee); event.preventDefault(); event.stopPropagation(); }); 
        li.innerHTML = employee.name+" "+employee.surname+managerHTML;
        li.appendChild(managerSel);
        
        let editButton = document.createElement("button");
        editButton.className = 'btn btn-sm btn-outline-success employees--item-edit'
        editButton.innerHTML = '<i class="bi bi-pencil"></i>'; 
        editButton.addEventListener('click', 
            (event) => { editEmployeeUI(employee); event.preventDefault(); event.stopPropagation(); }); 
        li.appendChild(editButton);

        let removeButton = document.createElement("button");
        removeButton.className = 'btn btn-sm btn-outline-danger employees--item-delete'
        removeButton.innerHTML = '<i class="bi bi-person-dash"></i>'; 
        removeButton.addEventListener('click', 
            (event) => { removeEmployeeUI(employee.id); event.preventDefault(); event.stopPropagation(); }); 
        li.appendChild(removeButton); 

        count_empl++;
    }
    if (searchFl)
    {
        document.getElementById(PLACEHOLDER).innerHTML = "<h4>Результаты поиска</h4>";
        if (count_empl == 0)
        {
            document.getElementById(PLACEHOLDER).innerHTML += '<div class="alert alert-warning" role="alert">По заданным критериям поиска сотрудников не найденно</div>';
        }
    }
    document.getElementById(PLACEHOLDER).appendChild(ul);
}

//отображение
function showEmployeeUI (employee)
{
    hideWidgets ();
    document.getElementById('widget-userview-title').innerHTML = employee.name+' '+employee.surname;

    let managerHTML = ''; 
    if (employee.managerRef) 
    { 
        let manager = findByID(employee.managerRef); 
        managerHTML = '<div class="col-12 col-md-5"><b>Менеджер:</b></div><div class="col-12 col-md-7">' + manager.name + " " + manager.surname + "</div>"; 
    }

    let EmployeeHTML = (employee.department?'<div class="col-12 col-md-5"><b>Департамент:</b></div><div class="col-12 col-md-7">'+employee.department+'</div>':'')+
    (employee.dateOfBirth?'<div class="col-12 col-md-5"><b>Дата рождения:</b></div><div class="col-12 col-md-7">'+formatDate (employee.dateOfBirth)+'</div>':'')+
    (employee.dateOfBirth?'<div class="col-12 col-md-5"><b>Возраст:</b></div><div class="col-12 col-md-7">'+getAge (employee.id)+'</div>':'')+
    (employee.phones?'<div class="col-12 col-md-5"><b>Список телефонов:</b></div><div class="col-12 col-md-7">'+employee.phones+'</div>':'')+
    (employee.managerRef?managerHTML:'');
    
    document.getElementById('widget-userview-list').innerHTML = EmployeeHTML;

    document.getElementById(tool_widgets[1]).classList.remove ('d-none');
} 

// редактировать сотрудника
function editEmployeeUI (employee)
{
    hideWidgets ();
    document.getElementById('widget-useredit-title').innerHTML = 'Редактировать: '+employee.name+' '+employee.surname;
    document.getElementById('edit-id').value = employee.id; 
    document.getElementById('edit-name').value = employee.name;
    document.getElementById('edit-surname').value = employee.surname;
    if (employee.dateOfBirth) document.getElementById('edit-birthdate').value = moment(employee.dateOfBirth).format("DD.MM.YYYY");
    else document.getElementById('edit-birthdate').value = '';

    let managerSelect = document.getElementById("edit-managerSelect");
    managerSelect.innerHTML = '';
    fillSelect(managerSelect, getEmployeesOptions(employee.id), employee.managerRef);

    document.getElementById(tool_widgets[2]).classList.remove ('d-none');
}

// удаление 
function removeEmployeeUI (id)
{ 
    console.log ('removeEmployeeUI '+id);
    DeleteEmployeeByID (id); 
    showEmployees (DATA.employees); 
}

//функция заполнения списка
function fillSelect (select, values, selectedValue) 
{ 
    for (let val of values)
    { 
        let option = document.createElement("option"); 
        option.text = val.text; 
        option.value = val.value; 
        if (selectedValue == option.value) option.selected=true; 
        select.appendChild (option); 
    } 
}

//массив пользователей для селектов
function getEmployeesOptions (excludeID = -1)
{ 
    let options = [{text:'', value:0}]; 
    for (let employee of DATA.employees)
    {
        if (excludeID && employee.id == excludeID) continue;
        options.push({text:employee.name+' '+employee.surname, value:employee.id}); 
    } 
    return options; 
}

// toolbar 
for (let i = 0; i < tool_buttons.length; i++)
{
    document.getElementById(tool_buttons[i]).addEventListener('click', function() 
    {
        hideWidgets ();
        
        this.classList.toggle('active');
        document.getElementById(tool_widgets[i]).classList.toggle('d-none');

        if (i == 0)
        {
            let managerSelect = document.getElementById("managerSelect");
            managerSelect.innerHTML = '';
            fillSelect(managerSelect, getEmployeesOptions()); 
        }
        if (i == 3)
        {
            let managerSelect = document.getElementById("search-managerSelect");
            managerSelect.innerHTML = '';
            fillSelect(managerSelect, getEmployeesOptions()); 
        }
    });
}

// toolbar скрыть всё
function hideWidgets ()
{
    for (let i = 0; i < tool_buttons.length; i++)
    {
        document.getElementById(tool_buttons[i]).classList.remove ('active');
        document.getElementById(tool_widgets[i]).classList.add ('d-none');
    }
}

//Добавить сотрудника
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
        let managerId = document.getElementById("managerSelect").value; 
        setEmployeeManager(newID, managerId);

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

//Сохранить сотрудника после редактирования
document.getElementById("form-user-edit").addEventListener('submit', function (event)
{
    let hasEror = false; 
    event.preventDefault();
    event.stopPropagation();

    let name_input = document.getElementById("edit-name");
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

    let surname_input = document.getElementById("edit-surname");
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

    let birthdate_input = document.getElementById("edit-birthdate");
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
        let editID = document.getElementById("edit-id").value - 0;
        let employee = findByID (editID);
        employee.name = name;
        employee.surname = surname;
        setDateOfBirth (editID, moment(birthdate, "DD.MM.YYYY").valueOf());
        console.log ('сохраняем '+editID+' '+employee);
        let managerId = document.getElementById("edit-managerSelect").value - 0;
        if (managerId > 0)
        {
            setEmployeeManager(editID, managerId);
        }
        else
        {
            if (employee.managerRef) employee.managerRef.remove;
        }

        name_input.value = "";
        surname_input.value = "";
        birthdate_input.value = "";
        name_input.classList.remove("is-valid");
        surname_input.classList.remove("is-valid");
        birthdate_input.classList.remove("is-valid");
        showEmployeesConsole();
        hideWidgets ();
        showEmployees(DATA.employees);
    }
    return false;
});

//поиск
document.getElementById("form-user-search").addEventListener('submit', function (event)
{
    event.preventDefault();
    event.stopPropagation();

    let name = document.getElementById("search-name").value; 
    let surname = document.getElementById("search-surname").value; 
    let managerRef = document.getElementById("search-managerSelect").value - 0; 
 
    const employees  = searchEmployees(name, surname, managerRef); 
    showEmployees(employees, true);   

    return false;
});

//reset формы поиска
document.getElementById("form-user-search").addEventListener('reset', function (event)
{ 
    event.preventDefault();
    event.stopPropagation();
    
    document.getElementById("search-name").value = '';
    document.getElementById("search-surname").value = '';
    let managerSelect = document.getElementById("search-managerSelect");
    managerSelect.innerHTML = '';
    fillSelect(managerSelect, getEmployeesOptions());
    console.log ('reset');

    showEmployees(DATA.employees);
});

// инициализирующая функция
export function runUI()
{
    showEmployees(DATA.employees);
}