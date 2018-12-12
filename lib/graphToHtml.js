/*
* Function that takes an axiom and creates a view from interval
* @param {axiom} axiom - axiom to render
* @param {uuid} contId - id of the container in the html code
*/

function render(axiom, contId) {
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
    string += '<p';
    string += ' name=' + axiom.concept[i].label;
    string += ' id=' + axiom.concept[i].uuid;
    string += ' class="concept">';
    string += 'Label: ' + axiom.concept[i].label;
    string += '<br>';
    string += 'Uuid: ' + axiom.concept[i].uuid;
    string += '<br>';
    string += 'Value: ' + axiom.concept[i].value;
    string += '<br>';
    string += '<input id="in' + axiom.concept[i].uuid + '"';
    string += '' + '>'; //add event
    string += '</p>';
  }

  var i = 0;
  var l = axiom.relation.length;
  for(i;i<l;i++){
    string += '<p';
    string += ' name=' + axiom.relation[i].label;
    string += ' id=' + axiom.relation[i].uuid;
    string += ' class="relation">';
    string += 'Label: ' + axiom.relation[i].label;
    string += '<br>';
    string += 'Uuid: ' + axiom.relation[i].uuid;
    string += '<br>';
    string += 'source: ' + axiom.relation[i].arcs.source;
    string += '<br>';
    string += 'target: ' + axiom.relation[i].arcs.target;
    string += '<br>';
    string += '</p>';
  }

  text.value = string;
/*

    var br = document.createElement('br');
    div1.appendChild(br);


    div1.setAttribute('name',axiom.relation[i].label);
    div1.setAttribute('class','relation');

    div.appendChild(div1);
  }

  container.appendChild(div);*/
}
