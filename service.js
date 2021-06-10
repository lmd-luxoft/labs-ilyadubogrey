// поиск по имени, результат массив объектов employee
function findByName (name, surname)
{
    let results = []; 
    for (let employee of DATA.employees)
    {
        if ((!name || employee.name.toUpperCase() === name.toUpperCase()) && (!surname || employee.surname.toUpperCase() === surname.toUpperCase()))
        {
            results.push(employee);
        }
    } 
    return results;
}

// поиск по имени, результат массив ID employee
function findByNameID (name, surname)
{
    let results = []; 
    for (let employee of DATA.employees)
    {
        if ((!name || employee.name.toUpperCase() === name.toUpperCase()) && (!surname || employee.surname.toUpperCase() === surname.toUpperCase()))
        {
            results.push(employee.id);
        }
    } 
    return results;
}
 
// поиск по ID, результат объект employee / false
function findByID (id, showconsole = false)
{
    if (!id || !isNumber(id)) throw "Для поиска по ID должен быть числом"; 

    if (showconsole) console.log ('findByID '+id);

    for (let employee of DATA.employees)
    {
        if (showconsole) console.log ('findByID curid='+employee.id);
        
        if (employee.id === id)
        {
            return employee;
        }
    } 
    return false;
}

// поиск по имени, результат массив объектов employee
function findByPartName (name)
{
    let results = []; 
    for (let employee of DATA.employees)
    {
        if (!name || employee.name.toUpperCase().indexOf(name.toUpperCase())>=0 || employee.surname.toUpperCase().indexOf(name.toUpperCase())>=0)
        {
            results.push(employee);
        }
    } 
    return results;
}

// поиск по имени / фамилии / манагеру
function searchEmployees (name, surname, managerRef)
{ 
    let results = []; 
    for (let employee of DATA.employees) 
    { 
        if ((!name || employee.name.toUpperCase() === name.toUpperCase()) && (!surname || employee.surname.toUpperCase() === surname.toUpperCase()) && (!managerRef || employee.managerRef==managerRef)) { 
            results.push(employee); 
        } 
    } 
    return results; 
}

//Добавление сотрудника, throw при пустом имени/фамилии, департамент необязательный параметр, результат ID добавленного сотрудника
function addEmployee (name, surname, department='')
{
    let maxID = 0, curID = null;

    if (!name || name.length==0 || !surname || surname.length==0) 
    {
        throw "Имя и Фамилия сотрудника должны быть заполненны";
    }

    for (var employee of DATA.employees)
    {
        if (employee.id > maxID) maxID = employee.id; 
    }

    curID = maxID+1;
    DATA.employees.push({id: curID, name: name, surname: surname, department: department});

    return curID;
}

// проверка на число
function isNumber (value)
{
    if (!parseInt(value)) return false; 
    else return true;
}

//Удаление сотрудника по ID, возврат position при успехе, false если не найден
function DeleteEmployeeByID (id)
{ 
    if (!id || !isNumber(id)) throw "ID для удаления должен быть числом";
    
    let position = 0;
    for (var employee of DATA.employees)
    {
        if (employee.id === id) break;
        position++;
    }
    console.log (position);

    if (position >= 0) 
    {
        DATA.employees.splice (position, 1);
        return position; 
    }
    else return false; 
}

// отобразить сотрудника по ID или переданный объект
function showEmployee (employee) 
{
    let result = '', fields;

    if (typeof employee == 'object')
    {
        fields = Object.keys(employee);
    }
    else
    {
        if (typeof employee == 'number' && isNumber(employee))
        {
            employee = findByID (employee);
            if (employee)
                fields = Object.keys(employee);
            else throw "ID не найден";
        }
        else throw "Для отображения информации должен быть объектом или ID";
    }

    for (let k of fields)
    {
        result += (result.length>0?', ':'')+k+" = "+employee[k];
    }

    console.log (result);
}

// Отобразить всех сотрудников
function showEmployeesConsole() 
{
    for (var employee of DATA.employees)
    {
        showEmployee (employee);
    }
}

// Добавить телефон сотруднику, проверка на дубликат
function addPhone (id, phone) 
{
    let employee = findByID (id);
    let phones = employee.phones;
    if (!phones) 
    {
        employee.phones = [];
        employee.phones.push (phone);
        return true;
    }
    else
    {
        if (!phones.includes(phone))
        {
            employee.phones.push (phone);
            return true;
        }
    } 
    return false;
}

// Добавить Дату рождения
function setDateOfBirth (id, dateOfBirth) 
{
    let employee = findByID (id);
    employee.dateOfBirth = dateOfBirth;
}

// установить менеджера
function setEmployeeManager (id, managerId)
{
    let employee = findByID (id);
    employee.managerRef = managerId;
}

// получить возраст
function getAge (id) 
{
    let employee = findByID (id);
    if (!employee.dateOfBirth) throw "Нет даты рождения у сотрудника";

    let dateOfBirth = moment (employee.dateOfBirth);
    let now = moment(); 
    let age = now.diff (dateOfBirth, 'years');
    
    return age;
}

//форматирование вывода даты
function formatDate (date)
{
    return moment (date).format("DD MMMM YYYY")+' г.';
}

// получить строку отформатированную с данными сотрудника
function getEmployeeInfo (id) 
{
    let employee = findByID (id);

    return `
Имя: ${employee.name}
Фамилия: ${employee.surname}`+(employee.department?'\nДепартамент: '+employee.department:'')+(employee.dateOfBirth?'\nДата рождения: '+formatDate (employee.dateOfBirth):'')+
(employee.dateOfBirth?'\nВозраст: '+getAge (employee.id):'')+(employee.phones?'\nСписок телефонов: '+employee.phones:'');
}

// получить JSON строку сотрудника
function getEmployeeJSON (id) 
{
    let employee = findByID (id);
    return JSON.stringify (employee);
}

// тестирование функционала
function testEmployee ()
{
    let newID = addEmployee ("Петров", "Баширов", "KGB");
    addPhone (newID, "+79780792208");
    addPhone (newID, "+79780791208");
    setDateOfBirth (newID, moment("23.02.1976", "DD.MM.YYYY").valueOf());
    console.log (getEmployeeInfo (newID));
    console.log (getEmployeeJSON (newID));
    
}