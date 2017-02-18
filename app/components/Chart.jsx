var React = require('react');
var {Doughnut} = require("react-chartjs-2");
var Immutable = require('immutable');

const getState = (arr, shades) => ({
    labels: arr.map(function(a) {return a.name;}),
    datasets: [{
        data: arr.map(function(a) {return a.value;}),
        backgroundColor: shades,
        hoverBackgroundColor: shades
    }]
});

var DoughnutChart = React.createClass({
    getDefaultProps: function () {
        return {
            title: '',
            graphColor:'',//rgb color code
            textColor:'0,0,0',//rgb color code
            percentChange: 0
        };
    },
    propTypes: {
        graphData: React.PropTypes.array.isRequired,
        percentChange: React.PropTypes.number,
        title: React.PropTypes.string,
        graphColor: React.PropTypes.string,
        textColor: React.PropTypes.string
    },
    componentWillMount : function () {
        var graphColor  = this.props.graphColor;
        var textColor = this.props.textColor;
        var rgbArray = graphColor.split(',');
        var R  = rgbArray[0];
        var G  = rgbArray[1];
        var B = rgbArray[2];
        var shades = [];
        var that = this;
        var list  =  Immutable.List(this.props.graphData);
        var chartOptions = {
            legend: {
                display: false
            },
            layout: {
                padding: 100
            }
        };
        
        var doughChartData = {
            labels: list.map(function(a) {return a.name;}),
            datasets: [
                {
                    data: list.map(function(a) {return a.value;}),
                    backgroundColor: shades,
                    hoverBackgroundColor: shades
                }]
        };

        function generateShades() {
            var r = R%256;
            var g = G%256;
            var b = B%256;
            for(var i=0;i<that.props.graphData.length;i++)
            {
                r+=33;
                g+=33;
                b+=33;
                shades.push('rgb('+r+','+g+','+b+')');
            }
        }
        generateShades();

        var drawItemsValuesPlugin = {
            afterDraw: function(chartInstance) {
                var ctx = chartInstance.chart.ctx;
                ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, 'normal', Chart.defaults.global.defaultFontFamily);
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                ctx.strokeStyle = '636363';
                ctx.font = "12px Lato";
                ctx.lineWidth = 0.1;
                chartInstance.data.datasets.forEach(function(dataset) {
                    for (var i = 0; i < dataset.data.length; i++) {
                        var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model,
                            total = dataset._meta[Object.keys(dataset._meta)[0]].total,
                            mid_radius = model.innerRadius + (1.9 * model.outerRadius - model.innerRadius) / 2,
                            start_angle = model.startAngle,
                            end_angle = model.endAngle,
                            mid_angle = start_angle + (end_angle - start_angle) / 2;

                        var mid_radius2 = 0.92 * (model.innerRadius + (1.92 * model.outerRadius - model.innerRadius) / 2);

                        var fact = i % 2 == 0 ? 1.2 : 1;

                        var x = mid_radius * fact * 1.06 * Math.cos(mid_angle); //text alignment
                        var y = mid_radius * fact * 1.06 * Math.sin(mid_angle); //text alignment

                        var myX = mid_radius2 * fact * Math.cos(mid_angle);
                        var myY = mid_radius2 * fact * Math.sin(mid_angle);

                        var myX2 = 0.9 * mid_radius2 * 1 * Math.cos(mid_angle); //start of the stroke
                        var myY2 = 0.9 * mid_radius2 * 1 * Math.sin(mid_angle);//start of the stroke

                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(model.x + myX2, model.y + myY2);
                        ctx.strokeStyle = '#636363';
                        ctx.lineTo(model.x + myX, model.y + myY);
                        ctx.stroke();
                        ctx.strokeStyle = '#636363';
                        ctx.fillStyle = "rgb("+that.props.textColor+")";
                        ctx.lineWidth = 0.01;

                        var label = chartInstance.config.data.labels[i];
                        ctx.fillText(label, model.x + x, model.y + y);
                        ctx.strokeText(label, model.x + x, model.y + y);
                    }
                });
            }
        };

        Chart.pluginService.register(drawItemsValuesPlugin);

        this.setState({chartData:getState(this.props.graphData, shades)});
        this.setState({chartOptions: chartOptions});
    },
    render: function () {
        var percentChange = this.props.percentChange;
        if(percentChange<0){
            var iconClass =  'mr-down-dir';
        }
        if(percentChange==0){
            var iconClass =  '';
        }
        else if(percentChange>0){
            var iconClass =  'mr-up-dir';
        }

        var textStyle = {
            color:"rgb("+this.props.textColor+")"
        };

        var title = this.props.title;

        if(typeof this.props.graphColor==='string' && typeof this.props.textColor==='string' && typeof this.props.percentChange==='number' && typeof this.props.title==='string' &&  typeof this.props.graphData==='object'
            && this.props.graphColor!=null  && this.props.textColor!=null && this.props.percentChange!=null && this.props.title!=null && this.props.graphData!=null ){
            return (
            <div>
                <p className="chartHeading" style={textStyle}>{title}</p>
                <center>
                    <div className="chartContainer">
                        <Doughnut redraw={true} data={this.state.chartData} options={this.state.chartOptions} height={120}  />
                        <div className="center-dough-text"><i className={iconClass}></i><span style={textStyle}>{Math.abs(percentChange)+'%'}</span></div>
                    </div>
                </center>
            </div>
                
            );
        }
        else{
            return (
                <p className="error-text">Could Not Display Data</p>
            );
        }
    }

});

module.exports = DoughnutChart;