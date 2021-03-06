/*
* Extend graph by adding concepts and relations not found in 2nd graph
* @param {graph} target - to be extended
* @param {graph} source - to be taken from
* mutate @param Target
*/
function extendGraph(target, source, rule){
  //if in graph ignore
  //if not in graph add into graph1
  console.log(rule);
  console.log('extend');
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

function projection(graph1, graph2, rule) {
  // add rule mode, where it only allows joining if the complete hypothesis is covered by projection
  // also no type restriction allowed for rules
  let v = Object.assign(new Thing(), graph1);
  console.log(v);
  let w = Object.assign(new Thing(), graph2);
  let score = 0;
  let arr1 = v.concept;
  let arr2 = w.concept;
  var result = {name:w.label+'cP',concepts:[]}
  for(var i = 0; i<arr1.length;i++){
    for(var j = 0; j<arr2.length; j++) {
      // is concept of the same type
      // and
      // if checkout is either universal quantifier or
      // if referent is the same in both graphs
      if(arr1[i].label === arr2[j].label &&
        (arr2[j].referent == '*' ||
        arr1[i].referent == arr2[j].referent)) {
        //if so we add a point to score
        score += 1;
        result.concepts.push(arr2[j]);
        // if this happens to be an answer to a question even better
        if(arr1[i].value === "?"){
          score += 1;
        }
      }
    }
  }
  if(rule){
    console.log('rule mode');
    // check if all of the condition is covered
    if(result.concepts.length < w.concept.length){
      console.log(result, 'does not satisfy Hypothesis');
      return;
    }
    // check if this is not a negation
    if(v.conConcept.length<=0 && v.conRelation.length<=0){
      return 'neg';
    }
    for(var i=0;i<v.conConcept.length;i++){
      result.concepts.push(v.conConcept[i]);
      v.addConcept(v.conConcept[i]);
    }
    for(var i=0;i<v.conRelation.length;i++){
      v.addRelation(v.conRelation[i]);
    }
  }

  if(result.concepts.length > 0) { //found something

    // To prevent thinking we can join two graphs that happened to have only
    // Concepts like born or go in common
    // check if result is only one and if only one, it should not be on a concept
    // such as Go or Walk (Referent undefined)

    // do we only have one candidate?
    if(result.concepts.length == 1) {
      // is it undefined (Go, Born, Own)
      if(!result.concepts[0].referent) {
        result = undefined;
        return result;
      }
    }
    result.score = score;
    console.log('result',result);
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

function join(graph1, graph2, join, rule) {

  //console.log(`joining`);
  if(rule) {
    for(let i=0;i<graph2.conRelation.length;i++){
      graph2.addRelation(graph2.conRelation[i])
    }
    for(let i=0;i<graph2.conConcept.length;i++){
      graph2.addConcept(graph2.conConcept[i])
    }
  }
  //console.log(graph1);
  //console.log(graph2);
  //loop through the common join to identify the label of concept to be joined
  let i = 0;
  let l = join.concepts.length;
  for(i;i<l;i++){

    var concept = join.concepts[i];
    //find concept in each graph
    let concept1 = graph1.find('label',concept.label)
    let concept2 = graph2.find('label',concept.label)
    if(concept2.value == '' || concept2.value == concept1.value || concept2.value == '*'){
      concept2.value = concept1.value;
    } else {
      console.error(`Cannot join ${concept1.label}:${concept1.value} with ${concept2.label}:${concept2.value}`);
    }

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
  extendGraph(graph1, graph2, rule);
  // get function from axiom/graph2 add to graph1 with label
  graph1.function = graph2.function;

  //console.log('after');
  //console.log(graph1.concept);
  //console.log(graph1.relation);
  //console.log(graph2.concept);
  //console.log(graph2.relation);

  return graph1;
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

/**** ToDo ****/
/* Two Major things need fixing.
- Either we remove graphs from the list of available graphs or <-- need to do this.
- We do not merge to graphs that are exactly the same as we are.
*/

function GOper (graph, axioms, mode) {
  //Make a copy of graph not a reference
  this.q = Object.assign(new Thing(),graph);
  //Make a copy of graph not a reference
  this.w = Object.assign(new Thing(),graph);
  this.mode = mode | 'schema';
  this.axioms = axioms.axioms;
  this.listj = [];
  this.start = function() {
    //render(this.q);
    if(mode == 'law'){var rule = true};
    if(mode == 'ask') {
      var questions = [];
      var i = 0;
      var l = this.w.concept.length;
      for(i;i<l;i++){ //get concepts with question marks
        if(this.w.concept[i].value === "?") {
          questions.push(this.w.concept[i]);
        }
      }
      if(questions.length <= 0){ console.error('no questions defined');} // No questions asked
    }
    //find common projections in the axioms store
    //If in rule mode only allow joins that fully cover the hypothesis of the rule
    for(var i =0; i<this.axioms.length; i++) {
      let temp = projection(this.w, this.axioms[i], rule); //temp = set of common projections
      if(temp == 'neg'){
        this.w.neg = true;
        return this.w; //negation, invalidate state
      }
      if(temp != undefined) { //if not undefined
        temp.index = i;
        this.listj.push(temp)
      }
    }
    console.log('possible joins / states');
    console.log(JSON.stringify(this.listj));
    this.listj.sort(preferred) //sort by preferred axiom
    if(this.listj.length <= 0){console.log('no possible joins');return false;}
    //perform first join, then try to answer question mark.
    let v = this.listj.shift();
    join(this.w,this.axioms[v.index],v, rule);
    let ans = answer(this.w); //if we can answer, true
    if(ans){
      console.log('theanswer');
      console.log(translate(this.w));
      console.log(this.w);
      return this.w;
    } else {
      return false
    }
    // if no answer restart looking for an answer.
    this.start()
  };
}
