// Dependancies
var fs = require( 'fs' )
  , core = require( './lib/core' )
  , color = require( 'colors' )
  , args = process.argv.slice(2)
  , proto = require('./lib/proto')
  ;

/**
 * @name main
 * @description Runs the program if no parameter errors.
 * @param {array} args User created command-line args.
 * @author Andy Willis
 */

;(function main( args ){

  createConfig( args, function(err, config) {
    core.clear();
    if (err) {
      console.log(err)
    } else {
      var chart = createChartObject( config );
      chart.render( config );
    }
  });

}( args ));

/**
 * @name createChartObject
 * @description Creates a new chart object
 * @param {object} config The chart config
 * @return {object} chartObject An object containing:
 *     Functions: init, values, sum, sortValues, render
 *     Data: processed word frequency data
 * @author Andy Willis
 */

function createChartObject( config ) {
  var chart = {};
  core.merge(chart, proto)
  chart.init( config )
  return chart;
}

/**
 * @name createConfig
 * @description Creates a new config object based on a template
 * and error-checks it against the submitted parameters.
 * @param {array} arguments An array of command-line arguments
 * @return {object} config The chart config
 * @author Andy Willis
 */

function createConfig( args, callback ) {
  var reArg = /([a-z])\:([a-zA-Z0-9_.\/,]*)/i
    ,  fromTemplate = function() { return { s: null, c: null, i: null,  e: null, r: null,  b: null, p: null, l: null } }
    ,  config = fromTemplate()
    ,  keys = Object.keys( config )
    ;

  for ( arg in args ) {
    var thisArg = args[ arg ]
      ,  match = thisArg.match( reArg )
      ,  key = match[ 1 ]
      ,  value = match[ 2 ]
      ;
    if ( config.hasOwnProperty( key ) ) {
        config[ key ] = value;
    }
  }

  try {
    for ( key in keys ) {
      var thisKey = keys[ key ]
      if ( config[thisKey] === null ) throw new Error( 'Missing parameter: ' + thisKey )
    }
    callback(null, config)
  } catch( err ) {

    var errp = err, err = ''

      var errArr = {
          'sort': ['s', 'asc | desc | none']
        , 'common word list': ['c', 'path']
        , 'input file': ['i', 'path']
        , 'exception list': ['e', 'path']
        , 'range': ['r', 'number']
        , 'bar colour': ['b', '[grey|cyan|grey|green|grey|cyan|yellow|blue|red] | rainbow']
      }

      err += '\tAdd required parameters in the format ' + '[label]'.green + ':' + '[parameters]'.yellow + '\n\n'

      for (row in errArr) {
        err += ( '\t\t' + row.toUpperCase().grey + '\n\t\t' + errArr[row][0].green  + ' ' + errArr[row][1].yellow + '\n\n');
      }

      err += ('\n\t' + errp).red
      callback( err, config )
  }

}