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

"use strict";

var assert    = require("assert");
var TarsStream = require("@tars/stream");
var TarsError  = require("@tars/rpc").error;

var tars = tars || {};
module.exports.tars = tars;

tars.PropertyFProxy = function () {
    this._name   = undefined;
    this._worker = undefined;
};

tars.PropertyFProxy.prototype.setTimeout = function (iTimeout) {
    this._worker.timeout = iTimeout;
};

tars.PropertyFProxy.prototype.getTimeout = function () {
    return this._worker.timeout;
};


tars.StatPropMsgHead = function() {
    this.moduleName = "";
    this.ip = "";
    this.propertyName = "";
    this.setName = "";
    this.setArea = "";
    this.setID = "";
    this.sContainer = "";
    this.iPropertyVer = 1;
    this._classname = "tars.StatPropMsgHead";
};
tars.StatPropMsgHead._classname = "tars.StatPropMsgHead";
tars.StatPropMsgHead._write = function (os, tag, value) { os.writeStruct(tag, value); };
tars.StatPropMsgHead._read  = function (is, tag, def) { return is.readStruct(tag, true, def); };
tars.StatPropMsgHead._readFrom = function (is) {
    var tmp = new tars.StatPropMsgHead();
    tmp.moduleName = is.readString(0, true, "");
    tmp.ip = is.readString(1, true, "");
    tmp.propertyName = is.readString(2, true, "");
    tmp.setName = is.readString(3, false, "");
    tmp.setArea = is.readString(4, false, "");
    tmp.setID = is.readString(5, false, "");
    tmp.sContainer = is.readString(6, false, "");
    tmp.iPropertyVer = is.readInt32(7, false, 1);
    return tmp;
};
tars.StatPropMsgHead.prototype._writeTo = function (os) {
    os.writeString(0, this.moduleName);
    os.writeString(1, this.ip);
    os.writeString(2, this.propertyName);
    os.writeString(3, this.setName);
    os.writeString(4, this.setArea);
    os.writeString(5, this.setID);
    os.writeString(6, this.sContainer);
    os.writeInt32(7, this.iPropertyVer);
};
tars.StatPropMsgHead.prototype._equal = function (anItem) {
    return this.moduleName === anItem.moduleName && 
        this.ip === anItem.ip && 
        this.propertyName === anItem.propertyName && 
        this.setName === anItem.setName && 
        this.setArea === anItem.setArea && 
        this.setID === anItem.setID;
};
tars.StatPropMsgHead.prototype._genKey = function () {
    if (!this._proto_struct_name_) {
        this._proto_struct_name_ = "STRUCT" + Math.random();
    }
    return this._proto_struct_name_;
};
tars.StatPropMsgHead.prototype.toObject = function() { 
    return {
        "moduleName" : this.moduleName,
        "ip" : this.ip,
        "propertyName" : this.propertyName,
        "setName" : this.setName,
        "setArea" : this.setArea,
        "setID" : this.setID,
        "sContainer" : this.sContainer,
        "iPropertyVer" : this.iPropertyVer
    };
};
tars.StatPropMsgHead.prototype.readFromObject = function(json) { 
    json.hasOwnProperty("moduleName") && (this.moduleName = json.moduleName);
    json.hasOwnProperty("ip") && (this.ip = json.ip);
    json.hasOwnProperty("propertyName") && (this.propertyName = json.propertyName);
    json.hasOwnProperty("setName") && (this.setName = json.setName);
    json.hasOwnProperty("setArea") && (this.setArea = json.setArea);
    json.hasOwnProperty("setID") && (this.setID = json.setID);
    json.hasOwnProperty("sContainer") && (this.sContainer = json.sContainer);
    json.hasOwnProperty("iPropertyVer") && (this.iPropertyVer = json.iPropertyVer);
};
tars.StatPropMsgHead.prototype.toBinBuffer = function () {
    var os = new TarsStream.TarsOutputStream();
    this._writeTo(os);
    return os.getBinBuffer();
};
tars.StatPropMsgHead.new = function () {
    return new tars.StatPropMsgHead();
};
tars.StatPropMsgHead.create = function (is) {
    return tars.StatPropMsgHead._readFrom(is);
};

