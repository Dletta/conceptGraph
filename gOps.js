
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
add.addConcept(number1);
var number2 = new Thing('Number', 'concept', uuidv4());
add.addConcept(number2);
var sum = new Thing('Sum', 'concept', uuidv4());
add.addConcept(sum);
var numberE = new Thing('Number','concept', uuidv4());
add.addConcept(numberE);
var arg1 = new Thing('arg1', 'relation', uuidv4(), {source:number1.uuid,target:sum.uuid});
add.addRelation(arg1);
var arg2 = new Thing('arg2', 'relation', uuidv4(), {source:number2.uuid,target:sum.uuid});
add.addRelation(arg2);
var res = new Thing('res', 'relation', uuidv4(), {source:sum.uuid,target:numberE.uuid});
add.addRelation(res);

/*
* 'A manager is an agent of hiring the patient Person'
* [Manager]-(agent)-[Hire]-(patient)-[Person]
*
*/

var manhiper = new Thing('Manager Axiom', 'axiom', uuidv4());
var manager = new Thing('Manager', 'concept', uuidv4());
manhiper.addConcept(manager);
var hire = new Thing('Hire', 'concept', uuidv4());
manhiper.addConcept(hire);
var agent = new Thing('agent', 'relation', uuidv4(), {source:manager.uuid,target:hire.uuid});
manhiper.addRelation(agent);
var person = new Thing('Person', 'concept', uuidv4());
manhiper.addConcept(person);
var patient = new Thing('patient', 'relation', uuidv4(), {source:hire.uuid,target:person.uuid});
manhiper.addRelation(patient);

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
hireDate.addConcept(date);
hireDate.addConcept(hire);
hireDate.addConcept(person);
var patient1 = new Thing('patient', 'relation',uuidv4(), {source:hire.uuid,target:person.uuid});
hireDate.addRelation(patient1);
var at = new Thing('at', 'relation', uuidv4(), {source:hire.uuid,target:date.uuid});
var day = new Thing('Day of the Week', 'concept', uuidv4());
hireDate.addConcept(day);
var has = new Thing('has', 'relation', uuidv4(), {source:date.uuid,target:day.uuid});
hireDate.addRelation(has);

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
query.addConcept(hire1);
var person1 = new Thing('Person', 'concept', uuidv4(),{},'?');
query.addConcept(person1);
var patient2 = new Thing('patient', 'relation', uuidv4(), {source:hire1.uuid,target:person1.uuid});
query.addRelation(patient2);
var manager1 = new Thing('Manager', 'concept', uuidv4(),{} ,'Jake');
query.addConcept(manager1);
var agent1 = new Thing('agent', 'relation', uuidv4(), {source:hire1.uuid,target:manager1.uuid});
query.addRelation(agent1);
var date1 = new Thing('Date', 'concept', uuidv4(), {}, '?');
query.addConcept(date1);
var at = new Thing('at', 'relation', uuidv4(), {source:hire1.uuid,target:date1.uuid});
query.addRelation(at);

/*
* Execute test
*/

var temp = new algoC (query, aStore);
temp.start()



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
