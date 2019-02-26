/*
* The term that makes up the universe
* @constructor
* @param {string} label - a string to represent the thing
* @param {string} type - axiom, concept, relation, function?
* @param {uuid} uuid - unique identifier
* @param {object} arcs - objectArray of arcs in order as defined in ontology (relation)
* @param {string, int, undefined} referent - referent (concept)
* @param {string} identifier - used in the creation of the graph
* @param {float} fuzzy - float representing how true something is range [0, 1]
*/

function Thing (label, type, uuid, arcs, referent, identifier, fuzzy) {
  this.label = label;
  this.type = type;
  this.uuid = uuid;
  this.arcs = arcs;
  this.referent = referent;
  this.identifier = identifier;
  this.fuzzy = fuzzy;
  this.out = []; //outgoing relations (any relations connected to this concept)
  this.concept = []; //concept array for axioms
  this.relation = []; //relation array for axioms
  this.conConcept = [];
  this.conRelation = [];
  this.addConcept = function (label, type, uuid, arcs, referent, identifier, fuzzy) {
    if(typeof label == 'string') {
    var item = new Thing(label, type, uuid, arcs, referent, identifier, fuzzy);
    } else {
    var item = label;
    }
    this.concept.push(item);
    return item.uuid;
  };
  this.addRelation = function (label, type, uuid, arcs, referent, identifier) {
    if(typeof label == 'string') {
    var item = new Thing(label, type, uuid, arcs, referent, identifier);
    } else {
    var item = label;
    }
    this.relation.push(item);
    var list = Object.keys(item.arcs);
    for(let i=0;i<list.length;i++){
      var temp = this.find('uuid', item.arcs[list[i]]);
      if(temp) {
        temp.out.push(item.uuid); //needs to be a set
      } else {
        console.log(item.arcs[list[i]] + ' undefined!');
      }
    }
    return item.uuid;
  };
  this.addConConcept = function (label, type, uuid, arcs, referent, identifier) {
    if(typeof label == 'string') {
    var item = new Thing(label, type, uuid, arcs, referent, identifier);
    } else {
    var item = label;
    }
    this.conConcept.push(item);
    return item.uuid;
  };
  this.addConRelation = function (label, type, uuid, arcs, referent, identifier) {
    if(typeof label == 'string') {
    var item = new Thing(label, type, uuid, arcs, referent, identifier);
    } else {
    var item = label;
    }
    this.conRelation.push(item);
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
    var i = 0;
    var lC = this.conConcept.length;
    for(i;i<lC;i++){
      if(this.conConcept[i][prop] === item) {
        return this.conConcept[i];
      }
    }
    var y = 0;
    var lR = this.conRelation.length;
    for(y;y<lR;y++){
      if(this.conRelation[y][prop] === item) {
        return this.conRelation[y];
      }
    }
    return false;
  };
}
