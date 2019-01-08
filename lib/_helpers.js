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
  for(var i=0;i<graph.relation.length;i++){
    var temp = graph.relation[i];
    for(var item in temp.arcs) {
      string += graph.find('uuid',temp.arcs[item]).label;
      string += ':';
      string += graph.find('uuid',temp.arcs[item]).value;
      string += ' ';
      if(item == 0) {
        string += temp.label;
        string += ' ';
      } else {
        string += 'and';
        string += ' ';
      }
    }
    string += 'END. '
  }
  console.log(string);
}
