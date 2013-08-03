# d3.force-link-status #

A very small module so you can stop thinking about certain repetetive
operations while managing [d3js](http://d3js.org/) force directed graphs `force.links()` array.

# API #
```js

var Status = require('d3.force-link-status')
  , d3 = require('d3')

// a few parameters:
var loops = false // node cannot link to itself
  , directed = false // link from A to B is the same as a link from B to A
  , multiedge = false // at most one link between nodes A and B.

var s = new Status(loops, directed, multiedge)

var force = d3.layout.force()

// you've defined links and nodes somewhere.
force
  .links(links_array)
  .nodes(nodes_array)

var one_link = // a link
  , another_link = // another link

// checking for equality will respect your settings
s.is(one_link, another_link)

// find the index of the link in the force. Mimics the api of Array#indexOf api.
s.indexOf(one_link, force)

// convenient membership check:
s.has(another_link, force) // -> true or false

// how many times does the link appear?
// (in this example will always return 0 or 1, because multiedge is false)
s.count(force.links()[0], force) 
```
