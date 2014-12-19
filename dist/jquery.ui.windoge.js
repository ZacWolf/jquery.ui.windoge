/*! jquery.ui.windoge - v0.1.0 - 2014-12-18
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
							self.windoge
								.find('.windogebar')
									.css('cursor','move')
								.end()
								.find('.resizeicon')
									.show()
								.end()
								.draggable('enable')
								.removeClass('maximized')
								.css(self.windoge.data('origStyle'))
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
							self.windoge
								.find('.windogebar')
									.css('cursor','auto')
								.end()
								.find('.resizeicon')
									.hide()
								.end()
								.draggable('disable')
								.data('origWidth',self.windoge.width())
								.data('origHeight',self.windoge.height())
								.data('origStyle',
										privatefunctions._getdiffs(
											privatefunctions._copyComputedCSS(self.windoge)
											,privatefunctions._copyComputedCSS(self.windoge.addClass('maximized'))
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
			,_minwindoge:function(minicon) {
	var			restore		=	
					function(event,ui){
						self.windoge.fadeIn(800);
						self.options.winstate=0;
						jQuery('#'+self.id+'-min')
							.effect(
								"transfer"
								,{ to: self.windoge, className: "ui-effects-transfer" }
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
	var			minimize	=
					function(event,ui){
						jQuery('#windoge-minimizedock ul').append('<li id="'+self.id+'-min"><a><em><span>'+self.options.header+'</span></em><img src="'+self.options.winlogo+'" /></a></li>');
						jQuery('#'+self.id+'-min img').one('click',restore)
						self.windoge
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
		
		self.windoge 	=	jQuery('<div class="windoge'
							+(self.options.windropshadow?' windropshadow':'')
							+(self.options.winroundedcorners?' rounded'+self.options.winroundedcorners+' topleft topright bottomleft bottomright':'')
							+'"></div>');
		
		if (self.options.id)//assign the ID based on the one passed via ptions
			self.windoge.attr('id',self.options.id);
		else //If the user didn't specify an ID then use a generated one
			self.windoge.uniqueId();
		
		jQuery.each(self.options,function(attr,val){
			if (attr.toLowerCase()==="style" && jQuery.type(val)==="object"){
				self.windoge.css(self.options.style);
				self.options.style	=	undefined;
			} else 	if (attr.toLowerCase()!=="on" 
						&& attr.toLowerCase()!=="one" 
						&& attr.toLowerCase()!=="contentdiv"
						) 
				self.windoge.data(attr,val);
		})
		self.id	=	self.windoge.attr('id');
var		topbar	=	jQuery(	'<div id="'+self.id+'topbar" class="windogebar'+(self.options.winroundedcorners?' rounded'+self.options.winroundedcorners+' topleft topright':'')+'">'+
							'<span id="'+self.id+'barheader" class="header'+(self.options.winlogoshow?'':' nologo')+'">'
								+self.options.header+
							'</span>'+
							'<div class="icons'+(self.options.winroundedcorners?' rounded'+self.options.winroundedcorners:'')+'">'+
								'<div class="icon minimize"></div>'+
								'<div class="icon maximize"></div>'+
							'</div>'+
						'</div>')
						.appendTo(self.windoge);
var		bttmbar	=	jQuery(	'<div id='+self.id+'bottombar" class="windogestatus'+(self.options.winroundedcorners?' rounded bottomleft bottomright':'')+'">'+
							'<div id="'+self.id+'status" class="statusmsg"></div>'+
							'<div class="resizeicon"></div>'+
						'</div>')
						.appendTo(self.windoge);		
var		middle	=	jQuery(	'<div id="'+self.id+'middle" class="windogemiddle"></div>')
						.appendTo(self.windoge)
var		winlogo	=	(self.options.winlogoshow
					?jQuery(	'<img id="'+self.id+'logo" class="logo'+(self.options.winlogodropshadow?' dropshadow':'')+'" src="'+self.options.winlogo+'" />')
						.appendTo(self.windoge)
					:""
					)	;
		self.windoge
			.data('resizestart',{})
			.data('resizewidth',0)
			.data('resideheight',0)
			.appendTo(jQuery('#windoge-pane'))
			.draggable({cursor:'move'
						,containment:'window'
						,scroll:false
						,handle:jQuery('.windogebar')
						,stack: ".windoge"
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
var									windoge_o	=	self.windoge.offset();
var									resize_o	=	ui.offset
var									minw		=	parseInt(self.windoge.css('min-width'));
var									w			=	(resize_o.left+jQuery(this).width()) - windoge_o.left
var									minh		=	parseInt(self.windoge.css('min-height'))
var									h			=	resize_o.top - windoge_o.top
									if (w >= minw)
										self.width(w);
									if (h >= minh)
										self.height(h);
								}
							,helper:"clone"
							,opacity:0.1
							,containment:'window'
						});
					}
				)
		middle.css({'top':topbar.outerHeight()+3,'bottom':bttmbar.outerHeight()});
		
		if (self.options.contentdiv){
var			contentdiv	=	jQuery(self.options.contentdiv).detach();
			contentdiv.addClass('windogecontent')
			middle.append(contentdiv);
			self.options.contentdiv	=	undefined;
		}
}
winDoge.prototype	=	{
	windoge:undefined
	,id:undefined
	,options:{}
	,_defaults:{'winlogo':'minimized-icon.png'
				,'winlogoshow':true
				,'winroundedcorners':'5'
				,'winstate':0
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
		function(self){
var			bw		=	jQuery('body').width();
var			bh		=	jQuery('body').height();
var			ell		=	self.windoge.offset().left;
var			elw		=	self.windoge.width();
var			elt		=	self.windoge.offset().top;
var			elh		=	self.windoge.height();
			if (bw<(ell+elw))
				if (bw>elw)
					self.windoge.css("left",(bw-elw)+"px");
				else{
					self.windoge.css("left",0);
					self.width(bw-1);
				}
				
			if (bh<(elt+elh))
				if (bh>elh)
					self.windoge.css("top",(bh-elh)+"px");
				else{
					self.windoge.css("top",0);
					self.height(bh-1);
				}
		}
	,_triggerCustomOnEvents:function(eventtype){
var		self	=	this;
		if (jQuery.type(self.options.on[eventtype]) === "function")
			self.options.on[eventtype].call(self);
		else if (jQuery.type(self.options.on[eventtype]) === "array")
			jQuery(self.options.on[eventtype]).each(function(){this.call(self)});
		return self
	}
	,_triggerCustomOneEvents:function(eventtype){
var		self	=	this;
		if (jQuery.type(self.options.one[eventtype]) === "function"){
			self.options.one[eventtype].call(self);
			self.options.one[eventtype] = undefined;
		} else if (jQuery.type(self.options.one[eventtype]) === "array")
			while (self.options.one[eventtype].length)
				self.options.one[eventtype].shift().call(self);
		return self
	}
	,width:function(w){
		if (jQuery.type(w)==="undefined")
			return this.windoge.width();
		try{
			return this.windoge.width(w)
		} finally {
			this._triggerCustomOnEvents('resize');
			this._triggerCustomOneEvents('resize');
		}
	}
	,height:function(h){
		if (jQuery.type(h)==="undefined")
			return this.windoge.height();
		try{
			return this.windoge.height(h);
		} finally {
			this._triggerCustomOnEvents('resize');
			this._triggerCustomOneEvents('resize');
		}
	}
	,find: function(selector){
		return this.windoge.find(selector);
	}
	,end: function(){
		return this.windoge;
	}
	,on: function(eventtype,callback){
		if (jQuery.type(eventtype) === "undefined" 
			|| jQuery.type(eventtype) !== "string"
			|| jQuery.type(callback) != "function"
			)
			return;
var		self	=	this;
		switch(eventtype){
			case "maximize":
				self.options.on.maximize.push(callback);
				break;
			case "minimize":
				self.options.on.minimize.push(callback);
				break;
			case "maxrestore":
				self.options.on.maxrestore.push(callback);
				break;
			case "minrestore":
				self.options.on.minrestore.push(callback);
				break;
			case "resize":
				self.options.on.resize.push(callback);
				break;
			
			return self;
		}
		this.windoge.on(eventtype,callback);
		return this;
	}
	,one: function(eventtype,callback){
		if (jQuery.type(eventtype) === "undefined" 
			|| jQuery.type(eventtype) !== "string"
			|| jQuery.type(callback) != "function"
			)
			return;
var		self	=	this;
		switch(eventtype){
			case "maximize":
				self.options.one.maximize.push(callback);
				break;
			case "minimize":
				self.options.one.minimize.push(callback);
				break;
			case "maxrestore":
				self.options.one.maxrestore.push(callback);
				break;
			case "minrestore":
				self.options.one.minrestore.push(callback);
				break;
			case "resize":
				self.options.on.resize.push(callback);
				break;
			
			return self;
		}
		this.windoge.one(eventtype,callback);
		return this;
	}
	,minimize: function(callback){
		this.windoge.find(".minimize").click();
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
}

jQuery.widget( "winDoge.window", {
	windoge:undefined
	,options: {}
	,_init: function(){
		if (jQuery.type(this.windoge) === "undefined")
			console.log("windoge not initilized");
	}
	,_create: function() {
		if (jQuery.type(this.element) != "object" && jQuery.type(this.element[0]) != "winDoge")
			return;
		this.windoge	=	this.element[0].windoge;
	}
	,findContent:function(){
		this.windoge.find('.windogecontent');
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
				self.windoge.find('.windogecontent').html(data);
				if (jQuery.type(callback) === "function")
					callback();
			}
		});
	}
	,setStatusMsg: function(html,showfor){//If showfor set to 0 or negative shows until the next message is set
		if (jQuery.type(showfor) === "undefined" || isNaN(showfor))
			showfor	=	30000;//Default to 30 seconds
		this.windoge.find('.statusmsg')
				.stop( true, true )
				.fadeOut('fast')
				.html(html)
				.fadeIn('fast')
		if (showfor>0)
			this.windoge.find('.statusmsg')
				.delay(showfor)
				.fadeOut('fast')
	}
	,on: function(eventtype,callback){
		this.windoge.on(eventtype,callback);
	}
	,one: function(eventtype,callback){
		this.windoge.on(eventtype,callback);
	}
	,minimize: function(callback){
		this.windoge.find(".minimize").click();
		if (jQuery.type(callback) === "function")
			callback();
	}
	,maximize: function(callback){
		this.windoge.find(".maximize").click();
		if (jQuery.type(callback) === "function")
			callback();
	}
});
