# conceptGraph

Conceptual Graphs inspired by John F Sowa.

Create Concept Graphs and Schemas, that can call functions and access databases
to create answer graphs.

Best enjoyed with some white papers along side.


Theory straight from John F. Sowa's Paper titled
Conceptual Graphs for a Data Base Interface July 1976
All credit for the Theory of Conceptual Graphs goes to Sowa amongst many
other great minds before him, who believe in a better, more human-like
computer interaction. We truly stand on the shoulders of giants.


## Query Algorithm

Answer Graph Criterias to check for:
1.  w is a well formed CG
2.  w is true if the data base is correct
3.  The entire query graph q is covered by a join from w
4.  For every concept in q that has a value, the corresponding concept in w
     has the same value.
5.  For every concept in q that had a question mark, the corresponding
     concept in w has a value.

###  Algorithm A <Conceptual Graphs, pg.349>
- Start with the concepts on the query graph that are flagged with question
  marks;
- Join conceptual schemata to the graph so that the flagged concepts are covered
  by target concepts;
- Propagate the question marks backwards along the function links;
- Evaluate any functional dependencies whose source all have values;
- Repeat until the original question is answered.

### Algorithm B <Conceptual Graphs, pg.349>

- Every join of a new schema to the developing answer graph must at least
  cover one of the concepts in the original query graph'

### Algorithm C

```
  w: = q;
  while ( there is a preferred join j with w)  // seems to imply we have a list of joins
    do begin
      w: = result of performing j with w; //need function to do a join, also a score function
      while (there is a source conept a in w &&
            a does not have a value &&
            a does not have a question mark &&
            the target of a has a question mark)
        do place a question mark on a; //propagation
      while (there is a target concept b in w &&
             b has a question mark &&
             all sources of b have values)
        do get a value for b from it's access procedure (function); // reasoning
     if (there are no question marks left in w and all of q has been covered
         by some join)
         then begin:
          print answer; // result
          stop
          end
    end.
```

So as preparation of running a query through algorithm c we need to find
possible joins and rank them per explanation in paper.

Given a set of possible joins s1 ... sn, score each graph by
- One point for each concept in j that is the same as in w
- One point per concept that is in q (original query)
- If a question mark in w is covered by a target in j another point
- If a question mark is covering a source concept subtract one point
- If a concept in w, with a value is covered by source in a function link
add a point, if it is covered by a target, reject j.
- each concept or relation in q that has not been covered, if j covers it
add a point each

Also need to consider a function that can return true if something is  a subsort
of a specific concept type.

Also indices for each type of concept or target or source links, if performance
issues occur for searching the schematic universe.

prompting points (might not need this) are whenever it cannot find a join
but a question mark remains on a quant('A')

The join function:

>reference to concepts in common
>loop through join, giving you the concepts you want matching
>find concept person in graph2
>find concept2 of join in graph1 and graph2 and merge them together


## Language Generation & Mapping

### Utterance Paths

The sequence of nodes and arcs that are traversed in mapping a graph to a sentence is called the __utterance path__.

### Marked Forms 


> For emphasis,however,most languages permit optional inversions,such as the following English sentence in OSV form:

> "His new-found friend he took with him to the park."

> Such forms, which break the normal pattern of the language, are __marked forms__ as opposed to the normal, unemphatic, unmarked forms.

- J.F. Sowa, Generating Language from Conceptual Graphs


#### Marked Forms as HTML

It is possible to now describe relations accurately 

### Lexical Vector Representations from Concepts

#### Descriptions:

- Concept: Unit of Knowledge
- Term: Unit of Perception (e.g.morphemes, phrases). Can be decoded into one or more Concepts.
- Definition: Minimal, but complete explicitation of a concept. Comprises the textual explanation of the concept (sense) and its links to other concepts in a knowledge base. e.g: dictionary definition; consisting solely of a short explanation, with optional term highlights, linking to otther dictionary entries. 

#### Representations:

1.  Formalization of the basic unit of knowledge: the concept.
2.  Information  extraction  from  a  linguistic  re-source into a set of concepts.
3.  Lexical association: term ↔ concept.
4.  Definition of a term as a composition (mix- ture)  of  concepts,  allowing  partial  or  com-plete disambiguation.

A term is said ambiguous if it is composed by more than one concept.

### Lexicons

According to Sowa, there are three variations of factors for lexicons:

- Accidental 
- Systematic
- Cultural

Which can be expressed in __canonical graphs__.

