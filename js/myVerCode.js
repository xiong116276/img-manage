//js生成验证码图片
(function (win,doc) {
  win.MyVerCode = function (obj) {
    this.init = function (obj) {
      this.el   = $(obj.el);//input 输入验证码元素
      this.w    = obj.w||100;    //验证码图片的宽
      this.h    = obj.h||40;    //验证码图片的高
      this.color= obj.color||"#fff";//验证码文字颜色
      this.font = obj.font||"25px Arial";
      this.bg   = obj.bg||"cornflowerblue";   //验证码背景颜色
      this.nums = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0",
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
      ];

      //绘制验证码
      this.drawCode();
    };
    this.init(obj);
  } ;
  MyVerCode.prototype = {
    setTemplate:function (el) {//input 后添加验证码元素
      el.after('<div class="verCode" style="display:inline-block">\n' +
          '      <canvas width="'+this.w+'" height="'+this.h+'" class="verCodeCanvas"></canvas>\n' +
          '      <img class="verCodeImg">\n' +
          '    </div>');
      this.canvas = $(this.el).siblings('.verCode').children('.verCodeCanvas')[0];
      this.img = $(this.el).siblings('.verCode').children('.verCodeImg')[0];
      //点击图片刷新验证码
      this.img.onclick = function () {
        $('.verCode').remove();
        this.drawCode();
      }.bind(this);
    }
    ,getNum:function () {//生成随机数
      return this.nums[Math.floor(Math.random()*(this.nums.length))]//获取this.nums数组中一位随机数；
    }
    , drawCode:function () {//生成验证码
      //初始化添加模板
      this.setTemplate(this.el);

      var ctx = this.canvas.getContext("2d");
      ctx.clearRect(0,0,this.w,this.h);//清空画布
      ctx.fillStyle = this.bg;
      ctx.fillRect(0,0,this.w,this.h);//填充背景色
      ctx.fillStyle = this.color;//设置文字颜色
      ctx.font      = this.font;//设置文字字体
      ctx.textBaseline="top";
      //生成4位随机验证码
      this.code = "";//生成的验证码
      var code=[];
      for (var i = 0,len = 4;i<len;i++){
        code[i] = new Object();
        code[i].num = this.getNum();
        this.code += code[i].num;
        code[i].x = parseFloat(i * ((this.w-5) / len)+5);
        code[i].y = Math.random()*(this.h-30+1);
        ctx.fillText(code[i].num,code[i].x,code[i].y);
      }
      //生成3条线
      for(var j = 0;j < 3;j++){
        this.drawLine(ctx);
      }
      for(var k = 0;k < 20;k++){
        this.drawDot(ctx);
      }
      //canvas转图片
      this.canvas.style.display = 'none';
      this.img.style.cursor = 'pointer';
      this.img.src = this.canvas.toDataURL("image/png");
    }
    ,drawLine:function (ctx) {//随机生成几条线
      //设置起点状态
      ctx.moveTo(Math.floor(Math.random()*this.w),Math.floor(Math.random()*this.h));
      //设置末端状态
      ctx.lineTo(Math.floor(Math.random()*this.w),Math.floor(Math.random()*this.h));
      //设置线宽状态
      ctx.lineWidth = 0.5;
      //设置线的颜色状态
      ctx.strokeStyle = 'rgba(50,50,50,0.3)';
      //进行绘制
      ctx.stroke();
    }
    ,drawDot:function (ctx) {//画点就是画1像素的线
      var x = Math.floor(Math.random()*this.w);
      var y = Math.floor(Math.random()*this.h);
      ctx.moveTo(x,y);
      ctx.lineTo(x+1,y+1);
      ctx.strokeStyle = 'rgba(50,50,50,0.3)';
      ctx.lineWidth = 0.2;
      ctx.stroke();
    }
  };
})(window,document);