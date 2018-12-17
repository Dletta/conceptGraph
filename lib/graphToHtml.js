/*
* Return an HTML string from a concept
*/

function htmlConcept (concept) {
  var string = '<p';
  string += ' name=' + concept.label;
  string += ' id=' + concept.uuid;
  string += ' class="concept">';
  string += 'Label: ' + concept.label;
  string += '<br>';
  string += 'Uuid: ' + concept.uuid;
  string += '<br>';
  string += 'Value: ' + concept.value;
  string += '<br>';
  string += '<input id="in' + concept.uuid + '"';
  string += '' + '>'; //add event
  string += '</p>';
  return string;
}

/*
* Return an HTML string from a relation
*/
function htmlRelation (relation) {
  var string = '<p';
  string += ' name=' + relation.label;
  string += ' id=' + relation.uuid;
  string += ' class="relation">';
  string += 'Label: ' + relation.label;
  string += '<br>';
  string += 'Uuid: ' + relation.uuid;
  string += '<br>';
  console.log(relation);
  console.log(relation.arcs);
  var temp = Object.keys(relation.arcs);
  for (var i=0;i<temp.length;i++) {
    string += temp[i] + " : " + relation.arcs[temp[i]].label;
    string += '<br>';
  }
  string += '</p>';
  string += relation.html; //which creates the form
  return string;
}


/*
* Function that takes an axiom and creates a view from interval
* @param {axiom} axiom - axiom to render
* @param {uuid} contId - id of the container in the html code
*/

function render(axiom) {
  console.log(axiom);
  var text = document.getElementById('source');

  //apply style
  var string = '<style type="text/css"> .axiom { background-color: grey;}';
  string += '.concept {display:inline-block; background-color: white;border: solid 1px black;';
  string += 'padding:5px;} .relation {display:inline-block; background-color: light grey;';
  string += 'border:solid 1px black;padding:5px;} </style>';

  //build html string
  //open axiom container
  string += '<div';
  string += ' name=' + axiom.label;
  string += ' id=' + axiom.uuid;
  string += ' class="axiom"';
  string += '>'+axiom.label;
  string += '<br>';
  //add concepts
  var i = 0;
  var l = axiom.concept.length;
  for(i;i<l;i++){
    string += htmlConcept(axiom.concept[i]);
  }
  //addRelation
  var i = 0;
  var l = axiom.relation.length;
  for(i;i<l;i++){
    string += htmlRelation(axiom.relation[i]);
  }

  //text.value = string;
  return string;
/*

    var br = document.createElement('br');
    div1.appendChild(br);


    div1.setAttribute('name',axiom.relation[i].label);
    div1.setAttribute('class','relation');

    div.appendChild(div1);
  }

  container.appendChild(div);*/
}

/*


<div name=Person Form id=9c191dca-9281-4325-beb9-6f6c6bf1ac class="axiom">Person
    <hr>
    <section name=Person id=2d920979-b861-4afd-a0bf-8af386ce55 class="concept">
        Label: Person
        <br>Uuid: 2d920979-b861-4afd-a0bf-8af386ce55
        <br>Value: *
        <br>
        <input id="in2d920979-b861-4afd-a0bf-8af386ce55">
    </p>
    <section name=Name id=ff725c27-86fd-4725-8a2b-faa6e76858 class="concept">Label: Name
        <br>Uuid: ff725c27-86fd-4725-8a2b-faa6e76858
        <br>Value: *
        <br>
        <input id="inff725c27-86fd-4725-8a2b-faa6e76858">
    </section>
    <section name=Address id=64438987-72a0-408b-a293-81d9e35b25 class="concept">Label: Address
        <br>Uuid: 64438987-72a0-408b-a293-81d9e35b25
        <br>Value: *
        <br>
        <input id="in64438987-72a0-408b-a293-81d9e35b25">
    </section>
    <section name=contains id=572928a2-57b5-4da5-9d80-8037b59f27 class="relation">Label: contains
        <br>Uuid: 572928a2-57b5-4da5-9d80-8037b59f27
        <br>0 : Person
        <br>1 : Name
        <br>2 : Address
        <br>
    </section>
    <div name=contains id=572928a2-57b5-4da5-9d80-8037b59f27 class="relation">
        <div>Person
            <br>
            <p>Name:
                <input value="*">
            </p>
            <p>Address:
                <input value="*">
            </p>
        </div>
    </div>
    */
