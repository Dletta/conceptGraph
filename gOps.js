/* Derived formation rules
  1 - projection
  2 - maximal join
*/

/* Projection
 Taking a master graph w, graph v (e.g. a query) is a projection of w when
 v can be derived from w by applying n>=0 detach ops or n>=0 restrict ops
 */
/*
 for(each concept relation) {
  apply detachment on relation that is not in v
 }
 return subset of w that should contain v;

 In Gun a projection is achieved by doing gun.get('edges').map().once
  and only keeping the edges that are found in the query v


  var projection = (query) {
    this.queryG = query;
    this.result = [];
    this.method = function(query, result, relation, key) {
      if(relation is found in query){
        result.push(relation) //this results in multiple projective origins v,w
      } else {
        return
      }
    },
    this.start {
      gun.get('relations').map().once(this.method.bind(this, query, this.result))
    }
  }

  var maxiJoin = (graph1, graph2) {
    this.result = new Graph;
    this.graphV = graph1;
    this.graphW = graph2;
    this.graphU = kernel(a,b,c); //u is maximal common projection;
    this.method = function () {
      u is max common project to kernel k if
        no graph t is a common projection with v and w but is not identical
        to u
      u is a mx common projection in respect to kernel k. A maximal join of
        v and w with repsect to k is a graph obtained by joining v and w
        via u, where the concept b (in u) is joined to c (in w).
        (which means the common concept of the 3 graphs are joined)
    }
  }
*/

/*
* Represents Concepts and values that need to be included for CG
* to work.
* @constructor
* @param {string} label - label for the concept e.g. Person
* @param {string, int, undefined} value - an actual Person, Number etc for this concept
*  if no actual value is available pass undefined
* @param {'A','E1','E-set'} quant - Passes a quantifier for the concept,
*  this is to make sure the reasoner knows what to return.
* @param {string} uuid - uuid for this concept
*/

function Concept (label, value, quant, uuid) {
  this.uuid = uuid;
  this.label = label; //string - only
  this.value = value; // ints or strings
  this.quant = quant;
  /*
 if(value === undefined && quant === undefined){
   this.value = undefined;
   this.quant = undefined;
   // concept indefinite -> selector
 } else if (value) {
   this.value = value;
   this.quant = undefined;
   // concept constant -> a defined thing
   function permissible to check  if value is permissible on a given sort label
 } else if (quant) {
   this.value = undefined;
   this.quant = quant;
 // concept quantified ->  one of four value A E1 E-set
}
*/
}

/*
* Represents a concept relation e.g. agent, patient of describing how two concepts
* connect to each other.
* @constructor
* @param {string} label - label for the relation
* @param {alphanumeric} uuid - uuid for this relation
* @param {object} source - concept from which the relation comes from
* @param {object} target - concept to which the relation goes to
*/

function Relation (label, uuid, source, target){
  this.uuid = uuid;
  this.label = label;
  this.source = source;
  this.target = target;
}

/*
* Represents a axiom (container for a CG)
* @param {string} label - label for the axiom
*/

function Axiom (label) {
 this.label = label;
 this.concept = [];
 this.relation = [];
 this.addC = function (item) {
   item.uuid = uuidv4();
   this.concept.push(item);
   return item.uuid;
 };
 this.addR = function (item) {
   item.uuid = uuidv4();
   this.relation.push(item);
   return item.uuid;
 };
 this.find = function (label) {
   var i = 0;
   var lC = this.concept.length;
   for(i;i<lC;i++){
     if(this.concept[i].label === label) {
       return this.concept[i];
     }
   }
   var y = 0;
   var lR = this.relation.length;
   for(y;y<lR;y++){
     if(this.relation[y].label === label) {
       return this.relation[y];
     }
   }
 };
}

/*
* Represents a store of axioms for a domain
* @constructor
* @param {string} domainLabel - label of the domain
*/

