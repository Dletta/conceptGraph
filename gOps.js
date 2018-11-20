/* Derived formation rules
  1 - projection
  2 - maximal join
*/

/* Projection
 Taking a master graph w, graph v (e.g. a query) is a projection of w when
 v can be derived from w by applying n>=0 detach ops or n>=0 restrict ops
 */
/*
 for(each concept relation) {
  apply detachment on relation that is not in v
 }
 return subset of w that should contain v;

 In Gun a projection is achieved by doing gun.get('edges').map().once
  and only keeping the edges that are found in the query v


  var projection = (query) {
    this.queryG = query;
    this.result = [];
    this.method = function(query, result, relation, key) {
      if(relation is found in query){
        result.push(relation) //this results in multiple projective origins v,w
      } else {
        return
      }
    },
    this.start {
      gun.get('relations').map().once(this.method.bind(this, query, this.result))
    }
  }

  var maxiJoin = (graph1, graph2) {
    this.result = new Graph;
    this.graphV = graph1;
    this.graphW = graph2;
    this.graphU = kernel(a,b,c); //u is maximal common projection;
    this.method = function () {
      u is max common project to kernel k if
        no graph t is a common projection with v and w but is not identical
        to u
      u is a mx common projection in respect to kernel k. A maximal join of
        v and w with repsect to k is a graph obtained by joining v and w
        via u, where the concept b (in u) is joined to c (in w).
        (which means the common concept of the 3 graphs are joined)
    }
  }
*/
function Concept (label, value, quant, uuid) {
  this.uuid = uuid;
  this.label = label;
  this.value = value;
  this.quant = quant;
  /*
 if(value === undefined && quant === undefined){
   this.value = undefined;
   this.quant = undefined;
   // concept indefinite -> selector
 } else if (value) {
   this.value = value;
   this.quant = undefined;
   // concept constant -> a defined thing
   function permissible to check  if value is permissible on a given sort label
 } else if (quant) {
   this.value = undefined;
   this.quant = quant;
   // concept quantified ->  one of four value A E1 E-set
 }
 */
}

function Relation (label, uuid, source, target){
  this.uuid = uuid;
  this.label = label;
  this.source = source;
  this.target = target;
}


/* Local Graph Functions
 * To build a graph for queries
 * To build a graph to perform graph operations on
 */

 function Rule () {
   this.concept = [],
   this.relation = [],
   this.addC = function (item) {
     item.uuid = uuidv4();
     this.concept.push(item);
     return item.uuid;
   },
   this.addR = function (item) {
     item.uuid = uuidv4();
     this.relation.push(item);
     return item.uuid;
   },
   this.find = function (uuid) {
     var i = 0;
     var lC = this.concept.length;
     for(i;i<lC;i++){
       if(this.concept[i].uuid === uuid) {
         return this.concept[i];
       }
     }
     var y = 0;
     var lR = this.relation.length;
     for(y;y<lR;y++){
       if(this.relation[y].uuid === uuid) {
         return this.relation[y];
       }
     }

     console.log('Error: uuid not found');
   }
 }

 function ruleStore (domainLabel) {
   this.label = domainLabel;
   this.rules = [];
   this.find = function (label) {
     var i = 0;
     var l = this.rules.length;
     for(i;i<l;i++){
       if(this.rules[i].label === label) {
         return this.rules[i];
       }
     }
     console.log('Error: no relation found');
   }
 }

 function uuidv4 () {
   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxx'.replace(/[xy]/g, function(c) {
     var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
     return v.toString(16);
   })
 }

 var rStore = new ruleStore ('app');
 var add = new Rule();
 var number1 = new Concept('Number', undefined, 'A', uuidv4());
 add.addC(number1);
 var number2 = new Concept('Number', undefined, 'A', uuidv4());
 add.addC(number2);
 var sum = new Concept('Sum', undefined, undefined, uuidv4());
 add.addC(sum);
 var numberE = new Concept('Number',undefined,'E1', uuidv4());
 add.addC(numberE);
 var arg1 = new Relation('arg1', uuidv4(), number1.uuid, sum.uuid);
 add.addR(arg1);
 var arg2 = new Relation('arg2', uuidv4(), number2.uuid, sum.uuid);
 add.addR(arg2);
 var res = new Relation('res', uuidv4(), sum.uuid, numberE.uuid);
 add.addR(res);
 rStore.rules.push(add);
