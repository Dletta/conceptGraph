
/* Given a query graph and a set of axioms, named "Schemata" in Sowa's
*  Ontology.
*/

/*
* Extend graph by adding concepts and relations not found in 2nd graph
* @param {graph} target - to be extended
* @param {graph} source - to be taken from
* mutate @param Target
*/
function extendGraph(target, source){
  //if in graph ignore
  //if not in graph add into graph1
  var i = 0;
  var l = source.concept.length;
  for(i;i<l;i++){
    if(!target.find('label', source.concept[i].label)){
      target.addConcept(source.concept[i]);
    }
  }

  var i = 0;
  var l = source.relation.length;
  for(i;i<l;i++){
    if(!target.find('label', source.relation[i].label)){
      target.addRelation(source.relation[i]);
    }
  }

}

/*
* Find common projection between 2 graphs;
* @param {graph} graph1 - the one you care about
* @param {graph} graph2 - the one you want to check out
* @returns {graph} u - common projection, if none, returns undefined
*/

function projection(graph1, graph2) {
  let v = graph1;
  let w = graph2;
  let score = 0;
  let arr1 = graph1.concept;
  let arr2 = graph2.concept;
  var result = {name:graph2.label+'cP',concepts:[]}
  for(var i = 0; i<arr1.length;i++){
    for(var j = 0; j<arr2.length; j++) {
      if(arr1[i].label === arr2[j].label){
        score += 1;
        result.concepts.push(arr2[j]);
        if(arr1[i].value === "?"){
          score += 1;
        }
      }
    }
  }
  if(result.concepts.length > 0) { //found something
    result.score = score;
    return result;
  } else { //nothing
    result = undefined;
    return result;
  }
}

/*
* Join two graphs on a common projection.
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

    var concept = join.concepts[i];
    //find concept in each graph
    let concept1 = graph1.find('label',concept.label)
    let concept2 = graph2.find('label',concept.label)
    concept2.value = concept1.value;
    // "preserve graph1 values and relations, but merge graph2 concepts and functions"
    // "return all graph2 relations that were not merged - save into graph1"
    // pass in 'working graph' and receive back 'working graph joined at intersections with axiom'
    // relations uuid needs to move to graph2/concept that is equal to graph1/concept
    //  ^= delete graph1/concept aftermoving the value to graph2/concept

    // graph2 has an axiom, they have relations

    //find relation referencing uuid of concept in graph1
    //and replace with uuid of graph2 concept.
    for(var r = 0; r < graph1.relation.length; r++) {
      var relation = graph1.relation[r];
            //now set source or target (where you found graph1) to the uuid of graph2 concept
      var relationFound = mergeRelation(relation, concept1.uuid, concept2.uuid);
    }

    graph1.deleteConcept(concept1.uuid); 
    graph1.addConcept(concept2);

    //replace concept with concept from graph2 connect relation to said concept
    //making sure values stay in the new concept
    //loop again through
  }
  extendGraph(graph1, graph2);
  // get function from axiom/graph2 add to graph1 with label
  graph1.function = graph2.function;
  return graph1; //still missing all other concepts not merged from graph 2, need to add these before returning.
}

/*
* Find question marks and propagate to solution, using axiom functions
* @param {graph} graph - graph to answer
* @returns {boolean} - true if no more question marks, false if unresolved
*/

function answer(graph) {
  //execute function in graph1 if label is concept of question mark

  // go search for a question mark
  // is there a function in there that can give me a value for the question mark?
  // or... if there is an input you need = go into those question marks and go through that...
  // may need to execute algoC again to get new joins that will answer the question
  return true;
}

/*
* Sort joins preferred by score, right now it's the more matching Concepts
* the more preferred it is for a join plus points for concepts with question mark
* @param {object} common1 - the one you care about
* @param {object} common2 - the one you want to check out
* @returns {number} - -1 to 1 depending on the length
*/

function preferred (common1, common2) {
  if(common1.score > common2.score) {
    return -1; //common1 needs to be ahead
  } else if (common1.score < common2.score) {
    return 1; //common2 needs to be ahead
  } else {
    return 0; //both the same, leave in order
  }
}

/*
* Algorithm C
* @constructor
* @param {graph} graph - the query graph
* @param {set of graphs} axioms - the domain axioms
* @return {graph} answer - answer graph for the query from the data
* Call method start.
*/

function algoC (graph, axioms) {
  this.q = graph;
  this.w = graph;
  this.axioms = axioms.axioms;
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
    //find common projections in the axioms store
    for(var i =0; i<this.axioms.length; i++) {
      let temp = projection(this.w,this.axioms[i]); //temp = set of common projections
      if(temp != undefined) { //if not undefined
        temp.index = i;
        this.listj.push(temp)
      }
    }
    this.listj.sort(preferred) //sort by preferred axiom
    //perform first join, then try to answer question mark.
    let v = this.listj.shift();
    join(this.w,this.axioms[v.index],v);
    render(this.w, 'cont')
    let ans = answer(this.w); //if we can answer, true
    if(ans){console.log(this.w, 'theanswer');return;}
    this.start()
  };
}

