/* Inference relies on all other files at this point, so make sure they are included in the right order */

/* Create a World Basis
A world basis defines the initial world and canon (background knowledge) about the World
 from which reasoning can start. (We need to know for example what months are and birds etc)
A world basis also has Laws that define un-alterable truths. Not all canon is true,
 but it's possibly true, while laws are necessarily true. (As they are enforced).
A world basis contains a 'possibleWorld' graph, which is a container of one possible state
 of the world after some action is taken. There is an initial state, that can be extended
 by adding information.
A world basis also contains individual markers which are uuids of 'real' things or data connected
 to a concept.
Rules are based on graph projection.
• A simple assertion has no conditions and only one assertion: ->.. v.  : this is a fact
• A disjunction has no conditions and two or more assertions: -> Vi,...,Vm. : logic or
• A simple denial has only one condition and no assertions: u -....  : invalidates state
• A compound denial has two or more conditions and no assertions: ut,...,un -... : invalidates state
• A conditional assertion has one or more conditions and one or more assertions: ut,...,un .... Vl....,v~ : if then rule
• An empty clause has no conditionsorassertions: ->. : unused
• A Horn clause has at most one assertion; i.e. it is either
  an empty clause, a denial, a simple assertion, or a conditional assertion of the form
  ui to ut -> v. : if multiple then
*/

/*
* Function that instantiates a worldbasis to use
* @param limitParam (integer) - optional: add a limit to how many steps of reasoning are allowed defaults to 30
*/

