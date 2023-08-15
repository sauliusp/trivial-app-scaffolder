#! usr/bin/env node 
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const file = (0, fs_1.createReadStream)(__filename);
file.pipe(process.stdout);
