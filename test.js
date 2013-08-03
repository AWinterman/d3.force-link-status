// # Tests #
var sandwich = require('sandwich')
 , Status = require('./index')
 , assert = require('assert')
 , d3 = require('d3')

var parameters
  , len

// The three parameters (loops, directed, multiedge), take a values `true` or
// `false`.
parameters = new Array(3)
parameters.forEach(function(d) {
 d.push([true, false])
})
len = 10

var options = sandwich(parameters)

// Tester is a class to manage testing. It is called on the last line of this file.
function Tester(loops, directed, multiedge) {
  this.multiedge = multiedge
  this.directed = directed
  this.loops = loops
}

Tester.prototype.constructor = Tester

// A method which sets up the force directed graph, the status object, and then
// runs each test.
Tester.prototype.go = function() {
  this.setup(len)
  this.s = new Status(this.loops, this.directed, this.multiedge)
  this.is()
  this.indexof()
  this.has()
  this.count()
}

Tester.prototype.setup = function(len) {
  // setting up the force directed graph (conceivably this could be spin out into
  // its own module, called "d3.force-example" as an example.
   var nodes_array = new Array(len)
     , force = d3.layout.force()

  for(var i = 0; i < len; ++i) {
    nodes_array[i] = ({idx: i})
  }

  // now I can sandwhich the nodes array to make a pile of links.

  var all_possible_links = sandwich(nodes_array, nodes_array)

  this.force = force.nodes(nodes_array)
  this.possible_link_pairs = all_possible_links
}

Tester.prototype.is = function() {
  var link = make(this.possible_link_pairs.random())
  var lcopy = {target: link.target, source: link.source}
    , rev = reverse(link)
    , s = this.s
    , bad_match
    , l

  assert(s.is(link, link), 'A link should of course be itself')
  assert(s.is(link, lcopy), 'A link should be equal to another object referencing the same source and target')

  // This loop makes sure that no link that should not be equal to `link` is
  // equal to `link`
  while(l = make(this.possible_link_pairs.next())) {
    var match_equal
      , cross_equal

    match_equal = l.source.idx == link.source.idx || l.target.idx == link.target.idx
    cross_equal = l.source.idx == link.target.idx || l.target.idx == link.source.idx

    if(match_equal) {
      continue
    }
    if(!this.directed && cross_equal) {
      continue
    }

    if(bad_match = s.is(link, l)) {
      break
    }
  }
  var mess = 'no link but `link`, and possibly its reverse, should equal link'
  assert(!bad_match, mess)

  if(!this.directed) {
    assert(s.is(link, rev), 'If not directed, a link is equal to its reverse')
  } else {
    assert(!s.is(link, rev), 'If directed, a link is not equal to its reverse')
  }
}

Tester.prototy.indexof = function(){}
Tester.prototy.has = function(){}
Tester.prototy.count = function(){}

function reverse(link) {
  var source = link.source
    , target = link.target
    , rev_link = copy(link)
  
  rev_link.source = target
  rev_link.target = source
  return rev_link
}

function copy(obj) {
  return JSON.parse(JSON.stringify(obj))
}

function make(arr_link) {
  if(arr_link === null) {
    return false
  }
  return {
      source: arr_link[0]
    , target: arr_link[1]
  }
}

var tester = new Tester

tester.go()
