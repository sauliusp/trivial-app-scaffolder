const inquirer = require('inquirer');
export class InquirerFactory {
    static async create() {
        const questions = [
            {
                type: 'input',
                name: 'name',
                message: 'What is the name of your project?'
            },
            {
                type: 'list',
                name: 'structure',
                message: 'Choose the file structure for your project',
                choices: [
                    'Feature-based',
                    'Layer-based'
                ]
            },
            {
                type: 'confirm',
                name: 'confirm',
                message: 'Are you sure you want to continue?'
            }
        ];
        return await inquirer.prompt(questions);
    }
}
