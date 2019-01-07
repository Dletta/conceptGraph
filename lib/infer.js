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
    var ruled = new GOper(schema.w, this.R, 'rule');
    ruled.start();
    var ready = this.execute(ruled.w)
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

/* If a Person was born in Oz then that person is a holder of citizenship */

var born = new Thing('bornInOz', 'axiom', uuidv4());

/* hypothesis */
var person = born.addConcept('Person', 'concept', uuidv4(), {}, '*');
var bornC = born.addConcept('Born', 'concept', uuidv4());
var country = born.addConcept('Country', 'concept', uuidv4(), {}, 'Oz');

born.addRelation('object', 'relation', uuidv4(), {0:bornC,1:person});
born.addRelation('location', 'relation', uuidv4(), {0:bornC,1:country});

/* conclusion */

born.addRelation('member', 'relation', uuidv4(), {0:country,1:person});

console.log('telling');
console.log(translate(born));

knowB.tell(born);

for(var item in knowB.G.axioms) {
  console.log('Translation of ', knowB.G.axioms[item].label);
  console.log(translate(knowB.G.axioms[item]));
}
