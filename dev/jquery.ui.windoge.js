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
var	winDoge = function(options){
var		privatemethods	=
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
			function(windoge,maxicon){
var				self		=	this;
var 			restore		=	
					function(){
						maxicon
							.removeClass('restore')
							.addClass('maximize')
							.one('mouseup',maximize)
						windoge
							.find('.windogebar')
							.css('cursor','move')
						windoge
							.draggable('enable')
							.removeClass('maximized')
							.css(windoge.data('origStyle'))
							.data('windogestate',0)
							.data('onmaxrestore')(windoge.data('origWidth'),windoge.data('origHeight'));
					}
var 			maximize	=
					function(){
						maxicon
							.removeClass('maximize')
							.addClass('restore')
							.one('mouseup',restore);
						windoge
							.find('.windogebar')
							.css('cursor','auto')
						windoge
							.draggable('enable')
							.data('origWidth',windoge.width())
							.data('origHeight',windoge.height())
							.data('origStyle',
									privatemethods._getdiffs(
										privatemethods._copyComputedCSS(windoge)
										,privatemethods._copyComputedCSS(windoge.addClass('maximized'))
									)
							)
							.data('windogestate',1)
							.data('onmaximize')()
					}
				maxicon.one('mouseup',maximize);
			}
		,_minwindoge:function(windoge,minicon) {
var			restore		=	
				function(){
					windoge.fadeIn(800)
						.data('windogestate',0)
					$('#windoge-minimizedock > #'+windoge.attr('id')+'-min')
						.effect(
							"transfer"
							,{ to: windoge, className: "ui-effects-transfer" }
							,400
							,windoge.data('onminrestore')
						)
						.remove();
				}
var			minimize	=
				function(){
					$('#windoge-minimizedock').append("<img id='"+windoge.attr('id')+"-min' class='minimizedlogo' />");
					$('#'+windoge.attr('id')+'-min').attr('src',windoge.data('winlogo'));
					$('#windoge-minimizedock > #'+windoge.attr('id')+'-min')
						.show()
						.one('click',restore)
					windoge.effect(
							"transfer"
							,{ to: '#windoge-minimizedock > #'+windoge.attr('id')+'-min', className: "ui-effects-transfer" }
							,400
							,windoge.data('onminimize')
						)
						.hide()
						.data('windogestate',-1);
				}
			minicon.on('mouseup',minimize);
		}
		,_loadContent: function(url,callback){

		}
}
var		self			=	this;
		options			=	$.extend(true,{},this._defaults,options);
		
		if ($('#windoge-pane').length==0)
			$("<div id='windoge-pane' class='ui-front'><div id='windoge-minimizedock'></div></div>").appendTo($('body'));
		
		this.windoge 	=	$('<div class="windoge" cellspacing=0 cellpadding=0></div>');
		
		if (options.id)//assign the ID based on the one passed via ptions
			this.windoge.attr('id',options.id);
		else //If the user didn't specify an ID then use a generated one
			this.windoge.uniqueId();
		$.each(options,function(attr,val){
			if (attr!=="style")
				self.windoge.data(attr,val);
		})
var		id		=	this.windoge.attr('id');
var		topbar	=	$(	'<div id="'+id+'topbar" class="windogebar">'+
							'<span id="'+id+'barheader" class="header'+(options.winlogoshow?'':' nologo')+'">'
								+options.header+
							'</span>'+
							'<div class="icons">'+
								'<div class="icon minimize"></div>'+
								'<div class="icon maximize"></div>'+
							'</div>'+
						'</div>')
						.appendTo(this.windoge);
var		bttmbar	=	$(	'<div id='+id+'bottombar" class="windogestatus">'+
							'<div id="'+id+'status" class="statusmsg"></div>'+
							'<div class="resizeicon"></div>'+
						'</div>')
						.appendTo(this.windoge);		
var		content	=	$(	'<div id="'+id+'middle" class="windogemiddle">'+
							'<div id="'+id+'middlecontent" class="windogecontent'+(options.winlogoshow?'':' nologo')+'"></div>'+
						'</div>')
						.appendTo(this.windoge)
var		winlogo	=	(options.winlogoshow
					?$(	'<img id="'+id+'logo" class="logo" src="'+options.winlogo+'" />')
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
						})
			.on('mousedown',function(){
				$(this).parent().append($(this));
			})
			.find('.windogebar .icon')
				.each(
					function(){
						if ($(this).hasClass('maximize'))
							privatemethods._maxwindoge(self.windoge,$(this));
						else if ($(this).hasClass('minimize'))
							privatemethods._minwindoge(self.windoge,$(this));
					}
				)
			.end()
			.find('.resizeicon')
				.each(
					function(){
						$(this).draggable({
							drag:privatemethods._onresizedrag
							,helper:"clone"
							,opacity:0.1
						});
					}
				)
			.end()
			.find('.windogecontent')
				.on('mousedown',function(){
					self.windoge
						.parent()
						.append(self.windoge)
				})
		content.css({'top':topbar.height(),'bottom':bttmbar.outerHeight()});
}
winDoge.prototype	=	{
	windoge:undefined
	,_defaults:{'winlogo':'minimized-icon.png'
				,'winlogoshow':true
				,'onmaximize':function(event,data){}
				,'onmaxrestore':function(event,data){}
				,'onminimize':function(event,data){}
				,'onminrestore':function(event,data){}
				,'style':{'width':'640px'
					 	 ,'height':'480px'
						 ,'min-width':'350px'
						 ,'min-height':'200px'
						 }
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
});
$.fn.isOverflowing=
	function(){
var		e	=	this[0];
		return e.scrollHeight>e.clientHeight||e.scrollWidth>e.clientWidth;
	}
