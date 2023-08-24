import { validateProjectName } from "./utils/validate_project_name.js";
import { DirectoryStructureType } from "../types/DirectoryStructureType.js";
export const promptQuestions = [
    {
        type: 'input',
        name: 'projectName',
        message: 'What should the project directory be called?',
        default: 'MyNewProject',
        filter: (input) => validateProjectName(input),
    },
    {
        type: 'list',
        name: 'directoryStructure',
        message: 'What type of directory structure do you want?',
        default: DirectoryStructureType.FeatureBased,
        choices: [
            {
                name: 'Atomic Design',
                value: DirectoryStructureType.AtomicDesign,
            },
            {
                name: 'Domain Driven Design',
                value: DirectoryStructureType.DomainDrivenDesign,
            },
            {
                name: 'Feature Based',
                value: DirectoryStructureType.FeatureBased,
            },
            {
                name: 'Layered Architecture',
                value: DirectoryStructureType.LayeredArchitecture,
            },
            {
                name: 'Modal View Controller',
                value: DirectoryStructureType.ModalViewController,
            }
        ],
    },
];
