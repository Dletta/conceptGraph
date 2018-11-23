/*
Theory straight from John F. Sowa's Paper titled
 Conceptual Graphs for a Data Base Interface July 1976
 All credit for the Theory of Conceptual Graphs goes to Sowa amongst many
 other great minds before him, who believe in a better, more human-like
 computer interaction. We truly stand on the shoulders of giants.
 

 Answer Graph Criterias to check for

 1 - w is a well formed CG
 2 - w is true if the data base is correct
 3 - The entire query graph q is covered by a join from w
 4 - For every concept in q that has a value, the corresponding concept in w
     has the same value.
 5 - For every concept in q that had a question mark, the corresponding
     concept in w has a value.

 Algorithm A

 ' Start with the concepts on the query graph that are flagged with question
  marks;
  join conceptual schemata to the graph so that the flagged concepts are covered
  by target concepts;
  propagate the question marks backwards along the function links;
  evaluate any functional dependencies whose source all have values;
  repeat until the original question is answered.
  '

  Algorithm B

  ' every join of a new schema to the developing answer graph must at least
  cover one of the concepts in the original query graph'

  Algorithm C

  w: = q;
  while ( there is a preferred join j with w)
    do begin
      w: = result of performing j with w;
      while (there is a source conept a in w &&
            a does not have a value &&
            a does not have a question mark &&
            the target of a has a question mark)
        do place a question mark on a;
      while (there is a target concept b in w &&
             b has a question mark &&
             all sources of b have values)
        do get a value for b from it's access procedure (function);
     if (there are no question marks left in w and all of q has been covered
         by some join)
         then begin:
          print answer;
          stop
          end
    end.
*/
