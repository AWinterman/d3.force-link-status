// # Status #
module.exports = Status

// Initialize the Status object with three parameters which describe the
// graph:

// * `directed`: True if a link from node A to node B is the same a s a link
//   form B to A
function Status(directed) {
  this._directed = directed
}

var cons = Status
  , proto = cons.prototype

proto.constructor = cons

// `Status#is` checks for equality between two links, paying attention to whether the graph is
// directed. Links are equal if they point to the same objects.
proto.is = function(A, B) {
  var directed_match = (A.source == B.source) && (A.target == B.target)
  if (this._directed) {
    return directed_match 
  }
  var cross_match = (A.target == B.source) && (A.source == B.target)
  return cross_match || directed_match
}

// `Status#indexOf` checks if the link is in the register, find and return its first index in the link array.
// Otherwise return -1.
proto.indexOf = function(link, force) {
  var link_array = force.links()
  var match

  for(var i = 0, len = link_array.length; i < len; ++i) {
    if(this.is(link, link_array[i])) {
      return i
    }
  }
  return -1
}

// `Status#has` is a convenience function.
proto.has = function(link, force) {
  return this.indexOf(link, force) > 1
}

// `Status#count` returns a count of the number of times a link appears in the
// `force.links()` array. It will always iterate through the whole array.
proto.count = function(link, force) {
  var link_array = force.links()
    , count = 0

  var match

  for(var i = 0, len = link_array.length; i < len; ++i) {
    if(this.is(link_array[i], link)) {
      count += 1
    }
  }
  return count
}