function worldBasis (limitParam) {
  // array to keep track of states found
  this.states = [];
  // limit of reasoning depth, if we don't find a solution after 30...
  this.limit = limitParam || 30;
  // step tracker
  this.step = 1;
  // background knowledge
  this.canon = new axiomStore('canon');
  // laws / rules
  this.law = new axiomStore('law');
  // laws that negate a state
  this.neg = new axiomStore('neg');
  /*
  * Function to initiate
  * @param graph - Thing with type axiom that is a fact in the initial state cannot be empty
  * @param canon - axiomStore, containing axioms that are background knowledge
  * @param law = axiomStore, containing axioms that are truths / laws / rules about the domain
  * @param neg - axiomStore, containing axioms that are if then not true type laws
  */
  this.init = function (graph, canon, law, neg) {
    this.canon = canon;
    this.law = law;
    this.neg = neg;
    //Make a copy of the provided Graph
    var graphCopy = JSON.parse(JSON.stringify(graph))
    var graph = Object.assign(new Thing(), graphCopy);
    var graphS = new axiomStore('stateOrigin');
    graphS.add(graph)
    var state = {state: graphS, origin:true, step: this.step};
    //each state keeps a copy of the world basis, not a reference...
    this.states.push(state);
  };
  /*
  * Function to tell new information into an existing knowledge base
  * @param graph - Thing with type axiom containing a fact
  * @return boolean - True if fact generated a new state (was found in canon or other facts), false negated
  */
  this.tell = function(graph) {
    // make a copy of the graph to preserve the original
    var graphCopy = JSON.parse(JSON.stringify(graph))
    var graph = Object.assign(new Thing(), graphCopy);
    // loop through states available in this world.
    for(var state of this.states) {
      console.log(this.states.length);
      state.step = 0;
      // if you hit the step limit break the loop and end
      if(state.step>this.limit){this.final(state);break;};
      //check if this state is not blocked before doing something
      if(!state.blocked){
        // increase step so we can limit recursion / looping
        state.step += 1;
        //console.log(this.step);
        // explicitely add blocked as a variable to the state we are passing and set to false (not blocked)
        state.blocked = false;
        // let 'player' move into the state to start to try adding the graph to our current knowledge
        setTimeout(()=>{this.player(graph, state);}, 1);
      }
    }
  };
  /*
  * Function that tries to join the graph into the state or canon (to prove it's true information)
  * @param graph - Thing with type axiom representing a fact we want to add
  * @param state - Object representing the current state we are trying to move into (operate from)
  */
  this.player = function(graph, state) {
    var stateLabel = state.state.label;
    //console.log(stateLabel, state.step);
    if(state.step > this.limit) {this.final(state);return;}
    state.step += 1;
    //console.log('Player move');
    //console.log('Joining into state?');
    // create an InfOp object that can be used to join items
    // add the current states state (axiomStore)
    // specify that we are trying to do a schema join (a none-rule join anything that works join)
    var moveState = new InfOp(graph, state.state, 'schema', stateLabel);
    // run the join this should return either undefined if no joins or it returns an array of possible states
    // every join into the state returns a new state for that join, from which we can operate
    var result = [];
    result = moveState.start();
    // if we found a join 1 - many, we do this
    if(result.length>0){
      //console.log('Joined into state, player moved');
      // iterate over possible States
      for(let i=0;i<result.length;i++){
        // for each define that the player moved in this state (end condition)
        result[i].playerPass = false; //player moved in this state
        // call the opponent (opfor) to try to disprove this state
        setTimeout(()=>{this.opfor(result[i].state.axioms[0], result[i]);}, 1);
      }
    // if we found nothing
    } else {
      //console.log('Joining into Canon?');
      // we try to join into a canon graph to find related background knowledge
      var moveCanon = new InfOp(graph, this.canon, 'schema', stateLabel)
      // execute joins
      var result = [];
      result = moveCanon.start();
      // if we were able to join into a canon rule
      if(result.length>0){
        //console.log('Joined into Canon, player moved');
        // iterate over all possible states
        for(let i=0;i<result.length;i++){
          // indicate we moved in the state
          result[i].playerPass = false;
          // send to opfor for disproval attempt
          setTimeout(()=>{this.opfor(result[i].state.axioms[0], result[i]);}, 1)
        }
      } else {
        // we found nothing to prove this fact
          //console.log('No Join, player pass');
          // player passes
          state.playerPass = true;
          // opfor gets a chance to disprove the current state (or the original state)
          setTimeout(()=>{this.opfor(state.state.axioms[0], state);}, 1) //send original state to opfor
      }
    }
  };
  /*
  * Function that tries to disprove or modify the state with truths from this domain
  * @param graph - Thing with type axiom that represents a fact
  * @param state - Object containing the current state of truth passed from player
  */
  this.opfor = function(graph, state){
    if(!state){return;};
    var stateLabel = state.state.label;
    //console.log(stateLabel, state.step);
    if(state.step > this.limit) {this.final(state);return;}
    state.step +=1;
    //console.log('Opfor moves');
    //console.log('Apply any negation?');
    //console.log(this.neg);
    // initiate join into negations (if any)
    var moveNeg = new InfOp(graph, this.neg, 'law', stateLabel);
    // execute joins into negations
    var result = [];
    result = moveNeg.start();
    // if we found negations
    if(result.length>0){
      //console.log('Negation found, invalidating state');
      // iterate over set of states with negations
      for(var i=0;i<result.length;i++){
        // check if negation was applied
        if(result[i].blocked) {
          // indicate that the opfor moved in this state
          result[i].opponentPass = false;
          // send to final to process as a blocked state
          setTimeout(()=>{this.final(result[i]);}, 1);
        } else {
          // no opponentPass false added here, as this is just splitting
          // off the negations from the possible states
          // this is a catcher for possible states with no negations coming out of the join
          setTimeout(()=>{this.opfor(result[i].state.axioms[0], result[i]);}, 1)// no negation found, restart
        }
      }
    } else {
      //console.log('No negation found, applying a law?');
      // initiating join into laws about the domain, these should modify the state
      var moveLaw = new InfOp(graph, this.law, 'law', stateLabel);
      // executing the join
      var result = [];
      result = moveLaw.start();
      // if we found possible states
      if (result.length>0) {
        //console.log('Opfor moved, applied law');
        // iterate over possible states
        for(var i=0;i<result.length;i++){
          // indicate opfor moved in this state
          result[i].opponentPass = false;
          // send this state back to player to give him another move
          setTimeout(()=>{this.player(result[i].state.axioms[0], result[i]);}, 1)// continue until end condition
        }
      } else {
        //console.log('Opfor passed');
        // found no applicable laws pass on this one
        state.opponentPass = true;
        // if both player passed and opponent passed in succession,
        // we know this fact has been sufficiently added to the state and no negation was found
        // or no other law was applied, hence it is done and ready for processing
        if(state.playerPass && state.opponentPass) {
          //console.log('player passed and opponentpassed');
          // send for processing for true fact
          setTimeout(()=>{this.final(state);}, 1)
        } else {
          // still possibly more things to add
          setTimeout(()=>{this.player(state.state.axioms[0], state);}, 1)// continue until end condition
        }
      }
    }
  };
  /*
  * Function that determines whether a fact was added (returns true), or whether it was rejected (returns false)
  * @param state - Object containing current state
  * @return boolean - true for accepted fact, false for rejected fact
  */
  this.final = function(state) {
    console.log('final called with state', state);
    // is state blocked?
    if(state.blocked) {
      console.log('state blocked', state);
      //set state as false
      state.truth = false;
      // add it to the list of states
      this.states.push(state);
      return;
    }
    // both player and opponent passed in succesion
    if(state.playerPass && state.opponentPass) {
      //console.log('state true, added', state);
      state.truth = true;
      // add it to the list of states
      this.states.push(state);
      return;
    }

   // These are states that have not finished going down the rabbit hole
    console.log('uncaught state', state);
    state.truth = 'unknown';
    this.states.push(state);
    return;
  };
}

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
  this.mode = mode || 'schema';
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
      var state = [];
      state = this.projection(this.w, this.axioms[i], rule); //returns an object symbolizing the possible join
      // if we found a possible join
      if(state.length>0){
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
    if(this.posStates.length <= 0){/*console.log('no possible joins');*/return false;}
    // otherwise loop through the states
    for(var i=0;i<this.posStates.length;i++){
      // save the index of the axiom needed
      var index = this.posStates[i].index;
      // create a new Object symbolizing the new state that would be created
      // add the axiom that will be joined
      var nextState = {how:this.axioms[index].label, step:2};
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
        if( targetCon[i].label == sourceCon[j].label ) { // <---------------------------------  Here we will check whether types can be changed
          // --------------------------------------------------------------------------------- to make a projection.
          var tree = new infUtil.Tree(target, targetCon[i], source, sourceCon[j], rule);
          posProj.push(tree);
          found = true;
        }
      }
    }
    // None found return undefined
    if(!found) {
      //console.log('No projection found');
      return [];
    }
    // We found one or more, let's do some extra work
    // A projection is only valid when 2 conditions are met overall
    // 1 - it introduces new information in form of relations and concepts not found in target
    // 2 - it can add information into a referent '*' in the target
    for (let i = 0; i < posProj.length; i++) {
      var temp = posProj[i];
      var projection = temp.start(rule);
      if(temp.invalid) {
        //console.log('No projection found');
        return [];
      } else {
        for (let j = 0; j < projection.length; j++) {
          if(projection[j].negated){ // <------------------------------ Check this one
            var temp = {name:source.label+'cP', concepts:projection[j], negated:true};
          } else {
            var temp = {name:source.label+'cP', concepts:projection[j]};
          }
          result.push(temp);
        }
      }
    }

    return result;
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
    // traverse start, first concept in target (as it need at least one item in graph to be valid)
    var checkStart = target.concept[0];
    // add all source concepts and relations to target
    // to extend by adding any concepts and relations that are missing
    target.concept = target.concept.concat(source.concept);
    target.relation = target.relation.concat(source.relation);

    //-- Process join per join array--

    // iterate through through the join items
    for(var i=0;i<join.concepts.length;i++){
      // get concept from the join objects
      var concept = join.concepts[i]; //what we are joining from source and from
      // get the target and source concept from each graph
      var targetCon = target.find('uuid',concept.to)
      var sourceCon = source.find('uuid',concept.from)
      // let's assume that somehow we want to join a concept that we have already joined
      // targetCon will be undefined, if so we need to return undefined
      if(!targetCon || !sourceCon) {
        return undefined;
      }
      // if we found a new referent copy the new referent
      if(concept.what == 'referent'){
        // this will modify the sourceConcept also contained in the target
        targetCon.referent = sourceCon.referent;
        // find all the 'arcs / relations' pointing to the source Concept and
        // move them to the target concept
        for(let i=0;i<sourceCon.out.length;i++){
          // find relation in out
          var relation = source.find('uuid', sourceCon.out[i]);
          // iterate over arcs object
          for(let index in relation.arcs){
            // if the arc is referencing the source concept
            if(relation.arcs[index] == sourceCon.uuid) {
              // change the reference to the target concept instead
              relation.arcs[index] = targetCon.uuid;
              // add relation to the outs of the target
              targetCon.out.push(relation.uuid);
            }
          }
        }
      // if there is new information attached from source
      } else if (concept.what == 'relation') {

        // do nothing as we are handling it on concepts

      } else if (concept.what == 'none') { // <-- re-evaluate this part, as it should only join anything if new information is available
        // To get here a referent in source is either the same as the one in target
        // Or it has a star and maybe has some new relations.

        // find all the 'arcs / relations' pointing to the source Concept and
        // move them to the target concept
        for(let i=0;i<sourceCon.out.length;i++){
          // find relation in out
          var relation = source.find('uuid', sourceCon.out[i]);
          // iterate over arcs object
          for(let index in relation.arcs){
            // if the arc is referencing the source concept
            if(relation.arcs[index] == sourceCon.uuid) {
              // change the reference to the target concept instead
              relation.arcs[index] = targetCon.uuid;
              // add relation to the outs of the target
              targetCon.out.push(relation.uuid);
            }
          }
        }
      }

    }

    target = this.cleanUp(target, checkStart);

    // then delete all relations and concepts that are not keep true;
    // return the joined target graph
    return target;
  };

  this.cleanUp = function (target, start) {
    var closed = new Set();
    var open = new Set();
    closed.add(start.uuid);
    // add out to open set
    for(let i=0;i<start.out.length;i++){
      open.add(start.out[i]);
    }
    // while there is still some things to traverse
    while(open.size>0){
      var temp = open.values(); // returns an iterator
      var val = temp.next().value;
      // if we havent seen it, add it's outs to the open set
      if(!closed.has(val)){
        // then add it to the closed set
        closed.add(val);
        // then remove it from the open set
        open.delete(val);
        // get item from target
        var item = target.find('uuid', val);
        // then check if there is an out or arcs
        if(item.out.length>0){
          for(let i=0;i<item.out.length;i++){
            open.add(item.out[i]);
          }
        } else if(Object.keys(item.arcs).length>0){
          for(var index in item.arcs){
            open.add(item.arcs[index]);
          }
        }
      } else {
        // delete it from val
        open.delete(val);
      }
    }
    // delete all concepts we did not traverse (unconnected)
    for(let i=0;i<target.concept.length;i++){
      // if we did not traverse the concept
      if(!closed.has(target.concept[i].uuid)){
        // delete concept from target
        target.deleteConcept(target.concept[i].uuid);
      }
      // if not do nothing
    }
    // delete all relations we did not traverse (unconnected)
    for(let i=0;i<target.relation.length;i++){
      // if we did not traverse the concept
      if(!closed.has(target.relation[i].uuid)){
        // delete concept from target
        target.deleteRelation(target.relation[i].uuid);
      }
      // if not do nothing
    }
    return target;
  };
}

