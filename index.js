module.exports = Status

function Status(directed) {
  this.directed = directed
}

var cons = Status
  , proto = cons.prototype

proto.constructor = cons

proto.is = function(A, B) {
  var directed_match = (A.source === B.source) && (A.target === B.target)

  if(this.directed) {
    return directed_match
  }

  var cross_match = (A.target === B.source) && (A.source === B.target)

  return cross_match || directed_match
}

proto.indexOf = function(link, force) {
  var link_array = force.links()

  for(var i = 0, len = link_array.length; i < len; ++i) {
    if(this.is(link, link_array[i])) {
      return i
    }
  }

  return -1
}

proto.has = function(link, force) {
  return this.indexOf(link, force) > 1
}

proto.count = function(link, force) {
  var link_array = force.links()
    , count = 0

  for(var i = 0, len = link_array.length; i < len; ++i) {
    if(this.is(link_array[i], link)) {
      count += 1
    }
  }

  return count
}
