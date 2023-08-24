#!/usr/bin/env ts-node
import { join } from 'path';

import inquirer from 'inquirer';

import { DirectoryConfigFactory } from './engine/config.js';
import { DirectoryEngine } from './engine/engine.js';
import { promptQuestions } from './inquirer/questions.js';
import { PromptAnswerMap } from './types/PromptAnswerMap.js';

inquirer
  .prompt(promptQuestions)
  .then((result: PromptAnswerMap) => {
    const directoryStructureConfig = new DirectoryConfigFactory(
      result.directoryStructure
    );
    const engine = new DirectoryEngine(
      directoryStructureConfig.path,
      join(process.cwd(), result.projectName)
    );

    engine.run();
  })
  .catch((error: Error) => console.error(error));
