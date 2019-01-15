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

function worldBasis () {
  this.states = [];
  this.playerPass = false;
  this.opponentPass = false;
  this.limit = 30;
  this.init = function (graph, canon, law, neg) {
    //Make a copy of the provided Graph
    var graph = Object.assign(new Thing(), graph);
    var graphS = new axiomStore('stateOrigin');
    graphS.add(graph)
    var state = {state: graphS, origin:true, canon:canon, law:law, neg:neg};
    //each state keeps a copy of the world basis, not a reference...
    this.states.push(state);
  };
  this.tell = function(graph) {
    var graph = Object.assign(new Thing(), graph);
    console.log(this.states.length);
    var step = 1;
    for(var state of this.states) {
      console.log(state);
      if(step>this.limit){break;};
      //check if this state is not blocked before doing something
      if(!state.blocked){
        state.blocked = false;
        this.player(graph, state);
/*        //Player moves into state by
        // either joining two compatible graphs in state
        // or selecting any canon graph and joining it with any graph in state
        // for now we will assume new information was given (which becomes the first item)
        // If no join is possible Player passes.

        var nextState = {parent:state, how:graph, blocked:false};
        nextState.state = new axiomStore('state');
        // player moves tries to join new information into the state
        console.log('Trying to join into state');
        var move = new GOper(graph, state.state, 'schema');
        var res = move.start(); // executing the join
        if(res) {
          // were able to join to another graph in state
          console.log('joined into state, player moved');
          nextState.state.add(res);
          playerPass = false;
        } else {
          // if we were not able to join into state, we will join into canon
          console.log('trying to join to canon');
          var moveCan = new GOper(graph, this.canon);
          var res = moveCan.start(); //executing join
          if(res){
            // if we were able to join to canon, we move on
            console.log('joined into canon, player moved');
            nextState.state.add(res);
            playerPass = false;
          } else {
            // we were not able to move, we are passing
            console.log('no join possible, state stays');
            res = graph;
            playerPass = true;
          }
        }
        //Opponents turn.
        //Opponents checks whether denial works in this state. (Blocks state)
        //Opponent applies any laws to any graph in C;
        //If no law is satisfied, Opponent passes;

        //check if we can join to a negation
        console.log('opponent tries to negate');
        var moveO = new GOper(nextState.state.axioms[0], this.neg, 'law');
        var resO = moveO.start(); // executing the join
        if(resO.neg) {
          // we found a negation, blocking this context
          console.log('negation found, blocked state', nextState);
          nextState.blocked = true;
          opponentPass = false;
        } else {
          console.log('trying to find a law that applies');
          // we did not find a negation checking if a law works
          var moveLaw = new GOper(res, this.law, 'law');
          var resO = moveLaw.start(); // executing the join
          if(resO){
            // Found a law we could apply
            console.log('found a law to apply, oppose moved');
            nextState.state.axioms[0] = resO;
            opponentPass = false;
          } else {
            console.log('no law that applied, state is unchanged');
            opponentPass = true;
          }
        }*/
      }
      step +=1/*
      // if player did not pass; New state
      if (!playerPass) {
        console.log('player moved');
        if (opponentPass) {
          console.log('opponent passed, new state added to states');
          this.states.push(nextState);
        } else {
          console.log('opponent moved, new state added to states, unless blocked');
          //if nextState is not negated
          if(!nextState.blocked) {
            this.states.push(nextState);
          }
        }
      } else if (playerPass) {
        console.log('player passed');
        if(opponentPass){
          console.log('opponent passed');
          return true;
        }
      }
      //If no state is left in WB. Player loses.
      // Player losing should return false (meaning we can't accept this fact)
      //If both player and opponent pass in succession. Player wins.
      // Player winning should return true (meaning we accept this fact)
    */}
    return false;

  };
  this.player = function(graph, state) {
    console.log('Player move');
    console.log('Joining into state?');
    var moveState = new InfOp(graph, state.state, 'schema');
    var result = moveState.start();
    if(result){
      console.log('Joined into state, player moved');
      this.playerPass = false;
      for(var i=0;i<result.length;i++){
        this.opfor(graph, result[i]);
      }
    } else {
      console.log('Joining into Canon?');
      var moveCanon = new InfOp(graph, state.canon, 'schema')
      var result = moveCanon.start();
      if(result){
        console.log('Joined into Canon, player moved');
        this.playerPass = false;
        for(var i=0;i<result.length;i++){
          this.opfor(graph, result[i]);
        }
      } else {
          console.log('No Join, player pass');
          this.playerPass = true;
        }
    }
  };
  this.opfor = function(graph, state){
    console.log('Opfor moves');
  };
}