function axiomStore (domainLabel) {
 this.label = domainLabel;  // label
 this.axioms = [];  // array to store axioms
 /*
 * find a specific axiom in the axiom store
 */
 this.find = function (label) {
   var i = 0;
   var l = this.axioms.length;
   for(i;i<l;i++){
     if(this.axioms[i].label === label) {
       return this.axioms[i];
     }
   }
   console.log('Error: no relation found');
 };
 /*
 * Algorithm to create an answer graph from a query and a axiomStore
 * @param {graph/axiom} graph - a well-formed CG with ? on concepts we solve for.
 * @returns {graph} - graph, which contains an answer including additional infor-
 *  mation that led to the results.
 */
 this.query = function (graph) {
   // projection from one graph to another
   // get the list of relations in the query graph
   var relArr = graph.relation;
   console.log(relArr);
   console.log(graph);
   // check each axiom for relations that are the same
   var candidate = [];
   var i = 0;
   var j = 0;
   var l = this.axioms.length;
   var lj = relArr.length;
   for(j;j<lj;j++){
     for(i;i<l;i++){
       var temp = this.axioms[i].find(relArr[j].label);
       console.log(this.axioms[i]);
       console.log(relArr[j].label);
       console.log(temp);
       if(temp) {candidate.push(this.axioms[i]);break;}
     }
   }
   console.log(candidate);
   // score join probability
   // / maximal common Projection
   // execute join
   // execute value propagation
   // checks per algo
   // return answer graph
 }
}

/*
* generates uuid and returns an alphanumeric string
* @returns {string} uuid
*/

function uuidv4 () {
 return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxx'.replace(/[xy]/g, function(c) {
   var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
   return v.toString(16);
 })
}

/*
* make an instance of a axiomStore and add a few axioms to play with
*/

var rStore = new axiomStore ('app');

/*
*                           | Number : E1 |
*                                  ^
*                                  |
*                               ( Res )
*                                  ^
*                                  |
* | Number : A | -> ( arg1 ) -> | Sum | <- ( arg2 ) <- | Number : A |
*
*/

var add = new Axiom('sum');
var number1 = new Concept('Number', undefined, 'A', uuidv4());
add.addC(number1);
var number2 = new Concept('Number', undefined, 'A', uuidv4());
add.addC(number2);
var sum = new Concept('Sum', undefined, undefined, uuidv4());
add.addC(sum);
var numberE = new Concept('Number',undefined,'E1', uuidv4());
add.addC(numberE);
var arg1 = new Relation('arg1', uuidv4(), number1.uuid, sum.uuid);
add.addR(arg1);
var arg2 = new Relation('arg2', uuidv4(), number2.uuid, sum.uuid);
add.addR(arg2);
var res = new Relation('res', uuidv4(), sum.uuid, numberE.uuid);
add.addR(res);

var manhiper = new Axiom('manager');
var manager = new Concept('Manager', undefined, 'E1', uuidv4());
manhiper.addC(manager);
var hire = new Concept('Hire', undefined, undefined, uuidv4());
manhiper.addC(hire);
var agent = new Relation('agent', uuidv4(), manager, hire);
manhiper.addR(agent);
var person = new Concept('Person', undefined, 'eSet', uuidv4());
manhiper.addC(person);
var patient = new Relation('patient', uuidv4(), hire, person);
manhiper.addR(patient);

var hireDate = new Axiom('hire Date');
var date = new Concept('Date', undefined, 'E1', uuidv4());
hireDate.addC(date);
hireDate.addC(hire);
hireDate.addC(person);
var patient1 = new Relation('patient', uuidv4(), hire, person);
hireDate.addR(patient1);
var at = new Relation('at', uuidv4(), hire, date);

/* Adding axioms to the store */

rStore.axioms.push(add);
rStore.axioms.push(manhiper);
rStore.axioms.push(hireDate);

/* Create a query graph
*
*  | Person:? | <- ( patient ) <- | Hire | <- ( agent ) <- | Manager:Jake |
*
*/

var query = new Axiom('queryGraph');
query.addC(hire);
var person1 = new Concept('Person', '?', undefined, uuidv4());
query.addC(person1);
var patient2 = new Relation('patient', uuidv4(), hire, person);
query.addR(patient2);
var manager1 = new Concept('Manager', 'Jake', undefined, uuidv4());
query.addC(manager1);
var agent1 = new Relation('agent', uuidv4(), hire, manager);
query.addR(agent1);
var date1 = new Concept('Date', '?', undefined, uuidv4());
query.addC(date1);
var at = new Relation('at', uuidv4(), hire, date1);
query.addR(at);
