//import mysql2 package
const mysql = require('mysql2');
//import console table
const cTable = require('console.table');
//import inquirer package for prompts
const inquirer = require('inquirer');



//================== Create Connection to MySQL database ==================
// create connection to the database (db)
const db = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'bootcamp1',
        database: 'tracker'
});
// open the MySQL connection
db.connect(function(err) {
    if (err) throw err;
    console.log('Connected to the tracker database!');
    menuOptions(); //start the menu options prompt
});
//================== ==================
//start app & given options to view all departments, roles, or employees; add a department, role, or employee; update an employee role  
const menuOptions = () => {
    inquirer
    .prompt ([
        {
            type: 'list',
            name: 'menu',
            message: 'Choose menu option:',
            choices: [
                'view all departments',
                'view all roles',
                'view all employees',
                'add a department',
                'add a role',
                'add an employee',
                'update an employee role',
                'exit (view all final tables)'
            ],
        }
    ])
    .then(answers => {
            //view all departments
            if (answers.menu === 'view all departments') {
                console.log("departments"); //placeholder for function
                viewDepartments();
            };
            if (answers.menu === 'view all roles') {
                console.log("view roles"); //placeholder for function
                viewRoles();
            };
            if (answers.menu  === 'view all employees') {
                console.log("view employees"); //placeholder for function
                viewEmployees();
            };
            if (answers.menu === 'add a department') {
                console.log("add department"); //placeholder for function
                addDepartment();
            };
            if (answers.menu === 'add a role') {
                console.log("add role"); //placeholder for function
                addRole();
            };
            if (answers.menu === 'add an employee') {
                console.log("add employee"); //placeholder for function
                addEmployee();
            };
            if (answers.menu === 'update an employee role') {
                console.log('update employee role'); //placeholder for function
                updateEmployee();
            };
            if (answers.menu === 'exit (view all final tables)') {
                console.log('application exited');
                viewExit();
            };
        })
    .catch((err) => {
        if (err) throw err;
    });
};
// ========================= view departments ========================= 
// choose view departments -> given formatted table showing deparment names & ids
const viewDepartments = () => {
    // department table -> department name
    // role table -> department id
    // both tables share "id"
    const sql =  
    `   SELECT department_name AS Departments, department_id AS DepartmentID
        FROM department
        INNER JOIN role
        ON department.id = role.id; 
    `; 
    
    db.query(sql, (err, data) => {
        if (err) throw err;
        console.table(data); //displays the table in the console
        console.log('Viewing all departments!');
        //return to menu options
        menuOptions();
    });
};
// ========================= view roles =========================
// choose view roles -> given job title, role id, department of role, salary for role
// role table: title, salary
// department of role -> get from role->department_id --> department->department_name
// employee table: role_id
const viewRoles = () => {
    const sql =  
    `   SELECT title, role_id, department_name, salary
        FROM role
        INNER JOIN employee
        ON employee.id = role.id
        INNER JOIN department
        ON department.id = role.id;
    `; 
    
    db.query(sql, (err, data) => {
        if (err) throw err;
        console.table(data); //displays the table in the console
        console.log('Viewing all roles!');
        //return to menu options
        menuOptions();
    });
};
// ========================= view employees =========================
// choose view employees -> given table showing employee data (ids, first & last names, job title, deparments, salaries, and their managers)
const viewEmployees = () => {
    // employee table: ids, names, 
    // role table: title, salary
    // department table: department, manager
    const sql =  
    `   SELECT employee.id, first_name, last_name, title, department_name, salary, manager_id
        FROM employee
        INNER JOIN role
        ON role.id = employee.id
        INNER JOIN department
        ON department.id = employee.id;
    `; 
    
    db.query(sql, (err, data) => {
        if (err) throw err;
        console.table(data); //displays the table in the console
        console.log('Viewing all employees!');
        //return to menu options
        menuOptions();
    });
};

// ========================= add departments =========================
// choose add department --> prompted to enter name of department & it's added to database
const addDepartment = () => {
    // prompt user to enter the name of the department
    inquirer.prompt([
        {
            type: 'input',
            name: 'add',
            message: 'What is the name of the deparment?'
        }
    ])
    .then (answer => {
        const sql = `INSERT INTO department (department_name) VALUES (?)`; //prepared statement
        db.query(sql, answer.add, (err, res) => {
            if (err) throw err;
            console.log(`Added new department: ${answer.add}`);
            viewAddedDepartment();
        });
        const viewAddedDepartment = () => {
            const sql =  
            `   SELECT * FROM department;
            `; 
            
            db.query(sql, (err, data) => {
                if (err) throw err;
                console.table(data); //displays the table in the console
                console.log('Viewing added department!');
                //return to menu options
                menuOptions();
            });
        }
    });
};

