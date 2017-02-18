var React = require('react');
var DoughnutChart = require('DoughnutChart');

var Main = (props) => {

  //all parameters
  var textColor = '0,0,0';//rgb color code
  var customTitle = 'ReactJS Task';
  var graphColorShade = '0,0,0';//rgb color code
  var percentChangeVal = 20;
  var graphData = [
      {
          name:'Label1',
          value:90
      },
      {
          name:'Label2',
          value:310
      },
      {
          name:'Label3',
          value:121
      },
      {
          name:'Label4',
          value:99
      }
  ];

  return (
    <div>
      <div>
        <div>
            <DoughnutChart graphColor={graphColorShade} textColor={textColor}  percentChange={percentChangeVal} title={customTitle} graphData={graphData}/>
        </div>
      </div>
    </div>
  );
};

module.exports = Main;