Sowa describes:
- Concepts
- Instances
- Conceptual Relations
- Type Hierarchy
- Schema (i.e. frames, scripts, MOPs, scenarios)
- Inheritance

### Knowledge Engineering

#### 1. Indentify the Task
Determine what knowledge must be represented in order to connect problem instances to answers i.e. the PEAS Process:

	- Performance Measure (be safe, maximize profits, obey laws)
	- Environment (urban streets, weather, customers)
	- Actuators: Used to measure the continuous and discrete process variables. 
	- Sensors: Used to measure the continuous and discrete process variables.

In our case, PEAS can be:
	- Performance Measure: Document represents the information 
	- Environment: Computer, Network, Person
	- Actuators: DOM / 
	- Sensors: Listeners

2. Assemble the Relevant Knowledge

```
// 		especially in a particular kind of language or branch of study.
var AxiomTerm = new Thing ('Term Axiom', 'axiom', uuidv4());

∀x∃y RFP(x) - Create(y, x) ∧ Company(y) ∨ → ↔ ¬ 

RFP → Thing 

// [RFP]-()-[Create]-()-[Company]

query: RFP:['#125']

algoC to find , join -> [RFP:'125']-(obj)-[CREATE]-(agent)-[Company:'?']
// Get company  fetch node '125' from gun and traverse create edge and return target of edge

[Person: {Sue, Liz}]-agent-[Dance]


gun.get('Person').get(Sue).put({label:'sue',agent:{label:'dance'}})

var concept = {label:'', function:'', value:''}

gun.set({concept:'', ''}  )

function Thing (label, type, uuid, arcs, value) {
  this.label = label;
  this.type = type; //graph axiom/context, concept, relation
  this.uuid = uuid;
  this.arcs = arcs;
  this.value = value;
  this.concept = []; //concept array for axioms
  this.relation = [];
  
thing => storage => Object.assign(new Thing(), data) 
  
  // Term Axiom
// 		Term: a word or phrase used to describe a thing or to express a concept, 
// 		especially in a particular kind of language or branch of study.
// Language = HTML
  
var AxiomTerm = new Thing ('Term Axiom', 'axiom', uuidv4());

  Term → ... Translate(Concept)
  
  HTML 			 		Javascript
  
  Javascript 		Javascript
  
  Term → ... Translate(Concept)
  
  Translate(Javascript) ↔ AxiomTerm Translate(Javascript)
  
  I have <div class="person" />
  I have Concept('Person')
  I have Relation({source: Concept, target: Term})
  I have Relation({source: Term, target: Term})
  
  Translate Person
  
  Blog post
  4 overviews of the latest blog post?
  
  Context(Overview)
   context(blogpost1)
   context(footer)
   context(sidemenu)
  
  [BlogPost]-has-[Title] Title-(is)-Link Title-is-HTML(h1)
  [List]-has-ListItem List-html-ul'?' Listitem-html-li:'?' [DOM]-has-List ListItem-childOf-List List-parentOf-ListItem
  
  object-attr-innerHTML='dididididid'
  DOM-has-object
  
  listed(linked(title(blog)))
  
  
  context(list) translate HTML ? // <ul><li><a href="SDF">Blog Post Title</a></li></ul>
  
/*
  <li class="vcard"> [vcardContainer:uuid]
  <span class="adr">
    <span class="street-address">665 3rd Street</span>
    <span class="locality">San Francisco</span>
    <span class="postal-code">94107</span>
    <span class="region">California</span>
  </span>
  </li>
*/
  
  vcard [Person:'Jake']-(arg)-[Retrieve]-(res)-[vcard:object]
  Bio
  
  
  var add = new Thing('Sum Axiom', 'axiom', uuidv4());
  
  [] - () - [] - () - []
    
  [CompanyContext]-(agent)-[Create]-(obj)-[PRF]
  [Company]-attr-[Name]
  [Company]-attr-[Address]
  [Entity]-attr-[Name]  
  Thing:RFP
  Join [Company]<[Entity] ∀x∃y Entity(x) ∧ has(x,y) ∧ Name(y);    ∨ → ↔ ¬ 
  
  language?
  'context'
  uuid
  contract Company(uuid,context) ↔ Company(uuid,context)
  
  ```
  ```

  git clone https://github.com/amark/gun.git
cd gun
docker build -t myrepo/gundb:v1 .
docker run -p 8765:8765 myrepo/gundb:v1

Runs on 18.222.4.31.
```