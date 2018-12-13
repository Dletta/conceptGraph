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
*
*/

/*
* "For all words,  "
*/
