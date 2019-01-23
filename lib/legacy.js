/* Don't want to loose this */

/* Original OpFor AlgoC 2.0 */

/*
* Function that evaluates, track and joins graphs
* @param graph - Thing with type axiom containing a fact
* @param axioms - axiomStore containing state, canon, laws, negations
* @param mode - string, either 'Schema' or 'law' when law is given, one must cover the whole graph to join to it
* @return array - array of possibly true states of the world given the fact joined to something or undefined if no joins are possible
*/

function InfOp (graph, axioms, mode, stateLabel) {
  // make a copy of graph into v and into w, v is the original query, w the working graph
  this.v = JSON.parse(JSON.stringify(graph));
  this.v = Object.assign(new Thing(), this.v);
  this.w = JSON.parse(JSON.stringify(graph));
  this.w = Object.assign(new Thing(), this.w);
  // mode
  this.mode = mode | 'schema';
  // array of axioms to consider
  this.axioms = axioms.axioms;
  // array to save possibleState join objects
  this.posStates = [];
  // array to keep the results
  this.result = [];
  // execution function
  this.start = function () {
    // rule is explicitely false
    var rule = false;
    // unless mode was defined as law, then set to true
    if(mode == 'law'){ rule = true;};
    // loop through each graph in the axioms array
    for(let i=0; i< this.axioms.length; i++){
      // project the working graph into each axiom item, pass the rule along
      var state = this.projection(this.w, this.axioms[i], rule); //returns an object symbolizing the possible join
      // if we found a possible join
      if(state){
        // iterate over results
        for(let j =0; j < state.length; j++){
          // if the join is with a negation, set working graph to negated and record which index negated it
          if(state[j].negated){ this.w.negated = true; this.w.index = i; };
          // but for all states add the index of the axiom that would have to be joined to achieve it
          state[j].index = i;
          // push it to possible States
          this.posStates.push(state[j]);
        }

      }
    }
    // if we found none return false and log no possible joins
    if(this.posStates.length <= 0){console.log('no possible joins');return false;}
    // otherwise loop through the states
    for(var i=0;i<this.posStates.length;i++){
      // save the index of the axiom needed
      var index = this.posStates[i].index;
      // create a new Object symbolizing the new state that would be created
      // add the axiom that will be joined
      var nextState = {how:this.axioms[index], step:1};
      // create a new axiomStore to hold the joined axiom
      nextState.state = new axiomStore(stateLabel + this.axioms[index].label);
      // if the working graph is blocked, block the new State (this is to show why it was blocked)
      if(this.w.negated == true && this.w.index == index) {
        nextState.blocked = true;
        //console.log('blocked state');
      }
      // join working graph with the applicable axiom
      var newState = this.join(this.w, this.axioms[index], this.posStates[i], rule);
      // if some join error occured here, let's block the state and proceed, so it will
      // be obvious that some error happend
      if(!newState) { nextState.blocked = true; nextState.error = 'Join not successful'; }
      // if we get a state add it to the axiomStore to pass back
      nextState.state.add(newState);
      // push the newly created state to the result array
      this.result.push(nextState);
    }
    // return the result array;
    return this.result;
  };
  /*
  * Function to project a graph into another graph (the homomorphism / secret sauce)
  * @param target (graph) - Thing with type axiom containing a fact to project
  * @param source (graph) - thing with type axiom containing a fact/law/neg to project into
  * @param rule (boolean) - mode switcher
  * @return undefined | array of projections in form of an Object with a {from:uuid to: uuid}
  */
  this.projection = function (target, source, rule) {
    // make a copy of each graph
    var v = JSON.parse(JSON.stringify(target));
    v = Object.assign(new Thing(), v);
    var w = JSON.parse(JSON.stringify(source));
    w = Object.assign(new Thing(), w);
    // initiate a score
    var score = 0;
    // copy the list of concepts for both graphs
    var target = v.concept;
    var source = w.concept;
    // create a splitArray, which is a wrapper around an array that only
    // allows unique items
    var splitArray = new Splitarray();
    // a result array to collect results
    var resultArr = [];
    // create result object with name indicating source label
    var result = {name:w.label+'cP',concepts: []};
    // loop through each target concept
    for(var i = 0; i<target.length;i++){
      // loop through each concept in the source
      for(var j = 0; j<source.length; j++) {
        // the following conditions must be met to make a join
        // target concept and source concept shall have the same type
        // and in the future the source may be restricted down to be joined (expect on rules)
        if(target[i].label === source[j].label){ //same type?
          //console.log('projection got:');
          //console.log(target[i].label);
          //console.log(target[i].referent);
          //console.log(source[j].label);
          //console.log(source[j].referent);
          //console.log(source[j].referent == '*');
          //console.log(source[j].referent == undefined);
          //console.log(target[i].referent == '*');
          // if the source referent is '*' meaning it applies to all label instance
          // or if the referent is undefined
          // or if the target referent is '*' all
          if(source[j].referent == '*' || source[j].referent == undefined || target[i].referent == '*') { // source a schema or something like 'Born'
          // if we havent joined these before (uuid the same or .from the same as uuid of source) <-- future
          //console.log('target');
          //console.log(target[i].uuid);
          //console.log('source');
          //console.log(source[j].uuid);
            if(target[i].uuid != source[j].uuid) {
              //console.log('not the same uuid, joining');
              // create join object that will be used to join from source into target
              var joinConcept = {from: source[j].uuid, to: target[i].uuid};
              // increase score by one (score is really just a number here to indicate how much of an overlap)
              score += 1;
              // add it to result concepts array
              result.concepts.push(joinConcept);
            }
          // if the referents are the same (both reference the same individual)
          } else if (target[i].referent == source[j].referent) { //the same
            //console.log('the same referent');
            // but the uuid is not the same (it's not the same concept)
            if(target[i].uuid != source[j].uuid) {
              //console.log('not the same uuid');
              // create a join object for this concept
              var joinConcept = {from: source[j].uuid, to: target[i].uuid};
              // increase score
              score += 1;
              // add to result
              result.concepts.push(joinConcept);
            } else {
              //console.log('the same uuid');
              // create join object
              var joinConcept = {from: source[j].uuid, to: target[i].uuid};
              // decrease score (we don't want to join like and like)
              score -= 1;
              // add to joinConcepts
              result.concepts.push(joinConcept);
            }
          }
        }
      }
    }
    // check extra stuff if it's a rule
    if(rule){
      // resulting joins length for a rule join needs to be bigger or equal to the concepts in a rule
      if(result.concepts.length < w.concept.length){
        //console.log(result, 'does not satisfy Hypothesis');
        // return undefined because we can't join into this rule
        return undefined;
      }
      // if nothing is asserted we are dealing with a negation
      if(w.conConcept.length<=0 && w.conRelation.length<=0){
        // set the score
        result.score = score;
        // set negated true
        result.negated = true;
        return result;
      }
      // if it's not a negation we have modifications (the implications of the rule)
      // that need to be added, in the future this needs to be improved
      // iterate over consequent concepts and add them as if they were normal concepts
      for(var i=0;i<w.conConcept.length;i++){
        // create joins from the conConcepts into themselves (forces join to add them to the fact)
        var joinConcept = {from:w.conConcept[i].uuid, to:w.conConcept[i].uuid};
        // add to result
        result.concepts.push(joinConcept);
        // add the conConcept to the normal concepts of v (target graph)
        v.addConcept(w.conConcept[i]);
      }
      // iterate over consequent relations
      for(var i=0;i<w.conRelation.length;i++){
        // add them to target graph v
        v.addRelation(w.conRelation[i]);
      }
    }
    // if we found concepts to join
    if(result.concepts.length > 0) {
      // check if score is less than zero (means we are trying to join against itself)
      if(score <= 0) {
        //console.log('less than 0 score, no join');
        // return undefined (we do not want to join the same graph over and over again)
        return undefined;
      }
      //console.log('found a join with score', score);
      //console.log(source);

      // if there is multiple projections from the target into the source
      // we need to generate multiple results
      if(result.concepts.length>1) {
        for(let i=0;i<result.concepts.length; i++){
          // there is two cases where we might be have
          // a split in state
          // one, when we want to join into the same uuid from multiple concepts aka 2 or more joinConcepts with the same source
          // two, when we want to join the same uuid to multiple source concepts aka 2 or more joinConcepts with the same target
          for(let j=0;j<result.concepts.length; j++){
            // check if the from is the same or if the to is the same between 2 concepts
            if(result.concepts[i].from == result.concepts[j].from){
              // both are refering to different to's
              if(result.concepts[i].to != result.concepts[j].to) {
                // in this case we need to create separate states containing the same joins except each otherwise
                // mark that this one needs to be removed for the split
                result.concepts[i].split = true;
                // add it to a unique enforced array, to create splits from
                splitArray.add(result.concepts[i])
                // same as above
                result.concepts[j].split = true;
                // same as above
                splitArray.add(result.concepts[j])
              }
              // the same to
            } else if (result.concepts[i].to == result.concepts[j].to) {
              // but not the same source
              if(result.concepts[i].from != result.concepts[j].from){
                // in this case we need to create separate states containing the same joins except each otherwise
                // mark that this one needs to be removed for the split
                result.concepts[i].split = true;
                // add it to a unique enforced array, to create splits from
                splitArray.add(result.concepts[i])
                // same as above
                result.concepts[j].split = true;
                // same as above
                splitArray.add(result.concepts[j])
              }
            }
          }
        }
        // remove them from the results so we can create split copies of the 'result' we found
        for (let i = 0; i < result.concepts.length; i++) {
          // if concept is involved in a split remove it from the array
          if(result.concepts[i].split) {
            result.concepts.splice(i,1);
            i--;
          }
        }

        for(let i=0;i < splitArray.array.length;i++){
          // copy of results
          var temp = JSON.parse(JSON.stringify(result));
          // add one unique split to each copy
          temp.concepts.push(splitArray.array[i]);
          //add score
          temp.score = score;
          // add copy to resultArray
          resultArr.push(temp);
        }

      } else {
        // just one concept join found
        // add score
        result.score = score;
        // add to resultArray
        resultArr.push(result)
      }

      // return array of results
      return resultArr;
    } else {
      //console.log('found no join');
      // we found nothing
      return undefined;
    }
  };
  /*
  * Function that joins two graphs on join objects
  * @param target (graph) - Thing with type axiom which we are 'joining into'
  * @param source (graph) - Thing with type axiom
  * @param join (array of concepts) - concepts that should be joined
  * @param rule (boolean) - switch mode
  * @return target (graph) - joined graph
  */
  this.join = function(target, source, join, rule) {
    // make a copy of the target so we don't interfer with other joins later (bug that was found earlier)
    // make a copy of the source so we don't mess with it
    var targetCopy = JSON.parse(JSON.stringify(target));
    var target = Object.assign(new Thing(), targetCopy);
    var sourceCopy = JSON.parse(JSON.stringify(source));
    var source = Object.assign(new Thing(), sourceCopy);
    // if rule is true, we need to add conRelation to the main concepts
    if(rule) {
      // iterate
      for(let i=0;i<source.conRelation.length;i++){
        source.addRelation(source.conRelation[i])
      }
      // iterate
      for(let i=0;i<source.conConcept.length;i++){
        source.addConcept(source.conConcept[i])
      }
    }
    // iterate through through the join items
    for(var i=0;i<join.concepts.length;i++){
      // get concept from the join objects
      var concept = join.concepts[i]; //what we are joining from source and from
      // get the target and source concept from each graph
      var targetCon = target.find('uuid',concept.to)
      var sourceCon = source.find('uuid',concept.from)
      // let's assume that somehow we want to join a concept that we have already joined
      // targetCon will be undefined, if so we need to return undefined
      if(!targetCon) {
        return undefined;
      }

      // last check that referents are compatible to
      // source reference empty string
      // source referent the same as target referent
      // source referent '*' as in all
      if(sourceCon.referent == '' || sourceCon.referent == targetCon.referent || sourceCon.referent == '*'){
        // write target referent to source referent
        //console.log('joining when source is "*"');
        //console.log(targetCon.label);
        //console.log(targetCon.referent);
        //console.log(sourceCon.label);
        //console.log(sourceCon.referent);
        sourceCon.referent = targetCon.referent;
      } else if (targetCon.referent == '*') {
        // write source referent to target referent (joins if the source is a fact -> with an individual if targetCon referent is 'all')
        //console.log('joining when target is "*"');
        //console.log(targetCon.referent);
        //console.log(sourceCon.referent);
        targetCon.referent = sourceCon.referent;
      } else {
        console.error(`Cannot join ${targetCon.label}:${targetCon.referent} with ${sourceCon.label}:${sourceCon.referent}`);
        return undefined;
      }
      // iterate over relations
      for(var r = 0; r < target.relation.length; r++) {
        // relation temp
        var relation = target.relation[r];
        // mergeRelation merges relations
        var relationFound = mergeRelation(relation, targetCon.uuid, sourceCon.uuid);
      }
      // delete the target concept from target
      target.deleteConcept(targetCon.uuid); // <<< Don't like the whole deleting part need to check for  a better way
      // add a reference to sourceCon
      sourceCon.from = targetCon.uuid;
      // add the source Concept to the target graph
      target.addConcept(sourceCon);
    }
    // extend by adding any concepts and relations that are missing
    this.extendGraph(target, source, rule);
    // return the joined target graph
    return target;
  };
  /*
  * Function that extends a given graph with addition concepts from the source
  * @param target (graph) - target to extend
  * @param source (graph) - source to extend from
  * @param rule (boolean) - switch mode
  */
  this.extendGraph = function (target, source, rule) {
    // copy source to avoid modifying it
    var source = Object.assign(new Thing(), source);
    // iterate through source concepts
    for(let i=0;i<source.concept.length;i++){
      // if we don't find the concept uuid in the target, we add it
      if(!target.find('uuid', source.concept[i].uuid)){
        target.addConcept(source.concept[i]);
      }
    }
    // iterate through source relations
    for(let i= 0;i<source.relation.length;i++){
      // if we don't find the relation uuid in the target we add it to the target
      if(!target.find('uuid', source.relation[i].uuid)){
        target.addRelation(source.relation[i]);
      }
    }
  };
}


