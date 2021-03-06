/*
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

'use strict';

var through2 = require('through2');
var remark = require('remark');
var concat = require('concat-stream');
var validate = require('stratic-validate-header');
var extract = require('stratic-extract-header');
var strip = require('stratic-strip-header');
var _ = require('lodash');

var fileData = {};
var processor = remark().use(validate).use(extract, {data: fileData}).use(strip);

module.exports = function(data) {
	return through2.obj(function(file, enc, callback) {
		var that = this;
		file.pipe(concat(function(buf) {
			var doc = processor.process(buf.toString());

			_.merge(file, fileData);
			file.contents = new Buffer(doc.contents);

			that.push(file);
			callback();
		}));
	});
};
