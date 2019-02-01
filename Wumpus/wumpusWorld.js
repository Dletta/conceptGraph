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


console.log('PUZZLE ///////////////////////////////////////////////////////////////////////');

var init1 = parse('Init One Joan::[Owner:Joan*x](agent?x?y)[Own:1*y](object?y?z)[Bird:**z](object?c?z)[Buy:1*c](pTime?c?a)[Month:**a](location?c?b)[City:**b]');
canon.add(init1);
var init2 = parse('Init Two Ida::[Owner:Ida*d](agent?d?e)[Own:2*e](object?e?f)[Bird:**f](object?g?f)[Buy:2*g](pTime?g?h)[Month:**h](location?g?i)[City:**i]');
canon.add(init2);
var init3 = parse('Init Three Pam::[Owner:Pam*j](agent?j?k)[Own:3*k](object?k?l)[Bird:**l](object?m?l)[Buy:3*m](pTime?m?n)[Month:**n](location?m?o)[City:**o]');
canon.add(init3);
var init4 = parse('Init Four Faye::[Owner:Faye*p](agent?p?q)[Own:4*q](object?q?r)[Bird:**r](object?s?r)[Buy:4*s](pTime?s?t)[Month:**t](location?s?u)[City:**u]');
canon.add(init4);
var init5 = parse('Init Five Celia::[Owner:Celia*v](agent?v?w)[Own:5*w](object?w?X)[Bird:**X](object?Y?X)[Buy:5*Y](pTime?Y?Z)[Month:**Z](location?Y?A)[City:**A]');
canon.add(init5);


console.log('first');
var first = parse('First Clue::[Bird:Lorikeet*x](object?y?x)[Buy:**y](location?y?z)[City:Berkley*z]');
puzzle.init(first, canon, law, neg);


console.log('first');
var first = parse('First Clue::[Bird:Lorikeet*x](object?y?x)[Buy:**y](location?y?z)[City:Berkley*z]');
//puzzle.tell(first);
console.log(puzzle.states);

console.log('second');
var second = parse('Second Clue::[Bird:Canary*x](object?y?x)[Buy:**y](pTime?y?z)[Month:**z](Before?z?a)[Month:**a](pTime?b?a)[Buy:**b](location?b?c)[City:PanoramaCity*c]');
//puzzle.tell(second);

console.log('thirdOne');
var thirdOne = parse('Third One Option::[Bird:Parrot*x](object?y?x)[Own:**y](agent?z?y)[Owner:Celia*z](object?a?x)[Buy:**a](pTime?a?b)[Month:March*b]');
//puzzle.tell(thirdOne);

console.log('thirdTwo');
var thirdTwo = parse('Third One Option::[Bird:Parrot*x](object?y?x)[Own:**y](agent?z?y)[Owner:Celia*z](object?a?x)[Buy:**a](location?a?b)[City:Inyokern*b]');
//puzzle.tell(thirdTwo);

console.log('fourth');
var fourth = parse('Fourth Clue::[Owner:Ida*x](agent?x?y)[Own:**y](object?y?z)[Bird:Lovebird*z](object?d?z)[Buy:**d](pTime?d?a)[Month:February*a]');
//puzzle.tell(fourth);

console.log('fifth');
var fifth = parse('Fifth Clue::[Bird:Parrot*x](object?y?x)[Buy:4*y]');
//puzzle.tell(fifth);

console.log('sixth');
var sixth = parse('Sixth Clue::[Owner:Pam*x](agent?x?y)[Own:2*y](object?y?z)[Bird:**z](object?a?z)[Buy:**a](pTime?a?b)[Month:**b](after?b?c)[Month:**c](pTime?d?c)[Buy:**d](object?d?e)[Bird:Lovebird*e]');
//puzzle.tell(sixth);

console.log('seven');
var seven = parse('Seventh Clue::[Bird:**x](object?y?x)[Buy:**y](location?y?z)[City:RollingHills*z](pTime?y?a)[Month:January*a]');
//puzzle.tell(seven);

console.log('eigth');
// */


var testWorld = new worldBasis();

var testCanon = new axiomStore('test Canon');

var testSchema = parse(' Test Person ::[Person:**x](has?x?y)[Name:**y]');
testCanon.add(testSchema);

var perJohn = parse('John ::[Person:John*x]');


testWorld.init(perJohn, testCanon, law, neg);
