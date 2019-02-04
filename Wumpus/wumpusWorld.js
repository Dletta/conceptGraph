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
/* Testing world inference */

var world = new worldBasis ();

var p = parse("All Person has some Name::[Person:**x](chrst ?x?y)[Name:**y]");

var born = new Thing('bornInOz', 'rule', uuidv4());

/* hypothesis */
var person = born.addConcept('Person', 'concept', uuidv4(), {}, '*');
var bornC = born.addConcept('Born', 'concept', uuidv4(), {}, '*');
var country = born.addConcept('Country', 'concept', uuidv4(), {}, 'Oz');

born.addRelation('object', 'relation', uuidv4(), {0:bornC,1:person});
born.addRelation('location', 'relation', uuidv4(), {0:bornC,1:country});

/* conclusion */
var test = born.addConConcept('Government', 'concept', uuidv4(), {}, '*')
born.addConRelation('member', 'relation', uuidv4(), {0:country,1:person,3:test});



var born2 = new Thing('bornInOz', 'rule', uuidv4());

/* hypothesis */
var person = born2.addConcept('Person', 'concept', uuidv4(), {}, '*');
var bornC = born2.addConcept('Born', 'concept', uuidv4(), {}, '*');
var country = born2.addConcept('Country', 'concept', uuidv4(), {}, 'USA');

born2.addRelation('object', 'relation', uuidv4(), {0:bornC,1:person});
born2.addRelation('location', 'relation', uuidv4(), {0:bornC,1:country});


/* conclusion */

// Empty conclusion indicates a negation;

/**********************************************************************************/

var canon = new axiomStore('canon');
canon.add(p);

var law = new axiomStore('law');
law.add(born);

var neg = new axiomStore('neg');
neg.add(born2);

var tinmanA = parse("tinmanBornInOz::[Person:Tinman*x](object?x?y)[Born*y](location?y?z)[Country:Oz*z]");

world.init(tinmanA, canon, law, neg);

world.tell(tinmanA);

var alice = parse("dorothyBornInUSA::[Person:Dorothy*x](object?x?y)[Born*y](location?y?z)[Country:USA*z]");
world.tell(alice);


var alice2 = parse("dorothyBornInOz::[Person:Dorothy*x](object?x?y)[Born*y](location?y?z)[Country:Oz*z]");
world.tell(alice2);

//*/

/* Testing the solution of a logic puzzle */

/* Puzzle Description:
 For all birds/owners/cities/months found out the corresponding
 birds/owners/cities/months
 */

var puzzle = new worldBasis();

// canon contains background knowledge such as
var canon = new axiomStore('canon');

// Relationships of months
/* January to May are covered for this puzzle
var month1 = parse('January::[Month:January*x]');
canon.add(month1);

var month2 = parse('February::[Month:February*x]');
canon.add(month2);

var month3 = parse('March::[Month:March*x]');
canon.add(month3);

var month4 = parse('April::[Month:April*x]');
canon.add(month4);

var month5 = parse('May::[Month:May*x]');
canon.add(month5);
*/
var months = parse('Months::[Month:January*x](Before?x?y)(After?y?x)[Month:February*y](Before?y?z)(After?z?y)[Month:March*z](Before?z?a)(After?a?z)[Month:April*a](Before?a?b)(After?b?a)[Month:May*b]');
canon.add(months);

// There is 5 cities specified
var city1 = parse('Rolling Hills::[City:RollingHills*x]');
canon.add(city1);
var city2 = parse('Panorama City::[City:PanoramaCity*x]');
canon.add(city2);
var city3 = parse('Julian::[City:Julian*x]');
canon.add(city3);
var city4 = parse('Berkley::[City:Berkley*x]');
canon.add(city4);
var city5 = parse('Inyokern::[City:Inyokern*x]');
canon.add(city5);
// there is 5 birds specified
var bird1 = parse('Canary::[Bird:Canary*x]');
canon.add(bird1);
var bird2 = parse('Lovebird::[Bird:Lovebird*x]');
canon.add(bird2);
var bird3 = parse('Finch::[Bird:Finch*x]');
canon.add(bird3);
var bird4 = parse('Lorikeet::[Bird:Lorikeet*x]');
canon.add(bird4);
var bird5 = parse('Parrot::[Bird:Parrot*x]');
canon.add(bird5);
/*
// All owners have bought their birds on certain months in a certain city
var schema = parse('OwnerBuyBirdMonth::[Owner:**x](agent?x?y)[Own:**y](object?y?z)[Bird:**z](object?c?z)[Buy:**c](pTime?c?a)[Month:**a](location?c?b)[City:**b]');
canon.add(schema);
// */
var law = new axiomStore('law');

// Add a law and a negation to allow for a quick test of behavior

var born = new Thing('bornInOz', 'rule', uuidv4());

/* hypothesis */
var person = born.addConcept('Person', 'concept', uuidv4(), {}, '*');
var bornC = born.addConcept('Born', 'concept', uuidv4(), {}, '*');
var country = born.addConcept('Country', 'concept', uuidv4(), {}, 'Oz');

born.addRelation('object', 'relation', uuidv4(), {0:bornC,1:person});
born.addRelation('location', 'relation', uuidv4(), {0:bornC,1:country});

/* conclusion */
var test = born.addConConcept('Government', 'concept', uuidv4(), {}, '*')
born.addConRelation('member', 'relation', uuidv4(), {0:country,1:person,3:test});

law.add(born);


var neg = new axiomStore('neg');

var no2Owners = parse('No two Owners::[Owner:**x](agent?x?y)[Buy:**y](agent?z?y)[Owner:**z]');
neg.add(no2Owners);



var testWorld = new worldBasis();

var testCanon = new axiomStore('test Canon');

var testSchema = parse('Test Person ::[Person:**x](has?x?y)[Name:**y]');
testCanon.add(testSchema);

var testNeg = new axiomStore('test Negation');
var twohead = parse('NoPersonHasTwoHeads::[Person:**x](has?x?y)[Head:**y](has?x?z)[Head:**z]');
testNeg.add(twohead);

var perJohn = parse('John ::[Person:John*x]');


testWorld.init(perJohn, testCanon, law, testNeg);
testWorld.tell(perJohn);

var johnName = parse('JohnsName is John::[Person:John*x](has?x?y)[Name:John*y]');
testWorld.tell(johnName); //will not work, as it does not 'add new Information' currently
var bethelbrox = parse('Bethelbrox::[Person:Bethelbrox*x](has?x?y)[Head:Bel*y](has?x?z)[Head:Brox*z]');
testWorld.tell(bethelbrox);
