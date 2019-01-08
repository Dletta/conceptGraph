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
born.addRelation('member', 'relation', uuidv4(), {0:country,1:person,3:test});

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

/*

If Sally goes to the store, then Edward will go to the lake. If Edward goes to the lake, then Freddy will go home. If Sally goes to the store, which of the following statements must be true?

I Edward goes to lake
II freddy goes home
III freddy does not go home

(A)
I only
(B) II only
(C) III only
(D) I and II only
(E)

I and III only

Correct Answer: D
*/
