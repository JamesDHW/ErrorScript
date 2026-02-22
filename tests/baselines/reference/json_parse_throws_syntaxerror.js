//// [tests/cases/compiler/checkedErrors/stdlib/json_parse_throws_syntaxerror.ts] ////

//// [json_parse_throws_syntaxerror.ts]
JSON.parse("{");


//// [json_parse_throws_syntaxerror.js]
"use strict";
JSON.parse("{");
