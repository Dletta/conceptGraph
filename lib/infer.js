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
  this.canon = new axiomStore('Canon');
  this.law = new axiomStore('Laws');
  this.neg = new axiomStore('Negating Laws');
  this.states = [];
  this.init = function (graph) {
    var graphS = new axiomStore('stateOrigin');
    graphS.add(graph)
    var state = {state: graphS, origin:true};
    this.states.push(state);
  };
  this.tell = function(graph) {
    console.log(this.states.length);
    var limit = 30;
    var step = 1;
    for(var state of this.states) {
      console.log(state);
      if(step>limit){break;};
      //check if this state is not blocked before doing something
      if(!state.blocked){
        state.blocked = false;
        //Player moves into state by
        // either joining two compatible graphs in state
        // or selecting any canon graph and joining it with any graph in state
        // for now we will assume new information was given (which becomes the first item)
        // If no join is possible Player passes.
        var playerPass = false;
        var opponentPass = false;
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
        if(resO == 'neg') {
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
        }
      }
      step +=1
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
    }
    return false;
  };
}

/* Testing world inference */

var world = new worldBasis ();

var p = parse("All Person has some Name::[Person:**x](chrst ?x?y)[Name:**y]");
world.canon.add(p)

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

world.law.add(born);

var born2 = new Thing('bornInOz', 'rule', uuidv4());

/* hypothesis */
var person = born2.addConcept('Person', 'concept', uuidv4(), {}, '*');
var bornC = born2.addConcept('Born', 'concept', uuidv4());
var country = born2.addConcept('Country', 'concept', uuidv4(), {}, 'USA');

born2.addRelation('object', 'relation', uuidv4(), {0:bornC,1:person});
born2.addRelation('location', 'relation', uuidv4(), {0:bornC,1:country});


/* conclusion */

// Empty conclusion indicates a negation;
world.neg.add(born2);


var tinmanA = parse("tinmanBornInOz::[Person:Tinman*x](object?x?y)[Born*y](location?y?z)[Country:Oz*z]");

world.init(tinmanA);

var alice = parse("dorothyBornInUSA::[Person:Dorothy*x](object?x?y)[Born*y](location?y?z)[Country:USA*z]");
var result = world.tell(alice);
console.log('We found: ', result);

var alice2 = parse("dorothyBornInOz::[Person:Dorothy*x](object?x?y)[Born*y](location?y?z)[Country:Oz*z]");
var result = world.tell(alice2);
console.log('We found: ', result);
