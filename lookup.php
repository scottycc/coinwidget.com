<?php

/** -

Donations welcome:
	BTC:  122MeuyZpYz4GSHNrF98e6dnQCXZfHJeGS
	LTC:  LY1L6M6yG26b4sRkLv4BbkmHhPn8GR5fFm
	DOGE: DE1M61so1Agsx2wLhsKw474Pbq4c7T72Vi
	AUR:  AbyQ4MEW46b79h72Fj9uP12odVq7gVaJy2
	FRK:  FASkP9GTQJYbpF2wLXrtQRf2WsqKVa83z2
	VERT: VpFCVSevgz9kiRaJggPgCFMWuAaj6S9GxC
	LOT:  LyUWd7VsavSs5pvodChTAFA6K5oaR1RkSF
	FLAP: FNUxuLfSArrZQEz7rte5xT3Cu3TvkmPi7c
	NYAN: KSXcP3vmQDDeMrUAqzeKWb7cgAGhZrfaYq
	FTC:  6uAaYag6YkcnmNaVz4pM25ZdU7w9chVT6a
	TiPS: Ea6nP2tzwn55ut2ryYMZsSZbyUo6pYvNSL
		~ Thank you!

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

	header("Content-type: text/javascript");
	/*
		you should server side cache this response, especially if your site is active
	*/
	$data = isset($_GET['data'])?$_GET['data']:'';
	if (!empty($data)) {
		$data = explode("|", $data);

 		$responses = array();
		if (!empty($data)) {
			foreach ($data as $key) {
				list($instance,$currency,$address) = explode('_',$key);

				switch ($currency) {
					case 'bitcoin':
						$response = get_bitcoin($address);
						break;

					case 'litecoin':
						$response = get_litecoin($address);
						break;

					case 'dogecoin':
						$response = get_dogecoin($address);
						break;

					case 'auroracoin':
						$response = get_auroracoin($address);
						break;

					case 'franko':
 						$response = get_franko($address);
 						break;

 					case 'vertcoin':
 						$response = get_vertcoin($address);
 						break;

 					case 'lottocoin':
 						$response = get_lottocoin($address);
 						break;

 					case 'flappycoin':
 						$response = get_flappycoin($address);
 						break;

 					case 'peercoin':
 						$response = get_peercoin($address);
 						break;

 					case 'nyancoin':
 						$response = get_nyancoin($address);
 						break;

 					case 'feathercoin':
 						$response = get_feathercoin($address);
 						break;

 					case 'fedoracoin':
 						$response = get_fedoracoin($address);
 						break;

 					/* TeslaCoin will be added once a block explorer is available
 					case 'teslacoin':
 						$response = get_teslacoin($address);
 						break; */
				}
				$responses[$instance] = $response;
			}
		}
		echo 'var COINWIDGETCOM_DATA = '.json_encode($responses).';';
	}

	function get_bitcoin($address) {
		$return = array();
		$data = get_request('http://blockchain.info/address/'.$address.'?format=json&limit=0');
		if (!empty($data)) {
			$data = json_decode($data);
			$return += array(
				'count' => (int) $data->n_tx,
				'amount' => (float) $data->total_received/100000000
			);
			return $return;
		}
	}

	function get_litecoin($address) {
		$return = array();
		$data = get_request('http://explorer.litecoin.net/address/'.$address);
		if (!empty($data)
		  && strstr($data, 'Transactions in: ')
		  && strstr($data, 'Received: ')) {
		  	$return += array(
				'count' => (int) parse($data,'Transactions in: ','<br />'),
				'amount' => (float) parse($data,'Received: ','<br />')
			);
		  	return $return;
		}
	}

	function get_dogecoin($address){
		$return = array();
		$data = get_request('http://dogechain.info/chain/Dogecoin/q/getreceivedbyaddress/'.$address);
		if (strlen($data) > 0) {
		  	$return += array(
		  	'count' => 0,
				'amount' => (float) $data
			);
		  	return $return;
		}
	}

	function get_auroracoin($address) {
		$return = array();
		$data = get_request('https://aur.cryptocoins.at/explorer/address/'.$address);

		if( !empty($data)
		  && strstr($data, 'Address not seen on the network') ) {
			$return += array(
				'count' => 0,
				'amount' => 0.0
			);
		} else {

			if (!empty($data)
			  && strstr($data, 'Transactions in: ')
			  && strstr($data, 'Received: ')) {
			  	$return += array(
					'count' => (int) parse($data,'Transactions in: ','<br />'),
					'amount' => (float) parse($data,'Received: ','<br />')
				);
			  	return $return;
			}
		}
	}

	function get_franko($address) {
 		$return = array();
 		$data = get_request('http://frk.cryptocoinexplorer.com/address/'.$address);
 		if (!empty($data)
 		  && strstr($data, 'Transactions in: ')
 		  && strstr($data, 'Received: ')) {
 		  	$return += array(
 				'count' => (int) parse($data,'Transactions in: ','<br />'),
 				'amount' => (float) parse($data,'Received: ','<br />')
 			);
 		  	return $return;
 		}
 	}

 	function get_vertcoin($address) {
 		$return = array();
 		$data = get_request('http://explorer.vertcoin.org/address/'.$address);
 		if (!empty($data)
 		  && strstr($data, 'Transactions in: ')
 		  && strstr($data, 'Received: ')) {
 		  	$return += array(
 				'count' => (int) parse($data,'Transactions in: ','<br />'),
 				'amount' => (float) parse($data,'Received: ','<br />')
 			);
 		  	return $return;
 		}
 	}

 	function get_lottocoin($address) {
 		$return = array();
 		$data = get_request('http://lottocoin.info/address/'.$address);
 		if (!empty($data)
 		  && strstr($data, 'Transactions in: ')
 		  && strstr($data, 'Received: ')) {
 		  	$return += array(
 				'count' => (int) parse($data,'Transactions in: ','<br />'),
 				'amount' => (float) parse($data,'Received: ','<br />')
 			);
 		  	return $return;
 		}
 	}

 	function get_flappycoin($address) {
 		$return = array();
 		$data = get_request('http://flapplorer.flappycoin.info/address/'.$address);
 		if (!empty($data)
 		  && strstr($data, 'Transactions in: ')
 		  && strstr($data, 'Received: ')) {
 		  	$return += array(
 				'count' => (int) parse($data,'Transactions in: ','<br />'),
 				'amount' => (float) parse($data,'Received: ','<br />')
 			);
 		  	return $return;
 		}
 	}

 	function get_peercoin($address) {
		$return = array();
		$data = get_request('http://ppc.blockr.io/api/v1/address/info/'.$address);
		if (!empty($data)) {
			$data = json_decode($data);
			$return += array(
				'count' => (int) $data->nb_txs,
				'amount' => (float) $data->totalreceived
			);
			return $return;
		}
	}

	function get_nyancoin($address) {
 		$return = array();
 		$data = get_request('http://nyancha.in/address/'.$address);
 		if (!empty($data)
 		  && strstr($data, 'Transactions in: ')
 		  && strstr($data, 'Received: ')) {
 		  	$return += array(
 				'count' => (int) parse($data,'Transactions in: ','<br />'),
 				'amount' => (float) parse($data,'Received: ','<br />')
 			);
 		  	return $return;
 		}
 	}

 	function get_feathercoin($address) {
 		$return = array();
 		$data = get_request('http://explorer.feathercoin.com/address/'.$address);
 		if (!empty($data)
 		  && strstr($data, 'Transactions in: ')
 		  && strstr($data, 'Received: ')) {
 		  	$return += array(
 				'count' => (int) parse($data,'Transactions in: ','<br />'),
 				'amount' => (float) parse($data,'Received: ','<br />')
 			);
 		  	return $return;
 		}
 	}

 	function get_fedoracoin($address) {
 		$return = array();
 		$data = get_request('http://fedoracha.in/address/'.$address);
 		if (!empty($data)
 		  && strstr($data, 'Transactions in: ')
 		  && strstr($data, 'Received: ')) {
 		  	$return += array(
 				'count' => (int) parse($data,'Transactions in: ','<br />'),
 				'amount' => (float) parse($data,'Received: ','<br />')
 			);
 		  	return $return;
 		}
 	}


 	/* TeslaCoin will be added once a block explorer is available
 	function get_teslatocoin($address) {
 		$return = array();
 		$data = get_request('http:// /address/'.$address);
 		if (!empty($data)
 		  && strstr($data, 'Transactions in: ')
 		  && strstr($data, 'Received: ')) {
 		  	$return += array(
 				'count' => (int) parse($data,'Transactions in: ','<br />'),
 				'amount' => (float) parse($data,'Received: ','<br />')
 			);
 		  	return $return;
 		}
 	} */


	function get_request($url,$timeout=4) {
		if (function_exists('curl_version')) {
			$curl = curl_init();
			curl_setopt($curl, CURLOPT_URL, $url);
			curl_setopt($curl, CURLOPT_RETURNTRANSFER,true);
			curl_setopt($curl, CURLOPT_CONNECTTIMEOUT, $timeout);
			curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
			curl_setopt($curl, CURLOPT_USERAGENT,'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13');
			$return = curl_exec($curl);
			curl_close($curl);
			return $return;
		} else {
			return @file_get_contents($url);
		}
	}

	function parse($string,$start,$stop) {
		if (!strstr($string, $start)) return;
		if (!strstr($string, $stop)) return;
		$string = substr($string, strpos($string,$start)+strlen($start));
		$string = substr($string, 0, strpos($string,$stop));
		return $string;
	}
