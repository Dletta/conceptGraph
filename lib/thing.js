/*
* The term that makes up the universe
* @constructor
* @param {string} label - a string to represent the thing
* @param {string} type - axiom, concept, relation, function?
* @param {uuid} uuid - unique identifier
* @param {object} arcs - objectArray of arcs in order as defined in ontology (relation)
* @param {string, int, undefined} value - value (concept)
*/

function Thing (label, type, uuid, arcs, value) {
  this.label = label;
  this.type = type;
  this.uuid = uuid;
  this.arcs = arcs;
  this.value = value;
  this.concept = []; //concept array for axioms
  this.relation = []; //relation array for axioms
  this.addConcept = function (label, type, uuid, arcs, value) {
    if(typeof label == 'string') {
    let item = new Thing(label, type, uuid, arcs, value);
    } else {
    let item = label;
    }
    this.concept.push(item);
    return item.uuid;
  };
  this.addRelation = function (label, type, uuid, arcs, value) {
    if(typeof label == 'string') {
    let item = new Thing(label, type, uuid, arcs, value);
    } else {
    let item = label;
    }
    this.relation.push(item);
    return item.uuid;
  };
  this.deleteConcept = function (uuid) {
    var i = 0;
    for(i;i<this.concept.length;i++){
      if(this.concept[i].uuid === uuid) {
        this.concept.splice(i,1);
      }
    }
  };
  this.deleteRelation = function (uuid) {
    var i = 0;
    for(i;i<this.relation.length;i++){
      if(this.relation[i].uuid === uuid) {
        this.relation.splice(i,1);
      }
    }
  };
  this.find = function (prop, item) {
    var i = 0;
    var lC = this.concept.length;
    for(i;i<lC;i++){
      if(this.concept[i][prop] === item) {
        return this.concept[i];
      }
    }
    var y = 0;
    var lR = this.relation.length;
    for(y;y<lR;y++){
      if(this.relation[y][prop] === item) {
        return this.relation[y];
      }
    }
    return false;
  };
}