/*
* Function to traverse graphs and determine matches
* @param target (graph) - target graph
* @param tarStart (concept) - concepts that is the start
* @param source (graph) - source graph
* @param sourStart (concept) - concept that is the start
* @return joins array or undefined (we might still find no pattern)
*/

function Tree (target, tarStart, source, sourStart, rule) {
  this.level = [];
  this.depth = 0;
  this.tree = new Set();
  this.root1 = tarStart;
  this.root2 = sourStart;
  this.root1G = target;
  this.root2G = source;
  this.rule = rule;
  this.invalid = false;

  this.start = function(rule) {
    // if this tree is invalid return undefined
    if(this.invalid){return undefined;}
    this.depth = this.level.length // should be 0 for first level
    var results = [];
    if(this.root1.referent == '*' && this.root2.referent != '*') { // <----------------------------------  All these checks need to be smarter
      // -------------------------------------------------------------------------------- we need to traverse a few depths directly here and determine new information vs no new
      //console.log('Found new referent to merge');
      results.push({from:this.root2.uuid,to:this.root1.uuid,what:'referent', depth:this.depth});
      this.tree.add(this.root2.uuid);
      this.tree.add(this.root1.uuid);
    // if source referent is star and it has more relations than this might be new information
    } else if (this.root2.referent == '*') {
        //console.log('Found a general referent, might have something new here');
        if((this.root2.out.length>this.root1.out.length) || rule){
          results.push({from:this.root2.uuid,to:this.root1.uuid,what:'none', depth:this.depth});
          this.tree.add(this.root2.uuid);
          this.tree.add(this.root1.uuid);
        }
      // if both referents are the same, then we need to check if new relations are available
    } else if (this.root1.referent == this.root2.referent) {
        //console.log('Referents the same, need to check relations
        // only if we have more relations going out in the source add it
        // or if we are trying to match a rule (could be exactly the same as the graph we want)
        if((this.root2.out.length>this.root1.out.length) || rule){
          results.push({from:this.root2.uuid,to:this.root1.uuid,what:'none', depth:this.depth});
          this.tree.add(this.root2.uuid);
          this.tree.add(this.root1.uuid);
        } else {
          // check if we have a source out with a different uuid, then proceed as if it's a new connection
          // suspect to do this as the source uuid migth be different everytime we are checking this
          for(let i=0;i<this.root1.out.length;i++){
            for(let j=0;j<this.root2.out.length;j++){
              if(this.root1.out[i] != this.root2.out[j]){
                // this might be a new connection we do not have
                results.push({from:this.root2.uuid,to:this.root1.uuid,what:'none', depth:this.depth});
                this.tree.add(this.root2.uuid);
                this.tree.add(this.root1.uuid);
              } else {
                // they are the same, so don't persue
                this.invalid = true;
              }
            }
          }
          //if no results after this condition, this should be invalid
          if(!results.length>0) {
            this.invalid = true;
          }
        }
    } else {
        this.invalid = true;
    }
    this.level.push(results);
    return this.growR(rule);
  };

  this.growR = function(rule){
    if(this.invalid){return undefined;}
    var results = [];
    var expand = this.level[this.depth];
    this.depth += 1;
    for (let i = 0; i < expand.length; i++) {
      var sourCon = this.root2G.find('uuid', expand[i].from).out;
      var tarCon = this.root1G.find('uuid', expand[i].to).out;
      //console.log('if new information is available');
      //console.log(sourCon.length>tarCon.length);
      for (let j = 0; j < tarCon.length; j++) {
        // if we have not seen this already
        if(!this.tree.has(tarCon[j])) {
          // set temp for target relation to compare to
          var temp1 = this.root1G.find('uuid',tarCon[j]);
          for (let k = 0; k < sourCon.length; k++) {
            // if we have not seen this already
            if(!this.tree.has(sourCon[k])){
              // set temp for source relation to compare to
              var temp2 = this.root2G.find('uuid',sourCon[k])
              // if they are the same, merge them
              if (temp1.label == temp2.label) {
                // this logic needs to be looked at <------
                // if new information is available, as in there is more relations in the source
                results.push({from:temp2.uuid,to:temp1.uuid,what:'relation',depth:this.depth, parent:expand[i]})
                this.tree.add(temp1.uuid);
                this.tree.add(temp2.uuid);
              }
            }
          }
        }
      }
    }
    //console.log('checking for results');
    // if we found children that match go ahead and push to level 1/3/5 etc
    if(results.length>0){
      this.level.push(results);
      return this.growC(rule)
    } else {
      //console.log('found no further relations');
      return this.finish(rule);
    }
  };

  this.growC = function(rule) {
    //console.log('checking more concepts');
    if(this.invalid){return undefined;}
    var results = [];
    var expand = this.level[this.depth];
    this.depth += 1;
    for (let i = 0; i < expand.length; i++) {
      var sourCon = this.root2G.find('uuid', expand[i].from).arcs;
      var tarCon = this.root1G.find('uuid', expand[i].to).arcs;
      //console.log('going over new concepts', tarCon);
      for (var targetI in tarCon) {
        //console.log(tarCon[targetI]);
        // if we don't have seen this already
        if(!this.tree.has(tarCon[targetI])) {
          // set temp for target relation to compare to
          //console.log('new concept', this.root1G.find('uuid',tarCon[targetI]));
          var temp1 = this.root1G.find('uuid',tarCon[targetI]);
          for (var sourceI in sourCon) {
            // set temp for source relation to compare to
            var temp2 = this.root2G.find('uuid',sourCon[sourceI]);
            if(!this.tree.has(temp2.uuid)){

              if(temp1.label == temp2.label) {
                // if they are the same, merge them
                if(temp1.referent == '*' && temp2.referent != '*') {
                  //console.log('Found new referent to merge');
                  results.push({from:this.root2.uuid,to:this.root1.uuid,what:'referent', depth:this.depth, parent:expand[i]});
                  this.tree.add(temp2.uuid);
                  this.tree.add(temp1.uuid);
                // if source referent is star and it has more relations than this might be new information
                } else if (temp2.referent == '*') {
                    //console.log('Found a general referent, might have something new here');
                    results.push({from:temp2.uuid,to:temp1.uuid,what:'none', depth:this.depth, parent:expand[i]});
                    this.tree.add(temp2.uuid);
                    this.tree.add(temp1.uuid);
                  // if both referents are the same, then we need to check if new relations are available
                } else if (temp1.referent == temp2.referent) {
                    //console.log('Referents the same, need to check relations');
                    // only if we have more relations going out in the source add it
                    if(temp2.out.length>temp1.out.length){
                      results.push({from:temp2.uuid,to:temp1.uuid,what:'none', depth:this.depth, parent:expand[i]});
                      this.tree.add(temp2.uuid);
                      this.tree.add(temp1.uuid);
                    } else {
                      // check if we have a source out with a different uuid, then proceed as if it's a new connection
                      // suspect to do this as the source uuid migth be different everytime we are checking this
                      for(let i=0;i<temp1.out.length;i++){
                        for(let j=0;j<temp2.out.length;j++){
                          if(temp1.out[i] != temp2.out[j]){
                            // this might be a new connection we do not have
                            results.push({from:temp2.uuid,to:temp1.uuid,what:'none', depth:this.depth, parent:expand[i]});
                            this.tree.add(temp2.uuid);
                            this.tree.add(temp1.uuid);
                          } else {
                            this.invalid = true;
                          }
                        }
                      }
                    }
                } else {
                    //console.log('No fit on this concept, handle me depending on root1');
                    //console.log(temp1);
                    //console.log(temp2);
                    this.tree.add(temp2.uuid);
                    this.tree.add(temp1.uuid);
                }
              } else {
                //console.log('no match')
              }
            }
          }
        }
      }
    }

    //check if results were found
    if(results.length>0){
      //console.log('found new concepts');
      this.level.push(results);
      return this.growR(rule)
    } else {
      //console.log('found no further concepts');
      return this.finish(rule);
    }
  };

  this.finish = function(rule) {
    // take tree and turn into one or more join concepts
    //console.log('finishing up');
    // initiate a result array
    var projections = [];

    var levels = this.level.length;
    while(this.level.length>0){
      var level = this.level.pop();
      for(let i=0;i<level.length;i++){
        if(!level[i].seen){
          var array = [];
          array.push(level[i]);
          level[i].seen = true;
          if(level[i].parent){
            var parent = level[i].parent;
            for(let j=levels;j>0;j--){
              if(parent.parent){
                array.push(parent);
                parent.seen = true;
                parent = parent.parent;
              } else {
                //should be a root
                array.push(parent);
                parent.seen = true;
                break;
              }
            }
          }
          array = array.reverse();
          projections.push(array);
        }
      }
    }

    //if this is a rule, check that source is fully covered with each projection, remove any that are
    // fully covering the source
    // let's try doing it with an approximation, if we have fully covered the source, then we should have
    // the same amount of merges than there is concepts and relations in the source...
    if(rule){
      var sourceTotal = this.root2G.concept.length + this.root2G.relation.length;
      for (let i = 0; i < projections.length; i++) {
        // if the rule is not fully covered, it does not apply
        if( !(projections[i].length>=sourceTotal) ) {
          projections.splice(i,1);
          i--;
        }
      }
    }

    return projections;
  };

}


