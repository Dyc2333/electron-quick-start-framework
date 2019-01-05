function wsloaddata(domid) {

	var ws = wslink(domid);

}

/**
 * websocket方式
 * @param {Object} domid
 * @param {Object} seriesidx
 */
function wslink(domid) {
	var url = 'ws://10.11.220.45:8000'; //socket地址

	socket = new WebSocket(url);
	socket.onopen = function() {
		console.log('连接成功');
		dosend();
	}

	socket.onmessage = function(msg) {
		console.log(msg.data);
		jsondata = JSON.parse(msg.data);
		var x = (new Date()).getTime(); // current time
		//						y = parseInt(msg.data);
		//						y = Math.random();
		var chart = $("#" + domid).highcharts();
		chart.series[0].addPoint([x, jsondata.y1], false, true, true);
		chart.series[1].addPoint([x, jsondata.y2], false, true, true);
		chart.series[2].addPoint([x, jsondata.y3], false, true, true);
		chart.series[3].addPoint([x, jsondata.y4], false, true, true);
		chart.redraw();
	}

	socket.onclose = function() {
		console.log('断开连接');
		//					alert("websocket连接中断");
	}
}

function dosend() {
	socket.send('123');
};