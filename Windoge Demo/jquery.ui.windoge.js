/*
* windoge jQuery UI plugin v0.5
*
* Adds draggable, resizable, maximizable, and minimizable windows to your site
*
* Copyright (c) 2014 Zac Morris
* https://github.com/ZacWolf/jquery.ui.windogedows
* http://zacwolf.com
* Licensed under the GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007
*/
var	winDoge	= function(options){
var		privatefunctions	=
	//Start Private Function
	{		_getAttributes: function(el) {
	var			attributes = {}; 
				if( el.length ) {
					$.each( el[0].attributes, function( index, attr ) {
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
				} else if (typeof css == "string") {
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
				$.each(obj2, function(key,value){
					if (value != obj1[key])
						newobj[key] = obj1[key];
				});
				return newobj;
			}
			,_copyComputedCSS:function(obj){
				if (obj instanceof jQuery)
					obj			=	obj[0];
	var			styles		=	getComputedStyle(obj,null);
	var			newstyles	=	{};
				$.each(styles, function(index,key){
					newstyles[key] = styles[key]
				});
				return newstyles;
			}
			,_onresizedrag:function(event, ui){
	var			windoge		=	$(this).parents('.windoge');
	var			windoge_o	=	windoge.offset();
	var			resize_o	=	ui.offset
	var			minw		=	parseInt(windoge.css('min-width'));
	var			w			=	resize_o.left - windoge_o.left
	var			minh		=	parseInt(windoge.css('min-height'))
	var			h			=	resize_o.top - windoge_o.top
				if (w >= minw)
					windoge.width(w);
				if (h >= minh)
					windoge.height(h);
			}
			,_maxwindoge:
				function(self,maxicon){
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
								.data('windogestate',0)
							while (self.customevents.one.maxrestore.length)
								self.customevents.one.maxrestore.shift().call();
							$(self.customevents.on.maxrestore).each(function(){this});
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
								.data('windogestate',1)
								while (self.customevents.one.maximize.length)
									self.customevents.one.maximize.shift().call();
								$(self.customevents.on.maximize).each(this);
						}
					maxicon.one('click',maximize);
				}
			,_minwindoge:function(self,minicon) {
	var			restore		=	
					function(event,ui){
						self.windoge.fadeIn(800)
							.data('windogestate',0)
						$('#'+self.windoge.attr('id')+'-min')
							.effect(
								"transfer"
								,{ to: self.windoge, className: "ui-effects-transfer" }
								,400
								,function(){
									while (self.customevents.one.minrestore.length)
										self.customevents.one.minrestore.shift().call();
									$(self.customevents.on.minrestore).each(this);
								}
							)
							.remove();
					}
	var			minimize	=
					function(event,ui){
						$('#windoge-minimizedock ul').append('<li id="'+self.windoge.attr('id')+'-min"><a><em><span>'+self.windoge.data('header')+'</span></em><img src="'+self.windoge.data('winlogo')+'" /></a></li>');
						$('#'+self.windoge.attr('id')+'-min img').one('click',restore)
						self.windoge
							.effect(
								"transfer"
								,{ to: '#'+self.windoge.attr('id')+'-min img', className: "ui-effects-transfer" }
								,400
								,function(){
									while (self.customevents.one.minimize.length)
										self.customevents.one.minimize.shift().call();
									$(self.customevents.on.minimize).each(this);
								}
							)
							.hide()
							.data('windogestate',-1);
					}
				minicon.on('click',minimize);
			}
	}//End Private Function
//Start Public Values/Functions
var		self			=	this;
		options			=	$.extend(true,{},this._defaults,options);
		
		if ($('#windoge-pane').length==0)
			$("<div id='windoge-pane' class='ui-front'><div id='windoge-minimizedock' class='dock'><ul></ul></div></div>").appendTo($('body'));
		
		if (options.winroundedcorners)
			options.winroundedcorners	=	!isNaN(options.winroundedcorners)
												?(options.winroundedcorners<1
													?1
													:(options.winroundedcorners>5
														?5
														:options.winroundedcorners
													 )
												 )
												:5;
		
		this.windoge 	=	$('<div class="windoge'
							+(options.windropshadow?' windropshadow':'')
							+(options.winroundedcorners?' rounded'+options.winroundedcorners+' topleft topright bottomleft bottomright':'')
							+'"></div>');
		
		if (options.id)//assign the ID based on the one passed via ptions
			this.windoge.attr('id',options.id);
		else //If the user didn't specify an ID then use a generated one
			this.windoge.uniqueId();
		
		$.each(options,function(attr,val){
			if (attr.toLowerCase()==="on" && typeof attr === "object"){
				$.each(val,self.on);
			} else if (attr!=="style" && attr!=="contentdiv")
				self.windoge.data(attr,val);
		})
		this.id		=	this.windoge.attr('id');
var		topbar	=	$(	'<div id="'+this.id+'topbar" class="windogebar'+(options.winroundedcorners?' rounded'+options.winroundedcorners+' topleft topright':'')+'">'+
							'<span id="'+this.id+'barheader" class="header'+(options.winlogoshow?'':' nologo')+'">'
								+options.header+
							'</span>'+
							'<div class="icons'+(options.winroundedcorners?' rounded'+options.winroundedcorners:'')+'">'+
								'<div class="icon minimize"></div>'+
								'<div class="icon maximize"></div>'+
							'</div>'+
						'</div>')
						.appendTo(this.windoge);
var		bttmbar	=	$(	'<div id='+this.id+'bottombar" class="windogestatus'+(options.winroundedcorners?' rounded bottomleft bottomright':'')+'">'+
							'<div id="'+this.id+'status" class="statusmsg"></div>'+
							'<div class="resizeicon"></div>'+
						'</div>')
						.appendTo(this.windoge);		
var		middle	=	$(	'<div id="'+this.id+'middle" class="windogemiddle"></div>')
						.appendTo(this.windoge)
var		winlogo	=	(options.winlogoshow
					?$(	'<img id="'+this.id+'logo" class="logo'+(options.winlogodropshadow?' dropshadow':'')+'" src="'+options.winlogo+'" />')
						.appendTo(this.windoge)
					:""
					)	;
		this.windoge
			.css(options.style)
			.data('resizestart',{})
			.data('resizewidth',0)
			.data('resideheight',0)
			.appendTo($('#windoge-pane'))
			.draggable({cursor:'move'
						,containment:'window'
						,scroll:false
						,handle:$('.windogebar')
						,stack: ".windoge"
						})
			.find('.windogebar .icon')
				.each(
					function(){
						if ($(this).hasClass('maximize'))
							privatefunctions._maxwindoge(self,$(this));
						else if ($(this).hasClass('minimize'))
							privatefunctions._minwindoge(self,$(this));
					}
				)
			.end()
			.find('.resizeicon')
				.each(
					function(){
						$(this).draggable({
							drag:privatefunctions._onresizedrag
							,helper:"clone"
							,opacity:0.1
						});
					}
				)
		middle.css({'top':topbar.outerHeight()+3,'bottom':bttmbar.outerHeight()});
		
		if (options.contentdiv){
var			contentdiv	=	$(options.contentdiv).detach();
			contentdiv.addClass('windogecontent')
			middle.append(contentdiv);
		}
}
winDoge.prototype	=	{
	windoge:undefined
	,customevents:{
		'on':{	'maximize':[]
				,'maxrestore':[]
				,'minimize':[]
				,'minrestore':[]
			}
		,'one':{'maximize':[]
				,'maxrestore':[]
				,'minimize':[]
				,'minrestore':[]
			}
	}
	,id:undefined
	,_defaults:{'winlogo':'minimized-icon.png'
				,'winlogoshow':true
				,'winroundedcorners':'5'
				,'style':{'width':'640px'
					 	 ,'height':'480px'
						 ,'min-width':'350px'
						 ,'min-height':'200px'
						 }
	}
	,on: function(eventtype,callback){
		if (typeof eventtype === "undefined" 
			|| typeof eventtype !== "string"
			|| typeof callback != "function"
			)
			return;
var		self	=	this;
		switch(eventtype){
			case "maximize":
				self.customevents.on.maximize.push(callback);
				return self;
			case "minimize":
				self.customevents.on.minimize.push(callback);
				return self;
			case "maxrestore":
				self.customevents.on.maxrestore.push(callback);
				return self;
			case "minrestore":
				self.customevents.on.minrestore.push(callback);
				return self;
		}
		this.windoge.on(eventtype,callback);
		return this;
	}
	,one: function(eventtype,callback){
		if (typeof eventtype === "undefined" 
			|| typeof eventtype !== "string"
			|| typeof callback != "function"
			)
			return;
var		self	=	this;
		switch(eventtype){
			case "maximize":
				self.customevents.one.maximize.push(callback);
				return self;
			case "minimize":
				self.customevents.one.minimize.push(callback);
				return self;
			case "maxrestore":
				self.customevents.one.maxrestore.push(callback);
				return self;
			case "minrestore":
				self.customevents.one.minrestore.push(callback);
				return self;
		}
		this.windoge.one(eventtype,callback);
		return this;
	}
	,minimize: function(callback){
		this.windoge.find(".minimize").click();
		if (typeof callback === "function")
			callback();
		return this;
	}
	,maximize: function(callback){
		this.windoge.find(".maximize").click();
		if (typeof callback === "function")
			callback();
		return this;
	}
	,restore: function(callback){
		if (this.windoge.data('windogestate')==0)
			return
		else if (this.windoge.data('windogestate')>0)
			this.windoge.find(".restore").click();
		else {
			$('#'+this.windoge.attr('id')+'-min img').click()
		}
		if (typeof callback === "function")
			callback();
		return this;
	}
}

$.widget( "winDoge.window", {
	windoge:undefined
	,options: {}
	,_init: function(){
		if (typeof this.windoge === "undefined")
			console.log("windoge not initilized");
	}
	,_create: function() {
		if (typeof this.element != "object" && typeof this.element[0] != "winDoge")
			return;
		this.windoge	=	this.element[0].windoge;
	}
	,findContent:function(){
		this.windoge.find('.windogecontent');
	}
	,generateLoremIpsom: function(paragraphs,callback){
		if (typeof paragraphs === "undefined" || isNaN(paragraphs))
			paragraphs=5;
		
var		self	=	this;
		$.ajax({
			type:'GET',  
			url:'http://www.corsproxy.com/loripsum.net/api/'+paragraphs+'/medium/decorate/link/ul/ol/dl/bq/code/headers/',
			dataType:'text', 
			async:true,  
			success:function(data){
				self.windoge.find('.windogecontent').html(data);
				if (typeof callback === "function")
					callback();
			}
		});
	}
	,setStatusMsg: function(html,showfor){//If showfor set to 0 or negative shows until the next message is set
		if (typeof showfor === "undefined" || isNaN(showfor))
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
		if (typeof callback === "function")
			callback();
	}
	,maximize: function(callback){
		this.windoge.find(".maximize").click();
		if (typeof callback === "function")
			callback();
	}
});