/*
* Function that instantiates a reasoner to use
* @param eventSystem (evSystem) - Reference to eventSystem
*/

function Reasoner (eventSystem) {

  // working knowledge
  this.current = new axiomStore('current');
  // laws / rules
  this.law = new axiomStore('law');
  // schema, which is used to find possible schemas
  this.schema = new axiomStore('schema');
  // infop class instance
  this.util = new InfOp({}, {}, '');
  // event system hook
  this.eventS = eventSystem;

  /*
  * Function to initiate
  * @param necT - axiomStore, containing necessarilyTrue information
  * @param posT - axiomStore, containing possiblyTrue information about world
  * @param law = axiomStore, containing axioms that are truths / laws / rules about the domain
  * @param F - axiomStore, containing axioms that are false for this world.
  */
  this.init = function (current, law, schema) {
    this.current = current;
    this.law = law;
    this.schema = schema;
    this.eventS.sub('unify', this.unify.bind(this));
  };

  /*
  * Function to tell new information into an existing knowledge base
  * @param graph - Thing with type axiom containing a fact
  * @return string -
  */
  this.tell = function(graph) {
    // make a copy of the graph to preserve the original
    var graphCopy = JSON.parse(JSON.stringify(graph))
    var graph = Object.assign(new Thing(), graphCopy);

    // initialize pre-conditions
    found = false;
    law = false;

    // search through current knowledge to find projections
    // make sure empty var is initialized
    var result = [];
    for(var index in this.current.axioms) {
      var proj = infUtil.project(graph, this.current.axioms[index], false);
      if(proj.length > 0) {
        result.push(proj);
      }
    }
    if(result.length>0){
      console.log(result);
      found = true;
    }

    // search through laws to find projection (needs to fully cover law)
    // make sure empty var is initialized
    var result = [];
    for(var index in this.law.axioms){
      var proj = infUtil.project(graph, this.law.axioms[index], true);
      if(proj.length>0){
        console.log(proj);
        result.push(index);
      }
    }
    if(result.length>0){
      law = true;
      console.log(result);
    }

    // do what needs to be done per logic attached
    if(found && !law) {
      this.current.add(graph);
      setTimeout(()=>{this.eventS.send('unify')}, 1);
      return 'True'

    } else if (!found && law) {
      console.log('rule applied');
      console.log(this.law.axioms[result[0]]);
      translate(graph);
      var newGraph = this.util.join(graph, this.law.axioms[result[0]], proj[0], true);
      translate(newGraph);
      this.current.add(newGraph);
      this.law.axioms[result[0]].execute(this); // implement
      setTimeout(()=>{this.eventS.send('unify')}, 1);
      return 'True';
    } else {
      // search through schema to find projection
      // make sure empty var is initialized
      var result = [];
      for(var index in this.schema.axioms){
        var proj = this.util.projection(graph, this.schema.axioms[index], false);
        if(proj.length>0){
          result.push(proj);
        }
      }
      if(result.length>0){
        result.forEach((item)=>console.log('Did you want to: ' + item[0].name));
      }
      return 'Unknown';
    }
  };

  /*
  * Function that asserts something as true
  * @param graph (axiom) - axiom that is true
  */
  this.assert = function(graph) {
    this.current.add(graph);
    setTimeout(()=>{this.eventS.send('unify')}, 1);
  };

  /*
  * Function that unifies anything possible
  * @return boolean - returns true if any joins were executed
  */
  this.unify = function() {
    console.log('unify called');
    console.log(this.current.axioms);
    // iterate through all available graphs in current knowledge
    for(var first in this.current.axioms) {
      for(var second in this.current.axioms){
        // if not the same graph
        if(first != second) {
          // try to project the first into the second
          var proj = infUtil.project(this.current.axioms[first], this.current.axioms[second])
          // found a projection, meaning a merge is possible
          if(proj.length>0){
            // create a graph that is a join of the two graphs
            var newGraph = this.util.join(this.current.axioms[first], this.current.axioms[second], proj[0], false);
            // add the result to the current knowledge
            this.current.add(newGraph);
            // remove the un-joined graph

            // we want to make sure we splice the array so that we only delete what we
            // want and not accidentally remove one that changes the location of the
            // other. We do this by making sure we delete the one later in the array first
            // so the other is not affected. Delete from left to right.
            if(second>first) {
              // second is behind first, remove second first
              this.current.axioms.splice(second, 1);
              this.current.axioms.splice(first, 1);
            } else if (first>second) {
              // first is behind second, remove first first
              this.current.axioms.splice(first, 1);
              this.current.axioms.splice(second, 1);
            }
          }
        }
      }
    }

  };

}

