'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Addon making using React easier */

exports.default = function () {

  // Enable this addon even in build-less systems (JsFiddle, etc)
  var React = _react2.default || window.React;
  var ReactDOM = _reactDom2.default || window.ReactDOM;

  function createEl(fromClass, route, params, acc, key, child) {
    return React.createElement(fromClass, { route: route, params: params, acc: acc, key: key }, child);
  }

  function parentStates(stateApi) {
    var result = [];
    var parent = stateApi.parent;

    while (parent) {
      result.push(parent);
      parent = parent.parent;
    }

    return result;
  }

  // Enable this addon even in build-less systems (JsFiddle, etc)
  if (window.Abyssa) window.Abyssa.ReactState = ReactStateForContainer;

  return function ReactStateForContainer(container) {
    return function ReactState(uri, component, children) {

      // Create the Abyssa state object
      var state = {
        data: { _component: component },
        uri: uri,
        children: children
      };

      // The router will add a default state to any parent without one; Add ours first so that it's a ReactState.
      if (children && !Object.keys(children).some(function (name) {
        return children[name].uri.split('?')[0] == '';
      })) children._default_ = ReactState('');

      state.enter = function (params, acc, router) {
        var route = router.current();

        // Let the component react to the route change, e.g to redirect to another state
        if (component && component.onEnter) {
          var current = route.fullName;
          component.onEnter();
          // The current state changed, cancel everything.
          if (router.current().fullName != current) return;
        }

        // It is the responsability of the leaf state to render the whole component hierarchy; Bail if we're a parent.
        if (children) return;

        var stateApi = router.findState(state);
        var parents = parentStates(stateApi);
        var states = component ? [stateApi].concat(parents) : parents;

        // The actual VDOM element created from the component class hierarchy
        var instance = states.slice(1).reduce(function (child, parent) {
          return createEl(parent.data('_component'), route, params, acc, parent.fullName, child);
        }, createEl(states[0].data('_component'), route, params, acc, states[0].fullName));

        ReactDOM.render(instance, container);
      };

      return state;
    };
  };
}();