function InfOp (graph, axioms, mode) {
  this.v = Object.assign(new Thing(), graph);
  this.w = Object.assign(new Thing(), graph);
  this.mode = mode | 'schema';
  this.axioms = axioms.axioms;
  this.posStates = [];
  this.result = [];
  this.start = function () {
    var rule = false;
    if(mode == 'law'){ rule = true;};
    for(var i=0; i< this.axioms.length; i++){
      var state = this.projection(this.w, this.axioms[i], rule);
      if(state == 'neg'){ this.w.neg = true; this.w.index = i};
      if(state){
        state.index = 0;
        this.posStates.push(state);
      }
    }
    if(this.posStates.length <= 0){console.log('no possible joins');return false;}
    for(var i=0;i<this.posStates.length;i++){
      var index = this.posStates[i].index;
      var nextState = {how:this.axioms[index]};
      nextState.state = new axiomStore('state');
      if(this.w.neg == true && this.w.index == index) {
        nextState.blocked = true;
      }
      var newState = this.join(this.w, this.axioms[i], this.posState[i], rule);
      nextState.state.add(newState);
      this.result.push(nextState);
    }
    return this.result;
  };
  this.projection = function (graph1, graph2, rule) {
    let v = Object.assign(new Thing(), graph1);
    let w = Object.assign(new Thing(), graph2);
    let score = 0;
    let arr1 = v.concept;
    let arr2 = w.concept;
    var result = {name:w.label+'cP',concepts:[]}
    for(var i = 0; i<arr1.length;i++){
      for(var j = 0; j<arr2.length; j++) {
        if(arr1[i].label === arr2[j].label &&
          (arr2[j].referent == '*' ||
          arr1[i].referent == arr2[j].referent)) {
          score += 1;
          result.concepts.push(arr2[j]);
        }
      }
    }
    if(rule){
      console.log('rule mode');
      if(result.concepts.length < w.concept.length){
        console.log(result, 'does not satisfy Hypothesis');
        return undefined;
      }
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

    if(result.concepts.length > 0) {
      if(result.concepts.length == 1) {
        if(!result.concepts[0].referent) {
          return undefined;
        }
      }
      result.score = score;
      console.log('result',result);
      return result;
    } else {
      return undefined;
    }
  };
  this.join = function(graph1, graph2, join, rule) {
    if(rule) {
      for(let i=0;i<graph2.conRelation.length;i++){
        graph2.addRelation(graph2.conRelation[i])
      }
      for(let i=0;i<graph2.conConcept.length;i++){
        graph2.addConcept(graph2.conConcept[i])
      }
    }
    for(var i=0;i<join.concepts.length;i++){
      var concept = join.concepts[i];
      let concept1 = graph1.find('label',concept.label)
      let concept2 = graph2.find('label',concept.label)
      if(concept2.value == '' || concept2.value == concept1.value || concept2.value == '*'){
        concept2.value = concept1.value;
      } else {
        console.error(`Cannot join ${concept1.label}:${concept1.value} with ${concept2.label}:${concept2.value}`);
      }
      for(var r = 0; r < graph1.relation.length; r++) {
        var relation = graph1.relation[r];
        var relationFound = mergeRelation(relation, concept1.uuid, concept2.uuid);
      }
      graph1.deleteConcept(concept1.uuid);
      graph1.addConcept(concept2);
    }
    this.extendGraph(graph1, graph2, rule);
    graph1.function = graph2.function;
    return graph1;
  };
  this.extendGraph = function (target, source, rule) {
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
  };
}















/* Testing world inference */

var world = new worldBasis ();

var p = parse("All Person has some Name::[Person:**x](chrst ?x?y)[Name:**y]");

var born = new Thing('bornInOz', 'rule', uuidv4());

/* hypothesis */
var person = born.addConcept('Person', 'concept', uuidv4(), {}, '*');
var bornC = born.addConcept('Born', 'concept', uuidv4());
var country = born.addConcept('Country', 'concept', uuidv4(), {}, 'Oz');

born.addRelation('object', 'relation', uuidv4(), {0:bornC,1:person});
born.addRelation('location', 'relation', uuidv4(), {0:bornC,1:country});

/* conclusion */
var test = born.addConConcept('Government', 'concept', uuidv4(), {}, '*')
born.addConRelation('member', 'relation', uuidv4(), {0:country,1:person,3:test});



var born2 = new Thing('bornInOz', 'rule', uuidv4());

/* hypothesis */
var person = born2.addConcept('Person', 'concept', uuidv4(), {}, '*');
var bornC = born2.addConcept('Born', 'concept', uuidv4());
var country = born2.addConcept('Country', 'concept', uuidv4(), {}, 'USA');

born2.addRelation('object', 'relation', uuidv4(), {0:bornC,1:person});
born2.addRelation('location', 'relation', uuidv4(), {0:bornC,1:country});


/* conclusion */

// Empty conclusion indicates a negation;



var tinmanA = parse("tinmanBornInOz::[Person:Tinman*x](object?x?y)[Born*y](location?y?z)[Country:Oz*z]");

world.init(tinmanA, p, born, born2);

var alice = parse("dorothyBornInUSA::[Person:Dorothy*x](object?x?y)[Born*y](location?y?z)[Country:USA*z]");
var result = world.tell(alice);
console.log('We found: ', result);

var alice2 = parse("dorothyBornInOz::[Person:Dorothy*x](object?x?y)[Born*y](location?y?z)[Country:Oz*z]");
var result = world.tell(alice2);
console.log('We found: ', result);

/* Testing the solution of a logic puzzle */

/* Puzzle Description:
 For all birds/owners/cities/months found out the corresponding
 birds/owners/cities/months
 */

var puzzle = new worldBasis();

// canon contains background knowledge such as

// Relationships of months
// January to May are covered for this puzzle
var months = parse('Months::[Month:January*x](Before?x?y)(After?y?x)[Month:February*y](Before?y?z)(After?z?y)[Month:March*z](Before?z?a)(After?a?z)[Month:April*a](Before?a?b)(After?b?a)[Month:May*b]');
puzzle.canon.add(months);
// There is 5 owners identified
var owner1 = parse('Joan::[Owner:Joan*x]');
puzzle.canon.add(owner1);
var owner2 = parse('Ida::[Owner:Ida*x]');
puzzle.canon.add(owner2);
var owner3 = parse('Pam::[Owner:Pam*x]');
puzzle.canon.add(owner3);
var owner4 = parse('Faye::[Owner:Faye*x]');
puzzle.canon.add(owner4);
var owner5 = parse('Celia::[Owner:Celia*x]');
puzzle.canon.add(owner5);
// There is 5 cities specified
var city1 = parse('Rolling Hills::[City:RollingHills*x]');
puzzle.canon.add(city1);
var city2 = parse('Panorama City::[City:PanoramaCity*x]');
puzzle.canon.add(city2);
var city3 = parse('Julian::[City:Julian*x]');
puzzle.canon.add(city3);
var city4 = parse('Berkley::[City:Berkley*x]');
puzzle.canon.add(city4);
var city5 = parse('Inyokern::[City:Inyokern*x]');
puzzle.canon.add(city5);
// there is 5 birds specified
var bird1 = parse('Canary::[Bird:Canary*x]');
puzzle.canon.add(bird1);
var bird2 = parse('Lovebird::[Bird:Lovebird*x]');
puzzle.canon.add(bird2);
var bird3 = parse('Finch::[Bird:Finch*x]');
puzzle.canon.add(bird3);
var bird4 = parse('Lorikeet::[Bird:Lorikeet*x]');
puzzle.canon.add(bird4);
var bird5 = parse('Parrot::[Bird:Parrot*x]');
puzzle.canon.add(bird5);
// All owners have bought their birds on certain months in a certain city
var schema = parse('OwnerBuyBirdMonth::[Owner:**x](agent?x?y)[Buy*y](object?y?z)[Bird:**z](pTime?y?a)[Month:**a](location?y?b)[City:**b]');
puzzle.canon.add(schema);

// Add a law and a negation to allow for a quick test of behavior

var born = new Thing('bornInOz', 'rule', uuidv4());

/* hypothesis */
var person = born.addConcept('Person', 'concept', uuidv4(), {}, '*');
var bornC = born.addConcept('Born', 'concept', uuidv4());
var country = born.addConcept('Country', 'concept', uuidv4(), {}, 'Oz');

born.addRelation('object', 'relation', uuidv4(), {0:bornC,1:person});
born.addRelation('location', 'relation', uuidv4(), {0:bornC,1:country});

/* conclusion */
var test = born.addConConcept('Government', 'concept', uuidv4(), {}, '*')
born.addConRelation('member', 'relation', uuidv4(), {0:country,1:person,3:test});

puzzle.law.add(born);

var born2 = new Thing('bornInOz', 'rule', uuidv4());

/* hypothesis */
var person = born2.addConcept('Person', 'concept', uuidv4(), {}, '*');
var bornC = born2.addConcept('Born', 'concept', uuidv4());
var country = born2.addConcept('Country', 'concept', uuidv4(), {}, 'USA');

born2.addRelation('object', 'relation', uuidv4(), {0:bornC,1:person});
born2.addRelation('location', 'relation', uuidv4(), {0:bornC,1:country});


/* conclusion */

// Empty conclusion indicates a negation;
puzzle.neg.add(born2);


console.log('PUZZLE ///////////////////////////////////////////////////////////////////////');
var first = parse('First Clue::[Bird:Lorikeet*x](object?y?x)[Buy*y](location?y?z)[City:Berkley*z]');
puzzle.init(first);

var result = puzzle.tell(first);
console.log(result, 'first');
