import { validateProjectName } from './utils/validate_project_name.js';
import { DirectoryStructureType } from '../types/DirectoryStructureType.js';
import { QuestionCollection } from 'inquirer';
import { PromptAnswerMap } from '../types/PromptAnswerMap.js';

export const promptQuestions: QuestionCollection<PromptAnswerMap> = [
  {
    type: 'input',
    name: 'projectName',
    message: 'What should the project directory be called?',
    default: 'MyNewProject',
    filter: (input: string) => validateProjectName(input),
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
      },
    ],
  },
];