// ========================= add roles =========================
// choose add role -> prompted to enter name, salary, department of role and role is added to db
const addRole = () => {
    // prompt user to enter the name of the department
    inquirer.prompt([
        {
            type: 'input',
            name: 'role',
            message: 'What is the name of the new role?'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary of the new role?'
        },
        {
            type: 'input',
            name: 'department',
            message: 'What is the department id of the new role?'
        },
    ])
    .then (answer => {
        const params = [answer.role, answer.salary, answer.department];
        const sql = `INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`; //prepared statement
        db.query(sql, params , (err, res) => {
            if (err) throw err;
            console.log(`Added new role: ${answer.role}`);
            viewAddedRole();
        });
        const viewAddedRole = () => {
            const sql =  
            `   SELECT *
                FROM role;
            `; 
                
            db.query(sql, (err, data) => {
                if (err) throw err;
                console.table(data); //displays the table in the console
                console.log('Viewing added role!');
                //return to menu options
                menuOptions();
            });
        }
        });
};

// ========================= add employee =========================
// choose add employee -> prompted to enter their 1st & last name, role, manager & then employee is added to db
const addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'first',
            message: 'What is the first name of the employee?'
        },
        {
            type: 'input',
            name: 'last',
            message: 'What is the last name of the employee?'
        },
        {
            type: 'input',
            name: 'role',
            message: 'What is the role id (usually 5 digits) of the employee?'
        },
        {
            type: 'input',
            name: 'manager',
            message: 'What is the manager id (usually 2 digits) for the employee?'
        },
    ])
    .then(answer => {
        const params = [answer.first, answer.last, answer.role, answer.manager];
        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
        db.query(sql, params , (err, res) => {
            if (err) throw err;
            console.log(`Added new employee: ${answer.first}`);
            viewAddedEmployee();
        });
        const viewAddedEmployee = () => {
            const sql = `SELECT * FROM employee`;
            db.query(sql, (err, res) => {
                console.table(res);
                console.log('Viewing added employee!');
                console.log('\n');
                menuOptions(); 
            });
        };
    });
};

// ========================= update employee role =========================
// choose update employee role -> prompted to select employee to update & their new role & this info is updated in the db
const updateEmployee = () => {
    //first show list of employees available to update
    const sqlEmployeeList = `SELECT CONCAT (first_name, ' ', last_name) AS 'name', id FROM employee`;
    db.query(sqlEmployeeList, (err, res) => {
        console.log(res);
        //response returned as an array with objects [{ name: 'Hermonine Granger', id: 1 }, { name: 'Harry Potter', id: 2 }]
        //ititerate thru this array to get out a list of employee names
        let employeeList = []; //array that will hold the list of employees
        for (let i = 0; i < res.length; i++) {
            const idList = res[i].id;
            employeeList.push(idList);
        };
        inquirer.prompt([
            {
                type: 'list',
                name: 'single',
                message: 'Choose the employee id you wanted updated (employee names and ids listed above)',
                choices: employeeList
            },
            {
                type: 'input',
                name: 'newRole',
                message: 'What is role id of the new role?'
            }
        ])
        .then(answer => {
            //need to get id # out of response
            let chosenEmployee = answer.single;
            let chosenRole = answer.newRole;
            const updateRole = `UPDATE employee SET ? WHERE ?`;
            const updateValues = [{role_id: chosenRole}, {id: chosenEmployee}];
            db.query(updateRole, updateValues, (err, res) => {
                if (err) throw err;
                console.log('Employee role has been updated!');
                updatedRoleTable();
            });
            //display updated role in table
            const updatedRoleTable = () => {
                const sqlRole = `SELECT * FROM employee`;
                db.query(sqlRole, (err, res) => {
                    console.table(res);
                    console.log('Viewing updated role in table!');
                    console.log('\n');
                    menuOptions(); 
                });
            };
        });
    });
};

const viewExit = () => {
    console.log('Database summary:');
    console.log('\n');
    const departmentSql = `SELECT * FROM department`;
    db.query(departmentSql, (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.table(res);
        console.log('\n');
    });
    const roleSql = `SELECT * FROM role`;
    db.query(roleSql, (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.table(res);
        console.log('\n');
    });
    const employeeSql = `SELECT * FROM employee`;
    db.query(employeeSql, (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.table(res);
        console.log('\n');
    });
};