
/* @comment for future development
So [Person:Jake Butterfield]-(hasView)-[PersonView] where hasView is in fact a relation
with function getView(Name, View) Assuming @param {graph} View - a view axiom.
It can then retrieve data for each field in the view, by first finding Jake Butterfield's
Record and then rendering the 'viewGraph' with said values Aaaand if no value is passed
from link 1 (Person Concept) then it knows to render an empty view
*/

/*
* Represents a store of axioms for a domain
* @constructor
* @param {string} domainLabel - label of the domain
*/

function axiomStore (domainLabel) {
 this.label = domainLabel;  // label
 this.uuid = uuidv4();
 this.axioms = [];  // array to store axioms
 //this.gunPath = gun.get(label); //define base path for db
 this.find = function (label) {
   var i = 0;
   var l = this.axioms.length;
   for(i;i<l;i++){
     if(this.axioms[i].label === label) {
       return this.axioms[i];
     }
   }
   console.log('Error: no axiom found');
 };
 this.add = function(graph) {
   //add a copy of the graph not a reference of it.
   var graph = Object.assign(new Thing(), graph);
   this.axioms.push(graph);
 }
}
