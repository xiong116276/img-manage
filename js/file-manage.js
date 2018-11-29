//xiong 2018-11-28
//web 图片管理

(function (win, doc) {
  win.ImgsManage = function (params) {
    this.data = {};
    this.el  = params.el;
    this.url = params.url;
    this.originalUrl = params.url;//保存初始URL
    this.w   = params.w||500;
    this.h   = params.h||400;

    $(this.el).css({
      'width':this.w+'px',
      'height':this.h+'px'
    });

    $(this.el).html('');
    var topBar = $('<div class="topBar">\n' +
        '      <span>当前路径为：</span><input class="dirUrl" type="text"> <label class="btnUpload" for="imgUpload">上传<input style="display: none" multiple type="file" id="imgUpload" /></label><button class="prevDir">上一级</button><button class="newDir">新 建</button>\n' +
        '    </div>').appendTo($(this.el));
    var imgs = $('<div id="imgs"></div>').appendTo($(this.el));

    this.init(this.url);
    $('#imgs').css({
      'height':this.h-45+'px'
    });

    //新建文件夹
    this.newDir();
    //上传图片
    this.imgUpload();
  };

  ImgsManage.prototype ={
    init : function (url) {
      this.getData(url);
      setTimeout(function () {
        this.drawPanel(this.data);
      }.bind(this),500);
    },
    getData:function (url) {
      var that = this;
      $.ajax({
        url:"data/file-reader.php",
        data:{'url':url},
        type:"get",
        dataType:'json',
        success:function (data) {
          that.data = data;
        },
        error:function (err) {
          console.log(err);
        }
      });
    },
    drawPanel:function (data) {
      if(!$.isEmptyObject(data)){
        if(data.dirs.length > 0 || data.files.length > 0){
          var html = '';
          $.each(data.dirs,function (k,v) {
            if(k > 1){
              html += '<div class="item dirs"><img src="images/dir.jpg" alt=""><p class="text" title="'+v+'">'+v+'</p>' +
                  '<p class="btnOperation"><button class="deleteDir">删除文件夹</button></p></div>';
            }
          }.bind(this));
          $.each(data.files,function (k,v) {
            html += '<div class="item imgs"><img src="data/'+this.url+v+'" alt=""><p class="text" title="'+v+'">'+v+'</p>' +
                '<p class="btnOperation"><button class="copy">复制</button><button class="delete">删除</button></p></div>';
          }.bind(this));

          $(this.el).find('#imgs').html(html);
          //双击文件
          $(this.el).off('dblclick').on('dblclick',function (event) {
            var target = event.target;
            if($(target).parent().hasClass('dirs')&&target.nodeName === 'IMG'){//进入文件夹
              var name = $(target).siblings('.text').text();
              this.url = this.url+name+"/";
              this.init(this.url);
            }else if($(target).parent().hasClass('imgs')&&target.nodeName === 'IMG'){//放大图片
              var arr = $(target).parents("#imgs").children('.imgs');
              var srcs = [];
              $.each(arr,function (k,v) {
                srcs.push($(v).find('img').attr('src'));
              });
              var src = $(target).attr('src');

              var html = $('<div id="imgShow"><span class="icon-close"></span><img src="'+src+'" alt=""><button class="btn-prev"><</button><button class="btn-next">></button></div>').appendTo($(this.el));
              $('#imgShow').css({'line-height':this.h+'px'});
              $('#imgShow .icon-close').on('click',function () {
                $(this).parents('#imgShow').remove();
              });
              $('#imgShow .btn-prev').on('click',function () {
                var i = srcs.indexOf($(this).siblings('img').attr('src'));
                if(i > 0){
                  $(this).siblings('img').attr('src',srcs[i-1]);
                }else {
                  alert('已经是第一张！')
                }
              });
              $('#imgShow .btn-next').on('click',function () {
                var i = srcs.indexOf($(this).siblings('img').attr('src'));
                if(i < srcs.length-1){
                  $(this).siblings('img').attr('src',srcs[i+1]);
                }else {
                  alert('已经是最后一张！');
                }
              })
            }
          }.bind(this));
          $(this.el).find(".dirUrl").val('/'+this.url.slice(3));
          //返回上一级目录
          $(this.el).off("click").on("click",'.prevDir',function (event) {
            if(this.originalUrl !== this.url){
              var target = event.currentTarget;
              this.url = this.url.split('/').slice(0,-2).join('/')+'/';
              this.init(this.url);
            }else{
              alert('已到最顶级目录！');
            }
          }.bind(this));
          //复制图片路径信息
          //临时容器，不能为display:none
          $('<textarea  style="opacity: 0" id="temp"></textarea >').appendTo($('body'));
          $('.btnOperation .copy').on('click',function (event) {
            var target = event.target;
            var text = this.url+$(target).parents('p.btnOperation').siblings('p.text').text();
            $('#temp').val(text.slice(2));
            $('#temp').select();
            try{
              document.execCommand("Copy"); //内容复制到剪切板
              alert('图片路径已复制到剪切板');
            }catch(e){
              alert('浏览器不支持快捷复制，请选中内容后，CTRL+C');
            }
          }.bind(this));

          //删除图片
          $('.btnOperation .delete').on('click',function (event) {
            var target = event.target;
            var url = this.url+$(target).parents('p.btnOperation').siblings('p.text').text();
            var r=confirm("确定要删除该文件吗？");
            if (r) {
              $.ajax({
                url:'data/file-delete.php',
                type:'post',
                data:{'url':url,'type':'file'},
                success:function (data) {
                  alert(data);
                  this.init(this.url);
                }.bind(this),
                error:function (err) {
                  console.log(err);
                }
              })
            }

          }.bind(this));

          //删除文件夹
          $('.btnOperation .deleteDir').on('click',function (event) {
            var target = event.target;
            var url = this.url+$(target).parents('p.btnOperation').siblings('p.text').text();
            var r=confirm("确定要删除该文件夹及其所有文件吗？");
            if (r) {
              $.ajax({
                url:'data/file-delete.php',
                type:'post',
                data:{'url':url,'type':'dir'},
                success:function (data) {
                  alert(data);
                  this.init(this.url);
                }.bind(this),
                error:function (err) {
                  console.log(err);
                }
              })
            }

          }.bind(this));
        }
      }else{
        console.log('data 为空');
      }
    },
    newDir:function () {
      $(".newDir").on('click',function () {
        var name = prompt("请输入要创建的文件夹名字");
        if(name !== null && name !== ""){
          $.ajax({
            url:'data/file-new.php',
            data:{'fileName':name,'url':this.url},
            type:'post',
            dataType:'json',
            success:function (data) {
              alert(data);
              this.init(this.url);
            }.bind(this),
            error:function (err) {
              alert(err.responseText);
            }
          });
        }
      }.bind(this))
    },
    imgUpload:function () {
      $("#imgUpload").on('change',function (event) {
        this.upCode = [];
        var target = event.target;
        var files  = target.files;
        var len    = files.length;
        // var fileObj  = target.files[0];
        for (var i = 0; i < len; i++) {
          if(files[i].size >= (500*1024)){
            alert('图片不能大于500kb');
            continue;
          }
          this.upload(files[i]);
        }
        if(this.upCode.length > 0){
          if(this.upCode.indexOf('错误') > -1){
            alert('上传图片中有错误！')
          }
          if(this.upCode.indexOf('文件已经存在') > -1){
            alert('上传图片中有已存在的！')
          }
          if(this.upCode.indexOf('非法的文件格式') > -1){
            alert('上传图片中有不符合格式的！')
          }
          if(this.upCode.indexOf('错误') === -1
              &&this.upCode.indexOf('文件已经存在')===-1
              &&this.upCode.indexOf('非法的文件格式')===-1
              &&this.upCode.indexOf('上传成功')>-1
          ){
            alert('上传成功！');
          }

          this.init(this.url);
        }
      }.bind(this));
    },
    upload:function (file) {
      var formData = new FormData();
      formData.append('img',file);
      formData.append('url',this.url);
      $.ajax({
        url:'data/file-upLoad.php',
        type:'POST',
        data:formData,
        async:false,
        processData:false,
        contentType:false,
        success:function (data) {
          this.upCode.push(data);
        }.bind(this),
        error:function (err) {
          console.log(err)
        }
      });
    }
  }
})(window,document);























