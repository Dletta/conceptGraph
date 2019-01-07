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

function translate(graph) {
  var string = '';
  var i = 0;
  var l = graph.relation.length;
  for(i;i<l;i++){
    let temp = graph.relation[i];
    string += graph.find('uuid',temp.arcs[0]).label;
    string += ':';
    string += graph.find('uuid',temp.arcs[0]).value;
    string += ' ';
    string += graph.relation[i].label;
    string += ' ';
    string += graph.find('uuid', temp.arcs[1]).label;
    string += ':';
    string += graph.find('uuid', temp.arcs[1]).value;
    string += ' ';
    string += '::; '
  }
  console.log(string);
}
