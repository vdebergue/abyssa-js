
'use strict';


/*
* Creates a new StateWithParams instance.
*
* StateWithParams is the merge between a State object (created and added to the router before init)
* and params (both path and query params, extracted from the URL after init)
*/
function StateWithParams(state, params, pathQuery) {
  return {
    state: state,
    params: params,
    pathQuery: pathQuery,
    isIn: isIn,
    toString: toString
  };
}

/*
* Returns whether this state or any of its parents has the given fullName.
*/
function isIn(fullStateName) {
  var current = this.state;
  while (current) {
    if (current.fullName == fullStateName) return true;
    current = current.parent;
  }
  return false;
}

function toString() {
  return this.state.fullName + ':' + JSON.stringify(this.params)
}


module.exports = StateWithParams;