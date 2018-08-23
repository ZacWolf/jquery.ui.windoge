/*! jquery.ui.windoge - v0.1.0 - 2018-08-23
 *
 * Adds draggable, resizable, maximizable, and minimizable windows to your site
 *
 * https://github.com/ZacWolf/jquery.ui.windoge
 * Copyright (c) 2014-2016 Zac Morris <zac@zacwolf.com> [http://www.zacwolf.com]
 * Licensed under GPL-3.0
 */

jQuery.widget( "winDoge.window", {
	windiv: null
	,id:null
	,options:{	'winheader':''
				,'winlogo':'minimized-icon.png'
				,'winlogoshow':true
				,'winlogodropshadow':true
				,'winroundedcorners':'5'
				,'winstate':0
				,'winperistposition':false
				,'winroundedcorners':false
				,'winclosable':false
				,'style':{'width':'640px'
					 	 ,'height':'480px'
						 ,'min-width':'350px'
						 ,'min-height':'200px'
						 ,'position':'absolute'
						 ,'top':'0'
						 ,'left':'0'
					}
				,'on':{	'maximize':[]
						,'maxrestore':[]
						,'minimize':[]
						,'minrestore':[]
						,'resize':[]
						,'close':[]
					}
				,'one':{'maximize':[]
						,'maxrestore':[]
						,'minimize':[]
						,'minrestore':[]
						,'resize':[]
						,'close':[]
					}
	}
	,_create: 
		function() {
			this.windiv		=	this.element;
			this.windiv.uniqueId();
			this.id			=	this.windiv.attr('id');
var			self			=	this;
			
			jQuery( window ).on('resize',function(e){self._testSize();});
			if (jQuery('#windoge-pane').length==0)
				jQuery("<div id='windoge-pane' class='ui-front'><div id='windoge-minimizedock' class='dock'><ul></ul></div></div>").appendTo(jQuery('body'));
			if (this.options.winroundedcorners)
				this.options.winroundedcorners	=	!isNaN(this.options.winroundedcorners)
													?(this.options.winroundedcorners<1
														?1
														:(this.options.winroundedcorners>5
															?5
															:this.options.winroundedcorners
														 )
													 )
													:5;
			this.windiv.addClass('windoge'
							+(this.options.windropshadow?' windropshadow':'')
							+(this.options.winroundedcorners?' rounded'+this.options.winroundedcorners+' topleft topright bottomleft bottomright':'')
						);
			jQuery.each(this.options,function(attr,val){
				if (attr.toLowerCase()==="style" && jQuery.type(val)==="object"){
					self.windiv.css(self.options.style);
					self.options.style	=	undefined;
				} else if (attr.toLowerCase()!=="on" 
							&& attr.toLowerCase()!=="one" 
							&& attr.toLowerCase()!=="contentdiv"
							) 
					self.windiv.data(attr,val);
			})
var			topbar	=	jQuery(	'<div id="'+this.id+'topbar" class="windogebar'+(this.options.winroundedcorners?' rounded'+this.options.winroundedcorners+' topleft topright':'')+'">'+
									'<span id="'+this.id+'barheader" class="header'+(this.options.winlogoshow?'':' nologo')+'">'
										+this.options.winheader+
									'</span>'+
									'<div class="icons'+(this.options.winroundedcorners?' rounded'+this.options.winroundedcorners:'')+'">'+
										'<div class="icon minimize"></div>'+
										'<div class="icon maximize"></div>'+
										(this.options.winclosable?'<div class="icon close"></div>':'')+
									'</div>'+
								'</div>')
							.appendTo(this.windiv);
var			bttmbar	=	jQuery(	'<div id='+this.id+'bottombar" class="windogestatus'+(this.options.winroundedcorners?' rounded bottomleft bottomright':'')+'">'+
									'<div id="'+this.id+'status" class="statusmsg"></div>'+
									'<div class="resizeicon"></div>'+
								'</div>')
							.appendTo(this.windiv);
var			winlogo	=	(this.options.winlogoshow
						?jQuery('<img id="'+this.id+'logo" class="logo'+(this.options.winlogodropshadow?' dropshadow':'')+'" src="'+this.options.winlogo+'" />')
							.appendTo(this.windiv)
						:""
						);
			this.windiv
				.data('resizestart',{})
				.data('resizewidth',0)
				.data('resideheight',0)
				.appendTo('#windoge-pane')
				.draggable({cursor:'move'
							,containment:"parent"
							,scroll:false
							,handle:jQuery('.windogebar',this.windiv)
//							,stack: ".windoge"  //only brings to top on drag, not on click so wrote method _bringToTop that is triggered on mousedown
							,stop:
								function(event,ui){
									if (self.options.winpersistposition){
										self._createCookie("windoge-"+this.id+"-pos","{'top':"+self.windiv.offset().top+",'left':"+self.windiv.offset().left+"}");
									}
								}
							})
				;
var			middle	=	jQuery(	'<div id="'+this.id+'middle" class="windogemiddle"></div>')
						.css({'top':topbar.outerHeight(),'bottom':bttmbar.outerHeight()})
						.appendTo(this.windiv);

			if (this.options.contentdiv){
var				contentdiv	=	jQuery(this.options.contentdiv).detach();
				if (contentdiv.find('.windogecontent').length==0)
					contentdiv.addClass('windogecontent')
				middle.append(contentdiv);
				this.options.contentdiv	=	undefined;
			} else {
				middle.append(jQuery("<div id='"+this.id+"content' class='windogecontent'><div class='windogecontentinner'></div></div>"));
			}
			if (this.options.winpersistposition){
				if (!navigator.cookieEnabled){
					self.setStatusMsg("<span style='color:#888888;font-weight:bold;'>Cookies not allowed, reseting to initial position and size.</span>")
				} else {
var					pos,size;
					eval("pos="+self._readCookie("windoge-"+this.id+"-pos"));
					if (pos!=null)
						this.windiv.css(pos);
					eval("size="+self._readCookie("windoge-"+this.id+"-size"));
					if (size!=null){
						this.windiv.width(size.width);
						this.windiv.height(size.height);
					}
				}
			}
			//self.data("windoge",self);
			return this;
		}
	,_init://called after _create
		function(){
var			self			=	this;
			self.windiv
				.find('.windogebar .icon')
					.each(
						function(){
							if (jQuery(this).hasClass('maximize'))
								self._maxwindoge(jQuery(this));
							else if (jQuery(this).hasClass('minimize'))
								self._minwindoge(jQuery(this));
							else if (jQuery(this).hasClass('close'))
								self._closewindoge(jQuery(this));
						}
					)
					.end()//reset after the last find
				.find('.resizeicon')
					.each(
						function(){
							jQuery(this).draggable({
								drag:
									function(event,ui){
var										windoge_o	=	self.windiv.offset();
var										resize_o	=	ui.offset
var										minw		=	parseInt(self.css('min-width'));
var										w			=	(resize_o.left+self.windiv.width()) - windoge_o.left
var										minh		=	parseInt(self.css('min-height'))
var										h			=	resize_o.top - windoge_o.top
										if (w >= minw)
											self.windiv.width(w);
										if (h >= minh)
											self.windiv.height(h);
									}
								,stop:
									function(event,ui){
										if (self.options.winpersistposition){
											self._createCookie("windoge-"+self.id+"-size","{'width':"+self.windiv.width()+",'height':"+self.windiv.height()+"}");
										}
									}
								,helper:"clone"
								,opacity:0.1
								,containment:'window'
								,stack: ".windoge"
							});
						}
					)
					.end()//reset after the last find
				.on('mousedown',self._bringToTop)
				.click()
				;
			return self;
		}
	,_testSize:
		function(){
var			bw		=	jQuery("#windoge-pane").width();
var			bh		=	jQuery("#windoge-pane").height();
var			ell		=	this.windiv.offset().left;
var			elw		=	this.windiv.width();
var			elt		=	this.windiv.offset().top;
var			elh		=	this.windiv.height();
			if (bw<(ell+elw))
				if (bw>elw)
					this.windiv.css("left",(bw-elw)+"px");
				else{
					this.windiv.css("left",0);
					this.windiv.width(bw-1);
				}
				
			if (bh<(elt+elh))
				if (bh>elh)
					this.windiv.css("top",(bh-elh)+"px");
				else{
					this.windiv.css("top",0);
					this.windiv.height(bh-1);
				}
		}
	,_triggerCustomOnEvents:
		function(eventtype){
			if (jQuery.type(this.options.on[eventtype]) === "function")
				this.options.on[eventtype].call(this);
			else if (jQuery.type(this.options.on[eventtype]) === "array")
				jQuery(this.options.on[eventtype]).each(function(){this.call(this)});
			return this
		}
	,_triggerCustomOneEvents:
		function(eventtype){
			if (jQuery.type(this.options.one[eventtype]) === "function"){
				this.options.one[eventtype].call(this);
				this.options.one[eventtype] = undefined;
			} else if (jQuery.type(this.options.one[eventtype]) === "array")
				while (this.options.one[eventtype].length)
					this.options.one[eventtype].shift().call(this);
			return this
		}
	,_getAttributes:
		function(el) {
var			attributes = {}; 
			if( el.length ) {
				jQuery.each( el[0].attributes, function( index, attr ) {
					attributes[ attr.name ] = attr.value;
				} ); 
			}
			return attributes;
		}
	,_styles2json: 
		function(css) {
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
	,_getdiffs: 
		function(obj1,obj2){
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
var			self		=	this;
var 		restore,maximize;
			maximize	=
				function(event,ui){
					maxicon
						.removeClass('maximize')
						.addClass('restore')
						.one('click',restore)
					self.windiv
						.find('.windogebar')
							.css('cursor','auto')
							.end()
						.find('.resizeicon')
							.hide()
							.end()
						.draggable('disable')
						.effect(
							"transfer"
							,{ to: '#windoge-pane', className: "ui-effects-transfer" }
							,400
							,function(){
								self._triggerCustomOnEvents('maximize');
								self._triggerCustomOneEvents('maximize');
							}
						)
						.data('origWidth',self.width())
						.data('origHeight',self.height())
						.data('origStyle',
								self._getdiffs(
									self._copyComputedCSS(self.windiv)
									,self._copyComputedCSS(self.windiv.addClass('maximized'))
								)
						)
					self.options.winstate=1;
				}
	 		restore		=	
				function(event,ui){
					maxicon
						.removeClass('restore')
						.addClass('maximize')
						.one('click',maximize)
					self.windiv
						.find('.windogebar')
							.css('cursor','move')
							.end()
						.find('.resizeicon')
							.show()
							.end()
						.draggable('enable')
						.removeClass('maximized')
						.css(self.windiv.data('origStyle'))
						.data('winstate',0)
						;
					self._triggerCustomOnEvents('maxrestore');
					self._triggerCustomOneEvents('maxrestore');
				}
			maxicon.one('click',maximize);
		}
	,_minwindoge:
		function(minicon) {
var			self		=	this;
var			restore,minimize;
			minimize	=
				function(event,ui){
					jQuery('#windoge-minimizedock ul').append('<li id="'+self.id+'-min"><a><em><span>'+self.options.winheader+'</span></em><img src="'+self.options.winlogo+'" /></a></li>');
					jQuery('#'+self.id+'-min img').one('click',restore)
					self.windiv
						.effect(
							"transfer"
							,{ to: '#'+self.id+'-min img', className: "ui-effects-transfer" }
							,400
							,function(){
								self.windiv.fadeOut(100);
								self._triggerCustomOnEvents('minimize');
								self._triggerCustomOneEvents('minimize');
							}
						)
						;
					self.options.winstate=-1;
				}
			restore		=	
				function(event,ui){
					self.windiv.fadeIn(100);
					self._testSize();
					minicon.one('click',minimize);
					jQuery('#'+self.id+'-min')
						.effect("transfer"
								,{ to: self.windiv, className: "ui-effects-transfer" }
								,400
								,function(){
									
									this.remove();
									self._triggerCustomOnEvents('minrestore');
									self._triggerCustomOneEvents('minrestore');
								}
						)
						;
					self.options.winstate=0;
				}
			minicon.one('click',minimize);
	}
	,_closewindoge:
		function(closeicon){
			try{
var				close	=
					function(event,ui){
						this.windiv.hide();
						closeicon.one('click',close);
					}
				closeicon.one('click',close);
			} finally {
				_triggerCustomOnEvents('close');
				_triggerCustomOneEvents('close');
			}
		}
	,_createCookie: 
		function(name,value,days) {
			if (!navigator.cookieEnabled)
				return false;
var				expires = "; expires=Tue, 19 Jan 2038 03:14:07 UTC";//End of the Unix Epoch for now				
			if (days) {
var				date = new Date();
				date.setTime(date.getTime()+(days*24*60*60*1000));
				expires = "; expires="+date.toGMTString();
			}
				document.cookie = name+"="+value+expires+";";
				return true;
		}
	,_readCookie: 
		function(name) {
			if (!navigator.cookieEnabled)
				return null;
var			nameEQ	=	name + "=";
var			ca		=	document.cookie.split(';');
			for(var i=0;i < ca.length;i++) {
var				c	=	ca[i];
				while (c.charAt(0)==' ') c = c.substring(1,c.length);
				if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
			}
			return null;
		}
	,_eraseCookie:
		function(name) {
			_createCookie(name,"",-1);
		}
	,_bringToTop:
		function(event){
var			group	=	jQuery.makeArray(jQuery('.windoge'))
							.sort(
								function(a, b) {
									return (parseInt(jQuery(a).css("zIndex"), 10) || 0) - (parseInt(jQuery(b).css("zIndex"), 10) || 0);
									}
								);
			if (!group.length) return;
var			min		=	parseInt(jQuery(group[0]).css("zIndex"), 10) || 0;
			jQuery(group)
				.each(
					function(i) {
						jQuery(this).css("zIndex", min + i);
					}
				);
			jQuery(this).css("zIndex", (min + group.length));
		}
	,findContent:function(){
		if (this.windiv.find('.windogecontentinner').length>0)
			return this.windiv.find('.windogecontentinner')
		return this.windiv.find('.windogecontent');
	}
	,generateLoremIpsom: 
		function(paragraphs,callback){
			if (jQuery.type(paragraphs) === "undefined" || isNaN(paragraphs))
				paragraphs=5;
			loadContent('http://www.corsproxy.com/loripsum.net/api/'+paragraphs+'/medium/decorate/link/ul/ol/dl/bq/code/headers/',callback);
		}
	,loadContent://The URL needs to be the same domain, or support CORS (http://www.corsproxy.com)
		function(contenturl,callback){
var			self	=	this;
			jQuery.ajax({
				type:'GET',
				url:contenturl,
				dataType:'text',
				async:true,
				success:function(data){
					self.findContent().html(data);
					if (jQuery.type(callback)==="function")
						callback();
				}
			});
		}
	,width:function(w){
		if (jQuery.type(w)==="undefined")
			return this.windiv.width();
		try{
			return this.windiv.width(w)
		} finally {
			_triggerCustomOnEvents('resize');
			_triggerCustomOneEvents('resize');
		}
	}
	,height:function(h){
		if (jQuery.type(h)==="undefined")
			return this.windiv.height();
		try{
			return this.windiv.height(h);
		} finally {
			_triggerCustomOnEvents('resize');
			_triggerCustomOneEvents('resize');
		}
	}
	,find: function(selector){
		return this.windiv.find(selector);
	}
	,on: function(eventtype,callback){
		if (jQuery.type(eventtype) !== "undefined" 
			&& (jQuery.type(eventtype) === "string"
				|| jQuery.type(callback) === "function"
				)
			){
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
				case "close":
					this.options.on.close.push(callback);
					break;
				default:
					this.windiv.on(eventtype,callback);
			}
		}
		return this;
	}
	,one: function(eventtype,callback){
		if (jQuery.type(eventtype) !== "undefined" 
			&& (jQuery.type(eventtype) === "string"
				|| jQuery.type(callback) === "function"
				)
			){
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
					this.options.one.resize.push(callback);
					break;
				case "close":
					this.options.one.close.push(callback);
					break;
				default:
					this.windiv.one(eventtype,callback);
			}
		}
		return this;
	}
	,minimize: function(callback){
		this.windiv.find(".minimize").click();
		if (jQuery.type(callback) === "function")
			callback();
		return this;
	}
	,maximize: function(callback){
		this.windiv.find(".maximize").click();
		if (jQuery.type(callback) === "function")
			callback();
		return this;
	}
	,restore: function(callback){
		this.windiv.show();//Incase hidden by close
		if (this.options.winstate==0)
			return;
		if (this.options.winstate>0)
			this.windiv.find(".restore").click();
		else {
			jQuery('#'+this.attr('id')+'-min img').click()
		}
		if (jQuery.type(callback) === "function")
			callback();
		return this;
	}
	,close: function(callback){
		this.find(".close").click();
		if (jQuery.type(callback) === "function")
			callback();
		return this;
	}
	,setStatusMsg: 
		function(html,showfor){//If showfor set to 0 or negative shows until the next message is set
			if (jQuery.type(showfor) === "undefined" || isNaN(showfor))
				showfor	=	30000;//Default to 30 seconds
			this.windiv
				.find('.statusmsg')
				.stop( true, true )
				.fadeOut('fast')
				.html(html)
				.fadeIn('fast')
			if (showfor>0)
				this.windiv
					.find('.statusmsg')
					.delay(showfor)
					.fadeOut('fast')
			return this;
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