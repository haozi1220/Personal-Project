/*************************声明变量区域********************/
(function(){
    var fileContent = tools.$(".content_right_right_main")[0] ;     //获取文件区域容器
    var datas = data.files ;                                    //得到数据

    //找到指定ID下所有的子级
    //初始化第一层数据id为0
    var initId = 0;














    /*************************************构造函数区域**********************************************/

    /********************根据数据生成一个文件结构********************/
    function creatHTML (item) {
        var html = '<div class="file-item" data-file-id='+item.id+'>'
                       +' <strong></strong>'
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
                pathNav.innerHTML = creatNavHtml(datas,fileId);
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

    //获取导航区域容器
    var pathNav = tools.$('.right_top_nav')[0];
    pathNav.innerHTML = creatNavHtml(datas,initId);
    console.log(pathNav.innerHTML)








}())