/*
* A module containing join functions so they become available globally
*/

var infUtil = (function() {
  // no private vars at this point
  return {

    /* public function to join 2 concepts
    *  @param tar signifies Concept and Graph we join into
    *  @param sou signifies Concept and Graph we join from
    *  @return side-effect on the graph that is passed in
    */
    joinConcepts: function(tarC,tarG,souC,souG,what){

      if(what == 'referent'){
        // this will modify the sourceConcept also contained in the target
        tarC.referent = souC.referent;
        // find all the 'arcs / relations' pointing to the source Concept and
        // move them to the target concept
        for(let i=0;i<souC.out.length;i++){
          // find relation in out
          var relation = source.find('uuid', souC.out[i]);
          // iterate over arcs object
          for(let index in relation.arcs){
            // if the arc is referencing the source concept
            if(relation.arcs[index] == souC.uuid) {
              // change the reference to the target concept instead
              relation.arcs[index] = tarC.uuid;
              // add relation to the outs of the target
              tarC.out.push(relation.uuid);
            }
          }
        }
      // if there is new information attached from source
      } else if (what == 'relation') {

        // do nothing as we are handling it on concepts

      } else if (what == 'none') { // <-- re-evaluate this part, as it should only join anything if new information is available
        // To get here a referent in source is either the same as the one in target
        // Or it has a star and maybe has some new relations.

        // find all the 'arcs / relations' pointing to the source Concept and
        // move them to the target concept
        for(let i=0;i<souC.out.length;i++){
          // find relation in out
          var relation = source.find('uuid', souC.out[i]);
          // iterate over arcs object
          for(let index in relation.arcs){
            // if the arc is referencing the source concept
            if(relation.arcs[index] == souC.uuid) {
              // change the reference to the target concept instead
              relation.arcs[index] = tarC.uuid;
              // add relation to the outs of the target
              tarC.out.push(relation.uuid);
            }
          }
        }
      }
      // end of joinConcept
    },

    /*
    * Function to traverse graphs and determine matches
    * @param target (graph) - target graph
    * @param tarStart (concept) - concepts that is the start
    * @param source (graph) - source graph
    * @param sourStart (concept) - concept that is the start
    * @return joins array or undefined (we might still find no pattern)
    */

    Tree: function(target, tarStart, source, sourStart, rule) {


      this.level = [];
      this.depth = 0;
      this.tree = new Set();
      this.root1 = tarStart;
      this.root2 = sourStart;
      this.root1G = target;
      this.root2G = source;
      this.rule = rule;
      this.invalid = false;

      this.start = function(rule) {
        //if this tree is invalid return undefined
        if(this.invalid) {return undefined}
        this.depth = this.level.length //should be 0 for first level
        var results = [];

        /*
        Following cases should be handled:
        1. The target applies to 'any' * of something and the source is a specific
           instance of a thing.
           This should be joined as it specializes the graph.
        2. The source applies to 'any' signified by the *.
           This should only be joined if it's a rule or if we have new 'relations'
           and knowledge attached.
        3. Both target and source have the same referent.
           This should only be joined if it's a rule or if we have new 'relations'
           and knowledge attached.
           */

        // (1)
        if(this.root1.referent == '*' && this.root2.referent != '*') {
          // The source is a specialisation of the target
          results.push({from:this.root2.uuid,to:this.root1.uuid, what:'referent', depth:this.depth})
          this.tree.add(this.root2.uuid)
          this.tree.add(this.root1.uuid)
        } else if (this.root2.referent == '*') {
          // The source can be specialised by the target.
          // get Concepts connected to these Concepts
          var arrT = this.getChildren(this.root1, this.root1G)
          var arrS = this.getChildren(this.root2, this.root2G)
          // compare new list of concepts if we find items in source not found in
          // target, join root 1 and root 2 otherwise do not join.
          var newItems = []
          newItems = arrT.filter((item)=>{arrS.indexOf(item) < 0})
          if(newItems.length>0){
            results.push({from:this.root2.uuid,to:this.root1.uuid,what:'referent', depth:this.depth});
            this.tree.add(this.root2.uuid);
            this.tree.add(this.root1.uuid);
          }
        } else if (this.root1.referent == this.root2.referent) {
          // The items are the same, but do they have more knowledge?
          // get Concepts connected to these Concepts
          var arrT = this.getChildren(this.root1, this.root1G)
          var arrS = this.getChildren(this.root2, this.root2G)
          // compare new list of concepts if we find items in source not found in
          // target, join root 1 and root 2 otherwise do not join.
          var newItems = []
          newItems = arrT.filter((item)=>{return arrS.indexOf(item) < 0})
          if(newItems.length>0){
            results.push({from:this.root2.uuid,to:this.root1.uuid,what:'referent', depth:this.depth});
            this.tree.add(this.root2.uuid);
            this.tree.add(this.root1.uuid);
          }
        } else {
          this.invalid = true
        }
        this.level.push(results)
        return this.growR(rule)
        //end of start
      };

      this.growR = function(rule){
        if(this.invalid){return undefined;}
        var results = [];
        var expand = this.level[this.depth];
        this.depth += 1;
        for (let i = 0; i < expand.length; i++) {
          var sourCon = this.root2G.find('uuid', expand[i].from).out;
          var tarCon = this.root1G.find('uuid', expand[i].to).out;
          //console.log('if new information is available');
          //console.log(sourCon.length>tarCon.length);
          for (let j = 0; j < tarCon.length; j++) {
            // if we have not seen this already
            if(!this.tree.has(tarCon[j])) {
              // set temp for target relation to compare to
              var temp1 = this.root1G.find('uuid',tarCon[j]);
              for (let k = 0; k < sourCon.length; k++) {
                // if we have not seen this already
                if(!this.tree.has(sourCon[k])){
                  // set temp for source relation to compare to
                  var temp2 = this.root2G.find('uuid',sourCon[k])
                  // if they are the same, merge them
                  if (temp1.label == temp2.label) {
                    // this logic needs to be looked at <------
                    // if new information is available, as in there is more relations in the source
                    results.push({from:temp2.uuid,to:temp1.uuid,what:'relation',depth:this.depth, parent:expand[i]})
                    this.tree.add(temp1.uuid);
                    this.tree.add(temp2.uuid);
                  }
                }
              }
            }
          }
        }
        //console.log('checking for results');
        // if we found children that match go ahead and push to level 1/3/5 etc
        if(results.length>0){
          this.level.push(results);
          return this.growC(rule)
        } else {
          //console.log('found no further relations');
          return this.finish(rule);
        }
      };

      this.growC = function(rule) {
        //console.log('checking more concepts');
        if(this.invalid){return undefined;}
        var results = [];
        var expand = this.level[this.depth];
        this.depth += 1;
        for (let i = 0; i < expand.length; i++) {
          var sourCon = this.root2G.find('uuid', expand[i].from).arcs;
          var tarCon = this.root1G.find('uuid', expand[i].to).arcs;
          //console.log('going over new concepts', tarCon);
          for (var targetI in tarCon) {
            //console.log(tarCon[targetI]);
            // if we don't have seen this already
            if(!this.tree.has(tarCon[targetI])) {
              // set temp for target relation to compare to
              //console.log('new concept', this.root1G.find('uuid',tarCon[targetI]));
              var temp1 = this.root1G.find('uuid',tarCon[targetI]);
              for (var sourceI in sourCon) {
                // set temp for source relation to compare to
                var temp2 = this.root2G.find('uuid',sourCon[sourceI]);
                if(!this.tree.has(temp2.uuid)){

                  if(temp1.label == temp2.label) {
                    // if they are the same, merge them
                    if(temp1.referent == '*' && temp2.referent != '*') {
                      //console.log('Found new referent to merge');
                      results.push({from:temp2.uuid,to:temp1.uuid,what:'referent', depth:this.depth, parent:expand[i]});
                      this.tree.add(temp2.uuid);
                      this.tree.add(temp1.uuid);
                    // if source referent is star and it has more relations than this might be new information
                    } else if (temp2.referent == '*') {
                      // The source can be specialised by the target.
                      // get Concepts connected to these Concepts
                      var arrT = this.getChildren(temp1, this.root1G)
                      var arrS = this.getChildren(temp2, this.root2G)
                      // compare new list of concepts if we find items in source not found in
                      // target, join root 1 and root 2 otherwise do not join.
                      var newItems = []
                      newItems = arrT.filter((item)=>{arrS.indexOf(item) < 0})
                      if(newItems.length>0){
                        results.push({from:temp2.uuid,to:temp1.uuid,what:'referent', depth:this.depth});
                        this.tree.add(temp2.uuid);
                        this.tree.add(temp1.uuid);
                      }
                      // if both referents are the same, then we need to check if new relations are available
                    } else if (temp1.referent == temp2.referent) {
                        //console.log('Referents the same, need to check relations');
                        // get Concepts connected to these Concepts
                        var arrT = this.getChildren(temp1, this.root1G)
                        var arrS = this.getChildren(temp2, this.root2G)
                        // compare new list of concepts if we find items in source not found in
                        // target, join root 1 and root 2 otherwise do not join.
                        var newItems = []
                        newItems = arrT.filter((item)=>{arrS.indexOf(item) < 0})
                        if(newItems.length>0){
                          results.push({from:temp2.uuid,to:temp1.uuid,what:'referent', depth:this.depth});
                          this.tree.add(temp2.uuid);
                          this.tree.add(temp1.uuid);
                        }
                    } else {
                        //console.log('No fit on this concept, handle me depending on root1');
                        //console.log(temp1);
                        //console.log(temp2);
                        this.tree.add(temp2.uuid);
                        this.tree.add(temp1.uuid);
                    }
                  } else {
                    //console.log('no match')
                  }
                }
              }
            }
          }
        }

        //check if results were found
        if(results.length>0){
          //console.log('found new concepts');
          this.level.push(results);
          return this.growR(rule)
        } else {
          //console.log('found no further concepts');
          return this.finish(rule);
        }
      };

      this.finish = function(rule) {
        // take tree and turn into one or more join concepts
        //console.log('finishing up');
        // initiate a result array
        var projections = [];

        var levels = this.level.length;
        while(this.level.length>0){
          var level = this.level.pop();
          for(let i=0;i<level.length;i++){
            if(!level[i].seen){
              var array = [];
              array.push(level[i]);
              level[i].seen = true;
              if(level[i].parent){
                var parent = level[i].parent;
                for(let j=levels;j>0;j--){
                  if(parent.parent){
                    array.push(parent);
                    parent.seen = true;
                    parent = parent.parent;
                  } else {
                    //should be a root
                    array.push(parent);
                    parent.seen = true;
                    break;
                  }
                }
              }
              array = array.reverse();
              projections.push(array);
            }
          }
        }

        //if this is a rule, check that source is fully covered with each projection, remove any that are
        // fully covering the source
        // let's try doing it with an approximation, if we have fully covered the source, then we should have
        // the same amount of merges than there is concepts and relations in the source...
        if(rule){
          var sourceTotal = this.root2G.concept.length + this.root2G.relation.length;
          for (let i = 0; i < projections.length; i++) {
            // if the rule is not fully covered, it does not apply
            if( !(projections[i].length>=sourceTotal) ) {
              projections.splice(i,1);
              i--;
            }
          }
        }

        return projections;
      }


      this.getChildren = function(Concept, Graph) {
        var relations = Concept.out;
        var children = [];
        for(let i = 0; i < relations.length; i++) {
          var temp = Graph.find('uuid', relations[i])
          for(let index in temp.arcs) {
            if (temp.arcs[index] != Concept.uuid) {
              children.push(Graph.find('uuid', temp.arcs[index]))
            }
          }
        }
        if(children.length <= 0) {return undefined};
        return children;
        //end of getChildren
      }

      //end of tree
    },

    project: function(target, source, rule){
      // make a copy of each graph
      var t = JSON.parse(JSON.stringify(target))
      t = Object.assign(new Thing(), t)
      var s = JSON.parse(JSON.stringify(source))
      s = Object.assign(new Thing(), s)

      // copy the list of concepts for both graphs
      var targetCon = t.concept
      var sourceCon = s.concept
      //array of possible projections
      var posProj = []
      // set found to false to indicate default, which is no projection
      var found = false
      // array for results
      var result = []
      // iterate over concepts and if the same label create a tree walker
      for(let i=0;i<targetCon.length;i++){
        for(let j=0;j<sourceCon.length;j++){
          //if they are the same type, create a 'possible' projection with the 2 concepts
          if(targetCon[i].label == sourceCon[j].label) {
            var tree = new infUtil.Tree(target, targetCon[i], source, sourceCon[j], rule)
            posProj.push(tree)
            found = true
          }
        }
      }
      // none found return empty array
      if(!found){ return []}
      // We found one or more, let's do some extra work
      // A projection is only valid when 2 conditions are met overall
      // 1 - it introduces new information in form of relations and concepts not found in target
      // 2 - it can add information into a referent '*' in the target
      for (let i = 0; i < posProj.length; i++) {
        var temp = posProj[i];
        var projection = temp.start(rule);
        if(temp.invalid) {
          //console.log('No projection found');
        } else {
          for (let j = 0; j < projection.length; j++) {
            var temp = {name:source.label+'cP', concepts:projection[j]}
            result.push(temp)
          }
        }
      }

      return result;
      //end of project
    }
    //end of public interface
  }
// end of inutil
}) ()
