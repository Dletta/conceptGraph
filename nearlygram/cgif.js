// Generated automatically by nearley, version 2.16.0
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "Concept", "symbols": [{"literal":"["}, "Type", {"literal":"]"}]},
    {"name": "Type", "symbols": ["String"]},
    {"name": "String$ebnf$1", "symbols": [/[a-zA-z]/]},
    {"name": "String$ebnf$1", "symbols": ["String$ebnf$1", /[a-zA-z]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "String", "symbols": ["String$ebnf$1"], "postprocess": d => d[0].join('')}
]
  , ParserStart: "Concept"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
