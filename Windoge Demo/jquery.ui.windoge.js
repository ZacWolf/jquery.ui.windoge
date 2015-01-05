/*! jquery.ui.windoge - v0.1.0 - 2015-01-05
 *
 * Adds draggable, resizable, maximizable, and minimizable windows to your site
 *
 * https://github.com/ZacWolf/jquery.ui.windoge
 * Copyright (c) 2014 Zac Morris <zac@zacwolf.com> [http://www.zacwolf.com]
 * Licensed under GPL-3.0
 */
var	winDoge	= function(opts){

var		self			=	this;
		self.options	=	jQuery.extend(true,{},this._defaults,opts);
	
var		privatefunctions	=
	//Start Private Function
	{		_getAttributes: function(el) {
	var			attributes = {}; 
				if( el.length ) {
					jQuery.each( el[0].attributes, function( index, attr ) {
						attributes[ attr.name ] = attr.value;
					} ); 
				}
				return attributes;
			}
			,_styles2json: function(css) {
	var			s = {};
				if (!css) return s;
				if (css instanceof CSSStyleDeclaration) {
					for (var i in css) {
						if ((css[i]).toLowerCase) {
							s[(css[i]).toLowerCase()] = (css[css[i]]);
						}
					}
				} else if (jQuery.type(css) === "string") {
					css = css.split(";");
					for (var i in css) {
	var					l = css[i].split(":");
						if (l[0])
							s[l[0].toLowerCase().trim()] = (l[1].trim());
					}
				}
				return s;
			}
			//Returns the css values from Obj1 that differ from Obj2
			,_getdiffs: function(obj1,obj2){
	var			newobj			=	new Object();
				jQuery.each(obj2, function(key,value){
					if (value != obj1[key])
						newobj[key] = obj1[key];
				});
				return newobj;
			}
			,_copyComputedCSS:
				function(obj){
					if (obj instanceof jQuery)
						obj		=	obj[0];
	var				styles		=	getComputedStyle(obj,null);
	var				newstyles	=	{};
					jQuery.each(styles, function(index,key){
						newstyles[key] = styles[key]
					});
					return newstyles;
				}
			,_maxwindoge:
				function(maxicon){
	var 			restore		=	
						function(event,ui){
							maxicon
								.removeClass('restore')
								.addClass('maximize')
								.one('click',maximize)
							self.winDiv
								.find('.windogebar')
									.css('cursor','move')
								.end()
								.find('.resizeicon')
									.show()
								.end()
								.draggable('enable')
								.removeClass('maximized')
								.css(self.winDiv.data('origStyle'))
								.data('winstate',0)
							
							self._triggerCustomOnEvents('maxrestore');
							self._triggerCustomOneEvents('maxrestore');
							self._triggerCustomOnEvents('resize');
							self._triggerCustomOneEvents('resize');
						}
	var 			maximize	=
						function(event,ui){
							maxicon
								.removeClass('maximize')
								.addClass('restore')
								.one('click',restore)
							self.winDiv
								.find('.windogebar')
									.css('cursor','auto')
								.end()
								.find('.resizeicon')
									.hide()
								.end()
								.draggable('disable')
								.data('origWidth',self.winDiv.width())
								.data('origHeight',self.winDiv.height())
								.data('origStyle',
										privatefunctions._getdiffs(
											privatefunctions._copyComputedCSS(self.winDiv)
											,privatefunctions._copyComputedCSS(self.winDiv.addClass('maximized'))
										)
								)
								self.options.winstate=1;
								self._triggerCustomOnEvents('maximize');
								self._triggerCustomOneEvents('maximize');
								self._triggerCustomOnEvents('resize');
								self._triggerCustomOneEvents('resize');
						}
					maxicon.one('click',maximize);
				}
			,_minwindoge:
				function(minicon) {
var					restore		=	
						function(event,ui){
							self.winDiv.fadeIn(800);
							self.options.winstate=0;
							jQuery('#'+self.id+'-min')
								.effect(
									"transfer"
									,{ to: self.winDiv, className: "ui-effects-transfer" }
									,400
									,function(){
										self._triggerCustomOnEvents('minrestore');
										self._triggerCustomOneEvents('minrestore');
									}
								)
								.remove();
							self._testSize(self);
							minicon.one('click',minimize);
						}
var					minimize	=
						function(event,ui){
							jQuery('#windoge-minimizedock ul').append('<li id="'+self.id+'-min"><a><em><span>'+self.options.header+'</span></em><img src="'+self.options.winlogo+'" /></a></li>');
							jQuery('#'+self.id+'-min img').one('click',restore)
							self.winDiv
								.effect(
									"transfer"
									,{ to: '#'+self.id+'-min img', className: "ui-effects-transfer" }
									,400
									,function(){
										self._triggerCustomOnEvents('minimize');
										self._triggerCustomOneEvents('minimize');
									}
								)
								.hide()
							self.options.winstate=-1;
						}
					minicon.one('click',minimize);
				}
			,_createCookie: 
				function(name,value,days) {
					if (!navigator.cookieEnabled)
						return false;
					if (days) {
						var date = new Date();
						date.setTime(date.getTime()+(days*24*60*60*1000));
						var expires = "; expires="+date.toGMTString();
					}
					else var expires = "; expires=Tue, 19 Jan 2038 03:14:07 UTC";//End of the Unix Epoch for now
					document.cookie = name+"="+value+expires+";";
					return true;
				}
			,_readCookie: 
				function(name) {
					if (!navigator.cookieEnabled)
						return null;
				var	nameEQ	=	name + "=";
				var	ca		=	document.cookie.split(';');
					for(var i=0;i < ca.length;i++) {
				var		c	=	ca[i];
						while (c.charAt(0)==' ') c = c.substring(1,c.length);
						if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
					}
					return null;
				}
			,_eraseCookie:
				function(name) {
					_createCookie(name,"",-1);
				}
	}//End Private Function

//Start Public Values/Functions

		jQuery( window ).on('resize',function(e){self._testSize(self);});
		
		if (jQuery('#windoge-pane').length==0)
			jQuery("<div id='windoge-pane' class='ui-front'><div id='windoge-minimizedock' class='dock'><ul></ul></div></div>").appendTo(jQuery('body'));
		
		if (self.options.winroundedcorners)
			self.options.winroundedcorners	=	!isNaN(self.options.winroundedcorners)
												?(self.options.winroundedcorners<1
													?1
													:(self.options.winroundedcorners>5
														?5
														:self.options.winroundedcorners
													 )
												 )
												:5;
		
		self.winDiv 	=	jQuery('<div class="windoge'
							+(self.options.windropshadow?' windropshadow':'')
							+(self.options.winroundedcorners?' rounded'+self.options.winroundedcorners+' topleft topright bottomleft bottomright':'')
							+'"></div>');
		
		if (self.options.id)//assign the ID based on the one passed via options
			self.winDiv.attr('id',self.options.id);
		else //If the user didn't specify an ID then use a generated one
			self.winDiv.uniqueId();
		
		jQuery.each(self.options,function(attr,val){
			if (attr.toLowerCase()==="style" && jQuery.type(val)==="object"){
				self.winDiv.css(self.options.style);
				self.options.style	=	undefined;
			} else 	if (attr.toLowerCase()!=="on" 
						&& attr.toLowerCase()!=="one" 
						&& attr.toLowerCase()!=="contentdiv"
						) 
				self.winDiv.data(attr,val);
		})
		self.id	=	self.winDiv.attr('id');
var		topbar	=	jQuery(	'<div id="'+self.id+'topbar" class="windogebar'+(self.options.winroundedcorners?' rounded'+self.options.winroundedcorners+' topleft topright':'')+'">'+
							'<span id="'+self.id+'barheader" class="header'+(self.options.winlogoshow?'':' nologo')+'">'
								+self.options.header+
							'</span>'+
							'<div class="icons'+(self.options.winroundedcorners?' rounded'+self.options.winroundedcorners:'')+'">'+
								'<div class="icon minimize"></div>'+
								'<div class="icon maximize"></div>'+
							'</div>'+
						'</div>')
						.appendTo(self.winDiv);
var		bttmbar	=	jQuery(	'<div id='+self.id+'bottombar" class="windogestatus'+(self.options.winroundedcorners?' rounded bottomleft bottomright':'')+'">'+
							'<div id="'+self.id+'status" class="statusmsg"></div>'+
							'<div class="resizeicon"></div>'+
						'</div>')
						.appendTo(self.winDiv);		
var		middle	=	jQuery(	'<div id="'+self.id+'middle" class="windogemiddle"></div>')
						.appendTo(self.winDiv)
var		winlogo	=	(self.options.winlogoshow
					?jQuery(	'<img id="'+self.id+'logo" class="logo'+(self.options.winlogodropshadow?' dropshadow':'')+'" src="'+self.options.winlogo+'" />')
						.appendTo(self.winDiv)
					:""
					)	;
		self.winDiv
			.data('resizestart',{})
			.data('resizewidth',0)
			.data('resideheight',0)
			.appendTo(jQuery('#windoge-pane'))
			.draggable({cursor:'move'
						,containment:'window'
						,scroll:false
						,handle:jQuery('.windogebar')
						,stack: ".windoge"
						,stop:
							function(event,ui){
								if (self.options.winpersistposition){
									privatefunctions._createCookie("windoge-"+self.id+"-pos","{'top':"+self.winDiv.offset().top+",'left':"+self.winDiv.offset().left+"}");
								}
							}
						})
			.on('click',
				function(event){
var					group	=	jQuery.makeArray(jQuery('.windoge'))
									.sort(
										function(a, b) {
											return (parseInt(jQuery(a).css("zIndex"), 10) || 0) - (parseInt(jQuery(b).css("zIndex"), 10) || 0);
										}
									);
					if (!group.length) return;
var					min		=	parseInt(jQuery(group[0]).css("zIndex"), 10) || 0;
					jQuery(group)
						.each(
							function(i) {
								jQuery(this).css("zIndex", min + i);
							}
						);
					jQuery(this).css("zIndex", (min + group.length));
				}
			)
			.find('.windogebar .icon')
				.each(
					function(){
						if (jQuery(this).hasClass('maximize'))
							privatefunctions._maxwindoge(jQuery(this));
						else if (jQuery(this).hasClass('minimize'))
							privatefunctions._minwindoge(jQuery(this));
					}
				)
			.end()
			.find('.resizeicon')
				.each(
					function(){
						jQuery(this).draggable({
							drag:
								function(event,ui){
var									windoge_o	=	self.winDiv.offset();
var									resize_o	=	ui.offset
var									minw		=	parseInt(self.winDiv.css('min-width'));
var									w			=	(resize_o.left+jQuery(this).width()) - windoge_o.left
var									minh		=	parseInt(self.winDiv.css('min-height'))
var									h			=	resize_o.top - windoge_o.top
									if (w >= minw)
										self.width(w);
									if (h >= minh)
										self.height(h);
								}
							,stop:
								function(event,ui){
									if (self.options.winpersistposition){
										privatefunctions._createCookie("windoge-"+self.id+"-size","{'width':"+self.winDiv.width()+",'height':"+self.winDiv.height()+"}");
									}
								}
							,helper:"clone"
							,opacity:0.1
							,containment:'window'
							,stack: ".windoge"
						});
					}
				)
		middle.css({'top':topbar.outerHeight(),'bottom':bttmbar.outerHeight()});
		
		if (self.options.contentdiv){
var			contentdiv	=	jQuery(self.options.contentdiv).detach();
			if (contentdiv.find('.windogecontent').length==0)
				contentdiv.addClass('windogecontent')
			middle.append(contentdiv);
			self.options.contentdiv	=	undefined;
		} else {
			middle.append(jQuery("<div id='"+self.id+"content' class='windogecontent'><div class='windogecontentinner'></div></div>"));
		}
		
		if (self.options.winpersistposition){
			if (!navigator.cookieEnabled){
				self.winDiv.setStatusMsg("<span style='color:#888888;font-weight:bold;'>Cookies not allowed, reseting to initial position and size.</span>")
			} else {
var				pos,size;
				eval("pos="+privatefunctions._readCookie("windoge-"+self.id+"-pos"));
				if (pos!=null)
					self.winDiv.css(pos);
				eval("size="+privatefunctions._readCookie("windoge-"+self.id+"-size"));
				if (size!=null){
					self.winDiv.width(size.width);
					self.winDiv.height(size.height);
				}
			}
		}
}
winDoge.prototype	=	{
	winDiv:undefined
	,id:undefined
	,options:{}
	,_defaults:{'winlogo':'minimized-icon.png'
				,'winlogoshow':true
				,'winlogodropshadow':true
				,'winroundedcorners':'5'
				,'winstate':0
				,'winperistposition':false
				,'winroundedcorners':false
				,'style':{'width':'640px'
					 	 ,'height':'480px'
						 ,'min-width':'350px'
						 ,'min-height':'200px'
					}
				,'on':{	'maximize':[]
						,'maxrestore':[]
						,'minimize':[]
						,'minrestore':[]
						,'resize':[]
					}
				,'one':{'maximize':[]
						,'maxrestore':[]
						,'minimize':[]
						,'minrestore':[]
						,'resize':[]
					}
	}
	,_testSize://Equivalent to static method
		function(){
var			bw		=	jQuery(window).width();
var			bh		=	jQuery(window).height();
var			ell		=	this.winDiv.offset().left;
var			elw		=	this.winDiv.width();
var			elt		=	this.winDiv.offset().top;
var			elh		=	this.winDiv.height();
			if (bw<(ell+elw))
				if (bw>elw)
					this.winDiv.css("left",(bw-elw)+"px");
				else{
					this.winDiv.css("left",0);
					this.width(bw-1);
				}
				
			if (bh<(elt+elh))
				if (bh>elh)
					this.winDiv.css("top",(bh-elh)+"px");
				else{
					this.winDiv.css("top",0);
					this.height(bh-1);
				}
		}
	,_triggerCustomOnEvents:function(eventtype){
		if (jQuery.type(this.options.on[eventtype]) === "function")
			this.options.on[eventtype].call(this);
		else if (jQuery.type(this.options.on[eventtype]) === "array")
			jQuery(this.options.on[eventtype]).each(function(){this.call(this)});
		return this
	}
	,_triggerCustomOneEvents:function(eventtype){
		if (jQuery.type(this.options.one[eventtype]) === "function"){
			this.options.one[eventtype].call(this);
			this.options.one[eventtype] = undefined;
		} else if (jQuery.type(this.options.one[eventtype]) === "array")
			while (this.options.one[eventtype].length)
				this.options.one[eventtype].shift().call(this);
		return this
	}
	,width:function(w){
		if (jQuery.type(w)==="undefined")
			return this.winDiv.width();
		try{
			return this.winDiv.width(w)
		} finally {
			this._triggerCustomOnEvents('resize');
			this._triggerCustomOneEvents('resize');
		}
	}
	,height:function(h){
		if (jQuery.type(h)==="undefined")
			return this.winDiv.height();
		try{
			return this.winDiv.height(h);
		} finally {
			this._triggerCustomOnEvents('resize');
			this._triggerCustomOneEvents('resize');
		}
	}
	,find: function(selector){
		return this.winDiv.find(selector);
	}
	,end: function(){
		return this.winDiv;
	}
	,on: function(eventtype,callback){
		if (jQuery.type(eventtype) === "undefined" 
			|| jQuery.type(eventtype) !== "string"
			|| jQuery.type(callback) != "function"
			)
			return;
		switch(eventtype){
			case "maximize":
				this.options.on.maximize.push(callback);
				break;
			case "minimize":
				this.options.on.minimize.push(callback);
				break;
			case "maxrestore":
				this.options.on.maxrestore.push(callback);
				break;
			case "minrestore":
				this.options.on.minrestore.push(callback);
				break;
			case "resize":
				this.options.on.resize.push(callback);
				break;
			
			this.winDiv.on(eventtype,callback);
		}
		return this;
	}
	,one: function(eventtype,callback){
		if (jQuery.type(eventtype) === "undefined" 
			|| jQuery.type(eventtype) !== "string"
			|| jQuery.type(callback) != "function"
			)
			return;
		switch(eventtype){
			case "maximize":
				this.options.one.maximize.push(callback);
				break;
			case "minimize":
				this.options.one.minimize.push(callback);
				break;
			case "maxrestore":
				this.options.one.maxrestore.push(callback);
				break;
			case "minrestore":
				this.options.one.minrestore.push(callback);
				break;
			case "resize":
				this.options.on.resize.push(callback);
				break;
			
			this.winDiv.one(eventtype,callback);
		}
		return this;
	}
	,minimize: function(callback){
		this.winDiv.find(".minimize").click();
		if (jQuery.type(callback) === "function")
			callback();
		return this;
	}
	,maximize: function(callback){
		this.windoge.find(".maximize").click();
		if (jQuery.type(callback) === "function")
			callback();
		return this;
	}
	,restore: function(callback){
		if (this.options.winstate==0)
			return
		else if (this.options.winstate>0)
			this.windoge.find(".restore").click();
		else {
			jQuery('#'+this.id+'-min img').click()
		}
		if (jQuery.type(callback) === "function")
			callback();
		return this;
	}
	,setStatusMsg: 
		function(html,showfor){//If showfor set to 0 or negative shows until the next message is set
			if (jQuery.type(showfor) === "undefined" || isNaN(showfor))
				showfor	=	30000;//Default to 30 seconds
			this.winDiv.find('.statusmsg')
					.stop( true, true )
					.fadeOut('fast')
					.html(html)
					.fadeIn('fast')
			if (showfor>0)
				this.winDiv.find('.statusmsg')
					.delay(showfor)
					.fadeOut('fast')
			return this;
		}
}

