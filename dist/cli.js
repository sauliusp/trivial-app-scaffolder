#!/usr/bin/env node
import inquirer from 'inquirer';
import { DirectoryStructureType } from "./types/DirectoryStructureType.js";
const run = async () => {
    try {
        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'directoryStructure',
                message: 'What type of directory structure do you want?',
                choices: Object.values(DirectoryStructureType),
            },
        ]);
    }
    catch (error) {
        console.error(error);
    }
};
run();
