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
      string += graph.find('uuid',temp.arcs[item]).referent;
      string += '/';
      string += graph.find('uuid',temp.arcs[item]).fuzzy;
      string += '(';
      string += temp.arcs[item];
      string += ')'
      string += ' ';
      if(item == 0) {
        string += temp.label;
        string += ' ';
      } else {
        string += 'and';
        string += ' ';
      }
    }

  }
  string += 'END. '
  console.log(string);
}

function Splitarray () {
  this.array = [];
  this.add = function (item) {
    var found = false;
    for(let i = 0;i<this.array.length;i++){
      //iterate over array and check that the item is not already in
      if(item.from == this.array[i].from && item.to == this.array[i].to){
        found = true;
      }
    }
    if(!found){this.array.push(item);}
  }
}
