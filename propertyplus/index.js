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

var assert = require('assert');

var Tars = require('@tars/rpc');
var TarsConfigure = require('@tars/utils').Config;
var TarsStream = require('@tars/stream');

var PropertyPlusF = require('./PropertyPlusFProxy');

var POLICYFunc = require('../policy');

exports.LogAllotObj = 'WSDITIL.LogAllotServer4Comm.LogAllotObj';
exports.reportInterval = 10 * 1000;
exports.POLICY = POLICYFunc;

var serverName, localIp;

var emptyfn = function() {};

var data = {}, timer_id, client;

var ReportObj = function(policies, options) {
	var POLICY_lIST = [POLICYFunc.Sum, POLICYFunc.Avg, POLICYFunc.Max, POLICYFunc.Min, POLICYFunc.Count];

	if (policies) {
		assert(Array.isArray(policies), 'policies must be an Array');
		assert(policies.every(function(policy) { return POLICY_lIST.indexOf(policy) !== -1 }), 'every policy must be one of the Sum, Avg, Max, Min or Count');
	}

	this.policies = policies;

	this._logs = {};
	this._boundary = '|';
	this._options = options;
};
ReportObj.prototype.report = function(keys, values) {
	var logKey, logObj;

	assert(Array.isArray(keys), 'keys must be an Array');
	assert(keys.every(function(key) { return typeof key === 'string' }), 'every item in keys must be an String');
	assert(Array.isArray(values), 'values must be an Array');

	logKey = keys.join(this._boundary);
	logObj = this._logs[logKey];

	if (!logObj) {
		if (!this.policies) {
			this.policies = values.map(function() {
				return POLICYFunc.Sum;
			});
		}

		logObj = {
			keys : this._options.notTarsLog ? keys : [serverName, localIp].concat(keys),
			policies : this.policies.map(function(policy) {
				return new policy;
			})
		};

		this._logs[logKey] = logObj;
	}

	logObj.policies.forEach(function(policy, index) {
		if (!policy.add(values[index])) {
			policy.add(0);
		}
	});

	if (!timer_id) {
		timer_id = setTimeout(task, exports.reportInterval);
	}
};
ReportObj.prototype.get = function() {
	var ths = this;

	var result = Object.getOwnPropertyNames(this._logs).map(function(logKey) {
		var logObj = ths._logs[logKey], binBuffer = null;

		var StatContent = new PropertyPlusF.tars.StatContent;
		StatContent.keys.value = logObj.keys;

		logObj.policies.forEach(function(policy) {
			var StatValue = new PropertyPlusF.tars.StatValue;
			StatValue.count = 1;
			StatValue.value = policy.get() || 0;
			StatValue.policy = policy.name;
			StatContent.values.push(StatValue);
		});

		binBuffer = StatContent.toBinBuffer();
		
		return binBuffer._buffer.slice(0, binBuffer._length);
	});

	if (!this._options.cacheKeyPolicy) {
		this._logs = {};
	}

	return result;
};

var task = function() {
	var statlogs = new TarsStream.List(PropertyPlusF.tars.StatLog);

	if (!client) {
		client = Tars.client.stringToProxy(PropertyPlusF.tars.PropertyPlusFProxy, exports.LogAllotObj);
	}

	Object.getOwnPropertyNames(data).forEach(function(logname) {
		var arr = data[logname].get(), stLogs;
		if (arr.length > 0) {
			stLogs = new PropertyPlusF.tars.StatLog;
			stLogs.logname = logname;
			stLogs.content.value = arr;

			statlogs.push(stLogs);
		}
	});

	if (statlogs.length > 0) {
		client.mutillogstat(statlogs).catch(emptyfn);
	}

	timer_id = undefined;
};

var init = function(obj) {
	var tarsConfig, setdivision;

	obj = obj || process.env.TARS_CONFIG;

	assert(obj, 'TARS_CONFIG is not in env and init argument is neither an TARSConfigureObj nor a String.');
	
	if (typeof obj === 'string' && obj !== '') {
		Tars.client.initialize(obj);
		tarsConfig = new TarsConfigure();
		tarsConfig.parseFile(obj);
	} else {
		tarsConfig = obj;
	}

	assert(typeof tarsConfig === 'object', 'init argument not an TARSCnfigureObj');

	exports.LogAllotObj = tarsConfig.get('tars.application.client.propertyplus', exports.LogAllotObj);

	if (!isNaN(parseInt(tarsConfig.get('tars.application.client.report-interval')))) {
		exports.reportInterval = parseInt(tarsConfig.get('tars.application.client.report-interval'));
	}

	serverName = tarsConfig.get('tars.application.client.modulename');
	assert(serverName, 'moduleName not found in TARS_CONFIG(tars.application.client.modulename)');

	localIp = tarsConfig.get('tars.application.server.localip');
	assert(localIp, 'localip not found in TARS_CONFIG(tars.application.server.localip)');

	setdivision = tarsConfig.get('tars.application.setdivision');

	if (tarsConfig.get('tars.application.enableset', '').toLowerCase() === 'y' && setdivision && typeof setdivision === 'string') {
		setdivision = setdivision.split('.');
		if (setdivision.length >= 3) {
			serverName += '.' + setdivision[0] + setdivision[1] + setdivision.slice(2).join('.');
		}
	}
};

exports.init = init;

exports.create = function(name, policies, options) {
	var logname, opt = options || {};

	assert(name, 'name must be a String');

	if (!serverName) {
		init();
	}

	if (opt.notTarsLog) {
		logname = 'opp_' + name;
	} else {
		logname = 'pp_' + serverName + '_' + name;
	}

	data[logname] = data[logname] || new ReportObj(policies, opt);

	return data[logname];
};