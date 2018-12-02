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
*  if no actual value is available pass undefined or a quantifier '*', '@'
* @param {string} uuid - uuid for this concept
*/

function Concept (label, value, uuid) {
  this.uuid = uuid;
  this.label = label; //string - only
  this.value = value; // ints or strings
  this.link;
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
* @constructor
* @param {string} label - label for the axiom - Capitalize
*/

function Axiom (label) {
 this.label = label;
 this.concept = [];
 this.relation = [];
 this.addC = function (item) {
   this.concept.push(item);
   return item.uuid;
 };
 this.addR = function (item) {
   this.relation.push(item);
   return item.uuid;
 };
 this.find = function (prop, item) {
   var i = 0;
   var lC = this.concept.length;
   for(i;i<lC;i++){
     if(this.concept[i][prop] === item) {
       return this.concept[i];
     }
   }
   var y = 0;
   var lR = this.relation.length;
   for(y;y<lR;y++){
     if(this.relation[y][prop] === item) {
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

var aStore = new axiomStore ('app');

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

var add = new Axiom('Sum Axiom');
var number1 = new Concept('Number', undefined, uuidv4());
add.addC(number1);
var number2 = new Concept('Number', undefined, uuidv4());
add.addC(number2);
var sum = new Concept('Sum', undefined, uuidv4());
add.addC(sum);
var numberE = new Concept('Number',undefined, uuidv4());
add.addC(numberE);
var arg1 = new Relation('arg1', uuidv4(), number1.uuid, sum.uuid);
add.addR(arg1);
var arg2 = new Relation('arg2', uuidv4(), number2.uuid, sum.uuid);
add.addR(arg2);
var res = new Relation('res', uuidv4(), sum.uuid, numberE.uuid);
add.addR(res);

var manhiper = new Axiom('Manager Axiom');
var manager = new Concept('Manager', undefined, uuidv4());
manhiper.addC(manager);
var hire = new Concept('Hire', undefined, uuidv4());
manhiper.addC(hire);
var agent = new Relation('agent', uuidv4(), manager, hire);
manhiper.addR(agent);
var person = new Concept('Person', undefined, uuidv4());
manhiper.addC(person);
var patient = new Relation('patient', uuidv4(), hire, person);
manhiper.addR(patient);

var hireDate = new Axiom('Hire Date Axiom');
var date = new Concept('Date', undefined, uuidv4());
hireDate.addC(date);
hireDate.addC(hire);
hireDate.addC(person);
var patient1 = new Relation('patient', uuidv4(), hire, person);
hireDate.addR(patient1);
var at = new Relation('at', uuidv4(), hire, date);

/* Adding axioms to the store */

aStore.axioms.push(add);
aStore.axioms.push(manhiper);
aStore.axioms.push(hireDate);
//render(add, 'cont')
//render(manhiper, 'cont')
//render(hireDate, 'cont')
/* Create a query graph
*
*  | Person:? | <- ( patient ) <- | Hire | <- ( agent ) <- | Manager:Jake |
*
*/

var query = new Axiom('queryGraph');
query.addC(hire);
var person1 = new Concept('Person', '?', uuidv4());
query.addC(person1);
var patient2 = new Relation('patient', uuidv4(), hire, person);
query.addR(patient2);
var manager1 = new Concept('Manager', 'Jake', uuidv4());
query.addC(manager1);
var agent1 = new Relation('agent', uuidv4(), hire, manager);
query.addR(agent1);
var date1 = new Concept('Date', '?', uuidv4());
query.addC(date1);
var at = new Relation('at', uuidv4(), hire, date1);
query.addR(at);


/* Utility Functions for Prototype */

/*
* Create a new Axiom 'Container' in DOM
*/

function createView () {
  var label = prompt('What is the view called? (Capitalize)');
  var cont = document.getElementById('cont');
  var temp = document.createElement('div');
  temp.setAttribute('name',label);
  var id = uuidv4();
  temp.setAttribute('id',id);
  temp.setAttribute('class','axiom');
  var text = document.createTextNode(label);
  temp.appendChild(text);

  var span = document.createElement('span');
  span.innerHTML = 'Create Concept';
  span.setAttribute('class','button');
  span.setAttribute('onclick','createConcept("'+id+'")');
  temp.appendChild(span);

  var span = document.createElement('span');
  span.innerHTML = 'Create Relation';
  span.setAttribute('class','button');
  span.setAttribute('onclick','createRelation("'+id+'")');
  temp.appendChild(span);

  var span = document.createElement('span');
  span.innerHTML = 'Save Axiom';
  span.setAttribute('class','button');
  span.setAttribute('onclick','saveAxiom("'+id+'")');
  temp.appendChild(span);

  cont.appendChild(temp);
}

/*
* Create a new Concept in Axiom
* @param (string) id - id of containing axiom
*/

function createConcept (contId) {
  var label = prompt('What is this concept called?')
  var cont = document.getElementById(contId);
  var temp = document.createElement('div');
  temp.setAttribute('name',label);
  var id = uuidv4();
  temp.setAttribute('id',id);
  temp.setAttribute('class','concept');
  var text = document.createTextNode('label: '+label);
  temp.appendChild(text);
  var br = document.createElement('br');
  temp.appendChild(br);
  var text = document.createTextNode('uuid: '+id);
  temp.appendChild(text);
  var br = document.createElement('br');
  temp.appendChild(br);
  var text = document.createTextNode('Enter Value or leave empty: ');
  temp.appendChild(text);
  var input = document.createElement('input');
  temp.appendChild(input);
  var br = document.createElement('br');
  temp.appendChild(br);
  var text = document.createTextNode('Link: ');
  temp.appendChild(text);
  var br = document.createElement('br');
  temp.appendChild(br);
  var input = document.createElement('input');
  temp.appendChild(input);

  cont.appendChild(temp);
}
/*
* Create a new Relation in Axiom
* @param (string) id - id of containing axiom
*/

function createRelation (contId) {
  var label = prompt('What is this relation called?')
  var cont = document.getElementById(contId);
  var temp = document.createElement('div');
  temp.setAttribute('name',label);
  var id = uuidv4();
  temp.setAttribute('id',id);
  temp.setAttribute('class','relation');
  var text = document.createTextNode('label: '+label);
  temp.appendChild(text);
  var br = document.createElement('br');
  temp.appendChild(br);
  var text = document.createTextNode('uuid: '+id);
  temp.appendChild(text);
  var br = document.createElement('br');
  temp.appendChild(br);
  var text = document.createTextNode('Source:');
  temp.appendChild(text);
  var input = document.createElement('input');
  temp.appendChild(input);
  var br = document.createElement('br');
  temp.appendChild(br);
  var text = document.createTextNode('Target:');
  temp.appendChild(text);
  var input = document.createElement('input');
  temp.appendChild(input);

  cont.appendChild(temp);
}

/*
* Function that saves an axiom from the editor
* @param (string) aId - id of the axiom container
*/

function saveAxiom (aId) {
  var axiom = document.getElementById(aId);
  var label = axiom.getAttribute('name');
  var id = axiom.getAttribute('id');
  var temp = new Axiom(label);
  var cList = [];
  var rList = [];

  for (var i = 0; i < axiom.children.length; i++) {
    if(axiom.children[i].getAttribute('class') === 'concept'){
      cList.push(axiom.children[i]);
    } else if (axiom.children[i].getAttribute('class') === 'relation') {
      rList.push(axiom.children[i]);
    }
  }
  console.log(cList,rList);
  //continue going through both lists and creating objects and adding etc
}


/*
* Function that takes an axiom and creates a view from interval
* @param {axiom} axiom - axiom to render
* @param {uuid} contId - id of the container in the html code
*/

function render(axiom, contId) {
  var container = document.getElementById(contId);
  var div = document.createElement('div');
  var text = document.createTextNode(axiom.label);
  div.appendChild(text);
  div.setAttribute('name',axiom.label);
  div.setAttribute('id',axiom.label);
  div.setAttribute('class','axiom');

  var i = 0;
  var l = axiom.concept.length;
  for (i;i<l;i++) {
    var div1 = document.createElement('div');
    var text = document.createTextNode('label: ' + axiom.concept[i].label);
    div1.appendChild(text);
    var br = document.createElement('br');
    div1.appendChild(br);
    var text = document.createTextNode('uuid: ' + axiom.concept[i].uuid);
    div1.appendChild(text);
    var br = document.createElement('br');
    div1.appendChild(br);
    var text = document.createTextNode('value: '+ axiom.concept[i].value);
    div1.appendChild(text);
    var br = document.createElement('br');
    div1.appendChild(br);
    var text = document.createElement('input');
    text.setAttribute('id','val'+axiom.concept[i].uuid)
    div1.appendChild(text);
    div1.setAttribute('name',axiom.concept[i].label);
    div1.setAttribute('class','concept');
    div.appendChild(div1);
  }

  var i = 0;
  var l = axiom.relation.length;
  for (i;i<l;i++) {
    var div1 = document.createElement('div');
    var text = document.createTextNode('label: ' + axiom.relation[i].label);
    div1.appendChild(text);

    var br = document.createElement('br');
    div1.appendChild(br);

    var text = document.createTextNode('uuid: ' + axiom.relation[i].uuid);
    div1.appendChild(text);

    var br = document.createElement('br');
    div1.appendChild(br);

    var text = document.createTextNode('source: ');
    div1.appendChild(text);

    var br = document.createElement('br');
    div1.appendChild(br);

    var text = document.createTextNode(axiom.relation[i].source.uuid);
    div1.appendChild(text);

    var br = document.createElement('br');
    div1.appendChild(br);

    var text = document.createTextNode('target: ');
    div1.appendChild(text);

    var br = document.createElement('br');
    div1.appendChild(br);

    var text = document.createTextNode(axiom.relation[i].target.uuid);
    div1.appendChild(text);

    div1.setAttribute('name',axiom.relation[i].label);
    div1.setAttribute('class','relation');
    
    div.appendChild(div1);
  }

  container.appendChild(div);
}
