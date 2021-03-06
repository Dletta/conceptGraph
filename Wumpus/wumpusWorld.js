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

/* Inference Rules about the Wumpus World */

/* The Wumpus World has only a few rules. The player always start in Square x 0 y 3 (00 is top left)
*   in each room the player may receive a percept.
*   If the player feels a breeze an adjacent room is actually a pit.
*   If the player smells a stench, the Wumpus is in an adjacent room.
*   If the player perceives a glitter, he is in the same room as a piece of gold. (He should grab it)
*   If the player falls into a pit or ends up in the same room with the Wumpus, he dies.
*/

var wump = new Reasoner(eventS);
wump.eventS.sub('unify', wump.unify.bind(wump));

var world1 = parse("World::[Room:03*y(1.0)](adjacent?y?x)[Room:02*x(1.0)](adjacent?x?y)")
wump.assert(world1)
var world2 = parse("WorldTwo::[Room:02*x(1.0)](adjacent?x?y)[Room:01*y(1.0)](adjacent?y?x)")
wump.assert(world2)
var world3 = parse("WorldThree::[Room:01*x(1.0)](adjacent?x?y)[Room:00*y(1.0)](adjacent?y?x)")
wump.assert(world3)
var world4 = parse("WorldFour::[Room:03*x(1.0)](adjacent?x?y)[Room:13*y(1.0)](adjacent?y?x)")
wump.assert(world4)
var world5 = parse("WorldFive::[Room:13*x(1.0)](adjacent?x?y)[Room:12*y(1.0)](adjacent?y?x)")
wump.assert(world5)
var world6 = parse("WorldSix::[Room:12*x(1.0)](adjacent?x?y)[Room:11*y(1.0)](adjacent?y?x)")
wump.assert(world6)
var world7 = parse("WorldSeven::[Room:11*x(1.0)](adjacent?x?y)[Room:10*y(1.0)](adjacent?y?x)")
wump.assert(world7)

var initialGraph = parse("Initial::[Player:You*x(1.0)](location?x?y)[Room:03*y(1.0)](pTime?a?y)[Time:0*a(1.0)](percept?a?b)[Breeze:False*b(0.0)](state?y?z)[Safe:Yes*z(1.0)]")

var notAPit = parse("Not a Pit::[Player:You*x(1.0)](location?x?y)[Room:**y](pTime?a?y)[Time:**a](percept?a?b)[Breeze:False*b(0.0)]")

var notAPitCon = parse("Not A Pit Conclusion::[Player:You*x(1.0)](location?x?y)[Room:**y](adjacent?y?z)[Room:**z](be?z?a)[Pit:Ahh*a(-1.0)]")
notAPit.setCon(notAPitCon, wump)

wump.law.add(notAPit);

//wump.assert(initialGraph)
console.log(wump.tell(initialGraph));


// traversal to build a nice graph viz

function exhausted(node,edges,opt) {
  var temp;
  var arr = Object.keys(node);
  var i = 0;
  var l = arr.length;
  for(;i<l;i++){
    if(typeof(node[arr[i]]) !== 'string' && node[arr[i]].name){
      if(!edges.has(node.name+arr[i])){
        var temp = arr[i];
        break;
      }
    }
  }
  if(!opt) {
    if(temp){
      return false;
    } else {
      return true;
    }
  } else {
    if(temp){
      return temp;
    }
  }
};

function explore(graph, cb, node, key) {
  var stack = [];
  var nodes = new Map();
  var edges = new Map();
  nodes.set(node.name, {id:node.name});
  var start = node;
  var u = node;
  stack.push(u)
  do{
    while(!exhausted(u, edges)){
      var edge = exhausted(u, edges, true);
      var v = u[edge];
      nodes.set(v.name, {id:v.name});
      edges.set(u.name+v.name, {source:u.name,target:v.name})
      stack.push(v)
      u = v;
    }
    var y = u;
    while(!(stack.length==0)){
      y = stack.pop();
      if(!exhausted(y,edges)){
        stack.push(y)
        u = y;
        break;
      }
    }
  }while(!(stack.length==0))
  console.log('done');
  graph.nodes = makeNodes(nodes);
  graph.edges = makeEdges(edges);
  cb();
};
