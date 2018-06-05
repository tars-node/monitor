/**
 * Tencent is pleased to support the open source community by making Tars available.
 *
 * Copyright (C) 2016THL A29 Limited, a Tencent company. All rights reserved.
 *
 * Licensed under the BSD 3-Clause License (the "License"); you may not use this file except 
 * in compliance with the License. You may obtain a copy of the License at
 *
 * https://opensource.org/licenses/BSD-3-Clause
 *
 * Unless required by applicable law or agreed to in writing, software distributed 
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR 
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the 
 * specific language governing permissions and limitations under the License.
 */

'use strict';

var util = require('util');

var Max = function() {
	this._val = undefined;
};
Max.prototype.name = 'Max';
Max.prototype.get = function() {
	var value = this._val;
	if (value !== undefined) {
		this._val = undefined;
		return value;
	}
};
Max.prototype.add = function(value) {
	var _value = parseFloat(value);
	if (!isNaN(_value)) {
		if (this._val !== undefined) {
			this._val = Math.max(this._val, _value);
		} else {
			this._val = _value;
		}
		return true;
	} else {
		return false;
	}
};

var Min = function() {
	this._val = undefined;
};
Min.prototype.name = 'Min';
Min.prototype.get = function() {
	var value = this._val;
	if (value !== undefined) {
		this._val = undefined;
		return value;
	}
};
Min.prototype.add = function(value) {
	var _value = parseFloat(value);
	if (!isNaN(_value)) {
		if (this._val !== undefined) {
			this._val = Math.min(this._val, _value);
		} else {
			this._val = _value;
		}
		return true;
	} else {
		return false;
	}
};

var Count = function() {
	this._val = undefined;
};
Count.prototype.name = 'Count';
Count.prototype.get = function() {
	var _value = this._val;
	if (_value !== undefined) {
		this._val = undefined;
		return _value;
	}
};
Count.prototype.add = function() {
	if (this._val !== undefined) {
		this._val += 1;
	} else {
		this._val = 1;
	}
	return true;
};

var Sum = function() {
	this._val = undefined;
};
Sum.prototype.name = 'Sum';
Sum.prototype.get = function() {
	var _value = this._val;
	if (_value !== undefined) {
		this._val = undefined;
		return _value;
	}
};
Sum.prototype.add = function(value) {
	var _value = parseFloat(value);
	if (!isNaN(_value)) {
		if (this._val !== undefined) {
			this._val += _value;
		} else {
			this._val = _value;
		}
		return true;
	} else {
		return false;
	}
};

var Avg = function() {
	this._sum = undefined;
	this._count = undefined;
};
Avg.prototype.name = 'Avg';
Avg.prototype.get = function() {
	var _value;

	if (this._count !== undefined) {
		_value = Math.floor(this._sum / this._count);
		this._count = undefined;
		this._sum = undefined;
		return _value;
	}
};
Avg.prototype.add = function(value) {
	var _value = parseFloat(value);
	if (!isNaN(_value)) {
		if (this._count !== undefined) {
			this._count += 1;
			this._sum += _value;
		} else {
			this._count = 1;
			this._sum = _value;
		}
		return true;
	} else {
		return false;
	}
};

var Distr = function(ranges) {
	if (Array.isArray(ranges) && ranges.length > 0) {
		this._ranges = ranges;
		this._results = [];
	}
};
Distr.prototype.name = 'Distr';
Distr.prototype.get = function() {
	var ths = this, data;
	if (this._ranges && this._results && this._results.length > 0 && this._ranges.length > 0) {
		data = this._ranges.map(function(range, index) {
			return util.format('%s|%s', range, ths._results[index] || 0);
		}).join(',');
		
		this._results = [];

		return data;
	}
};
Distr.prototype.add = function(value) {
	var ths = this, _value;
	if (this._ranges && this._results) {
		_value = parseFloat(value);
		if (!isNaN(_value)) {
			this._ranges.some(function(range, index) {
				if (_value <= range) {
					if (!ths._results[index]) {
						ths._results[index] = 1;
					} else {
						ths._results[index] += 1;
					}
					return true;
				}
			});
			return true;
		} else {
			return false;
		}
	}
};

exports.Max = Max;
exports.Min = Min;
exports.Sum = Sum;
exports.Avg = Avg;
exports.Count = Count;
exports.Distr = Distr;