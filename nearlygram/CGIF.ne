CG         -> Label "::" ( Concept | Relation ):+ {% function(d){
  return {type: 'axiom', label: d[0], data:d[2]};
  } %}
Concept    -> "["  Label  (":"  Referent):?  identifier ("(" Val ")"):? "]" {% function(d){
  var con = {};
  con.label = d[1];
  con.type = 'concept';
  if(d[2]){
    con.referent = d[2][1];
  }
  con.identifier = d[3];
  if(d[4]){
    con.fuzzy = parseFloat(d[4][1]);
  }
  return con;
  }%}
identifier -> ("*" Letter) {% (d)=> d[0].join('')%}
Relation   -> "(" Label Arc:+ ")" {% function(d) {
  return {label:d[1], type:'relation', arcI:d[2]};
  } %}
Arc        -> ("?" Letter) {% (d)=> d[0].join('')%}
Label      -> Letter:+ {% (d)=> d[0].join('')%}
Referent   -> Mixed:+  {% (d)=> d[0].join('')%}
Val        -> Fuzzy:+ {% (d)=> d[0].join('')%}
Letter     -> [ a-zA-Z]
Mixed      -> [ a-zA-Z0-9*]
Fuzzy      -> [+-.0-9*]
#add support for rules
