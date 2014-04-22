var core = module.exports = {};

/**
 * merges objects
 */

core.escapeHTML = function(html){
  return String(html)
    .replace(/&(?!\w+;)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};

/**
 * merges objects
 */
 
core.merge = function(a, b){
  if (a && b) {
    for (var key in b) {
      a[key] = b[key];
    }
  }
  return a;
};

/**
 * rfc4122 compliant UUID creator
 */

core.getUUID = function getUUID() {
	var id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random()*16|0,
					v = (c == 'x') ? r : (r&0x3|0x8)

			return v.toString(16);
	})
	return id
}

core.toType = function(x) { return ({}).toString.call(x).match(/\s([a-zA-Z]+)/)[1].toLowerCase() }

/**
 * get random number between 0 and num
 */

core.getNumberInRange = function getNumberInRange(num) {
	return Math.random()*num|0
}

core.fromPrototype = function fromPrototype(prototype, object) {
	var newObject = Object.create(prototype);
 	for (var prop in object) {
		if (object.hasOwnProperty(prop)) {
			newObject[prop] = object[prop];      
		}
	}
	return newObject;
}

/**
 * clear the console
 */

core.clear = function clear() {
	console.log('\033[2J')
}

/**
 * is x an object?
 */
 
 core.isObject = function isObject(x) {
	var query = (typeof x === 'object' && x !== null && x !== 'undefined' && x !== '') ? true : false
	return query
}

/**
 * returns the name of the current module
 */

core.getModuleName = function getModuleName(path) {
	var arr = path.split('\\')
	,	name = arr[arr.length-1].split('.')[0]
	return name
}

/**
 * pads out a string with x
 */

core.pad = function pad(str, size) {
	for (var lop = 0, len = size; lop < len; lop ++) {
		str += '0'
	}
	return str
}

/**
 * returns formatted percent
 */

core.percent = function percent(sum) {
	return Math.round(sum*100)*100/100 + '%'
}

/**
 * records the time a function takes to run
 */

core.timeFn = function timeFn(fn, measurement, callback) {
	var end, start, time, text
	start = new Date().getTime()
	fn()
	end = new Date().getTime()

	switch( measurement ) {
		case 's':
			time = (end - start) / 1000
			text = 'Completed in: ' + time + ' seconds.'
			callback(text)
			break;
		default:
			time = (end - start)
			text = 'Completed in: ' + time + ' milliseconds.'
			callback(text)
			break;
	}
}

core.asFormattedArray = function asFormattedArray(string, delimiter) {
	var array = []
	array = string.replace(/\s*,\s*/g, ',').split(delimiter)
	return array
}

/**
 * gets the properties of the object
 */

core.getProps = function getProps (obj) {
	return Object.getOwnPropertyNames(obj).sort()
}

/**
 * show obj properties
 */

core.getExtProps = function getExtProps(name, obj, maxLevel, show) {
	var html = '<h1>' + name.toUpperCase() + '</h1>'
	var level = 0
	var indent = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
	var lop = function(obj, level) {
		for (prop in obj) {
			var objType = typeof obj[prop]
			switch(objType) {
				case 'object':
					if (show.indexOf(objType) >= 0 && obj[prop] !== null && Object.keys(obj[prop]).length > 0) {
						for (var el = 0; el < level; el++) html += indent
						html += '<span><b>' + prop +'</b></span><br/>'
						if (level < maxLevel) lop(obj[prop], level+1)
					}
					break;
				case 'string':
					if (show.indexOf(objType) >= 0) {
						for (var el = 0; el < level; el++) html += indent
							html += '<span>' + prop + ': ' + obj[prop] + '</span><br/>'
						}
					break;
				case 'function':
					if (show.indexOf(objType) >= 0) {
						for (var el = 0; el < level; el++) html += indent
							html += '<span><i>' + prop +'</i></span><br/>'
						}
					break;
			}
		}
	}
	lop(obj, level)
	return html
}

/**
 * Dedupes an array
 */

Array.prototype.dedupe = function dedupe() {
	
	var arr = this
		,	index = 0
		,	arrlen = arr.length
		;

	while ( index < arrlen ) {

		if ( arr[ index ] === arr[index+1] ) {
			arr.splice( index + 1, 1 );
		} else {
			index ++;
		};

	};

	return arr;
};

Object.defineProperty( Array.prototype, 'dedupe', { enumerable: false } );