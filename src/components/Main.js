require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

// let yeomanImage = require('../images/yeoman.png');
//利用自执行函数，将图片信息转成图片URL路径信息
// var imagesDatas = require('../data/imagesDatas.json');
// imagesDatas = (function genImageURL(imageDataArr) {
//     for (var i = 0, len = imageDataArr.length; i < len; i++) {
//         var singleImageData = imageDataArr[i];
//         singleImageData.imageURL = require('../images' + singleImageData.fileName);
//         imageDataArr[i] = singleImageData;
//     }
//     return imageDataArr;
// })(imagesDatas);

// class AppComponent extends React.Component {
//   render() {
//     return (
//       <div className="index">
//         <img src={yeomanImage} alt="Yeoman Generator" />
//         <div className="notice">Please edit <code>src/components/Main.js</code> to get started!</div>
//         <div>I am a Water boy</div>
//         <div>webpack</div>
//       </div>
//     );
//   }
// }
let AppComponent = React.createClass({
  render: function () {
    return (
      <section className="stage">
        <section className="img-sec"></section>
        <nav className="controller-nav"></nav>
      </section>
    );
  }
})
AppComponent.defaultProps = {
};

export default AppComponent;