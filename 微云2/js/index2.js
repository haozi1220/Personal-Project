/*************************声明变量区域********************/
(function(){
    var fileContent = tools.$(".content_right_right_main")[0] ;     //获取文件区域容器
    var datas = data.files ;                                    //得到数据

    //找到指定ID下所有的子级
    //初始化第一层数据id为0
    var initId = 0;
    //获取导航区域容器
    var pathNav = tools.$('.right_top_nav')[0];
    var treeMenu = tools.$(".content_right_left")[0];           //获取左侧树形菜单容器

    //找到所有的树形菜单的标题 div tree-title
    var treeTitle = tools.$(".tree-title");
    var prevId=0;                            //初始一个变量为0，存储上一个id

    var checkboxs = tools.$('.checkbox',fileContent);               //获取所有的单选按钮
    var checkedAll = tools.$('.checkedAll')[0] ;                    //获取全选按钮
    var fileItems = tools.$('.file-item',fileContent) ;            //找到所有的文件

    var fullTipBox = tools.$(".full-tip-box")[0];           //获取提示框
    var fullText = tools.$(".text",fullTipBox)[0];          //获取提示框的编辑框 

    //框选变量
    var newDiv = null;
    var disX = disY = 0;

    var delect = tools.$('.delect')[0] ;                //获取删除按钮















    /*************************************构造函数区域**********************************************/

    //封装被选中函数
    function whoSelect(){
        var arr= [] ;                       //定义空数组，存放被选中的文件
        for(var i=0;i< checkboxs.length;i++){
            //判断每一个文件的checkbox身上是否有checked
            if (tools.hasClass(checkboxs[i],'checked')) {  
                arr.push(tools.parents(checkboxs[i],".file-item")) //把它的父级push进数组arr
            };
        }
        return arr ;                        //返回数组
    }


    //给每一个单独的div添加点击处理
    function aloneClick (checkObj) {
        tools.addEvent(checkObj,"click",function (ev){
            var isAddClass = tools.toggleClass(this,"checked");     //判断是否已经添加了class
            if( isAddClass ){                                       //已经添加了class
                if( whoSelect().length === checkboxs.length  ){      //判断被选中元素的length
                    tools.addClass(checkedAll,"checked");
                }
            }else{
                tools.removeClass(checkedAll,"checked");
            }
            ev.stopPropagation();                       //阻止冒泡
        })
        tools.addEvent(checkObj,"mousedown",function (ev){
            ev.stopPropagation();                       //阻止冒泡
        })
    };

    //在心间成功时，生成左侧树形菜单对应的项
    function createTreeLi(datas,tree_childs){
        var level = dataAction.getLevel(datas,tree_childs.id);
        var hasChild = dataAction.hasChilds(datas,tree_childs.id);

        var treeContro = hasChild ? "tree-contro" : "tree-contro-none";
        var html = '';
        html += '<li>'
            +'<div data-file-id="'+tree_childs.id+'" class="tree-title '+treeContro+'" style="padding-left:'+level*14+'px;">'
                +'<span>'
                    +'<strong class="ellipsis">'+tree_childs.title+'</strong>'
                    +'<i class="ico"></i>'
                +'</span>'
            +'</div>'

        html += createTreeHtml(datas,tree_childs.id);

        html += '</li>'
        return html;     
    };

    //提示框的封装
    
   function fullTip(classNames,message){

        //先瞬间拉回到-32，在运动到0
        fullTipBox.style.top = "-32px";
        //设置延迟定时器
        setTimeout(function (){
           tools.addClass(fullTipBox,classNames);       //给提示框添加class
            fullTipBox.style.transition = ".3s";
            fullTipBox.style.top = 0;     
        },0);

        fullText.innerHTML = message;
        clearTimeout(fullTipBox.timer);
        fullTipBox.timer = setTimeout(function (){  //设置延迟定时器，把顶部提示框拉回-32px位置
            fullTipBox.style.top = "-32px";   
        },2000);
    }


    //移动提示框结构封装
     function moveDialogHtml (){
        var html = '<p class="dir-file">\
            <span class="file-img"></span>\
            <span class="file-name">老王</span>\
            <span class="file-num"></span>\
        </p>\
        <div class="dir-box">\
            <div class="cur-dir">\
                <span>移动到：</span><span class="fileMovePathTo">111</span>\
            </div>\
            <div class="dirTree"></div>\
        </div> '
        return html;
    };






    //利用事件委托给div添加移入处理
    tools.addEvent(fileContent,"mouseover",function (ev){
        var target = ev.target;                             //获取事件目标元素
        if( target = tools.parents(target,".file-item") ){  //目标元素时父级时
          tools.addClass(target,"file-checked");            //添加class
        }
    });
    //利用事件委托给所有的文件div添加鼠标移出处理
    
    tools.addEvent(fileContent,"mouseout",function (ev){
        var target = ev.target;
        if( target = tools.parents(target,".file-item") ){  //判断事件源是否是父级元素
            //找到这个元素中的checkbox
            var checkbox = tools.$(".checkbox",target)[0];  //获取有checkbox的class属性的元素

            if( !tools.hasClass(checkbox,"checked") ){      //checkbox没有被选中
                 tools.removeClass(target,"file-checked");  //则删除父级元素的class属性
            }
        }
    });

    /********************根据数据生成一个文件结构********************/
    function creatHTML (item) {
        var html = '<div class="file-item" data-file-id='+item.id+'>'
                       +' <strong class="checkbox"></strong>'
                        +'<i class="icon file"></i>'
                        +'<p>'
                           +'<span class="file-title">'+item.title+'</span>'
                            +'<span class="file-edtor">'
                                +'<input type="text" class="edtor" />'
                           +' </span>'
                        +'</p>'
                    +'</div>';
        return html;
    }

    //循环那到数据放到文件区域
    function craatFilesHtml (datas,id) {
        var childs = dataAction.getChildsById(datas,id);            //通过传入的id找到对应id下的所有子级
        var str = '';
        for(var i=0;i<childs.length;i++){
            str+=creatHTML(childs[i]);          //调用生成单个div函数
        }
        return str ;
    };

    fileContent.innerHTML = craatFilesHtml (datas,initId) ;     //把文件渲染到容器里
    //找到容中所有的已经生成的文件div
    var divs = tools.$ ('.file-item',fileContent)   ;


    //初始调用添加点击处理程序
    addEventfile();
    //封装文件点击处理函数
    function addEventfile (argument) {
        //for循环所有divs,给每一个div添加点击处理
        for(var i=0;i<divs.length;i++){
            tools.addEvent(divs[i],"click",function(){
                var fileId = this.dataset.fileId ;       //找到对应文件的id
                var childs = dataAction.getChildsById(datas,fileId); //通过id找到对应的所有的子级
                fileContent.innerHTML = craatFilesHtml (datas,fileId) ; //把子级文件文件渲染到容器里
                addEventfile ();                            //生成结构或调用点击处理函数
                pathNav.innerHTML = creatNavHtml(datas,fileId);     //渲染头部导航区域

                //当点击文件时，左侧树形菜单指向对应的title
                var prev = tools.getTreeById("tree-title",prevId);
                var tree = tools.getTreeById("tree-title",fileId);
                   tools.removeClass(prev,"tree-nav");
                   tools.addClass(tree,"tree-nav");
                   prevId = fileId;
            })
        }   
    }
//////////////////文件导航区////////////////////////
    function creatNavHtml (datas,id) {
        //传入一个初始id，找到对应的所有的父级，用reverse把所有的父级颠倒顺序
        var parents = dataAction.getParentsById(datas,id).reverse();

         //根据数据生成文件导航的结构
        var str = '';
        //["微云","我的音乐","周杰伦"]
        //最后一个使用span来包含的

        var zIndex = parents.length+10;

        for( var i = 0; i < parents.length-1; i++ ){
           str += '<a href="javascript:;"'
           +' style="z-index:'+(zIndex--)+'" data-file-id="'+parents[i].id+'">'+parents[i].title+'</a>';
                                     
        }
        str += '<span class="icon" style="z-index:'+zIndex+'" data-file-id="0">'+parents[parents.length-1].title+'</span>';   
        return str;
    }    
    pathNav.innerHTML = creatNavHtml(datas,initId);

    //利用事件委托，把点击处理添加在文件导航区域的容器pathNav
    tools.addEvent(pathNav,"click",function (ev){
        var target = ev.target;                            //找出事件源

        if( target.nodeName === "A" ){                     //判断事件源是不是a标签
            var fileId = target.dataset.fileId;            //获取事件源身上的id

            //点击导航区域渲染文件区域的内容
            fileContent.innerHTML = craatFilesHtml(datas,fileId);
            addEventfile ();                                //给文件区域的文件添加点击处理
            //点击导航区域渲染点击导航区域
            pathNav.innerHTML = creatNavHtml(datas,fileId);

            //左侧对应树形菜单的操作
            var prev = tools.getTreeById("tree-title",prevId);
            var tree = tools.getTreeById("tree-title",fileId);
               tools.removeClass(prev,"tree-nav");
               tools.addClass(tree,"tree-nav");
               prevId = fileId;
        }
    });


    //渲染左侧树形菜单区域
    function createTreeHtml(datas,id){
        var tree_childs = dataAction.getChildsById(datas,id);   //通过指定的id获得指定id下所有子级

        var html =   '<ul>';
        for( var i = 0; i < tree_childs.length; i++ ){
            var level = dataAction.getLevel(datas,tree_childs[i].id);//获取当前id在数据中的第几层
           
            var treeNav = id === -1 ? "tree-nav" : ""; //判断当前id是否有子级，有就添加类tree-nav          
            //判断某个id下是否有子级
            var hasChild = dataAction.hasChilds(datas,tree_childs[i].id);
            //有子级就添加tree-contro，没有就添加tree-contro-none
            var treeContro = hasChild ? "tree-contro" : "tree-contro-none";

            html += '<li>'
                +'<div data-file-id="'+tree_childs[i].id+'" class="tree-title '+treeNav+' '+treeContro+'" style="padding-left:'+level*14+'px;">'
                    +'<span>'
                        +'<strong class="ellipsis">'+tree_childs[i].title+'</strong>'
                        +'<i class="ico"></i>'
                    +'</span>'
                +'</div>'

            html += createTreeHtml(datas,tree_childs[i].id);

            html += '</li>'

        }
        html += '</ul>';
        return html;
   }

   treeMenu.innerHTML = createTreeHtml(datas,-1);

   //给左侧属性菜单添加点击处理
   for( var i = 0; i < treeTitle.length; i++ ){ //循环所有的树形菜单名称
     tools.addEvent(treeTitle[i],"click",function (){           //添加点击处理
         var fileId = this.dataset.fileId;

         //点击导航区域渲染文件区域的内容
          fileContent.innerHTML = craatFilesHtml(datas,fileId);
          addEventfile ();                                //给文件区域的文件添加点击处理
          //点击导航区域渲染点击导航区域
          pathNav.innerHTML = creatNavHtml(datas,fileId);

          var prev = tools.getTreeById("tree-title",prevId);
          var tree = tools.getTreeById("tree-title",fileId);
               tools.removeClass(prev,"tree-nav");
               tools.addClass(tree,"tree-nav");
               prevId = fileId;
     })
   }

   tools.getTreeById("tree-title",2)

/////////////////////////////////单选全选处理////////////////////////////////// 

    //给全选按钮添加点击处理
    tools.addEvent(checkedAll,'click',function(){
        var isAddClass = tools.toggleClass(this,"checked");        //是否要添加class
        if( isAddClass ){                                          //已添加上对应的class
            for( var i = 0; i < fileItems.length; i++ ){
                //在对应的文件和对应的checkbox上添加class属性
                tools.addClass(fileItems[i],"file-checked");        
                tools.addClass(checkboxs[i],"checked");
            }
        }else{                                                      //没有添加对应的class
            for( var i = 0; i < fileItems.length; i++ ){
                //从对应的元素身上移出对应的class属性
                tools.removeClass(fileItems[i],"file-checked");
                tools.removeClass(checkboxs[i],"checked");
            }
        }
    });

    //给每一个checkbox添加点击处理
    checkboxAddEvent();                         //初始
    function checkboxAddEvent(){
        for(var i=0;i< checkboxs.length;i++){
            aloneClick(checkboxs[i]) ;
        }
    };
    

//新建文件夹
    var create = tools.$('.create')[0];             //获取新建按钮
     tools.addEvent(create,"click",function (ev){
        //判断是否有文件在新建中，如果有，就停止执行下面的操作
        if( this.isCreateFile ){
            return;
        }
        this.isCreateFile  = true;              
        //在fileContent之前要出现一个文件
        var html = creatHTML({              //给新建的文件一个结构跟id
            id:tools.uuid()
        });

        fileContent.innerHTML = html + fileContent.innerHTML;  //新建的文件插入到之前文件的前面

        var first = fileContent.firstElementChild;             //获取文件区域的新建的文件
        var fileTitle = tools.$(".file-title",first)[0];       //获取新建文件夹的title
        var fileEdtor = tools.$(".file-edtor",first)[0];       //获取新建文件的编辑框

        fileTitle.style.display = "none";                   //隐藏title部分
        fileEdtor.style.display = "block";                  //显示编辑框

        var edtor = tools.$(".edtor",first)[0];             //获取input
        edtor.focus();                                      //新建时让input获的焦点

        //给input绑定点击处理和鼠标按下处理
        tools.addEvent(edtor,"click",function (ev){
            ev.stopPropagation();                           //阻止冒泡   
        });
        tools.addEvent(edtor,"mousedown",function (ev){
            ev.stopPropagation();                           //阻止冒泡   
        });
    });

    /*新建成功与否在于鼠标抬起时编辑框内是否有内容*/

    //点击document，判断是否新建
    tools.addEvent(document,"mousedown",function (){

        if( create.isCreateFile ){                          //判断新建开关的状态
            var first = fileContent.firstElementChild;
            var fileTitle = tools.$(".file-title",first)[0];
            var fileEdtor = tools.$(".file-edtor",first)[0];
            var edtor = tools.$(".edtor",first)[0];

            var edtorVal = edtor.value.trim();              //编辑框的value值

            //导航中最后一个元素
            var pathNavLast = tools.$("span",pathNav)[0];
            var pid = pathNavLast.dataset.fileId;
            //console.log(pathNavLast,pid);
            if( edtorVal === "" ){                      //新建不成功
                fileContent.removeChild(first);         //不成功则把文件从文件区域删除

            }else if(dataAction.reName(datas,pid,edtorVal)){
                fileContent.removeChild(first);     //新建文件名跟已有文件不能重名
            }else{ //新建成功
                fileTitle.innerHTML = edtorVal;     //新建成功则显示title
                fileTitle.style.display = "block";
                fileEdtor.style.display = "none";

                //向数据中添加一条新的文件信息
                var newFile = {
                    id: first.dataset.fileId,
                    pid:pid,
                    title:edtorVal,
                    type:"file"
                };
                datas.unshift(newFile);

                //提醒
                fullTip("ok","新建文件夹成功");

                //要找到当前这个新建的文件的父级对应的左侧树形菜单，
                //找到下一级 > ul

                var tree = tools.getTreeById("tree-title",pid); //找到父id对应的项
                var nextUl = tree.nextElementSibling;           //获取父id对应的下一个兄弟节点

                nextUl.innerHTML += createTreeLi(datas,newFile);//渲染左侧对应的树形菜单
                tools.removeClass(checkedAll,"checked");        //去掉全选按钮的class

                //给所有的checkbox添加事件处理
                checkboxAddEvent();
            }
            create.isCreateFile = false;            //重置新建按钮的状态
        }
    });

    //框选
   
    tools.addEvent(document,"mousedown",function (ev){
        var target = ev.target;                         //获取目标源
        ev.preventDefault(); 
        //如果目标源是以下几种情况，则不能拉出框选框
        if( tools.parents(target,".handleFile") || 
            tools.parents(target,".content_right_left")  ||
            tools.parents(target,".lay-aside")  || checkboxs.length === 0
            || delect.delect
          ){
            return;
        }

        newDiv = null;
        disX = ev.clientX;
        disY = ev.clientY;
        tools.addEvent(document,"mousemove",moveFn);
        tools.addEvent(document,"mouseup",upFn);

        //鼠标按下时，清除全选按钮和所有checkbox的状态
        for( var i = 0; i < fileItems.length; i++ ){
            tools.removeClass(fileItems[i],"file-checked");
            tools.removeClass(checkboxs[i],"checked");
        }
        tools.removeClass(checkedAll,"checked");


       
    })

    function moveFn(ev){ 
        if( Math.abs(ev.clientX - disX) > 20 ||  Math.abs(ev.clientY - disY) > 20 ){
            if( !newDiv ){                                  //判断是否有newDiv
                newDiv = document.createElement("div");
                newDiv.className = "selectTab";
                newDiv.style.left = disX + "px";
                newDiv.style.top = disX + "px";
                document.body.appendChild(newDiv);
            }
            //newDiv的样式
            newDiv.style.width = Math.abs(ev.clientX - disX) + "px";
            newDiv.style.height = Math.abs(ev.clientY - disY) + "px";
            //newDiv的定位坐标
            newDiv.style.left = Math.min(ev.clientX , disX)+1 + "px";
            newDiv.style.top = Math.min(ev.clientY , disY)+1 + "px";

            for( var i = 0; i < fileItems.length; i++ ){
                if( duang(newDiv,fileItems[i]) ){                //碰上的改变状态

                   tools.addClass(fileItems[i],"file-checked");
                   tools.addClass(checkboxs[i],"checked");
                }else{                                            //没有被碰上
                   tools.removeClass(fileItems[i],"file-checked");
                   tools.removeClass(checkboxs[i],"checked");
                }
            }
        }  
    }
    function upFn(){                                    //鼠标抬起时删除鼠标的移动和抬起处理
        tools.removeEvent(document,"mousemove",moveFn);
        tools.removeEvent(document,"mouseup",upFn);
        if( newDiv ) document.body.removeChild(newDiv); //删除框选div

        if( whoSelect().length === checkboxs.length ){  //所有的元素都碰上，处于全选状态
            tools.addClass(checkedAll,"checked");       //全选按钮被勾选
        }
    }

    //删除文件
    tools.addEvent(delect,"click",function (){
        delect.delect = true;
        var selectArr = whoSelect();
        console.log(whoSelect())
        if( selectArr.length === 0 ) {
            fullTip("warn","请选择文件");
        }else{
            //删除 文件区域删除 树形菜单删除
            dialog({
                title:"删除文件",
                content:"确定要删除这个文件夹吗？",
                okFn:function (){                                   //点击确定按钮
                    var idArr = [];                                 //定义一个空的id数组
                    for( var i = 0; i < selectArr.length; i++ ){    //循环被选中的元素
                        fileContent.removeChild(selectArr[i]);      //把被选中的元素从文件区域删除

                        var fileId = selectArr[i].dataset.fileId;   //定义变量存储被选中元素的id

                        var tree = tools.getTreeById("tree-title",fileId);  //通过id找到属性菜单中对应的项

                        tree.parentNode.parentNode.removeChild(tree.parentNode); //从树形菜单中删除对应项

                        idArr.push(fileId);                         //把得到的id push进idArr
                    }
                    dataAction.batchDelect(datas,idArr);            //调用函数根据idArr删除数据中对应的数据  
                    delect.delect = false;                          //把删除的状态设为false
                }
            })
        }
    });

    //移动文件
    var move = tools.$('.move')[0] ;            //获取移动按钮

       tools.addEvent(move,"click",function (){
        var selectArr = whoSelect();
        if( selectArr.length === 0 ) {
            fullTip("warn","请选择要移动的");
        }else{

            //出现弹框

            move.isMove = true;

            var moveId = 0;  //保存选择要移动文件的id

            var isMove = true;  //默认是不可以关闭

            dialog({
                title:"选择存储位置",
                content:moveDialogHtml(),
                okFn:function (){
                    //可以移动
                    if( !isMove ){

                        //移动数据

                        //3. 3. 可以移动的文件夹下，重名的不能移动

                        var childsTitle = dataAction.getChildsById(datas,moveId);
                        var a = true;
                        b:for( var i = 0; i < selectArr.length; i++ ){
                             a = true;
                            var getData = dataAction.getDataById(datas,selectArr[i].dataset.fileId);
                            //要移动的数据，不能存在于被移入的数据的子数据中 
                            //判断的依据是数据的 title
                            for( var j = 0; j < childsTitle.length; j++ ){
                                if( childsTitle[j].title == getData.title ){
                                    fullTip("warn","部分移动失败,重名了");
                                    a = false;
                                   // continue b;
                                    break;
                                }
                            }

                            if( a ){
                                 getData.pid = moveId;
                            }  
                        }

                        //文件区域渲染
                        var cur = tools.$(".current-path")[0].dataset.fileId;
                        fileList.innerHTML = createFilesHtml(datas,cur);
                        //菜单区域渲染
                        treeMenu.innerHTML = createTreeHtml(datas,-1);
                        //定位到某个菜单上
                        tools.addClass(tools.getTreeById("tree-title",cur),"tree-nav");
                        move.isMove = false;
                    }

                    return isMove;       
                }
            }); 

            //弹框的父级
            var fullPop = tools.$(".full-pop")[0];


            //渲染弹框中的树形菜单
            var dirTree = tools.$(".dirTree",fullPop)[0];
            tools.addClass(dirTree,"tree-menu-comm");
            dirTree.innerHTML = createTreeHtml(datas,-1);

            //填写内容
            var fileName = tools.$(".file-name",fullPop)[0];
            var fileNum = tools.$(".file-num",fullPop)[0];
            var selectFirstId = selectArr[0].dataset.fileId;

            //错误信息提示
            var error = tools.$(".error",fullPop)[0];

            fileName.innerHTML = dataAction.getDataById(datas,selectFirstId).title;
            if( selectArr.length>1 ){

                fileNum.innerHTML = '等 '+selectArr.length+' 个文件 ';
            }

            var prevId = 0;


            tools.addEvent(dirTree,"click",function (ev){
                var target = ev.target;

                if( target = tools.parents(target,".tree-title") ){

                    isMove = false;

                    //点击菜单的那个id
                    var clickFileId = target.dataset.fileId;
                    tools.removeClass(tools.getTreeById("tree-title",prevId,dirTree),"tree-nav");
                    tools.addClass(target,"tree-nav");

                    prevId = clickFileId;



                    /*
                        1. 不能移动到被移动的这些元素的父级上
                        2. 不能移动到本身或子元素下
                        3. 可以移动的文件夹下，重名的不能移动
                    */ 

                    error.innerHTML = "";

                    //被移动的元素的父id
                    var firstSelectId = selectArr[0].dataset.fileId;

                    var parent = dataAction.getParent(datas,firstSelectId);

                    if( clickFileId == parent.id ){
                        error.innerHTML = "文件已经在当前文件夹下";
                        isMove = true;
                    }

                    //2. 不能移动到本身或子孙元素下
                    //[1,2,3,4,5]

                    //selectArr 选中元素的集合
                    //clickFileId 点击树形菜单的那个菜单的id

                    for( var i = 0; i < selectArr.length; i++ ){
                        //找到选中元素的所有的子孙数据
                        var selectId = selectArr[i].dataset.fileId;
                        var childs = dataAction.getChildsAll(datas,selectId);

                        for( var j = 0; j < childs.length; j++ ){
                            if( childs[j].id == clickFileId ){
                                error.innerHTML = "不能移动到本身或子孙元素下";
                                isMove = true;
                                break;
                            }
                        }
                    }
                    moveId = clickFileId;
                } 
            })
        }
    })









}())
