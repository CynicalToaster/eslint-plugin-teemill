/**
 * @fileoverview Vertical alignment of destructed object style code.
 * @author Devan
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Vertical alignment of destructed object style code.',
      category: 'Fill me in',
      recommended: true,
    },
    fixable: 'whitespace',
    schema: [],
  },

  create(context) {
    const source = context.getSourceCode();

    const acceptedValueTypes = [
      'Literal',
      'Identifier',
    ];

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    /**
     * @name getLine
     * @description Get the line a position in on.
     *
     * @param {Number} position
     * 
     * @return {Number} Line number.
     */
    const getLine = position => source.lineStartIndices
      .reduce((acc, lineStart, line) => {
        if (lineStart <= position) {
          return line;
        }

        return acc;
      });

    /**
     * @name groupNodes
     * @description Groups AST nodes based on line seperation. If nodes are
     *              seperated by 1 or more lines they're put into a new group.
     *
     * @param {Node[]} nodes Set of nodes that need to be grouped.
     * 
     * @return {Node[][]} Array of each group of nodes.
     */
    const groupNodes = (nodes) => {
      return nodes
        .map(item => ({
          startLine: getLine(item.start),
          endLine: getLine(item.end),
          node: item,
        }))
        .map((item, index, array) => {
          if (index > 0) { 
            const previousItem = array[index - 1];

            if (item.startLine - previousItem.endLine >= 2) {
              item.group = previousItem.group + 1;
            } else {
              item.group = previousItem.group;
            }
          } else {
            item.group = 1;
          }

          return item;
        })
        .reduce((acc, item) => {
          if (acc.length < item.group) {
            acc.push([]);
          }

          acc[acc.length - 1].push(item);

          return acc;
        }, []);
    };

    /**
     * @name computeKeyLengths
     * @description Calculates the max key length for a set of node and the
     *              number of space to align the values vertically.
     *
     * @param {Node[]} nodes Array of nodes to compute max key lengths for.
     * 
     * @return {Object[]}
     */
    const computeKeyLengths = (nodes) => {
      if (!nodes.length) {
        return [];
      }

      let previousItem = null;
      let longestKeyLength = 0;
      const foundProperties = [];

      return nodes.map((node) => {
        const key = node.left || node.key;
        const value = node.right || node.value;

        const nodeText = source.getText(node);
        const spaceMatch = nodeText.match(/^[\S]+([\s]*)[\S]/)

        const keySpacing = spaceMatch.length ? spaceMatch[1].length : 0;
        const keyLength = source.getText(key).length;
        const keyTotal = keyLength + keySpacing;

        if (keyLength > longestKeyLength) {
          longestKeyLength = keyLength;
        }

        return {
          node,
          key,
          value,
          keyLength,
          keySpacing,
          keyTotal,
          ignore: !value,
        };
      })
      .filter(item => !item.ignore)
      .map((item) => {
        if (previousItem) {
          const tokens = source.getTokensBetween(
            previousItem.node,
            item.node,
          );
        }

        previousItem = item;

        if (acceptedValueTypes.includes(item.value.type)) {
          item.expectedSpaces = (
            longestKeyLength - item.keyTotal
          ) + item.keySpacing;
        } else {
          item.expectedSpaces = 1;
        }

        return item;
      });
    };

    /**
     * @name generateReport
     * @description Generates a report for any miss aligned key value pairs,
     *              within the given node set.
     *
     * @param {nodes} Set of nodes to generate a report for. 
     */
    const generateReport = (nodes) => {
      computeKeyLengths(nodes).forEach((item) => {
        if (
          !item.ignore &&
          item.expectedSpaces !== item.keySpacing
        ) {
          context.report({
            node: item.node,
            message: 'Expected {{expectedSpaces}} spaces after key but found {{keySpacing}}',
            data: {
              expectedSpaces: item.expectedSpaces,
              keySpacing: item.keySpacing,
            },
            fix(fixer) {
              return fixer.replaceTextRange(
                [
                  item.key.end + 1,
                  item.key.end + item.keySpacing,
                ],
                ' '.repeat(Math.max(0, item.expectedSpaces - 1)),
              );
            }
          });
        }
      });
    };

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------
    return {
      'ObjectPattern': (node) => {
        const nodes = node.properties
          .map(item => item.value)
          .filter(item => item.type === 'AssignmentPattern');

        generateReport(nodes);
      },

      'ObjectExpression': (node) => {
        generateReport(node.properties);
      },

      'BlockStatement': (node) => {
        const nodes = node.body
          .filter(item => item.type === 'ExpressionStatement')
          .map(item => item.expression)
          .filter(item => item.type === 'AssignmentExpression')
          
        groupNodes(nodes)
          .forEach((group) => {
            generateReport(group.map(item => item.node));
          });
      },
    };
  }
};
