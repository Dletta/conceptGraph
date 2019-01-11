// Generated automatically by nearley, version 2.16.0
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "CG$ebnf$1$subexpression$1", "symbols": ["Concept"]},
    {"name": "CG$ebnf$1$subexpression$1", "symbols": ["Relation"]},
    {"name": "CG$ebnf$1$subexpression$1", "symbols": ["To"]},
    {"name": "CG$ebnf$1$subexpression$1", "symbols": ["From"]},
    {"name": "CG$ebnf$1", "symbols": ["CG$ebnf$1$subexpression$1"]},
    {"name": "CG$ebnf$1$subexpression$2", "symbols": ["Concept"]},
    {"name": "CG$ebnf$1$subexpression$2", "symbols": ["Relation"]},
    {"name": "CG$ebnf$1$subexpression$2", "symbols": ["To"]},
    {"name": "CG$ebnf$1$subexpression$2", "symbols": ["From"]},
    {"name": "CG$ebnf$1", "symbols": ["CG$ebnf$1", "CG$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "CG", "symbols": ["CG$ebnf$1"], "postprocess":  function(d){
        return {type: 'axiom', data:d[0]};
        } },
    {"name": "Concept$ebnf$1$subexpression$1", "symbols": [{"literal":":"}, "Referent"]},
    {"name": "Concept$ebnf$1", "symbols": ["Concept$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "Concept$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Concept", "symbols": [{"literal":"["}, "Label", "Concept$ebnf$1", {"literal":"]"}], "postprocess":  function(d){
        var test = {};
        test.label = d[1];
        test.type = 'concept';
        if(d[2]){
          test.ref = d[2][1];
        }
        return test;
        }},
    {"name": "Relation", "symbols": [{"literal":"("}, "Label", {"literal":")"}], "postprocess":  function(d) {
        return {type:d[1]};
        } },
    {"name": "To$string$1", "symbols": [{"literal":"-"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "To", "symbols": ["To$string$1"], "postprocess":  function(d) {
        return {type:'to'};
        } },
    {"name": "From$string$1", "symbols": [{"literal":"<"}, {"literal":"-"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "From", "symbols": ["From$string$1"], "postprocess":  function(d) {
        return {type:'from'};
        } },
    {"name": "Label$ebnf$1", "symbols": ["Letter"]},
    {"name": "Label$ebnf$1", "symbols": ["Label$ebnf$1", "Letter"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Label", "symbols": ["Label$ebnf$1"], "postprocess": (d,l,f)=> d[0].join('')},
    {"name": "Referent$ebnf$1", "symbols": ["Mixed"]},
    {"name": "Referent$ebnf$1", "symbols": ["Referent$ebnf$1", "Mixed"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Referent", "symbols": ["Referent$ebnf$1"], "postprocess": (d,l,f)=> d[0].join('')},
    {"name": "Letter", "symbols": [/[a-zA-Z]/]},
    {"name": "Mixed", "symbols": [/[a-zA-Z0-9]/]}
]
  , ParserStart: "CG"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
