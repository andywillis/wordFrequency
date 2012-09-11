// Dependancies
var fs = require( 'fs' )
	,	core = require( 'core' )
	,	color = require( 'colors' )
	;

;(function main(){
	
	var commonWords = fs.readFileSync( 'words.txt', 'ascii' )
		,	exceptions = ['parrish','allison','quince','susan'].sort().join( '|' )
		,	workingData = fs.readFileSync( 'mjb.txt', 'ascii' )
		,	dataArray
		,	chartObject
		,	range = 10
		;

	core.clear();
	dataArray = processWorkingData( commonWords, exceptions, workingData, range );
	chartObject = createChartObject( dataArray );
	createConsoleChart({
			chartObject: chartObject
//		,	sort: 'asc'
			// 12 = box, 17 = solid reverse button
		,	chartType: String.fromCharCode(12)
		,	barColors: [ 'red', 'green', 'white', 'yellow', 'cyan' ]
	})

}());

/**
 * @param {string} workingData The raw data
 * @return {array} dataArray A non-deduped array of words seven letters or over
 * @author Andy Willis
 */

function processWorkingData( commonWords, exceptions, workingData, range ) {

	var dataArray
		,	rePunctuation = /[\n\t.,:<>!£$%^&*\(\)\-\=\+\[\];@#\?\|0-9]/g
		,	reCommon = new RegExp( '\\b(?:'+ getCommon( commonWords ) + ')\\b', 'gi' )
		,	reExceptions = new RegExp( '\\b(?:'+ exceptions + ')\\b', 'gi' )
		,	reRange = new RegExp( '\\b[a-z]{1,' + range + '}\\b', 'gi' )
		;
		
	return dataArray = workingData
			.toLowerCase()
			.replace( rePunctuation, ' ' )
			.replace( /[\/"']/g, ' ' )
			.replace( /\r/g, ' ' )
			.replace( reCommon, '' )
			.replace( reExceptions, '' )
			.replace( reRange, '' )
			.replace( /(?:\s{2,})/g, ' ' )
			.trim()
			.split( ' ' )
			.sort()
			;

};

/**
 * @param {string} commonWords A list of commonwords
 * @return {string} formattedWords The list of commonWords formatted for use
 * @author Andy Willis
 */

function getCommon( commonWords ) {
	
	var numbers
		, formattedWords
		;

	numbers = /[\t0-9 ]*/g;

	return formattedWords = commonWords
		.replace( numbers, '' )
		.split( '\r\n' )
		.sort()
		.join( '|' )
		;

}

/**
 * @param {array} dataArray A non-deduped array of words seven letters or over
 * @return {object} chartObject An object containing word frequency data
 * @author Andy Willis
 */

function createChartObject( dataArray ) {

	function ChartObject( dataArray ) {
		var chartObject = {}
			,	index = 0
			,	arrLen = dataArray.length
			;

		// Set all found words to count = 1
		for( element in dataArray ) {
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
			if ( chartObject[ key ] === 1 ) {
				delete chartObject[ key ];
			};
		};

		this.data = chartObject;
	}

	ChartObject.prototype.values = function() {
		var values = []
			,	data = this.data
			;

		for ( key in data ) {
			values.push( data[ key ] )
		}

		return values;
	}

	ChartObject.prototype.sum = function() {
		var sum = 0
			,	data = this.data
			;

		for (key in data) {
			sum += data[key]
		}

		return sum
	}

	ChartObject.prototype.sortValues = function( direction ) {
		var sortable = []
			,	temp = {}
			,	data = this.data
			,	direction = direction || 'asc'
			;

		for ( key in data ) {	sortable.push( [ key, data[ key ] ] ) }
		if (direction === 'asc' ) {
			sortable.sort( function(a, b) { return a[ 1 ] - b[ 1 ] } )
		} else {
			sortable.sort( function(a, b) { return b[ 1 ] - a[ 1 ] } )
		}
		this.data = {};
		for ( element in sortable ) {
			this.data[sortable[element][0]] = sortable[element][1]
		}

		return this;
	}

	return new ChartObject( dataArray );

};

/**
 * @param {object} arguments
 * @author Andy Willis
 */

function createConsoleChart( parameters ) {

	var chartObject = parameters.chartObject
		,	sort = parameters.sort
		;

	chartObject = ( sort ) ? chartObject.sortValues( sort ) : chartObject

	var index = 0
		,	textColor = 'grey'
		,	barColor = 0
		,	chartType = parameters.chartType || '|'
		,	barColors = parameters.barColors || [ 'white' ]
		,	labels = Object.keys( chartObject.data )
		,	values = chartObject.values()
		,	sum = chartObject.sum()
		,	labelLengths = labels.map( function( label ) { return label.length; } )
		,	maxLabelSize = Math.max.apply( null, labelLengths )
		, fill = function( str, num ) { var padding = new Array( num ).join( str ); return padding;	}
		,	header = '{columnOne}{columnTwo}{columnThree}'
		;

	header = header
		.replace( '{columnOne}', fill( ' ', maxLabelSize - 'WORD'.length + 4) + 'WORD' )
		.replace( '{columnTwo}', fill( ' ', 4 - '%'.length + 3) + '%' )
		.replace( '{columnThree}', fill( ' ', 7 - 'VALUE'.length + 3) + 'VALUE' )

	console.log(header);

	for ( label in labels ) {
		var thisLabel = labels[ label ]
			,	thisLabelLen = thisLabel.length
			,	diff = maxLabelSize - thisLabelLen
			, paddingRequired = ( diff === 0 ) ? false : true
			,	outLabels = ''
			,	row = '{outLabels} {percentage} {data}'
			;

		outLabels = ( paddingRequired ) ? fill( ' ', diff + 1 ) + '   ' + thisLabel : '   ' + thisLabel;
		barColor = ( barColor === barColors.length - 1 ) ? 0 : barColor + 1
		data = fill( chartType, values[ label ] )[ barColors[ barColor ] ]
		percentageValue = Math.round((values[ label ] / sum * 100) * 10 ) / 10
		percentageString = (fill( ' ', 7 - ( percentageValue.toString().length )) + percentageValue + '% ' )[ textColor ]

		row = row
			.replace( '{outLabels}', outLabels[ textColor ] )
			.replace( '{data}', data )
			.replace( '{percentage}', percentageString )

		console.log( row );
//		console.log(1/sum*100|0);

	}

};