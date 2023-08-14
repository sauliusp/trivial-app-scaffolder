#! usr/bin/env node 

import { createReadStream } from "fs";

const file = createReadStream(__filename);

file.pipe(process.stdout);