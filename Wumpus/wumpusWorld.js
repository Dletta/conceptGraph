/*
* AI agent in the wumpus world, who takes a knowledge base
* and receives percepts during the live in the cave;
*/

function Agent (kb, name) {
  this.kb = kb;
  this.tell = function(perceptSent, timestep) {
  };
  this.ask = function(actionQuery) {
    this.tell(actionSent)
    return action;
  };
}

var kB = new axiomStore('KB');

var indy = new Agent(kB, 'Indiana Jones');

var gCounter = 0;

/* For inference I need to be able to do exat matching of nested graphs */
/* Access Graphs from an evaluator or from another context */

/*
* Compare two graphs.
* @param {graph} graph1 - one to be compared
* @param {graph} graph2 - two to be compared
* @returns true if exactly the same, other wise returns false
*/

function deepCompare (graph1, graph2) {
  let one = graph1;
  let two = graph2;
  let result = false;

  for(let item of one.concept) {
    for(let item2 of two.concept) {
      if(item.uuid == item2.uuid){
        console.log(item2);
        result = true;
        break;
      }
    }
  }

  return result;
}

/*
* Inference function
*
*/

function inference () {
  this.start = function () {

  };
  this.iterate = function() {

  };
  this.deiterate = function() {

  };
  this.erasure = function() {

  };
}


/* Test inference with below graph showing that if you are born in Oz
 then you are a citizen. Tinman was born in Oz, therefore it is true he is a citizen.
 */

var born = new Thing('bornInOz', 'axiom', uuidv4());

var person = born.addConcept('Person', 'concept', uuidv4(), {}, '*');
var bornC = born.addConcept('Born', 'concept', uuidv4());
var country = born.addConcept('Country', 'concept', uuidv4(), {}, 'Oz');

born.addRelation('object', 'relation', uuidv4(), {0:bornC,1:person});
born.addRelation('location', 'relation', uuidv4(), {0:bornC,1:country});

kB.axioms.push(born);

var citizenAxiom = new Thing('citizenOfOz', 'axiom', uuidv4());

var citizen = citizenAxiom.addConcept('Citizen', 'concept', uuidv4(), {}, '*');
person.coreferent = citizen;
citizen.coreferent = person;
var countryCit = citizenAxiom.addConcept('Country', 'concept', uuidv4(), {}, 'Oz');

citizenAxiom.addRelation('member', 'relation', uuidv4(), {0:countryCit,1:citizen});

kB.axioms.push(citizenAxiom);

var negContext2 = new Thing('negativeContext2', 'axiom', uuidv4());
var prop2 = negContext2.addConcept('Proposition', 'concept', uuidv4(), {}, citizenAxiom);
negContext2.addRelation('negative', 'relation', uuidv4(), {0:prop2});
citizenAxiom.parent = negContext2;

kB.axioms.push(negContext2);

var negContext1 = new Thing('negativeContext1', 'axiom', uuidv4());
var prop1 = negContext1.addConcept('Proposition', 'concept', uuidv4(), {}, born);
negContext1.addRelation('negative', 'relation', uuidv4(), {0:prop1})
born.parent = negContext1;

kB.axioms.push(negContext1);

var tinmanA = new Thing('tinmanBorninOz', 'axiom', uuidv4());

var tinman = tinmanA.addConcept('Person', 'concept', uuidv4(), {}, 'Tinman');
var bornTin = tinmanA.addConcept('Born', 'concept', uuidv4());
var countryTin = tinmanA.addConcept('Country', 'concept', uuidv4(), {}, 'Oz');
tinmanA.addRelation('object', 'relation', uuidv4(), {0:bornTin,1:tinman});
tinmanA.addRelation('location', 'relation', uuidv4(), {0:bornTin,1:countryTin});
<<<<<<< HEAD



function translate(graph) {
  var string = '';
  var i = 0;
  var l = graph.relation.length;
  for(i;i<l;i++){
    let temp = graph.relation[i];
    console.log(temp);
    string += graph.find('uuid',temp.arcs[0]).label;
    string += ':';
    string += graph.find('uuid',temp.arcs[0]).value;
    string += ' ';
    string += graph.relation[i].label;
    string += ' ';
    string += graph.find('uuid', temp.arcs[1]).label;
    string += ':';
    string += graph.find('uuid', temp.arcs[1]).value;
    string += ' ';
    string += '::; '
  }
  console.log(string);
}
=======
>>>>>>> b7e641decf4f1ef2119ed6f883457c87cf7f4adf
