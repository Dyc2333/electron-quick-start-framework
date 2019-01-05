$(function() {
	$(document).ready(function() {
		Highcharts.setOptions({
			global: {
				useUTC: false
			}
		});
		
		/*自定义配置区*/
		var showPoint=false;//是否显示点
		var lineStyle='line';//line是折线，spline是曲线
		var InitPointNum=20;//同屏每条线显示多少个点
		
		var mychart = Highcharts.chart('container', {
			chart: {
				type: lineStyle,
				animation: true,
				marginRight: 10,
				events: {
					load: wsloaddata('container', 0)
				}
			},
			title: {
				text: '压力测试监控'
			},
			credits: {
				enabled: false,
			},
			xAxis: {
				type: 'datetime',
				tickPixelInterval: 150,
			},
			yAxis: {
				title: {
					text: 'Value'
				},
				plotLines: [{
					value: 0,
					width: 1,
					color: '#808080'
				}]
			},
			tooltip: {
				formatter: function() {
					return '<b>' + this.series.name + '</b><br/>' +
						Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
						Highcharts.numberFormat(this.y, 2);
				}
			},
			legend: {
				enabled: false
			},
			exporting: {
				enabled: true
			},
			series: [{
					name: 'CPU',
					marker: {
						enabled: showPoint
					},
					data: getInitData(InitPointNum),
				},
				{
					name: 'TPS',
					marker: {
						enabled: showPoint
					},
					data: getInitData(InitPointNum),
				},
				{
					name: 'CPU%',
					marker: {
						enabled: showPoint
					},
					data: getInitData(InitPointNum),
				},
				{
					name: 'IO rate',
					marker: {
						enabled: showPoint
					},
					data: getInitData(InitPointNum),
				}
			]
		});
	});
});

function getInitData(InitPointNum) {
	var data = [],
		time = (new Date()).getTime(),
		i;

	for(i = 1-InitPointNum; i <= 0; i += 1) {
		data.push({
			x: time + i * 1000,
			y: 0
		});
	}
	return data;
}