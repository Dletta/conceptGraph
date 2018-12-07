/*
* The term that makes up the universe
* @constructor
* @param {string} label - a string to represent the thing
* @param {string} type - axiom, concept, relation, function?
* @param {uuid} uuid - unique identifier
* @param {object} arcs - objectArray of arcs in order as defined in ontology (relation)
* @param {string, int, undefined} value - value (concept)
*/

function Thing (label, type, uuid, arcs, value) {
  this.label = label;
  this.type = type;
  this.uuid = uuid;
  this.arcs = arcs;
  this.value = value;
  this.concept = []; //concept array for axioms
  this.relation = []; //relation array for axioms
  this.addC = function (item) {
    this.concept.push(item);
    return item.uuid;
  };
  this.addR = function (item) {
    this.relation.push(item);
    return item.uuid;
  };
  this.delC = function (uuid) {
    var i = 0;
    for(i;i<this.concept.length;i++){
      if(this.concept[i].uuid === uuid) {
        this.concept.splice(i,1);
      }
    }
  };
  this.delR = function (uuid) {
    var i = 0;
    for(i;i<this.relation.length;i++){
      if(this.relation[i].uuid === uuid) {
        this.relation.splice(i,1);
      }
    }
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
    return false;
  };
}

/* @comment for future development
So [Person:Jake Butterfield]-(hasView)-[PersonView] where hasView is in fact a relation with function getView(Name, View)
Assuming @param {graph} View - a view axiom. It can then retrieve data for each field in the view, by first finding Jake Butterfield's Record and then rendering the 'viewGraph' with said values
Aaaand if no value is passed from link 1 (Person Concept) then it knows to render an empty view
*/

/*
* Represents a store of axioms for a domain
* @constructor
* @param {string} domainLabel - label of the domain
*/

function axiomStore (domainLabel) {
 this.label = domainLabel;  // label
 this.axioms = [];  // array to store axioms
 //this.gunPath = gun.get(label); //define base path for db
 this.find = function (label) {
   var i = 0;
   var l = this.axioms.length;
   for(i;i<l;i++){
     if(this.axioms[i].label === label) {
       return this.axioms[i];
     }
   }
   console.log('Error: no axiom found');
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
* 'Number1 which is arg1 of sum and Number2 which is arg2 of sum, where Sum
* results in Number3'
*                              [Number3]
*                                  ^
*                                  |
*                               ( Res )
*                                  ^
*                                  |
*       [Number1] -> ( arg1 ) -> [Sum] <- ( arg2 ) <- [Number2]
*
*/

var add = new Thing('Sum Axiom', 'axiom', uuidv4());
var number1 = new Thing ('Number', 'concept', uuidv4());
add.addC(number1);
var number2 = new Thing('Number', 'concept', uuidv4());
add.addC(number2);
var sum = new Thing('Sum', 'concept', uuidv4());
add.addC(sum);
var numberE = new Thing('Number','concept', uuidv4());
add.addC(numberE);
var arg1 = new Thing('arg1', 'relation', uuidv4(), {source:number1.uuid,target:sum.uuid});
add.addR(arg1);
var arg2 = new Thing('arg2', 'relation', uuidv4(), {source:number2.uuid,target:sum.uuid});
add.addR(arg2);
var res = new Thing('res', 'relation', uuidv4(), {source:sum.uuid,target:numberE.uuid});
add.addR(res);

/*
* 'A manager is an agent of hiring the patient Person'
* [Manager]-(agent)-[Hire]-(patient)-[Person]
*
*/

var manhiper = new Thing('Manager Axiom', 'axiom', uuidv4());
var manager = new Thing('Manager', 'concept', uuidv4());
manhiper.addC(manager);
var hire = new Thing('Hire', 'concept', uuidv4());
manhiper.addC(hire);
var agent = new Thing('agent', 'relation', uuidv4(), {source:manager.uuid,target:hire.uuid});
manhiper.addR(agent);
var person = new Thing('Person', 'concept', uuidv4());
manhiper.addC(person);
var patient = new Thing('patient', 'relation', uuidv4(), {source:hire.uuid,target:person.uuid});
manhiper.addR(patient);

/*
* 'A person who is the patient of being hired, at a certain date. Where the date has a day of the week'
*
* [Date]-(at)-[Hire]-(patient)-[Person]
*   |
*  (has)
*   |
* [Day of the Week]
*
*/

var hireDate = new Thing('Hire Date Axiom', 'axiom', uuidv4());
var date = new Thing('Date', 'concept', uuidv4());
hireDate.addC(date);
hireDate.addC(hire);
hireDate.addC(person);
var patient1 = new Thing('patient', 'relation',uuidv4(), {source:hire.uuid,target:person.uuid});
hireDate.addR(patient1);
var at = new Thing('at', 'relation', uuidv4(), {source:hire.uuid,target:date.uuid});
var day = new Thing('Day of the Week', 'concept', uuidv4());
hireDate.addC(day);
var has = new Thing('has', 'relation', uuidv4(), {source:date.uuid,target:day.uuid});
hireDate.addR(has);

/* Adding axioms to the store */

aStore.axioms.push(add);
aStore.axioms.push(manhiper);
aStore.axioms.push(hireDate);
//render(add, 'cont')
//render(manhiper, 'cont')
//render(hireDate, 'cont')

/*
* Create a query graph for 'Who did Manager Jake hire and when?'
*                               [Date:?]
*                                   |
*                                  (at)
*                                   |
*  [Person:?] <- (patient) <- [Hire] <- (agent) <- [Manager:Jake]
*
*/

var query = new Thing('queryGraph', 'axiom', uuidv4());
var hire1 = new Thing('Hire', 'concept', uuidv4());
query.addC(hire1);
var person1 = new Thing('Person', 'concept', uuidv4(),{},'?');
query.addC(person1);
var patient2 = new Thing('patient', 'relation', uuidv4(), {source:hire1.uuid,target:person1.uuid});
query.addR(patient2);
var manager1 = new Thing('Manager', 'concept', uuidv4(),{} ,'Jake');
query.addC(manager1);
var agent1 = new Thing('agent', 'relation', uuidv4(), {source:hire1.uuid,target:manager1.uuid});
query.addR(agent1);
var date1 = new Thing('Date', 'concept', uuidv4(), {}, '?');
query.addC(date1);
var at = new Thing('at', 'relation', uuidv4(), {source:hire1.uuid,target:date1.uuid});
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
  var temp = new Thing(label, 'axiom', id);
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
  console.log(container);
  var div = document.createElement('div');
  var text = document.createTextNode(axiom.label);
  div.appendChild(text);
  div.setAttribute('name',axiom.label);
  div.setAttribute('id',axiom.uuid);
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

    var text = document.createTextNode(axiom.relation[i].arcs.source);
    div1.appendChild(text);

    var br = document.createElement('br');
    div1.appendChild(br);

    var text = document.createTextNode('target: ');
    div1.appendChild(text);

    var br = document.createElement('br');
    div1.appendChild(br);

    var text = document.createTextNode(axiom.relation[i].arcs.target);
    div1.appendChild(text);

    div1.setAttribute('name',axiom.relation[i].label);
    div1.setAttribute('class','relation');

    div.appendChild(div1);
  }

  container.appendChild(div);
}
