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


// Term Axiom
// 		Term: a word or phrase used to describe a thing or to express a concept,
// 		especially in a particular kind of language or branch of study.
var AxiomTerm = new Thing ('Term Axiom', 'axiom', uuidv4());

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
/* Adding axioms to the store */

aStore.axioms.push(add);
aStore.axioms.push(manhiper);
aStore.axioms.push(hireDate);

/*
* Execute test
*/

var temp = new algoC (query, aStore);
setTimeout(()=>temp.start(), 1000);
