    var push = function() {
      var input = document.getElementById('editor');
      gun.get('functions').put({add:input.value});
      console.log(input.value + ' saved');
    }

    var pull = function(data, key) {
      var scr = document.createElement('script');
      scr.innerHTML = data;
      document.all[0].appendChild(scr);
      console.log('pulled function');
    }


/*
* make an instance of a axiomStore and add a few axioms to play with
*/

var aStore = new axiomStore ('app');


// Concept
// Term
// Definition
// Lexicon

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

// Term Axiom
// 		Term: a word or phrase used to describe a thing or to express a concept, 
// 		especially in a particular kind of language or branch of study.
var AxiomTerm = new Thing ('Term Axiom', 'axiom', uuidv4());



/*
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

*/

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
//render(manhiper, 'cont')
//render(hireDate, 'cont')

/*
* Execute test
*/

// var temp = new algoC (query, aStore);
// temp.start()