/* Original Pattern Projection Algo */

/*
* Function to project a graph into another graph (the homomorphism / secret sauce) Second Version
* Introducting Pattern matching
* @param target (graph) - Thing with type axiom containing a fact to project
* @param source (graph) - thing with type axiom containing a fact/law/neg to project into
* @param rule (boolean) - mode switcher
* @return undefined | array of projections in form of an Object with a {from:uuid to: uuid}
*/
function projection (target, source, rule) {
  // make a copy of each graph
  var t = JSON.parse(JSON.stringify(target));
  t = Object.assign(new Thing(), t);
  var s = JSON.parse(JSON.stringify(source));
  s = Object.assign(new Thing(), s);
  // initiate a score
  var score = 0;
  // copy the list of concepts for both graphs
  var targetCon = t.concept;
  var sourceCon = s.concept;
  // array of possible projections
  var posProj = [];
  // set found to false to indicate default, there is no projection
  var found = false;
  // array for results
  var result = [];
  // iterate over target concepts and explore matching patterns for each item that has
  // the same type
  for(let i=0;i<targetCon.length;i++){
    for(let j=0;j<sourceCon.length;j++){
      //if they are the same type, create a 'possible' projection with the 2 concepts
      if( targetCon[i].label == sourceCon[j].label ) {
        var tree = new Tree(target, targetCon[i], source, sourceCon[j]);
        posProj.push(tree);
        found = true;
      }
    }
  }
  // None found return undefined
  if(!found) {
    console.log('No projection found');
    return undefined;
  }
  // We found one or more, let's do some extra work
  // A projection is only valid when 2 conditions are met overall
  // 1 - it introduces new information in form of relations and concepts not found in target
  // 2 - it can add information into a referent '*' in the target
  for (let i = 0; i < posProj.length; i++) {
    var temp = posProj[i];
    var projection = temp.start();
    if(temp.invalid) {
      console.log('No projection found');
      return undefined;
    } else {
      for (let j = 0; j < projection.length; j++) {
        var temp = {name:source.label+'cP', concepts:projection[j]}
        result.push(temp);
      }
    }
  }

  return result;
}
