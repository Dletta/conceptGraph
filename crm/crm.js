
/*
* make an instance of a axiomStore and add a few axioms to play with
*/

var aStore = new axiomStore ('app');


// Concept
// Term
// Definition
// Lexicon

var html = new Thing('HTMLElement Axiom', 'axiom', uuidv4());

var number1 = new Thing ('Number', 'concept', uuidv4());
html.addConcept(number1);
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

console.log("Paste 'var add = function(a,b){return a+b;}'");


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

var query = new Thing('queryGraph', 'axiom', uuidv4());
/* Adding axioms to the store */

aStore.axioms.push(add);
render(add, 'cont')
//render(manhiper, 'cont')
//render(hireDate, 'cont')

/*
* Execute test
*/

var temp = new algoC (query, aStore);
temp.start()


/*
* Function that takes an axiom and creates a view from interval
* @param {axiom} axiom - axiom to render
* @param {uuid} contId - id of the container in the html code
*/

function render(axiom, contId) {
  var container = document.body;
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
