/* Inference relies on all other files at this point, so make sure they are included in the right order */

/* Instantiate a knowledgeBase
The assumption is that you are defining this either with axiom sets of null or with 'pre-defined' axioms.
@param facts (axiomStore) : A Set of Graph representing inital knowledge about the world.
@param rules (axiomStore) : A Set of Graphs of type 'if-then'
*/

function knowledgeBase (facts, rules) {
  this.G = facts;
  this.R = rules;
  this.tell = function (graph) {
    var schema = new GOper(graph, this.G, 'schema');
    schema.start();
    var rule = new GOper(schema.w, this.R, 'law');
    rule.start();
    var ready = this.execute(rule.w)
    this.G.axioms.push(ready);
  };
  this.execute = function (graph) {
    /* replace functions with their results / eval */
    return graph;
  };
  this.ask = function(graph) {
    var result = new GOper(graph, this.G, 'ask');
    if(!result.w) {
      console.log('No answer found or not true');
      return false;
    } else {
      return result.w;
    }
  }
}

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
    for(var state of this.states) {
      console.log(state.state);
      //check if this state is not blocked before doing something
      if(!state.blocked){
        //Player moves into state by
        // either joining two compatible graphs in state
        // or selecting any canon graph and joining it with any graph in state
        // for now we will assume new information was given (which becomes the first item)
        // If no join is possible Player passes.
        var playerPass = false;
        var opponentPass = false;
        // player moves tries to join new information into the state
        var move = new GOper(graph, state.state);
        var res = move.start(); // executing the join
        if(res) {
          // were able to join to another graph in state
          playerPass = false;
        } else {
          // if we were not able to join into state, we will join into canon
          var moveCan = new GOper(graph, this.canon);
          var res = moveCan.start(); //executing join
          if(res){
            // if we were able to join to canon, we move on
            playerPass = false;
          } else {
            // we were not able to move, we are passing
            playerPass = true;
          }
        }
        //Opponents turn.
        //Opponents checks whether denial works in this state. (Blocks state)
        //Opponent applies any laws to any graph in C;
        //If no law is satisfied, Opponent passes;

        //check if we can join to a negation
        var moveO = new GOper(res, this.neg, 'law');
        var resO = move.start(); // executing the join
        if(resO == 'neg') {
          // we found a negation, blocking this context
          state.blocked = true;
          opponentPass = false;
        } else {
          // we did not find a negation checking if a law works
          var moveLaw = new GOper(res, this.law, 'law');
          var resO = moveLaw.start(); // executing the join
          if(resO){
            // Found a law we could apply
            opponentPass = false;
          } else {
            opponentPass = true;
          }
        }
      }
      // if player did not pass; New state
      if (!playerPass) {
        if (opponentPass) {
          this.states.push({state:res, parent:state, how:graph});
        } else {
          this.states.push({state:resO, parent:state, how:graph});
        }
      } else if (playerPass) {
        if(opponentPass){
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

var world = new worldBasis ();


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
var person = born.addConcept('Person', 'concept', uuidv4(), {}, '*');
var bornC = born.addConcept('Born', 'concept', uuidv4());
var country = born.addConcept('Country', 'concept', uuidv4(), {}, 'USA');

born.addRelation('object', 'relation', uuidv4(), {0:bornC,1:person});
born.addRelation('location', 'relation', uuidv4(), {0:bornC,1:country});


/* conclusion */

// Empty conclusion indicates a negation;
world.neg.add(born2);

var tinmanA = parse("tinmanBornInOz::[Person:Tinman*x](object?x?y)[Born*y](location?y?z)[Country:Oz*z]");

world.init(tinmanA);

var alice = parse("dorothyBornInUSA::[Person:Dorothy*x](object?x?y)[Born*y](location?y?z)[Country:USA*z]");
world.tell(alice);

/* Tests below, please ignore */

var facts = new axiomStore('facts');
var rules = new axiomStore('rules');

var knowB = new knowledgeBase (facts, rules);

/* simple rules to check if we can infer that tinman is a citizen of Oz */
/* Where did Tinman come from? Was he actually born? */

var tinmanA = new Thing('tinmanBorninOz', 'axiom', uuidv4());

var tinman = tinmanA.addConcept('Person', 'concept', uuidv4(), {}, 'Tinman');
var bornTin = tinmanA.addConcept('Born', 'concept', uuidv4());
var countryTin = tinmanA.addConcept('Country', 'concept', uuidv4(), {}, 'Oz');
tinmanA.addRelation('object', 'relation', uuidv4(), {0:bornTin,1:tinman});
tinmanA.addRelation('location', 'relation', uuidv4(), {0:bornTin,1:countryTin});

/* If a Person was born in Oz then that person is a holder of citizenship */

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

/* Query is tinman a member of Country Oz ? */

var query = new Thing('oz?', 'axiom', uuidv4());

var tinPerson = query.addConcept('Person', 'concept', uuidv4(), {}, '?');
var tinCountry = query.addConcept('Country', 'concept', uuidv4(), {}, 'Oz');

query.addConRelation('member', 'relation', uuidv4(), {0:tinCountry,1:tinPerson});

/* Execute Test */

console.log('setting rule');
console.log(translate(born));
knowB.R.axioms.push(born);

console.log('telling');
console.log(translate(tinmanA));
knowB.tell(tinmanA);


translate(knowB.ask(query));
