/*
* Find a Concept's uuid and overwrite with another
* @param {relation} relation - to be searched
* @param {string} uuid - graph1uuid
* @param {string} uuid2 - graph2 uuid
* @returns {concept|false}
*/
function mergeRelation(relation, uuid, uuidC2) {
  var arcs = Object.keys(relation.arcs);
  for(var c = 0; c < arcs.length; c++) {
    var label = arcs[c]
    var arc = relation.arcs[label];//returns uuid
    if(arc === uuid) {
      relation.arcs[label] = uuidC2; // overwrite uuid with graph2
    }
  }
  return false; // if not found
}

