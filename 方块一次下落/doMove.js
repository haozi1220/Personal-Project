 
			function doMove(obj,attr,dir,target,callBack){
				/*封装时，找出哪几个是随时变量，不能将其写死
					这个函数中包括四个标量，分别是：元素(obj)，元素的属性(attr)，运动的方向及大小（dir)，目标值(target)
				*/
				//处理dir的正负值问题
				dir=parseInt(getStyle(obj,attr))<target? dir:-dir;
				/*
					说明：如果当前位置要小于目标值，那么dir就取问号后面的正dir
						  如果当前位置要大于目标值，那么dir就取冒号后面的负dir
				 */
				clearInterval(obj.timer);
				 
				obj.timer=setInterval(function(){
					var speed=parseInt(getStyle(obj,attr))+dir;

					/*if(speed>target && dir>0){//向前跑，dir为正值
						
						speed=target;
					};

					if(speed<target && dir<0){//向后跑，dir为负值
						speed=target;
					}*/
					//简写：
					if(speed>target && dir>0 || speed<target && dir<0){
						speed=target;
					};
					obj.style[attr]=speed+'px';//
					if(speed==target){
						clearInterval(obj.timer);
						callBack &&　callBack();
						/*
							说明：整个定时器，到此才算结束，所以要在if里面再做判断，传入的是不是一个函数。这个判断还可以写成
							if(callBack){
							callBack();
						}
						*/
					}
					
				},50)
			}
			//封装获取元素样式的函数
			function getStyle(obj,attr){
				return obj.currentStyle ? obj.currentStyle[attr]:getComputedStyle(obj)[attr];//此函数有一个判断浏览器问题。currentStyle兼容IE678.getComputedStyle标准浏览器
			}