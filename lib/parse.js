const nearley = window.nearley;

var parse = function (text) {
  // generate new parser
  var parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
  // feed text to parser
  parser.feed(text);
  // ast becomes traversable
  var ast = parser.results;
  // traverse result
  for(var result of ast) {
    // split out data from the parser
    var tree = result.data;
    // create a new 'axiom' that contains the parsed inputs
    var temp = new Thing(result.label, result.type, uuidv4());
    // Build a list of concepts and add it to axioms from parsed input
    for(var item of tree) {
      if(item[0].type === 'concept'){
        temp.addConcept(item[0].label, item[0].type, uuidv4(), {}, item[0].ref, item[0].identifier);
      }
    }
    // Build Relations by connecting corresponding Concepts from the axiom
    for(var item of tree) {
      if(item[0].type === 'relation'){
        // attach arcs from the tree
        var arcs = getArcs(temp, item[0]);
        // create relation in graph
        temp.addRelation(item[0].label, item[0].type, uuidv4(), arcs, item[0].ref);
      }
    }
  }

  return temp;
  /* Parsing helpers */

  function getArcs (axiom, relation) {
    //shorten syntax
    var arc = relation.arcI;
    var arcs = {};
    //go through each identifier
    for(var i=0;i<arc.length;i++){
      //remove ? and add *
      var temp = arc[i].slice(1,2)
      var ident = '*';
      ident += temp;
      //then find uuid of item
      var res = axiom.find('identifier', ident)
      //add uuid to arcs object
      arcs[i] = res.uuid;
    }
    return arcs;
  }

}
/* Tests

var testInput = "John Goes::[Person:John*x](Go?x?y)[Destination:Boston*y]";
console.log(testInput);
var res = parse(testInput);
translate(res);

var testinput = "John Walks::[Person:John*x](Walk?x?y)[Destination:Train Station*y](Thinks?x?z)[Thought:Happy*z]"
console.log(testinput);
var res1 = parse(testinput);
translate(res1);

*/
