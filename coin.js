/**

Donations welcome:
	BTC: 122MeuyZpYz4GSHNrF98e6dnQCXZfHJeGS
	LTC: LY1L6M6yG26b4sRkLv4BbkmHhPn8GR5fFm
  DOGE: DE1M61so1Agsx2wLhsKw474Pbq4c7T72Vi
	AUR:  AbyQ4MEW46b79h72Fj9uP12odVq7gVaJy2
	FRK:  FASkP9GTQJYbpF2wLXrtQRf2WsqKVa83z2
	VERT: VpFCVSevgz9kiRaJggPgCFMWuAaj6S9GxC
	LOT:  LyUWd7VsavSs5pvodChTAFA6K5oaR1RkSF
	FLAP: FNUxuLfSArrZQEz7rte5xT3Cu3TvkmPi7c
  NYAN: KSXcP3vmQDDeMrUAqzeKWb7cgAGhZrfaYq
		~ Thank you!

------------

MIT License (MIT)

Copyright (c) 2013 http://coinwidget.com/
Copyright (c) 2013 http://scotty.cc/

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

if (typeof CoinWidgetComCounter != 'number')
var CoinWidgetComCounter = 0;

if (typeof CoinWidgetCom != 'object')
var CoinWidgetCom = {
	source: 'http://coinwidget.com/widget/'
	, config: []
	, go :function(config) {
		config = CoinWidgetCom.validate(config);
		CoinWidgetCom.config[CoinWidgetComCounter] = config;
		CoinWidgetCom.loader.jquery();
		// Bottom of <body>
		/* var $span = document.createElement('span');
 		$span.setAttribute('data-coinwidget-instance', CoinWidgetComCounter);
 		$span.setAttribute('class', 'COINWIDGETCOM_CONTAINER');
 		document.getElementsByTagName('body')[0].appendChild($span); */

 		// Exactly where the <script> tag is located
 		document.write('<span data-coinwidget-instance="'+CoinWidgetComCounter+'" class="COINWIDGETCOM_CONTAINER"></span>');
		CoinWidgetComCounter++;
	}
	, validate: function(config) {
		var $accepted = [];
		$accepted['currencies'] = ['bitcoin','litecoin', 'dogecoin', 'auroracoin', 'franko', 'vertcoin', 'flappycoin', 'lottocoin', 'peercoin', 'nyancoin', 'feathercoin', 'fedoracoin'];
		$accepted['counters'] = ['count','amount','hide'];
		$accepted['amount'] = ['show','hide'];
		$accepted['alignment'] = ['al','ac','ar','bl','bc','br'];
		if (!config.currency || !CoinWidgetCom.in_array(config.currency,$accepted['currencies']))
			config.currency = 'bitcoin';
		if (!config.counter || !CoinWidgetCom.in_array(config.counter,$accepted['counters']))
			config.counter = 'count';
		if (!config.amount || !CoinWidgetCom.in_array(config.amount,$accepted['amount']))
			config.amount = 'show';
		if (!config.alignment || !CoinWidgetCom.in_array(config.alignment,$accepted['alignment']))
			config.alignment = 'bl';
		if (typeof config.qrcode != 'boolean')
			config.qrcode = true;
		if (typeof config.milli != 'boolean') {
			config.milli = false;
 		}
		if (typeof config.auto_show != 'boolean')
			config.auto_show = false;
		if (!config.wallet_address)
			config.wallet_address = 'My '+ config.currency +' wallet_address is missing!';
		if (!config.lbl_button)
			config.lbl_button = 'Donate';
		if (!config.lbl_address)
			config.lbl_address = 'My Bitcoin Address:';
		if (!config.lbl_count)
			config.lbl_count = 'Donation';
		if (!config.lbl_amount)
			config.lbl_amount = 'BTC';
		if (typeof config.decimals != 'number' || config.decimals < 0 || config.decimals > 10)
			config.decimals = 4;

		return config;
	}
	, init: function(){
		CoinWidgetCom.loader.stylesheet();
		$(window).resize(function(){
			CoinWidgetCom.window_resize();
		});
		setTimeout(function(){
			/* this delayed start gives the page enough time to
			   render multiple widgets before pinging for counts.
			*/
			CoinWidgetCom.build();
		},800);
	}
	, build: function(){
		$containers = $("span[data-coinwidget-instance]");
		$containers.each(function(i,v){
			$config = CoinWidgetCom.config[$(this).attr('data-coinwidget-instance')];
			$counter = $config.counter == 'hide'?'':('<span><img src="'+CoinWidgetCom.source+'icon_loading.gif" width="13" height="13" /></span>');
			$button = '<a class="COINWIDGETCOM_BUTTON_'+$config.currency.toUpperCase()+'" href="#"><img src="'+CoinWidgetCom.source+'icon_'+$config.currency+'.png" /><span>'+$config.lbl_button+'</span></a>'+$counter;
			$(this).html($button);
			$(this).find('> a').unbind('click').click(function(e){
				e.preventDefault();
				CoinWidgetCom.show(this);
			});
		});
		CoinWidgetCom.counters();
	}
	, window_resize: function(){
		$.each(CoinWidgetCom.config,function(i,v){
			CoinWidgetCom.window_position(i);
		});
	}
	, window_position: function($instance){
		$config = CoinWidgetCom.config[$instance];
		coin_window = "#COINWIDGETCOM_WINDOW_"+$instance;

			obj = "span[data-coinwidget-instance='"+$instance+"'] > a";
			/* 	to make alignment relative to the full width of the container instead
			of just the button change this occurence of $(obj) to $(obj).parent(),
			do the same for the occurences within the switch statement. */
			$pos = $(obj).offset();
			switch ($config.alignment) {
				default:
				case 'al': /* above left */
					$top = $pos.top - $(coin_window).outerHeight() - 10;
					$left = $pos.left;
					break;
				case 'ac': /* above center */
					$top = $pos.top - $(coin_window).outerHeight() - 10;
					$left = $pos.left + ($(obj).outerWidth()/2) - ($(coin_window).outerWidth()/2);
					break;
				case 'ar': /* above right */
					$top = $pos.top - $(coin_window).outerHeight() - 10;
					$left = $pos.left + $(obj).outerWidth() - $(coin_window).outerWidth();
					break;
				case 'bl': /* bottom left */
					$top = $pos.top + $(obj).outerHeight() + 10;
					$left = $pos.left;
					break;
				case 'bc': /* bottom center */
					$top = $pos.top + $(obj).outerHeight() + 10;
					$left = $pos.left + ($(obj).outerWidth()/2) - ($(coin_window).outerWidth()/2);
					break;
				case 'br': /* bottom right */
					$top = $pos.top + $(obj).outerHeight() + 10;
					$left = $pos.left + $(obj).outerWidth() - $(coin_window).outerWidth();
					break;
			}
		if ($(coin_window).is(':visible')) {
			$(coin_window).stop().animate({'z-index':99999999999,'top':$top,'left':$left},150);
		} else {
			$(coin_window).stop().css({'z-index':99999999998,'top':$top,'left':$left});
		}
	}
	, counter: []
	, counters: function(){
		$addresses = [];
		$.each(CoinWidgetCom.config,function(i,v){
			$instance = i;
			$config = v;
			if ($config.counter != 'hide')
				$addresses.push($instance+'_'+$config.currency+'_'+$config.wallet_address);
			else {
				if ($config.auto_show)
					$("span[data-coinwidget-instance='"+i+"']").find('> a').click();
			}
		});
		if ($addresses.length) {
			CoinWidgetCom.loader.script({
				id: 'COINWIDGETCOM_INFO'+Math.random()
				, source: (CoinWidgetCom.source+'lookup.php?data='+$addresses.join('|'))
				, callback: function(){
					if (typeof COINWIDGETCOM_DATA == 'object') {
						CoinWidgetCom.counter = COINWIDGETCOM_DATA;
						$.each(CoinWidgetCom.counter,function(i,v){
							$config = CoinWidgetCom.config[i];

							if (v == null || !v.count){ v = {count:0,amount:0}; }
							$("span[data-coinwidget-instance='"+i+"']").find('> span').html($config.counter=='count'?v.count:((v.amount*($config.milli ? 1000 : 1)).toFixed($config.decimals)+' '+($config.milli ? 'm':'')+$config.lbl_amount));
							if ($config.auto_show) {
								$("span[data-coinwidget-instance='"+i+"']").find('> a').click();
							}
						});
					}
					if ($("span[data-coinwidget-instance] > span img").length > 0) {
						setTimeout(function(){CoinWidgetCom.counters();},2500);
					}
				}
			});
		}
	}
	, show: function(obj) {
		$instance = $(obj).parent().attr('data-coinwidget-instance');
		$config = CoinWidgetCom.config[$instance];
		coin_window = "#COINWIDGETCOM_WINDOW_"+$instance;
		$(".COINWIDGETCOM_WINDOW").css({'z-index':99999999998});
		if (!$(coin_window).length) {

			$sel = !navigator.userAgent.match(/iPhone/i)?'onclick="this.select();"':'onclick="prompt(\'Select all and copy:\',\''+$config.wallet_address+'\');"';

			$html = ''
				  + '<label>'+$config.lbl_address+'</label>'
				  + '<input type="text" readonly="readonly" '+$sel+'  value="'+$config.wallet_address+'" />'
				  + '<a class="COINWIDGETCOM_CREDITS" href="http://coinwidget.com/" target="_blank">CoinWidget.com</a>'
  				  + '<a class="COINWIDGETCOM_WALLETURI" href="'+$config.currency.toLowerCase()+':'+$config.wallet_address+'" target="_blank" title="Click here to send this address to your wallet (if your wallet is not compatible you will get an empty page, close the white screen and copy the address by hand)" ><img src="'+CoinWidgetCom.source+'icon_wallet.png" alt="Send '+$config.currency+' to address" /></a>'
  				  + '<a class="COINWIDGETCOM_CLOSER" href="javascript:;" onclick="CoinWidgetCom.hide('+$instance+');" title="Close this window">x</a>'
  				  + '<img class="COINWIDGET_INPUT_ICON" src="'+CoinWidgetCom.source+'icon_'+$config.currency+'.png" width="16" height="16" title="This is a '+$config.currency+' wallet address." alt="'+$config.currency+' Logo" />'
				  ;
			if ($config.counter != 'hide') {
				$html += '<span class="COINWIDGETCOM_COUNT">0<small>'+$config.lbl_count+'</small></span>';
 				if ($config.amount != 'hide') {
 					$html += '<span class="COINWIDGETCOM_AMOUNT end">0.00<small>'+($config.milli ? 'm':'')+$config.lbl_amount+'</small></span>';
 				}
			}
			if ($config.qrcode) {
				$html += '<img class="COINWIDGETCOM_QRCODE" data-coinwidget-instance="'+$instance+'" src="'+CoinWidgetCom.source+'icon_qrcode.png" width="16" height="16" />'
				  	   + '<img class="COINWIDGETCOM_QRCODE_LARGE" src="'+CoinWidgetCom.source+'icon_qrcode.png" width="111" height="111" alt="'+$config.currency+' address QR code" />'
				  	   ;
			}
			var $div = $('<div></div>');
			$('body').append($div);
			$div.attr({
				'id': 'COINWIDGETCOM_WINDOW_'+$instance
			}).addClass('COINWIDGETCOM_WINDOW COINWIDGETCOM_WINDOW_'+$config.currency.toUpperCase()+' COINWIDGETCOM_WINDOW_'+$config.alignment.toUpperCase()).html($html).unbind('click').bind('click',function(){
				$(".COINWIDGETCOM_WINDOW").css({'z-index':99999999998});
				$(this).css({'z-index':99999999999});
			});
			if ($config.qrcode) {
				$(coin_window).find('.COINWIDGETCOM_QRCODE').bind('mouseenter click',function(){
					$config = CoinWidgetCom.config[$(this).attr('data-coinwidget-instance')];
					$lrg = $(this).parent().find('.COINWIDGETCOM_QRCODE_LARGE');
					if ($lrg.is(':visible')) {
						$lrg.hide();
						return;
					}
					$lrg.attr({
						src: CoinWidgetCom.source +'qr/?address='+$config.wallet_address
					}).show();
				}).bind('mouseleave',function(){
					$lrg = $(this).parent().find('.COINWIDGETCOM_QRCODE_LARGE');
					$lrg.hide();
				});
			}
		} else {
			if ($(coin_window).is(':visible')) {
				CoinWidgetCom.hide($instance);
				return;
			}
		}
		CoinWidgetCom.window_position($instance);
		$(coin_window).show();
		$pos = $(coin_window).find('input').position();
		$(coin_window).find('img.COINWIDGET_INPUT_ICON').css({'top':$pos.top+3,'left':$pos.left+3});
		$(coin_window).find('.COINWIDGETCOM_WALLETURI').css({'top':$pos.top+3,'left':$pos.left+$(coin_window).find('input').outerWidth()+3});
		if ($config.counter != 'hide') {
			$counters = CoinWidgetCom.counter[$instance];
			if ($counters == null) {
				$counters = {
					count: 0,
					amount: 0
				};
			}
		 	if ($counters.count == null) $counters.count = 0;
		 	if ($counters.amount == null) $counters.amount = 0;
			$(coin_window).find('.COINWIDGETCOM_COUNT').html($counters.count+ '<small>'+$config.lbl_count+'</small>');
			if ($config.amount != 'hide') {
 				$(coin_window).find('.COINWIDGETCOM_AMOUNT').html(($counters.amount*($config.milli ? 1000 : 1)).toFixed($config.decimals)+ '<small>'+($config.milli ? 'm':'')+$config.lbl_amount+'</small>');
 			}
		}
		if (typeof $config.onShow == 'function')
			$config.onShow();
	}
	, hide: function($instance) {
		$config = CoinWidgetCom.config[$instance];
		coin_window = "#COINWIDGETCOM_WINDOW_"+$instance;
		$(coin_window).fadeOut();
		if (typeof $config.onHide == 'function') {
			$config.onHide();
		}
	}
	, in_array: function(needle,haystack) {
		for (i=0;i<haystack.length;i++) {
			if (haystack[i] == needle) {
				return true;
			}
		}
		return false;
	}
	, loader: {
		loading_jquery: false,
		script: function(obj){
			if (!document.getElementById(obj.id)) {
				var x = document.createElement('script');
				x.onreadystatechange = function(){
					switch (this.readyState) {
						case 'complete':
						case 'loaded':
							obj.callback();
							break;
					}
				};
				x.onload = function(){
					obj.callback();
				};
				x.src = obj.source;
				x.id  = obj.id;
				//document.lastChild.firstChild.appendChild(x);
				document.body.appendChild(x)
			}
		}
		, stylesheet_loaded: false
		, stylesheet: function(){
			if (!CoinWidgetCom.loader.stylesheet_loaded) {
				CoinWidgetCom.loader.stylesheet_loaded = true;
				var $link = $('<link/>');
				$("head").append($link);
				$link.attr({
					id 		: 'COINWIDGETCOM_STYLESHEET'
					, rel 	: 'stylesheet'
					, type 	: 'text/css'
					, href 	: CoinWidgetCom.source+'coin.css'
				});
			}
		}
		, jquery: function(){
			if (!window.jQuery && !CoinWidgetCom.loader.loading_jquery) {
				$prefix = window.location.protocol=='file:'?'http:':'';
				CoinWidgetCom.loader.script({
					id			: 'COINWIDGETCOM_JQUERY'
					, source 	: $prefix + '//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js'
					, callback  : function(){
						CoinWidgetCom.init();
					}
				});
				return;
			}
			CoinWidgetCom.init();
		}
	}
};