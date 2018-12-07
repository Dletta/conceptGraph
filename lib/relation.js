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

/*
* Find common projection between 2 graphs;
* @param {graph} graph1 - the one you care about
* @param {graph} graph2 - the one you want to check out
* @returns {graph} u - common projection, if none, returns undefined
*/

function projection(graph1, graph2) {
  let v = graph1;
  let w = graph2;
  let score = 0;
  let arr1 = graph1.concept;
  let arr2 = graph2.concept;
  var result = {name:graph2.label+'cP',concepts:[]}
  for(var i = 0; i<arr1.length;i++){
    for(var j = 0; j<arr2.length; j++) {
      if(arr1[i].label === arr2[j].label){
        score += 1;
        result.concepts.push(arr2[j]);
        if(arr1[i].value === "?"){
          score += 1;
        }
      }
    }
  }
  if(result.concepts.length > 0) { //found something
    result.score = score;
    return result;
  } else { //nothing
    result = undefined;
    return result;
  }
}
