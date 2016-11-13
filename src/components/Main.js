require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

//获取图片数据
var imagesDatas = require('../data/imagesDatas.json');
//获取图片相关信息，将图片转换为URL路径信息
imagesDatas = imagesDatas.map(x=>{
  x.imageURL = require('../images/'+x.fileName);
  return x;
});
/**
 * 获取区间内的一个随机值
 * @param {any} low
 * @param {any} high
 */
let getRangeRandom = (low,high)=>{  
  return Math.ceil(Math.random()*(high-low)+low);
}
/**
 * 获取0-30 之间的任意正负角度值
 */
let get30DegRandom = () =>{
  return (Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30);
}

var ImgFigure = React.createClass({

  handleClick: function (e) {  
    if(this.props.arrange.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  },
  render: function () {
      var styleObj = {};

      //如果props属性中指定了这张图片的位置，则使用
      if(this.props.arrange.pos) {
        styleObj = this.props.arrange.pos;
      }

      //如果图片的旋转角度有值并且不为0，添加旋转角度
      if(this.props.arrange.rotate) {
        (['Moz','Ms','Webkit','']).forEach((value)=>{
          styleObj[value + 'Transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
        });
      }

      if(this.props.arrange.isCenter) {
        styleObj.zIndex = 11;
      }

      var imgFigureClassName = "img-figure";
      imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';
      var imageURL = ('../images/'+this.props.data.fileName);
      return(
        <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
          <img src={imageURL} alt={this.props.data.title}/>
          <figcaption>
            <h2 className="img-title">{this.props.data.title}</h2>
            <div className="img-back" onClick={this.handleClick}>
              <p>{this.props.data.desc}</p>
            </div>
          </figcaption>
        </figure>
      )
  }
})

var AppComponent = React.createClass({
  Constant: {
    centerPos: {
      left: 0,
      right: 0
    },
    //水平方向的取值范围
    hPosRange: {
      leftSecX: [0,0],
      rightSecX: [0,0],
      y: [0,0]
    },
    // 垂直方向的取值范围
    vPosRange: {
      x: [0,0],
      topY: [0,0]
    }
  },
  /**
   * 翻转图片
   * @param index 输入当前被执行inverse操作的图片对应信息数组的index值
   * @return {Function} 返回一个闭包函数
   */ 
  inverse: function (index) {  
    return function(){
      var imgsArrangeArr = this.state.imgsArrangeArr;

      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

      this.setState({
        imgsArrangeArr: imgsArrangeArr
      });
    }.bind(this);
  },

  /* 重新布局所有图片 
   * @param centerIndex 指定居中排布哪个图片
   */
  
  rearrange: function (centerIndex) {  
    var imgsArrangeArr = this.state.imgsArrangeArr,
        Constant = this.Constant,
        centerPos = Constant.centerPos,
        hPosRange = Constant.hPosRange,
        vPosRange = Constant.vPosRange,
        hPosRangeLeftSecX = hPosRange.leftSecX,
        hPosRangeRightSecX = hPosRange.rightSecX,
        hPosRangeY = hPosRange.y,
        vPosRangeTopY = vPosRange.topY,
        vPosRangeX = vPosRange.x,

        imgsArrangeTopArr = [],
        topImgNum = Math.ceil(Math.random() * 2), //取一个或者不取
        topImgSpliceIndex = 0,

        imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);

        //首先居中centerIndex的图片,居中的图片不需要旋转
        imgsArrangeCenterArr[0] = {
          pos: centerPos,
          rotate: 0,
          isCenter: true
        }
        

        //取出要布局上侧的图片的状态信息
        topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

        //布局位于上侧的图片
        imgsArrangeTopArr.forEach((value,index)=>{
          imgsArrangeTopArr[index] = {
            pos: {
              top: getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
              left: getRangeRandom(vPosRangeX[0],vPosRangeX[1])
            },
            rotate: get30DegRandom(),
            isCenter: false
          };
        });

        //布局左右两侧的状态信息
        for(var i = 0, len = imgsArrangeArr.length, k = len / 2; i < len; i++){
          var hPosRangeLORX = null;

          //前半部分布局左边，后半部分布局右边
          if(i<k){
            hPosRangeLORX = hPosRangeLeftSecX;
          } else {
            hPosRangeLORX = hPosRangeRightSecX;
          }
          imgsArrangeArr[i] = {
            pos: {
              top: getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
              left: getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
            },
            rotate: get30DegRandom(),
            isCenter: false
          };
        }

        if(imgsArrangeTopArr && imgsArrangeTopArr[0]) {
          imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
        }

        imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);

        this.setState({
          imgsArrangeArr: imgsArrangeArr
        });
  },
  /**
   * 利用rearrange函数，居中对应index的图片
   * @param index，需要被居中的图片对应的图片信息数组的index
   * @return {Function}
   */
  center: function (index) {  
    return ()=>{
      this.rearrange(index);
    }
  },
  //保存状态
  getInitialState: function () {
    return {
        imgsArrangeArr: []
    };
  },
  //组件加载以后，为每张图片计算其位置的范围
  componentDidMount: function () {

    //拿到舞台的大小
    var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
        stageW = stageDOM.scrollWidth,
        stageH = stageDOM.scrollHeight,
        halfStageW = Math.ceil(stageW / 2),
        halfStageH = Math.ceil(stageH / 2);
    // 拿到一个imgFigure的大小
    var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
        imgW = imgFigureDOM.scrollWidth,
        imgH = imgFigureDOM.scrollHeight,
        halfimgW = Math.ceil(imgW / 2),
        halfimgH = Math.ceil(imgH / 2);
    //计算中心图片的位置点
    this.Constant.centerPos = {
      left: halfStageW - halfimgW,
      top: halfStageH - halfimgH
    }
     //计算左侧,右侧区域图片排布的取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfimgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfimgW*3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfimgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfimgW;
    this.Constant.hPosRange.y[0] = -halfimgH;
    this.Constant.hPosRange.y[1] = stageH- halfimgH;

    //计算上侧区域图片排布的取值范围
    this.Constant.vPosRange.topY[0] = -halfimgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfimgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;
    
    this.rearrange(0);
  },
  render: function () {
    var controllerUnits = [],
        imgFigures = [];
    imagesDatas.forEach((value,index)=>{

      if(!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          isInverse: false,
          isCenter: false
        };
      }
      
      imgFigures.push(<ImgFigure data={value} ref={'imgFigure'+index} key={index} arrange={this.state.imgsArrangeArr[index]} center={this.center(index)} inverse={this.inverse(index)}/>);
    });
    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
})
AppComponent.defaultProps = {
};
export default AppComponent;