'use strict'

var debug = require('debug')('metalsmith-paths')
var path = require('path')
var fs = require("fs")
var matcher = require('minimatch');

/**
 * @param {Object} options
 * @return {Function}
 */

module.exports = function plugin (options) {

    return function (files, metalsmith, done) {

        setImmediate(done)

		var dirs = [];
        Object.keys(files).forEach(file => {

            debug('process file: %s', file)
			debug('Options', options)

            // check if file is in the right path using regexp
            if(matcher(file, options) ){
				dirs.push(file);
			}
        })

		dirs.forEach(file => {
			let dir = path.dirname(file);
			if (dir != '.') {
				dir = path.dirname(dir);
				let parent = dirs.find(f => path.dirname(f) == dir);
				if (parent) {
					files[parent].children = files[parent].children || [];
					files[parent].children.push(files[file]);
					files[file].parent = parent;
				}
			}

		})
    }
}
