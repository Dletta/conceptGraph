    var push = function() {
      var input = document.getElementById('editor');
      gun.get('functions').put({add:input.value});
      console.log(input.value + ' saved');
    }

    var pull = function(data, key) {
      var scr = document.createElement('script');
      scr.innerHTML = data;
      document.all[0].appendChild(scr);
      console.log('pulled function');
    }


/*
* make an instance of a axiomStore and add a few axioms to play with
*/

var aStore = new axiomStore ('app');


// Concept
// Term
// Definition
// Lexicon

/*
* let's state some obivious rules about the world
* using FE on page 47 is an example
* https://archive.org/details/springer_10.1007-10722280/page/n57
*/



/* Axioms about Clients
Client has _id
Client employs Accountant (subtype of Person)
Client employs Lead Contact (subType of Person)
Client employs Secondary Contact (Subtype Person)
Client has Auxilliary Contacts
Client has Accounting details
Client has address
  address has street address
  address has zip code
  address has city
  address has state
  address has country
Client has Billing address
Client has Billing Company
Client has Billing Preferences
  Billing Preferences has Choice is dropdown:BillPref which has options etc
Client has Net Payment Terms
Client has preferredCurrency is Currency:
Client has Branding
  Branding has Primary Colour <- Yeah for british english
  Branding has Sec Colour
  Branding has Primary font
  Branding has Secondary font
Client has Asset Database URL:
Client has Agreements -> setOfId
Client has Campaigns -> setOfId
*/

/* Axioms about Person
Person has _id
Person has Name First
Person has Name Last
Person has Phone Number
Person has email
Company employs Person
*/

var TPerson = new Thing('TPerson', 'axiom', uuidv4());
var tPerson = TPerson.addConcept('Person', 'concept', uuidv4(), {}, '');
var tId = TPerson.addConcept('_id', 'concept', uuidv4(), {}, '');
TPerson.addRelation('has', 'relation', uuidv4(), {source:tPerson,target:tId});
var tNameFirst = TPerson.addConcept('Name First', 'concept', uuidv4(), {}, '');
TPerson.addRelation('has', 'relation', uuidv4(), {source:tPerson,target:tNameFirst});
var tNameLast = TPerson.addConcept('Name Last', 'concept', uuidv4(), {}, '');
TPerson.addRelation('has', 'relation', uuidv4(), {source:tPerson,target:tNameLast});
var tPhone = TPerson.addConcept('Phone Number', 'concept', uuidv4(), {}, '');
TPerson.addRelation('has', 'relation', uuidv4(), {source:tPerson,target:tPhone});
var tEmail = TPerson.addConcept('Email', 'concept', uuidv4(), {}, '');
TPerson.addRelation('has', 'relation', uuidv4(), {source:tPerson,target:tEmail});
var company = TPerson.addConcept('Company', 'concept', uuidv4(), {}, '');
TPerson.addRelation('employs', 'relation', uuidv4(),{source:company, target:tPerson});

aStore.axioms.push(TPerson);

/*
* Control group
*/

var manhiper = new Thing('Manager Axiom', 'axiom', uuidv4());
var manager = new Thing('Manager', 'concept', uuidv4());
manhiper.addConcept(manager);
var hire = new Thing('Hire', 'concept', uuidv4());
manhiper.addConcept(hire);
var agent = new Thing('agent', 'relation', uuidv4(), {source:manager.uuid,target:hire.uuid});
manhiper.addRelation(agent);
var person = new Thing('Person', 'concept', uuidv4());
manhiper.addConcept(person);
var patient = new Thing('patient', 'relation', uuidv4(), {source:hire.uuid,target:person.uuid});
manhiper.addRelation(patient);

aStore.axioms.push(manhiper);

var Query = new Thing('Query', 'axiom', uuidv4());
var qPerson = Query.addConcept('Person', 'concept', uuidv4(), {},"?");
