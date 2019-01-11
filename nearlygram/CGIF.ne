Concept -> "[" Type "]"
Type ->  String
String -> [a-zA-z]:+ {% d => d[0].join('') %}
