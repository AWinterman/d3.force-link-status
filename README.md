# d3.force-link-status #

A very small module so you can stop thinking about certain repetetive
operations while managing [d3js](http://d3js.org/) force directed graphs `force.links()` array.

# Example #

## Setup ##
`Status` is designed to work with d3, although it should work for anything which
imnplements a similar API, meaning the force argument has a `force#links`
method which returns an incidince list of the edges in the graph. In any event,
you need a few things before we can et started:

```js
var Status = require('d3.force-link-status')
  , d3 = require('d3')

/* A few parameters */
var loops = false // node cannot link to itself
  , directed = false // link from A to B == link from B to A
  , multiedge = false // at most one link between nodes A and B.

var s = new Status(loops, directed, multiedge)

var force = d3.layout.force()

/* Supposing you've defined links and nodes somewhere. */
force
  .links(links_array)
  .nodes(nodes_array)

var one_link = // a link
  , another_link = // another link

/* start the layout -- this gives the nodes an index. although their positions
 * wont update until the first tick. */
force.start()
```

# Checks #

Checking for equality will respect your settings:

```js
s.is(one_link, another_link)
```

A method to easily find the index of the link in the force. Mimics the api of Array#indexOf api.

```js
s.indexOf(one_link, force)
```

There is a convenient membership check:

```js
s.has(another_link, force) // -> true or false
```

And finally a method to count the number of times a link appears (useful when
`multiedge == true`.

```js
s.count(force.links()[0], force) 
```

# Literate source #
Is very short and available
[here](http://awinterman.github.io/d3.force-link-status/)
