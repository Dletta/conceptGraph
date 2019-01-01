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

/*
* A inference system based on closed world
* and CGs
* Using Pierces solutions
*/


/*
* Logic Or Relation
* Creates a graph representing an or relation
*/
function or (graphX, graphY) {
  var x = graphX; //this should be an axiom
  var y = graphY; //this should be an axiom

  /* define 3 axioms
    1 axiom which is [Proposition: GraphX]
  */

  /*
    2 axiom which is [Proposition: GraphY]
    */
    
  /*
    3 axiom wich is (NEG)->[Proposition:
                      (NEG)->[Proposition: [Proposition: GraphX]]
                      (NEG)->[Proposition: [Proposition: GraphY]]
                    ]
    */


}
