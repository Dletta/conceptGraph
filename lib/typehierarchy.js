/*
* Hierarchy of types.
* Writes the Hierarchy into gun.
* Join function amongst others needs to be able to follow the type Hierarchy of
* each thing, saved. To determine if items are 'comparable' or not (dog vs cat vs animal)
* Each thing needs to reference the a type found in the type Hierarchy or generate a new type,
* at a later stage new types can be created.
*/

var hierarchy = gun.get('hierarchy'); // root node
var types = gun.get('types'); // index for all types to quickly find types in hierarchy


var T = new Type({desc:'Universal'}, 'T');//T is the universal type, all is encompassed in T
var t = new Type({desc:'Absurd'}, 't');//t is the absurd type, nothing can be absurd

console.log('Initialising Hierarchy');
hierarchy.set(T); //upper entry
hierarchy.set(t); //lower entry

function init () {
  // first layer
  var temp = new Type({desc:'Physical Object'}, 'Physical');
  addType('T', temp);
  // second layer
  var temp = new Type({desc:''}, )
  // first layer
  var temp = new Type({desc:'Abstract Thing'}, 'Abstract');
  addType('T', temp);
  //second layer
}

setTimeout(init, 1000);


/* Utility Function */

/* Schema for types */
function Type(object, label) {
  object.__label = label;
  object.__referent = {};
  var gunRef = types.set(object);
  return gunRef;
}

/* adding to existing types */
function addType (label, nodeR) {
  var obj = {label:label, node:nodeR};
  types.map().once(function(obj, data, key){
    if(data.__label == obj.label) {
      var soul = Gun.node.soul(data);
      var parent = gun.get(soul)
      parent.get('out').set(obj.node);
      obj.node.get('in').set(parent);
    } else {
      return undefined;
    }
  }.bind(null, obj));
};
