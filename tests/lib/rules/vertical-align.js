/**
 * @fileoverview Vertical alignment of destructed code.
 * @author devan
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require('../../../lib/rules/vertical-align'),

    RuleTester = require('eslint').RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('vertical-align', rule, {
  valid: [

      // give me some code that won't trigger a warning
  ],

  invalid: [
    {
      code: '',
      errors: [{
        message: 'Fill me in.',
        type: 'Me too'
      }]
    }
  ]
});
