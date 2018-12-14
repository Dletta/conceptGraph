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
