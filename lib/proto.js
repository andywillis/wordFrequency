var fs = require('fs')
	,	stemmer = require('./porterstemmer2')

chart = module.exports = {};

chart.init = function( config ) {

	var commonWords = fs.readFileSync( config[ 'c' ], 'ascii' )
		,	exceptions = fs.readFileSync( config[ 'e' ], 'ascii' )
		,	inputData = fs.readFileSync( config[ 'i' ], 'ascii' )
		,	range = config[ 'r' ]
		,	stem = ( config[ 'p' ] === 'yes' ) ? true : false
		,	limit = config[ 'l' ]

	this.data = processWorkingData( commonWords, exceptions, inputData, range, stem, limit );

}

chart.values = function() {
	var values = []
		,	data = this.data
		;
	for ( key in data ) {
		values.push( data[ key ] )
	}
	return values;
}

chart.sum = function() {
	var sum = 0
		,	data = this.data
		;

	for (key in data) {
		sum += data[key]
	}

	return sum
}

chart.sortValues = function( direction ) {
	var self = this
		,	sortable = []
		,	temp = {}
		,	data = this.data
		,	direction = direction || 'asc'
		, reset = function(){ self.data = {}; }
		,	fn = {
				asc: function( arr ) {return arr.sort( function(a, b) { return a[ 1 ] - b[ 1 ] } )}
			,	desc: function( arr ) {return arr.sort( function(a, b) { return b[ 1 ] - a[ 1 ] } )}
			}
		;

	for ( key in data ) {	
		sortable.push( [ key, data[ key ] ] ) 
	};

	sortable = (direction === 'none') ? sortable : fn[ direction ]( sortable )
	reset();

	for ( element in sortable ) {
		var thisEl = sortable[element]
		this.data[thisEl[0]] = thisEl[1]
	};

	return this;

}

chart.render = function ( config ) {

	var chartObject = this.data
		,	sort = config['s']
		;

	chartObject = ( sort ) ? this.sortValues( sort ) : chartObject

	var index = 0
		,	textColor = 'grey'
		,	barColor = 0
		,	chartType = '\u2592'
		,	rainbow = [ 'red', 'green', 'white', 'yellow', 'cyan', 'grey' ]
		,	barColors = ( config[ 'b' ] === 'rainbow' ) ? rainbow : config[ 'b' ].split( ',' )
		,	labels = Object.keys( this.data )
		,	values = this.values()
		,	sum = this.sum()
		,	labelLengths = labels.map( function( label ) { return label.length; } )
		,	maxLabelSize = Math.max.apply( null, labelLengths )
		,	fill = function( str, num ) { var padding = new Array( num ).join( str ); return padding;	}
		,	header = '{columnOne}{columnTwo}{columnThree}'
		;

	header = header
		.replace( '{columnOne}', fill( ' ', maxLabelSize - 'WORD'.length + 4) + 'WORD' )
		.replace( '{columnTwo}', fill( ' ', 4 - '%'.length + 3) + '%' )
		.replace( '{columnThree}', fill( ' ', 11 - 'INSTANCES'.length + 3) + 'INSTANCES' )

	console.log(header);
	console.log(fill('-', 70));

	for ( label in labels ) {

		var thisLabel = labels[ label ]
			,	thisLabelLen = thisLabel.length
			,	diff = maxLabelSize - thisLabelLen
			, paddingRequired = ( diff === 0 ) ? false : true
			,	outLabels = ''
			,	row = '{outLabels} {percentage}  {data}'
			;

		outLabels = ( paddingRequired ) ? fill( ' ', diff + 1 ) + '   ' + thisLabel : '   ' + thisLabel;
		barColor = ( barColor === barColors.length - 1 ) ? 0 : barColor + 1
		data = fill( chartType, values[ label ] + 1 )[ barColors[ barColor ] ]
		percentageValue = Math.round((values[ label ] / sum * 100) * 10 ) / 10
		percentageString = (fill( ' ', 6 - ( percentageValue.toString().length )) + percentageValue + '% ' )[ textColor ]

		row = row
			.replace( '{outLabels}', outLabels[ textColor ] )
			.replace( '{data}', data )
			.replace( '{percentage}', percentageString )

		console.log( row );

	}

	console.log(fill('-', 70));
	console.log(header);

};

/**
 * @param {string} workingData The raw data
 * @return {array} dataArray A non-deduped array of words seven letters or over
 * @author Andy Willis
 */

function processWorkingData( commonWords, exceptions, workingData, range, stem, limit ) {

	var dataArray
		,	reNotAllowedChar = /[^a-zA-Z ]/gim
		,	reNotAllowedWord = /january|february|march|april|may|june|july|august|september|october|november|december/gim
		, reContraction = /\b[a-z]*['’][a-z]*\b/gim
		,	spaceFill = /\s{1,}/gim
		,	reCommon = new RegExp( '\\b(?:'+ processList( commonWords ) + ')\\b', 'gim' )
		,	reExceptions = new RegExp( '\\b(?:'+ processList( exceptions ) + ')\\b', 'gim' )
		,	reRange = new RegExp( '\\b[a-z]{1,' + range + '}\\b', 'gim' )
		;
		
	 dataArray = workingData
			.toLowerCase()
			.replace( reContraction, '')
			.replace( reCommon, '' )
			.replace( reNotAllowedChar, ' ' )
			.replace( reNotAllowedWord, '' )
			.replace( reExceptions, '' )
			.replace( reRange, '' )
			.replace( spaceFill, ' ' )
			.trim()
			.split( ' ' )
			.sort()
			;

	var chartObject = {}
		,	index = 0
		,	arrLen = dataArray.length

	for( element in dataArray ) {
		if (stem) dataArray[ element ] = stemmer(dataArray[ element ])
		chartObject[ dataArray[ element ] ] = 1
	};

	while( index < arrLen ) {
		if ( dataArray[ index ] === dataArray[ index + 1 ] ) {
			chartObject[ dataArray[ index ] ] ++;
			dataArray.splice( index + 1, 1 );
			arrLen --;
		} else {
			index ++;
		};
	};

	for ( key in chartObject ) {
		if ( chartObject[ key ] <= limit ) {
			delete chartObject[ key ];
		};
	};		

	return chartObject;

};

/**
 * @param {string} commonWords A list of commonwords
 * @return {string} formattedWords The list of commonWords formatted for use
 * @author Andy Willis
 */

function processList( list ) {
	var numbers
		, formattedWords
		;

	numbers = /[\t0-9 ]*/g;

	return formattedWords = list
		.replace( numbers, '' )
		.split( '\r\n' )
		.sort()
		.join( '|' )
		;
}