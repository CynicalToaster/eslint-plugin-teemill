/**
 * @fileoverview Teemill eslint plugin
 * @author devan
 */
'use strict';

//----------------------------------------------------------------------------
// Requirements
//----------------------------------------------------------------------------

var requireIndex = require('requireindex');

//----------------------------------------------------------------------------
// Plugin Definition
//----------------------------------------------------------------------------

module.exports = {
  rules: requireIndex(__dirname + '/rules'),
  // configs: {
  //     teemill: {
  //         rules: {
  //             'vertical-align': ['error'],
  //         },
  //     },
  // },
};


