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
*/


/* Given a query graph and a set of rules, named "Schemata" in Sowa's
*  Ontology.
*/

/*
* Find common projection between 2 graphs;
* @param {graph} graph1 - the one you care about
* @param {graph} graph2 - the one you want to check out
* @returns {graph} u - common projection, if none, returns undefined
*/


function projection(graph1, graph2) {
  let v = graph1;
  let w = graph2;
  console.log(`Comparing ${graph1.label} and ${graph2.label}`);
  let arr1 = graph1.concept;
  let arr2 = graph2.concept;
  var result = {name:graph2.label+'cP',concepts:[]}
  for(var i = 0; i<arr1.length;i++){
    console.log(`1looking at ${arr1[i].label}`);
    for(var j = 0; j<arr2.length; j++) {
      console.log(`2looking at ${arr2[j].label}`);
      if(arr1[i].label === arr2[j].label){
        result.concepts.push(arr2[j]);
      }
    }
  }
  if(result.concepts.length > 0) { //found something
    return result;
  } else { //nothing
    result = undefined;
    return result;
  }
}

/*
* Join two graphs on a common projection
* @param {graph} graph1 - to be joined to
* @param {graph} graph2 - to be joined from
* @param {object} join - common join information
* @transmutates graph 1 , so no return
*/

function join(graph1, graph2, join) {
  console.log(`joining`);
  console.log(graph1);
  console.log(graph2);
  //loop through the common join to identify the label of concept to be joined
  let i = 0;
  let l = join.concepts.length;
  for(i;i<l;i++){
    //find concept in each graph
    console.log('looking for:'+join.concepts[i].label);
    let concept1 = graph1.find(join.concepts[i].label)
    let concept2 = graph2.find(join.concepts[i].label)
    console.log('1');
    console.log(concept1);
    console.log('2');
    console.log(concept2);
    //find relation referencing uuid of concept in graph1
    //replace concept with concept from graph2 connect relation to said concept
    //making sure values stay in the new concept
    //loop again through
  }
  // get function from rule/graph2 add to graph1 with label
}

/*
* Find question marks and propagate to solution, using rule functions
* @param {graph} graph - graph to answer
* @returns {boolean} - true if no more question marks, false if unresolved
*/

function answer(graph) {
  //execute function in graph1 if label is concept of question mark
  return true;
}

/*
* Sort joins preferred by score, right now it's the more matching Concepts
* the more preferred it is for a join.
* @param {object} common1 - the one you care about
* @param {object} common2 - the one you want to check out
* @returns {number} - -1 to 1 depending on the length
*/

function preferred (common1, common2) {
  if(common1.concepts.length > common2.concepts.length) {
    return -1; //common1 needs to be ahead
  } else if (common1.concepts.length < common2.concepts.length) {
    return 1; //common2 needs to be ahead
  } else {
    return 0; //both the same, leave in order
  }
}

/*
* Algorithm C
* @constructor
* @param {graph} graph - the query graph
* @param {set of graphs} rules - the domain rules
* @return {graph} answer - answer graph for the query from the data
* Call method start.
*/

function algoC (graph, rules) {
  this.q = graph;
  this.w = graph;
  this.rules = rules.rules;
  this.listj = [];
  this.start = function() {
    var questions = [];
    var i = 0;
    var l = this.w.concept.length;
    for(i;i<l;i++){ //get concepts with question marks
      if(this.w.concept[i].value === "?") {
        questions.push(this.w.concept[i]);
      }
    }
    if(questions.length <= 0){ console.error('no questions defined');return; } // No questions asked
    //find common projections in the rules store
    for(var i =0; i<this.rules.length; i++) {
      let temp = projection(this.w,this.rules[i]); //temp = set of common projections
      console.log('found:'+temp);
      if(temp != undefined) { //if not undefined
        temp.index = i;
        this.listj.push(temp)
      }
    }
    this.listj.sort(preferred) //sort by preferred rule
    console.log('preferred');
    console.log(this.listj);
    //perform first join, then try to answer question mark.
    let v = this.listj.shift();
    console.log(v);
    console.log(v.index);
    join(this.w,this.rules[v.index],v);
    let ans = answer(this.w); //if we can answer, true
    if(ans){console.log(`Answer:${JSON.stringify(this.w)}`);return;}
    this.start()
  };
}
