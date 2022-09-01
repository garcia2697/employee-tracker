const db = require('./db/connection');

const inquirer= require('inquirer');

const startPrompt =()=>{
    inquirer.prompt({
        name:'firstPrompt',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'View All Employees',
            'View All Roles',
            'View All Departments',
            'Add Employees',
            'Add Roles',
            'Add Departments',
            'Update Employee Role',
            'Exit'
        ]
    })
    .then(({firstPrompt})=>{
        if (firstPrompt === 'View All Employees') {
            viewAllEmployees()
        }
        else if(firstPrompt === 'View All Roles'){
            viewAllRoles()
        }
        else if(firstPrompt === 'View All Departments'){
            viewAllDept()
        }
        else if(firstPrompt === 'Add Departments'){
            AddDept()
        }
        else if(firstPrompt === 'Exit'){
            exit()
        }
        else if(firstPrompt === 'Add Roles'){
            AddRole()
        }
        else if(firstPrompt === 'Add Employees'){
            AddEmploy()
        }
        else if(firstPrompt === 'Update Employee Role'){
            update()
        }
        

    })
};


const startAgain=()=>{
    inquirer.prompt({
        name:'restart',
        type:'list',
        message:'Would you like to go back to the main menu',
        choices: [
            'Yes',
            'No'
        ]
    })
    .then(({restart})=>{
        if (restart === 'Yes') {
            startPrompt()
        }
        else if(restart === 'No'){
            exit()
        }
    })
}

const exit=()=> db.end();



// SELECT * FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id
// db.end() will end everything

// function calls SEL
const viewAllEmployees=()=>{
    db.query('SELECT * FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id', (err,res)=>{
        console.table(res)
        startAgain()
    });
    
};

const viewAllRoles=()=>{
    db.query('SELECT * FROM role', (err,res)=>{
        console.table(res)
        startAgain()
    });
};

const viewAllDept=()=>{
    db.query('SELECT * FROM department', (err,res)=>{
        console.table(res)
        startAgain()
    });
};

const AddDept=()=>{
    inquirer.prompt({
        name:'newDept',
        type: 'input',
        message: 'What department would you like to add?',
    })
    .then(({newDept})=>{
        db.query('INSERT INTO department SET?',{name:newDept});
        console.log('New department has been added')
        db.query('SELECT * FROM department', (err,res)=>{
            console.table(res)
            startAgain()
        });
    })
    
};

const AddRole =() =>{
    db.query('SELECT * FROM department',(err,res)=>{

    
        inquirer.prompt([
        {
            name:'newTitle',
            type: 'input',
            message: 'What role would you like to add?',
        },
        {
            name:'newSalary',
            type: 'number',
            message: 'What is the salary the new role makes?',
        },
        {
            name:'whichDepartment',
            type: 'list',
            message: 'What is department does the new role belong to?',
            choices: res.map((department)=>department.name)
        }
        ])
        .then(({newTitle,newSalary,whichDepartment})=>{
            res.map(userRes=>{
                if(userRes === whichDepartment){
                let newDeptID = userRes.id
                db.query('INSERT INTO role SET?',
                {
                    title:newTitle,
                    salary:newSalary,
                    department_id:newDeptID
                    });
                }
                
            })
            console.log('New role has been added')
            db.query('SELECT * FROM role', (err,res)=>{
                console.table(res)
                startAgain()
            });
        })
    });
};

const AddEmploy=()=>{
    db.query('SELECT * FROM role', (err,res)=>{
        inquirer.prompt([
        {
            name:'firstName',
            type: 'input',
            message: 'What is the employees first name?',
        },
        {
            name:'lastName',
            type: 'input',
            message: 'What is the employees last name?',
        },
        {
            name:'newEmployRole',
            type: 'list',
            message: 'What is the new employees role?',
            choices: res.map((role)=>role.title)
        }
        ])
        .then(({firstName,lastName,newEmployRole})=>{
            res.map(userRes=>{
                if(userRes === newEmployRole){
                   let newRoleID = userRes.id
                   db.query('INSERT INTO employee SET?',
                   {
                    first_name:firstName,
                    last_name:lastName,
                    role_id:newRoleID
                    });
                }
                
            })
            console.log('New employee has been added')
            db.query('SELECT * FROM employee', (err,res)=>{
                console.table(res)
                startAgain()
            });
        })   
    });
    
    
};

const update = () =>{
    startAgain()
}

startPrompt();

