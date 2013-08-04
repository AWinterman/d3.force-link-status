// # Tests #
var sandwich = require('sandwich')
 , Status = require('./index')
 , assert = require('assert')
 , d3 = require('d3')

var parameters = [true, false]
  , len = 10

// Tester is a class to manage testing. It is called on the last line of this file.
function Tester(directed) {
  this.directed = directed
}

Tester.prototype.constructor = Tester

// A method which sets up the force directed graph, the status object, and then
// runs each test.
Tester.prototype.go = function(len) {
  this.len = len
  this.setup(len)
  this.s = new Status(this.loops, this.directed, this.multiedge)
  this.is()
  this.indexof()
  this.count()
  return true
}

Tester.prototype.setup = function(len) {
  // setting up the force directed graph (conceivably this could be spin out into
  // its own module, called "d3.force-example" as an example.
   var nodes_array = new Array(len)
     , force = d3.layout.force()

  for(var i = 0; i < len; ++i) {
    nodes_array[i] = ({idx: i})
  }

  // now I can sandwich the nodes array to make a pile of links.

  this.force = force.nodes(nodes_array)
}

Tester.prototype.possible_pairs = function() {
  return sandwich(this.force.nodes(), this.force.nodes())
}

Tester.prototype.is = function() {
  var pairs = this.possible_pairs()
    , link = make(pairs.random())

  var lcopy = {target: link.target, source: link.source}
    , rev = reverse(link)
    , s = this.s
    , bad_match
    , l

  assert(s.is(link, link), 'A link should of course be itself')
  assert(s.is(link, lcopy), 'A link should be equal to another object referencing the same source and target')

  // This loop makes sure that no link that should not be equal to `link` is
  // equal to `link`
  while(l = make(pairs.next())) {
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

Tester.prototype.indexof = function() {
  // need a bunch of things  
  var pairs = this.possible_pairs()
    , len = this.len * 2
    , s = this.s

  var links = []
  for(var i = 0; i < len; ++i) {
    var m = make(pairs.next())
    if(!m) break
    links.push(m)
  }

  var outsider = pairs.next()
    , bad_index = []

  this.force.links(links)

  assert.equal(s.indexOf(outsider, this.force), -1, 'Link not in array has non-negative index.')

  for(var i = 0; i < len; ++i) {
    var result = s.indexOf(links[i], this.force)
    if(i != result) {
      bad_index.push([i, s.indexOf(links[i], this.force)])
      if (this.directed) {
        break
      } else {
        // make sure that the the indexOf is the reverse of the i-th element
        assert.ok(s.is(links[i], links[result]), 'any match `is` equals expected.')
        links = links.splice(result, 1)
        bad_index.pop(links[result])
      }
    }
  }

  var msg = [
      'Link in array had the wrong index'
     ,  bad_index
    ].join('\n')

  assert.strictEqual(0, bad_index.length)
}

Tester.prototype.count = function() {

}

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
