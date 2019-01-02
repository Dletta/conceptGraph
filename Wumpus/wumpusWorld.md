/* Adding some detail on the implementation */

## Percept

Each timestep the agent will receive the following graph as percept:
[TIME: @0ms]-(PTIME)-[SITUATION: [ADVENTURER: x1]-(loc)-[TILE: 03], -(perceives)-[PERCEPT:stench] ]

## SUPPORT / SCHEMA 

ALGO C is called on the percept, which expands the query with background information. [PERCEPT:stench]-(nrby)-[WUMPUS]

## INFERENCE / LAWS

Using inference in conjunction with the given percept, knowledge and experience, take the graph and form from it information such as (POSS)-[PROPOSITION: [TILE: 02]-(LOC)-[WUMPUS]. Which gets added to the agents world view represented as W{T, S, L} where WORLD W consists of a Set of Schema S, a Set of Laws L and a set of truths T