tars.StatPropInfo = function() {
    this.policy = "";
    this.value = "";
    this._classname = "tars.StatPropInfo";
};
tars.StatPropInfo._classname = "tars.StatPropInfo";
tars.StatPropInfo._write = function (os, tag, value) { os.writeStruct(tag, value); };
tars.StatPropInfo._read  = function (is, tag, def) { return is.readStruct(tag, true, def); };
tars.StatPropInfo._readFrom = function (is) {
    var tmp = new tars.StatPropInfo();
    tmp.policy = is.readString(0, true, "");
    tmp.value = is.readString(1, true, "");
    return tmp;
};
tars.StatPropInfo.prototype._writeTo = function (os) {
    os.writeString(0, this.policy);
    os.writeString(1, this.value);
};
tars.StatPropInfo.prototype._equal = function () {
    assert.fail("this structure not define key operation");
};
tars.StatPropInfo.prototype._genKey = function () {
    if (!this._proto_struct_name_) {
        this._proto_struct_name_ = "STRUCT" + Math.random();
    }
    return this._proto_struct_name_;
};
tars.StatPropInfo.prototype.toObject = function() { 
    return {
        "policy" : this.policy,
        "value" : this.value
    };
};
tars.StatPropInfo.prototype.readFromObject = function(json) { 
    json.hasOwnProperty("policy") && (this.policy = json.policy);
    json.hasOwnProperty("value") && (this.value = json.value);
};
tars.StatPropInfo.prototype.toBinBuffer = function () {
    var os = new TarsStream.TarsOutputStream();
    this._writeTo(os);
    return os.getBinBuffer();
};
tars.StatPropInfo.new = function () {
    return new tars.StatPropInfo();
};
tars.StatPropInfo.create = function (is) {
    return tars.StatPropInfo._readFrom(is);
};

tars.StatPropMsgBody = function() {
    this.vInfo = new TarsStream.List(tars.StatPropInfo);
    this._classname = "tars.StatPropMsgBody";
};
tars.StatPropMsgBody._classname = "tars.StatPropMsgBody";
tars.StatPropMsgBody._write = function (os, tag, value) { os.writeStruct(tag, value); };
tars.StatPropMsgBody._read  = function (is, tag, def) { return is.readStruct(tag, true, def); };
tars.StatPropMsgBody._readFrom = function (is) {
    var tmp = new tars.StatPropMsgBody();
    tmp.vInfo = is.readList(0, true, TarsStream.List(tars.StatPropInfo));
    return tmp;
};
tars.StatPropMsgBody.prototype._writeTo = function (os) {
    os.writeList(0, this.vInfo);
};
tars.StatPropMsgBody.prototype._equal = function () {
    assert.fail("this structure not define key operation");
};
tars.StatPropMsgBody.prototype._genKey = function () {
    if (!this._proto_struct_name_) {
        this._proto_struct_name_ = "STRUCT" + Math.random();
    }
    return this._proto_struct_name_;
};
tars.StatPropMsgBody.prototype.toObject = function() { 
    return {
        "vInfo" : this.vInfo.toObject()
    };
};
tars.StatPropMsgBody.prototype.readFromObject = function(json) { 
    json.hasOwnProperty("vInfo") && (this.vInfo.readFromObject(json.vInfo));
};
tars.StatPropMsgBody.prototype.toBinBuffer = function () {
    var os = new TarsStream.TarsOutputStream();
    this._writeTo(os);
    return os.getBinBuffer();
};
tars.StatPropMsgBody.new = function () {
    return new tars.StatPropMsgBody();
};
tars.StatPropMsgBody.create = function (is) {
    return tars.StatPropMsgBody._readFrom(is);
};


var __tars_PropertyF$reportPropMsg$EN = function (statmsg) {
    var os = new TarsStream.TarsOutputStream();
    os.writeMap(1, statmsg);
    return os.getBinBuffer();
};

var __tars_PropertyF$reportPropMsg$DE = function (data) {
    try {
        var is = new TarsStream.TarsInputStream(data.response.sBuffer);
        return {
            "request" : data.request,
            "response" : {
                "costtime" : data.request.costtime,
                "return" : is.readInt32(0, true, 0)
            }
        };
    } catch (e) {
        throw {
            "request" : data.request,
            "response" : {
                "costtime" : data.request.costtime,
                "error" : {
                    "code" : TarsError.CLIENT.DECODE_ERROR,
                    "message" : e.message
                }
            }
        };
    }
};

var __tars_PropertyF$reportPropMsg$ER = function (data) {
    throw {
        "request" : data.request,
        "response" : {
            "costtime" : data.request.costtime,
            "error" : data.error
        }
    }
};

tars.PropertyFProxy.prototype.reportPropMsg = function (statmsg) {
    return this._worker.tars_invoke("reportPropMsg", __tars_PropertyF$reportPropMsg$EN(statmsg), arguments[arguments.length - 1]).then(__tars_PropertyF$reportPropMsg$DE, __tars_PropertyF$reportPropMsg$ER);
};