jQuery.widget( "winDoge.window", {
	winDoge:undefined
	,options: {}
	,_init: function(){
		if (jQuery.type(this.winDoge) === "undefined")
			console.log("winDoge not initilized");
	}
	,_create: function() {
		if (jQuery.type(this.element) != "object" && jQuery.type(this.element[0]) != "winDoge")
			return null;
		this.winDoge	=	this.element[0];
	}
	,findContent:function(){
		this.winDoge.winDiv.find('.windogecontentinner').length>0
			return this.winDoge.winDiv.find('.windogecontentinner')
		return this.winDoge.winDiv.find('.windogecontent');
	}
	,generateLoremIpsom: function(paragraphs,callback){
		if (jQuery.type(paragraphs) === "undefined" || isNaN(paragraphs))
			paragraphs=5;
		
var		self	=	this;
		jQuery.ajax({
			type:'GET',  
			url:'http://www.corsproxy.com/loripsum.net/api/'+paragraphs+'/medium/decorate/link/ul/ol/dl/bq/code/headers/',
			dataType:'text', 
			async:true,  
			success:function(data){
				self.findContent().html(data);
				if (jQuery.type(callback) === "function")
					callback();
			}
		});
	}
	,setStatusMsg: function(html,showfor){//If showfor set to 0 or negative shows until the next message is set
		this.winDoge.setStatusMsg(html,showfor);
	}
	,on: function(eventtype,callback){
		this.winDoge.on(eventtype,callback);
	}
	,one: function(eventtype,callback){
		this.winDoge.one(eventtype,callback);
	}
	,minimize: function(callback){
		this.winDoge.winDiv.find(".minimize").click();
		if (jQuery.type(callback) === "function")
			callback();
	}
	,maximize: function(callback){
		this.winDoge.winDiv.find(".maximize").click();
		if (jQuery.type(callback) === "function")
			callback();
	}
});
//From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
if (!Object.keys) {
	Object.keys = (function() {
		'use strict';
		var hasOwnProperty = Object.prototype.hasOwnProperty,
				hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
				dontEnums = [
					'toString',
					'toLocaleString',
					'valueOf',
					'hasOwnProperty',
					'isPrototypeOf',
					'propertyIsEnumerable',
					'constructor'
				],
				dontEnumsLength = dontEnums.length;

		return function(obj) {
			if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
				throw new TypeError('Object.keys called on non-object');
			}

			var result = [], prop, i;

			for (prop in obj) {
				if (hasOwnProperty.call(obj, prop)) {
					result.push(prop);
				}
			}

			if (hasDontEnumBug) {
				for (i = 0; i < dontEnumsLength; i++) {
					if (hasOwnProperty.call(obj, dontEnums[i])) {
						result.push(dontEnums[i]);
					}
				}
			}
			return result;
		};
	}());
}