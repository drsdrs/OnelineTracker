(function(){"use strict";function e(){this.impl=null,this.isPlaying=!1,this.samplerate=44100,this.channels=2,this.cellsize=128,this.streammsec=20,this.streamsize=0,this.generator=null}var t=null,i=function(){return"undefined"!=typeof window?window.webkitAudioContext||window.AudioContext:void 0}();t=i!==void 0?function(e){var t,a,n=new i;this.maxSamplerate=n.sampleRate,this.defaultSamplerate=n.sampleRate,this.env="webkit";var s=navigator.userAgent;s.match(/linux/i)?e.streammsec*=8:s.match(/win(dows)?\s*(nt 5\.1|xp)/i)&&(e.streammsec*=4),this.play=function(){var i,s,r,o=e.getAdjustSamples(n.sampleRate),l=e.streamsize;e.samplerate===n.sampleRate?i=function(t){var i=t.outputBuffer;e.process(),i.getChannelData(0).set(e.strmL),i.getChannelData(1).set(e.strmR)}:2*e.samplerate===n.sampleRate?i=function(t){var i,a,n=e.strmL,s=e.strmR,r=t.outputBuffer,o=r.getChannelData(0),l=r.getChannelData(1),c=r.length;for(e.process(),i=a=0;c>i;i+=2,++a)o[i]=o[i+1]=n[a],l[i]=l[i+1]=s[a]}:(s=l,r=e.samplerate/n.sampleRate,i=function(t){var i,a=e.strmL,n=e.strmR,o=t.outputBuffer,c=o.getChannelData(0),p=o.getChannelData(1),u=o.length;for(i=0;u>i;++i)s>=l&&(e.process(),s-=l),c[i]=a[0|s],p[i]=n[0|s],s+=r}),t=n.createBufferSource(),a=n.createJavaScriptNode(o,2,e.channels),a.onaudioprocess=i,t.noteOn(0),t.connect(a),a.connect(n.destination)},this.pause=function(){t.disconnect(),a.disconnect()}}:"function"==typeof Audio&&"function"==typeof(new Audio).mozSetup?function(e){var t=function(){var e="var t=0;onmessage=function(e){if(t)t=clearInterval(t),0;if(typeof e.data=='number'&&e.data>0)t=setInterval(function(){postMessage(0);},e.data);};",t=new Blob([e],{type:"text/javascript"}),i=window.URL.createObjectURL(t);return new Worker(i)}();this.maxSamplerate=48e3,this.defaultSamplerate=44100,this.env="moz",this.play=function(){var i=new Audio,a=new Float32Array(e.streamsize*e.channels),n=e.streammsec,s=0,r=1e3*(e.streamsize/e.samplerate),o=Date.now(),l=function(){if(!(s>Date.now()-o)){var t=e.strmL,n=e.strmR,l=a.length,c=t.length;for(e.process();c--;)a[--l]=n[c],a[--l]=t[c];i.mozWriteAudio(a),s+=r}};i.mozSetup(e.channels,e.samplerate),t.onmessage=l,t.postMessage(n)},this.pause=function(){t.postMessage(0)}}:function(){this.maxSamplerate=48e3,this.defaultSamplerate=8e3,this.env="nop",this.play=function(){},this.pause=function(){}};var a=[8e3,11025,12e3,16e3,22050,24e3,32e3,44100,48e3],n=[32,64,128,256];e.prototype.bind=function(e,t){if("function"==typeof e){var i=new e(this,t);"function"==typeof i.play&&"function"==typeof i.pause&&(this.impl=i,this.impl.defaultSamplerate&&(this.samplerate=this.impl.defaultSamplerate))}return this},e.prototype.setup=function(e){if("object"==typeof e)-1!==a.indexOf(e.samplerate)&&(this.samplerate=e.samplerate<=this.impl.maxSamplerate?e.samplerate:this.impl.maxSamplerate),-1!==n.indexOf(e.cellsize)&&(this.cellsize=e.cellsize);else if("string"==typeof e)switch(e){case"mobile":this.samplerate=22050,this.cellsize=128;break;case"high-res":this.cellsize=32;break;case"low-res":this.cellsize=256}return this},e.prototype.getAdjustSamples=function(e){var t,i;return e=e||this.samplerate,t=this.streammsec/1e3*e,i=Math.ceil(Math.log(t)*Math.LOG2E),i=8>i?8:i>14?14:i,1<<i},e.prototype.play=function(e){return this.isPlaying||"object"!=typeof e?this:(this.isPlaying=!0,this.generator=e,this.streamsize=this.getAdjustSamples(),this.strmL=new Float32Array(this.streamsize),this.strmR=new Float32Array(this.streamsize),this.cellL=new Float32Array(this.cellsize),this.cellR=new Float32Array(this.cellsize),this.impl.play(),this)},e.prototype.pause=function(){return this.isPlaying&&(this.isPlaying=!1,this.impl.pause()),this},e.prototype.process=function(){for(var e,t,i=this.cellL,a=this.cellR,n=this.strmL,s=this.strmR,r=this.generator,o=i.length,l=0,c=this.streamsize/this.cellsize;c--;)for(r.process(i,a),e=0;o>e;++e,++l)t=i[e],n[l]=-1>t?-1:t>1?1:t,t=a[e],s[l]=-1>t?-1:t>1?1:t};var s=(new e).bind(t),r={setup:function(e){return s.setup(e),this},bind:function(e,t){return s.bind(e,t),this},play:function(e){return s.play(e),this},pause:function(){return s.pause(),this}};Object.defineProperties(r,{env:{get:function(){return s.impl.env}},samplerate:{get:function(){return s.samplerate}},channels:{get:function(){return s.channels}},cellsize:{get:function(){return s.cellsize}},isPlaying:{get:function(){return s.isPlaying}}}),"undefined"!=typeof module&&module.exports?module.exports=global.pico=r:"undefined"!=typeof window&&(window.Float32Array===void 0&&(window.Float32Array=function(e){var t;if(Array.isArray(e))t=e.slice();else if("number"==typeof e){t=Array(e);for(var i=0;e>i;++i)t[i]=0}else t=[];return t.set=function(e,t){t===void 0&&(t=0);var i,a=Math.min(this.length-t,e.length);for(i=0;a>i;++i)this[t+i]=e[i]},t.subarray=function(e,t){return t===void 0&&(t=this.length),this.slice(e,t)},t}),r.noConflict=function(){var e=window.pico;return function(){return window.pico===r&&(window.pico=e),r}}(),window.pico=r),function(){function e(e){try{return t.plugins&&t.mimeTypes&&t.mimeTypes.length?t.plugins["Shockwave Flash"].description.match(/([0-9]+)/)[e]:new ActiveXObject("ShockwaveFlash.ShockwaveFlash").GetVariable("$version").match(/([0-9]+)/)[e]}catch(i){return-1}}if("undefined"!=typeof window&&"nop"===window.pico.env){var t=navigator;if(!(10>e(0))){var i,a="PicoFlashPlayerDiv",n=function(){var e=document.getElementsByTagName("script");if(e&&e.length)for(var t,i=0,a=e.length;a>i;++i)if(t=/^(.*\/)pico(?:\.dev)?\.js$/i.exec(e[i].src))return t[1]+"pico.swf"}();window.picojs_flashfallback_init=function(){function e(e){var t=0;this.maxSamplerate=44100,this.defaultSamplerate=44100,this.env="flash",this.play=function(){var a,s=Array(e.streamsize*e.channels),r=e.streammsec,o=0,l=1e3*(e.streamsize/e.samplerate),c=Date.now();a=function(){if(!(o>Date.now()-c)){var t=e.strmL,a=e.strmR,n=s.length,r=t.length;for(e.process();r--;)s[--n]=0|32768*a[r],s[--n]=0|32768*t[r];i.writeAudio(s.join(" ")),o+=l}},i.setup?(i.setup(e.channels,e.samplerate),t=setInterval(a,r)):console.warn("Cannot find "+n)},this.pause=function(){0!==t&&(i.cancel(),clearInterval(t),t=0)}}s.bind(e),delete window.picojs_flashfallback_init};var r,o,l=n,c=l+"?"+ +new Date,p="PicoFlashPlayer",u=document.createElement("div");u.id=a,u.style.display="inline",u.width=u.height=1,t.plugins&&t.mimeTypes&&t.mimeTypes.length?(r=document.createElement("object"),r.id=p,r.classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",r.width=r.height=1,r.setAttribute("data",c),r.setAttribute("type","application/x-shockwave-flash"),o=document.createElement("param"),o.setAttribute("name","allowScriptAccess"),o.setAttribute("value","always"),r.appendChild(o),u.appendChild(r)):u.innerHTML='<object id="'+p+'" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="1" height="1"><param name="movie" value="'+c+'" /><param name="bgcolor" value="#FFFFFF" /><param name="quality" value="high" /><param name="allowScriptAccess" value="always" /></object>',window.addEventListener("load",function(){document.body.appendChild(u),i=document[p]})}}}()})();
//@ sourceMappingURL=pico.js.map
/*
	audiolib.js
	Jussi Kalliokoski
	https://github.com/jussi-kalliokoski/audiolib.js
	MIT license
*/

/*
	wrapper-start.js
	Please note that the file is not of valid syntax when standalone.
*/

this.audioLib = (function AUDIOLIB (global, Math, Object, Array) {

function onready (callback) {
	onready.list.push(callback);
}

onready.list = [];

var	arrayType	= global.Float32Array || Array,
	audioLib	= this;

function Float32Array (length) {
	var array = new arrayType(length);
	array.subarray = array.subarray || array.slice;
	return array;
}

audioLib.Float32Array = Float32Array;

var __define = (function () {

	if (Object.defineProperty) {
		return Object.defineProperty;
	} else if (Object.prototype.__defineGetter__) {
		return function(obj, prop, desc){
			desc.get && obj.__defineGetter__(prop, desc.get);
			desc.set && obj.__defineSetter__(prop, desc.set);
		}
	}

}());

function __defineConst (obj, prop, value, enumerable) {
	if (__define) {
		__define(obj, prop, {
			get: function () {
				return value;
			},
			enumerable: !!enumerable
		});
	} else {
		// Cheap...
		obj[prop] = value;
	}
}

__defineConst(audioLib, '__define', __define);
__defineConst(audioLib, '__defineConst', __defineConst);

function __extend (obj) {
	var	args	= arguments,
		l	= args.length,
		i, n;
	for (i=1; i<l; i++) {
		for (n in args[i]) {
			if (args[i].hasOwnProperty(n)) {
				obj[n] = args[i][n];
			}
		}
	}
	return obj;
}

__defineConst(audioLib, '__extend', __extend);

function __enum (obj, callback, unignoreInherited) {
	var i;
	for (i in obj) {
		(obj.hasOwnProperty(i) || unignoreInherited) && callback.call(obj, obj[i], i);
	}
	return obj;
}

__defineConst(audioLib, '__enum', __enum);

function __class (name, constructor, args) {
	var	i, cls;
	if (!args) {
		args	= [];
		i	= /^\s*function\s*\w*\s*\(([^\)]+)/.exec(constructor);
		if (i) {
			i[1].replace(/[a-z$_0-9]+/ig, function (i) {
				args.push(i);
			});
		} else {
			for (i=0; i<constructor.length; i++) {
				args[i] = Array(i+2).join('_');
			}
		}
	}
	cls = Function('var __q;return function ' + name + '(' + args.join() + '){var i; if(__q){__q=!__q}else if(this instanceof ' + name +')this.__CLASSCONSTRUCTOR.apply(this,arguments);else{__q=!__q;i=new ' + name + ';i.__CLASSCONSTRUCTOR.apply(i,arguments);return i}};')();
	cls.prototype = constructor.prototype;
	cls.prototype.__CLASSCONSTRUCTOR = constructor;
	__extend(cls, constructor);
	return cls;
}

__defineConst(audioLib, '__class', __class);
function AutomationClass (parameter, automation, amount, type) {
	this.parameter	= parameter;
	this.automation	= automation;
	this.amount	= isNaN(amount) ? this.amount : amount;
	this.setType(type);
}

AutomationClass.prototype = {
	parameter:	'',
	automation:	null,
	amount:		1,
	type:		'modulation',
	mode:		null,
	setType: function (type) {
		if (type) {
			if (typeof type === 'function') {
				this.type = type.name || 'custom';
				this.mode = type;
			}
			this.type	= type;
			this.mode	= Automation.modes[type];
		} else {
			this.mode	= this.mode || Automation.modes[this.type];
		}
	}
};

/**
 * Applies automation to a specified component.
 *
 * @class
 *
 * @arg type:Component The effect to apply the automation to.
 * @arg =!parameter
 * @arg =!automation
 * @arg =!amount
 * @arg =!type
 *
 * @param type:String parameter The name of the parameter to apply automation to.
 * @param type:Component automation The component that controls the automation.
 * @param type:Float default:1 amount The amount of automation to apply.
 * @param type:String|Function default:modulation type The algorithm of applying the automation, can be a string for predefined types or a custom function.
*/
function Automation (fx, parameter, automation, amount, type) {
	if (!fx.automation) {
		fx.automation = [];
		switch (fx.type) {
		case 'generator':
			fx.append = Automation.generatorAppend;		break;
		case 'effect':
			fx.append = Automation.effectAppend;		break;
		case 'buffereffect':
			fx.append = Automation.bufferEffectAppend;	break;
		}
	}

	automation = new AutomationClass(parameter, automation, amount, type);
	fx.automation.push(automation);
	return automation;
}

Automation.generatorAppend = function (buffer, channelCount, out) {
	var	self	= this,
		l	= buffer.length,
		k	= self.automation.length,
		def	= [],
		z, i, n, m, a;
	out		= out || buffer;
	channelCount	= channelCount || self.channelCount;
	for (m=0; m<k; m++) {
		def.push(self[self.automation[m].parameter]);
	}
	for (i=0, z=0; i<l; i+=channelCount, z++) {
		for (m=0; m<k; m++) {
			self[self.automation[m].parameter] = def[m];
		}
		for (m=0; m<k; m++) {
			a = self.automation[m];
			a.mode(self, a.parameter, a.amount * a.automation.generatedBuffer[z]);
		}

		self.generate();

		for (n=0; n<channelCount; n++) {
			out[i + n] = self.getMix(n) * self.mix + buffer[i + n];
		}
	}
	for (m=0; m<k; m++) {
		self[self.automation[m].parameter] = def[m];
	}
	return out;
};

Automation.effectAppend = function (buffer, channelCount, out) {
	var	self	= this,
		l	= buffer.length,
		k	= self.automation.length,
		def	= [],
		z, i, n, m, a;
	out		= out || buffer;
	channelCount	= channelCount || self.channelCount;
	for (m=0; m<k; m++) {
		def.push(self[self.automation[m].parameter]);
	}
	for (i=0, z=0; i<l; i+=channelCount, z++) {
		for (m=0; m<k; m++) {
			self[self.automation[m].parameter] = def[m];
		}
		for (m=0; m<k; m++) {
			a = self.automation[m];
			a.mode(self, a.parameter, a.amount * a.automation.generatedBuffer[z]);
		}

		for (n=0; n<channelCount; n++) {
			self.pushSample(buffer[i + n], n);
			out[i + n] = self.getMix(n) * self.mix + buffer[i + n] * (1 - self.mix);
		}
	}
	for (m=0; m<k; m++) {
		self[self.automation[m].parameter] = def[m];
	}
	return out;
};

Automation.bufferEffectAppend = function(buffer, channelCount, out) {
	var	self	= this,
		ch	= channelCount || self.channelCount,
		l	= buffer.length,
		k	= self.automation.length,
		def	= [],
		i, n, m, z, a, x;
	out		= out || buffer;
	for (m=0; m<k; m++) {
		def.push([]);
		for (n=0; n<ch; n++) {
			def[m].push(self.effects[n][self.automation[m].parameter]);
		}
	}
	for (x=0, i=0; i<l; i+=ch, x++) {
		for (n=0; n<ch; n++) {
			for (m=0; m<k; m++) {
				a = self.automation[m];
				self.effects[n][a.parameter] = def[m][n];
				a.mode(self.effects[n], a.parameter, a.amount * a.automation.generatedBuffer[x]);
			}
			out[i + n] = self.effects[n].pushSample(buffer[i + n]) * self.mix + buffer[i + n] * (1 - self.mix);
		}
	}
	for (m=0; m<k; m++) {
		for (n=0; n<ch; n++) {
			self.effects[n][self.automation[m].parameter] = def[m][n];
		}
	}
	return out;
};

Automation.modes = {
	modulation: function (fx, param, value) {
		fx.setParam(param, fx[param] * value);
	},
	addition: function (fx, param, value) {
		fx.setParam(param, fx[param] + value);
	},
	subtraction: function (fx, param, value) {
		fx.setParam(param, fx[param] - value);
	},
	additiveModulation: function (fx, param, value) {
		fx.setParam(param, fx[param] + fx[param] * value);
	},
	subtractiveModulation: function (fx, param, value) {
		fx.setParam(param, fx[param] - fx[param] * value);
	},
	assignment: function (fx, param, value) {
		fx.setParam(param, value);
	},
	absoluteAssignment: function (fx, param, value) {
		fx.setParam(param, Math.abs(value));
	}
};

Automation.__constructror = AutomationClass;

onready(function () {
	audioLib.BufferEffect.prototype.addAutomation	=
	audioLib.EffectClass.prototype.addAutomation	=
	audioLib.GeneratorClass.prototype.addAutomation	=
	function addAutomation () {
		return audioLib.Automation.apply(audioLib, [this].concat([].slice.call(arguments)));
	};
});

/**
 * Applies automation to a specified component.
 *
 * @method Effect
 * @name addAutomation
 *
 * @arg type:String parameter The name of the parameter to apply automation to.
 * @arg type:Component automation The component that controls the automation.
 * @arg type:Float default:1 amount The amount of automation to apply.
 * @arg type:String|Function default:modulation type The algorithm of applying the automation, can be a string for predefined types or a custom function.
*/

/**
 * Applies automation to a specified component.
 *
 * @method Generator
 * @name addAutomation
 *
 * @arg type:String parameter The name of the parameter to apply automation to.
 * @arg type:Component automation The component that controls the automation.
 * @arg type:Float default:1 amount The amount of automation to apply.
 * @arg type:String|Function default:modulation type The algorithm of applying the automation, can be a string for predefined types or a custom function.
*/

/**
 * Buffer effect class provides a multi-channel interface for single channel effects.
 *
 * @class
 *
 * @arg type:ComponentClass effect The component class to create a buffer effect of.
 * @arg =!channelCount
 * @arg type:ArgumentArray !args An array of arguments to feed to the created effects.
 *
 * @param type:UInt min:2 units=channels channelCount The channel count of the buffer effect.
 * @param type:Float mix The mix between dry and wet for the effect.
*/
function BufferEffect (effect, channelCount, args) {
	this.channelCount	= isNaN(channelCount) ? this.channelCount : channelCount;
	this.effects		= [];

	function fx () {
		effect.apply(this, args);
	}
	fx.prototype = effect.prototype;

	while (channelCount--) {
		this.effects.push(new fx());
	}
}

BufferEffect.prototype = {
	mix:		0.5,
	type:		'buffereffect',
	channelCount:	2,
	append:	function (buffer, channelCount, out) {
		var	self	= this,
			l	= buffer.length,
			i, n;
		channelCount	= channelCount || self.channelCount;
		out		= out || buffer;
		for (i=0; i<l; i+=channelCount) {
			for (n=0; n<channelCount; n++) {
				self.effects[n].pushSample(buffer[i + n], 0);
				out[i + n] = self.effects[n].getMix(0) * self.mix + buffer[i + n] * (1 - self.mix);
			}
		}
		return out;
	},
	addPreProcessing: function () {
		var i;
		for (i=0; i<this.effects.length; i++){
			this.effects[i].addPreProcessing.apply(this.effects[i], arguments);
		}
	},
	removePreProcessing: function () {
		var i;
		for (i=0; i<this.effects.length; i++){
			this.effects[i].removePreProcessing.apply(this.effects[i], arguments);
		}
	},
	setParam: function (param, value) {
		var	l	= this.effects.length,
			i;
		for (i=0; i<l; i++) {
			this.effects[i].setParam(param, value);
		}
	}
};

onready(function () {
	audioLib.EffectClass.createBufferBased = function createBufferBased (channelCount) {
		return new audioLib.BufferEffect(this, channelCount, [].slice.call(arguments, 1));
	};
});

function Codec (name, codec) {
	var nameCamel = name[0].toUpperCase() + name.substr(1).toLowerCase();
	Codec[name] = codec;

	if (codec.decode) {
		audioLib.Sampler.prototype['load' + nameCamel] = function (filedata) {
			this.load.apply(this, [Codec[name].decode(filedata)].concat([].slice.call(arguments, 1)));
		};
	}

	if (codec.encode) {
		audioLib.AudioDevice.Recording.prototype['to' + nameCamel] = function (bytesPerSample) {
			return Codec[name].encode({
				data:		this.join(),
				sampleRate:	this.boundTo.sampleRate,
				channelCount:	this.boundTo.channelCount,
				bytesPerSample:	bytesPerSample
			});
		};
	}

	return codec;
}

/**
 * The parent class of all effects.
 *
 * @name Effect
 * @class
 *
 * @param type:Float mix The mix between dry and wet for the effect.
 * @param type:UInt min:1 units:channels The channel count of the effect. If one, will be treated like a single channel effect and to be used with createBufferBased().
*/
function EffectClass () {}

EffectClass.prototype = {
	type:		'effect',
	sink:		true,
	source:		true,
	mix:		0.5,
	channelCount:	1,
/**
 * Applies the effect to a buffer of audio data and optionally puts the result on a separate output channel.
 *
 * @method Effect
 *
 * @arg {Array<Float>} buffer The buffer to apply the effect to.
 * @arg {UInt} min:1 !channelCount The amount of channels the buffer has.
 * @arg {Array<Float>} default:buffer out The optional output buffer.
 * @return {Array<Float>} The output buffer.
*/
	append: function (buffer, channelCount, out) {
		var	l	= buffer.length,
			i, n;
		out		= out || buffer;
		channelCount	= channelCount || this.channelCount;
		for (i=0; i<l; i+=channelCount) {
			for (n=0; n<channelCount; n++) {
				this.pushSample(buffer[i + n], n);
				out[i + n] = this.getMix(n) * this.mix + buffer[i + n] * (1 - this.mix);
			}
		}
		return out;
	},
/**
 * Adds a callback that is applied before pushSample() to the effect.
 *
 * @method Effect
 *
 * @arg {Function} callback The callback to add.
*/
	addPreProcessing: function (callback) {
		callback.pushSample = this.pushSample;
		this.pushSample = function () {
			callback.apply(this, arguments);
			return callback.pushSample.apply(this, arguments);
		};
	},
/**
 * Removes a callback from the pre-processing queue.
 *
 * @method Effect
 *
 * @arg {Function} callback The callback to remove.
*/
	removePreProcessing: function (callback) {
		var f;
		while (f = this.pushSample.pushSample) {
			if (f === callback || !callback) {
				this.pushSample		= f;
				callback.pushSample	= null;
			}
		}
	},
/**
 * Sets a parameter of the effect to a certain value, taking into account all the other changes necessary to keep the effect sane.
 *
 * @method Effect
 *
 * @arg {String} param The parameter to change.
 * @arg value The value to set the parameter to.
*/
	setParam: function (param, value) {
		this[param] = value;
	},
/**
 * Pushes a sample to the effect, moving it one sample forward in sample time.
 *
 * @method Effect
 *
 * @arg {Float} The sample to push to the effect.
 * @arg {UInt} min:1 !channel The channel to push to. This is only applicable to multi-channel effects.
*/
	pushSample: function () {},
/**
 * Retrieves the current output of the effect.
 *
 * @method Effect
 *
 * @arg {UInt} default:0 !channel The channel to retrieve the output of. This is only applicable to multi-channel effects.
 * @return {Float} The current output of the effect.
*/
	getMix: function () {},
/**
 * Resets the component to it's initial state, if possible.
 *
 * @method Effect
*/
	reset: function () {}
};

onready(function () {

function getFrequencyResponse (callback, args, length, params) {
	var output, input, fft, fx, k;

	if (!args) {
		args = [];
	} else if (!params && !(args instanceof Array) && typeof args === 'object') {
		params = args;
		args = [];
	}

	params = params || {};

	length = length || 4096;

	if (typeof length === 'number') {
		output = new Float64Array(length);
	} else {
		output = length;
		length = output.length;
	}

	fx = this.apply(audioLib, args);

	for (k in params) {
		if (params.hasOwnProperty(k)) {
			fx.setParam(k, params[k]);
		}
	}

	fft = audioLib.FFT(fx.sampleRate || 44100, length / 2, false);

	input = new Float64Array(length / 2);

	if (callback) callback(input);

	fx.append(input, 1);

	fft._process(output, input, 'real');

	return output;
}

/**
 * Gets the frequency response of the effect.
 *
 * @name getFrequencyResponse
 * @static Effect
 *
 * @arg {Array} !args The arguments to pass to the effect.
 * @arg {Number} default:4096 !outputLength The length of the output or the output buffer.
 * @arg {Object} !params The parameters to apply to the effect.
 *
 * @return {Float64Array} The frequency response, as an interleaved fourier series.
*/
EffectClass.getFrequencyResponse = function (args, outputLength, params) {
	return getFrequencyResponse.call(this, function (buffer) {
		buffer[0] = buffer.length / 2;
	}, args, outputLength, params);
};

/**
 * Gets the frequency response of the generator.
 *
 * @name getFrequencyResponse
 * @static Generator
 *
 * @arg {Array} !args The arguments to pass to the effect.
 * @arg {Number} default:4096 !outputLength The length of the output or the output buffer.
 * @arg {Object} !params The parameters to apply to the effect.
 *
 * @return {Float64Array} The frequency response, as an interleaved fourier series.
*/
GeneratorClass.getFrequencyResponse = function (args, outputLength, params) {
	return getFrequencyResponse.call(this, null, args, outputLength, params);
};

});

/**
 * The parent class of all generators.
 *
 * @name Generator
 * @class
 *
 * @param type:Float mix The mix amount for the generator output.
 * @param type:UInt min:1 units:channels The channel count of the generator.
*/
function GeneratorClass () {}

GeneratorClass.prototype = {
	type:			'generator',
	source:			true,
	mix:			1,
	generatedBuffer:	null,
	channelCount:		1,
/**
 * Generates the buffer full of audio data and optionally puts the result on a separate output channel.
 *
 * @method Generator
 *
 * @arg {Array<Float>} buffer The buffer to apply the effect to.
 * @arg {UInt} min:1 !channelCount The amount of channels the buffer has.
 * @arg {Array<Float>} default:buffer !out The optional output buffer.
 * @return {Array<Float>} The output buffer.
*/
	append: function (buffer, channelCount, out) {
		var	l	= buffer.length,
			i, n;
		out		= out || buffer;
		channelCount	= channelCount || this.channelCount;
		for (i=0; i<l; i+=channelCount) {
			this.generate();
			for (n=0; n<channelCount; n++) {
				out[i + n] = this.getMix(n) * this.mix + buffer[i + n];
			}
		}
		return out;
	},
/**
 * Adds a callback that is applied before pushSample() to the effect.
 *
 * @method Generator
 *
 * @arg {Function} callback The callback to add.
*/
	addPreProcessing: function (callback) {
		callback.generate = this.generate;
		this.generate = function () {
			callback.apply(this, arguments);
			return callback.generate.apply(this, arguments);
		};
	},
/**
 * Removes a callback from the pre-processing queue.
 *
 * @method Generator
 *
 * @arg {Function} callback The callback to remove.
*/
	removePreProcessing: function (callback) {
		var f;
		while (f = this.generate.generate) {
			if (f === callback || !callback) {
				this.generate		= f;
				callback.generate	= null;
			}
		}
	},
/**
 * Generates a buffer of the specified length and channel count and assigns it to ``this.generatedBuffer``.
 *
 * Generally used when the generator is used as an automation modifier.
 *
 * @method Generator
 *
 * @arg {UInt} min:1 length The length of the buffer to generate.
 * @arg {UInt} min:1 default:1 !chCount The amount of channels the buffer should have.
*/
	generateBuffer: function (length, chCount) {
		this.generatedBuffer = new Float32Array(length);
		this.append(this.generatedBuffer, chCount || 1);
	},
/**
 * Sets a parameter of the effect to a certain value, taking into account all the other changes necessary to keep the effect sane.
 *
 * @method Generator
 *
 * @arg {String} param The parameter to change.
 * @arg value The value to set the parameter to.
*/
	setParam: function (param, value) {
		this[param] = value;
	},
/**
 * Generates one sample to all available channels, moving the generator one sample forward in the sample time.
 *
 * @method Generator
*/
	generate: function () {},
/**
 * Retrieves the current output of the generator.
 *
 * @method Generator
 *
 * @arg {UInt} default:0 !channel The channel to retrieve the output of. This is only applicable to multi-channel generators.
 * @return {Float} The current output of the generator.
*/
	getMix: function () {},
/**
 * Resets the component to it's initial state, if possible.
 *
 * @method Generator
*/
	reset: function () {}
};

function Plugin (name, plugin) {
	Plugin[name] = plugin;
	Plugin._pluginList.push({
		plugin: plugin,
		name:	name
	});
}

__defineConst(Plugin, '_pluginList', [], false);

/**
 * Creates an ADSR envelope.
 *
 * @control
 *
 * @arg =!sampleRate
 * @arg =!attack
 * @arg =!decay
 * @arg =!sustain
 * @arg =!release
 * @arg =!sustainTime
 * @arg =!releaseTime
 *
 * @param type:UInt units:Hz default:44100 sampleRate Sample Rate the apparatus operates on.
 * @param type:Float min:0 default:50 attack The attack time of the envelope.
 * @param type:Float min:0 default:50 decay The decay time of the envelope.
 * @param type:Float min:0.0 max:1.0 sustain The sustain state of the envelope.
 * @param type:Float min:0 default:50 release The release time of the envelope.
 * @param type:Float min:0 units:ms default:null sustainTime The time the sustain mode should be sustained before launching release. If null, will wait for triggerGate event.
 * @param type:Float min:0 units:ms default:null releaseTime The time the release mode should be sustained before relaunching attack. If null, will wait for triggerGate event.
 * @param type:Bool default:false gate The state of the gate envelope, open being true.
 * @param type:UInt max:5 default:3 state The current state of the value, determining what the gate will do.
*/
function ADSREnvelope (sampleRate, attack, decay, sustain, release, sustainTime, releaseTime) {
	this.sampleRate		= isNaN(sampleRate) ? this.sampleRate : sampleRate;
	this.attack		= isNaN(attack) ? this.attack : attack;
	this.decay		= isNaN(decay) ? this.decay : decay;
	this.sustain		= isNaN(sustain) ? this.sustain : sustain;
	this.release		= isNaN(release) ? this.release : release;
	this.sustainTime	= isNaN(sustainTime) ? null : sustainTime;
	this.releaseTime	= isNaN(releaseTime) ? null : releaseTime;
}

ADSREnvelope.prototype = {
	sampleRate:	44100,
	attack:		50,
	decay:		50,
	sustain:	1,
	release:	50,
	sustainTime:	null,
	releaseTime:	null,
	gate:		false,
	state:		3,
	/* The current value of the envelope */
	value:		0,
/* Private variable for timing the timed sustain and release. */
	_st: 0,
/**
 * Moves the envelope status one sample further in sample-time.
 *
 * @return {Number} The current value of the envelope.
*/
	generate: function () {
		this.states[this.state].call(this);
		return this.value;
	},
/**
 * Returns the current value of the envelope.
 *
 * @return {Number} The current value of the envelope.
*/
	getMix: function () {
		return this.value;
	},
/**
 * Sets the state of the envelope's gate.
 *
 * @method ADSREnvelope
 * 
 * @arg {Boolean} isOpen The new state of the gate.
*/
	triggerGate: function (isOpen) {
		isOpen		= typeof isOpen === 'undefined' ? !this.gate : isOpen;
		this.gate	= isOpen;
		this.state	= isOpen ? 0 : this.releaseTime === null ? 3 : 5;
		this._st	= 0;
	},
/**
 * Array of functions for handling the different states of the envelope.
*/
	states: [
		function () { // Attack
			this.value += 1000 / this.sampleRate / this.attack;
			if (this.value >= 1) {
				this.state = 1;
			}
		},
		function () { // Decay
			this.value -= 1000 / this.sampleRate / this.decay * this.sustain;
			if (this.value <= this.sustain) {
				if (this.sustainTime === null) {
					this.state	= 2;
				} else {
					this._st	= 0;
					this.state	= 4;
				}
			}
		},
		function () { // Sustain
			this.value = this.sustain;
		},
		function () { // Release
			this.value = Math.max(0, this.value - 1000 / this.sampleRate / this.release);
		},
		function () { // Timed sustain
			this.value = this.sustain;
			if (this._st++ >= this.sampleRate * 0.001 * this.sustainTime) {
				this._st	= 0;
				this.state	= this.releaseTime === null ? 3 : 5;
			}
		},
		function () { // Timed release
			this.value = Math.max(0, this.value - 1000 / this.sampleRate / this.release);
			if (this._st++ >= this.sampleRate * 0.001 * this.releaseTime) {
				this._st	= 0;
				this.state	= 0;
			}
		}
	]
};

/**
 * Creates a StepSequencer.
 *
 * @control
 *
 * @arg =!sampleRate
 * @arg =!stepLength
 * @arg =!steps
 * @arg =!attack
 *
 * @param type:UInt units:Hz default:44100 sampleRate Sample Rate the apparatus operates on.
 * @param type:Float min:0 units:ms default:200 stepLength The time a single step of the sequencer lasts.
 * @param type:Array<Float> default:0 steps Array of steps (positive float) for the sequencer to iterate.
 * @param type:Float min:0.0 max:1.0 default:0.0 attack The time the linear transition between the steps. Measured in steps.
 * @param type:Float default:0.0 phase The current phase of the sequencer.
*/
function StepSequencer (sampleRate, stepLength, steps, attack) {
	var	self	= this,
		phase	= 0;

	this.sampleRate		= isNaN(sampleRate) ? this.sampleRate : sampleRate;
	this.stepLength		= isNaN(stepLength) ? this.stepLength : stepLength;
	this.steps		= steps || [1, 0];
	this.attack		= isNaN(attack) ? this.attack : attack;
}

StepSequencer.prototype = {
	sampleRate:	44100,
	stepLength:	200,
	steps:		null,
	attack:		0,
	phase:		0,
	/* The current value of the step sequencer */
	value:		0,

/**
 * Moves the step sequencer one sample further in sample time.
 *
 * @return {Number} The current value of the step sequencer.
*/
	generate: function () {
		var	self		= this,
			stepLength	= self.sampleRate / 1000 * self.stepLength,
			steps		= self.steps,
			sequenceLength	= stepLength * steps.length,
			step, overStep, prevStep, stepDiff,
			val;
		self.phase	= (self.phase + 1) % sequenceLength;
		step		= self.phase / sequenceLength * steps.length;
		overStep	= step % 1;
		step		= ~~(step);
		prevStep	= (step || steps.length) - 1;
		stepDiff	= steps[step] - steps[prevStep];
		val		= steps[step];
		if (overStep < self.attack)  {
			val -= stepDiff - stepDiff / self.attack * overStep;
		}
		self.value = val;
		return val;
	},
/**
 * Returns the current value of the step sequencer.
 *
 * @return {Number} The current value of the step sequencer.
*/
	getMix: function () {
		return this.value;
	},
/**
 * Triggers the gate for the step sequencer, resetting its phase to zero.
 *
 * @method StepSequencer
*/
	triggerGate: function () {
		this.phase = 0;
	}
};

/**
 * UIControl is a tool for creating smooth, latency-balanced UI controls to interact with audio.
 *
 * @control
 *
 * @arg =!sampleRate
 * @arg =!value
 *
 * @param type:UInt units:Hz default:44100 sampleRate Sample Rate the apparatus operates on.
 * @param type:Number default:1 value The value of the UI control.
*/
function UIControl (sampleRate, value) {
	this.sampleRate	= isNaN(sampleRate) ? this.sampleRate : sampleRate;
	this.schedule	= [];
	this.reset(value);
}

UIControl.prototype = {
	sampleRate:	44100,
	value:		1,
	/* The internal schedule array of the UI control */
	schedule:	null,
	/* The internal clock of the UI control, indicating the previous time of a buffer callback */
	clock:		0,
/**
 * Returns the current value of the UI control
 *
 * @return {Number} The current value of the UI control
*/
	getMix: function () {
		return this.value;
	},
	/** Moves the UI control one sample forward in the sample time */
	generate: function () {
		var i;
		for (i=0; i<this.schedule.length; i++) {
			if (this.schedule[i].t--) {
				this.value = this.schedule[i].v;
				this.schedule.splice(i--, 1);
			}
		}
	},
/**
 * Sets the value of the UI control, latency balanced
 *
 * @method UIControl
 *
 * @param {Number} value The new value.
*/
	setValue: function (value) {
		this.schedule.push({
			v:	value,
			t:	~~((+new Date() - this.clock) / 1000 * this.sampleRate)
		});
	},

	reset: function (value) {
		this.value	= isNaN(value) ? this.value : value;
		this.clock	= +new Date();
	}
};

/**
 * A Custom Biquad Filter Effect
 * http://en.wikipedia.org/wiki/Digital_biquad_filter
 * Adapted from http://www.musicdsp.org/files/Audio-EQ-Cookbook.txt
 * 
 * @effect
 *
 * @arg =sampleRate
 * @arg =b0
 * @arg =b1
 * @arg =b2
 * @arg =a1
 * @arg =a2
 *
 * @param type:UInt units:Hz default:44100 sampleRate Sample Rate the apparatus operates on.
 * @param {number} b0 Biquadratic difference equation parameter
 * @param {number} b1 Biquadratic difference equation parameter
 * @param {number} b2 Biquadratic difference equation parameter
 * @param {number} a1 Biquadratic difference equation parameter
 * @param {number} a2 Biquadratic difference equation parameter
*/
function BiquadFilter (sampleRate, b0, b1, b2, a1, a2) {
	this.reset.apply(this, arguments);
}

/**
 * A generic Biquad Filter class, used internally to create BiquadFilter classes.
 * @constructor
 * @this BiquadFilterClass
*/
BiquadFilter.BiquadFilterClass = function BiquadFilterClass () {
	var k;
	for (k in BiquadFilterClass.prototype) {
		if (BiquadFilterClass.prototype.hasOwnProperty) {
			this[k] = this[k];
		}
	}
};

BiquadFilter.BiquadFilterClass.prototype = {
	sampleRate:	44100,
	sample:		0,
	inputs:		null,
	outputs:	null,
	coefs:		null,

	pushSample: function (s) {
		var	c	= this.coefs,
			i	= this.inputs,
			o	= this.outputs;
		this.sample = c.b0 * s + c.b1 * i[0] + c.b2 * i[1] - c.a1 * o[0] - c.a2 * o[1];
		i.pop();
		i.unshift(s);
		o.pop();
		o.unshift(this.sample);
		return this.sample;
	},
	getMix: function () {
		return this.sample;
	},
	reset: function (sampleRate, b0, b1, b2, a1, a2) {
		this.inputs = [0,0];
		this.outputs = [0,0];
		this.sampleRate = isNaN(sampleRate) ? this.sampleRate : sampleRate;
		if (arguments.length > 1){
			this.coefs	= { b0:b0, b1:b1, b2:b2, a1:a1, a2:a2 };
		}
	}
};

/**
 * Creates a Biquad Low-Pass Filter Effect
 * 
 * @name LowPass
 * @subeffect BiquadFilter BiquadLowPassFilter
 *
 * @arg =sampleRate
 * @arg =cutoff
 * @arg =Q
 *
 * @param type:UInt units:Hz sampleRate Sample Rate the apparatus operates on.
 * @param type:Float units:Hz cutoff Low-pass cutoff frequency.
 * @param type:Float min:0.0 max:1.0 Q Filter Q-factor (Q<0.5 filter underdamped, Q>0.5 filter overdamped)
*/
BiquadFilter.LowPass = function (sampleRate, cutoff, Q) {
	var	w0	= 2* Math.PI*cutoff/sampleRate,
		cosw0	= Math.cos(w0),
		sinw0   = Math.sin(w0),
		alpha   = sinw0/(2*Q),
		b0	=  (1 - cosw0)/2,
		b1	=   1 - cosw0,
		b2	=   b0,
		a0	=   1 + alpha,
		a1	=  -2*cosw0,
		a2	=   1 - alpha;
	this.reset(sampleRate, b0/a0, b1/a0, b2/a0, a1/a0, a2/a0);
};

/**
 * Creates a Biquad High-Pass Filter Effect
 * 
 * @name HighPass
 * @subeffect BiquadFilter BiquadHighPassFilter
 *
 * @arg =sampleRate
 * @arg =cutoff
 * @arg =Q
 *
 * @param type:UInt units:Hz sampleRate Sample Rate the apparatus operates on.
 * @param type:Float units:Hz cutoff High-pass cutoff frequency.
 * @param type:Float min:0.0 max:1.0 Q Filter Q-factor (Q<0.5 filter underdamped, Q>0.5 filter overdamped)
*/
BiquadFilter.HighPass = function (sampleRate, cutoff, Q) {
	var	w0	= 2* Math.PI*cutoff/sampleRate,
		cosw0   = Math.cos(w0),
		sinw0   = Math.sin(w0),
		alpha   = sinw0/(2*Q),
		b0	=  (1 + cosw0)/2,
		b1	= -(1 + cosw0),
		b2	=   b0,
		a0	=   1 + alpha,
		a1	=  -2*cosw0,
		a2	=   1 - alpha;
	this.reset(sampleRate, b0/a0, b1/a0, b2/a0, a1/a0, a2/a0);
};

/**
 * Creates a Biquad All-Pass Filter Effect
 * 
 * @name AllPass
 * @subeffect BiquadFilter BiquadAllPassFilter
 *
 * @arg =sampleRate
 * @arg =f0
 * @arg =Q
 *
 * @param type:UInt units:Hz sampleRate Sample Rate the apparatus operates on.
 * @param type:Float units:Hz min:0.0 f0 Significant frequency: filter will cause a phase shift of 180deg at f0.
 * @param type:Float min:0.0 max:1.0 Q Filter Q-factor (Q<0.5 filter underdamped, Q>0.5 filter overdamped)
*/
BiquadFilter.AllPass = function (sampleRate, f0, Q) {
	var	w0	= 2* Math.PI*f0/sampleRate,
		cosw0   = Math.cos(w0),
		sinw0   = Math.sin(w0),
		alpha   = sinw0/(2*Q),
		b0	=  1 - alpha,
		b1	= -2*cosw0,
		b2	=  1 + alpha,
		a0	=  b2,
		a1	=  b1,
		a2	=  b0;
	this.reset(sampleRate, b0/a0, b1/a0, b2/a0, a1/a0, a2/a0);
};

/**
 * Creates a Biquad Band-Pass Filter Effect
 * 
 * @name BandPass
 * @subeffect BiquadFilter BiquadBandPassFilter
 *
 * @arg =sampleRate
 * @arg =centerFreq
 * @arg =bandwidthInOctaves
 *
 * @param type:UInt units:Hz sampleRate Sample Rate the apparatus operates on.
 * @param type:Float units:Hz min:0.0 centerFreq Center frequency of filter: 0dB gain at center peak
 * @param type:Float units:octaves min:0 bandwidthInOctaves Bandwidth of the filter (between -3dB points).
*/
BiquadFilter.BandPass = function (sampleRate, centerFreq, bandwidthInOctaves) {
	var	w0	= 2* Math.PI*centerFreq/sampleRate,
		cosw0	= Math.cos(w0),
		sinw0	= Math.sin(w0),
		toSinh	= Math.log(2)/2 * bandwidthInOctaves * w0/sinw0,
		alpha	= sinw0*(Math.exp(toSinh) - Math.exp(-toSinh))/2,
		b0	= alpha,
		b1	= 0,
		b2	= -alpha,
		a0	= 1 + alpha,
		a1	= -2 * cosw0,
		a2	= 1 - alpha;
	this.reset(sampleRate, b0/a0, b1/a0, b2/a0, a1/a0, a2/a0);
};

(function (classes, i) {

for (i=0; i<classes.length; i++) {
	classes[i].prototype = new BiquadFilter.BiquadFilterClass();
}

}([BiquadFilter, BiquadFilter.LowPass, BiquadFilter.HighPass, BiquadFilter.AllPass, BiquadFilter.BandPass]));

/**
 * Creates a Bit Crusher Effect.
 * Adapted from http://www.musicdsp.org/archive.php?classid=4#139
 * 
 * @effect
 *
 * @arg =!sampleRate
 * @arg =!bits
 *
 * @param type:UInt units:Hz default:44100 sampleRate Sample Rate the apparatus operates on.
 * @param type:UInt units:bits default:8 bits Bit resolution of output signal.
*/
function BitCrusher (sampleRate, bits) {
	var	self	= this,
		sample  = 0.0;

	self.sampleRate	= sampleRate;
	self.resolution	= bits ? Math.pow(2, bits-1) : Math.pow(2, 8-1); // Divided by 2 for signed samples (8bit range = 7bit signed)

	self.pushSample	= function (s) {
		sample	= Math.floor(s * self.resolution + 0.5) / self.resolution;
		return sample;
	};

	self.getMix = function () {
		return sample;
	};
}

/**
 * Creates a Chorus effect.
 * Depends on [[Oscillator]]
 *
 * @effect
 *
 * @arg =!sampleRate
 * @arg =!delayTime
 * @arg =!depth
 * @arg =!freq
 *
 * @param type:UInt units:Hz default:44100 sampleRate Sample Rate the apparatus operates on.
 * @param type:Float units:ms min:0.0 delayTime Delay time of the chorus.
 * @param type:UInt depth Depth of the Chorus.
 * @param type:Float units:Hz min:0.0 freq The frequency of the LFO running the Chorus.
*/
function Chorus (sampleRate, delayTime, depth, freq) {
	var	self		= this,
		buffer, bufferPos, sample;

	self.delayTime	= delayTime || 30;
	self.depth	= depth	|| 3;
	self.freq	= freq || 0.1;

	function calcCoeff () {
		buffer = new Float32Array(self.sampleRate * 0.1);
		bufferPos = 0;
		var i, l = buffer.length;
		for (i=0; i<l; i++){
			buffer[i] = 0.0;
		}
	}

	self.sampleRate = sampleRate;
	self.osc = new Oscillator(sampleRate, freq);
	self.calcCoeff = calcCoeff;
	self.pushSample = function (s) {
		if (++bufferPos >= buffer.length){
			bufferPos = 0;
		}
		buffer[bufferPos] = s;
		self.osc.generate();

		var delay = self.delayTime + self.osc.getMix() * self.depth;
		delay *= self.sampleRate / 1000;
		delay = bufferPos - Math.floor(delay);
		while(delay < 0){
			delay += buffer.length;
		}

		sample = buffer[delay];
		return sample;
	};
	self.getMix = function () {
		return sample;
	};

	calcCoeff();
}

/**
 * Creates a Comb Filter effect.
 * Defaults to Freeverb defaults.
 *
 * @effect
 *
 * @arg =!sampleRate
 * @arg =!delaySize
 * @arg =!feedback
 * @arg =!damping
 *
 * @param type:UInt units:Hz default:44100 sampleRate Sample Rate the apparatus operates on.
 * @param type:UInt units:samples default:1200 delaySize Size of the delay line buffer.
 * @param type:Float min:0.0 max:0.0 default:0.84 feedback Amount of feedback for the CombFilter.
 * @param type:Float min:0.0 max:0.0 default:0.2 damping Amount of damping for the CombFilter.
*/
function CombFilter (sampleRate, delaySize, feedback, damping) {
	var	self	= this;
	self.sampleRate	= sampleRate;
	self.buffer	= new Float32Array(isNaN(delaySize) ? 1200 : delaySize);
	self.bufferSize	= self.buffer.length;
	self.feedback	= isNaN(feedback) ? self.feedback : feedback;
	self.damping	= isNaN(damping) ? self.damping : damping;
	self.invDamping	= 1 - self.damping;
}

CombFilter.prototype = {
	sample:		0.0,
	index:		0,
	store:		0,

	feedback:	0.84,
	damping:	0.2,

	pushSample: function (s) {
		var	self	= this;
		self.sample	= self.buffer[self.index];
		self.store	= self.sample * self.invDamping + self.store * self.damping;
		self.buffer[self.index++] = s + self.store * self.feedback;
		if (self.index >= self.bufferSize) {
			self.index = 0;
		}
		return self.sample;
	},
	getMix: function () {
		return this.sample;
	},
	reset: function () {
		this.index	= this.store = 0;
		this.samples	= 0.0;
		this.buffer	= new Float32Array(this.bufferSize);
	},
	setParam: function (param, value) {
		switch (param) {
		case 'damping':
			this.damping	= value;
			this.invDamping	= 1 - value;
			break;
		default:
			this[param] = value;
			break;
		}
	}
};

/**
 * Creates a Compressor Effect
 * 
 * @effect
 *
 * @arg =!sampleRate
 * @arg =!scaleBy
 * @arg =!gain
 * 
 * @param type:UInt units:Hz default:44100 sampleRate Sample Rate the apparatus operates on.
 * @param type:UInt min:1 scaleBy Signal scaling factor. If mixing n unscaled waveforms, use scaleBy=n.
 * @param type:Float min:0.0 max:2.0 default:0.5 gain Gain factor.
*/
function Compressor (sampleRate, scaleBy, gain) {
	var	self	= this,
		sample  = 0.0;
	self.sampleRate	= sampleRate;
	self.scale	= scaleBy || 1;
	self.gain	= isNaN(gain) ? 0.5 : gain;
	self.pushSample = function (s) {
		s	/= self.scale;
		sample	= (1 + self.gain) * s - self.gain * s * s * s;
		return sample;
	};
	self.getMix = function () {
		return sample;
	};
}

/**
 * Creates a Convolution effect.
 *
 * @effect
 *
 * @arg =!sampleRate
 * @arg =!kernels
 *
 * @param type:UInt units:Hz default:44100 sampleRate Sample Rate the apparatus operates on.
 * @param type:AudioBuffer default:[0] kernels The kernels for the convolution effect.
*/
function Convolution (sampleRate, kernels) {
	this.sampleRate	= isNaN(sampleRate) ? this.sampleRate : sampleRate;
	this.setParam('kernels', kernels || new Float32Array(1));
}

Convolution.prototype = {
	sampleRate: 44100,
	sample: 0,
	pos: 0,

	kernels: null,
	buffer: null,

/*
This is a very suboptimal implementation...
*/

	pushSample: function (s) {
		var p, i, l;

		this.sample = 0;

		this.buffer[this.pos] = s;

		for (i=0, l=this.buffer.length, p=this.pos+l; i<l; i++) {
			this.sample += this.kernels[i] * this.buffer[(p - i) % l];
		}

		this.pos = (this.pos + 1) % this.buffer.length;
	},

	getMix: function () {
		return this.sample;
	},

	setParam: function (param, value) {
		switch (param) {
		case 'kernels':
			this.buffer = new Float32Array(value.length);
			this.pos = 0;
			break;
		}

		this[param] = value;
	}
};

/**
 * Creates a Delay effect.
 * 
 * @effect
 *
 * @arg =!sampleRate
 * @arg =!time
 * @arg =!feedback
 *
 * @param type:UInt units:Hz default:44100 sampleRate Sample Rate the apparatus operates on.
 * @param type:Float units:ms min:0.0 default:1000 time The delay time between the individual delays.
 * @param type:Float min:0.0 max:0.0 default:0.0 feedback The amount of feedback in the delay line.
*/
function Delay (sampleRate, time, feedback) {
	var	self	= this;
	self.time	= isNaN(time) ? self.time : time;
	self.feedback	= isNaN(feedback) ? self.feedback : feedback;
	self.reset(sampleRate);
}

Delay.prototype = {
	sampleRate:	1,
	time:		1000,
	feedback:	0,
	/* Buffer position of the Delay. */
	bufferPos:	0,
	/* AudioBuffer in which the delay line is stored. */
	buffer:		null,
	/* Current output of the Delay */
	sample:		0,

/* Reverse sample time factor */
	_rstf:		1,
/**
 * Adds a new sample to the delay line, moving the effect one sample forward in sample time.
 *
 * @arg {Float32} sample The sample to be added to the delay line.
 * @return {Float32} Current output of the Delay.
*/
	pushSample: function (s) {
		var	self	= this,
			buffer	= self.buffer;
		buffer[self.bufferPos++] += s;
		if (self.bufferPos > self.time * self._rstf){
			self.bufferPos = 0;
		}
		self.sample = buffer[self.bufferPos];
		buffer[self.bufferPos] *= self.feedback;
		return self.sample;
	},
/**
 * Returns the current output of the Delay.
 *
 * @return {Float32} Current output of the Delay.
*/
	getMix: function () {
		return this.sample;
	},
/**
 * Changes the time value of the Delay and resamples the delay line accordingly.
 *
 * Requires sink.js
 *
 * @method Delay
 *
 * @arg {Uint} time The new time value for the Delay.
 * @return {AudioBuffer} The new delay line audio buffer.
*/
	resample: function (time) {
		var	self	= this,
			ratio	= self.time / time;
		self.buffer	= audioLib.Sink.resample(self.buffer, time);
		self.time	= time;
		self.bufferPos	= Math.round(ratio * self.bufferPos);
		return self.buffer;
	},
/**
 * Resets the delay line, to recover from sample rate changes or such.
 *
 * @arg {Number} sampleRate The new sample rate. (Optional)
 * @arg {Boolean} resample Determines whether to resample and apply the old buffer. (Requires Sink)
 * @return {AudioBuffer} The new delay line audio buffer.
*/
	reset: function (sampleRate, resample) {
		var	self	= this,
			buf	= self.buffer,
			i, ratio;
		sampleRate	= isNaN(sampleRate) ? self.sampleRate : sampleRate;
		ratio		= self.sampleRate / sampleRate;
		self.buffer	= new Float32Array(sampleRate * Delay.MAX_DELAY);
		self.bufferPos	= Math.round(ratio * self.bufferPos);
		self._rstf	= 1 / 1000 * sampleRate;
		if (resample) {
			buf = audioLib.Sink.resample(buf, ratio);
			for (i=0; i<buf.length && i<self.buffer.length; i++) {
				self.buffer[i] = buf[i];
			}
		}
		return self.buffer;
	}
};

/** The size that will be allocated for delay line buffers on initialization, in seconds */
Delay.MAX_DELAY = 2;

/**
 * Creates a Distortion effect.
 * Based on the famous TubeScreamer.
 * Requires [[IIRFilter]]
 * 
 * @effect
 *
 * @arg =!sampleRate
 *
 * @param type:UInt units:Hz default:44100 sampleRate Sample Rate the apparatus operates on.
 * @param type:Float default:4 gain The gain value of the Distortion.
 * @param type:Float default:1 master The master volume value of the distortion.
*/
function Distortion (sampleRate) {
	var	hpf1	= new IIRFilter(sampleRate, 720.484),
		lpf1	= new IIRFilter(sampleRate, 723.431),
		hpf2	= new IIRFilter(sampleRate, 1.0),
		smpl	= 0.0;
	this.gain = 4;
	this.master = 1;
	this.sampleRate = sampleRate;
	this.filters = [hpf1, lpf1, hpf2];
	this.pushSample = function (s) {
		hpf1.pushSample(s);
		smpl = hpf1.getMix(1) * this.gain;
		smpl = Math.atan(smpl) + smpl;
		if (smpl > 0.4) {
			smpl = 0.4;
		} else if (smpl < -0.4) {
			smpl = -0.4;
		}
		lpf1.pushSample(smpl);
		hpf2.pushSample(lpf1.getMix(0));
		smpl = hpf2.getMix(1) * this.master;
		return smpl;
	};
	this.getMix = function () {
		return smpl;
	};
}

/**
 * Creates a Reverb Effect, based on the Freeverb algorithm
 * 
 * @effect Reverb
 *
 * @arg =!sampleRate
 * @arg =!channelCount
 * @arg =!wet
 * @arg =!dry
 * @arg =!roomSize
 * @arg =!damping
 * @arg {Object} !tuningOverride Freeverb tuning overwrite object.
 *
 * @param type:UInt units:Hz default:44100 sampleRate Sample Rate the apparatus operates on.
 * @param type:UInt min:1 default:2 channelCount The channel count of the Reverb.
 * @param type:Float default:0.5 wet The gain of the reverb signal output.
 * @param type:Float default:0.55 dry The gain of the original signal output.
 * @param type:Float min:0.0 max:1.0 default:0.5 roomSize The size of the simulated reverb area.
 * @param type:Float min:0.0 max:1.0 default:0.2223 damping Reverberation damping parameter.
*/
function Freeverb (sampleRate, channelCount, wet, dry, roomSize, damping, tuningOverride) {
	var	self		= this;
	self.sampleRate		= sampleRate;
	self.channelCount	= isNaN(channelCount) ? self.channelCount : channelCount;
	self.wet		= isNaN(wet) ? self.wet: wet;
	self.dry		= isNaN(dry) ? self.dry: dry;
	self.roomSize		= isNaN(roomSize) ? self.roomSize: roomSize;
	self.damping		= isNaN(damping) ? self.damping: damping;
	self.tuning		= new Freeverb.Tuning(tuningOverride || self.tuning);
	
	self.sample	= (function () {
		var	sample	= [],
			c;
		for (c=0; c<self.channelCount; c++) {
			sample[c] = 0.0;
		}
		return sample;
	}());

	self.CFs	= (function () {
		var	combs	= [],
			channel	= [],
			num	= self.tuning.combCount,
			damp	= self.damping * self.tuning.scaleDamping,
			feed	= self.roomSize * self.tuning.scaleRoom + self.tuning.offsetRoom,
			sizes	= self.tuning.combTuning,
			i, c;

		for (c=0; c<self.channelCount; c++) {
			for(i=0; i<num; i++) {
				channel.push(new audioLib.CombFilter(self.sampleRate, sizes[i] + c * self.tuning.stereoSpread, feed, damp));
			}

			combs.push(channel);
			channel = [];
		}

		return combs;
	}());

	self.numCFs	= self.CFs[0].length;
	
	self.APFs	= (function () {
		var	apfs	= [],
			channel	= [],
			num	= self.tuning.allPassCount,
			feed	= self.tuning.allPassFeedback,
			sizes	= self.tuning.allPassTuning,
			i, c;

		for (c=0; c<self.channelCount; c++) {
			for (i=0; i<num; i++) {
				channel.push(new Freeverb.AllPassFilter(self.sampleRate, sizes[i] + c * self.tuning.stereoSpread, feed));
			}

			apfs.push(channel);
			channel = [];
		}

		return apfs;
	}());

	self.numAPFs	= self.APFs[0].length;
}

Freeverb.prototype = {
	channelCount:	2,
	sample:		[0.0, 0.0],

	wet:		0.5,
	dry:		0.55,
	damping:	0.2223,
	roomSize:	0.5,

	tuning: {
	},

	pushSample: function (s, channel) {
		var	input	= s * this.tuning.fixedGain,
			output	= 0,
			i;
		for (i=0; i < this.numCFs; i++) {
			output += this.CFs[channel][i].pushSample(input);
		}
		for (i=0; i < this.numAPFs; i++) {
			output = this.APFs[channel][i].pushSample(output);
		}
		this.sample[channel] = output * this.wet + s * this.dry;
	},

	getMix: function (channel) {
		return this.sample[channel];
	},

	reset: function () {
		var	i,
			c;
		for (c=0; c < this.channelCount; c++) {
			for (i=0; i < this.numCFs; i++) {
				this.CFs[c][i].reset();
			}
			for (i=0; i < this.numAPFs; i++) {
				this.APFs[c][i].reset();
			}
			this.sample[c] = 0.0;
		}		
	},

	setParam: function (param, value) {
		var	combFeed,
			combDamp,
			i,
			c;
		switch (param) {
		case 'roomSize':
			this.roomSize	= value;
			combFeed	= this.roomSize * this.tuning.scaleRoom + this.tuning.offsetRoom;
			for (c=0; c < this.channelCount; c++) {
				for (i=0; i < this.numCFs; i++) {
					this.CFs[c][i].setParam('feedback', combFeed);
				}
			}
			break;
		case 'damping':
			this.damping	= value;
			combDamp	= this.damping * this.tuning.scaleDamping;
			for (c=0; c < this.channelCount; c++) {
				for (i=0; i < this.numCFs; i++) {
					this.CFs[c][i].setParam('damping', combDamp);
				}
			}
			break;
		default:
			this[param] = value;
		}
	}

	
};

/**
 * Creates a Freeverb tuning configurement object.
 *
 * @constructor
 * @this {Freeverb.Tuning}
 * @arg {Object} overrides The object containing the values to be overwritten.
*/

Freeverb.Tuning = function FreeverbTuning (overrides) {
	var k;
	if (overrides) {
		for (k in overrides) {
			if (overrides.hasOwnProperty(k)) {
				this[k] = overrides[k];
			}
		}
	}
};

Freeverb.Tuning.prototype = {
	combCount:		8,
	combTuning:		[1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617],

	allPassCount:		4,
	allPassTuning:		[556, 441, 341, 225],
	allPassFeedback:	0.5,

	fixedGain:		0.015,
	scaleDamping:		0.9,

	scaleRoom:		0.28,
	offsetRoom:		0.7,
	
	stereoSpread:		23
};

/**
 * Creates an All-Pass Filter Effect, based on the Freeverb APF.
 * 
 * @name AllPassFilter
 * @subeffect Freeverb FreeverbAllPassFilter
 *
 * @arg =!sampleRate
 * @arg {number} default:500 !delaySize Size (in samples) of the delay line buffer.
 * @arg =!feedback
 *
 * @param type:UInt units:Hz default:44100 sampleRate Sample Rate the apparatus operates on.
 * @param type:Float min:0.0 max:1.0 default:0.5 feedback Amount of feedback.
*/
Freeverb.AllPassFilter = function AllPassFilter (sampleRate, delaySize, feedback) {
	var	self	= this;
	self.sampleRate	= sampleRate;
	self.buffer	= new Float32Array(isNaN(delaySize) ? 500 : delaySize);
	self.bufferSize	= self.buffer.length;
	self.feedback	= isNaN(feedback) ? self.feedback : feedback;
};

Freeverb.AllPassFilter.prototype = {
	sample:		0.0,
	index:		0,
	feedback:	0.5,

	pushSample: function (s) {
		var	self		= this;
			bufOut		= self.buffer[self.index];
		self.sample		= -s + bufOut;
		self.buffer[self.index++] = s + bufOut * self.feedback;
		if (self.index >= self.bufferSize) {
			self.index = 0;
		}
		return self.sample;
	},
	getMix: function () {
		return this.sample;
	},
	reset: function () {
		this.index	= 0;
		this.sample	= 0.0;
		this.buffer	= new Float32Array(this.bufferSize);
	}
};

/**
 * Creates a Gain Controller effect.
 *
 * @effect
 *
 * @arg =!sampleRate
 * @arg =!gain
 *
 * @param type:UInt units:Hz default:44100 sampleRate Sample Rate the apparatus operates on.
 * @param type:UInt default:1 gain The gain for the gain controller.
*/
function GainController (sampleRate, gain) {
	this.sampleRate	= isNaN(sampleRate) ? this.sampleRate : sampleRate;
	this.gain	= isNaN(gain) ? this.gain : gain;
}

GainController.prototype = {
	sampleRate:	44100,
	gain:		1,
	/* The current output sample of the gain controller */
	sample:		0,
/**
 * Processes provided sample, moves the gain controller one sample forward in the sample time.
 *
 * @arg {Number} s The input sample for the gain controller.
 * @return {Number} The current output sample of the controller.
*/
	pushSample: function (s) {
		this.sample	= s * this.gain;
		return this.sample;
	},
/**
 * Returns the current output sample of the controller.
 *
 * @return {Number} The current output sample of the controller.
*/
	getMix: function () {
		return this.sample;
	}
};

/**
 * Creates a IIRFilter effect.
 * Adapted from Corban Brook's dsp.js
 * 
 * @effect
 *
 * @arg =!sampleRate
 * @arg =!cutoff
 * @arg =!resonance
 * @arg =!type
 *
 * @param type:UInt units:Hz default:44100 sampleRate Sample Rate the apparatus operates on.
 * @param type:Float units:Hz min:40.0 default:20000 cutoff The cutoff frequency of the IIRFilter.
 * @param type:Float min:0.0 max:1.0 default:0.1 resonance The resonance of the IIRFilter.
 * @param type:UInt default:0 type The type of the filter (LowPass, HighPass, BandPass, Notch).
*/
function IIRFilter (sampleRate, cutoff, resonance, type) {
	var	self	= this,
		f	= [0.0, 0.0, 0.0, 0.0],
		freq, damp,
		prevCut, prevReso,

		sin	= Math.sin,
		min	= Math.min,
		pow	= Math.pow;

	self.cutoff = isNaN(cutoff) ? 20000 : cutoff; // > 40
	self.resonance = !resonance ? 0.1 : resonance; // 0.0 - 1.0
	self.samplerate = isNaN(sampleRate) ? 44100 : sampleRate;
	self.type = type || 0;

	function calcCoeff () {
		freq = 2 * sin(Math.PI * min(0.25, self.cutoff / (self.samplerate * 2)));
		damp = min(2 * (1 - pow(self.resonance, 0.25)), min(2, 2 / freq - freq * 0.5));
	}

	self.pushSample = function (sample) {
		if (prevCut !== self.cutoff || prevReso !== self.resonance){
			calcCoeff();
			prevCut = self.cutoff;
			prevReso = self.resonance;
		}

		f[3] = sample - damp * f[2];
		f[0] = f[0] + freq * f[2];
		f[1] = f[3] - f[0];
		f[2] = freq * f[1] + f[2];

		f[3] = sample - damp * f[2];
		f[0] = f[0] + freq * f[2];
		f[1] = f[3] - f[0];
		f[2] = freq * f[1] + f[2];

		return f[self.type];
	};

	self.getMix = function (type) {
		return f[type || self.type];
	};
}

/**
 * Creates a dynamic amplitude limiter.
 *
 * Requires [[Amplitude]].
 * 
 * @effect
 *
 * @arg =!sampleRate
 * @arg =!threshold
 * @arg =!attack
 * @arg =!release
 *
 * @param type:UInt units:Hz default:44100 sampleRate Sample Rate the apparatus operates on.
 * @param type:Float min:0.0 default:0.95 threshold The amplitude threshold after which to start limiting.
 * @param type:Float min:0.0 default:0.01 attack The speed on which the amplitude metering reacts.
 * @param type:Float min:0.0 default:0.01 release The speed on which the amplitude metering cools down.
*/
function Limiter(sampleRate, threshold, attack, release){
	this.sampleRate		= isNaN(sampleRate) ? this.sampleRate : sampleRate;
	this.threshold		= isNaN(threshold) ? this.threshold : threshold;
	this.attack		= isNaN(attack) ? this.attack : attack;
	this.release		= isNaN(release) ? this.release : release;
	this._amplitude		= new audioLib.Amplitude(this.sampleRate, this.attack, this.release);
}

Limiter.prototype = {
	sampleRate:	44100,
	threshold:	0.95,
	attack:		0.01,
	release:	0.01,
	/* The Amplitude meter on which the limiting is based. */
	__amplitude:	null,
	/* The current output of the effect. */
	sample:		0,
/**
 * Processes a sample, moving the effect one sample further in sample-time.
 *
 * @arg {Float32} sample The sample to process.
 * @arg {Uint} channel The channel on which the sample is. (Only if multi-channel)
 * @return {Float32} The current output of the effect. (Only if single-channel)
*/
	pushSample: function(s){
		var	d	= this._amplitude.pushSample(s) - this.threshold;
		this.sample	= d > 0 ? s / (1 + d) : s;
		return this.sample;
	},
/**
 * Returns the current output of the effect.
 *
 * @arg {Uint} channel The channel for which to get the sample.
 * @return {Float32} The current output of the effect.
*/
	getMix: function(){
		return this.sample;
	},
/**
 * Sets a parameter of the effect, making necessary relative calculations.
 *
 * @arg {String} param The parameter name.
 * @arg {Object} value The new value of the parameter.
*/
	setParam: function(param, value){
		switch(param){
		case 'attack':
		case 'release':
			this._amplitude[param] = value;
			this[param] = value;
			break;
		default:
			this[param] = value;
		}
	}
};

/**
 * Creates a LP12Filter effect.
 * Adapted from Corban Brook's dsp.js
 * 
 * @effect
 *
 * @arg =!sampleRate
 * @arg =!cutoff
 * @arg =!resonance
 *
 * @param type:UInt units:Hz default:44100 sampleRate Sample Rate the apparatus operates on.
 * @param type:Float units:Hz min:40 default:20000 cutoff The cutoff frequency of the filter.
 * @param type:Float min:1.0 max:20.0 default:1 resonance The resonance of the filter.
*/
function LP12Filter(samplerate, cutoff, resonance){
	var	self		= this,
		vibraSpeed	= 0,
		vibraPos	= 0,
		pi2		= Math.PI * 2,
		w, q, r, c,
		prevCut, prevReso;

	self.cutoff = !cutoff ? 20000 : cutoff; // > 40
	self.resonance = !resonance ? 1 : resonance; // 1 - 20
	self.samplerate = samplerate;

	function calcCoeff(){
		w = pi2 * self.cutoff / self.samplerate;
		q = 1.0 - w / (2 * (self.resonance + 0.5 / (1.0 + w)) + w - 2);
		r = q * q;
		c = r + 1 - 2 * Math.cos(w) * q;
	}

	self.pushSample = function(sample){
		if (prevCut !== self.cutoff || prevReso !== self.resonance){
			calcCoeff();
			prevCut = self.cutoff;
			prevReso = self.resonance;
		}
		vibraSpeed += (sample - vibraPos) * c;
		vibraPos += vibraSpeed;
		vibraSpeed *= r;
		return vibraPos;
	};

	self.getMix = function(){
		return vibraPos;
	};

	calcCoeff();
}

/**
 * @generator
 *
 * @arg =!sampleRate
 * @arg =!color
 *
 * @param type:UInt units:Hz default:44100 sampleRate Sample Rate the apparatus operates on.
 * @param type:String default:white color The color of the noise.
 * @param type:Float default:0 value The current value of the noise.
*/
function Noise () {
	this.reset.apply(this, arguments);
}

Noise.prototype = {
	/* The sample rate of the Noise. */
	sampleRate:	44100,
	/* The color of the Noise. */
	color:		'white',
	b0:		0,
	b1:		0,
	b2:		0,
	b3:		0,
	b4:		0,
	b5:		0,
	c1:		null,
	c2:		null,
	c3:		null,
	c4:		null,
	q:		15,
	q0:		null,
	q1:		null,
	/* Brown seed. */
	brownQ:		0,
	/* Current value of the Noise. */
	value:		0,

	reset: function (sampleRate, color) {
		this.sampleRate		= isNaN(sampleRate) ? this.sampleRate : sampleRate;
		this.color		= typeof color === 'string' ? color : this.color;
		this.c1			= (1 << this.q) - 1;
		this.c2			= (~~(this.c1 /3)) + 1;
		this.c3			= 1 / this.c1;
		this.c1			= this.c2 * 6;
		this.c4			= 3 * (this.c2 - 1);
		this.q0			= Math.exp(-200 * Math.PI / this.sampleRate);
		this.q1			= 1 - this.q0;
	},

	generate: function () {
		this.value	= this[this.color]();
	},

	getMix: function () {
		return this.value;
	},
/**
 * Returns the white noise output of the noise generator.
 *
 * @method Noise
 *
 * @return {Float} White noise.
*/
	white: function () {
		var r = Math.random();
		return (r * this.c1 - this.c4) * this.c3;
	},
/**
 * Returns the pink noise output of the noise generator.
 *
 * @method Noise
 *
 * @return {Float} Pink noise.
*/
	pink: function () {
		var	w	= this.white();
		this.b0 = 0.997 * this.b0 + 0.029591 * w;
		this.b1 = 0.985 * this.b1 + 0.032534 * w;
		this.b2 = 0.950 * this.b2 + 0.048056 * w;
		this.b3 = 0.850 * this.b3 + 0.090579 * w;
		this.b4 = 0.620 * this.b4 + 0.108990 * w;
		this.b5 = 0.250 * this.b5 + 0.255784 * w;
		return 0.55 * (this.b0 + this.b1 + this.b2 + this.b3 + this.b4 + this.b5);
	},
/**
 * Returns the brown noise output of the noise generator.
 *
 * @method Noise
 *
 * @return {Float} Brown noise.
*/
	brown: function () {
		var	w	= this.white();
		this.brownQ	= (this.q1 * w + this.q0 * this.brownQ);
		return 6.2 * this.brownQ;
	}
};

/**
 * Creates a new Oscillator.
 *
 * @generator
 *
 * @arg =!sampleRate
 * @arg =!frequency
 *
 * @param type:UInt units:Hz default:44100 sampleRate Sample Rate the apparatus operates on.
 * @param type:Float units:Hz min:0 default:440 frequency The frequency of the Oscillator.
 * @param type:Float min:0.0 max:1.0 default:0.0 phaseOffset The phase offset of the Oscillator.
 * @param type:Float min:0.0 max:1.0 default:0.5 pulseWidth The pulse width of the Oscillator.
 * @param type:String|UInt default:sine waveShape The wave shape of the Oscillator.
 * @param type:Float default:0 fm The frequency modulation of the Oscillator.
*/

function Oscillator (sampleRate, freq) {
	var	self	= this;
	self.frequency	= isNaN(freq) ? 440 : freq;
	self.waveTable	= new Float32Array(1);
	self.sampleRate = sampleRate;
	self.waveShapes	= self.waveShapes.slice(0);
}

(function (FullPI, waveshapeNames, proto, i) {

proto = Oscillator.prototype = {
	sampleRate:	44100,
	frequency:	440,
	phaseOffset:	0,
	pulseWidth:	0.5,
	fm:		0,
	waveShape:	'sine',
	/* Phase of the Oscillator */
	phase:		0,
/* The relative of phase of the Oscillator (pulsewidth, phase offset, etc applied). */
	_p:		0,

/**
 * Moves the Oscillator's phase forward by one sample.
*/
	generate: function () {
		var	self	= this,
			f	= +self.frequency,
			pw	= self.pulseWidth,
			p	= self.phase;
		f += f * self.fm;
		self.phase	= (p + f / self.sampleRate / 2) % 1;
		p		= (self.phase + self.phaseOffset) % 1;
		self._p		= p < pw ? p / pw : (p-pw) / (1-pw);
	},
/**
 * Returns the output signal sample of the Oscillator.
 *
 * @return {Float} The output signal sample.
*/
	getMix: function () {
		return this[this.waveShape]();
	},
/**
 * Returns the relative phase of the Oscillator (pulsewidth, phaseoffset, etc applied).
 *
 * @return {Float} The relative phase.
*/
	getPhase: function () {
		return this._p;
	},
/**
 * Resets the Oscillator phase (AND RELATIVE PHASE) to a specified value.
 *
 * @arg {Float} phase The phase to reset the values to. (Optional, defaults to 0).
*/
	reset: function (p) {
		this.phase = this._p = isNaN(p) ? 0 : p;
	},
/**
 * Specifies a wavetable for the Oscillator.
 *
 * @method Oscillator
 *
 * @arg {Array<Float>} wavetable The wavetable to be assigned to the Oscillator.
 * @return {Boolean} Succesfulness of the operation.
*/
	setWavetable: function (wt) {
		this.waveTable = wt;
		return true;
	},
/**
 * Returns sine wave output of the Oscillator.
 *
 * Phase for the zero crossings of the function: 0.0, 0.5
 *
 * @method Oscillator
 *
 * @return {Float} Sample.
*/
	sine: function () {
		return Math.sin(this._p * FullPI);
	},
/**
 * Returns triangle wave output of the Oscillator, phase zero representing the top of the triangle.
 *
 * Phase for the zero crossings of the function: 0.25, 0.75
 *
 * @method Oscillator
 *
 * @return {Float} Sample.
*/
	triangle: function () {
		return this._p < 0.5 ? 4 * this._p - 1 : 3 - 4 * this._p;
	},
/**
 * Returns square wave output of the Oscillator, phase zero being the first position of the positive side.
 *
 * Phase for the zero crossings of the function: 0.0, 0.5
 *
 * @method Oscillator
 *
 * @return {Float} Sample.
*/
	square: function () {
		return this._p < 0.5 ? -1 : 1;
	},
/**
 * Returns sawtooth wave output of the Oscillator, phase zero representing the negative peak.
 *
 * Phase for the zero crossings of the function: 0.5
 *
 * @method Oscillator
 *
 * @return {Float} Sample.
*/
	sawtooth: function () {
		return 1 - this._p * 2;
	},
/**
 * Returns invert sawtooth wave output of the Oscillator, phase zero representing the positive peak.
 *
 * Phase for the zero crossings of the function: 0.5
 *
 * @method Oscillator
 *
 * @return {Float} Sample.
*/
	invSawtooth: function () {
		return this._p * 2 - 1;
	},
/**
 * Returns pulse wave output of the Oscillator, phase zero representing slope starting point.
 *
 * Phase for the zero crossings of the function: 0.125, 0.325
 *
 * @method Oscillator
 *
 * @return {Float} Sample.
*/
	pulse: function () {
		return this._p < 0.5 ?
			this._p < 0.25 ?
				this._p * 8 - 1 :
				1 - (this._p - 0.25) * 8 :
			-1;
	},
/**
 * Returns wavetable output of the Oscillator.
 *
 * Requires sink.js
 *
 * @method Oscillator
 *
 * @return {Float} Sample.
*/
	wavetable: function () {
		return audioLib.Sink.interpolate(this.waveTable, this._p * this.waveTable.length);
	},

	waveShapes: []
};

for (i=0; i<waveshapeNames.length; i++) {
	proto[i] = proto[waveshapeNames[i]];
	proto.waveShapes.push(proto[i]);
}

/**
 * Creates a new wave shape and attaches it to Oscillator.prototype by a specified name.
 *
 * @arg {String} name The name of the wave shape.
 * @arg {Function} algorithm The algorithm for the wave shape. If omitted, no changes are made.
 * @return {Function} The algorithm assigned to Oscillator.prototype by the specified name.
*/

Oscillator.WaveShape = function (name, algorithm) {
	if (algorithm) {
		this.prototype[name] = algorithm;
	}
	return this.prototype[name];
};

/**
 * Creates a new wave shape that mixes existing wave shapes into a new waveshape and attaches it to Oscillator.prototype by a specified name.
 *
 * @arg {String} name The name of the wave shape.
 * @arg {Array} waveshapes Array of the wave shapes to mix, wave shapes represented as objects where .shape is the name of the wave shape and .mix is the volume of the wave shape.
 * @return {Function} The algorithm created.
*/

Oscillator.createMixWave = function (name, waveshapes) {
	var	l = waveshapes.length,
		smpl, i;
	return this.WaveShape(name, function () {
		smpl = 0;
		for (i=0; i<l; i++) {
			smpl += this[waveshapes[i].shape]() * waveshapes[i].mix;
		}
		return smpl;
	});
};

}(Math.PI * 2, ['sine', 'triangle', 'pulse', 'sawtooth', 'invSawtooth', 'square']));

/**
 * Creates a new Sampler.
 *
 * @generator
 *
 * @arg =!sampleRate
 * @arg =!pitch
 *
 * @param type:UInt units:Hz default:44100 sampleRate Sample Rate the apparatus operates on.
 * @param type:Float units:Hz default:440 pitch The pitch of the Sampler.
 * @param type:Float units:s default:0 min:0 delayStart The time offset where to start playing of the sample from.
 * @param type:float units:s default:0 min:0 delayEnd The time offset from the ending of the sample where to stop playback at.
 * @param type:UInt default:Infinity maxVoices The maximum amount of voices allowed to be played simultaneously.
*/

function Sampler (sampleRate, pitch) {
	var	self	= this;
	self.voices	= [];
	self.sampleRate	= sampleRate;
	self.pitch	= isNaN(pitch) ? 440 : self.pitch;
}

Sampler.prototype = {
	sampleRate:	44100,
	pitch:		440,
	delayStart:	0,
	delayEnd:	0,
	maxVoices:	1 / 0,
	/* The length of a single channel of the sample loaded into Sampler, in samples. */
	sampleSize:	0,
	/* An array containing information of all the voices playing currently. */
	voices:		null,
	/* The AudioBuffer representation of the sample used by the sampler. */
	sample:		null,
	/* An array containing the sample, resampled and split by channels as AudioBuffers. */
	samples:	null,
	/* An AudioData object representation of the sample used by the sampler. */
	data:		null,
/**
 * Adds a new voice to the sampler and disbands voices that go past the maxVoices limit.
 *
 * @method Sampler
 *
 * @arg {Float} min:0.0 !frequency Determines the frequency the voice should be played at, relative to the Sampler's pitch.
 * @arg {Float} default:1.0 !velocity The relative volume of the voice.
 * @return {Voice} The voice object created.
*/
	noteOn: function (frequency, velocity) {
		frequency	= isNaN(frequency) ? this.pitch : frequency;
		var	self	= this,
			speed	= frequency / self.pitch,
			rate	= self.sampleRate,
			start	= rate * self.delayStart,
			end	= self.sampleSize - rate * self.delayEnd - 1,
			note	= {
				f:	frequency,
				p:	start,
				s:	speed,
				l:	end,
				v:	isNaN(velocity) ? 1 : velocity
			};
		self.voices.push(note);
		while (self.voices.length > self.maxVoices) {
			end = self.voices.shift();
			if (end.onend) end.onend();
		}
		return note;
	},
/**
 * Moves all the voices one sample position further and disbands the voices that have ended.
*/
	generate: function () {
		var	voices = this.voices,
			i, voice;
		for (i=0; i<voices.length; i++) {
			voice = voices[i];
			voice.p += voice.s;

			if (voice.p > voice.l && voices.splice(i--, 1) && voice.onend) {
				voice.onend();
			}
		}
	},
/**
 * Returns the mix of the voices, by a specific channel.
 *
 * @arg {Int} channel The number of the channel to be returned. (Optional)
 * @return {Float32} The current output of the Sampler's channel number channel.
*/
	getMix: function (ch) {
		var	voices	= this.voices,
			smpl	= 0,
			i;
		ch = ch || 0;
		if (this.samples[ch]) {
			for (i=0; i<voices.length; i++) {
				smpl	+= audioLib.Sink.interpolate(this.samples[ch], voices[i].p) * voices[i].v;
			}
		}
		return smpl;
	},
/**
 * Load an AudioData object to the sampler and resample if needed.
 *
 * @method Sampler
 *
 * @arg {AudioData} data The AudioData object representation of the sample to be loaded.
 * @arg {Boolean} !resample Determines whether to resample the sample to match the sample rate of the Sampler.
*/
	load: function (data, resample) {
		var	self	= this,
			samples	= self.samples = audioLib.Sink.deinterleave(data.data, data.channelCount),
			i;
		if (resample) {
			for (i=0; i<samples.length; i++) {
				samples[i] = audioLib.Sink.resample(samples[i], data.sampleRate, self.sampleRate);
			}
		}
		self.sample	= data.data;
		self.samples	= samples;
		self.data	= data;
		self.sampleSize = samples[0].length;
	}
};

(function () {

/* Depends on Sink.inlineWorker */

function inject () {
	var	args	= arguments,
		l	= args.length,
		code, i;
	for (i=0; i<l; i++){
		code = args[i];
		this.postMessage({type: 'injection', code: code instanceof Function ? '(' + String(code) + ').call(this);' : code });
	}
}

audioLib.AudioWorker = function (code, injectable) {
	var	worker	= 'var audioLib=(' + String(AUDIOLIB) + ').call({},this,Math,Object,Array);\n',
		i;

	for (i=0; i < audioLib.plugins._pluginList.length; i++) {
		worker += '(' + String(audioLib.plugins._pluginList[url]) + '());\n';
	}

	if (injectable) {
		worker += 'this.addEventListener("message",function(e){e.data&&e.data.type==="injection"&&Function(e.data.code).call(this)},true);\n';
	}

	worker += (code instanceof Function ? '(' + String(code) + ').call(this);' : code.textContent || code);
	worker = Sink.inlineWorker(worker);

	if (injectable) {
		worker.inject = inject;
	}

	return worker;
};

}());

/*
pcmdata.js
Uses binary.js and stream.js to parse PCM wave data.
On GitHub:
 * pcmdata.js	http://goo.gl/4uu06
 * binary.js	http://goo.gl/ZaWqK

binary.js repository also includes stream.js

MIT License
*/

(function (global, Math) {

	var	fromCharCode	= String.fromCharCode,
		// the following two aren't really *performance optimization*, but compression optimization.
		y		= true,
		n		= false;

	function convertToBinaryLE (num, size) {
		return size ? fromCharCode(num & 255) + convertToBinaryLE(num >> 8, size - 1) : '';
	}

	function convertToBinaryBE (num, size) { // I don't think this is right
		return size ? convertToBinaryBE(num >> 8, size - 1) + fromCharCode(255 - num & 255) : '';
	}

	function convertToBinary (num, size, bigEndian) {
		return bigEndian ? convertToBinaryBE(num, size) : convertToBinaryLE(num, size);
	}

	function convertFromBinary (str, bigEndian) {
		var	l	= str.length,
			last	= l - 1,
			n	= 0,
			pow	= Math.pow,
			i;
		if (bigEndian) {
			for (i=0; i<l; i++) {
				n += (255 - str.charCodeAt(i)) * pow(256, last - i);
			}
		} else {
			for (i=0; i < l; i++) {
				n += str.charCodeAt(i) * pow(256, i);
			}
		}
		return n;
	}

	// The main function creates all the functions used.
	function Binary (bitCount, signed, /* false === unsigned */ isQ, from /* false === to */) {

		// This is all just for major optimization benefits.
		var	pow			= Math.pow,
			floor			= Math.floor,
			convertFromBinary	= Binary.convertFromBinary,
			convertToBinary		= Binary.convertToBinary,
			byteCount		= bitCount / 8,
			bitMask			= pow(2, bitCount),
			semiMask		= bitMask / 2,
			intMask			= semiMask - 1,
			invSemiMask		= 1 / semiMask,
			invIntMask		= 1 / intMask;

		return from ?
			isQ ?
				signed ? function (num, bigEndian) {
					num = floor(num < 0 ? num * semiMask + bitMask : num * intMask);
					return convertToBinary(
						num,
						byteCount,
						bigEndian
					);
				} : function (num, bigEndian) {
					return convertToBinary(
						floor(num * intMask),
						byteCount,
						bigEndian
					);
				}
			:
				signed ? function (num, bigEndian) {
					return convertToBinary(
						num < 0 ? num + bitMask : num,
						byteCount,
						bigEndian
					);
				} : function (num, bigEndian) {
					return convertToBinary(
						num,
						byteCount,
						bigEndian
					);
				}
		:
			isQ ?
				signed ? function (str, bigEndian) {
					var num = convertFromBinary(str, bigEndian);
					return num > intMask ? (num - bitMask) * invSemiMask : num * invIntMask;
				} : function (str, bigEndian) {
					return convertFromBinary(str, bigEndian) * invIntMask;
				}
			:
				signed ? function (str, bigEndian) {
					var num = convertFromBinary(str, bigEndian);
					return num > intMask ? num - bitMask : num;
				} : function (str, bigEndian) {
					return convertFromBinary(str, bigEndian);
				};
	}

	Binary.convertToBinary		= convertToBinary;
	Binary.convertFromBinary	= convertFromBinary;
	// these are deprecated because JS doesn't support 64 bit uint, so the conversion can't be performed.
/*
	Binary.fromQ64			= Binary(64, y, y, y);
	Binary.toQ64			= Binary(64, y, y, n);
*/
	Binary.fromQ32			= Binary(32, y, y, y);
	Binary.toQ32			= Binary(32, y, y, n);
	Binary.fromQ24			= Binary(24, y, y, y);
	Binary.toQ24			= Binary(24, y, y, n);
	Binary.fromQ16			= Binary(16, y, y, y);
	Binary.toQ16			= Binary(16, y, y, n);
	Binary.fromQ8			= Binary( 8, y, y, y);
	Binary.toQ8			= Binary( 8, y, y, n);
	Binary.fromInt32		= Binary(32, y, n, y);
	Binary.toInt32			= Binary(32, y, n, n);
	Binary.fromInt16		= Binary(16, y, n, y);
	Binary.toInt16			= Binary(16, y, n, n);
	Binary.fromInt8			= Binary( 8, y, n, y);
	Binary.toInt8			= Binary( 8, y, n, n);
	Binary.fromUint32		= Binary(32, n, n, y);
	Binary.toUint32			= Binary(32, n, n, n);
	Binary.fromUint16		= Binary(16, n, n, y);
	Binary.toUint16			= Binary(16, n, n, n);
	Binary.fromUint8		= Binary( 8, n, n, y);
	Binary.toUint8			= Binary( 8, n, n, n);

	global.Binary = Binary;
}(this, Math));
(function (global, Binary) {

function Stream (data) {
	this.data = data;
}

var	proto	= Stream.prototype = {
		read:		function (length) {
			var	self	= this,
				data	= self.data.substr(0, length);
			self.skip(length);
			return data;
		},
		skip:		function (length) {
			var	self	= this,
				data	= self.data	= self.data.substr(length);
			self.pointer	+= length;
			return data.length;
		},
		readBuffer:	function (buffer, bitCount, type) {
			var	self		= this,
				converter	= 'read' + type + bitCount,
				byteCount	= bitCount / 8,
				l		= buffer.length,
				i		= 0;
			while (self.data && i < l) {
				buffer[i++] = self[converter]();
			}
			return i;
		}
	},
	i, match;

function newType (type, bitCount, fn) {
	var	l	= bitCount / 8;
	proto['read' + type + bitCount] = function (bigEndian) {
		return fn(this.read(l), bigEndian);
	};
}

for (i in Binary) {
	match	= /to([a-z]+)([0-9]+)/i.exec(i);
	if (match) newType(match[1], match[2], Binary[i]);
}

global.Stream	= Stream;
Stream.newType	= newType;

}(this, this.Binary));
this.PCMData = (function (Binary, Stream) {

var ByteArray = typeof Uint8Array === 'undefined' ? Array : Uint8Array;

function PCMData (data) {
	return (typeof data === 'string' ? PCMData.decode : PCMData.encode)(data);
}

PCMData.decodeFrame = function (frame, bitCount, result) {
	if (bitCount === 8) {
		var buffer	= new ByteArray(result.length);
		(new Stream(frame)).readBuffer(buffer, 8, 'Uint');
		for (bitCount=0; bitCount<result.length; bitCount++) {
			result[bitCount] = (buffer[bitCount] - 127.5) * 127.5;
		}
	} else {
		(new Stream(frame)).readBuffer(result, bitCount, 'Q');
	}
	return result;
};

PCMData.encodeFrame = function (frame, bitCount) {
	var	properWriter	= Binary[(bitCount === 8 ? 'fromUint' : 'fromQ') + bitCount],
		l		= frame.length,
		r		= '',
		i;
	if (bitCount === 8) {
		for (i=0; i<l; i++) {
			r += properWriter(frame[i] * 127.5 + 127.5);
		}
	} else {
		for (i=0; i<l; i++) {
			r += properWriter(frame[i]);
		}
	}
	return r;
};

PCMData.decode = function (data, asyncCallback) {
	var	stream			= new Stream(data),
		sGroupID1		= stream.read(4),
		dwFileLength		= stream.readUint32();
		stream			= new Stream(stream.read(dwFileLength));
	var	sRiffType		= stream.read(4),
		sGroupID2		= stream.read(4),
		dwChunkSize1		= stream.readUint32(),
		formatChunk		= new Stream(stream.read(dwChunkSize1)),
		wFormatTag		= formatChunk.readUint16(),
		wChannels		= formatChunk.readUint16(),
		dwSamplesPerSec		= formatChunk.readUint32(),
		dwAvgBytesPerSec	= formatChunk.readUint32(),
		wBlockAlign		= formatChunk.readUint16(),
		sampleSize		= wBlockAlign / wChannels,
		dwBitsPerSample		= /* dwChunkSize1 === 16 ? */ formatChunk.readUint16() /* : formatChunk.readUint32() */,
		sGroupID,
		dwChunkSize,
		sampleCount,
		chunkData,
		samples,
		dataTypeList,
		i,
		chunks	= {},
		output	= {
			channelCount:	wChannels,
			bytesPerSample:	wBlockAlign / wChannels,
			sampleRate:	dwAvgBytesPerSec / wBlockAlign,
			chunks:		chunks,
			data:		samples
		};

	function readChunk () {
		sGroupID		= stream.read(4);
		dwChunkSize		= stream.readUint32();
		chunkData		= stream.read(dwChunkSize);
		dataTypeList		= chunks[sGroupID] = chunks[sGroupID] || [];

		if (sGroupID === 'data') {
			sampleCount		= ~~(dwChunkSize / sampleSize);
			samples			= output.data = new Float32Array(sampleCount);
			PCMData.decodeFrame(chunkData, sampleSize * 8, samples);
		} else {
			dataTypeList.push(chunkData);
		}

		if (!asyncCallback) return;

		if (stream.data) {
			setTimeout(readChunk, 1);
		} else {
			asyncCallback(output);
		}
	}

	if (asyncCallback) {
		if (stream.data) {
			readChunk();
		} else {
			asyncCallback(output);
		}
	} else {
		while (stream.data) {
			readChunk();
		}
	}

	return output;
};

PCMData.encode = function (data, asyncCallback) {
	var	
		dWord		= Binary.fromUint32,
		sWord		= Binary.fromUint16,
		samples		= data.data,
		sampleRate	= data.sampleRate,
		channelCount	= data.channelCount || 1,
		bytesPerSample	= data.bytesPerSample || 1,
		bitsPerSample	= bytesPerSample * 8,
		blockAlign	= channelCount * bytesPerSample,
		byteRate	= sampleRate * blockAlign,
		length		= samples.length,
		dLength		= length * bytesPerSample,
		padding		= Math.pow(2, bitsPerSample - 1) - 1,
		chunks		= [],
		chunk		= '',
		chunkType,
		i, n, chunkData;

		
		chunks.push(
			'fmt '				+	// sGroupID		4 bytes		char[4]
			dWord(16)			+	// dwChunkSize		4 bytes		uint32 / dword
			sWord(1)			+	// wFormatTag		2 bytes		uint16 / ushort
			sWord(channelCount)		+	// wChannels		2 bytes		uint16 / ushort
			dWord(sampleRate)		+	// dwSamplesPerSec	4 bytes		uint32 / dword
			dWord(byteRate)			+	// dwAvgBytesPerSec	4 bytes		uint32 / dword
			sWord(blockAlign)		+	// wBlockAlign		2 bytes		uint16 / ushort
			sWord(bitsPerSample)			// dwBitsPerSample	2 or 4 bytes	uint32 / dword OR uint16 / ushort
		);

		chunks.push(
			'data'				+	// sGroupID		4 bytes		char[4]
			dWord(dLength)			+	// dwChunkSize		4 bytes		uint32 / dword
			PCMData.encodeFrame(samples, bitsPerSample)
		);

		chunkData = data.chunks;

		if (chunkData) {
			for (i in chunkData) {
				if (chunkData.hasOwnProperty(i)) {
					chunkType = chunkData[i];
					for (n=0; n<chunkType.length; n++) {
						chunk = chunkType[n];
						chunks.push(i + dWord(chunk.length) + chunk);
					}
				}
			}
		}

		chunks = chunks.join('');
		chunks = 'RIFF'			+	// sGroupId		4 bytes		char[4]
			dWord(chunks.length)	+	// dwFileLength		4 bytes		uint32 / dword
			'WAVE'			+	// sRiffType		4 bytes		char[4]
			chunks;

		if (asyncCallback) setTimeout(function () {
			asyncCallback(chunks);
		}, 1);

		return chunks;
};

return PCMData;

}(this.Binary, this.Stream));

var Sink = this.Sink = function (global) {

/**
 * Creates a Sink according to specified parameters, if possible.
 *
 * @class
 *
 * @arg =!readFn
 * @arg =!channelCount
 * @arg =!bufferSize
 * @arg =!sampleRate
 *
 * @param {Function} readFn A callback to handle the buffer fills.
 * @param {Number} channelCount Channel count.
 * @param {Number} bufferSize (Optional) Specifies a pre-buffer size to control the amount of latency.
 * @param {Number} sampleRate Sample rate (ms).
 * @param {Number} default=0 writePosition Write position of the sink, as in how many samples have been written per channel.
 * @param {String} default=async writeMode The default mode of writing to the sink.
 * @param {String} default=interleaved channelMode The mode in which the sink asks the sample buffers to be channeled in.
 * @param {Number} default=0 previousHit The previous time of a callback.
 * @param {Buffer} default=null ringBuffer The ring buffer array of the sink. If null, ring buffering will not be applied.
 * @param {Number} default=0 ringOffset The current position of the ring buffer.
*/
function Sink (readFn, channelCount, bufferSize, sampleRate) {
	var	sinks	= Sink.sinks.list,
		i;
	for (i=0; i<sinks.length; i++) {
		if (sinks[i].enabled) {
			try {
				return new sinks[i](readFn, channelCount, bufferSize, sampleRate);
			} catch(e1){}
		}
	}

	throw Sink.Error(0x02);
}

function SinkClass () {
}

Sink.SinkClass = SinkClass;

SinkClass.prototype = Sink.prototype = {
	sampleRate: 44100,
	channelCount: 2,
	bufferSize: 4096,

	writePosition: 0,
	previousHit: 0,
	ringOffset: 0,

	channelMode: 'interleaved',
	isReady: false,

/**
 * Does the initialization of the sink.
 * @method Sink
*/
	start: function (readFn, channelCount, bufferSize, sampleRate) {
		this.channelCount	= isNaN(channelCount) || channelCount === null ? this.channelCount: channelCount;
		this.bufferSize		= isNaN(bufferSize) || bufferSize === null ? this.bufferSize : bufferSize;
		this.sampleRate		= isNaN(sampleRate) || sampleRate === null ? this.sampleRate : sampleRate;
		this.readFn		= readFn;
		this.activeRecordings	= [];
		this.previousHit	= +new Date();
		Sink.EventEmitter.call(this);
		Sink.emit('init', [this].concat([].slice.call(arguments)));
	},
/**
 * The method which will handle all the different types of processing applied on a callback.
 * @method Sink
*/
	process: function (soundData, channelCount) {
		this.emit('preprocess', arguments);

		if (this.ringBuffer) {
			(this.channelMode === 'interleaved' ? this.ringSpin : this.ringSpinInterleaved).apply(this, arguments);
		}

		if (this.channelMode === 'interleaved') {
			this.emit('audioprocess', arguments);

			if (this.readFn) {
				this.readFn.apply(this, arguments);
			}
		} else {
			var	soundDataSplit	= Sink.deinterleave(soundData, this.channelCount),
				args		= [soundDataSplit].concat([].slice.call(arguments, 1));
			this.emit('audioprocess', args);

			if (this.readFn) {
				this.readFn.apply(this, args);
			}

			Sink.interleave(soundDataSplit, this.channelCount, soundData);
		}
		this.emit('postprocess', arguments);
		this.previousHit = +new Date();
		this.writePosition += soundData.length / channelCount;
	},
/**
 * Get the current output position, defaults to writePosition - bufferSize.
 *
 * @method Sink
 *
 * @return {Number} The position of the write head, in samples, per channel.
*/
	getPlaybackTime: function () {
		return this.writePosition - this.bufferSize;
	},
/**
 * Internal method to send the ready signal if not ready yet.
 * @method Sink
*/
	ready: function () {
		if (this.isReady) return;

		this.isReady = true;
		this.emit('ready', []);
	}
};

/**
 * The container for all the available sinks. Also a decorator function for creating a new Sink class and binding it.
 *
 * @method Sink
 * @static
 *
 * @arg {String} type The name / type of the Sink.
 * @arg {Function} constructor The constructor function for the Sink.
 * @arg {Object} prototype The prototype of the Sink. (optional)
 * @arg {Boolean} disabled Whether the Sink should be disabled at first.
*/

function sinks (type, constructor, prototype, disabled, priority) {
	prototype = prototype || constructor.prototype;
	constructor.prototype = new Sink.SinkClass();
	constructor.prototype.type = type;
	constructor.enabled = !disabled;

	var k;
	for (k in prototype) {
		if (prototype.hasOwnProperty(k)) {
			constructor.prototype[k] = prototype[k];
		}
	}

	sinks[type] = constructor;
	sinks.list[priority ? 'unshift' : 'push'](constructor);
}

Sink.sinks = Sink.devices = sinks;
Sink.sinks.list = [];

Sink.singleton = function () {
	var sink = Sink.apply(null, arguments);

	Sink.singleton = function () {
		return sink;
	};

	return sink;
};

global.Sink = Sink;

return Sink;

}(function (){ return this; }());
void function (Sink) {

/**
 * A light event emitter.
 *
 * @class
 * @static Sink
*/
function EventEmitter () {
	var k;
	for (k in EventEmitter.prototype) {
		if (EventEmitter.prototype.hasOwnProperty(k)) {
			this[k] = EventEmitter.prototype[k];
		}
	}
	this._listeners = {};
}

EventEmitter.prototype = {
	_listeners: null,
/**
 * Emits an event.
 *
 * @method EventEmitter
 *
 * @arg {String} name The name of the event to emit.
 * @arg {Array} args The arguments to pass to the event handlers.
*/
	emit: function (name, args) {
		if (this._listeners[name]) {
			for (var i=0; i<this._listeners[name].length; i++) {
				this._listeners[name][i].apply(this, args);
			}
		}
		return this;
	},
/**
 * Adds an event listener to an event.
 *
 * @method EventEmitter
 *
 * @arg {String} name The name of the event.
 * @arg {Function} listener The event listener to attach to the event.
*/
	on: function (name, listener) {
		this._listeners[name] = this._listeners[name] || [];
		this._listeners[name].push(listener);
		return this;
	},
/**
 * Adds an event listener to an event.
 *
 * @method EventEmitter
 *
 * @arg {String} name The name of the event.
 * @arg {Function} !listener The event listener to remove from the event. If not specified, will delete all.
*/
	off: function (name, listener) {
		if (this._listeners[name]) {
			if (!listener) {
				delete this._listeners[name];
				return this;
			}

			for (var i=0; i<this._listeners[name].length; i++) {
				if (this._listeners[name][i] === listener) {
					this._listeners[name].splice(i--, 1);
				}
			}

			if (!this._listeners[name].length) {
				delete this._listeners[name];
			}
		}
		return this;
	}
};

Sink.EventEmitter = EventEmitter;

EventEmitter.call(Sink);

}(this.Sink);
void function (Sink) {

/*
 * A Sink-specific error class.
 *
 * @class
 * @static Sink
 * @name Error
 *
 * @arg =code
 *
 * @param {Number} code The error code.
 * @param {String} message A brief description of the error.
 * @param {String} explanation A more verbose explanation of why the error occured and how to fix.
*/

function SinkError(code) {
	if (!SinkError.hasOwnProperty(code)) throw SinkError(1);
	if (!(this instanceof SinkError)) return new SinkError(code);

	var k;
	for (k in SinkError[code]) {
		if (SinkError[code].hasOwnProperty(k)) {
			this[k] = SinkError[code][k];
		}
	}

	this.code = code;
}

SinkError.prototype = new Error();

SinkError.prototype.toString = function () {
	return 'SinkError 0x' + this.code.toString(16) + ': ' + this.message;
};

SinkError[0x01] = {
	message: 'No such error code.',
	explanation: 'The error code does not exist.'
};
SinkError[0x02] = {
	message: 'No audio sink available.',
	explanation: 'The audio device may be busy, or no supported output API is available for this browser.'
};

SinkError[0x10] = {
	message: 'Buffer underflow.',
	explanation: 'Trying to recover...'
};
SinkError[0x11] = {
	message: 'Critical recovery fail.',
	explanation: 'The buffer underflow has reached a critical point, trying to recover, but will probably fail anyway.'
};
SinkError[0x12] = {
	message: 'Buffer size too large.',
	explanation: 'Unable to allocate the buffer due to excessive length, please try a smaller buffer. Buffer size should probably be smaller than the sample rate.'
};

Sink.Error = SinkError;

}(this.Sink);
void function (Sink) {

var _Blob, _BlobBuilder, _URL, _btoa;

void function (prefixes, urlPrefixes) {
	function find (name, prefixes) {
		var b, a = prefixes.slice();

		for (b=a.shift(); typeof b !== 'undefined'; b=a.shift()) {
			b = Function('return typeof ' + b + name + 
				'=== "undefined" ? undefined : ' +
				b + name)();

			if (b) return b;
		}
	}

	_Blob = find('Blob', prefixes);
	_BlobBuilder = find('BlobBuilder', prefixes);
	_URL = find('URL', urlPrefixes);
	_btoa = find('btoa', ['']);
}([
	'',
	'Moz',
	'WebKit',
	'MS'
], [
	'',
	'webkit'
]);

var createBlob = _Blob && _URL && function (content, type) {
	return _URL.createObjectURL(new _Blob([content], { type: type }));
};

var createBlobBuilder = _BlobBuilder && _URL && function (content, type) {
	var bb = new _BlobBuilder();
	bb.append(content);

	return _URL.createObjectURL(bb.getBlob(type));
};

var createData = _btoa && function (content, type) {
	return 'data:' + type + ';base64,' + _btoa(content);
};

var createDynURL =
	createBlob ||
	createBlobBuilder ||
	createData;

if (!createDynURL) return;

if (createBlob) createDynURL.createBlob = createBlob;
if (createBlobBuilder) createDynURL.createBlobBuilder = createBlobBuilder;
if (createData) createDynURL.createData = createData;

if (_Blob) createDynURL.Blob = _Blob;
if (_BlobBuilder) createDynURL.BlobBuilder = _BlobBuilder;
if (_URL) createDynURL.URL = _URL;

Sink.createDynURL = createDynURL;

Sink.revokeDynURL = function (url) {
	if (typeof url === 'string' && url.indexOf('data:') === 0) {
		return false;
	} else {
		return _URL.revokeObjectURL(url);
	}
};

}(this.Sink);
void function (Sink) {

/**
 * Creates an inline worker using a data/blob URL, if possible.
 *
 * @static Sink
 *
 * @arg {String} script
 *
 * @return {Worker} A web worker, or null if impossible to create.
*/

var define = Object.defineProperty ? function (obj, name, value) {
	Object.defineProperty(obj, name, {
		value: value,
		configurable: true,
		writable: true
	});
} : function (obj, name, value) {
	obj[name] = value;
};

function terminate () {
	define(this, 'terminate', this._terminate);

	Sink.revokeDynURL(this._url);

	delete this._url;
	delete this._terminate;
	return this.terminate();
}

function inlineWorker (script) {
	function wrap (type, content, typeName) {
		try {
			var url = type(content, 'text/javascript');
			var worker = new Worker(url);

			define(worker, '_url', url);
			define(worker, '_terminate', worker.terminate);
			define(worker, 'terminate', terminate);

			if (inlineWorker.type) return worker;

			inlineWorker.type = typeName;
			inlineWorker.createURL = type;

			return worker;
		} catch (e) {
			return null;
		}
	}

	var createDynURL = Sink.createDynURL;

	if (!createDynURL) return null;

	var worker;

	if (inlineWorker.createURL) {
		return wrap(inlineWorker.createURL, script, inlineWorker.type);
	}

	worker = wrap(createDynURL.createBlob, script, 'blob');
	if (worker) return worker;

	worker = wrap(createDynURL.createBlobBuilder, script, 'blobbuilder');
	if (worker) return worker;

	worker = wrap(createDynURL.createData, script, 'data');

	return worker;
}

Sink.EventEmitter.call(inlineWorker);

inlineWorker.test = function () {
	inlineWorker.ready = inlineWorker.working = false;
	inlineWorker.type = '';
	inlineWorker.createURL = null;

	var worker = inlineWorker('this.onmessage=function(e){postMessage(e.data)}');
	var data = 'inlineWorker';

	function ready (success) {
		if (inlineWorker.ready) return;

		inlineWorker.ready = true;
		inlineWorker.working = success;
		inlineWorker.emit('ready', [success]);
		inlineWorker.off('ready');

		if (success && worker) {
			worker.terminate();
		}

		worker = null;
	}

	if (!worker) {
		setTimeout(function () {
			ready(false);
		}, 0);
	} else {
		worker.onmessage = function (e) {
			ready(e.data === data);
		};

		worker.postMessage(data);

		setTimeout(function () {
			ready(false);
		}, 1000);
	}
};

Sink.inlineWorker = inlineWorker;

inlineWorker.test();

}(this.Sink);
void function (Sink) {

/**
 * Creates a timer with consistent (ie. not clamped) intervals even in background tabs.
 * Uses inline workers to achieve this. If not available, will revert to regular timers.
 *
 * @static Sink
 * @name doInterval
 *
 * @arg {Function} callback The callback to trigger on timer hit.
 * @arg {Number} timeout The interval between timer hits.
 *
 * @return {Function} A function to cancel the timer.
*/

Sink.doInterval = function (callback, timeout) {
	var timer, kill;

	function create (noWorker) {
		if (Sink.inlineWorker.working && !noWorker) {
			timer = Sink.inlineWorker('setInterval(function (){ postMessage("tic"); }, ' + timeout + ');');
			timer.onmessage = function (){
				callback();
			};
			kill = function () {
				timer.terminate();
			};
		} else {
			timer = setInterval(callback, timeout);
			kill = function (){
				clearInterval(timer);
			};
		}
	}

	if (Sink.inlineWorker.ready) {
		create();
	} else {
		Sink.inlineWorker.on('ready', function () {
			create();
		});
	}

	return function () {
		if (!kill) {
			if (!Sink.inlineWorker.ready) {
				Sink.inlineWorker.on('ready', function () {
					if (kill) kill();
				});
			}
		} else {
			kill();
		}
	};
};

}(this.Sink);
void function (Sink) {

/**
 * A Sink class for the Mozilla Audio Data API.
*/

Sink.sinks('audiodata', function () {
	var	self			= this,
		currentWritePosition	= 0,
		tail			= null,
		audioDevice		= new Audio(),
		written, currentPosition, available, soundData, prevPos,
		timer; // Fix for https://bugzilla.mozilla.org/show_bug.cgi?id=630117
	self.start.apply(self, arguments);
	self.preBufferSize = isNaN(arguments[4]) || arguments[4] === null ? this.preBufferSize : arguments[4];

	function bufferFill() {
		if (tail) {
			written = audioDevice.mozWriteAudio(tail);
			currentWritePosition += written;
			if (written < tail.length){
				tail = tail.subarray(written);
				return tail;
			}
			tail = null;
		}

		currentPosition = audioDevice.mozCurrentSampleOffset();
		available = Number(currentPosition + (prevPos !== currentPosition ? self.bufferSize : self.preBufferSize) * self.channelCount - currentWritePosition);

		if (currentPosition === prevPos) {
			self.emit('error', [Sink.Error(0x10)]);
		}

		if (available > 0 || prevPos === currentPosition){
			self.ready();

			try {
				soundData = new Float32Array(prevPos === currentPosition ? self.preBufferSize * self.channelCount :
					self.forceBufferSize ? available < self.bufferSize * 2 ? self.bufferSize * 2 : available : available);
			} catch(e) {
				self.emit('error', [Sink.Error(0x12)]);
				self.kill();
				return;
			}
			self.process(soundData, self.channelCount);
			written = self._audio.mozWriteAudio(soundData);
			if (written < soundData.length){
				tail = soundData.subarray(written);
			}
			currentWritePosition += written;
		}
		prevPos = currentPosition;
	}

	audioDevice.mozSetup(self.channelCount, self.sampleRate);

	this._timers = [];

	this._timers.push(Sink.doInterval(function () {
		// Check for complete death of the output
		if (+new Date() - self.previousHit > 2000) {
			self._audio = audioDevice = new Audio();
			audioDevice.mozSetup(self.channelCount, self.sampleRate);
			currentWritePosition = 0;
			self.emit('error', [Sink.Error(0x11)]);
		}
	}, 1000));

	this._timers.push(Sink.doInterval(bufferFill, self.interval));

	self._bufferFill	= bufferFill;
	self._audio		= audioDevice;
}, {
	// These are somewhat safe values...
	bufferSize: 24576,
	preBufferSize: 24576,
	forceBufferSize: false,
	interval: 100,

	kill: function () {
		while (this._timers.length) {
			this._timers.shift()();
		}

		this.emit('kill');
	},

	getPlaybackTime: function () {
		return this._audio.mozCurrentSampleOffset() / this.channelCount;
	}
}, false, true);

Sink.sinks.moz = Sink.sinks.audiodata;

}(this.Sink);
(function (Sink, sinks) {

sinks = Sink.sinks;

function newAudio (src) {
	var audio = document.createElement('audio');
	if (src) {
		audio.src = src;
	}
	return audio;
}

/* TODO: Implement a <BGSOUND> hack for IE8. */

/**
 * A sink class for WAV data URLs
 * Relies on pcmdata.js and utils to be present.
 * Thanks to grantgalitz and others for the idea.
*/
sinks('wav', function () {
	var	self			= this,
		audio			= new sinks.wav.wavAudio(),
		PCMData			= typeof PCMData === 'undefined' ? audioLib.PCMData : PCMData;
	self.start.apply(self, arguments);
	var	soundData		= new Float32Array(self.bufferSize * self.channelCount),
		zeroData		= new Float32Array(self.bufferSize * self.channelCount);

	if (!newAudio().canPlayType('audio/wav; codecs=1') || !btoa) throw 0;
	
	function bufferFill () {
		if (self._audio.hasNextFrame) return;

		self.ready();

		Sink.memcpy(zeroData, 0, soundData, 0);
		self.process(soundData, self.channelCount);

		self._audio.setSource('data:audio/wav;base64,' + btoa(
			audioLib.PCMData.encode({
				data:		soundData,
				sampleRate:	self.sampleRate,
				channelCount:	self.channelCount,
				bytesPerSample:	self.quality
			})
		));

		if (!self._audio.currentFrame.src) self._audio.nextClip();
	}
	
	self.kill		= Sink.doInterval(bufferFill, 40);
	self._bufferFill	= bufferFill;
	self._audio		= audio;
}, {
	quality: 1,
	bufferSize: 22050,

	getPlaybackTime: function () {
		var audio = this._audio;
		return (audio.currentFrame ? audio.currentFrame.currentTime * this.sampleRate : 0) + audio.samples;
	}
});

function wavAudio () {
	var self = this;

	self.currentFrame	= newAudio();
	self.nextFrame		= newAudio();

	self._onended		= function () {
		self.samples += self.bufferSize;
		self.nextClip();
	};
}

wavAudio.prototype = {
	samples:	0,
	nextFrame:	null,
	currentFrame:	null,
	_onended:	null,
	hasNextFrame:	false,

	nextClip: function () {
		var	curFrame	= this.currentFrame;
		this.currentFrame	= this.nextFrame;
		this.nextFrame		= curFrame;
		this.hasNextFrame	= false;
		this.currentFrame.play();
	},

	setSource: function (src) {
		this.nextFrame.src = src;
		this.nextFrame.addEventListener('ended', this._onended, true);

		this.hasNextFrame = true;
	}
};

sinks.wav.wavAudio = wavAudio;

}(this.Sink));
void function (Sink) {

var cubeb;

try {
	cubeb = require('cubeb');
} catch (e) {
	return;
}

var getContext = function () {
	var ctx;

	return function () {
		ctx = new cubeb.Context(
			"sink.js " + process.pid + ' ' + new Date()
		);

		getContext = function () { return ctx; };

		return ctx;
	};
}();

var streamCount = 0;

Sink.sinks('cubeb', function () {
	var self = this;

	self.start.apply(self, arguments);

	self._ctx = getContext();
	self._stream = new cubeb.Stream(
		self._ctx,
		self._ctx.name + ' ' + streamCount++,
		cubeb.SAMPLE_FLOAT32LE,
		self.channelCount,
		self.sampleRate,
		self.bufferSize,
		self._latency,
		function (frameCount) {
			var buffer = new Buffer(
				4 * frameCount * self.channelCount);
			var soundData = new Float32Array(buffer);

			self.process(soundData, self.channelCount);

			self._stream.write(buffer);
			self._stream.release();
		},
		function (state) {}
	);

	self._stream.start();
}, {
	_ctx: null,
	_stream: null,
	_latency: 250,
	bufferSize: 4096,

	kill: function () {
		this._stream.stop();
		this.emit('kill');
	}
	
});

}(this.Sink);
void function (Sink) {

/**
 * A dummy Sink. (No output)
*/

Sink.sinks('dummy', function () {
	var	self = this;
	self.start.apply(self, arguments);
	
	function bufferFill () {
		var	soundData = new Float32Array(self.bufferSize * self.channelCount);
		self.process(soundData, self.channelCount);
	}

	self._kill = Sink.doInterval(bufferFill, self.bufferSize / self.sampleRate * 1000);

	self._callback		= bufferFill;
}, {
	kill: function () {
		this._kill();
		this.emit('kill');
	}
}, true);

}(this.Sink);
 (function (sinks, fixChrome82795) {

var AudioContext = typeof window === 'undefined' ? null : window.webkitAudioContext || window.AudioContext;

/**
 * A sink class for the Web Audio API
*/

sinks('webaudio', function (readFn, channelCount, bufferSize, sampleRate) {
	var	self		= this,
		context		= sinks.webaudio.getContext(),
		node		= null,
		soundData	= null,
		zeroBuffer	= null;
	self.start.apply(self, arguments);
	node = context.createJavaScriptNode(self.bufferSize, self.channelCount, self.channelCount);

	function bufferFill(e) {
		var	outputBuffer	= e.outputBuffer,
			channelCount	= outputBuffer.numberOfChannels,
			i, n, l		= outputBuffer.length,
			size		= outputBuffer.size,
			channels	= new Array(channelCount),
			tail;

		self.ready();
		
		soundData	= soundData && soundData.length === l * channelCount ? soundData : new Float32Array(l * channelCount);
		zeroBuffer	= zeroBuffer && zeroBuffer.length === soundData.length ? zeroBuffer : new Float32Array(l * channelCount);
		soundData.set(zeroBuffer);

		for (i=0; i<channelCount; i++) {
			channels[i] = outputBuffer.getChannelData(i);
		}

		self.process(soundData, self.channelCount);

		for (i=0; i<l; i++) {
			for (n=0; n < channelCount; n++) {
				channels[n][i] = soundData[i * self.channelCount + n];
			}
		}
	}

	self.sampleRate = context.sampleRate;

	node.onaudioprocess = bufferFill;
	node.connect(context.destination);

	self._context		= context;
	self._node		= node;
	self._callback		= bufferFill;
	/* Keep references in order to avoid garbage collection removing the listeners, working around http://code.google.com/p/chromium/issues/detail?id=82795 */
	// Thanks to @baffo32
	fixChrome82795.push(node);
}, {
	kill: function () {
		this._node.disconnect(0);

		for (var i=0; i<fixChrome82795.length; i++) {
			if (fixChrome82795[i] === this._node) {
				fixChrome82795.splice(i--, 1);
			}
		}

		this._node = this._context = null;
		this.emit('kill');
	},

	getPlaybackTime: function () {
		return this._context.currentTime * this.sampleRate;
	}
}, false, true);

sinks.webkit = sinks.webaudio;

sinks.webaudio.fix82795 = fixChrome82795;

sinks.webaudio.getContext = function () {
	// For now, we have to accept that the AudioContext is at 48000Hz, or whatever it decides.
	var context = new AudioContext(/*sampleRate*/);

	sinks.webaudio.getContext = function () {
		return context;
	};

	return context;
};

}(this.Sink.sinks, []));
(function (Sink) {

/**
 * A Sink class for the Media Streams Processing API and/or Web Audio API in a Web Worker.
*/

Sink.sinks('worker', function () {
	var	self		= this,
		global		= (function(){ return this; }()),
		soundData	= null,
		outBuffer	= null,
		zeroBuffer	= null;
	self.start.apply(self, arguments);

	// Let's see if we're in a worker.

	importScripts();

	function mspBufferFill (e) {
		if (!self.isReady) {
			self.initMSP(e);
		}

		self.ready();

		var	channelCount	= self.channelCount,
			l		= e.audioLength,
			n, i;

		soundData	= soundData && soundData.length === l * channelCount ? soundData : new Float32Array(l * channelCount);
		outBuffer	= outBuffer && outBuffer.length === soundData.length ? outBuffer : new Float32Array(l * channelCount);
		zeroBuffer	= zeroBuffer && zeroBuffer.length === soundData.length ? zeroBuffer : new Float32Array(l * channelCount);

		soundData.set(zeroBuffer);
		outBuffer.set(zeroBuffer);

		self.process(soundData, self.channelCount);

		for (n=0; n<channelCount; n++) {
			for (i=0; i<l; i++) {
				outBuffer[n * e.audioLength + i] = soundData[n + i * channelCount];
			}
		}

		e.writeAudio(outBuffer);
	}

	function waBufferFill(e) {
		if (!self.isReady) {
			self.initWA(e);
		}

		self.ready();

		var	outputBuffer	= e.outputBuffer,
			channelCount	= outputBuffer.numberOfChannels,
			i, n, l		= outputBuffer.length,
			size		= outputBuffer.size,
			channels	= new Array(channelCount),
			tail;
		
		soundData	= soundData && soundData.length === l * channelCount ? soundData : new Float32Array(l * channelCount);
		zeroBuffer	= zeroBuffer && zeroBuffer.length === soundData.length ? zeroBuffer : new Float32Array(l * channelCount);
		soundData.set(zeroBuffer);

		for (i=0; i<channelCount; i++) {
			channels[i] = outputBuffer.getChannelData(i);
		}

		self.process(soundData, self.channelCount);

		for (i=0; i<l; i++) {
			for (n=0; n < channelCount; n++) {
				channels[n][i] = soundData[i * self.channelCount + n];
			}
		}
	}

	global.onprocessmedia	= mspBufferFill;
	global.onaudioprocess	= waBufferFill;

	self._mspBufferFill	= mspBufferFill;
	self._waBufferFill	= waBufferFill;

}, {
	ready: false,

	initMSP: function (e) {
		this.channelCount	= e.audioChannels;
		this.sampleRate		= e.audioSampleRate;
		this.bufferSize		= e.audioLength * this.channelCount;
		this.ready		= true;
		this.emit('ready', []);
	},

	initWA: function (e) {
		var b = e.outputBuffer;
		this.channelCount	= b.numberOfChannels;
		this.sampleRate		= b.sampleRate;
		this.bufferSize		= b.length * this.channelCount;
		this.ready		= true;
		this.emit('ready', []);
	}
});

}(this.Sink));
(function (Sink) {

(function(){

/**
 * If method is supplied, adds a new interpolation method to Sink.interpolation, otherwise sets the default interpolation method (Sink.interpolate) to the specified property of Sink.interpolate.
 *
 * @arg {String} name The name of the interpolation method to get / set.
 * @arg {Function} !method The interpolation method.
*/

function interpolation(name, method) {
	if (name && method) {
		interpolation[name] = method;
	} else if (name && interpolation[name] instanceof Function) {
		Sink.interpolate = interpolation[name];
	}
	return interpolation[name];
}

Sink.interpolation = interpolation;


/**
 * Interpolates a fractal part position in an array to a sample. (Linear interpolation)
 *
 * @param {Array} arr The sample buffer.
 * @param {number} pos The position to interpolate from.
 * @return {Float32} The interpolated sample.
*/
interpolation('linear', function (arr, pos) {
	var	first	= Math.floor(pos),
		second	= first + 1,
		frac	= pos - first;
	second		= second < arr.length ? second : 0;
	return arr[first] * (1 - frac) + arr[second] * frac;
});

/**
 * Interpolates a fractal part position in an array to a sample. (Nearest neighbour interpolation)
 *
 * @param {Array} arr The sample buffer.
 * @param {number} pos The position to interpolate from.
 * @return {Float32} The interpolated sample.
*/
interpolation('nearest', function (arr, pos) {
	return pos >= arr.length - 0.5 ? arr[0] : arr[Math.round(pos)];
});

interpolation('linear');

}());


/**
 * Resamples a sample buffer from a frequency to a frequency and / or from a sample rate to a sample rate.
 *
 * @static Sink
 * @name resample
 *
 * @arg {Buffer} buffer The sample buffer to resample.
 * @arg {Number} fromRate The original sample rate of the buffer, or if the last argument, the speed ratio to convert with.
 * @arg {Number} fromFrequency The original frequency of the buffer, or if the last argument, used as toRate and the secondary comparison will not be made.
 * @arg {Number} toRate The sample rate of the created buffer.
 * @arg {Number} toFrequency The frequency of the created buffer.
 *
 * @return The new resampled buffer.
*/
Sink.resample	= function (buffer, fromRate /* or speed */, fromFrequency /* or toRate */, toRate, toFrequency) {
	var
		argc		= arguments.length,
		speed		= argc === 2 ? fromRate : argc === 3 ? fromRate / fromFrequency : toRate / fromRate * toFrequency / fromFrequency,
		l		= buffer.length,
		length		= Math.ceil(l / speed),
		newBuffer	= new Float32Array(length),
		i, n;
	for (i=0, n=0; i<l; i += speed) {
		newBuffer[n++] = Sink.interpolate(buffer, i);
	}
	return newBuffer;
};

}(this.Sink));
(function (Sink) {

/**
 * Splits a sample buffer into those of different channels.
 *
 * @static Sink
 * @name deinterleave
 *
 * @arg {Buffer} buffer The sample buffer to split.
 * @arg {Number} channelCount The number of channels to split to.
 *
 * @return {Array} An array containing the resulting sample buffers.
*/

Sink.deinterleave = function (buffer, channelCount) {
	var	l	= buffer.length,
		size	= l / channelCount,
		ret	= [],
		i, n;
	for (i=0; i<channelCount; i++){
		ret[i] = new Float32Array(size);
		for (n=0; n<size; n++){
			ret[i][n] = buffer[n * channelCount + i];
		}
	}
	return ret;
};

/**
 * Joins an array of sample buffers into a single buffer.
 *
 * @static Sink
 * @name resample
 *
 * @arg {Array} buffers The buffers to join.
 * @arg {Number} !channelCount The number of channels. Defaults to buffers.length
 * @arg {Buffer} !buffer The output buffer.
 *
 * @return {Buffer} The interleaved buffer created.
*/

Sink.interleave = function (buffers, channelCount, buffer) {
	channelCount		= channelCount || buffers.length;
	var	l		= buffers[0].length,
		bufferCount	= buffers.length,
		i, n;
	buffer			= buffer || new Float32Array(l * channelCount);
	for (i=0; i<bufferCount; i++) {
		for (n=0; n<l; n++) {
			buffer[i + n * channelCount] = buffers[i][n];
		}
	}
	return buffer;
};

/**
 * Mixes two or more buffers down to one.
 *
 * @static Sink
 * @name mix
 *
 * @arg {Buffer} buffer The buffer to append the others to.
 * @arg {Buffer} bufferX The buffers to append from.
 *
 * @return {Buffer} The mixed buffer.
*/

Sink.mix = function (buffer) {
	var	buffers	= [].slice.call(arguments, 1),
		l, i, c;
	for (c=0; c<buffers.length; c++){
		l = Math.max(buffer.length, buffers[c].length);
		for (i=0; i<l; i++){
			buffer[i] += buffers[c][i];
		}
	}
	return buffer;
};

/**
 * Resets a buffer to all zeroes.
 *
 * @static Sink
 * @name resetBuffer
 *
 * @arg {Buffer} buffer The buffer to reset.
 *
 * @return {Buffer} The 0-reset buffer.
*/

Sink.resetBuffer = function (buffer) {
	var	l	= buffer.length,
		i;
	for (i=0; i<l; i++){
		buffer[i] = 0;
	}
	return buffer;
};

/**
 * Copies the content of a buffer to another buffer.
 *
 * @static Sink
 * @name clone
 *
 * @arg {Buffer} buffer The buffer to copy from.
 * @arg {Buffer} !result The buffer to copy to.
 *
 * @return {Buffer} A clone of the buffer.
*/

Sink.clone = function (buffer, result) {
	var	l	= buffer.length,
		i;
	result = result || new Float32Array(l);
	for (i=0; i<l; i++){
		result[i] = buffer[i];
	}
	return result;
};

/**
 * Creates an array of buffers of the specified length and the specified count.
 *
 * @static Sink
 * @name createDeinterleaved
 *
 * @arg {Number} length The length of a single channel.
 * @arg {Number} channelCount The number of channels.
 * @return {Array} The array of buffers.
*/

Sink.createDeinterleaved = function (length, channelCount) {
	var	result	= new Array(channelCount),
		i;
	for (i=0; i<channelCount; i++){
		result[i] = new Float32Array(length);
	}
	return result;
};

Sink.memcpy = function (src, srcOffset, dst, dstOffset, length) {
	src	= src.subarray || src.slice ? src : src.buffer;
	dst	= dst.subarray || dst.slice ? dst : dst.buffer;

	src	= srcOffset ? src.subarray ?
		src.subarray(srcOffset, length && srcOffset + length) :
		src.slice(srcOffset, length && srcOffset + length) : src;

	if (dst.set) {
		dst.set(src, dstOffset);
	} else {
		for (var i=0; i<src.length; i++) {
			dst[i + dstOffset] = src[i];
		}
	}

	return dst;
};

Sink.memslice = function (buffer, offset, length) {
	return buffer.subarray ? buffer.subarray(offset, length) : buffer.slice(offset, length);
};

Sink.mempad = function (buffer, out, offset) {
	out = out.length ? out : new (buffer.constructor)(out);
	Sink.memcpy(buffer, 0, out, offset);
	return out;
};

Sink.linspace = function (start, end, out) {
	var l, i, n, step;
	out	= out.length ? (l=out.length) && out : Array(l=out);
	step	= (end - start) / --l;
	for (n=start+step, i=1; i<l; i++, n+=step) {
		out[i] = n;
	}
	out[0]	= start;
	out[l]	= end;
	return out;
};

Sink.ftoi = function (input, bitCount, output) {
	var i, mask = Math.pow(2, bitCount - 1);

	output = output || new (input.constructor)(input.length);

	for (i=0; i<input.length; i++) {
		output[i] = ~~(mask * input[i]);
	}

	return output;
};

}(this.Sink));
(function (Sink) {

function Proxy (bufferSize, channelCount) {
	Sink.EventEmitter.call(this);

	this.bufferSize		= isNaN(bufferSize) || bufferSize === null ? this.bufferSize : bufferSize;
	this.channelCount	= isNaN(channelCount) || channelCount === null ? this.channelCount : channelCount;

	var self = this;
	this.callback = function () {
		return self.process.apply(self, arguments);
	};

	this.resetBuffer();
}

Proxy.prototype = {
	buffer: null,
	zeroBuffer: null,
	parentSink: null,
	bufferSize: 4096,
	channelCount: 2,
	offset: null,

	resetBuffer: function () {
		this.buffer	= new Float32Array(this.bufferSize);
		this.zeroBuffer	= new Float32Array(this.bufferSize);
	},

	process: function (buffer, channelCount) {
		if (this.offset === null) {
			this.loadBuffer();
		}

		for (var i=0; i<buffer.length; i++) {
			if (this.offset >= this.buffer.length) {
				this.loadBuffer();
			}

			buffer[i] = this.buffer[this.offset++];
		}
	},

	loadBuffer: function () {
		this.offset = 0;
		Sink.memcpy(this.zeroBuffer, 0, this.buffer, 0);
		this.emit('audioprocess', [this.buffer, this.channelCount]);
	}
};

Sink.Proxy = Proxy;

/**
 * Creates a proxy callback system for the sink instance.
 * Requires Sink utils.
 *
 * @method Sink
 * @method createProxy
 *
 * @arg {Number} !bufferSize The buffer size for the proxy.
*/
Sink.prototype.createProxy = function (bufferSize) {
	var	proxy		= new Sink.Proxy(bufferSize, this.channelCount);
	proxy.parentSink	= this;

	this.on('audioprocess', proxy.callback);

	return proxy;
};

}(this.Sink));
void function (Sink) {

function processRingBuffer () {
	if (this.ringBuffer) {
		(this.channelMode === 'interleaved' ? this.ringSpin : this.ringSpinInterleaved).apply(this, arguments);
	}
}

Sink.on('init', function (sink) {
	sink.on('preprocess', processRingBuffer);
});

Sink.prototype.ringBuffer = null;

/**
 * A private method that applies the ring buffer contents to the specified buffer, while in interleaved mode.
 *
 * @method Sink
 * @name ringSpin
 *
 * @arg {Array} buffer The buffer to write to.
*/
Sink.prototype.ringSpin = function (buffer) {
	var	ring	= this.ringBuffer,
		l	= buffer.length,
		m	= ring.length,
		off	= this.ringOffset,
		i;
	for (i=0; i<l; i++){
		buffer[i] += ring[off];
		off = (off + 1) % m;
	}
	this.ringOffset = off;
};

/**
 * A private method that applies the ring buffer contents to the specified buffer, while in deinterleaved mode.
 *
 * @method Sink
 * @name ringSpinDeinterleaved
 *
 * @param {Array} buffer The buffers to write to.
*/
Sink.prototype.ringSpinDeinterleaved = function (buffer) {
	var	ring	= this.ringBuffer,
		l	= buffer.length,
		ch	= ring.length,
		m	= ring[0].length,
		len	= ch * m,
		off	= this.ringOffset,
		i, n;
	for (i=0; i<l; i+=ch){
		for (n=0; n<ch; n++){
			buffer[i + n] += ring[n][off];
		}
		off = (off + 1) % m;
	}
	this.ringOffset = n;
};

}(this.Sink);
void function (Sink, proto) {

proto = Sink.prototype;

Sink.on('init', function (sink) {
	sink.asyncBuffers	= [];
	sink.syncBuffers	= [];
	sink.on('preprocess', sink.writeBuffersSync);
	sink.on('postprocess', sink.writeBuffersAsync);
});

proto.writeMode		= 'async';
proto.asyncBuffers	= proto.syncBuffers = null;

/**
 * Private method that handles the mixing of asynchronously written buffers.
 *
 * @method Sink
 * @name writeBuffersAsync
 *
 * @arg {Array} buffer The buffer to write to.
*/
proto.writeBuffersAsync = function (buffer) {
	var	buffers		= this.asyncBuffers,
		l		= buffer.length,
		buf,
		bufLength,
		i, n, offset;
	if (buffers) {
		for (i=0; i<buffers.length; i++) {
			buf		= buffers[i];
			bufLength	= buf.b.length;
			offset		= buf.d;
			buf.d		-= Math.min(offset, l);
			
			for (n=0; n + offset < l && n < bufLength; n++) {
				buffer[n + offset] += buf.b[n];
			}
			buf.b = buf.b.subarray(n + offset);
			if (i >= bufLength) {
				buffers.splice(i--, 1);
			}
		}
	}
};

/**
 * A private method that handles mixing synchronously written buffers.
 *
 * @method Sink
 * @name writeBuffersSync
 *
 * @arg {Array} buffer The buffer to write to.
*/
proto.writeBuffersSync = function (buffer) {
	var	buffers		= this.syncBuffers,
		l		= buffer.length,
		i		= 0,
		soff		= 0;
	for (;i<l && buffers.length; i++) {
		buffer[i] += buffers[0][soff];
		if (buffers[0].length <= soff){
			buffers.splice(0, 1);
			soff = 0;
			continue;
		}
		soff++;
	}
	if (buffers.length) {
		buffers[0] = buffers[0].subarray(soff);
	}
};

/**
 * Writes a buffer asynchronously on top of the existing signal, after a specified delay.
 *
 * @method Sink
 * @name writeBufferAsync
 *
 * @arg {Array} buffer The buffer to write.
 * @arg {Number} delay The delay to write after. If not specified, the Sink will calculate a delay to compensate the latency.
 * @return {Number} The number of currently stored asynchronous buffers.
*/
proto.writeBufferAsync = function (buffer, delay) {
	buffer			= this.mode === 'deinterleaved' ? Sink.interleave(buffer, this.channelCount) : buffer;
	var	buffers		= this.asyncBuffers;
	buffers.push({
		b: buffer,
		d: isNaN(delay) ? ~~((+new Date() - this.previousHit) / 1000 * this.sampleRate) : delay
	});
	return buffers.length;
};

/**
 * Writes a buffer synchronously to the output.
 *
 * @method Sink
 * @name writeBufferSync
 *
 * @param {Array} buffer The buffer to write.
 * @return {Number} The number of currently stored synchronous buffers.
*/
proto.writeBufferSync = function (buffer) {
	buffer			= this.mode === 'deinterleaved' ? Sink.interleave(buffer, this.channelCount) : buffer;
	var	buffers		= this.syncBuffers;
	buffers.push(buffer);
	return buffers.length;
};

/**
 * Writes a buffer, according to the write mode specified.
 *
 * @method Sink
 * @name writeBuffer
 *
 * @arg {Array} buffer The buffer to write.
 * @arg {Number} delay The delay to write after. If not specified, the Sink will calculate a delay to compensate the latency. (only applicable in asynchronous write mode)
 * @return {Number} The number of currently stored (a)synchronous buffers.
*/
proto.writeBuffer = function () {
	return this[this.writeMode === 'async' ? 'writeBufferAsync' : 'writeBufferSync'].apply(this, arguments);
};

/**
 * Gets the total amount of yet unwritten samples in the synchronous buffers.
 *
 * @method Sink
 * @name getSyncWriteOffset
 *
 * @return {Number} The total amount of yet unwritten samples in the synchronous buffers.
*/
proto.getSyncWriteOffset = function () {
	var	buffers		= this.syncBuffers,
		offset		= 0,
		i;
	for (i=0; i<buffers.length; i++) {
		offset += buffers[i].length;
	}
	return offset;
};

} (this.Sink);
void function (Sink) {

Sink.on('init', function (sink) {
	sink.activeRecordings = [];
	sink.on('postprocess', sink.recordData);
});

Sink.prototype.activeRecordings = null;

/**
 * Starts recording the sink output.
 *
 * @method Sink
 * @name record
 *
 * @return {Recording} The recording object for the recording started.
*/
Sink.prototype.record = function () {
	var recording = new Sink.Recording(this);
	this.emit('record', [recording]);
	return recording;
};
/**
 * Private method that handles the adding the buffers to all the current recordings.
 *
 * @method Sink
 * @method recordData
 *
 * @arg {Array} buffer The buffer to record.
*/
Sink.prototype.recordData = function (buffer) {
	var	activeRecs	= this.activeRecordings,
		i, l		= activeRecs.length;
	for (i=0; i<l; i++) {
		activeRecs[i].add(buffer);
	}
};

/**
 * A Recording class for recording sink output.
 *
 * @class
 * @static Sink
 * @arg {Object} bindTo The sink to bind the recording to.
*/

function Recording (bindTo) {
	this.boundTo = bindTo;
	this.buffers = [];
	bindTo.activeRecordings.push(this);
}

Recording.prototype = {
/**
 * Adds a new buffer to the recording.
 *
 * @arg {Array} buffer The buffer to add.
 *
 * @method Recording
*/
	add: function (buffer) {
		this.buffers.push(buffer);
	},
/**
 * Empties the recording.
 *
 * @method Recording
*/
	clear: function () {
		this.buffers = [];
	},
/**
 * Stops the recording and unbinds it from it's host sink.
 *
 * @method Recording
*/
	stop: function () {
		var	recordings = this.boundTo.activeRecordings,
			i;
		for (i=0; i<recordings.length; i++) {
			if (recordings[i] === this) {
				recordings.splice(i--, 1);
			}
		}
	},
/**
 * Joins the recorded buffers into a single buffer.
 *
 * @method Recording
*/
	join: function () {
		var	bufferLength	= 0,
			bufPos		= 0,
			buffers		= this.buffers,
			newArray,
			n, i, l		= buffers.length;

		for (i=0; i<l; i++) {
			bufferLength += buffers[i].length;
		}
		newArray = new Float32Array(bufferLength);
		for (i=0; i<l; i++) {
			for (n=0; n<buffers[i].length; n++) {
				newArray[bufPos + n] = buffers[i][n];
			}
			bufPos += buffers[i].length;
		}
		return newArray;
	}
};

Sink.Recording = Recording;

}(this.Sink);

/**
 * Creates an amplitude meter, outputting the amplitude value of the input.
 *
 * @processor
 *
 * @arg =!sampleRate
 * @arg =!attack
 * @arg =!decay
 *
 * @param type:UInt units:Hz default:44100 sampleRate Sample Rate the apparatus operates on.
 * @param type:Float min:0.0 max:1.0 default:0.01 attack The speed on which the amplitude metering reacts.
 * @param type:Float min:0.0 max:1.0 default:0.01 decay The speed on which the amplitude metering cools down.
*/
function Amplitude (sampleRate, attack, decay) {
	this.sampleRate		= isNaN(sampleRate) ? this.sampleRate : sampleRate;
	this.attack		= isNaN(attack) ? this.attack : attack;
	this.decay		= isNaN(decay) ? this.decay : decay;
}

Amplitude.prototype = {
	sampleRate:	44100,
	attack:		0.01,
	release:	0.01,
	/* The current output of the effect. */
	sample:		0,
/**
 * Processes a sample, moving the effect one sample further in sample-time.
 *
 * @arg {Float} sample The sample to process.
 * @arg {UInt} channel The channel on which the sample is. (Only if multi-channel)
 * @return {Float} The current output of the effect. (Only if single-channel)
*/
	pushSample: function (s) {
		this.sample = Math.abs((s > this.sample ? this.attack : this.release) * (this.sample - s) + s);
		return this.sample;
	},
/**
 * Returns the current output of the effect.
 *
 * @arg {UInt} channel The channel for which to get the sample.
 * @return {Float} The current output of the effect.
*/
	getMix: function () {
		return this.sample;
	}
};

/* Copyright (c) 2012, Jens Nockert <jens@ofmlabs.org>, Jussi Kalliokoski <jussi@ofmlabs.org>
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met: 
 * 
 * 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer. 
 * 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution. 
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
/*jshint */
/*global Float64Array */

var FFT = function () {
"use strict";

function butterfly2(output, outputOffset, outputStride, fStride, state, m) {
	var t = state.twiddle;

	for (var i = 0; i < m; i++) {
		var s0_r = output[2 * ((outputOffset) + (outputStride) * (i))], s0_i = output[2 * ((outputOffset) + (outputStride) * (i)) + 1];
		var s1_r = output[2 * ((outputOffset) + (outputStride) * (i + m))], s1_i = output[2 * ((outputOffset) + (outputStride) * (i + m)) + 1];

		var t1_r = t[2 * ((0) + (fStride) * (i))], t1_i = t[2 * ((0) + (fStride) * (i)) + 1];

		var v1_r = s1_r * t1_r - s1_i * t1_i, v1_i = s1_r * t1_i + s1_i * t1_r;

		var r0_r = s0_r + v1_r, r0_i = s0_i + v1_i;
		var r1_r = s0_r - v1_r, r1_i = s0_i - v1_i;

		output[2 * ((outputOffset) + (outputStride) * (i))] = r0_r;
		output[2 * ((outputOffset) + (outputStride) * (i)) + 1] = r0_i;
		output[2 * ((outputOffset) + (outputStride) * (i + m))] = r1_r;
		output[2 * ((outputOffset) + (outputStride) * (i + m)) + 1] = r1_i;
	}
}

function butterfly3(output, outputOffset, outputStride, fStride, state, m) {
	var t = state.twiddle;
	var m1 = m, m2 = 2 * m;
	var fStride1 = fStride, fStride2 = 2 * fStride;

	var e = t[2 * ((0) + (fStride) * (m)) + 1];

	for (var i = 0; i < m; i++) {
		var s0_r = output[2 * ((outputOffset) + (outputStride) * (i))], s0_i = output[2 * ((outputOffset) + (outputStride) * (i)) + 1];

		var s1_r = output[2 * ((outputOffset) + (outputStride) * (i + m1))], s1_i = output[2 * ((outputOffset) + (outputStride) * (i + m1)) + 1];
		var t1_r = t[2 * ((0) + (fStride1) * (i))], t1_i = t[2 * ((0) + (fStride1) * (i)) + 1];
		var v1_r = s1_r * t1_r - s1_i * t1_i, v1_i = s1_r * t1_i + s1_i * t1_r;

		var s2_r = output[2 * ((outputOffset) + (outputStride) * (i + m2))], s2_i = output[2 * ((outputOffset) + (outputStride) * (i + m2)) + 1];
		var t2_r = t[2 * ((0) + (fStride2) * (i))], t2_i = t[2 * ((0) + (fStride2) * (i)) + 1];
		var v2_r = s2_r * t2_r - s2_i * t2_i, v2_i = s2_r * t2_i + s2_i * t2_r;

		var i0_r = v1_r + v2_r, i0_i = v1_i + v2_i;

		var r0_r = s0_r + i0_r, r0_i = s0_i + i0_i;
		output[2 * ((outputOffset) + (outputStride) * (i))] = r0_r;
		output[2 * ((outputOffset) + (outputStride) * (i)) + 1] = r0_i;

		var i1_r = s0_r - i0_r * 0.5;
		var i1_i = s0_i - i0_i * 0.5;

		var i2_r = (v1_r - v2_r) * e;
		var i2_i = (v1_i - v2_i) * e;

		var r1_r = i1_r - i2_i;
		var r1_i = i1_i + i2_r;
		output[2 * ((outputOffset) + (outputStride) * (i + m1))] = r1_r;
		output[2 * ((outputOffset) + (outputStride) * (i + m1)) + 1] = r1_i;

		var r2_r = i1_r + i2_i;
		var r2_i = i1_i - i2_r;
		output[2 * ((outputOffset) + (outputStride) * (i + m2))] = r2_r;
		output[2 * ((outputOffset) + (outputStride) * (i + m2)) + 1] = r2_i;
	}
}

function butterfly4(output, outputOffset, outputStride, fStride, state, m) {
	var r1_r, r1_i, r3_r, r3_i;
	var t = state.twiddle;
	var m1 = m, m2 = 2 * m, m3 = 3 * m;
	var fStride1 = fStride, fStride2 = 2 * fStride, fStride3 = 3 * fStride;

	for (var i = 0; i < m; i++) {
		var s0_r = output[2 * ((outputOffset) + (outputStride) * (i))], s0_i = output[2 * ((outputOffset) + (outputStride) * (i)) + 1];

		var s1_r = output[2 * ((outputOffset) + (outputStride) * (i + m1))], s1_i = output[2 * ((outputOffset) + (outputStride) * (i + m1)) + 1];
		var t1_r = t[2 * ((0) + (fStride1) * (i))], t1_i = t[2 * ((0) + (fStride1) * (i)) + 1];
		var v1_r = s1_r * t1_r - s1_i * t1_i, v1_i = s1_r * t1_i + s1_i * t1_r;

		var s2_r = output[2 * ((outputOffset) + (outputStride) * (i + m2))], s2_i = output[2 * ((outputOffset) + (outputStride) * (i + m2)) + 1];
		var t2_r = t[2 * ((0) + (fStride2) * (i))], t2_i = t[2 * ((0) + (fStride2) * (i)) + 1];
		var v2_r = s2_r * t2_r - s2_i * t2_i, v2_i = s2_r * t2_i + s2_i * t2_r;

		var s3_r = output[2 * ((outputOffset) + (outputStride) * (i + m3))], s3_i = output[2 * ((outputOffset) + (outputStride) * (i + m3)) + 1];
		var t3_r = t[2 * ((0) + (fStride3) * (i))], t3_i = t[2 * ((0) + (fStride3) * (i)) + 1];
		var v3_r = s3_r * t3_r - s3_i * t3_i, v3_i = s3_r * t3_i + s3_i * t3_r;

		var i0_r = s0_r + v2_r, i0_i = s0_i + v2_i;
		var i1_r = s0_r - v2_r, i1_i = s0_i - v2_i;
		var i2_r = v1_r + v3_r, i2_i = v1_i + v3_i;
		var i3_r = v1_r - v3_r, i3_i = v1_i - v3_i;

		var r0_r = i0_r + i2_r, r0_i = i0_i + i2_i;

		if (state.inverse) {
			r1_r = i1_r - i3_i;
			r1_i = i1_i + i3_r;
		} else {
			r1_r = i1_r + i3_i;
			r1_i = i1_i - i3_r;
		}

		var r2_r = i0_r - i2_r, r2_i = i0_i - i2_i;

		if (state.inverse) {
			r3_r = i1_r + i3_i;
			r3_i = i1_i - i3_r;
		} else {
			r3_r = i1_r - i3_i;
			r3_i = i1_i + i3_r;
		}

		output[2 * ((outputOffset) + (outputStride) * (i))] = r0_r;
		output[2 * ((outputOffset) + (outputStride) * (i)) + 1] = r0_i;
		output[2 * ((outputOffset) + (outputStride) * (i + m1))] = r1_r;
		output[2 * ((outputOffset) + (outputStride) * (i + m1)) + 1] = r1_i;
		output[2 * ((outputOffset) + (outputStride) * (i + m2))] = r2_r;
		output[2 * ((outputOffset) + (outputStride) * (i + m2)) + 1] = r2_i;
		output[2 * ((outputOffset) + (outputStride) * (i + m3))] = r3_r;
		output[2 * ((outputOffset) + (outputStride) * (i + m3)) + 1] = r3_i;
	}
}

function butterfly(output, outputOffset, outputStride, fStride, state, m, p) {
	var q1, x0_r, x0_i, k;
	var t = state.twiddle, n = state.n, scratch = new Float64Array(2 * p);

	for (var u = 0; u < m; u++) {
		for (q1 = 0, k = u; q1 < p; q1++, k += m) {
			x0_r = output[2 * ((outputOffset) + (outputStride) * (k))];
			x0_i = output[2 * ((outputOffset) + (outputStride) * (k)) + 1];
			scratch[2 * (q1)] = x0_r;
			scratch[2 * (q1) + 1] = x0_i;
		}

		for (q1 = 0, k = u; q1 < p; q1++, k += m) {
			var tOffset = 0;

			x0_r = scratch[2 * (0)];
			x0_i = scratch[2 * (0) + 1];
			output[2 * ((outputOffset) + (outputStride) * (k))] = x0_r;
			output[2 * ((outputOffset) + (outputStride) * (k)) + 1] = x0_i;

			for (var q = 1; q < p; q++) {
				tOffset = (tOffset + fStride * k) % n;

				var s0_r = output[2 * ((outputOffset) + (outputStride) * (k))], s0_i = output[2 * ((outputOffset) + (outputStride) * (k)) + 1];

				var s1_r = scratch[2 * (q)], s1_i = scratch[2 * (q) + 1];
				var t1_r = t[2 * (tOffset)], t1_i = t[2 * (tOffset) + 1];
				var v1_r = s1_r * t1_r - s1_i * t1_i, v1_i = s1_r * t1_i + s1_i * t1_r;

				var r0_r = s0_r + v1_r, r0_i = s0_i + v1_i;
				output[2 * ((outputOffset) + (outputStride) * (k))] = r0_r;
				output[2 * ((outputOffset) + (outputStride) * (k)) + 1] = r0_i;
			}
		}
	}
}

function work(output, outputOffset, outputStride, f, fOffset, fStride, inputStride, factors, state) {
	var i, x0_r, x0_i;
	var p = factors.shift();
	var m = factors.shift();

	if (m == 1) {
		for (i = 0; i < p * m; i++) {
			x0_r = f[2 * ((fOffset) + (fStride * inputStride) * (i))];
			x0_i = f[2 * ((fOffset) + (fStride * inputStride) * (i)) + 1];
			output[2 * ((outputOffset) + (outputStride) * (i))] = x0_r;
			output[2 * ((outputOffset) + (outputStride) * (i)) + 1] = x0_i;
		}
	} else {
		for (i = 0; i < p; i++) {
			work(output, outputOffset + outputStride * i * m, outputStride, f, fOffset + i * fStride * inputStride, fStride * p, inputStride, factors.slice(), state);
		}
	}

	switch (p) {
		case 2: butterfly2(output, outputOffset, outputStride, fStride, state, m); break;
		case 3: butterfly3(output, outputOffset, outputStride, fStride, state, m); break;
		case 4: butterfly4(output, outputOffset, outputStride, fStride, state, m); break;
		default: butterfly(output, outputOffset, outputStride, fStride, state, m, p); break;
	}
}

var complex = function (n, inverse) {
	if (arguments.length < 2) {
		throw new RangeError("You didn't pass enough arguments, passed `" + arguments.length + "'");
	}

	n = ~~n;
	inverse = !!inverse;

	if (n < 1) {
		throw new RangeError("n is outside range, should be positive integer, was `" + n + "'");
	}

	this.inputBuffer = new Float64Array(2 * n);
	this.outputBuffer = new Float64Array(2 * n);

	var state = {
		n: n,
		inverse: inverse,

		factors: [],
		twiddle: new Float64Array(2 * n),
		scratch: new Float64Array(2 * n)
	};

	var t = state.twiddle, theta = 2 * Math.PI / n;

	var i, phase;

	for (i = 0; i < n; i++) {
		if (inverse) {
			phase =  theta * i;
		} else {
			phase = -theta * i;
		}

		t[2 * (i)] = Math.cos(phase);
		t[2 * (i) + 1] = Math.sin(phase);
	}

	var p = 4, v = Math.floor(Math.sqrt(n));

	while (n > 1) {
		while (n % p) {
			switch (p) {
				case 4: p = 2; break;
				case 2: p = 3; break;
				default: p += 2; break;
			}

			if (p > v) {
				p = n;
			}
		}

		n /= p;

		state.factors.push(p);
		state.factors.push(n);
	}

	this.state = state;

	this.resetFT();
};

complex.prototype.process = function (output, input, t) {
	this.process_explicit(output || this.outputBuffer, 0, 1, input || this.inputBuffer, 0, 1, t);
};

complex.prototype.process_explicit = function(output, outputOffset, outputStride, input, inputOffset, inputStride, t) {
	var i, x0_r, x0_i;
	outputStride = ~~outputStride;
	inputStride = ~~inputStride;

	t = t || this.inputType;
	var type = t === 'real' ? t : 'complex';

	if (outputStride < 1) {
		throw new RangeError("outputStride is outside range, should be positive integer, was `" + outputStride + "'");
	}

	if (inputStride < 1) {
		throw new RangeError("inputStride is outside range, should be positive integer, was `" + inputStride + "'");
	}

	if (type == 'real') {
		for (i = 0; i < this.state.n; i++) {
			x0_r = input[inputOffset + inputStride * i];
			x0_i = 0.0;

			this.state.scratch[2 * (i)] = x0_r;
			this.state.scratch[2 * (i) + 1] = x0_i;
		}

		work(output, outputOffset, outputStride, this.state.scratch, 0, 1, 1, this.state.factors.slice(), this.state);
	} else {
		if (input == output) {
			work(this.state.scratch, 0, 1, input, inputOffset, 1, inputStride, this.state.factors.slice(), this.state);

			for (i = 0; i < this.state.n; i++) {
				x0_r = this.state.scratch[2 * (i)];
				x0_i = this.state.scratch[2 * (i) + 1];

				output[2 * ((outputOffset) + (outputStride) * (i))] = x0_r;
				output[2 * ((outputOffset) + (outputStride) * (i)) + 1] = x0_i;
			}
		} else {
			work(output, outputOffset, outputStride, input, inputOffset, 1, inputStride, this.state.factors.slice(), this.state);
		}
	}
};

complex.prototype.__super = complex;

/**
 * A Fast Fourier Transform module.
 *
 * @name FFT
 * @processor
 *
 * @arg =!sampleRate
 * @arg =!bufferSize
 *
 * @param type:UInt units:Hz default:44100 sampleRate Sample Rate the apparatus operates on.
 * @param type:UInt default:4096 bufferSize The buffer size of the FFT.
 * @param type:String min:0.0 default:forward method The direction to do the FFT to.
*/
function FFT (sampleRate, n, inverse) {
	var args = [].slice.call(arguments);
	args[0] = this.sampleRate = isNaN(sampleRate) || sampleRate === null ? this.sampleRate : sampleRate;
	args[1] = this.bufferSize = isNaN(n) || n === null ? this.bufferSize : n;
	args[2] = !!inverse;

	this.__super.apply(this, args.slice(1));
}

FFT.prototype = complex.prototype;
FFT.prototype.inputType = 'real';
FFT.prototype.sampleRate = 44100;
FFT.prototype.bufferSize = 4096;

FFT.prototype.resetFT = function (s) {
	this.inputBuffer = new Float64Array(2 * this.bufferSize);
	this.outputBuffer = new Float64Array(2 * this.bufferSize);
	this.spectrum = new Float64Array(this.bufferSize / 2);

	this.bandWidth = this.sampleRate / this.bufferSize / 2;
	this.peakBand = 0;
	this.peak = 0;

	this.sample = 0;
	this.offset = 0;
	this.maxOffset = this.inputType === 'real' ? this.bufferSize : this.bufferSize * 2;

	this.pushSample = this._pushSample;
};

FFT.prototype.pushSample = function (s) {
	this.resetFT();

	return this.pushSample(s);
};

FFT.prototype._pushSample = function (s) {
	this.inputBuffer[this.offset] = s;
	this.sample = s;

	this.offset = (this.offset + 1) % this.maxOffset;
	if (!this.offset) this.process();

	return s;
};

FFT.prototype.getMix = function () {
	return this.sample;
};

/**
 * Gets the frequency of a specified band.
 *
 * @name getBandFrequency
 * @method FFT
 *
 * @param {Number} index The index of the band.
 * @return {Number} The frequency.
*/

FFT.prototype.getBandFrequency = function (index) {
	return this.bandWidth * index + this.bandWidth * 0.5;
};

/**
 * Calculate the spectrum for the FFT buffer.
 *
 * @name calculateSpectrum
 * @method FFT
*/
FFT.prototype.calculateSpectrum = function () {
	var i, n, rr, ii, mag;
	var spectrum = this.spectrum;
	var buffer = this.outputBuffer;
	var bSi = 2 / this.bufferSize;
	var l = this.bufferSize / 2;

	for (i=0, n=2; i<l; i++, n+=2) {
		rr = buffer[n + 0];
		ii = buffer[n + 1];
		mag = bSi * Math.sqrt(rr * rr + ii * ii);

		if (mag > this.peak) {
			this.peakBand = i;
			this.peak = mag;
		}

		this.spectrum[i] = mag;
	}
};

FFT.prototype._process = FFT.prototype.process;
FFT.prototype.process = function () {
	this._process.apply(this, arguments);
	this.calculateSpectrum();
};

return FFT;

}();
/*
	wrapper-end.js
	Please note that this file is of invalid syntax if standalone.
*/

/* Controls */
audioLib.ADSREnvelope	= ADSREnvelope;
audioLib.StepSequencer	= StepSequencer;
audioLib.UIControl	= UIControl;

/* Effects */
audioLib.BiquadFilter	= BiquadFilter;
audioLib.BitCrusher	= BitCrusher;
audioLib.Chorus		= Chorus;
audioLib.CombFilter	= CombFilter;
audioLib.Compressor	= Compressor;
audioLib.Convolution	= Convolution;
audioLib.Delay		= Delay;
audioLib.Distortion	= Distortion;
audioLib.GainController	= GainController;
audioLib.IIRFilter	= IIRFilter;
audioLib.LP12Filter	= LP12Filter;
audioLib.Limiter	= Limiter;
audioLib.Reverb		= Freeverb;

/* Geneneration */
audioLib.Noise		= Noise;
audioLib.Oscillator	= Oscillator;
audioLib.Sampler	= Sampler;

/* Processing */
audioLib.Amplitude	= Amplitude;
audioLib.FFT		= FFT;

/* Miscellaneous */

/* FIXME: The should be templated somehow as well */
audioLib.AudioDevice			= audioLib.Sink = (function () { return this; } () ).Sink;
audioLib.Automation			= Automation;
audioLib.BufferEffect			= BufferEffect;
audioLib.EffectClass			= EffectClass;
audioLib.GeneratorClass			= GeneratorClass;
audioLib.codecs				= audioLib.Codec = Codec;
audioLib.plugins			= Plugin;

/* Trigger the ready event (all is registered) */

while (onready.list.length) {
	onready.list.shift().call(audioLib);
}
onready = null;

/* Handle inheritance */

void function (names, i) {
	function effects (name, effect, prototype, argNames) {
		var proto, k;

		if (effect) {
			prototype = prototype || effect.prototype;
			proto = effect.prototype = new EffectClass();
			proto.name = proto.fxid = name;

			effects[name] = __class(name, effect, argNames);

			for (k in prototype) {
				if (prototype.hasOwnProperty(k)){
					proto[k] = prototype[k];
				}
			}

			for (k in EffectClass) {
				if (k !== 'prototype' && EffectClass.hasOwnProperty(k)) {
					effects[name][k] = EffectClass[k];
				}
			}
		}

		return effects[name];
	}



	audioLib.effects = effects;

	for (i=0; i<names.length; i++) {
		audioLib[names[i]] = effects(names[i], audioLib[names[i]], audioLib[names[i]].prototype);
	}

	effects('BiquadAllPassFilter',	BiquadFilter.AllPass);
	effects('BiquadBandPassFilter',	BiquadFilter.BandPass);
	effects('BiquadHighPassFilter',	BiquadFilter.HighPass);
	effects('BiquadLowPassFilter',	BiquadFilter.LowPass);
	effects('FreeverbAllPassFilter',Freeverb.AllPassFilter);
}(['BiquadFilter', 'BitCrusher', 'Chorus', 'CombFilter', 'Compressor', 'Convolution', 'Delay', 'Distortion', 'GainController', 'IIRFilter', 'LP12Filter', 'Limiter', 'Reverb', 'Amplitude', 'FFT']);

void function (names, i) {
	function generators (name, effect, prototype, argNames) {
		var proto, k;

		if (effect) {
			prototype = prototype || effect.prototype;
			proto = effect.prototype = new GeneratorClass();

			proto.name = proto.fxid = name;
			generators[name] = __class(name, effect, argNames);

			for (k in prototype) {
				if (prototype.hasOwnProperty(k)) {
					proto[k] = prototype[k];
				}
			}

			for (k in GeneratorClass) {
				if (k !== 'prototype' && GeneratorClass.hasOwnProperty(k)) {
					generators[name][k] = GeneratorClass[k];
				}
			}
		}
		return generators[name];
	}

	audioLib.generators = generators;

	for (i=0; i<names.length; i++) {
		audioLib[names[i]] = generators(names[i], audioLib[names[i]], audioLib[names[i]].prototype);
	}
}(['Noise', 'Oscillator', 'Sampler', 'ADSREnvelope', 'StepSequencer', 'UIControl']);

/* FIXME: Make this happen based on the features we have */
Codec('wav', audioLib.PCMData);

audioLib.version = '0.6.6';

return audioLib;
}).call(typeof exports === 'undefined' ? {} : this, this.window || global, Math, Object, Array);

/*! jQuery v2.1.1 | (c) 2005, 2014 jQuery Foundation, Inc. | jquery.org/license */
!function(a,b){"object"==typeof module&&"object"==typeof module.exports?module.exports=a.document?b(a,!0):function(a){if(!a.document)throw new Error("jQuery requires a window with a document");return b(a)}:b(a)}("undefined"!=typeof window?window:this,function(a,b){var c=[],d=c.slice,e=c.concat,f=c.push,g=c.indexOf,h={},i=h.toString,j=h.hasOwnProperty,k={},l=a.document,m="2.1.1",n=function(a,b){return new n.fn.init(a,b)},o=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,p=/^-ms-/,q=/-([\da-z])/gi,r=function(a,b){return b.toUpperCase()};n.fn=n.prototype={jquery:m,constructor:n,selector:"",length:0,toArray:function(){return d.call(this)},get:function(a){return null!=a?0>a?this[a+this.length]:this[a]:d.call(this)},pushStack:function(a){var b=n.merge(this.constructor(),a);return b.prevObject=this,b.context=this.context,b},each:function(a,b){return n.each(this,a,b)},map:function(a){return this.pushStack(n.map(this,function(b,c){return a.call(b,c,b)}))},slice:function(){return this.pushStack(d.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(a){var b=this.length,c=+a+(0>a?b:0);return this.pushStack(c>=0&&b>c?[this[c]]:[])},end:function(){return this.prevObject||this.constructor(null)},push:f,sort:c.sort,splice:c.splice},n.extend=n.fn.extend=function(){var a,b,c,d,e,f,g=arguments[0]||{},h=1,i=arguments.length,j=!1;for("boolean"==typeof g&&(j=g,g=arguments[h]||{},h++),"object"==typeof g||n.isFunction(g)||(g={}),h===i&&(g=this,h--);i>h;h++)if(null!=(a=arguments[h]))for(b in a)c=g[b],d=a[b],g!==d&&(j&&d&&(n.isPlainObject(d)||(e=n.isArray(d)))?(e?(e=!1,f=c&&n.isArray(c)?c:[]):f=c&&n.isPlainObject(c)?c:{},g[b]=n.extend(j,f,d)):void 0!==d&&(g[b]=d));return g},n.extend({expando:"jQuery"+(m+Math.random()).replace(/\D/g,""),isReady:!0,error:function(a){throw new Error(a)},noop:function(){},isFunction:function(a){return"function"===n.type(a)},isArray:Array.isArray,isWindow:function(a){return null!=a&&a===a.window},isNumeric:function(a){return!n.isArray(a)&&a-parseFloat(a)>=0},isPlainObject:function(a){return"object"!==n.type(a)||a.nodeType||n.isWindow(a)?!1:a.constructor&&!j.call(a.constructor.prototype,"isPrototypeOf")?!1:!0},isEmptyObject:function(a){var b;for(b in a)return!1;return!0},type:function(a){return null==a?a+"":"object"==typeof a||"function"==typeof a?h[i.call(a)]||"object":typeof a},globalEval:function(a){var b,c=eval;a=n.trim(a),a&&(1===a.indexOf("use strict")?(b=l.createElement("script"),b.text=a,l.head.appendChild(b).parentNode.removeChild(b)):c(a))},camelCase:function(a){return a.replace(p,"ms-").replace(q,r)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toLowerCase()===b.toLowerCase()},each:function(a,b,c){var d,e=0,f=a.length,g=s(a);if(c){if(g){for(;f>e;e++)if(d=b.apply(a[e],c),d===!1)break}else for(e in a)if(d=b.apply(a[e],c),d===!1)break}else if(g){for(;f>e;e++)if(d=b.call(a[e],e,a[e]),d===!1)break}else for(e in a)if(d=b.call(a[e],e,a[e]),d===!1)break;return a},trim:function(a){return null==a?"":(a+"").replace(o,"")},makeArray:function(a,b){var c=b||[];return null!=a&&(s(Object(a))?n.merge(c,"string"==typeof a?[a]:a):f.call(c,a)),c},inArray:function(a,b,c){return null==b?-1:g.call(b,a,c)},merge:function(a,b){for(var c=+b.length,d=0,e=a.length;c>d;d++)a[e++]=b[d];return a.length=e,a},grep:function(a,b,c){for(var d,e=[],f=0,g=a.length,h=!c;g>f;f++)d=!b(a[f],f),d!==h&&e.push(a[f]);return e},map:function(a,b,c){var d,f=0,g=a.length,h=s(a),i=[];if(h)for(;g>f;f++)d=b(a[f],f,c),null!=d&&i.push(d);else for(f in a)d=b(a[f],f,c),null!=d&&i.push(d);return e.apply([],i)},guid:1,proxy:function(a,b){var c,e,f;return"string"==typeof b&&(c=a[b],b=a,a=c),n.isFunction(a)?(e=d.call(arguments,2),f=function(){return a.apply(b||this,e.concat(d.call(arguments)))},f.guid=a.guid=a.guid||n.guid++,f):void 0},now:Date.now,support:k}),n.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(a,b){h["[object "+b+"]"]=b.toLowerCase()});function s(a){var b=a.length,c=n.type(a);return"function"===c||n.isWindow(a)?!1:1===a.nodeType&&b?!0:"array"===c||0===b||"number"==typeof b&&b>0&&b-1 in a}var t=function(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u="sizzle"+-new Date,v=a.document,w=0,x=0,y=gb(),z=gb(),A=gb(),B=function(a,b){return a===b&&(l=!0),0},C="undefined",D=1<<31,E={}.hasOwnProperty,F=[],G=F.pop,H=F.push,I=F.push,J=F.slice,K=F.indexOf||function(a){for(var b=0,c=this.length;c>b;b++)if(this[b]===a)return b;return-1},L="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",M="[\\x20\\t\\r\\n\\f]",N="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",O=N.replace("w","w#"),P="\\["+M+"*("+N+")(?:"+M+"*([*^$|!~]?=)"+M+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+O+"))|)"+M+"*\\]",Q=":("+N+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+P+")*)|.*)\\)|)",R=new RegExp("^"+M+"+|((?:^|[^\\\\])(?:\\\\.)*)"+M+"+$","g"),S=new RegExp("^"+M+"*,"+M+"*"),T=new RegExp("^"+M+"*([>+~]|"+M+")"+M+"*"),U=new RegExp("="+M+"*([^\\]'\"]*?)"+M+"*\\]","g"),V=new RegExp(Q),W=new RegExp("^"+O+"$"),X={ID:new RegExp("^#("+N+")"),CLASS:new RegExp("^\\.("+N+")"),TAG:new RegExp("^("+N.replace("w","w*")+")"),ATTR:new RegExp("^"+P),PSEUDO:new RegExp("^"+Q),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+M+"*(even|odd|(([+-]|)(\\d*)n|)"+M+"*(?:([+-]|)"+M+"*(\\d+)|))"+M+"*\\)|)","i"),bool:new RegExp("^(?:"+L+")$","i"),needsContext:new RegExp("^"+M+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+M+"*((?:-\\d)?\\d*)"+M+"*\\)|)(?=[^-]|$)","i")},Y=/^(?:input|select|textarea|button)$/i,Z=/^h\d$/i,$=/^[^{]+\{\s*\[native \w/,_=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,ab=/[+~]/,bb=/'|\\/g,cb=new RegExp("\\\\([\\da-f]{1,6}"+M+"?|("+M+")|.)","ig"),db=function(a,b,c){var d="0x"+b-65536;return d!==d||c?b:0>d?String.fromCharCode(d+65536):String.fromCharCode(d>>10|55296,1023&d|56320)};try{I.apply(F=J.call(v.childNodes),v.childNodes),F[v.childNodes.length].nodeType}catch(eb){I={apply:F.length?function(a,b){H.apply(a,J.call(b))}:function(a,b){var c=a.length,d=0;while(a[c++]=b[d++]);a.length=c-1}}}function fb(a,b,d,e){var f,h,j,k,l,o,r,s,w,x;if((b?b.ownerDocument||b:v)!==n&&m(b),b=b||n,d=d||[],!a||"string"!=typeof a)return d;if(1!==(k=b.nodeType)&&9!==k)return[];if(p&&!e){if(f=_.exec(a))if(j=f[1]){if(9===k){if(h=b.getElementById(j),!h||!h.parentNode)return d;if(h.id===j)return d.push(h),d}else if(b.ownerDocument&&(h=b.ownerDocument.getElementById(j))&&t(b,h)&&h.id===j)return d.push(h),d}else{if(f[2])return I.apply(d,b.getElementsByTagName(a)),d;if((j=f[3])&&c.getElementsByClassName&&b.getElementsByClassName)return I.apply(d,b.getElementsByClassName(j)),d}if(c.qsa&&(!q||!q.test(a))){if(s=r=u,w=b,x=9===k&&a,1===k&&"object"!==b.nodeName.toLowerCase()){o=g(a),(r=b.getAttribute("id"))?s=r.replace(bb,"\\$&"):b.setAttribute("id",s),s="[id='"+s+"'] ",l=o.length;while(l--)o[l]=s+qb(o[l]);w=ab.test(a)&&ob(b.parentNode)||b,x=o.join(",")}if(x)try{return I.apply(d,w.querySelectorAll(x)),d}catch(y){}finally{r||b.removeAttribute("id")}}}return i(a.replace(R,"$1"),b,d,e)}function gb(){var a=[];function b(c,e){return a.push(c+" ")>d.cacheLength&&delete b[a.shift()],b[c+" "]=e}return b}function hb(a){return a[u]=!0,a}function ib(a){var b=n.createElement("div");try{return!!a(b)}catch(c){return!1}finally{b.parentNode&&b.parentNode.removeChild(b),b=null}}function jb(a,b){var c=a.split("|"),e=a.length;while(e--)d.attrHandle[c[e]]=b}function kb(a,b){var c=b&&a,d=c&&1===a.nodeType&&1===b.nodeType&&(~b.sourceIndex||D)-(~a.sourceIndex||D);if(d)return d;if(c)while(c=c.nextSibling)if(c===b)return-1;return a?1:-1}function lb(a){return function(b){var c=b.nodeName.toLowerCase();return"input"===c&&b.type===a}}function mb(a){return function(b){var c=b.nodeName.toLowerCase();return("input"===c||"button"===c)&&b.type===a}}function nb(a){return hb(function(b){return b=+b,hb(function(c,d){var e,f=a([],c.length,b),g=f.length;while(g--)c[e=f[g]]&&(c[e]=!(d[e]=c[e]))})})}function ob(a){return a&&typeof a.getElementsByTagName!==C&&a}c=fb.support={},f=fb.isXML=function(a){var b=a&&(a.ownerDocument||a).documentElement;return b?"HTML"!==b.nodeName:!1},m=fb.setDocument=function(a){var b,e=a?a.ownerDocument||a:v,g=e.defaultView;return e!==n&&9===e.nodeType&&e.documentElement?(n=e,o=e.documentElement,p=!f(e),g&&g!==g.top&&(g.addEventListener?g.addEventListener("unload",function(){m()},!1):g.attachEvent&&g.attachEvent("onunload",function(){m()})),c.attributes=ib(function(a){return a.className="i",!a.getAttribute("className")}),c.getElementsByTagName=ib(function(a){return a.appendChild(e.createComment("")),!a.getElementsByTagName("*").length}),c.getElementsByClassName=$.test(e.getElementsByClassName)&&ib(function(a){return a.innerHTML="<div class='a'></div><div class='a i'></div>",a.firstChild.className="i",2===a.getElementsByClassName("i").length}),c.getById=ib(function(a){return o.appendChild(a).id=u,!e.getElementsByName||!e.getElementsByName(u).length}),c.getById?(d.find.ID=function(a,b){if(typeof b.getElementById!==C&&p){var c=b.getElementById(a);return c&&c.parentNode?[c]:[]}},d.filter.ID=function(a){var b=a.replace(cb,db);return function(a){return a.getAttribute("id")===b}}):(delete d.find.ID,d.filter.ID=function(a){var b=a.replace(cb,db);return function(a){var c=typeof a.getAttributeNode!==C&&a.getAttributeNode("id");return c&&c.value===b}}),d.find.TAG=c.getElementsByTagName?function(a,b){return typeof b.getElementsByTagName!==C?b.getElementsByTagName(a):void 0}:function(a,b){var c,d=[],e=0,f=b.getElementsByTagName(a);if("*"===a){while(c=f[e++])1===c.nodeType&&d.push(c);return d}return f},d.find.CLASS=c.getElementsByClassName&&function(a,b){return typeof b.getElementsByClassName!==C&&p?b.getElementsByClassName(a):void 0},r=[],q=[],(c.qsa=$.test(e.querySelectorAll))&&(ib(function(a){a.innerHTML="<select msallowclip=''><option selected=''></option></select>",a.querySelectorAll("[msallowclip^='']").length&&q.push("[*^$]="+M+"*(?:''|\"\")"),a.querySelectorAll("[selected]").length||q.push("\\["+M+"*(?:value|"+L+")"),a.querySelectorAll(":checked").length||q.push(":checked")}),ib(function(a){var b=e.createElement("input");b.setAttribute("type","hidden"),a.appendChild(b).setAttribute("name","D"),a.querySelectorAll("[name=d]").length&&q.push("name"+M+"*[*^$|!~]?="),a.querySelectorAll(":enabled").length||q.push(":enabled",":disabled"),a.querySelectorAll("*,:x"),q.push(",.*:")})),(c.matchesSelector=$.test(s=o.matches||o.webkitMatchesSelector||o.mozMatchesSelector||o.oMatchesSelector||o.msMatchesSelector))&&ib(function(a){c.disconnectedMatch=s.call(a,"div"),s.call(a,"[s!='']:x"),r.push("!=",Q)}),q=q.length&&new RegExp(q.join("|")),r=r.length&&new RegExp(r.join("|")),b=$.test(o.compareDocumentPosition),t=b||$.test(o.contains)?function(a,b){var c=9===a.nodeType?a.documentElement:a,d=b&&b.parentNode;return a===d||!(!d||1!==d.nodeType||!(c.contains?c.contains(d):a.compareDocumentPosition&&16&a.compareDocumentPosition(d)))}:function(a,b){if(b)while(b=b.parentNode)if(b===a)return!0;return!1},B=b?function(a,b){if(a===b)return l=!0,0;var d=!a.compareDocumentPosition-!b.compareDocumentPosition;return d?d:(d=(a.ownerDocument||a)===(b.ownerDocument||b)?a.compareDocumentPosition(b):1,1&d||!c.sortDetached&&b.compareDocumentPosition(a)===d?a===e||a.ownerDocument===v&&t(v,a)?-1:b===e||b.ownerDocument===v&&t(v,b)?1:k?K.call(k,a)-K.call(k,b):0:4&d?-1:1)}:function(a,b){if(a===b)return l=!0,0;var c,d=0,f=a.parentNode,g=b.parentNode,h=[a],i=[b];if(!f||!g)return a===e?-1:b===e?1:f?-1:g?1:k?K.call(k,a)-K.call(k,b):0;if(f===g)return kb(a,b);c=a;while(c=c.parentNode)h.unshift(c);c=b;while(c=c.parentNode)i.unshift(c);while(h[d]===i[d])d++;return d?kb(h[d],i[d]):h[d]===v?-1:i[d]===v?1:0},e):n},fb.matches=function(a,b){return fb(a,null,null,b)},fb.matchesSelector=function(a,b){if((a.ownerDocument||a)!==n&&m(a),b=b.replace(U,"='$1']"),!(!c.matchesSelector||!p||r&&r.test(b)||q&&q.test(b)))try{var d=s.call(a,b);if(d||c.disconnectedMatch||a.document&&11!==a.document.nodeType)return d}catch(e){}return fb(b,n,null,[a]).length>0},fb.contains=function(a,b){return(a.ownerDocument||a)!==n&&m(a),t(a,b)},fb.attr=function(a,b){(a.ownerDocument||a)!==n&&m(a);var e=d.attrHandle[b.toLowerCase()],f=e&&E.call(d.attrHandle,b.toLowerCase())?e(a,b,!p):void 0;return void 0!==f?f:c.attributes||!p?a.getAttribute(b):(f=a.getAttributeNode(b))&&f.specified?f.value:null},fb.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)},fb.uniqueSort=function(a){var b,d=[],e=0,f=0;if(l=!c.detectDuplicates,k=!c.sortStable&&a.slice(0),a.sort(B),l){while(b=a[f++])b===a[f]&&(e=d.push(f));while(e--)a.splice(d[e],1)}return k=null,a},e=fb.getText=function(a){var b,c="",d=0,f=a.nodeType;if(f){if(1===f||9===f||11===f){if("string"==typeof a.textContent)return a.textContent;for(a=a.firstChild;a;a=a.nextSibling)c+=e(a)}else if(3===f||4===f)return a.nodeValue}else while(b=a[d++])c+=e(b);return c},d=fb.selectors={cacheLength:50,createPseudo:hb,match:X,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(a){return a[1]=a[1].replace(cb,db),a[3]=(a[3]||a[4]||a[5]||"").replace(cb,db),"~="===a[2]&&(a[3]=" "+a[3]+" "),a.slice(0,4)},CHILD:function(a){return a[1]=a[1].toLowerCase(),"nth"===a[1].slice(0,3)?(a[3]||fb.error(a[0]),a[4]=+(a[4]?a[5]+(a[6]||1):2*("even"===a[3]||"odd"===a[3])),a[5]=+(a[7]+a[8]||"odd"===a[3])):a[3]&&fb.error(a[0]),a},PSEUDO:function(a){var b,c=!a[6]&&a[2];return X.CHILD.test(a[0])?null:(a[3]?a[2]=a[4]||a[5]||"":c&&V.test(c)&&(b=g(c,!0))&&(b=c.indexOf(")",c.length-b)-c.length)&&(a[0]=a[0].slice(0,b),a[2]=c.slice(0,b)),a.slice(0,3))}},filter:{TAG:function(a){var b=a.replace(cb,db).toLowerCase();return"*"===a?function(){return!0}:function(a){return a.nodeName&&a.nodeName.toLowerCase()===b}},CLASS:function(a){var b=y[a+" "];return b||(b=new RegExp("(^|"+M+")"+a+"("+M+"|$)"))&&y(a,function(a){return b.test("string"==typeof a.className&&a.className||typeof a.getAttribute!==C&&a.getAttribute("class")||"")})},ATTR:function(a,b,c){return function(d){var e=fb.attr(d,a);return null==e?"!="===b:b?(e+="","="===b?e===c:"!="===b?e!==c:"^="===b?c&&0===e.indexOf(c):"*="===b?c&&e.indexOf(c)>-1:"$="===b?c&&e.slice(-c.length)===c:"~="===b?(" "+e+" ").indexOf(c)>-1:"|="===b?e===c||e.slice(0,c.length+1)===c+"-":!1):!0}},CHILD:function(a,b,c,d,e){var f="nth"!==a.slice(0,3),g="last"!==a.slice(-4),h="of-type"===b;return 1===d&&0===e?function(a){return!!a.parentNode}:function(b,c,i){var j,k,l,m,n,o,p=f!==g?"nextSibling":"previousSibling",q=b.parentNode,r=h&&b.nodeName.toLowerCase(),s=!i&&!h;if(q){if(f){while(p){l=b;while(l=l[p])if(h?l.nodeName.toLowerCase()===r:1===l.nodeType)return!1;o=p="only"===a&&!o&&"nextSibling"}return!0}if(o=[g?q.firstChild:q.lastChild],g&&s){k=q[u]||(q[u]={}),j=k[a]||[],n=j[0]===w&&j[1],m=j[0]===w&&j[2],l=n&&q.childNodes[n];while(l=++n&&l&&l[p]||(m=n=0)||o.pop())if(1===l.nodeType&&++m&&l===b){k[a]=[w,n,m];break}}else if(s&&(j=(b[u]||(b[u]={}))[a])&&j[0]===w)m=j[1];else while(l=++n&&l&&l[p]||(m=n=0)||o.pop())if((h?l.nodeName.toLowerCase()===r:1===l.nodeType)&&++m&&(s&&((l[u]||(l[u]={}))[a]=[w,m]),l===b))break;return m-=e,m===d||m%d===0&&m/d>=0}}},PSEUDO:function(a,b){var c,e=d.pseudos[a]||d.setFilters[a.toLowerCase()]||fb.error("unsupported pseudo: "+a);return e[u]?e(b):e.length>1?(c=[a,a,"",b],d.setFilters.hasOwnProperty(a.toLowerCase())?hb(function(a,c){var d,f=e(a,b),g=f.length;while(g--)d=K.call(a,f[g]),a[d]=!(c[d]=f[g])}):function(a){return e(a,0,c)}):e}},pseudos:{not:hb(function(a){var b=[],c=[],d=h(a.replace(R,"$1"));return d[u]?hb(function(a,b,c,e){var f,g=d(a,null,e,[]),h=a.length;while(h--)(f=g[h])&&(a[h]=!(b[h]=f))}):function(a,e,f){return b[0]=a,d(b,null,f,c),!c.pop()}}),has:hb(function(a){return function(b){return fb(a,b).length>0}}),contains:hb(function(a){return function(b){return(b.textContent||b.innerText||e(b)).indexOf(a)>-1}}),lang:hb(function(a){return W.test(a||"")||fb.error("unsupported lang: "+a),a=a.replace(cb,db).toLowerCase(),function(b){var c;do if(c=p?b.lang:b.getAttribute("xml:lang")||b.getAttribute("lang"))return c=c.toLowerCase(),c===a||0===c.indexOf(a+"-");while((b=b.parentNode)&&1===b.nodeType);return!1}}),target:function(b){var c=a.location&&a.location.hash;return c&&c.slice(1)===b.id},root:function(a){return a===o},focus:function(a){return a===n.activeElement&&(!n.hasFocus||n.hasFocus())&&!!(a.type||a.href||~a.tabIndex)},enabled:function(a){return a.disabled===!1},disabled:function(a){return a.disabled===!0},checked:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&!!a.checked||"option"===b&&!!a.selected},selected:function(a){return a.parentNode&&a.parentNode.selectedIndex,a.selected===!0},empty:function(a){for(a=a.firstChild;a;a=a.nextSibling)if(a.nodeType<6)return!1;return!0},parent:function(a){return!d.pseudos.empty(a)},header:function(a){return Z.test(a.nodeName)},input:function(a){return Y.test(a.nodeName)},button:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&"button"===a.type||"button"===b},text:function(a){var b;return"input"===a.nodeName.toLowerCase()&&"text"===a.type&&(null==(b=a.getAttribute("type"))||"text"===b.toLowerCase())},first:nb(function(){return[0]}),last:nb(function(a,b){return[b-1]}),eq:nb(function(a,b,c){return[0>c?c+b:c]}),even:nb(function(a,b){for(var c=0;b>c;c+=2)a.push(c);return a}),odd:nb(function(a,b){for(var c=1;b>c;c+=2)a.push(c);return a}),lt:nb(function(a,b,c){for(var d=0>c?c+b:c;--d>=0;)a.push(d);return a}),gt:nb(function(a,b,c){for(var d=0>c?c+b:c;++d<b;)a.push(d);return a})}},d.pseudos.nth=d.pseudos.eq;for(b in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})d.pseudos[b]=lb(b);for(b in{submit:!0,reset:!0})d.pseudos[b]=mb(b);function pb(){}pb.prototype=d.filters=d.pseudos,d.setFilters=new pb,g=fb.tokenize=function(a,b){var c,e,f,g,h,i,j,k=z[a+" "];if(k)return b?0:k.slice(0);h=a,i=[],j=d.preFilter;while(h){(!c||(e=S.exec(h)))&&(e&&(h=h.slice(e[0].length)||h),i.push(f=[])),c=!1,(e=T.exec(h))&&(c=e.shift(),f.push({value:c,type:e[0].replace(R," ")}),h=h.slice(c.length));for(g in d.filter)!(e=X[g].exec(h))||j[g]&&!(e=j[g](e))||(c=e.shift(),f.push({value:c,type:g,matches:e}),h=h.slice(c.length));if(!c)break}return b?h.length:h?fb.error(a):z(a,i).slice(0)};function qb(a){for(var b=0,c=a.length,d="";c>b;b++)d+=a[b].value;return d}function rb(a,b,c){var d=b.dir,e=c&&"parentNode"===d,f=x++;return b.first?function(b,c,f){while(b=b[d])if(1===b.nodeType||e)return a(b,c,f)}:function(b,c,g){var h,i,j=[w,f];if(g){while(b=b[d])if((1===b.nodeType||e)&&a(b,c,g))return!0}else while(b=b[d])if(1===b.nodeType||e){if(i=b[u]||(b[u]={}),(h=i[d])&&h[0]===w&&h[1]===f)return j[2]=h[2];if(i[d]=j,j[2]=a(b,c,g))return!0}}}function sb(a){return a.length>1?function(b,c,d){var e=a.length;while(e--)if(!a[e](b,c,d))return!1;return!0}:a[0]}function tb(a,b,c){for(var d=0,e=b.length;e>d;d++)fb(a,b[d],c);return c}function ub(a,b,c,d,e){for(var f,g=[],h=0,i=a.length,j=null!=b;i>h;h++)(f=a[h])&&(!c||c(f,d,e))&&(g.push(f),j&&b.push(h));return g}function vb(a,b,c,d,e,f){return d&&!d[u]&&(d=vb(d)),e&&!e[u]&&(e=vb(e,f)),hb(function(f,g,h,i){var j,k,l,m=[],n=[],o=g.length,p=f||tb(b||"*",h.nodeType?[h]:h,[]),q=!a||!f&&b?p:ub(p,m,a,h,i),r=c?e||(f?a:o||d)?[]:g:q;if(c&&c(q,r,h,i),d){j=ub(r,n),d(j,[],h,i),k=j.length;while(k--)(l=j[k])&&(r[n[k]]=!(q[n[k]]=l))}if(f){if(e||a){if(e){j=[],k=r.length;while(k--)(l=r[k])&&j.push(q[k]=l);e(null,r=[],j,i)}k=r.length;while(k--)(l=r[k])&&(j=e?K.call(f,l):m[k])>-1&&(f[j]=!(g[j]=l))}}else r=ub(r===g?r.splice(o,r.length):r),e?e(null,g,r,i):I.apply(g,r)})}function wb(a){for(var b,c,e,f=a.length,g=d.relative[a[0].type],h=g||d.relative[" "],i=g?1:0,k=rb(function(a){return a===b},h,!0),l=rb(function(a){return K.call(b,a)>-1},h,!0),m=[function(a,c,d){return!g&&(d||c!==j)||((b=c).nodeType?k(a,c,d):l(a,c,d))}];f>i;i++)if(c=d.relative[a[i].type])m=[rb(sb(m),c)];else{if(c=d.filter[a[i].type].apply(null,a[i].matches),c[u]){for(e=++i;f>e;e++)if(d.relative[a[e].type])break;return vb(i>1&&sb(m),i>1&&qb(a.slice(0,i-1).concat({value:" "===a[i-2].type?"*":""})).replace(R,"$1"),c,e>i&&wb(a.slice(i,e)),f>e&&wb(a=a.slice(e)),f>e&&qb(a))}m.push(c)}return sb(m)}function xb(a,b){var c=b.length>0,e=a.length>0,f=function(f,g,h,i,k){var l,m,o,p=0,q="0",r=f&&[],s=[],t=j,u=f||e&&d.find.TAG("*",k),v=w+=null==t?1:Math.random()||.1,x=u.length;for(k&&(j=g!==n&&g);q!==x&&null!=(l=u[q]);q++){if(e&&l){m=0;while(o=a[m++])if(o(l,g,h)){i.push(l);break}k&&(w=v)}c&&((l=!o&&l)&&p--,f&&r.push(l))}if(p+=q,c&&q!==p){m=0;while(o=b[m++])o(r,s,g,h);if(f){if(p>0)while(q--)r[q]||s[q]||(s[q]=G.call(i));s=ub(s)}I.apply(i,s),k&&!f&&s.length>0&&p+b.length>1&&fb.uniqueSort(i)}return k&&(w=v,j=t),r};return c?hb(f):f}return h=fb.compile=function(a,b){var c,d=[],e=[],f=A[a+" "];if(!f){b||(b=g(a)),c=b.length;while(c--)f=wb(b[c]),f[u]?d.push(f):e.push(f);f=A(a,xb(e,d)),f.selector=a}return f},i=fb.select=function(a,b,e,f){var i,j,k,l,m,n="function"==typeof a&&a,o=!f&&g(a=n.selector||a);if(e=e||[],1===o.length){if(j=o[0]=o[0].slice(0),j.length>2&&"ID"===(k=j[0]).type&&c.getById&&9===b.nodeType&&p&&d.relative[j[1].type]){if(b=(d.find.ID(k.matches[0].replace(cb,db),b)||[])[0],!b)return e;n&&(b=b.parentNode),a=a.slice(j.shift().value.length)}i=X.needsContext.test(a)?0:j.length;while(i--){if(k=j[i],d.relative[l=k.type])break;if((m=d.find[l])&&(f=m(k.matches[0].replace(cb,db),ab.test(j[0].type)&&ob(b.parentNode)||b))){if(j.splice(i,1),a=f.length&&qb(j),!a)return I.apply(e,f),e;break}}}return(n||h(a,o))(f,b,!p,e,ab.test(a)&&ob(b.parentNode)||b),e},c.sortStable=u.split("").sort(B).join("")===u,c.detectDuplicates=!!l,m(),c.sortDetached=ib(function(a){return 1&a.compareDocumentPosition(n.createElement("div"))}),ib(function(a){return a.innerHTML="<a href='#'></a>","#"===a.firstChild.getAttribute("href")})||jb("type|href|height|width",function(a,b,c){return c?void 0:a.getAttribute(b,"type"===b.toLowerCase()?1:2)}),c.attributes&&ib(function(a){return a.innerHTML="<input/>",a.firstChild.setAttribute("value",""),""===a.firstChild.getAttribute("value")})||jb("value",function(a,b,c){return c||"input"!==a.nodeName.toLowerCase()?void 0:a.defaultValue}),ib(function(a){return null==a.getAttribute("disabled")})||jb(L,function(a,b,c){var d;return c?void 0:a[b]===!0?b.toLowerCase():(d=a.getAttributeNode(b))&&d.specified?d.value:null}),fb}(a);n.find=t,n.expr=t.selectors,n.expr[":"]=n.expr.pseudos,n.unique=t.uniqueSort,n.text=t.getText,n.isXMLDoc=t.isXML,n.contains=t.contains;var u=n.expr.match.needsContext,v=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,w=/^.[^:#\[\.,]*$/;function x(a,b,c){if(n.isFunction(b))return n.grep(a,function(a,d){return!!b.call(a,d,a)!==c});if(b.nodeType)return n.grep(a,function(a){return a===b!==c});if("string"==typeof b){if(w.test(b))return n.filter(b,a,c);b=n.filter(b,a)}return n.grep(a,function(a){return g.call(b,a)>=0!==c})}n.filter=function(a,b,c){var d=b[0];return c&&(a=":not("+a+")"),1===b.length&&1===d.nodeType?n.find.matchesSelector(d,a)?[d]:[]:n.find.matches(a,n.grep(b,function(a){return 1===a.nodeType}))},n.fn.extend({find:function(a){var b,c=this.length,d=[],e=this;if("string"!=typeof a)return this.pushStack(n(a).filter(function(){for(b=0;c>b;b++)if(n.contains(e[b],this))return!0}));for(b=0;c>b;b++)n.find(a,e[b],d);return d=this.pushStack(c>1?n.unique(d):d),d.selector=this.selector?this.selector+" "+a:a,d},filter:function(a){return this.pushStack(x(this,a||[],!1))},not:function(a){return this.pushStack(x(this,a||[],!0))},is:function(a){return!!x(this,"string"==typeof a&&u.test(a)?n(a):a||[],!1).length}});var y,z=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,A=n.fn.init=function(a,b){var c,d;if(!a)return this;if("string"==typeof a){if(c="<"===a[0]&&">"===a[a.length-1]&&a.length>=3?[null,a,null]:z.exec(a),!c||!c[1]&&b)return!b||b.jquery?(b||y).find(a):this.constructor(b).find(a);if(c[1]){if(b=b instanceof n?b[0]:b,n.merge(this,n.parseHTML(c[1],b&&b.nodeType?b.ownerDocument||b:l,!0)),v.test(c[1])&&n.isPlainObject(b))for(c in b)n.isFunction(this[c])?this[c](b[c]):this.attr(c,b[c]);return this}return d=l.getElementById(c[2]),d&&d.parentNode&&(this.length=1,this[0]=d),this.context=l,this.selector=a,this}return a.nodeType?(this.context=this[0]=a,this.length=1,this):n.isFunction(a)?"undefined"!=typeof y.ready?y.ready(a):a(n):(void 0!==a.selector&&(this.selector=a.selector,this.context=a.context),n.makeArray(a,this))};A.prototype=n.fn,y=n(l);var B=/^(?:parents|prev(?:Until|All))/,C={children:!0,contents:!0,next:!0,prev:!0};n.extend({dir:function(a,b,c){var d=[],e=void 0!==c;while((a=a[b])&&9!==a.nodeType)if(1===a.nodeType){if(e&&n(a).is(c))break;d.push(a)}return d},sibling:function(a,b){for(var c=[];a;a=a.nextSibling)1===a.nodeType&&a!==b&&c.push(a);return c}}),n.fn.extend({has:function(a){var b=n(a,this),c=b.length;return this.filter(function(){for(var a=0;c>a;a++)if(n.contains(this,b[a]))return!0})},closest:function(a,b){for(var c,d=0,e=this.length,f=[],g=u.test(a)||"string"!=typeof a?n(a,b||this.context):0;e>d;d++)for(c=this[d];c&&c!==b;c=c.parentNode)if(c.nodeType<11&&(g?g.index(c)>-1:1===c.nodeType&&n.find.matchesSelector(c,a))){f.push(c);break}return this.pushStack(f.length>1?n.unique(f):f)},index:function(a){return a?"string"==typeof a?g.call(n(a),this[0]):g.call(this,a.jquery?a[0]:a):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(a,b){return this.pushStack(n.unique(n.merge(this.get(),n(a,b))))},addBack:function(a){return this.add(null==a?this.prevObject:this.prevObject.filter(a))}});function D(a,b){while((a=a[b])&&1!==a.nodeType);return a}n.each({parent:function(a){var b=a.parentNode;return b&&11!==b.nodeType?b:null},parents:function(a){return n.dir(a,"parentNode")},parentsUntil:function(a,b,c){return n.dir(a,"parentNode",c)},next:function(a){return D(a,"nextSibling")},prev:function(a){return D(a,"previousSibling")},nextAll:function(a){return n.dir(a,"nextSibling")},prevAll:function(a){return n.dir(a,"previousSibling")},nextUntil:function(a,b,c){return n.dir(a,"nextSibling",c)},prevUntil:function(a,b,c){return n.dir(a,"previousSibling",c)},siblings:function(a){return n.sibling((a.parentNode||{}).firstChild,a)},children:function(a){return n.sibling(a.firstChild)},contents:function(a){return a.contentDocument||n.merge([],a.childNodes)}},function(a,b){n.fn[a]=function(c,d){var e=n.map(this,b,c);return"Until"!==a.slice(-5)&&(d=c),d&&"string"==typeof d&&(e=n.filter(d,e)),this.length>1&&(C[a]||n.unique(e),B.test(a)&&e.reverse()),this.pushStack(e)}});var E=/\S+/g,F={};function G(a){var b=F[a]={};return n.each(a.match(E)||[],function(a,c){b[c]=!0}),b}n.Callbacks=function(a){a="string"==typeof a?F[a]||G(a):n.extend({},a);var b,c,d,e,f,g,h=[],i=!a.once&&[],j=function(l){for(b=a.memory&&l,c=!0,g=e||0,e=0,f=h.length,d=!0;h&&f>g;g++)if(h[g].apply(l[0],l[1])===!1&&a.stopOnFalse){b=!1;break}d=!1,h&&(i?i.length&&j(i.shift()):b?h=[]:k.disable())},k={add:function(){if(h){var c=h.length;!function g(b){n.each(b,function(b,c){var d=n.type(c);"function"===d?a.unique&&k.has(c)||h.push(c):c&&c.length&&"string"!==d&&g(c)})}(arguments),d?f=h.length:b&&(e=c,j(b))}return this},remove:function(){return h&&n.each(arguments,function(a,b){var c;while((c=n.inArray(b,h,c))>-1)h.splice(c,1),d&&(f>=c&&f--,g>=c&&g--)}),this},has:function(a){return a?n.inArray(a,h)>-1:!(!h||!h.length)},empty:function(){return h=[],f=0,this},disable:function(){return h=i=b=void 0,this},disabled:function(){return!h},lock:function(){return i=void 0,b||k.disable(),this},locked:function(){return!i},fireWith:function(a,b){return!h||c&&!i||(b=b||[],b=[a,b.slice?b.slice():b],d?i.push(b):j(b)),this},fire:function(){return k.fireWith(this,arguments),this},fired:function(){return!!c}};return k},n.extend({Deferred:function(a){var b=[["resolve","done",n.Callbacks("once memory"),"resolved"],["reject","fail",n.Callbacks("once memory"),"rejected"],["notify","progress",n.Callbacks("memory")]],c="pending",d={state:function(){return c},always:function(){return e.done(arguments).fail(arguments),this},then:function(){var a=arguments;return n.Deferred(function(c){n.each(b,function(b,f){var g=n.isFunction(a[b])&&a[b];e[f[1]](function(){var a=g&&g.apply(this,arguments);a&&n.isFunction(a.promise)?a.promise().done(c.resolve).fail(c.reject).progress(c.notify):c[f[0]+"With"](this===d?c.promise():this,g?[a]:arguments)})}),a=null}).promise()},promise:function(a){return null!=a?n.extend(a,d):d}},e={};return d.pipe=d.then,n.each(b,function(a,f){var g=f[2],h=f[3];d[f[1]]=g.add,h&&g.add(function(){c=h},b[1^a][2].disable,b[2][2].lock),e[f[0]]=function(){return e[f[0]+"With"](this===e?d:this,arguments),this},e[f[0]+"With"]=g.fireWith}),d.promise(e),a&&a.call(e,e),e},when:function(a){var b=0,c=d.call(arguments),e=c.length,f=1!==e||a&&n.isFunction(a.promise)?e:0,g=1===f?a:n.Deferred(),h=function(a,b,c){return function(e){b[a]=this,c[a]=arguments.length>1?d.call(arguments):e,c===i?g.notifyWith(b,c):--f||g.resolveWith(b,c)}},i,j,k;if(e>1)for(i=new Array(e),j=new Array(e),k=new Array(e);e>b;b++)c[b]&&n.isFunction(c[b].promise)?c[b].promise().done(h(b,k,c)).fail(g.reject).progress(h(b,j,i)):--f;return f||g.resolveWith(k,c),g.promise()}});var H;n.fn.ready=function(a){return n.ready.promise().done(a),this},n.extend({isReady:!1,readyWait:1,holdReady:function(a){a?n.readyWait++:n.ready(!0)},ready:function(a){(a===!0?--n.readyWait:n.isReady)||(n.isReady=!0,a!==!0&&--n.readyWait>0||(H.resolveWith(l,[n]),n.fn.triggerHandler&&(n(l).triggerHandler("ready"),n(l).off("ready"))))}});function I(){l.removeEventListener("DOMContentLoaded",I,!1),a.removeEventListener("load",I,!1),n.ready()}n.ready.promise=function(b){return H||(H=n.Deferred(),"complete"===l.readyState?setTimeout(n.ready):(l.addEventListener("DOMContentLoaded",I,!1),a.addEventListener("load",I,!1))),H.promise(b)},n.ready.promise();var J=n.access=function(a,b,c,d,e,f,g){var h=0,i=a.length,j=null==c;if("object"===n.type(c)){e=!0;for(h in c)n.access(a,b,h,c[h],!0,f,g)}else if(void 0!==d&&(e=!0,n.isFunction(d)||(g=!0),j&&(g?(b.call(a,d),b=null):(j=b,b=function(a,b,c){return j.call(n(a),c)})),b))for(;i>h;h++)b(a[h],c,g?d:d.call(a[h],h,b(a[h],c)));return e?a:j?b.call(a):i?b(a[0],c):f};n.acceptData=function(a){return 1===a.nodeType||9===a.nodeType||!+a.nodeType};function K(){Object.defineProperty(this.cache={},0,{get:function(){return{}}}),this.expando=n.expando+Math.random()}K.uid=1,K.accepts=n.acceptData,K.prototype={key:function(a){if(!K.accepts(a))return 0;var b={},c=a[this.expando];if(!c){c=K.uid++;try{b[this.expando]={value:c},Object.defineProperties(a,b)}catch(d){b[this.expando]=c,n.extend(a,b)}}return this.cache[c]||(this.cache[c]={}),c},set:function(a,b,c){var d,e=this.key(a),f=this.cache[e];if("string"==typeof b)f[b]=c;else if(n.isEmptyObject(f))n.extend(this.cache[e],b);else for(d in b)f[d]=b[d];return f},get:function(a,b){var c=this.cache[this.key(a)];return void 0===b?c:c[b]},access:function(a,b,c){var d;return void 0===b||b&&"string"==typeof b&&void 0===c?(d=this.get(a,b),void 0!==d?d:this.get(a,n.camelCase(b))):(this.set(a,b,c),void 0!==c?c:b)},remove:function(a,b){var c,d,e,f=this.key(a),g=this.cache[f];if(void 0===b)this.cache[f]={};else{n.isArray(b)?d=b.concat(b.map(n.camelCase)):(e=n.camelCase(b),b in g?d=[b,e]:(d=e,d=d in g?[d]:d.match(E)||[])),c=d.length;while(c--)delete g[d[c]]}},hasData:function(a){return!n.isEmptyObject(this.cache[a[this.expando]]||{})},discard:function(a){a[this.expando]&&delete this.cache[a[this.expando]]}};var L=new K,M=new K,N=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,O=/([A-Z])/g;function P(a,b,c){var d;if(void 0===c&&1===a.nodeType)if(d="data-"+b.replace(O,"-$1").toLowerCase(),c=a.getAttribute(d),"string"==typeof c){try{c="true"===c?!0:"false"===c?!1:"null"===c?null:+c+""===c?+c:N.test(c)?n.parseJSON(c):c}catch(e){}M.set(a,b,c)}else c=void 0;return c}n.extend({hasData:function(a){return M.hasData(a)||L.hasData(a)},data:function(a,b,c){return M.access(a,b,c)},removeData:function(a,b){M.remove(a,b)
},_data:function(a,b,c){return L.access(a,b,c)},_removeData:function(a,b){L.remove(a,b)}}),n.fn.extend({data:function(a,b){var c,d,e,f=this[0],g=f&&f.attributes;if(void 0===a){if(this.length&&(e=M.get(f),1===f.nodeType&&!L.get(f,"hasDataAttrs"))){c=g.length;while(c--)g[c]&&(d=g[c].name,0===d.indexOf("data-")&&(d=n.camelCase(d.slice(5)),P(f,d,e[d])));L.set(f,"hasDataAttrs",!0)}return e}return"object"==typeof a?this.each(function(){M.set(this,a)}):J(this,function(b){var c,d=n.camelCase(a);if(f&&void 0===b){if(c=M.get(f,a),void 0!==c)return c;if(c=M.get(f,d),void 0!==c)return c;if(c=P(f,d,void 0),void 0!==c)return c}else this.each(function(){var c=M.get(this,d);M.set(this,d,b),-1!==a.indexOf("-")&&void 0!==c&&M.set(this,a,b)})},null,b,arguments.length>1,null,!0)},removeData:function(a){return this.each(function(){M.remove(this,a)})}}),n.extend({queue:function(a,b,c){var d;return a?(b=(b||"fx")+"queue",d=L.get(a,b),c&&(!d||n.isArray(c)?d=L.access(a,b,n.makeArray(c)):d.push(c)),d||[]):void 0},dequeue:function(a,b){b=b||"fx";var c=n.queue(a,b),d=c.length,e=c.shift(),f=n._queueHooks(a,b),g=function(){n.dequeue(a,b)};"inprogress"===e&&(e=c.shift(),d--),e&&("fx"===b&&c.unshift("inprogress"),delete f.stop,e.call(a,g,f)),!d&&f&&f.empty.fire()},_queueHooks:function(a,b){var c=b+"queueHooks";return L.get(a,c)||L.access(a,c,{empty:n.Callbacks("once memory").add(function(){L.remove(a,[b+"queue",c])})})}}),n.fn.extend({queue:function(a,b){var c=2;return"string"!=typeof a&&(b=a,a="fx",c--),arguments.length<c?n.queue(this[0],a):void 0===b?this:this.each(function(){var c=n.queue(this,a,b);n._queueHooks(this,a),"fx"===a&&"inprogress"!==c[0]&&n.dequeue(this,a)})},dequeue:function(a){return this.each(function(){n.dequeue(this,a)})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,b){var c,d=1,e=n.Deferred(),f=this,g=this.length,h=function(){--d||e.resolveWith(f,[f])};"string"!=typeof a&&(b=a,a=void 0),a=a||"fx";while(g--)c=L.get(f[g],a+"queueHooks"),c&&c.empty&&(d++,c.empty.add(h));return h(),e.promise(b)}});var Q=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,R=["Top","Right","Bottom","Left"],S=function(a,b){return a=b||a,"none"===n.css(a,"display")||!n.contains(a.ownerDocument,a)},T=/^(?:checkbox|radio)$/i;!function(){var a=l.createDocumentFragment(),b=a.appendChild(l.createElement("div")),c=l.createElement("input");c.setAttribute("type","radio"),c.setAttribute("checked","checked"),c.setAttribute("name","t"),b.appendChild(c),k.checkClone=b.cloneNode(!0).cloneNode(!0).lastChild.checked,b.innerHTML="<textarea>x</textarea>",k.noCloneChecked=!!b.cloneNode(!0).lastChild.defaultValue}();var U="undefined";k.focusinBubbles="onfocusin"in a;var V=/^key/,W=/^(?:mouse|pointer|contextmenu)|click/,X=/^(?:focusinfocus|focusoutblur)$/,Y=/^([^.]*)(?:\.(.+)|)$/;function Z(){return!0}function $(){return!1}function _(){try{return l.activeElement}catch(a){}}n.event={global:{},add:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,o,p,q,r=L.get(a);if(r){c.handler&&(f=c,c=f.handler,e=f.selector),c.guid||(c.guid=n.guid++),(i=r.events)||(i=r.events={}),(g=r.handle)||(g=r.handle=function(b){return typeof n!==U&&n.event.triggered!==b.type?n.event.dispatch.apply(a,arguments):void 0}),b=(b||"").match(E)||[""],j=b.length;while(j--)h=Y.exec(b[j])||[],o=q=h[1],p=(h[2]||"").split(".").sort(),o&&(l=n.event.special[o]||{},o=(e?l.delegateType:l.bindType)||o,l=n.event.special[o]||{},k=n.extend({type:o,origType:q,data:d,handler:c,guid:c.guid,selector:e,needsContext:e&&n.expr.match.needsContext.test(e),namespace:p.join(".")},f),(m=i[o])||(m=i[o]=[],m.delegateCount=0,l.setup&&l.setup.call(a,d,p,g)!==!1||a.addEventListener&&a.addEventListener(o,g,!1)),l.add&&(l.add.call(a,k),k.handler.guid||(k.handler.guid=c.guid)),e?m.splice(m.delegateCount++,0,k):m.push(k),n.event.global[o]=!0)}},remove:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,o,p,q,r=L.hasData(a)&&L.get(a);if(r&&(i=r.events)){b=(b||"").match(E)||[""],j=b.length;while(j--)if(h=Y.exec(b[j])||[],o=q=h[1],p=(h[2]||"").split(".").sort(),o){l=n.event.special[o]||{},o=(d?l.delegateType:l.bindType)||o,m=i[o]||[],h=h[2]&&new RegExp("(^|\\.)"+p.join("\\.(?:.*\\.|)")+"(\\.|$)"),g=f=m.length;while(f--)k=m[f],!e&&q!==k.origType||c&&c.guid!==k.guid||h&&!h.test(k.namespace)||d&&d!==k.selector&&("**"!==d||!k.selector)||(m.splice(f,1),k.selector&&m.delegateCount--,l.remove&&l.remove.call(a,k));g&&!m.length&&(l.teardown&&l.teardown.call(a,p,r.handle)!==!1||n.removeEvent(a,o,r.handle),delete i[o])}else for(o in i)n.event.remove(a,o+b[j],c,d,!0);n.isEmptyObject(i)&&(delete r.handle,L.remove(a,"events"))}},trigger:function(b,c,d,e){var f,g,h,i,k,m,o,p=[d||l],q=j.call(b,"type")?b.type:b,r=j.call(b,"namespace")?b.namespace.split("."):[];if(g=h=d=d||l,3!==d.nodeType&&8!==d.nodeType&&!X.test(q+n.event.triggered)&&(q.indexOf(".")>=0&&(r=q.split("."),q=r.shift(),r.sort()),k=q.indexOf(":")<0&&"on"+q,b=b[n.expando]?b:new n.Event(q,"object"==typeof b&&b),b.isTrigger=e?2:3,b.namespace=r.join("."),b.namespace_re=b.namespace?new RegExp("(^|\\.)"+r.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,b.result=void 0,b.target||(b.target=d),c=null==c?[b]:n.makeArray(c,[b]),o=n.event.special[q]||{},e||!o.trigger||o.trigger.apply(d,c)!==!1)){if(!e&&!o.noBubble&&!n.isWindow(d)){for(i=o.delegateType||q,X.test(i+q)||(g=g.parentNode);g;g=g.parentNode)p.push(g),h=g;h===(d.ownerDocument||l)&&p.push(h.defaultView||h.parentWindow||a)}f=0;while((g=p[f++])&&!b.isPropagationStopped())b.type=f>1?i:o.bindType||q,m=(L.get(g,"events")||{})[b.type]&&L.get(g,"handle"),m&&m.apply(g,c),m=k&&g[k],m&&m.apply&&n.acceptData(g)&&(b.result=m.apply(g,c),b.result===!1&&b.preventDefault());return b.type=q,e||b.isDefaultPrevented()||o._default&&o._default.apply(p.pop(),c)!==!1||!n.acceptData(d)||k&&n.isFunction(d[q])&&!n.isWindow(d)&&(h=d[k],h&&(d[k]=null),n.event.triggered=q,d[q](),n.event.triggered=void 0,h&&(d[k]=h)),b.result}},dispatch:function(a){a=n.event.fix(a);var b,c,e,f,g,h=[],i=d.call(arguments),j=(L.get(this,"events")||{})[a.type]||[],k=n.event.special[a.type]||{};if(i[0]=a,a.delegateTarget=this,!k.preDispatch||k.preDispatch.call(this,a)!==!1){h=n.event.handlers.call(this,a,j),b=0;while((f=h[b++])&&!a.isPropagationStopped()){a.currentTarget=f.elem,c=0;while((g=f.handlers[c++])&&!a.isImmediatePropagationStopped())(!a.namespace_re||a.namespace_re.test(g.namespace))&&(a.handleObj=g,a.data=g.data,e=((n.event.special[g.origType]||{}).handle||g.handler).apply(f.elem,i),void 0!==e&&(a.result=e)===!1&&(a.preventDefault(),a.stopPropagation()))}return k.postDispatch&&k.postDispatch.call(this,a),a.result}},handlers:function(a,b){var c,d,e,f,g=[],h=b.delegateCount,i=a.target;if(h&&i.nodeType&&(!a.button||"click"!==a.type))for(;i!==this;i=i.parentNode||this)if(i.disabled!==!0||"click"!==a.type){for(d=[],c=0;h>c;c++)f=b[c],e=f.selector+" ",void 0===d[e]&&(d[e]=f.needsContext?n(e,this).index(i)>=0:n.find(e,this,null,[i]).length),d[e]&&d.push(f);d.length&&g.push({elem:i,handlers:d})}return h<b.length&&g.push({elem:this,handlers:b.slice(h)}),g},props:"altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(a,b){return null==a.which&&(a.which=null!=b.charCode?b.charCode:b.keyCode),a}},mouseHooks:{props:"button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(a,b){var c,d,e,f=b.button;return null==a.pageX&&null!=b.clientX&&(c=a.target.ownerDocument||l,d=c.documentElement,e=c.body,a.pageX=b.clientX+(d&&d.scrollLeft||e&&e.scrollLeft||0)-(d&&d.clientLeft||e&&e.clientLeft||0),a.pageY=b.clientY+(d&&d.scrollTop||e&&e.scrollTop||0)-(d&&d.clientTop||e&&e.clientTop||0)),a.which||void 0===f||(a.which=1&f?1:2&f?3:4&f?2:0),a}},fix:function(a){if(a[n.expando])return a;var b,c,d,e=a.type,f=a,g=this.fixHooks[e];g||(this.fixHooks[e]=g=W.test(e)?this.mouseHooks:V.test(e)?this.keyHooks:{}),d=g.props?this.props.concat(g.props):this.props,a=new n.Event(f),b=d.length;while(b--)c=d[b],a[c]=f[c];return a.target||(a.target=l),3===a.target.nodeType&&(a.target=a.target.parentNode),g.filter?g.filter(a,f):a},special:{load:{noBubble:!0},focus:{trigger:function(){return this!==_()&&this.focus?(this.focus(),!1):void 0},delegateType:"focusin"},blur:{trigger:function(){return this===_()&&this.blur?(this.blur(),!1):void 0},delegateType:"focusout"},click:{trigger:function(){return"checkbox"===this.type&&this.click&&n.nodeName(this,"input")?(this.click(),!1):void 0},_default:function(a){return n.nodeName(a.target,"a")}},beforeunload:{postDispatch:function(a){void 0!==a.result&&a.originalEvent&&(a.originalEvent.returnValue=a.result)}}},simulate:function(a,b,c,d){var e=n.extend(new n.Event,c,{type:a,isSimulated:!0,originalEvent:{}});d?n.event.trigger(e,null,b):n.event.dispatch.call(b,e),e.isDefaultPrevented()&&c.preventDefault()}},n.removeEvent=function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c,!1)},n.Event=function(a,b){return this instanceof n.Event?(a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||void 0===a.defaultPrevented&&a.returnValue===!1?Z:$):this.type=a,b&&n.extend(this,b),this.timeStamp=a&&a.timeStamp||n.now(),void(this[n.expando]=!0)):new n.Event(a,b)},n.Event.prototype={isDefaultPrevented:$,isPropagationStopped:$,isImmediatePropagationStopped:$,preventDefault:function(){var a=this.originalEvent;this.isDefaultPrevented=Z,a&&a.preventDefault&&a.preventDefault()},stopPropagation:function(){var a=this.originalEvent;this.isPropagationStopped=Z,a&&a.stopPropagation&&a.stopPropagation()},stopImmediatePropagation:function(){var a=this.originalEvent;this.isImmediatePropagationStopped=Z,a&&a.stopImmediatePropagation&&a.stopImmediatePropagation(),this.stopPropagation()}},n.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(a,b){n.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c,d=this,e=a.relatedTarget,f=a.handleObj;return(!e||e!==d&&!n.contains(d,e))&&(a.type=f.origType,c=f.handler.apply(this,arguments),a.type=b),c}}}),k.focusinBubbles||n.each({focus:"focusin",blur:"focusout"},function(a,b){var c=function(a){n.event.simulate(b,a.target,n.event.fix(a),!0)};n.event.special[b]={setup:function(){var d=this.ownerDocument||this,e=L.access(d,b);e||d.addEventListener(a,c,!0),L.access(d,b,(e||0)+1)},teardown:function(){var d=this.ownerDocument||this,e=L.access(d,b)-1;e?L.access(d,b,e):(d.removeEventListener(a,c,!0),L.remove(d,b))}}}),n.fn.extend({on:function(a,b,c,d,e){var f,g;if("object"==typeof a){"string"!=typeof b&&(c=c||b,b=void 0);for(g in a)this.on(g,b,c,a[g],e);return this}if(null==c&&null==d?(d=b,c=b=void 0):null==d&&("string"==typeof b?(d=c,c=void 0):(d=c,c=b,b=void 0)),d===!1)d=$;else if(!d)return this;return 1===e&&(f=d,d=function(a){return n().off(a),f.apply(this,arguments)},d.guid=f.guid||(f.guid=n.guid++)),this.each(function(){n.event.add(this,a,d,c,b)})},one:function(a,b,c,d){return this.on(a,b,c,d,1)},off:function(a,b,c){var d,e;if(a&&a.preventDefault&&a.handleObj)return d=a.handleObj,n(a.delegateTarget).off(d.namespace?d.origType+"."+d.namespace:d.origType,d.selector,d.handler),this;if("object"==typeof a){for(e in a)this.off(e,b,a[e]);return this}return(b===!1||"function"==typeof b)&&(c=b,b=void 0),c===!1&&(c=$),this.each(function(){n.event.remove(this,a,c,b)})},trigger:function(a,b){return this.each(function(){n.event.trigger(a,b,this)})},triggerHandler:function(a,b){var c=this[0];return c?n.event.trigger(a,b,c,!0):void 0}});var ab=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,bb=/<([\w:]+)/,cb=/<|&#?\w+;/,db=/<(?:script|style|link)/i,eb=/checked\s*(?:[^=]|=\s*.checked.)/i,fb=/^$|\/(?:java|ecma)script/i,gb=/^true\/(.*)/,hb=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,ib={option:[1,"<select multiple='multiple'>","</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};ib.optgroup=ib.option,ib.tbody=ib.tfoot=ib.colgroup=ib.caption=ib.thead,ib.th=ib.td;function jb(a,b){return n.nodeName(a,"table")&&n.nodeName(11!==b.nodeType?b:b.firstChild,"tr")?a.getElementsByTagName("tbody")[0]||a.appendChild(a.ownerDocument.createElement("tbody")):a}function kb(a){return a.type=(null!==a.getAttribute("type"))+"/"+a.type,a}function lb(a){var b=gb.exec(a.type);return b?a.type=b[1]:a.removeAttribute("type"),a}function mb(a,b){for(var c=0,d=a.length;d>c;c++)L.set(a[c],"globalEval",!b||L.get(b[c],"globalEval"))}function nb(a,b){var c,d,e,f,g,h,i,j;if(1===b.nodeType){if(L.hasData(a)&&(f=L.access(a),g=L.set(b,f),j=f.events)){delete g.handle,g.events={};for(e in j)for(c=0,d=j[e].length;d>c;c++)n.event.add(b,e,j[e][c])}M.hasData(a)&&(h=M.access(a),i=n.extend({},h),M.set(b,i))}}function ob(a,b){var c=a.getElementsByTagName?a.getElementsByTagName(b||"*"):a.querySelectorAll?a.querySelectorAll(b||"*"):[];return void 0===b||b&&n.nodeName(a,b)?n.merge([a],c):c}function pb(a,b){var c=b.nodeName.toLowerCase();"input"===c&&T.test(a.type)?b.checked=a.checked:("input"===c||"textarea"===c)&&(b.defaultValue=a.defaultValue)}n.extend({clone:function(a,b,c){var d,e,f,g,h=a.cloneNode(!0),i=n.contains(a.ownerDocument,a);if(!(k.noCloneChecked||1!==a.nodeType&&11!==a.nodeType||n.isXMLDoc(a)))for(g=ob(h),f=ob(a),d=0,e=f.length;e>d;d++)pb(f[d],g[d]);if(b)if(c)for(f=f||ob(a),g=g||ob(h),d=0,e=f.length;e>d;d++)nb(f[d],g[d]);else nb(a,h);return g=ob(h,"script"),g.length>0&&mb(g,!i&&ob(a,"script")),h},buildFragment:function(a,b,c,d){for(var e,f,g,h,i,j,k=b.createDocumentFragment(),l=[],m=0,o=a.length;o>m;m++)if(e=a[m],e||0===e)if("object"===n.type(e))n.merge(l,e.nodeType?[e]:e);else if(cb.test(e)){f=f||k.appendChild(b.createElement("div")),g=(bb.exec(e)||["",""])[1].toLowerCase(),h=ib[g]||ib._default,f.innerHTML=h[1]+e.replace(ab,"<$1></$2>")+h[2],j=h[0];while(j--)f=f.lastChild;n.merge(l,f.childNodes),f=k.firstChild,f.textContent=""}else l.push(b.createTextNode(e));k.textContent="",m=0;while(e=l[m++])if((!d||-1===n.inArray(e,d))&&(i=n.contains(e.ownerDocument,e),f=ob(k.appendChild(e),"script"),i&&mb(f),c)){j=0;while(e=f[j++])fb.test(e.type||"")&&c.push(e)}return k},cleanData:function(a){for(var b,c,d,e,f=n.event.special,g=0;void 0!==(c=a[g]);g++){if(n.acceptData(c)&&(e=c[L.expando],e&&(b=L.cache[e]))){if(b.events)for(d in b.events)f[d]?n.event.remove(c,d):n.removeEvent(c,d,b.handle);L.cache[e]&&delete L.cache[e]}delete M.cache[c[M.expando]]}}}),n.fn.extend({text:function(a){return J(this,function(a){return void 0===a?n.text(this):this.empty().each(function(){(1===this.nodeType||11===this.nodeType||9===this.nodeType)&&(this.textContent=a)})},null,a,arguments.length)},append:function(){return this.domManip(arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=jb(this,a);b.appendChild(a)}})},prepend:function(){return this.domManip(arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=jb(this,a);b.insertBefore(a,b.firstChild)}})},before:function(){return this.domManip(arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this)})},after:function(){return this.domManip(arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this.nextSibling)})},remove:function(a,b){for(var c,d=a?n.filter(a,this):this,e=0;null!=(c=d[e]);e++)b||1!==c.nodeType||n.cleanData(ob(c)),c.parentNode&&(b&&n.contains(c.ownerDocument,c)&&mb(ob(c,"script")),c.parentNode.removeChild(c));return this},empty:function(){for(var a,b=0;null!=(a=this[b]);b++)1===a.nodeType&&(n.cleanData(ob(a,!1)),a.textContent="");return this},clone:function(a,b){return a=null==a?!1:a,b=null==b?a:b,this.map(function(){return n.clone(this,a,b)})},html:function(a){return J(this,function(a){var b=this[0]||{},c=0,d=this.length;if(void 0===a&&1===b.nodeType)return b.innerHTML;if("string"==typeof a&&!db.test(a)&&!ib[(bb.exec(a)||["",""])[1].toLowerCase()]){a=a.replace(ab,"<$1></$2>");try{for(;d>c;c++)b=this[c]||{},1===b.nodeType&&(n.cleanData(ob(b,!1)),b.innerHTML=a);b=0}catch(e){}}b&&this.empty().append(a)},null,a,arguments.length)},replaceWith:function(){var a=arguments[0];return this.domManip(arguments,function(b){a=this.parentNode,n.cleanData(ob(this)),a&&a.replaceChild(b,this)}),a&&(a.length||a.nodeType)?this:this.remove()},detach:function(a){return this.remove(a,!0)},domManip:function(a,b){a=e.apply([],a);var c,d,f,g,h,i,j=0,l=this.length,m=this,o=l-1,p=a[0],q=n.isFunction(p);if(q||l>1&&"string"==typeof p&&!k.checkClone&&eb.test(p))return this.each(function(c){var d=m.eq(c);q&&(a[0]=p.call(this,c,d.html())),d.domManip(a,b)});if(l&&(c=n.buildFragment(a,this[0].ownerDocument,!1,this),d=c.firstChild,1===c.childNodes.length&&(c=d),d)){for(f=n.map(ob(c,"script"),kb),g=f.length;l>j;j++)h=c,j!==o&&(h=n.clone(h,!0,!0),g&&n.merge(f,ob(h,"script"))),b.call(this[j],h,j);if(g)for(i=f[f.length-1].ownerDocument,n.map(f,lb),j=0;g>j;j++)h=f[j],fb.test(h.type||"")&&!L.access(h,"globalEval")&&n.contains(i,h)&&(h.src?n._evalUrl&&n._evalUrl(h.src):n.globalEval(h.textContent.replace(hb,"")))}return this}}),n.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){n.fn[a]=function(a){for(var c,d=[],e=n(a),g=e.length-1,h=0;g>=h;h++)c=h===g?this:this.clone(!0),n(e[h])[b](c),f.apply(d,c.get());return this.pushStack(d)}});var qb,rb={};function sb(b,c){var d,e=n(c.createElement(b)).appendTo(c.body),f=a.getDefaultComputedStyle&&(d=a.getDefaultComputedStyle(e[0]))?d.display:n.css(e[0],"display");return e.detach(),f}function tb(a){var b=l,c=rb[a];return c||(c=sb(a,b),"none"!==c&&c||(qb=(qb||n("<iframe frameborder='0' width='0' height='0'/>")).appendTo(b.documentElement),b=qb[0].contentDocument,b.write(),b.close(),c=sb(a,b),qb.detach()),rb[a]=c),c}var ub=/^margin/,vb=new RegExp("^("+Q+")(?!px)[a-z%]+$","i"),wb=function(a){return a.ownerDocument.defaultView.getComputedStyle(a,null)};function xb(a,b,c){var d,e,f,g,h=a.style;return c=c||wb(a),c&&(g=c.getPropertyValue(b)||c[b]),c&&(""!==g||n.contains(a.ownerDocument,a)||(g=n.style(a,b)),vb.test(g)&&ub.test(b)&&(d=h.width,e=h.minWidth,f=h.maxWidth,h.minWidth=h.maxWidth=h.width=g,g=c.width,h.width=d,h.minWidth=e,h.maxWidth=f)),void 0!==g?g+"":g}function yb(a,b){return{get:function(){return a()?void delete this.get:(this.get=b).apply(this,arguments)}}}!function(){var b,c,d=l.documentElement,e=l.createElement("div"),f=l.createElement("div");if(f.style){f.style.backgroundClip="content-box",f.cloneNode(!0).style.backgroundClip="",k.clearCloneStyle="content-box"===f.style.backgroundClip,e.style.cssText="border:0;width:0;height:0;top:0;left:-9999px;margin-top:1px;position:absolute",e.appendChild(f);function g(){f.style.cssText="-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute",f.innerHTML="",d.appendChild(e);var g=a.getComputedStyle(f,null);b="1%"!==g.top,c="4px"===g.width,d.removeChild(e)}a.getComputedStyle&&n.extend(k,{pixelPosition:function(){return g(),b},boxSizingReliable:function(){return null==c&&g(),c},reliableMarginRight:function(){var b,c=f.appendChild(l.createElement("div"));return c.style.cssText=f.style.cssText="-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0",c.style.marginRight=c.style.width="0",f.style.width="1px",d.appendChild(e),b=!parseFloat(a.getComputedStyle(c,null).marginRight),d.removeChild(e),b}})}}(),n.swap=function(a,b,c,d){var e,f,g={};for(f in b)g[f]=a.style[f],a.style[f]=b[f];e=c.apply(a,d||[]);for(f in b)a.style[f]=g[f];return e};var zb=/^(none|table(?!-c[ea]).+)/,Ab=new RegExp("^("+Q+")(.*)$","i"),Bb=new RegExp("^([+-])=("+Q+")","i"),Cb={position:"absolute",visibility:"hidden",display:"block"},Db={letterSpacing:"0",fontWeight:"400"},Eb=["Webkit","O","Moz","ms"];function Fb(a,b){if(b in a)return b;var c=b[0].toUpperCase()+b.slice(1),d=b,e=Eb.length;while(e--)if(b=Eb[e]+c,b in a)return b;return d}function Gb(a,b,c){var d=Ab.exec(b);return d?Math.max(0,d[1]-(c||0))+(d[2]||"px"):b}function Hb(a,b,c,d,e){for(var f=c===(d?"border":"content")?4:"width"===b?1:0,g=0;4>f;f+=2)"margin"===c&&(g+=n.css(a,c+R[f],!0,e)),d?("content"===c&&(g-=n.css(a,"padding"+R[f],!0,e)),"margin"!==c&&(g-=n.css(a,"border"+R[f]+"Width",!0,e))):(g+=n.css(a,"padding"+R[f],!0,e),"padding"!==c&&(g+=n.css(a,"border"+R[f]+"Width",!0,e)));return g}function Ib(a,b,c){var d=!0,e="width"===b?a.offsetWidth:a.offsetHeight,f=wb(a),g="border-box"===n.css(a,"boxSizing",!1,f);if(0>=e||null==e){if(e=xb(a,b,f),(0>e||null==e)&&(e=a.style[b]),vb.test(e))return e;d=g&&(k.boxSizingReliable()||e===a.style[b]),e=parseFloat(e)||0}return e+Hb(a,b,c||(g?"border":"content"),d,f)+"px"}function Jb(a,b){for(var c,d,e,f=[],g=0,h=a.length;h>g;g++)d=a[g],d.style&&(f[g]=L.get(d,"olddisplay"),c=d.style.display,b?(f[g]||"none"!==c||(d.style.display=""),""===d.style.display&&S(d)&&(f[g]=L.access(d,"olddisplay",tb(d.nodeName)))):(e=S(d),"none"===c&&e||L.set(d,"olddisplay",e?c:n.css(d,"display"))));for(g=0;h>g;g++)d=a[g],d.style&&(b&&"none"!==d.style.display&&""!==d.style.display||(d.style.display=b?f[g]||"":"none"));return a}n.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=xb(a,"opacity");return""===c?"1":c}}}},cssNumber:{columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":"cssFloat"},style:function(a,b,c,d){if(a&&3!==a.nodeType&&8!==a.nodeType&&a.style){var e,f,g,h=n.camelCase(b),i=a.style;return b=n.cssProps[h]||(n.cssProps[h]=Fb(i,h)),g=n.cssHooks[b]||n.cssHooks[h],void 0===c?g&&"get"in g&&void 0!==(e=g.get(a,!1,d))?e:i[b]:(f=typeof c,"string"===f&&(e=Bb.exec(c))&&(c=(e[1]+1)*e[2]+parseFloat(n.css(a,b)),f="number"),null!=c&&c===c&&("number"!==f||n.cssNumber[h]||(c+="px"),k.clearCloneStyle||""!==c||0!==b.indexOf("background")||(i[b]="inherit"),g&&"set"in g&&void 0===(c=g.set(a,c,d))||(i[b]=c)),void 0)}},css:function(a,b,c,d){var e,f,g,h=n.camelCase(b);return b=n.cssProps[h]||(n.cssProps[h]=Fb(a.style,h)),g=n.cssHooks[b]||n.cssHooks[h],g&&"get"in g&&(e=g.get(a,!0,c)),void 0===e&&(e=xb(a,b,d)),"normal"===e&&b in Db&&(e=Db[b]),""===c||c?(f=parseFloat(e),c===!0||n.isNumeric(f)?f||0:e):e}}),n.each(["height","width"],function(a,b){n.cssHooks[b]={get:function(a,c,d){return c?zb.test(n.css(a,"display"))&&0===a.offsetWidth?n.swap(a,Cb,function(){return Ib(a,b,d)}):Ib(a,b,d):void 0},set:function(a,c,d){var e=d&&wb(a);return Gb(a,c,d?Hb(a,b,d,"border-box"===n.css(a,"boxSizing",!1,e),e):0)}}}),n.cssHooks.marginRight=yb(k.reliableMarginRight,function(a,b){return b?n.swap(a,{display:"inline-block"},xb,[a,"marginRight"]):void 0}),n.each({margin:"",padding:"",border:"Width"},function(a,b){n.cssHooks[a+b]={expand:function(c){for(var d=0,e={},f="string"==typeof c?c.split(" "):[c];4>d;d++)e[a+R[d]+b]=f[d]||f[d-2]||f[0];return e}},ub.test(a)||(n.cssHooks[a+b].set=Gb)}),n.fn.extend({css:function(a,b){return J(this,function(a,b,c){var d,e,f={},g=0;if(n.isArray(b)){for(d=wb(a),e=b.length;e>g;g++)f[b[g]]=n.css(a,b[g],!1,d);return f}return void 0!==c?n.style(a,b,c):n.css(a,b)},a,b,arguments.length>1)},show:function(){return Jb(this,!0)},hide:function(){return Jb(this)},toggle:function(a){return"boolean"==typeof a?a?this.show():this.hide():this.each(function(){S(this)?n(this).show():n(this).hide()})}});function Kb(a,b,c,d,e){return new Kb.prototype.init(a,b,c,d,e)}n.Tween=Kb,Kb.prototype={constructor:Kb,init:function(a,b,c,d,e,f){this.elem=a,this.prop=c,this.easing=e||"swing",this.options=b,this.start=this.now=this.cur(),this.end=d,this.unit=f||(n.cssNumber[c]?"":"px")},cur:function(){var a=Kb.propHooks[this.prop];return a&&a.get?a.get(this):Kb.propHooks._default.get(this)},run:function(a){var b,c=Kb.propHooks[this.prop];return this.pos=b=this.options.duration?n.easing[this.easing](a,this.options.duration*a,0,1,this.options.duration):a,this.now=(this.end-this.start)*b+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),c&&c.set?c.set(this):Kb.propHooks._default.set(this),this}},Kb.prototype.init.prototype=Kb.prototype,Kb.propHooks={_default:{get:function(a){var b;return null==a.elem[a.prop]||a.elem.style&&null!=a.elem.style[a.prop]?(b=n.css(a.elem,a.prop,""),b&&"auto"!==b?b:0):a.elem[a.prop]},set:function(a){n.fx.step[a.prop]?n.fx.step[a.prop](a):a.elem.style&&(null!=a.elem.style[n.cssProps[a.prop]]||n.cssHooks[a.prop])?n.style(a.elem,a.prop,a.now+a.unit):a.elem[a.prop]=a.now}}},Kb.propHooks.scrollTop=Kb.propHooks.scrollLeft={set:function(a){a.elem.nodeType&&a.elem.parentNode&&(a.elem[a.prop]=a.now)}},n.easing={linear:function(a){return a},swing:function(a){return.5-Math.cos(a*Math.PI)/2}},n.fx=Kb.prototype.init,n.fx.step={};var Lb,Mb,Nb=/^(?:toggle|show|hide)$/,Ob=new RegExp("^(?:([+-])=|)("+Q+")([a-z%]*)$","i"),Pb=/queueHooks$/,Qb=[Vb],Rb={"*":[function(a,b){var c=this.createTween(a,b),d=c.cur(),e=Ob.exec(b),f=e&&e[3]||(n.cssNumber[a]?"":"px"),g=(n.cssNumber[a]||"px"!==f&&+d)&&Ob.exec(n.css(c.elem,a)),h=1,i=20;if(g&&g[3]!==f){f=f||g[3],e=e||[],g=+d||1;do h=h||".5",g/=h,n.style(c.elem,a,g+f);while(h!==(h=c.cur()/d)&&1!==h&&--i)}return e&&(g=c.start=+g||+d||0,c.unit=f,c.end=e[1]?g+(e[1]+1)*e[2]:+e[2]),c}]};function Sb(){return setTimeout(function(){Lb=void 0}),Lb=n.now()}function Tb(a,b){var c,d=0,e={height:a};for(b=b?1:0;4>d;d+=2-b)c=R[d],e["margin"+c]=e["padding"+c]=a;return b&&(e.opacity=e.width=a),e}function Ub(a,b,c){for(var d,e=(Rb[b]||[]).concat(Rb["*"]),f=0,g=e.length;g>f;f++)if(d=e[f].call(c,b,a))return d}function Vb(a,b,c){var d,e,f,g,h,i,j,k,l=this,m={},o=a.style,p=a.nodeType&&S(a),q=L.get(a,"fxshow");c.queue||(h=n._queueHooks(a,"fx"),null==h.unqueued&&(h.unqueued=0,i=h.empty.fire,h.empty.fire=function(){h.unqueued||i()}),h.unqueued++,l.always(function(){l.always(function(){h.unqueued--,n.queue(a,"fx").length||h.empty.fire()})})),1===a.nodeType&&("height"in b||"width"in b)&&(c.overflow=[o.overflow,o.overflowX,o.overflowY],j=n.css(a,"display"),k="none"===j?L.get(a,"olddisplay")||tb(a.nodeName):j,"inline"===k&&"none"===n.css(a,"float")&&(o.display="inline-block")),c.overflow&&(o.overflow="hidden",l.always(function(){o.overflow=c.overflow[0],o.overflowX=c.overflow[1],o.overflowY=c.overflow[2]}));for(d in b)if(e=b[d],Nb.exec(e)){if(delete b[d],f=f||"toggle"===e,e===(p?"hide":"show")){if("show"!==e||!q||void 0===q[d])continue;p=!0}m[d]=q&&q[d]||n.style(a,d)}else j=void 0;if(n.isEmptyObject(m))"inline"===("none"===j?tb(a.nodeName):j)&&(o.display=j);else{q?"hidden"in q&&(p=q.hidden):q=L.access(a,"fxshow",{}),f&&(q.hidden=!p),p?n(a).show():l.done(function(){n(a).hide()}),l.done(function(){var b;L.remove(a,"fxshow");for(b in m)n.style(a,b,m[b])});for(d in m)g=Ub(p?q[d]:0,d,l),d in q||(q[d]=g.start,p&&(g.end=g.start,g.start="width"===d||"height"===d?1:0))}}function Wb(a,b){var c,d,e,f,g;for(c in a)if(d=n.camelCase(c),e=b[d],f=a[c],n.isArray(f)&&(e=f[1],f=a[c]=f[0]),c!==d&&(a[d]=f,delete a[c]),g=n.cssHooks[d],g&&"expand"in g){f=g.expand(f),delete a[d];for(c in f)c in a||(a[c]=f[c],b[c]=e)}else b[d]=e}function Xb(a,b,c){var d,e,f=0,g=Qb.length,h=n.Deferred().always(function(){delete i.elem}),i=function(){if(e)return!1;for(var b=Lb||Sb(),c=Math.max(0,j.startTime+j.duration-b),d=c/j.duration||0,f=1-d,g=0,i=j.tweens.length;i>g;g++)j.tweens[g].run(f);return h.notifyWith(a,[j,f,c]),1>f&&i?c:(h.resolveWith(a,[j]),!1)},j=h.promise({elem:a,props:n.extend({},b),opts:n.extend(!0,{specialEasing:{}},c),originalProperties:b,originalOptions:c,startTime:Lb||Sb(),duration:c.duration,tweens:[],createTween:function(b,c){var d=n.Tween(a,j.opts,b,c,j.opts.specialEasing[b]||j.opts.easing);return j.tweens.push(d),d},stop:function(b){var c=0,d=b?j.tweens.length:0;if(e)return this;for(e=!0;d>c;c++)j.tweens[c].run(1);return b?h.resolveWith(a,[j,b]):h.rejectWith(a,[j,b]),this}}),k=j.props;for(Wb(k,j.opts.specialEasing);g>f;f++)if(d=Qb[f].call(j,a,k,j.opts))return d;return n.map(k,Ub,j),n.isFunction(j.opts.start)&&j.opts.start.call(a,j),n.fx.timer(n.extend(i,{elem:a,anim:j,queue:j.opts.queue})),j.progress(j.opts.progress).done(j.opts.done,j.opts.complete).fail(j.opts.fail).always(j.opts.always)}n.Animation=n.extend(Xb,{tweener:function(a,b){n.isFunction(a)?(b=a,a=["*"]):a=a.split(" ");for(var c,d=0,e=a.length;e>d;d++)c=a[d],Rb[c]=Rb[c]||[],Rb[c].unshift(b)},prefilter:function(a,b){b?Qb.unshift(a):Qb.push(a)}}),n.speed=function(a,b,c){var d=a&&"object"==typeof a?n.extend({},a):{complete:c||!c&&b||n.isFunction(a)&&a,duration:a,easing:c&&b||b&&!n.isFunction(b)&&b};return d.duration=n.fx.off?0:"number"==typeof d.duration?d.duration:d.duration in n.fx.speeds?n.fx.speeds[d.duration]:n.fx.speeds._default,(null==d.queue||d.queue===!0)&&(d.queue="fx"),d.old=d.complete,d.complete=function(){n.isFunction(d.old)&&d.old.call(this),d.queue&&n.dequeue(this,d.queue)},d},n.fn.extend({fadeTo:function(a,b,c,d){return this.filter(S).css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){var e=n.isEmptyObject(a),f=n.speed(b,c,d),g=function(){var b=Xb(this,n.extend({},a),f);(e||L.get(this,"finish"))&&b.stop(!0)};return g.finish=g,e||f.queue===!1?this.each(g):this.queue(f.queue,g)},stop:function(a,b,c){var d=function(a){var b=a.stop;delete a.stop,b(c)};return"string"!=typeof a&&(c=b,b=a,a=void 0),b&&a!==!1&&this.queue(a||"fx",[]),this.each(function(){var b=!0,e=null!=a&&a+"queueHooks",f=n.timers,g=L.get(this);if(e)g[e]&&g[e].stop&&d(g[e]);else for(e in g)g[e]&&g[e].stop&&Pb.test(e)&&d(g[e]);for(e=f.length;e--;)f[e].elem!==this||null!=a&&f[e].queue!==a||(f[e].anim.stop(c),b=!1,f.splice(e,1));(b||!c)&&n.dequeue(this,a)})},finish:function(a){return a!==!1&&(a=a||"fx"),this.each(function(){var b,c=L.get(this),d=c[a+"queue"],e=c[a+"queueHooks"],f=n.timers,g=d?d.length:0;for(c.finish=!0,n.queue(this,a,[]),e&&e.stop&&e.stop.call(this,!0),b=f.length;b--;)f[b].elem===this&&f[b].queue===a&&(f[b].anim.stop(!0),f.splice(b,1));for(b=0;g>b;b++)d[b]&&d[b].finish&&d[b].finish.call(this);delete c.finish})}}),n.each(["toggle","show","hide"],function(a,b){var c=n.fn[b];n.fn[b]=function(a,d,e){return null==a||"boolean"==typeof a?c.apply(this,arguments):this.animate(Tb(b,!0),a,d,e)}}),n.each({slideDown:Tb("show"),slideUp:Tb("hide"),slideToggle:Tb("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){n.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),n.timers=[],n.fx.tick=function(){var a,b=0,c=n.timers;for(Lb=n.now();b<c.length;b++)a=c[b],a()||c[b]!==a||c.splice(b--,1);c.length||n.fx.stop(),Lb=void 0},n.fx.timer=function(a){n.timers.push(a),a()?n.fx.start():n.timers.pop()},n.fx.interval=13,n.fx.start=function(){Mb||(Mb=setInterval(n.fx.tick,n.fx.interval))},n.fx.stop=function(){clearInterval(Mb),Mb=null},n.fx.speeds={slow:600,fast:200,_default:400},n.fn.delay=function(a,b){return a=n.fx?n.fx.speeds[a]||a:a,b=b||"fx",this.queue(b,function(b,c){var d=setTimeout(b,a);c.stop=function(){clearTimeout(d)}})},function(){var a=l.createElement("input"),b=l.createElement("select"),c=b.appendChild(l.createElement("option"));a.type="checkbox",k.checkOn=""!==a.value,k.optSelected=c.selected,b.disabled=!0,k.optDisabled=!c.disabled,a=l.createElement("input"),a.value="t",a.type="radio",k.radioValue="t"===a.value}();var Yb,Zb,$b=n.expr.attrHandle;n.fn.extend({attr:function(a,b){return J(this,n.attr,a,b,arguments.length>1)},removeAttr:function(a){return this.each(function(){n.removeAttr(this,a)})}}),n.extend({attr:function(a,b,c){var d,e,f=a.nodeType;if(a&&3!==f&&8!==f&&2!==f)return typeof a.getAttribute===U?n.prop(a,b,c):(1===f&&n.isXMLDoc(a)||(b=b.toLowerCase(),d=n.attrHooks[b]||(n.expr.match.bool.test(b)?Zb:Yb)),void 0===c?d&&"get"in d&&null!==(e=d.get(a,b))?e:(e=n.find.attr(a,b),null==e?void 0:e):null!==c?d&&"set"in d&&void 0!==(e=d.set(a,c,b))?e:(a.setAttribute(b,c+""),c):void n.removeAttr(a,b))
},removeAttr:function(a,b){var c,d,e=0,f=b&&b.match(E);if(f&&1===a.nodeType)while(c=f[e++])d=n.propFix[c]||c,n.expr.match.bool.test(c)&&(a[d]=!1),a.removeAttribute(c)},attrHooks:{type:{set:function(a,b){if(!k.radioValue&&"radio"===b&&n.nodeName(a,"input")){var c=a.value;return a.setAttribute("type",b),c&&(a.value=c),b}}}}}),Zb={set:function(a,b,c){return b===!1?n.removeAttr(a,c):a.setAttribute(c,c),c}},n.each(n.expr.match.bool.source.match(/\w+/g),function(a,b){var c=$b[b]||n.find.attr;$b[b]=function(a,b,d){var e,f;return d||(f=$b[b],$b[b]=e,e=null!=c(a,b,d)?b.toLowerCase():null,$b[b]=f),e}});var _b=/^(?:input|select|textarea|button)$/i;n.fn.extend({prop:function(a,b){return J(this,n.prop,a,b,arguments.length>1)},removeProp:function(a){return this.each(function(){delete this[n.propFix[a]||a]})}}),n.extend({propFix:{"for":"htmlFor","class":"className"},prop:function(a,b,c){var d,e,f,g=a.nodeType;if(a&&3!==g&&8!==g&&2!==g)return f=1!==g||!n.isXMLDoc(a),f&&(b=n.propFix[b]||b,e=n.propHooks[b]),void 0!==c?e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:a[b]=c:e&&"get"in e&&null!==(d=e.get(a,b))?d:a[b]},propHooks:{tabIndex:{get:function(a){return a.hasAttribute("tabindex")||_b.test(a.nodeName)||a.href?a.tabIndex:-1}}}}),k.optSelected||(n.propHooks.selected={get:function(a){var b=a.parentNode;return b&&b.parentNode&&b.parentNode.selectedIndex,null}}),n.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){n.propFix[this.toLowerCase()]=this});var ac=/[\t\r\n\f]/g;n.fn.extend({addClass:function(a){var b,c,d,e,f,g,h="string"==typeof a&&a,i=0,j=this.length;if(n.isFunction(a))return this.each(function(b){n(this).addClass(a.call(this,b,this.className))});if(h)for(b=(a||"").match(E)||[];j>i;i++)if(c=this[i],d=1===c.nodeType&&(c.className?(" "+c.className+" ").replace(ac," "):" ")){f=0;while(e=b[f++])d.indexOf(" "+e+" ")<0&&(d+=e+" ");g=n.trim(d),c.className!==g&&(c.className=g)}return this},removeClass:function(a){var b,c,d,e,f,g,h=0===arguments.length||"string"==typeof a&&a,i=0,j=this.length;if(n.isFunction(a))return this.each(function(b){n(this).removeClass(a.call(this,b,this.className))});if(h)for(b=(a||"").match(E)||[];j>i;i++)if(c=this[i],d=1===c.nodeType&&(c.className?(" "+c.className+" ").replace(ac," "):"")){f=0;while(e=b[f++])while(d.indexOf(" "+e+" ")>=0)d=d.replace(" "+e+" "," ");g=a?n.trim(d):"",c.className!==g&&(c.className=g)}return this},toggleClass:function(a,b){var c=typeof a;return"boolean"==typeof b&&"string"===c?b?this.addClass(a):this.removeClass(a):this.each(n.isFunction(a)?function(c){n(this).toggleClass(a.call(this,c,this.className,b),b)}:function(){if("string"===c){var b,d=0,e=n(this),f=a.match(E)||[];while(b=f[d++])e.hasClass(b)?e.removeClass(b):e.addClass(b)}else(c===U||"boolean"===c)&&(this.className&&L.set(this,"__className__",this.className),this.className=this.className||a===!1?"":L.get(this,"__className__")||"")})},hasClass:function(a){for(var b=" "+a+" ",c=0,d=this.length;d>c;c++)if(1===this[c].nodeType&&(" "+this[c].className+" ").replace(ac," ").indexOf(b)>=0)return!0;return!1}});var bc=/\r/g;n.fn.extend({val:function(a){var b,c,d,e=this[0];{if(arguments.length)return d=n.isFunction(a),this.each(function(c){var e;1===this.nodeType&&(e=d?a.call(this,c,n(this).val()):a,null==e?e="":"number"==typeof e?e+="":n.isArray(e)&&(e=n.map(e,function(a){return null==a?"":a+""})),b=n.valHooks[this.type]||n.valHooks[this.nodeName.toLowerCase()],b&&"set"in b&&void 0!==b.set(this,e,"value")||(this.value=e))});if(e)return b=n.valHooks[e.type]||n.valHooks[e.nodeName.toLowerCase()],b&&"get"in b&&void 0!==(c=b.get(e,"value"))?c:(c=e.value,"string"==typeof c?c.replace(bc,""):null==c?"":c)}}}),n.extend({valHooks:{option:{get:function(a){var b=n.find.attr(a,"value");return null!=b?b:n.trim(n.text(a))}},select:{get:function(a){for(var b,c,d=a.options,e=a.selectedIndex,f="select-one"===a.type||0>e,g=f?null:[],h=f?e+1:d.length,i=0>e?h:f?e:0;h>i;i++)if(c=d[i],!(!c.selected&&i!==e||(k.optDisabled?c.disabled:null!==c.getAttribute("disabled"))||c.parentNode.disabled&&n.nodeName(c.parentNode,"optgroup"))){if(b=n(c).val(),f)return b;g.push(b)}return g},set:function(a,b){var c,d,e=a.options,f=n.makeArray(b),g=e.length;while(g--)d=e[g],(d.selected=n.inArray(d.value,f)>=0)&&(c=!0);return c||(a.selectedIndex=-1),f}}}}),n.each(["radio","checkbox"],function(){n.valHooks[this]={set:function(a,b){return n.isArray(b)?a.checked=n.inArray(n(a).val(),b)>=0:void 0}},k.checkOn||(n.valHooks[this].get=function(a){return null===a.getAttribute("value")?"on":a.value})}),n.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(a,b){n.fn[b]=function(a,c){return arguments.length>0?this.on(b,null,a,c):this.trigger(b)}}),n.fn.extend({hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)},bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return 1===arguments.length?this.off(a,"**"):this.off(b,a||"**",c)}});var cc=n.now(),dc=/\?/;n.parseJSON=function(a){return JSON.parse(a+"")},n.parseXML=function(a){var b,c;if(!a||"string"!=typeof a)return null;try{c=new DOMParser,b=c.parseFromString(a,"text/xml")}catch(d){b=void 0}return(!b||b.getElementsByTagName("parsererror").length)&&n.error("Invalid XML: "+a),b};var ec,fc,gc=/#.*$/,hc=/([?&])_=[^&]*/,ic=/^(.*?):[ \t]*([^\r\n]*)$/gm,jc=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,kc=/^(?:GET|HEAD)$/,lc=/^\/\//,mc=/^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,nc={},oc={},pc="*/".concat("*");try{fc=location.href}catch(qc){fc=l.createElement("a"),fc.href="",fc=fc.href}ec=mc.exec(fc.toLowerCase())||[];function rc(a){return function(b,c){"string"!=typeof b&&(c=b,b="*");var d,e=0,f=b.toLowerCase().match(E)||[];if(n.isFunction(c))while(d=f[e++])"+"===d[0]?(d=d.slice(1)||"*",(a[d]=a[d]||[]).unshift(c)):(a[d]=a[d]||[]).push(c)}}function sc(a,b,c,d){var e={},f=a===oc;function g(h){var i;return e[h]=!0,n.each(a[h]||[],function(a,h){var j=h(b,c,d);return"string"!=typeof j||f||e[j]?f?!(i=j):void 0:(b.dataTypes.unshift(j),g(j),!1)}),i}return g(b.dataTypes[0])||!e["*"]&&g("*")}function tc(a,b){var c,d,e=n.ajaxSettings.flatOptions||{};for(c in b)void 0!==b[c]&&((e[c]?a:d||(d={}))[c]=b[c]);return d&&n.extend(!0,a,d),a}function uc(a,b,c){var d,e,f,g,h=a.contents,i=a.dataTypes;while("*"===i[0])i.shift(),void 0===d&&(d=a.mimeType||b.getResponseHeader("Content-Type"));if(d)for(e in h)if(h[e]&&h[e].test(d)){i.unshift(e);break}if(i[0]in c)f=i[0];else{for(e in c){if(!i[0]||a.converters[e+" "+i[0]]){f=e;break}g||(g=e)}f=f||g}return f?(f!==i[0]&&i.unshift(f),c[f]):void 0}function vc(a,b,c,d){var e,f,g,h,i,j={},k=a.dataTypes.slice();if(k[1])for(g in a.converters)j[g.toLowerCase()]=a.converters[g];f=k.shift();while(f)if(a.responseFields[f]&&(c[a.responseFields[f]]=b),!i&&d&&a.dataFilter&&(b=a.dataFilter(b,a.dataType)),i=f,f=k.shift())if("*"===f)f=i;else if("*"!==i&&i!==f){if(g=j[i+" "+f]||j["* "+f],!g)for(e in j)if(h=e.split(" "),h[1]===f&&(g=j[i+" "+h[0]]||j["* "+h[0]])){g===!0?g=j[e]:j[e]!==!0&&(f=h[0],k.unshift(h[1]));break}if(g!==!0)if(g&&a["throws"])b=g(b);else try{b=g(b)}catch(l){return{state:"parsererror",error:g?l:"No conversion from "+i+" to "+f}}}return{state:"success",data:b}}n.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:fc,type:"GET",isLocal:jc.test(ec[1]),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":pc,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":n.parseJSON,"text xml":n.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(a,b){return b?tc(tc(a,n.ajaxSettings),b):tc(n.ajaxSettings,a)},ajaxPrefilter:rc(nc),ajaxTransport:rc(oc),ajax:function(a,b){"object"==typeof a&&(b=a,a=void 0),b=b||{};var c,d,e,f,g,h,i,j,k=n.ajaxSetup({},b),l=k.context||k,m=k.context&&(l.nodeType||l.jquery)?n(l):n.event,o=n.Deferred(),p=n.Callbacks("once memory"),q=k.statusCode||{},r={},s={},t=0,u="canceled",v={readyState:0,getResponseHeader:function(a){var b;if(2===t){if(!f){f={};while(b=ic.exec(e))f[b[1].toLowerCase()]=b[2]}b=f[a.toLowerCase()]}return null==b?null:b},getAllResponseHeaders:function(){return 2===t?e:null},setRequestHeader:function(a,b){var c=a.toLowerCase();return t||(a=s[c]=s[c]||a,r[a]=b),this},overrideMimeType:function(a){return t||(k.mimeType=a),this},statusCode:function(a){var b;if(a)if(2>t)for(b in a)q[b]=[q[b],a[b]];else v.always(a[v.status]);return this},abort:function(a){var b=a||u;return c&&c.abort(b),x(0,b),this}};if(o.promise(v).complete=p.add,v.success=v.done,v.error=v.fail,k.url=((a||k.url||fc)+"").replace(gc,"").replace(lc,ec[1]+"//"),k.type=b.method||b.type||k.method||k.type,k.dataTypes=n.trim(k.dataType||"*").toLowerCase().match(E)||[""],null==k.crossDomain&&(h=mc.exec(k.url.toLowerCase()),k.crossDomain=!(!h||h[1]===ec[1]&&h[2]===ec[2]&&(h[3]||("http:"===h[1]?"80":"443"))===(ec[3]||("http:"===ec[1]?"80":"443")))),k.data&&k.processData&&"string"!=typeof k.data&&(k.data=n.param(k.data,k.traditional)),sc(nc,k,b,v),2===t)return v;i=k.global,i&&0===n.active++&&n.event.trigger("ajaxStart"),k.type=k.type.toUpperCase(),k.hasContent=!kc.test(k.type),d=k.url,k.hasContent||(k.data&&(d=k.url+=(dc.test(d)?"&":"?")+k.data,delete k.data),k.cache===!1&&(k.url=hc.test(d)?d.replace(hc,"$1_="+cc++):d+(dc.test(d)?"&":"?")+"_="+cc++)),k.ifModified&&(n.lastModified[d]&&v.setRequestHeader("If-Modified-Since",n.lastModified[d]),n.etag[d]&&v.setRequestHeader("If-None-Match",n.etag[d])),(k.data&&k.hasContent&&k.contentType!==!1||b.contentType)&&v.setRequestHeader("Content-Type",k.contentType),v.setRequestHeader("Accept",k.dataTypes[0]&&k.accepts[k.dataTypes[0]]?k.accepts[k.dataTypes[0]]+("*"!==k.dataTypes[0]?", "+pc+"; q=0.01":""):k.accepts["*"]);for(j in k.headers)v.setRequestHeader(j,k.headers[j]);if(k.beforeSend&&(k.beforeSend.call(l,v,k)===!1||2===t))return v.abort();u="abort";for(j in{success:1,error:1,complete:1})v[j](k[j]);if(c=sc(oc,k,b,v)){v.readyState=1,i&&m.trigger("ajaxSend",[v,k]),k.async&&k.timeout>0&&(g=setTimeout(function(){v.abort("timeout")},k.timeout));try{t=1,c.send(r,x)}catch(w){if(!(2>t))throw w;x(-1,w)}}else x(-1,"No Transport");function x(a,b,f,h){var j,r,s,u,w,x=b;2!==t&&(t=2,g&&clearTimeout(g),c=void 0,e=h||"",v.readyState=a>0?4:0,j=a>=200&&300>a||304===a,f&&(u=uc(k,v,f)),u=vc(k,u,v,j),j?(k.ifModified&&(w=v.getResponseHeader("Last-Modified"),w&&(n.lastModified[d]=w),w=v.getResponseHeader("etag"),w&&(n.etag[d]=w)),204===a||"HEAD"===k.type?x="nocontent":304===a?x="notmodified":(x=u.state,r=u.data,s=u.error,j=!s)):(s=x,(a||!x)&&(x="error",0>a&&(a=0))),v.status=a,v.statusText=(b||x)+"",j?o.resolveWith(l,[r,x,v]):o.rejectWith(l,[v,x,s]),v.statusCode(q),q=void 0,i&&m.trigger(j?"ajaxSuccess":"ajaxError",[v,k,j?r:s]),p.fireWith(l,[v,x]),i&&(m.trigger("ajaxComplete",[v,k]),--n.active||n.event.trigger("ajaxStop")))}return v},getJSON:function(a,b,c){return n.get(a,b,c,"json")},getScript:function(a,b){return n.get(a,void 0,b,"script")}}),n.each(["get","post"],function(a,b){n[b]=function(a,c,d,e){return n.isFunction(c)&&(e=e||d,d=c,c=void 0),n.ajax({url:a,type:b,dataType:e,data:c,success:d})}}),n.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(a,b){n.fn[b]=function(a){return this.on(b,a)}}),n._evalUrl=function(a){return n.ajax({url:a,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0})},n.fn.extend({wrapAll:function(a){var b;return n.isFunction(a)?this.each(function(b){n(this).wrapAll(a.call(this,b))}):(this[0]&&(b=n(a,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstElementChild)a=a.firstElementChild;return a}).append(this)),this)},wrapInner:function(a){return this.each(n.isFunction(a)?function(b){n(this).wrapInner(a.call(this,b))}:function(){var b=n(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=n.isFunction(a);return this.each(function(c){n(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(){return this.parent().each(function(){n.nodeName(this,"body")||n(this).replaceWith(this.childNodes)}).end()}}),n.expr.filters.hidden=function(a){return a.offsetWidth<=0&&a.offsetHeight<=0},n.expr.filters.visible=function(a){return!n.expr.filters.hidden(a)};var wc=/%20/g,xc=/\[\]$/,yc=/\r?\n/g,zc=/^(?:submit|button|image|reset|file)$/i,Ac=/^(?:input|select|textarea|keygen)/i;function Bc(a,b,c,d){var e;if(n.isArray(b))n.each(b,function(b,e){c||xc.test(a)?d(a,e):Bc(a+"["+("object"==typeof e?b:"")+"]",e,c,d)});else if(c||"object"!==n.type(b))d(a,b);else for(e in b)Bc(a+"["+e+"]",b[e],c,d)}n.param=function(a,b){var c,d=[],e=function(a,b){b=n.isFunction(b)?b():null==b?"":b,d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};if(void 0===b&&(b=n.ajaxSettings&&n.ajaxSettings.traditional),n.isArray(a)||a.jquery&&!n.isPlainObject(a))n.each(a,function(){e(this.name,this.value)});else for(c in a)Bc(c,a[c],b,e);return d.join("&").replace(wc,"+")},n.fn.extend({serialize:function(){return n.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var a=n.prop(this,"elements");return a?n.makeArray(a):this}).filter(function(){var a=this.type;return this.name&&!n(this).is(":disabled")&&Ac.test(this.nodeName)&&!zc.test(a)&&(this.checked||!T.test(a))}).map(function(a,b){var c=n(this).val();return null==c?null:n.isArray(c)?n.map(c,function(a){return{name:b.name,value:a.replace(yc,"\r\n")}}):{name:b.name,value:c.replace(yc,"\r\n")}}).get()}}),n.ajaxSettings.xhr=function(){try{return new XMLHttpRequest}catch(a){}};var Cc=0,Dc={},Ec={0:200,1223:204},Fc=n.ajaxSettings.xhr();a.ActiveXObject&&n(a).on("unload",function(){for(var a in Dc)Dc[a]()}),k.cors=!!Fc&&"withCredentials"in Fc,k.ajax=Fc=!!Fc,n.ajaxTransport(function(a){var b;return k.cors||Fc&&!a.crossDomain?{send:function(c,d){var e,f=a.xhr(),g=++Cc;if(f.open(a.type,a.url,a.async,a.username,a.password),a.xhrFields)for(e in a.xhrFields)f[e]=a.xhrFields[e];a.mimeType&&f.overrideMimeType&&f.overrideMimeType(a.mimeType),a.crossDomain||c["X-Requested-With"]||(c["X-Requested-With"]="XMLHttpRequest");for(e in c)f.setRequestHeader(e,c[e]);b=function(a){return function(){b&&(delete Dc[g],b=f.onload=f.onerror=null,"abort"===a?f.abort():"error"===a?d(f.status,f.statusText):d(Ec[f.status]||f.status,f.statusText,"string"==typeof f.responseText?{text:f.responseText}:void 0,f.getAllResponseHeaders()))}},f.onload=b(),f.onerror=b("error"),b=Dc[g]=b("abort");try{f.send(a.hasContent&&a.data||null)}catch(h){if(b)throw h}},abort:function(){b&&b()}}:void 0}),n.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/(?:java|ecma)script/},converters:{"text script":function(a){return n.globalEval(a),a}}}),n.ajaxPrefilter("script",function(a){void 0===a.cache&&(a.cache=!1),a.crossDomain&&(a.type="GET")}),n.ajaxTransport("script",function(a){if(a.crossDomain){var b,c;return{send:function(d,e){b=n("<script>").prop({async:!0,charset:a.scriptCharset,src:a.url}).on("load error",c=function(a){b.remove(),c=null,a&&e("error"===a.type?404:200,a.type)}),l.head.appendChild(b[0])},abort:function(){c&&c()}}}});var Gc=[],Hc=/(=)\?(?=&|$)|\?\?/;n.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var a=Gc.pop()||n.expando+"_"+cc++;return this[a]=!0,a}}),n.ajaxPrefilter("json jsonp",function(b,c,d){var e,f,g,h=b.jsonp!==!1&&(Hc.test(b.url)?"url":"string"==typeof b.data&&!(b.contentType||"").indexOf("application/x-www-form-urlencoded")&&Hc.test(b.data)&&"data");return h||"jsonp"===b.dataTypes[0]?(e=b.jsonpCallback=n.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,h?b[h]=b[h].replace(Hc,"$1"+e):b.jsonp!==!1&&(b.url+=(dc.test(b.url)?"&":"?")+b.jsonp+"="+e),b.converters["script json"]=function(){return g||n.error(e+" was not called"),g[0]},b.dataTypes[0]="json",f=a[e],a[e]=function(){g=arguments},d.always(function(){a[e]=f,b[e]&&(b.jsonpCallback=c.jsonpCallback,Gc.push(e)),g&&n.isFunction(f)&&f(g[0]),g=f=void 0}),"script"):void 0}),n.parseHTML=function(a,b,c){if(!a||"string"!=typeof a)return null;"boolean"==typeof b&&(c=b,b=!1),b=b||l;var d=v.exec(a),e=!c&&[];return d?[b.createElement(d[1])]:(d=n.buildFragment([a],b,e),e&&e.length&&n(e).remove(),n.merge([],d.childNodes))};var Ic=n.fn.load;n.fn.load=function(a,b,c){if("string"!=typeof a&&Ic)return Ic.apply(this,arguments);var d,e,f,g=this,h=a.indexOf(" ");return h>=0&&(d=n.trim(a.slice(h)),a=a.slice(0,h)),n.isFunction(b)?(c=b,b=void 0):b&&"object"==typeof b&&(e="POST"),g.length>0&&n.ajax({url:a,type:e,dataType:"html",data:b}).done(function(a){f=arguments,g.html(d?n("<div>").append(n.parseHTML(a)).find(d):a)}).complete(c&&function(a,b){g.each(c,f||[a.responseText,b,a])}),this},n.expr.filters.animated=function(a){return n.grep(n.timers,function(b){return a===b.elem}).length};var Jc=a.document.documentElement;function Kc(a){return n.isWindow(a)?a:9===a.nodeType&&a.defaultView}n.offset={setOffset:function(a,b,c){var d,e,f,g,h,i,j,k=n.css(a,"position"),l=n(a),m={};"static"===k&&(a.style.position="relative"),h=l.offset(),f=n.css(a,"top"),i=n.css(a,"left"),j=("absolute"===k||"fixed"===k)&&(f+i).indexOf("auto")>-1,j?(d=l.position(),g=d.top,e=d.left):(g=parseFloat(f)||0,e=parseFloat(i)||0),n.isFunction(b)&&(b=b.call(a,c,h)),null!=b.top&&(m.top=b.top-h.top+g),null!=b.left&&(m.left=b.left-h.left+e),"using"in b?b.using.call(a,m):l.css(m)}},n.fn.extend({offset:function(a){if(arguments.length)return void 0===a?this:this.each(function(b){n.offset.setOffset(this,a,b)});var b,c,d=this[0],e={top:0,left:0},f=d&&d.ownerDocument;if(f)return b=f.documentElement,n.contains(b,d)?(typeof d.getBoundingClientRect!==U&&(e=d.getBoundingClientRect()),c=Kc(f),{top:e.top+c.pageYOffset-b.clientTop,left:e.left+c.pageXOffset-b.clientLeft}):e},position:function(){if(this[0]){var a,b,c=this[0],d={top:0,left:0};return"fixed"===n.css(c,"position")?b=c.getBoundingClientRect():(a=this.offsetParent(),b=this.offset(),n.nodeName(a[0],"html")||(d=a.offset()),d.top+=n.css(a[0],"borderTopWidth",!0),d.left+=n.css(a[0],"borderLeftWidth",!0)),{top:b.top-d.top-n.css(c,"marginTop",!0),left:b.left-d.left-n.css(c,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var a=this.offsetParent||Jc;while(a&&!n.nodeName(a,"html")&&"static"===n.css(a,"position"))a=a.offsetParent;return a||Jc})}}),n.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(b,c){var d="pageYOffset"===c;n.fn[b]=function(e){return J(this,function(b,e,f){var g=Kc(b);return void 0===f?g?g[c]:b[e]:void(g?g.scrollTo(d?a.pageXOffset:f,d?f:a.pageYOffset):b[e]=f)},b,e,arguments.length,null)}}),n.each(["top","left"],function(a,b){n.cssHooks[b]=yb(k.pixelPosition,function(a,c){return c?(c=xb(a,b),vb.test(c)?n(a).position()[b]+"px":c):void 0})}),n.each({Height:"height",Width:"width"},function(a,b){n.each({padding:"inner"+a,content:b,"":"outer"+a},function(c,d){n.fn[d]=function(d,e){var f=arguments.length&&(c||"boolean"!=typeof d),g=c||(d===!0||e===!0?"margin":"border");return J(this,function(b,c,d){var e;return n.isWindow(b)?b.document.documentElement["client"+a]:9===b.nodeType?(e=b.documentElement,Math.max(b.body["scroll"+a],e["scroll"+a],b.body["offset"+a],e["offset"+a],e["client"+a])):void 0===d?n.css(b,c,g):n.style(b,c,d,g)},b,f?d:void 0,f,null)}})}),n.fn.size=function(){return this.length},n.fn.andSelf=n.fn.addBack,"function"==typeof define&&define.amd&&define("jquery",[],function(){return n});var Lc=a.jQuery,Mc=a.$;return n.noConflict=function(b){return a.$===n&&(a.$=Mc),b&&a.jQuery===n&&(a.jQuery=Lc),n},typeof b===U&&(a.jQuery=a.$=n),n});

/*! jQuery UI - v1.11.0 - 2014-07-09
* http://jqueryui.com
* Includes: core.js, widget.js, mouse.js, draggable.js, droppable.js, sortable.js
* Copyright 2014 jQuery Foundation and other contributors; Licensed MIT */

(function(e){"function"==typeof define&&define.amd?define(["jquery"],e):e(jQuery)})(function(e){function t(t,s){var a,n,o,r=t.nodeName.toLowerCase();return"area"===r?(a=t.parentNode,n=a.name,t.href&&n&&"map"===a.nodeName.toLowerCase()?(o=e("img[usemap=#"+n+"]")[0],!!o&&i(o)):!1):(/input|select|textarea|button|object/.test(r)?!t.disabled:"a"===r?t.href||s:s)&&i(t)}function i(t){return e.expr.filters.visible(t)&&!e(t).parents().addBack().filter(function(){return"hidden"===e.css(this,"visibility")}).length}e.ui=e.ui||{},e.extend(e.ui,{version:"1.11.0",keyCode:{BACKSPACE:8,COMMA:188,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,LEFT:37,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SPACE:32,TAB:9,UP:38}}),e.fn.extend({scrollParent:function(){var t=this.css("position"),i="absolute"===t,s=this.parents().filter(function(){var t=e(this);return i&&"static"===t.css("position")?!1:/(auto|scroll)/.test(t.css("overflow")+t.css("overflow-y")+t.css("overflow-x"))}).eq(0);return"fixed"!==t&&s.length?s:e(this[0].ownerDocument||document)},uniqueId:function(){var e=0;return function(){return this.each(function(){this.id||(this.id="ui-id-"+ ++e)})}}(),removeUniqueId:function(){return this.each(function(){/^ui-id-\d+$/.test(this.id)&&e(this).removeAttr("id")})}}),e.extend(e.expr[":"],{data:e.expr.createPseudo?e.expr.createPseudo(function(t){return function(i){return!!e.data(i,t)}}):function(t,i,s){return!!e.data(t,s[3])},focusable:function(i){return t(i,!isNaN(e.attr(i,"tabindex")))},tabbable:function(i){var s=e.attr(i,"tabindex"),a=isNaN(s);return(a||s>=0)&&t(i,!a)}}),e("<a>").outerWidth(1).jquery||e.each(["Width","Height"],function(t,i){function s(t,i,s,n){return e.each(a,function(){i-=parseFloat(e.css(t,"padding"+this))||0,s&&(i-=parseFloat(e.css(t,"border"+this+"Width"))||0),n&&(i-=parseFloat(e.css(t,"margin"+this))||0)}),i}var a="Width"===i?["Left","Right"]:["Top","Bottom"],n=i.toLowerCase(),o={innerWidth:e.fn.innerWidth,innerHeight:e.fn.innerHeight,outerWidth:e.fn.outerWidth,outerHeight:e.fn.outerHeight};e.fn["inner"+i]=function(t){return void 0===t?o["inner"+i].call(this):this.each(function(){e(this).css(n,s(this,t)+"px")})},e.fn["outer"+i]=function(t,a){return"number"!=typeof t?o["outer"+i].call(this,t):this.each(function(){e(this).css(n,s(this,t,!0,a)+"px")})}}),e.fn.addBack||(e.fn.addBack=function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}),e("<a>").data("a-b","a").removeData("a-b").data("a-b")&&(e.fn.removeData=function(t){return function(i){return arguments.length?t.call(this,e.camelCase(i)):t.call(this)}}(e.fn.removeData)),e.ui.ie=!!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()),e.fn.extend({focus:function(t){return function(i,s){return"number"==typeof i?this.each(function(){var t=this;setTimeout(function(){e(t).focus(),s&&s.call(t)},i)}):t.apply(this,arguments)}}(e.fn.focus),disableSelection:function(){var e="onselectstart"in document.createElement("div")?"selectstart":"mousedown";return function(){return this.bind(e+".ui-disableSelection",function(e){e.preventDefault()})}}(),enableSelection:function(){return this.unbind(".ui-disableSelection")},zIndex:function(t){if(void 0!==t)return this.css("zIndex",t);if(this.length)for(var i,s,a=e(this[0]);a.length&&a[0]!==document;){if(i=a.css("position"),("absolute"===i||"relative"===i||"fixed"===i)&&(s=parseInt(a.css("zIndex"),10),!isNaN(s)&&0!==s))return s;a=a.parent()}return 0}}),e.ui.plugin={add:function(t,i,s){var a,n=e.ui[t].prototype;for(a in s)n.plugins[a]=n.plugins[a]||[],n.plugins[a].push([i,s[a]])},call:function(e,t,i,s){var a,n=e.plugins[t];if(n&&(s||e.element[0].parentNode&&11!==e.element[0].parentNode.nodeType))for(a=0;n.length>a;a++)e.options[n[a][0]]&&n[a][1].apply(e.element,i)}};var s=0,a=Array.prototype.slice;e.cleanData=function(t){return function(i){for(var s,a=0;null!=(s=i[a]);a++)try{e(s).triggerHandler("remove")}catch(n){}t(i)}}(e.cleanData),e.widget=function(t,i,s){var a,n,o,r,h={},l=t.split(".")[0];return t=t.split(".")[1],a=l+"-"+t,s||(s=i,i=e.Widget),e.expr[":"][a.toLowerCase()]=function(t){return!!e.data(t,a)},e[l]=e[l]||{},n=e[l][t],o=e[l][t]=function(e,t){return this._createWidget?(arguments.length&&this._createWidget(e,t),void 0):new o(e,t)},e.extend(o,n,{version:s.version,_proto:e.extend({},s),_childConstructors:[]}),r=new i,r.options=e.widget.extend({},r.options),e.each(s,function(t,s){return e.isFunction(s)?(h[t]=function(){var e=function(){return i.prototype[t].apply(this,arguments)},a=function(e){return i.prototype[t].apply(this,e)};return function(){var t,i=this._super,n=this._superApply;return this._super=e,this._superApply=a,t=s.apply(this,arguments),this._super=i,this._superApply=n,t}}(),void 0):(h[t]=s,void 0)}),o.prototype=e.widget.extend(r,{widgetEventPrefix:n?r.widgetEventPrefix||t:t},h,{constructor:o,namespace:l,widgetName:t,widgetFullName:a}),n?(e.each(n._childConstructors,function(t,i){var s=i.prototype;e.widget(s.namespace+"."+s.widgetName,o,i._proto)}),delete n._childConstructors):i._childConstructors.push(o),e.widget.bridge(t,o),o},e.widget.extend=function(t){for(var i,s,n=a.call(arguments,1),o=0,r=n.length;r>o;o++)for(i in n[o])s=n[o][i],n[o].hasOwnProperty(i)&&void 0!==s&&(t[i]=e.isPlainObject(s)?e.isPlainObject(t[i])?e.widget.extend({},t[i],s):e.widget.extend({},s):s);return t},e.widget.bridge=function(t,i){var s=i.prototype.widgetFullName||t;e.fn[t]=function(n){var o="string"==typeof n,r=a.call(arguments,1),h=this;return n=!o&&r.length?e.widget.extend.apply(null,[n].concat(r)):n,o?this.each(function(){var i,a=e.data(this,s);return"instance"===n?(h=a,!1):a?e.isFunction(a[n])&&"_"!==n.charAt(0)?(i=a[n].apply(a,r),i!==a&&void 0!==i?(h=i&&i.jquery?h.pushStack(i.get()):i,!1):void 0):e.error("no such method '"+n+"' for "+t+" widget instance"):e.error("cannot call methods on "+t+" prior to initialization; "+"attempted to call method '"+n+"'")}):this.each(function(){var t=e.data(this,s);t?(t.option(n||{}),t._init&&t._init()):e.data(this,s,new i(n,this))}),h}},e.Widget=function(){},e.Widget._childConstructors=[],e.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",defaultElement:"<div>",options:{disabled:!1,create:null},_createWidget:function(t,i){i=e(i||this.defaultElement||this)[0],this.element=e(i),this.uuid=s++,this.eventNamespace="."+this.widgetName+this.uuid,this.options=e.widget.extend({},this.options,this._getCreateOptions(),t),this.bindings=e(),this.hoverable=e(),this.focusable=e(),i!==this&&(e.data(i,this.widgetFullName,this),this._on(!0,this.element,{remove:function(e){e.target===i&&this.destroy()}}),this.document=e(i.style?i.ownerDocument:i.document||i),this.window=e(this.document[0].defaultView||this.document[0].parentWindow)),this._create(),this._trigger("create",null,this._getCreateEventData()),this._init()},_getCreateOptions:e.noop,_getCreateEventData:e.noop,_create:e.noop,_init:e.noop,destroy:function(){this._destroy(),this.element.unbind(this.eventNamespace).removeData(this.widgetFullName).removeData(e.camelCase(this.widgetFullName)),this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName+"-disabled "+"ui-state-disabled"),this.bindings.unbind(this.eventNamespace),this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus")},_destroy:e.noop,widget:function(){return this.element},option:function(t,i){var s,a,n,o=t;if(0===arguments.length)return e.widget.extend({},this.options);if("string"==typeof t)if(o={},s=t.split("."),t=s.shift(),s.length){for(a=o[t]=e.widget.extend({},this.options[t]),n=0;s.length-1>n;n++)a[s[n]]=a[s[n]]||{},a=a[s[n]];if(t=s.pop(),1===arguments.length)return void 0===a[t]?null:a[t];a[t]=i}else{if(1===arguments.length)return void 0===this.options[t]?null:this.options[t];o[t]=i}return this._setOptions(o),this},_setOptions:function(e){var t;for(t in e)this._setOption(t,e[t]);return this},_setOption:function(e,t){return this.options[e]=t,"disabled"===e&&(this.widget().toggleClass(this.widgetFullName+"-disabled",!!t),t&&(this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus"))),this},enable:function(){return this._setOptions({disabled:!1})},disable:function(){return this._setOptions({disabled:!0})},_on:function(t,i,s){var a,n=this;"boolean"!=typeof t&&(s=i,i=t,t=!1),s?(i=a=e(i),this.bindings=this.bindings.add(i)):(s=i,i=this.element,a=this.widget()),e.each(s,function(s,o){function r(){return t||n.options.disabled!==!0&&!e(this).hasClass("ui-state-disabled")?("string"==typeof o?n[o]:o).apply(n,arguments):void 0}"string"!=typeof o&&(r.guid=o.guid=o.guid||r.guid||e.guid++);var h=s.match(/^([\w:-]*)\s*(.*)$/),l=h[1]+n.eventNamespace,u=h[2];u?a.delegate(u,l,r):i.bind(l,r)})},_off:function(e,t){t=(t||"").split(" ").join(this.eventNamespace+" ")+this.eventNamespace,e.unbind(t).undelegate(t)},_delay:function(e,t){function i(){return("string"==typeof e?s[e]:e).apply(s,arguments)}var s=this;return setTimeout(i,t||0)},_hoverable:function(t){this.hoverable=this.hoverable.add(t),this._on(t,{mouseenter:function(t){e(t.currentTarget).addClass("ui-state-hover")},mouseleave:function(t){e(t.currentTarget).removeClass("ui-state-hover")}})},_focusable:function(t){this.focusable=this.focusable.add(t),this._on(t,{focusin:function(t){e(t.currentTarget).addClass("ui-state-focus")},focusout:function(t){e(t.currentTarget).removeClass("ui-state-focus")}})},_trigger:function(t,i,s){var a,n,o=this.options[t];if(s=s||{},i=e.Event(i),i.type=(t===this.widgetEventPrefix?t:this.widgetEventPrefix+t).toLowerCase(),i.target=this.element[0],n=i.originalEvent)for(a in n)a in i||(i[a]=n[a]);return this.element.trigger(i,s),!(e.isFunction(o)&&o.apply(this.element[0],[i].concat(s))===!1||i.isDefaultPrevented())}},e.each({show:"fadeIn",hide:"fadeOut"},function(t,i){e.Widget.prototype["_"+t]=function(s,a,n){"string"==typeof a&&(a={effect:a});var o,r=a?a===!0||"number"==typeof a?i:a.effect||i:t;a=a||{},"number"==typeof a&&(a={duration:a}),o=!e.isEmptyObject(a),a.complete=n,a.delay&&s.delay(a.delay),o&&e.effects&&e.effects.effect[r]?s[t](a):r!==t&&s[r]?s[r](a.duration,a.easing,n):s.queue(function(i){e(this)[t](),n&&n.call(s[0]),i()})}}),e.widget;var n=!1;e(document).mouseup(function(){n=!1}),e.widget("ui.mouse",{version:"1.11.0",options:{cancel:"input,textarea,button,select,option",distance:1,delay:0},_mouseInit:function(){var t=this;this.element.bind("mousedown."+this.widgetName,function(e){return t._mouseDown(e)}).bind("click."+this.widgetName,function(i){return!0===e.data(i.target,t.widgetName+".preventClickEvent")?(e.removeData(i.target,t.widgetName+".preventClickEvent"),i.stopImmediatePropagation(),!1):void 0}),this.started=!1},_mouseDestroy:function(){this.element.unbind("."+this.widgetName),this._mouseMoveDelegate&&this.document.unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate)},_mouseDown:function(t){if(!n){this._mouseStarted&&this._mouseUp(t),this._mouseDownEvent=t;var i=this,s=1===t.which,a="string"==typeof this.options.cancel&&t.target.nodeName?e(t.target).closest(this.options.cancel).length:!1;return s&&!a&&this._mouseCapture(t)?(this.mouseDelayMet=!this.options.delay,this.mouseDelayMet||(this._mouseDelayTimer=setTimeout(function(){i.mouseDelayMet=!0},this.options.delay)),this._mouseDistanceMet(t)&&this._mouseDelayMet(t)&&(this._mouseStarted=this._mouseStart(t)!==!1,!this._mouseStarted)?(t.preventDefault(),!0):(!0===e.data(t.target,this.widgetName+".preventClickEvent")&&e.removeData(t.target,this.widgetName+".preventClickEvent"),this._mouseMoveDelegate=function(e){return i._mouseMove(e)},this._mouseUpDelegate=function(e){return i._mouseUp(e)},this.document.bind("mousemove."+this.widgetName,this._mouseMoveDelegate).bind("mouseup."+this.widgetName,this._mouseUpDelegate),t.preventDefault(),n=!0,!0)):!0}},_mouseMove:function(t){return e.ui.ie&&(!document.documentMode||9>document.documentMode)&&!t.button?this._mouseUp(t):t.which?this._mouseStarted?(this._mouseDrag(t),t.preventDefault()):(this._mouseDistanceMet(t)&&this._mouseDelayMet(t)&&(this._mouseStarted=this._mouseStart(this._mouseDownEvent,t)!==!1,this._mouseStarted?this._mouseDrag(t):this._mouseUp(t)),!this._mouseStarted):this._mouseUp(t)},_mouseUp:function(t){return this.document.unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate),this._mouseStarted&&(this._mouseStarted=!1,t.target===this._mouseDownEvent.target&&e.data(t.target,this.widgetName+".preventClickEvent",!0),this._mouseStop(t)),n=!1,!1},_mouseDistanceMet:function(e){return Math.max(Math.abs(this._mouseDownEvent.pageX-e.pageX),Math.abs(this._mouseDownEvent.pageY-e.pageY))>=this.options.distance},_mouseDelayMet:function(){return this.mouseDelayMet},_mouseStart:function(){},_mouseDrag:function(){},_mouseStop:function(){},_mouseCapture:function(){return!0}}),e.widget("ui.draggable",e.ui.mouse,{version:"1.11.0",widgetEventPrefix:"drag",options:{addClasses:!0,appendTo:"parent",axis:!1,connectToSortable:!1,containment:!1,cursor:"auto",cursorAt:!1,grid:!1,handle:!1,helper:"original",iframeFix:!1,opacity:!1,refreshPositions:!1,revert:!1,revertDuration:500,scope:"default",scroll:!0,scrollSensitivity:20,scrollSpeed:20,snap:!1,snapMode:"both",snapTolerance:20,stack:!1,zIndex:!1,drag:null,start:null,stop:null},_create:function(){"original"!==this.options.helper||/^(?:r|a|f)/.test(this.element.css("position"))||(this.element[0].style.position="relative"),this.options.addClasses&&this.element.addClass("ui-draggable"),this.options.disabled&&this.element.addClass("ui-draggable-disabled"),this._setHandleClassName(),this._mouseInit()},_setOption:function(e,t){this._super(e,t),"handle"===e&&this._setHandleClassName()},_destroy:function(){return(this.helper||this.element).is(".ui-draggable-dragging")?(this.destroyOnClear=!0,void 0):(this.element.removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled"),this._removeHandleClassName(),this._mouseDestroy(),void 0)},_mouseCapture:function(t){var i=this.document[0],s=this.options;try{i.activeElement&&"body"!==i.activeElement.nodeName.toLowerCase()&&e(i.activeElement).blur()}catch(a){}return this.helper||s.disabled||e(t.target).closest(".ui-resizable-handle").length>0?!1:(this.handle=this._getHandle(t),this.handle?(e(s.iframeFix===!0?"iframe":s.iframeFix).each(function(){e("<div class='ui-draggable-iframeFix' style='background: #fff;'></div>").css({width:this.offsetWidth+"px",height:this.offsetHeight+"px",position:"absolute",opacity:"0.001",zIndex:1e3}).css(e(this).offset()).appendTo("body")}),!0):!1)},_mouseStart:function(t){var i=this.options;return this.helper=this._createHelper(t),this.helper.addClass("ui-draggable-dragging"),this._cacheHelperProportions(),e.ui.ddmanager&&(e.ui.ddmanager.current=this),this._cacheMargins(),this.cssPosition=this.helper.css("position"),this.scrollParent=this.helper.scrollParent(),this.offsetParent=this.helper.offsetParent(),this.offsetParentCssPosition=this.offsetParent.css("position"),this.offset=this.positionAbs=this.element.offset(),this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left},this.offset.scroll=!1,e.extend(this.offset,{click:{left:t.pageX-this.offset.left,top:t.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()}),this.originalPosition=this.position=this._generatePosition(t,!1),this.originalPageX=t.pageX,this.originalPageY=t.pageY,i.cursorAt&&this._adjustOffsetFromHelper(i.cursorAt),this._setContainment(),this._trigger("start",t)===!1?(this._clear(),!1):(this._cacheHelperProportions(),e.ui.ddmanager&&!i.dropBehaviour&&e.ui.ddmanager.prepareOffsets(this,t),this._mouseDrag(t,!0),e.ui.ddmanager&&e.ui.ddmanager.dragStart(this,t),!0)},_mouseDrag:function(t,i){if("fixed"===this.offsetParentCssPosition&&(this.offset.parent=this._getParentOffset()),this.position=this._generatePosition(t,!0),this.positionAbs=this._convertPositionTo("absolute"),!i){var s=this._uiHash();if(this._trigger("drag",t,s)===!1)return this._mouseUp({}),!1;this.position=s.position}return this.helper[0].style.left=this.position.left+"px",this.helper[0].style.top=this.position.top+"px",e.ui.ddmanager&&e.ui.ddmanager.drag(this,t),!1},_mouseStop:function(t){var i=this,s=!1;return e.ui.ddmanager&&!this.options.dropBehaviour&&(s=e.ui.ddmanager.drop(this,t)),this.dropped&&(s=this.dropped,this.dropped=!1),"invalid"===this.options.revert&&!s||"valid"===this.options.revert&&s||this.options.revert===!0||e.isFunction(this.options.revert)&&this.options.revert.call(this.element,s)?e(this.helper).animate(this.originalPosition,parseInt(this.options.revertDuration,10),function(){i._trigger("stop",t)!==!1&&i._clear()}):this._trigger("stop",t)!==!1&&this._clear(),!1},_mouseUp:function(t){return e("div.ui-draggable-iframeFix").each(function(){this.parentNode.removeChild(this)}),e.ui.ddmanager&&e.ui.ddmanager.dragStop(this,t),this.element.focus(),e.ui.mouse.prototype._mouseUp.call(this,t)},cancel:function(){return this.helper.is(".ui-draggable-dragging")?this._mouseUp({}):this._clear(),this},_getHandle:function(t){return this.options.handle?!!e(t.target).closest(this.element.find(this.options.handle)).length:!0},_setHandleClassName:function(){this._removeHandleClassName(),e(this.options.handle||this.element).addClass("ui-draggable-handle")},_removeHandleClassName:function(){this.element.find(".ui-draggable-handle").addBack().removeClass("ui-draggable-handle")},_createHelper:function(t){var i=this.options,s=e.isFunction(i.helper)?e(i.helper.apply(this.element[0],[t])):"clone"===i.helper?this.element.clone().removeAttr("id"):this.element;return s.parents("body").length||s.appendTo("parent"===i.appendTo?this.element[0].parentNode:i.appendTo),s[0]===this.element[0]||/(fixed|absolute)/.test(s.css("position"))||s.css("position","absolute"),s},_adjustOffsetFromHelper:function(t){"string"==typeof t&&(t=t.split(" ")),e.isArray(t)&&(t={left:+t[0],top:+t[1]||0}),"left"in t&&(this.offset.click.left=t.left+this.margins.left),"right"in t&&(this.offset.click.left=this.helperProportions.width-t.right+this.margins.left),"top"in t&&(this.offset.click.top=t.top+this.margins.top),"bottom"in t&&(this.offset.click.top=this.helperProportions.height-t.bottom+this.margins.top)},_isRootNode:function(e){return/(html|body)/i.test(e.tagName)||e===this.document[0]},_getParentOffset:function(){var t=this.offsetParent.offset(),i=this.document[0];return"absolute"===this.cssPosition&&this.scrollParent[0]!==i&&e.contains(this.scrollParent[0],this.offsetParent[0])&&(t.left+=this.scrollParent.scrollLeft(),t.top+=this.scrollParent.scrollTop()),this._isRootNode(this.offsetParent[0])&&(t={top:0,left:0}),{top:t.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:t.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if("relative"!==this.cssPosition)return{top:0,left:0};var e=this.element.position(),t=this._isRootNode(this.scrollParent[0]);return{top:e.top-(parseInt(this.helper.css("top"),10)||0)+(t?0:this.scrollParent.scrollTop()),left:e.left-(parseInt(this.helper.css("left"),10)||0)+(t?0:this.scrollParent.scrollLeft())}},_cacheMargins:function(){this.margins={left:parseInt(this.element.css("marginLeft"),10)||0,top:parseInt(this.element.css("marginTop"),10)||0,right:parseInt(this.element.css("marginRight"),10)||0,bottom:parseInt(this.element.css("marginBottom"),10)||0}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var t,i,s,a=this.options,n=this.document[0];return this.relative_container=null,a.containment?"window"===a.containment?(this.containment=[e(window).scrollLeft()-this.offset.relative.left-this.offset.parent.left,e(window).scrollTop()-this.offset.relative.top-this.offset.parent.top,e(window).scrollLeft()+e(window).width()-this.helperProportions.width-this.margins.left,e(window).scrollTop()+(e(window).height()||n.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top],void 0):"document"===a.containment?(this.containment=[0,0,e(n).width()-this.helperProportions.width-this.margins.left,(e(n).height()||n.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top],void 0):a.containment.constructor===Array?(this.containment=a.containment,void 0):("parent"===a.containment&&(a.containment=this.helper[0].parentNode),i=e(a.containment),s=i[0],s&&(t="hidden"!==i.css("overflow"),this.containment=[(parseInt(i.css("borderLeftWidth"),10)||0)+(parseInt(i.css("paddingLeft"),10)||0),(parseInt(i.css("borderTopWidth"),10)||0)+(parseInt(i.css("paddingTop"),10)||0),(t?Math.max(s.scrollWidth,s.offsetWidth):s.offsetWidth)-(parseInt(i.css("borderRightWidth"),10)||0)-(parseInt(i.css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left-this.margins.right,(t?Math.max(s.scrollHeight,s.offsetHeight):s.offsetHeight)-(parseInt(i.css("borderBottomWidth"),10)||0)-(parseInt(i.css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top-this.margins.bottom],this.relative_container=i),void 0):(this.containment=null,void 0)},_convertPositionTo:function(e,t){t||(t=this.position);var i="absolute"===e?1:-1,s=this._isRootNode(this.scrollParent[0]);return{top:t.top+this.offset.relative.top*i+this.offset.parent.top*i-("fixed"===this.cssPosition?-this.offset.scroll.top:s?0:this.offset.scroll.top)*i,left:t.left+this.offset.relative.left*i+this.offset.parent.left*i-("fixed"===this.cssPosition?-this.offset.scroll.left:s?0:this.offset.scroll.left)*i}},_generatePosition:function(e,t){var i,s,a,n,o=this.options,r=this._isRootNode(this.scrollParent[0]),h=e.pageX,l=e.pageY;return r&&this.offset.scroll||(this.offset.scroll={top:this.scrollParent.scrollTop(),left:this.scrollParent.scrollLeft()}),t&&(this.containment&&(this.relative_container?(s=this.relative_container.offset(),i=[this.containment[0]+s.left,this.containment[1]+s.top,this.containment[2]+s.left,this.containment[3]+s.top]):i=this.containment,e.pageX-this.offset.click.left<i[0]&&(h=i[0]+this.offset.click.left),e.pageY-this.offset.click.top<i[1]&&(l=i[1]+this.offset.click.top),e.pageX-this.offset.click.left>i[2]&&(h=i[2]+this.offset.click.left),e.pageY-this.offset.click.top>i[3]&&(l=i[3]+this.offset.click.top)),o.grid&&(a=o.grid[1]?this.originalPageY+Math.round((l-this.originalPageY)/o.grid[1])*o.grid[1]:this.originalPageY,l=i?a-this.offset.click.top>=i[1]||a-this.offset.click.top>i[3]?a:a-this.offset.click.top>=i[1]?a-o.grid[1]:a+o.grid[1]:a,n=o.grid[0]?this.originalPageX+Math.round((h-this.originalPageX)/o.grid[0])*o.grid[0]:this.originalPageX,h=i?n-this.offset.click.left>=i[0]||n-this.offset.click.left>i[2]?n:n-this.offset.click.left>=i[0]?n-o.grid[0]:n+o.grid[0]:n),"y"===o.axis&&(h=this.originalPageX),"x"===o.axis&&(l=this.originalPageY)),{top:l-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+("fixed"===this.cssPosition?-this.offset.scroll.top:r?0:this.offset.scroll.top),left:h-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+("fixed"===this.cssPosition?-this.offset.scroll.left:r?0:this.offset.scroll.left)}},_clear:function(){this.helper.removeClass("ui-draggable-dragging"),this.helper[0]===this.element[0]||this.cancelHelperRemoval||this.helper.remove(),this.helper=null,this.cancelHelperRemoval=!1,this.destroyOnClear&&this.destroy()},_trigger:function(t,i,s){return s=s||this._uiHash(),e.ui.plugin.call(this,t,[i,s,this],!0),"drag"===t&&(this.positionAbs=this._convertPositionTo("absolute")),e.Widget.prototype._trigger.call(this,t,i,s)},plugins:{},_uiHash:function(){return{helper:this.helper,position:this.position,originalPosition:this.originalPosition,offset:this.positionAbs}}}),e.ui.plugin.add("draggable","connectToSortable",{start:function(t,i,s){var a=s.options,n=e.extend({},i,{item:s.element});s.sortables=[],e(a.connectToSortable).each(function(){var i=e(this).sortable("instance");i&&!i.options.disabled&&(s.sortables.push({instance:i,shouldRevert:i.options.revert}),i.refreshPositions(),i._trigger("activate",t,n))})},stop:function(t,i,s){var a=e.extend({},i,{item:s.element});e.each(s.sortables,function(){this.instance.isOver?(this.instance.isOver=0,s.cancelHelperRemoval=!0,this.instance.cancelHelperRemoval=!1,this.shouldRevert&&(this.instance.options.revert=this.shouldRevert),this.instance._mouseStop(t),this.instance.options.helper=this.instance.options._helper,"original"===s.options.helper&&this.instance.currentItem.css({top:"auto",left:"auto"})):(this.instance.cancelHelperRemoval=!1,this.instance._trigger("deactivate",t,a))})},drag:function(t,i,s){var a=this;e.each(s.sortables,function(){var n=!1,o=this;this.instance.positionAbs=s.positionAbs,this.instance.helperProportions=s.helperProportions,this.instance.offset.click=s.offset.click,this.instance._intersectsWith(this.instance.containerCache)&&(n=!0,e.each(s.sortables,function(){return this.instance.positionAbs=s.positionAbs,this.instance.helperProportions=s.helperProportions,this.instance.offset.click=s.offset.click,this!==o&&this.instance._intersectsWith(this.instance.containerCache)&&e.contains(o.instance.element[0],this.instance.element[0])&&(n=!1),n})),n?(this.instance.isOver||(this.instance.isOver=1,this.instance.currentItem=e(a).clone().removeAttr("id").appendTo(this.instance.element).data("ui-sortable-item",!0),this.instance.options._helper=this.instance.options.helper,this.instance.options.helper=function(){return i.helper[0]},t.target=this.instance.currentItem[0],this.instance._mouseCapture(t,!0),this.instance._mouseStart(t,!0,!0),this.instance.offset.click.top=s.offset.click.top,this.instance.offset.click.left=s.offset.click.left,this.instance.offset.parent.left-=s.offset.parent.left-this.instance.offset.parent.left,this.instance.offset.parent.top-=s.offset.parent.top-this.instance.offset.parent.top,s._trigger("toSortable",t),s.dropped=this.instance.element,s.currentItem=s.element,this.instance.fromOutside=s),this.instance.currentItem&&this.instance._mouseDrag(t)):this.instance.isOver&&(this.instance.isOver=0,this.instance.cancelHelperRemoval=!0,this.instance.options.revert=!1,this.instance._trigger("out",t,this.instance._uiHash(this.instance)),this.instance._mouseStop(t,!0),this.instance.options.helper=this.instance.options._helper,this.instance.currentItem.remove(),this.instance.placeholder&&this.instance.placeholder.remove(),s._trigger("fromSortable",t),s.dropped=!1)})}}),e.ui.plugin.add("draggable","cursor",{start:function(t,i,s){var a=e("body"),n=s.options;a.css("cursor")&&(n._cursor=a.css("cursor")),a.css("cursor",n.cursor)},stop:function(t,i,s){var a=s.options;a._cursor&&e("body").css("cursor",a._cursor)}}),e.ui.plugin.add("draggable","opacity",{start:function(t,i,s){var a=e(i.helper),n=s.options;a.css("opacity")&&(n._opacity=a.css("opacity")),a.css("opacity",n.opacity)},stop:function(t,i,s){var a=s.options;a._opacity&&e(i.helper).css("opacity",a._opacity)}}),e.ui.plugin.add("draggable","scroll",{start:function(e,t,i){i.scrollParent[0]!==i.document[0]&&"HTML"!==i.scrollParent[0].tagName&&(i.overflowOffset=i.scrollParent.offset())},drag:function(t,i,s){var a=s.options,n=!1,o=s.document[0];s.scrollParent[0]!==o&&"HTML"!==s.scrollParent[0].tagName?(a.axis&&"x"===a.axis||(s.overflowOffset.top+s.scrollParent[0].offsetHeight-t.pageY<a.scrollSensitivity?s.scrollParent[0].scrollTop=n=s.scrollParent[0].scrollTop+a.scrollSpeed:t.pageY-s.overflowOffset.top<a.scrollSensitivity&&(s.scrollParent[0].scrollTop=n=s.scrollParent[0].scrollTop-a.scrollSpeed)),a.axis&&"y"===a.axis||(s.overflowOffset.left+s.scrollParent[0].offsetWidth-t.pageX<a.scrollSensitivity?s.scrollParent[0].scrollLeft=n=s.scrollParent[0].scrollLeft+a.scrollSpeed:t.pageX-s.overflowOffset.left<a.scrollSensitivity&&(s.scrollParent[0].scrollLeft=n=s.scrollParent[0].scrollLeft-a.scrollSpeed))):(a.axis&&"x"===a.axis||(t.pageY-e(o).scrollTop()<a.scrollSensitivity?n=e(o).scrollTop(e(o).scrollTop()-a.scrollSpeed):e(window).height()-(t.pageY-e(o).scrollTop())<a.scrollSensitivity&&(n=e(o).scrollTop(e(o).scrollTop()+a.scrollSpeed))),a.axis&&"y"===a.axis||(t.pageX-e(o).scrollLeft()<a.scrollSensitivity?n=e(o).scrollLeft(e(o).scrollLeft()-a.scrollSpeed):e(window).width()-(t.pageX-e(o).scrollLeft())<a.scrollSensitivity&&(n=e(o).scrollLeft(e(o).scrollLeft()+a.scrollSpeed)))),n!==!1&&e.ui.ddmanager&&!a.dropBehaviour&&e.ui.ddmanager.prepareOffsets(s,t)}}),e.ui.plugin.add("draggable","snap",{start:function(t,i,s){var a=s.options;s.snapElements=[],e(a.snap.constructor!==String?a.snap.items||":data(ui-draggable)":a.snap).each(function(){var t=e(this),i=t.offset();this!==s.element[0]&&s.snapElements.push({item:this,width:t.outerWidth(),height:t.outerHeight(),top:i.top,left:i.left})})},drag:function(t,i,s){var a,n,o,r,h,l,u,d,c,p,f=s.options,m=f.snapTolerance,g=i.offset.left,v=g+s.helperProportions.width,y=i.offset.top,b=y+s.helperProportions.height;for(c=s.snapElements.length-1;c>=0;c--)h=s.snapElements[c].left,l=h+s.snapElements[c].width,u=s.snapElements[c].top,d=u+s.snapElements[c].height,h-m>v||g>l+m||u-m>b||y>d+m||!e.contains(s.snapElements[c].item.ownerDocument,s.snapElements[c].item)?(s.snapElements[c].snapping&&s.options.snap.release&&s.options.snap.release.call(s.element,t,e.extend(s._uiHash(),{snapItem:s.snapElements[c].item})),s.snapElements[c].snapping=!1):("inner"!==f.snapMode&&(a=m>=Math.abs(u-b),n=m>=Math.abs(d-y),o=m>=Math.abs(h-v),r=m>=Math.abs(l-g),a&&(i.position.top=s._convertPositionTo("relative",{top:u-s.helperProportions.height,left:0}).top-s.margins.top),n&&(i.position.top=s._convertPositionTo("relative",{top:d,left:0}).top-s.margins.top),o&&(i.position.left=s._convertPositionTo("relative",{top:0,left:h-s.helperProportions.width}).left-s.margins.left),r&&(i.position.left=s._convertPositionTo("relative",{top:0,left:l}).left-s.margins.left)),p=a||n||o||r,"outer"!==f.snapMode&&(a=m>=Math.abs(u-y),n=m>=Math.abs(d-b),o=m>=Math.abs(h-g),r=m>=Math.abs(l-v),a&&(i.position.top=s._convertPositionTo("relative",{top:u,left:0}).top-s.margins.top),n&&(i.position.top=s._convertPositionTo("relative",{top:d-s.helperProportions.height,left:0}).top-s.margins.top),o&&(i.position.left=s._convertPositionTo("relative",{top:0,left:h}).left-s.margins.left),r&&(i.position.left=s._convertPositionTo("relative",{top:0,left:l-s.helperProportions.width}).left-s.margins.left)),!s.snapElements[c].snapping&&(a||n||o||r||p)&&s.options.snap.snap&&s.options.snap.snap.call(s.element,t,e.extend(s._uiHash(),{snapItem:s.snapElements[c].item})),s.snapElements[c].snapping=a||n||o||r||p)}}),e.ui.plugin.add("draggable","stack",{start:function(t,i,s){var a,n=s.options,o=e.makeArray(e(n.stack)).sort(function(t,i){return(parseInt(e(t).css("zIndex"),10)||0)-(parseInt(e(i).css("zIndex"),10)||0)});o.length&&(a=parseInt(e(o[0]).css("zIndex"),10)||0,e(o).each(function(t){e(this).css("zIndex",a+t)}),this.css("zIndex",a+o.length))}}),e.ui.plugin.add("draggable","zIndex",{start:function(t,i,s){var a=e(i.helper),n=s.options;a.css("zIndex")&&(n._zIndex=a.css("zIndex")),a.css("zIndex",n.zIndex)},stop:function(t,i,s){var a=s.options;a._zIndex&&e(i.helper).css("zIndex",a._zIndex)}}),e.ui.draggable,e.widget("ui.droppable",{version:"1.11.0",widgetEventPrefix:"drop",options:{accept:"*",activeClass:!1,addClasses:!0,greedy:!1,hoverClass:!1,scope:"default",tolerance:"intersect",activate:null,deactivate:null,drop:null,out:null,over:null},_create:function(){var t,i=this.options,s=i.accept;this.isover=!1,this.isout=!0,this.accept=e.isFunction(s)?s:function(e){return e.is(s)},this.proportions=function(){return arguments.length?(t=arguments[0],void 0):t?t:t={width:this.element[0].offsetWidth,height:this.element[0].offsetHeight}},this._addToManager(i.scope),i.addClasses&&this.element.addClass("ui-droppable")},_addToManager:function(t){e.ui.ddmanager.droppables[t]=e.ui.ddmanager.droppables[t]||[],e.ui.ddmanager.droppables[t].push(this)},_splice:function(e){for(var t=0;e.length>t;t++)e[t]===this&&e.splice(t,1)
},_destroy:function(){var t=e.ui.ddmanager.droppables[this.options.scope];this._splice(t),this.element.removeClass("ui-droppable ui-droppable-disabled")},_setOption:function(t,i){if("accept"===t)this.accept=e.isFunction(i)?i:function(e){return e.is(i)};else if("scope"===t){var s=e.ui.ddmanager.droppables[this.options.scope];this._splice(s),this._addToManager(i)}this._super(t,i)},_activate:function(t){var i=e.ui.ddmanager.current;this.options.activeClass&&this.element.addClass(this.options.activeClass),i&&this._trigger("activate",t,this.ui(i))},_deactivate:function(t){var i=e.ui.ddmanager.current;this.options.activeClass&&this.element.removeClass(this.options.activeClass),i&&this._trigger("deactivate",t,this.ui(i))},_over:function(t){var i=e.ui.ddmanager.current;i&&(i.currentItem||i.element)[0]!==this.element[0]&&this.accept.call(this.element[0],i.currentItem||i.element)&&(this.options.hoverClass&&this.element.addClass(this.options.hoverClass),this._trigger("over",t,this.ui(i)))},_out:function(t){var i=e.ui.ddmanager.current;i&&(i.currentItem||i.element)[0]!==this.element[0]&&this.accept.call(this.element[0],i.currentItem||i.element)&&(this.options.hoverClass&&this.element.removeClass(this.options.hoverClass),this._trigger("out",t,this.ui(i)))},_drop:function(t,i){var s=i||e.ui.ddmanager.current,a=!1;return s&&(s.currentItem||s.element)[0]!==this.element[0]?(this.element.find(":data(ui-droppable)").not(".ui-draggable-dragging").each(function(){var t=e(this).droppable("instance");return t.options.greedy&&!t.options.disabled&&t.options.scope===s.options.scope&&t.accept.call(t.element[0],s.currentItem||s.element)&&e.ui.intersect(s,e.extend(t,{offset:t.element.offset()}),t.options.tolerance)?(a=!0,!1):void 0}),a?!1:this.accept.call(this.element[0],s.currentItem||s.element)?(this.options.activeClass&&this.element.removeClass(this.options.activeClass),this.options.hoverClass&&this.element.removeClass(this.options.hoverClass),this._trigger("drop",t,this.ui(s)),this.element):!1):!1},ui:function(e){return{draggable:e.currentItem||e.element,helper:e.helper,position:e.position,offset:e.positionAbs}}}),e.ui.intersect=function(){function e(e,t,i){return e>=t&&t+i>e}return function(t,i,s){if(!i.offset)return!1;var a,n,o=(t.positionAbs||t.position.absolute).left,r=(t.positionAbs||t.position.absolute).top,h=o+t.helperProportions.width,l=r+t.helperProportions.height,u=i.offset.left,d=i.offset.top,c=u+i.proportions().width,p=d+i.proportions().height;switch(s){case"fit":return o>=u&&c>=h&&r>=d&&p>=l;case"intersect":return o+t.helperProportions.width/2>u&&c>h-t.helperProportions.width/2&&r+t.helperProportions.height/2>d&&p>l-t.helperProportions.height/2;case"pointer":return a=(t.positionAbs||t.position.absolute).left+(t.clickOffset||t.offset.click).left,n=(t.positionAbs||t.position.absolute).top+(t.clickOffset||t.offset.click).top,e(n,d,i.proportions().height)&&e(a,u,i.proportions().width);case"touch":return(r>=d&&p>=r||l>=d&&p>=l||d>r&&l>p)&&(o>=u&&c>=o||h>=u&&c>=h||u>o&&h>c);default:return!1}}}(),e.ui.ddmanager={current:null,droppables:{"default":[]},prepareOffsets:function(t,i){var s,a,n=e.ui.ddmanager.droppables[t.options.scope]||[],o=i?i.type:null,r=(t.currentItem||t.element).find(":data(ui-droppable)").addBack();e:for(s=0;n.length>s;s++)if(!(n[s].options.disabled||t&&!n[s].accept.call(n[s].element[0],t.currentItem||t.element))){for(a=0;r.length>a;a++)if(r[a]===n[s].element[0]){n[s].proportions().height=0;continue e}n[s].visible="none"!==n[s].element.css("display"),n[s].visible&&("mousedown"===o&&n[s]._activate.call(n[s],i),n[s].offset=n[s].element.offset(),n[s].proportions({width:n[s].element[0].offsetWidth,height:n[s].element[0].offsetHeight}))}},drop:function(t,i){var s=!1;return e.each((e.ui.ddmanager.droppables[t.options.scope]||[]).slice(),function(){this.options&&(!this.options.disabled&&this.visible&&e.ui.intersect(t,this,this.options.tolerance)&&(s=this._drop.call(this,i)||s),!this.options.disabled&&this.visible&&this.accept.call(this.element[0],t.currentItem||t.element)&&(this.isout=!0,this.isover=!1,this._deactivate.call(this,i)))}),s},dragStart:function(t,i){t.element.parentsUntil("body").bind("scroll.droppable",function(){t.options.refreshPositions||e.ui.ddmanager.prepareOffsets(t,i)})},drag:function(t,i){t.options.refreshPositions&&e.ui.ddmanager.prepareOffsets(t,i),e.each(e.ui.ddmanager.droppables[t.options.scope]||[],function(){if(!this.options.disabled&&!this.greedyChild&&this.visible){var s,a,n,o=e.ui.intersect(t,this,this.options.tolerance),r=!o&&this.isover?"isout":o&&!this.isover?"isover":null;r&&(this.options.greedy&&(a=this.options.scope,n=this.element.parents(":data(ui-droppable)").filter(function(){return e(this).droppable("instance").options.scope===a}),n.length&&(s=e(n[0]).droppable("instance"),s.greedyChild="isover"===r)),s&&"isover"===r&&(s.isover=!1,s.isout=!0,s._out.call(s,i)),this[r]=!0,this["isout"===r?"isover":"isout"]=!1,this["isover"===r?"_over":"_out"].call(this,i),s&&"isout"===r&&(s.isout=!1,s.isover=!0,s._over.call(s,i)))}})},dragStop:function(t,i){t.element.parentsUntil("body").unbind("scroll.droppable"),t.options.refreshPositions||e.ui.ddmanager.prepareOffsets(t,i)}},e.ui.droppable,e.widget("ui.sortable",e.ui.mouse,{version:"1.11.0",widgetEventPrefix:"sort",ready:!1,options:{appendTo:"parent",axis:!1,connectWith:!1,containment:!1,cursor:"auto",cursorAt:!1,dropOnEmpty:!0,forcePlaceholderSize:!1,forceHelperSize:!1,grid:!1,handle:!1,helper:"original",items:"> *",opacity:!1,placeholder:!1,revert:!1,scroll:!0,scrollSensitivity:20,scrollSpeed:20,scope:"default",tolerance:"intersect",zIndex:1e3,activate:null,beforeStop:null,change:null,deactivate:null,out:null,over:null,receive:null,remove:null,sort:null,start:null,stop:null,update:null},_isOverAxis:function(e,t,i){return e>=t&&t+i>e},_isFloating:function(e){return/left|right/.test(e.css("float"))||/inline|table-cell/.test(e.css("display"))},_create:function(){var e=this.options;this.containerCache={},this.element.addClass("ui-sortable"),this.refresh(),this.floating=this.items.length?"x"===e.axis||this._isFloating(this.items[0].item):!1,this.offset=this.element.offset(),this._mouseInit(),this._setHandleClassName(),this.ready=!0},_setOption:function(e,t){this._super(e,t),"handle"===e&&this._setHandleClassName()},_setHandleClassName:function(){this.element.find(".ui-sortable-handle").removeClass("ui-sortable-handle"),e.each(this.items,function(){(this.instance.options.handle?this.item.find(this.instance.options.handle):this.item).addClass("ui-sortable-handle")})},_destroy:function(){this.element.removeClass("ui-sortable ui-sortable-disabled").find(".ui-sortable-handle").removeClass("ui-sortable-handle"),this._mouseDestroy();for(var e=this.items.length-1;e>=0;e--)this.items[e].item.removeData(this.widgetName+"-item");return this},_mouseCapture:function(t,i){var s=null,a=!1,n=this;return this.reverting?!1:this.options.disabled||"static"===this.options.type?!1:(this._refreshItems(t),e(t.target).parents().each(function(){return e.data(this,n.widgetName+"-item")===n?(s=e(this),!1):void 0}),e.data(t.target,n.widgetName+"-item")===n&&(s=e(t.target)),s?!this.options.handle||i||(e(this.options.handle,s).find("*").addBack().each(function(){this===t.target&&(a=!0)}),a)?(this.currentItem=s,this._removeCurrentsFromItems(),!0):!1:!1)},_mouseStart:function(t,i,s){var a,n,o=this.options;if(this.currentContainer=this,this.refreshPositions(),this.helper=this._createHelper(t),this._cacheHelperProportions(),this._cacheMargins(),this.scrollParent=this.helper.scrollParent(),this.offset=this.currentItem.offset(),this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left},e.extend(this.offset,{click:{left:t.pageX-this.offset.left,top:t.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()}),this.helper.css("position","absolute"),this.cssPosition=this.helper.css("position"),this.originalPosition=this._generatePosition(t),this.originalPageX=t.pageX,this.originalPageY=t.pageY,o.cursorAt&&this._adjustOffsetFromHelper(o.cursorAt),this.domPosition={prev:this.currentItem.prev()[0],parent:this.currentItem.parent()[0]},this.helper[0]!==this.currentItem[0]&&this.currentItem.hide(),this._createPlaceholder(),o.containment&&this._setContainment(),o.cursor&&"auto"!==o.cursor&&(n=this.document.find("body"),this.storedCursor=n.css("cursor"),n.css("cursor",o.cursor),this.storedStylesheet=e("<style>*{ cursor: "+o.cursor+" !important; }</style>").appendTo(n)),o.opacity&&(this.helper.css("opacity")&&(this._storedOpacity=this.helper.css("opacity")),this.helper.css("opacity",o.opacity)),o.zIndex&&(this.helper.css("zIndex")&&(this._storedZIndex=this.helper.css("zIndex")),this.helper.css("zIndex",o.zIndex)),this.scrollParent[0]!==document&&"HTML"!==this.scrollParent[0].tagName&&(this.overflowOffset=this.scrollParent.offset()),this._trigger("start",t,this._uiHash()),this._preserveHelperProportions||this._cacheHelperProportions(),!s)for(a=this.containers.length-1;a>=0;a--)this.containers[a]._trigger("activate",t,this._uiHash(this));return e.ui.ddmanager&&(e.ui.ddmanager.current=this),e.ui.ddmanager&&!o.dropBehaviour&&e.ui.ddmanager.prepareOffsets(this,t),this.dragging=!0,this.helper.addClass("ui-sortable-helper"),this._mouseDrag(t),!0},_mouseDrag:function(t){var i,s,a,n,o=this.options,r=!1;for(this.position=this._generatePosition(t),this.positionAbs=this._convertPositionTo("absolute"),this.lastPositionAbs||(this.lastPositionAbs=this.positionAbs),this.options.scroll&&(this.scrollParent[0]!==document&&"HTML"!==this.scrollParent[0].tagName?(this.overflowOffset.top+this.scrollParent[0].offsetHeight-t.pageY<o.scrollSensitivity?this.scrollParent[0].scrollTop=r=this.scrollParent[0].scrollTop+o.scrollSpeed:t.pageY-this.overflowOffset.top<o.scrollSensitivity&&(this.scrollParent[0].scrollTop=r=this.scrollParent[0].scrollTop-o.scrollSpeed),this.overflowOffset.left+this.scrollParent[0].offsetWidth-t.pageX<o.scrollSensitivity?this.scrollParent[0].scrollLeft=r=this.scrollParent[0].scrollLeft+o.scrollSpeed:t.pageX-this.overflowOffset.left<o.scrollSensitivity&&(this.scrollParent[0].scrollLeft=r=this.scrollParent[0].scrollLeft-o.scrollSpeed)):(t.pageY-e(document).scrollTop()<o.scrollSensitivity?r=e(document).scrollTop(e(document).scrollTop()-o.scrollSpeed):e(window).height()-(t.pageY-e(document).scrollTop())<o.scrollSensitivity&&(r=e(document).scrollTop(e(document).scrollTop()+o.scrollSpeed)),t.pageX-e(document).scrollLeft()<o.scrollSensitivity?r=e(document).scrollLeft(e(document).scrollLeft()-o.scrollSpeed):e(window).width()-(t.pageX-e(document).scrollLeft())<o.scrollSensitivity&&(r=e(document).scrollLeft(e(document).scrollLeft()+o.scrollSpeed))),r!==!1&&e.ui.ddmanager&&!o.dropBehaviour&&e.ui.ddmanager.prepareOffsets(this,t)),this.positionAbs=this._convertPositionTo("absolute"),this.options.axis&&"y"===this.options.axis||(this.helper[0].style.left=this.position.left+"px"),this.options.axis&&"x"===this.options.axis||(this.helper[0].style.top=this.position.top+"px"),i=this.items.length-1;i>=0;i--)if(s=this.items[i],a=s.item[0],n=this._intersectsWithPointer(s),n&&s.instance===this.currentContainer&&a!==this.currentItem[0]&&this.placeholder[1===n?"next":"prev"]()[0]!==a&&!e.contains(this.placeholder[0],a)&&("semi-dynamic"===this.options.type?!e.contains(this.element[0],a):!0)){if(this.direction=1===n?"down":"up","pointer"!==this.options.tolerance&&!this._intersectsWithSides(s))break;this._rearrange(t,s),this._trigger("change",t,this._uiHash());break}return this._contactContainers(t),e.ui.ddmanager&&e.ui.ddmanager.drag(this,t),this._trigger("sort",t,this._uiHash()),this.lastPositionAbs=this.positionAbs,!1},_mouseStop:function(t,i){if(t){if(e.ui.ddmanager&&!this.options.dropBehaviour&&e.ui.ddmanager.drop(this,t),this.options.revert){var s=this,a=this.placeholder.offset(),n=this.options.axis,o={};n&&"x"!==n||(o.left=a.left-this.offset.parent.left-this.margins.left+(this.offsetParent[0]===document.body?0:this.offsetParent[0].scrollLeft)),n&&"y"!==n||(o.top=a.top-this.offset.parent.top-this.margins.top+(this.offsetParent[0]===document.body?0:this.offsetParent[0].scrollTop)),this.reverting=!0,e(this.helper).animate(o,parseInt(this.options.revert,10)||500,function(){s._clear(t)})}else this._clear(t,i);return!1}},cancel:function(){if(this.dragging){this._mouseUp({target:null}),"original"===this.options.helper?this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper"):this.currentItem.show();for(var t=this.containers.length-1;t>=0;t--)this.containers[t]._trigger("deactivate",null,this._uiHash(this)),this.containers[t].containerCache.over&&(this.containers[t]._trigger("out",null,this._uiHash(this)),this.containers[t].containerCache.over=0)}return this.placeholder&&(this.placeholder[0].parentNode&&this.placeholder[0].parentNode.removeChild(this.placeholder[0]),"original"!==this.options.helper&&this.helper&&this.helper[0].parentNode&&this.helper.remove(),e.extend(this,{helper:null,dragging:!1,reverting:!1,_noFinalSort:null}),this.domPosition.prev?e(this.domPosition.prev).after(this.currentItem):e(this.domPosition.parent).prepend(this.currentItem)),this},serialize:function(t){var i=this._getItemsAsjQuery(t&&t.connected),s=[];return t=t||{},e(i).each(function(){var i=(e(t.item||this).attr(t.attribute||"id")||"").match(t.expression||/(.+)[\-=_](.+)/);i&&s.push((t.key||i[1]+"[]")+"="+(t.key&&t.expression?i[1]:i[2]))}),!s.length&&t.key&&s.push(t.key+"="),s.join("&")},toArray:function(t){var i=this._getItemsAsjQuery(t&&t.connected),s=[];return t=t||{},i.each(function(){s.push(e(t.item||this).attr(t.attribute||"id")||"")}),s},_intersectsWith:function(e){var t=this.positionAbs.left,i=t+this.helperProportions.width,s=this.positionAbs.top,a=s+this.helperProportions.height,n=e.left,o=n+e.width,r=e.top,h=r+e.height,l=this.offset.click.top,u=this.offset.click.left,d="x"===this.options.axis||s+l>r&&h>s+l,c="y"===this.options.axis||t+u>n&&o>t+u,p=d&&c;return"pointer"===this.options.tolerance||this.options.forcePointerForContainers||"pointer"!==this.options.tolerance&&this.helperProportions[this.floating?"width":"height"]>e[this.floating?"width":"height"]?p:t+this.helperProportions.width/2>n&&o>i-this.helperProportions.width/2&&s+this.helperProportions.height/2>r&&h>a-this.helperProportions.height/2},_intersectsWithPointer:function(e){var t="x"===this.options.axis||this._isOverAxis(this.positionAbs.top+this.offset.click.top,e.top,e.height),i="y"===this.options.axis||this._isOverAxis(this.positionAbs.left+this.offset.click.left,e.left,e.width),s=t&&i,a=this._getDragVerticalDirection(),n=this._getDragHorizontalDirection();return s?this.floating?n&&"right"===n||"down"===a?2:1:a&&("down"===a?2:1):!1},_intersectsWithSides:function(e){var t=this._isOverAxis(this.positionAbs.top+this.offset.click.top,e.top+e.height/2,e.height),i=this._isOverAxis(this.positionAbs.left+this.offset.click.left,e.left+e.width/2,e.width),s=this._getDragVerticalDirection(),a=this._getDragHorizontalDirection();return this.floating&&a?"right"===a&&i||"left"===a&&!i:s&&("down"===s&&t||"up"===s&&!t)},_getDragVerticalDirection:function(){var e=this.positionAbs.top-this.lastPositionAbs.top;return 0!==e&&(e>0?"down":"up")},_getDragHorizontalDirection:function(){var e=this.positionAbs.left-this.lastPositionAbs.left;return 0!==e&&(e>0?"right":"left")},refresh:function(e){return this._refreshItems(e),this._setHandleClassName(),this.refreshPositions(),this},_connectWith:function(){var e=this.options;return e.connectWith.constructor===String?[e.connectWith]:e.connectWith},_getItemsAsjQuery:function(t){function i(){r.push(this)}var s,a,n,o,r=[],h=[],l=this._connectWith();if(l&&t)for(s=l.length-1;s>=0;s--)for(n=e(l[s]),a=n.length-1;a>=0;a--)o=e.data(n[a],this.widgetFullName),o&&o!==this&&!o.options.disabled&&h.push([e.isFunction(o.options.items)?o.options.items.call(o.element):e(o.options.items,o.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),o]);for(h.push([e.isFunction(this.options.items)?this.options.items.call(this.element,null,{options:this.options,item:this.currentItem}):e(this.options.items,this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),this]),s=h.length-1;s>=0;s--)h[s][0].each(i);return e(r)},_removeCurrentsFromItems:function(){var t=this.currentItem.find(":data("+this.widgetName+"-item)");this.items=e.grep(this.items,function(e){for(var i=0;t.length>i;i++)if(t[i]===e.item[0])return!1;return!0})},_refreshItems:function(t){this.items=[],this.containers=[this];var i,s,a,n,o,r,h,l,u=this.items,d=[[e.isFunction(this.options.items)?this.options.items.call(this.element[0],t,{item:this.currentItem}):e(this.options.items,this.element),this]],c=this._connectWith();if(c&&this.ready)for(i=c.length-1;i>=0;i--)for(a=e(c[i]),s=a.length-1;s>=0;s--)n=e.data(a[s],this.widgetFullName),n&&n!==this&&!n.options.disabled&&(d.push([e.isFunction(n.options.items)?n.options.items.call(n.element[0],t,{item:this.currentItem}):e(n.options.items,n.element),n]),this.containers.push(n));for(i=d.length-1;i>=0;i--)for(o=d[i][1],r=d[i][0],s=0,l=r.length;l>s;s++)h=e(r[s]),h.data(this.widgetName+"-item",o),u.push({item:h,instance:o,width:0,height:0,left:0,top:0})},refreshPositions:function(t){this.offsetParent&&this.helper&&(this.offset.parent=this._getParentOffset());var i,s,a,n;for(i=this.items.length-1;i>=0;i--)s=this.items[i],s.instance!==this.currentContainer&&this.currentContainer&&s.item[0]!==this.currentItem[0]||(a=this.options.toleranceElement?e(this.options.toleranceElement,s.item):s.item,t||(s.width=a.outerWidth(),s.height=a.outerHeight()),n=a.offset(),s.left=n.left,s.top=n.top);if(this.options.custom&&this.options.custom.refreshContainers)this.options.custom.refreshContainers.call(this);else for(i=this.containers.length-1;i>=0;i--)n=this.containers[i].element.offset(),this.containers[i].containerCache.left=n.left,this.containers[i].containerCache.top=n.top,this.containers[i].containerCache.width=this.containers[i].element.outerWidth(),this.containers[i].containerCache.height=this.containers[i].element.outerHeight();return this},_createPlaceholder:function(t){t=t||this;var i,s=t.options;s.placeholder&&s.placeholder.constructor!==String||(i=s.placeholder,s.placeholder={element:function(){var s=t.currentItem[0].nodeName.toLowerCase(),a=e("<"+s+">",t.document[0]).addClass(i||t.currentItem[0].className+" ui-sortable-placeholder").removeClass("ui-sortable-helper");return"tr"===s?t.currentItem.children().each(function(){e("<td>&#160;</td>",t.document[0]).attr("colspan",e(this).attr("colspan")||1).appendTo(a)}):"img"===s&&a.attr("src",t.currentItem.attr("src")),i||a.css("visibility","hidden"),a},update:function(e,a){(!i||s.forcePlaceholderSize)&&(a.height()||a.height(t.currentItem.innerHeight()-parseInt(t.currentItem.css("paddingTop")||0,10)-parseInt(t.currentItem.css("paddingBottom")||0,10)),a.width()||a.width(t.currentItem.innerWidth()-parseInt(t.currentItem.css("paddingLeft")||0,10)-parseInt(t.currentItem.css("paddingRight")||0,10)))}}),t.placeholder=e(s.placeholder.element.call(t.element,t.currentItem)),t.currentItem.after(t.placeholder),s.placeholder.update(t,t.placeholder)},_contactContainers:function(t){var i,s,a,n,o,r,h,l,u,d,c=null,p=null;for(i=this.containers.length-1;i>=0;i--)if(!e.contains(this.currentItem[0],this.containers[i].element[0]))if(this._intersectsWith(this.containers[i].containerCache)){if(c&&e.contains(this.containers[i].element[0],c.element[0]))continue;c=this.containers[i],p=i}else this.containers[i].containerCache.over&&(this.containers[i]._trigger("out",t,this._uiHash(this)),this.containers[i].containerCache.over=0);if(c)if(1===this.containers.length)this.containers[p].containerCache.over||(this.containers[p]._trigger("over",t,this._uiHash(this)),this.containers[p].containerCache.over=1);else{for(a=1e4,n=null,u=c.floating||this._isFloating(this.currentItem),o=u?"left":"top",r=u?"width":"height",d=u?"clientX":"clientY",s=this.items.length-1;s>=0;s--)e.contains(this.containers[p].element[0],this.items[s].item[0])&&this.items[s].item[0]!==this.currentItem[0]&&(h=this.items[s].item.offset()[o],l=!1,t[d]-h>this.items[s][r]/2&&(l=!0),a>Math.abs(t[d]-h)&&(a=Math.abs(t[d]-h),n=this.items[s],this.direction=l?"up":"down"));if(!n&&!this.options.dropOnEmpty)return;if(this.currentContainer===this.containers[p])return;n?this._rearrange(t,n,null,!0):this._rearrange(t,null,this.containers[p].element,!0),this._trigger("change",t,this._uiHash()),this.containers[p]._trigger("change",t,this._uiHash(this)),this.currentContainer=this.containers[p],this.options.placeholder.update(this.currentContainer,this.placeholder),this.containers[p]._trigger("over",t,this._uiHash(this)),this.containers[p].containerCache.over=1}},_createHelper:function(t){var i=this.options,s=e.isFunction(i.helper)?e(i.helper.apply(this.element[0],[t,this.currentItem])):"clone"===i.helper?this.currentItem.clone():this.currentItem;return s.parents("body").length||e("parent"!==i.appendTo?i.appendTo:this.currentItem[0].parentNode)[0].appendChild(s[0]),s[0]===this.currentItem[0]&&(this._storedCSS={width:this.currentItem[0].style.width,height:this.currentItem[0].style.height,position:this.currentItem.css("position"),top:this.currentItem.css("top"),left:this.currentItem.css("left")}),(!s[0].style.width||i.forceHelperSize)&&s.width(this.currentItem.width()),(!s[0].style.height||i.forceHelperSize)&&s.height(this.currentItem.height()),s},_adjustOffsetFromHelper:function(t){"string"==typeof t&&(t=t.split(" ")),e.isArray(t)&&(t={left:+t[0],top:+t[1]||0}),"left"in t&&(this.offset.click.left=t.left+this.margins.left),"right"in t&&(this.offset.click.left=this.helperProportions.width-t.right+this.margins.left),"top"in t&&(this.offset.click.top=t.top+this.margins.top),"bottom"in t&&(this.offset.click.top=this.helperProportions.height-t.bottom+this.margins.top)},_getParentOffset:function(){this.offsetParent=this.helper.offsetParent();var t=this.offsetParent.offset();return"absolute"===this.cssPosition&&this.scrollParent[0]!==document&&e.contains(this.scrollParent[0],this.offsetParent[0])&&(t.left+=this.scrollParent.scrollLeft(),t.top+=this.scrollParent.scrollTop()),(this.offsetParent[0]===document.body||this.offsetParent[0].tagName&&"html"===this.offsetParent[0].tagName.toLowerCase()&&e.ui.ie)&&(t={top:0,left:0}),{top:t.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:t.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if("relative"===this.cssPosition){var e=this.currentItem.position();return{top:e.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:e.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}return{top:0,left:0}},_cacheMargins:function(){this.margins={left:parseInt(this.currentItem.css("marginLeft"),10)||0,top:parseInt(this.currentItem.css("marginTop"),10)||0}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var t,i,s,a=this.options;"parent"===a.containment&&(a.containment=this.helper[0].parentNode),("document"===a.containment||"window"===a.containment)&&(this.containment=[0-this.offset.relative.left-this.offset.parent.left,0-this.offset.relative.top-this.offset.parent.top,e("document"===a.containment?document:window).width()-this.helperProportions.width-this.margins.left,(e("document"===a.containment?document:window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top]),/^(document|window|parent)$/.test(a.containment)||(t=e(a.containment)[0],i=e(a.containment).offset(),s="hidden"!==e(t).css("overflow"),this.containment=[i.left+(parseInt(e(t).css("borderLeftWidth"),10)||0)+(parseInt(e(t).css("paddingLeft"),10)||0)-this.margins.left,i.top+(parseInt(e(t).css("borderTopWidth"),10)||0)+(parseInt(e(t).css("paddingTop"),10)||0)-this.margins.top,i.left+(s?Math.max(t.scrollWidth,t.offsetWidth):t.offsetWidth)-(parseInt(e(t).css("borderLeftWidth"),10)||0)-(parseInt(e(t).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left,i.top+(s?Math.max(t.scrollHeight,t.offsetHeight):t.offsetHeight)-(parseInt(e(t).css("borderTopWidth"),10)||0)-(parseInt(e(t).css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top])},_convertPositionTo:function(t,i){i||(i=this.position);var s="absolute"===t?1:-1,a="absolute"!==this.cssPosition||this.scrollParent[0]!==document&&e.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent,n=/(html|body)/i.test(a[0].tagName);return{top:i.top+this.offset.relative.top*s+this.offset.parent.top*s-("fixed"===this.cssPosition?-this.scrollParent.scrollTop():n?0:a.scrollTop())*s,left:i.left+this.offset.relative.left*s+this.offset.parent.left*s-("fixed"===this.cssPosition?-this.scrollParent.scrollLeft():n?0:a.scrollLeft())*s}},_generatePosition:function(t){var i,s,a=this.options,n=t.pageX,o=t.pageY,r="absolute"!==this.cssPosition||this.scrollParent[0]!==document&&e.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent,h=/(html|body)/i.test(r[0].tagName);return"relative"!==this.cssPosition||this.scrollParent[0]!==document&&this.scrollParent[0]!==this.offsetParent[0]||(this.offset.relative=this._getRelativeOffset()),this.originalPosition&&(this.containment&&(t.pageX-this.offset.click.left<this.containment[0]&&(n=this.containment[0]+this.offset.click.left),t.pageY-this.offset.click.top<this.containment[1]&&(o=this.containment[1]+this.offset.click.top),t.pageX-this.offset.click.left>this.containment[2]&&(n=this.containment[2]+this.offset.click.left),t.pageY-this.offset.click.top>this.containment[3]&&(o=this.containment[3]+this.offset.click.top)),a.grid&&(i=this.originalPageY+Math.round((o-this.originalPageY)/a.grid[1])*a.grid[1],o=this.containment?i-this.offset.click.top>=this.containment[1]&&i-this.offset.click.top<=this.containment[3]?i:i-this.offset.click.top>=this.containment[1]?i-a.grid[1]:i+a.grid[1]:i,s=this.originalPageX+Math.round((n-this.originalPageX)/a.grid[0])*a.grid[0],n=this.containment?s-this.offset.click.left>=this.containment[0]&&s-this.offset.click.left<=this.containment[2]?s:s-this.offset.click.left>=this.containment[0]?s-a.grid[0]:s+a.grid[0]:s)),{top:o-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+("fixed"===this.cssPosition?-this.scrollParent.scrollTop():h?0:r.scrollTop()),left:n-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+("fixed"===this.cssPosition?-this.scrollParent.scrollLeft():h?0:r.scrollLeft())}},_rearrange:function(e,t,i,s){i?i[0].appendChild(this.placeholder[0]):t.item[0].parentNode.insertBefore(this.placeholder[0],"down"===this.direction?t.item[0]:t.item[0].nextSibling),this.counter=this.counter?++this.counter:1;var a=this.counter;this._delay(function(){a===this.counter&&this.refreshPositions(!s)})},_clear:function(e,t){function i(e,t,i){return function(s){i._trigger(e,s,t._uiHash(t))}}this.reverting=!1;var s,a=[];if(!this._noFinalSort&&this.currentItem.parent().length&&this.placeholder.before(this.currentItem),this._noFinalSort=null,this.helper[0]===this.currentItem[0]){for(s in this._storedCSS)("auto"===this._storedCSS[s]||"static"===this._storedCSS[s])&&(this._storedCSS[s]="");this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper")}else this.currentItem.show();for(this.fromOutside&&!t&&a.push(function(e){this._trigger("receive",e,this._uiHash(this.fromOutside))}),!this.fromOutside&&this.domPosition.prev===this.currentItem.prev().not(".ui-sortable-helper")[0]&&this.domPosition.parent===this.currentItem.parent()[0]||t||a.push(function(e){this._trigger("update",e,this._uiHash())}),this!==this.currentContainer&&(t||(a.push(function(e){this._trigger("remove",e,this._uiHash())}),a.push(function(e){return function(t){e._trigger("receive",t,this._uiHash(this))}}.call(this,this.currentContainer)),a.push(function(e){return function(t){e._trigger("update",t,this._uiHash(this))}}.call(this,this.currentContainer)))),s=this.containers.length-1;s>=0;s--)t||a.push(i("deactivate",this,this.containers[s])),this.containers[s].containerCache.over&&(a.push(i("out",this,this.containers[s])),this.containers[s].containerCache.over=0);if(this.storedCursor&&(this.document.find("body").css("cursor",this.storedCursor),this.storedStylesheet.remove()),this._storedOpacity&&this.helper.css("opacity",this._storedOpacity),this._storedZIndex&&this.helper.css("zIndex","auto"===this._storedZIndex?"":this._storedZIndex),this.dragging=!1,this.cancelHelperRemoval){if(!t){for(this._trigger("beforeStop",e,this._uiHash()),s=0;a.length>s;s++)a[s].call(this,e);this._trigger("stop",e,this._uiHash())}return this.fromOutside=!1,!1}if(t||this._trigger("beforeStop",e,this._uiHash()),this.placeholder[0].parentNode.removeChild(this.placeholder[0]),this.helper[0]!==this.currentItem[0]&&this.helper.remove(),this.helper=null,!t){for(s=0;a.length>s;s++)a[s].call(this,e);this._trigger("stop",e,this._uiHash())}return this.fromOutside=!1,!0},_trigger:function(){e.Widget.prototype._trigger.apply(this,arguments)===!1&&this.cancel()},_uiHash:function(t){var i=t||this;return{helper:i.helper,placeholder:i.placeholder||e([]),position:i.position,originalPosition:i.originalPosition,offset:i.positionAbs,item:i.currentItem,sender:t?t.element:null}}})});