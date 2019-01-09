/* inference relies on all other files at this point, so make sure they are included in the right order */

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
    var rule = new GOper(schema.w, this.R, 'rule');
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
A world basis defines the initial world and schema (background knowledge) about the World
 from which reasoning can start. (We need to know for example what months are and birds etc)
A world basis also has Rules / Laws that define un-alterable truths. Not all schema is true,
 but it's possibly true, while rules are necessarily true. (As they are enforced).
A world basis contains a 'context' graph, which is a container of one possible state
 of the world after some action is taken. There is an initial context, that can be extended
 by adding information.
A world basis also contains individual markers which are uuids of 'real' things or data connected
 to a concept.
Rules are based on graph projection.
• A simple assertion has no conditions and only one assertion: ->.. v. //fact
• A disjunction has no conditions and two or more assertions: -> Vi,...,Vm.
• A simple denial has only one condition and no assertions: u -....
• A compound denial has two or more conditions and no assertions: ut,...,un -...
• A conditianal assertion has one or more conditions and one or more assertions: ut,...,un .... Vl....,v~
• An empty clause has no conditionsorassertions: ->.
• A Horn clause has at most one assertion; i.e. it is either
  an empty clause, a denial, a simple assertion, or a conditional assertion of the form
  ui ot ut -> v.
*/

function worldBasis () {
  this.canon = new axiomStore('Canon');
  this.law = new axiomStore('Laws');
  this.context = [];
  this.init = function (graph) {
    var context = {context: graph};
    this.context.push(context);
  };
  this.evalGame = function() {
    for(var context of this.context) {
      //Player moves into context by
      // either joining two compatible graphs in context
      // or selecting any canon graph and joining it with any graph in context
      //If no join is possible Player passes.

      //Opponents turn.
      //Opponents checks whether denial works in this context. (Blocks context)
      //Opponent applies any laws to any graph in C;
      //If no law is satisfied, Opponent passes;

      //If no context is left in W. Player loses.
      //If both player and opponent pass in succsion. Player wins.
    }
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


var tinmanA = new Thing('tinmanBorninOz', 'axiom', uuidv4());

var tinman = tinmanA.addConcept('Person', 'concept', uuidv4(), {}, 'Tinman');
var bornTin = tinmanA.addConcept('Born', 'concept', uuidv4());
var countryTin = tinmanA.addConcept('Country', 'concept', uuidv4(), {}, 'Oz');
tinmanA.addRelation('object', 'relation', uuidv4(), {0:bornTin,1:tinman});
tinmanA.addRelation('location', 'relation', uuidv4(), {0:bornTin,1:countryTin});

world.init(tinmanA);


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
