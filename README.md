# conceptGraph

Conceptual Graphs inspired by John F Sowa.

Create Concept Graphs and Schemas, that can call functions and access databases
to create answer graphs.

Best enjoyed with some white papers along side.


Theory straight from John F. Sowa's Paper titled
Conceptual Graphs for a Data Base Interface July 1976
All credit for the Theory of Conceptual Graphs goes to Sowa amongst many
other great minds before him, who believe in a better, more human-like
computer interaction. We truly stand on the shoulders of giants.


## Query Algorithm

Answer Graph Criterias to check for:
1.  w is a well formed CG
2.  w is true if the data base is correct
3.  The entire query graph q is covered by a join from w
4.  For every concept in q that has a value, the corresponding concept in w
     has the same value.
5.  For every concept in q that had a question mark, the corresponding
     concept in w has a value.

###  Algorithm A <Conceptual Graphs, pg.349>
- Start with the concepts on the query graph that are flagged with question
  marks;
- Join conceptual schemata to the graph so that the flagged concepts are covered
  by target concepts;
- Propagate the question marks backwards along the function links;
- Evaluate any functional dependencies whose source all have values;
- Repeat until the original question is answered.

### Algorithm B <Conceptual Graphs, pg.349>

- Every join of a new schema to the developing answer graph must at least
  cover one of the concepts in the original query graph'

### Algorithm C

```
  w: = q;
  while ( there is a preferred join j with w)  // seems to imply we have a list of joins
    do begin
      w: = result of performing j with w; //need function to do a join, also a score function
      while (there is a source conept a in w &&
            a does not have a value &&
            a does not have a question mark &&
            the target of a has a question mark)
        do place a question mark on a; //propagation
      while (there is a target concept b in w &&
             b has a question mark &&
             all sources of b have values)
        do get a value for b from it's access procedure (function); // reasoning
     if (there are no question marks left in w and all of q has been covered
         by some join)
         then begin:
          print answer; // result
          stop
          end
    end.
```

So as preparation of running a query through algorithm c we need to find
possible joins and rank them per explanation in paper.

Given a set of possible joins s1 ... sn, score each graph by
- One point for each concept in j that is the same as in w
- One point per concept that is in q (original query)
- If a question mark in w is covered by a target in j another point
- If a question mark is covering a source concept subtract one point
- If a concept in w, with a value is covered by source in a function link
add a point, if it is covered by a target, reject j.
- each concept or relation in q that has not been covered, if j covers it
add a point each

Also need to consider a function that can return true if something is  a subsort
of a specific concept type.

Also indices for each type of concept or target or source links, if performance
issues occur for searching the schematic universe.

prompting points (might not need this) are whenever it cannot find a join
but a question mark remains on a quant('A')

The join function:


>reference to concepts in common
>loop through join, giving you the concepts you want matching
>find concept person in graph2
>find concept2 of join in graph1 and graph2 and merge them together

