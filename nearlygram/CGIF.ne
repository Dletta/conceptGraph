CG -> (Concept | Relation | To | From):+ {% function(d){
  return {type: 'axiom', data:d[0]};
  } %}
Concept  -> "["  Label  (":"  Referent):?  "]" {% function(d){
  var test = {};
  test.label = d[1];
  test.type = 'concept';
  if(d[2]){
    test.ref = d[2][1];
  }
  return test;
  }%}
Relation -> "(" Label ")" {% function(d) {
  return {type:d[1]};
  } %}
To -> "->" {% function(d) {
  return {type:'to'};
  } %}
From -> "<-" {% function(d) {
  return {type:'from'};
  } %}
Label    -> Letter:+ {% (d,l,f)=> d[0].join('')%}
Referent -> Mixed:+  {% (d,l,f)=> d[0].join('')%}
Letter   -> [a-zA-Z]
Mixed    -> [a-zA-Z0-9]
