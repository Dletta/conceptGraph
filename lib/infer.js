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
  this.canon = new axiomStore('canon');
  this.law = new axiomStore('law');
  this.neg = new axiomStore('neg');
  this.init = function (graph, canon, law, neg) {
    this.canon = canon;
    this.law = law;
    this.neg = neg;
    //Make a copy of the provided Graph
    var graph = Object.assign(new Thing(), graph);
    var graphS = new axiomStore('stateOrigin');
    graphS.add(graph)
    var state = {state: graphS, origin:true};
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
      }
      step +=1
    }
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
        result[i].playerPass = false; //player moved in this state
        this.opfor(graph, result[i]);
      }
    } else {
      console.log('Joining into Canon?');
      var moveCanon = new InfOp(graph, this.canon, 'schema')
      var result = moveCanon.start();
      if(result){
        console.log('Joined into Canon, player moved');
        this.playerPass = false;
        for(var i=0;i<result.length;i++){
          result[i].playerPass = false;
          this.opfor(graph, result[i]);
        }
      } else {
          console.log('No Join, player pass');
          this.playerPass = true;
          state.playerPass = true;
          this.opfor(graph, state); //send original state to opfor
      }
    }
  };
  this.opfor = function(graph, state){
    console.log('Opfor moves');
    console.log('Apply any negation?');
    console.log(this.neg);
    var moveNeg = new InfOp(graph, this.neg, 'law');
    result = moveNeg.start();
    if(result){
      console.log('Negation found, invalidating state');
      this.opponentPass = false;
      for(var i=0;i<result.length;i++){
        if(result[i].negated) {
          result[i].opponentPass = false;
          this.final(result[i]); //return state to the engine
        }
        // no opponentPass false added here, as this is just splitting
        // off the negations from the possible states
        this.opfor(graph, result[i]); // no negation found, restart
      }
    } else {
      console.log('No negation found, applying a law?');
      var moveLaw = new InfOp(graph, this.law, 'law');
      result = moveLaw.start();
      if (result) {
        console.log('Opfor moved, applied law');
        this.opponentPass = false;
        for(var i=0;i<result.length;i++){
          result[i].opponentPass = false;
          this.player(graph, result[i]);// continue until end condition
        }
      } else {
        console.log('Opfor passed');
        this.opponentPass = true;
        state.opponentPass = true;
        if(state.playerPass && state.opponentPass) {
          this.final(state);
        }
      }
    }
  };
  this.final = function(state) {
    if(state.negated) {
      console.log('state negated', state);
      this.states.push(state);
      return false;
    }
    if(state.playerPass && state.opponentPass) {
      this.states.push(state);
      return true;
    }
    console.log('uncaught state', state);
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
      var state = this.projection(this.w, this.axioms[i], rule); //returns an object symbolizing the possible join
      if(state){
        if(state.negated){ this.w.negated = true; this.w.index = i;};
        state.index = i;
        this.posStates.push(state);
      }
    }
    if(this.posStates.length <= 0){console.log('no possible joins');return false;}
    for(var i=0;i<this.posStates.length;i++){
      var index = this.posStates[i].index;
      var nextState = {how:this.axioms[index]};
      nextState.state = new axiomStore('state');
      if(this.w.negated == true && this.w.index == index) {
        nextState.blocked = true;
        console.log('blocked state');
      }
      var newState = this.join(this.w, this.axioms[i], this.posStates[i], rule);
      console.log('new state');
      console.log(newState);
      nextState.state.add(newState);
      console.log(nextState);
      this.result.push(nextState);
      console.log(this.result);
    }
    return this.result;
  };
  this.projection = function (target, source, rule) {
    var v = Object.assign(new Thing(), target);
    var w = Object.assign(new Thing(), source);
    var score = 0;
    var target = v.concept;
    var source = w.concept;
    var result = {name:w.label+'cP',concepts:[]}
    for(var i = 0; i<target.length;i++){
      for(var j = 0; j<source.length; j++) { // <--- This logic makes or breaks the inference
        if(target[i].label === source[j].label){ //same type?
          if(source[j].referent == '*' || source[j].referent == undefined) { // source a schema or something like 'Born'
            if(target[i].uuid != source[j].uuid) {
              var joinConcept = {from: source[j].uuid, to: target[i].uuid};
              score += 1;
              result.concepts.push(joinConcept);
            }
          } else if (target[i].referent == source[j].referent) { //the same
            if(target[i].uuid != source[j].uuid) {
              var joinConcept = {from: source[j].uuid, to: target[i].uuid};
              score -= 1;
              result.concepts.push(joinConcept);
            }
          }
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
        result.score = score;
        result.negated = true;
        console.log('resultNegated',result);
        return result;
      }
      for(var i=0;i<v.conConcept.length;i++){
        var joinConcept = {from:v.conConcept[i].uuid, to:v.conConcept[i].uuid};
        result.concepts.push(joinConcept);
        v.addConcept(v.conConcept[i]);
      }
      for(var i=0;i<v.conRelation.length;i++){
        v.addRelation(v.conRelation[i]);
      }
    }

    if(result.concepts.length > 0) {
      if(result.concepts.length == 1) {
        if(!result.concepts[0].referent) {//undefined referent
          return undefined;
        }
      }
      if(score < 0) {
        return undefined;
      }
      result.score = score;
      console.log('result',result);
      return result;
    } else {
      return undefined;
    }
  };
  this.join = function(target, source, join, rule) {
    console.log('join called');
    console.log(join);
    console.log(rule);
    if(rule) {
      for(let i=0;i<source.conRelation.length;i++){
        source.addRelation(source.conRelation[i])
      }
      for(let i=0;i<source.conConcept.length;i++){
        source.addConcept(source.conConcept[i])
      }
    }
    for(var i=0;i<join.concepts.length;i++){
      var concept = join.concepts[i]; //what we are joining from source and from
      let targetCon = target.find('uuid',concept.to)
      let sourceCon = source.find('uuid',concept.from)
      if(sourceCon.value == '' || sourceCon.value == targetCon.value || sourceCon.value == '*'){
        sourceCon.value = targetCon.value;
        console.error(`Joining ${targetCon.label}:${targetCon.value} with ${sourceCon.label}:${sourceCon.value}`);
      } else {
        console.error(`Cannot join ${targetCon.label}:${targetCon.value} with ${sourceCon.label}:${sourceCon.value}`);
      }
      for(var r = 0; r < target.relation.length; r++) {
        var relation = target.relation[r];
        var relationFound = mergeRelation(relation, targetCon.uuid, sourceCon.uuid);
      }
      target.deleteConcept(targetCon.uuid);
      sourceCon.from = targetCon.uuid;
      target.addConcept(sourceCon);
    }
    this.extendGraph(target, source, rule);
    return target;
  };
  this.extendGraph = function (target, source, rule) {
    var i = 0;
    var l = source.concept.length;
    for(i;i<l;i++){
      if(!target.find('uuid', source.concept[i].uuid)){
        target.addConcept(source.concept[i]);
      }
    }
    var i = 0;
    var l = source.relation.length;
    for(i;i<l;i++){
      if(!target.find('uuid', source.relation[i].uuid)){
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

/**********************************************************************************/

var canon = new axiomStore('canon');
canon.add(p);

var law = new axiomStore('law');
law.add(born);

var neg = new axiomStore('neg');
neg.add(born2);

var tinmanA = parse("tinmanBornInOz::[Person:Tinman*x](object?x?y)[Born*y](location?y?z)[Country:Oz*z]");

world.init(tinmanA, canon, law, neg);

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
