/*********************************************************************
** FileName: Chart.js
** Description:
** History
** Date     Name  Desc
** 5/13/18  CHS   Created file.
**********************************************************************/
import React, { Component } from 'react';
import {AreaChart} from 'react-easy-chart';

// constructor(props) {
    // const initialWidth = window.innerWidth > 0 ? window.innerWidth : 500;
    // this.state = {showToolTip: false, windowWidth: initialWidth - 100};
// }

  // componentDidMount() {
    // window.addEventListener('resize', this.handleResize);
// }

  // componentWillUnmount() {
    // window.removeEventListener('resize', this.handleResize);
// }

  // handleResize() {
    // this.setState({windowWidth: window.innerWidth - 100});
// }


class Chart extends Component {


  render() {
    return (


        <AreaChart
            // datePattern={'%H:%M'}
            xType={'text'}
            axes
            yDomainRange={[0, 100]}
            grid
            areaColors={['orange', 'purple']}
            interpolate={'cardinal'}
            width={750}
            height={300}
            axisLabels={{x: 'Hour', y: '%'}}
            style={{ '.label': { fill: 'black' } }}
            data={[
              [
                { x: '12AM', y: 20 },
                { x: '1AM', y: 10 },
                { x: '2AM', y: 85 },
                { x: '3AM', y: 45 },
                { x: '4AM', y: 15 }
              ], [
                { x: '12AM', y: 10 },
                { x: '1AM', y: 15 },
                { x: '2AM', y: 13 },
                { x: '3AM', y: 90 },
                { x: '4AM', y: 10 }
              ]
            ]}
        />
    );
  }
}


export default Chart;
