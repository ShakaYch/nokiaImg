<template>
  <div class="box">
    <div class="logo_zone">
      <img src="../assets/img/logo_2.png" alt="logo" />
    </div>
    <div class="title">诺基亚短信图片生成器</div>
    <div class="input_zone">
      <input
        type="text"
        ref="extInput"
        v-model="text"
        placeholder="请输入短信文字"
        @focus="toggleClearBtn(1)"
        @blur="toggleClearBtn(0)"
      />
      <div class="btn_draw" @click="loadCavas">生成</div>
      <div class="btn_clear" @click="clear" v-if="showClearBtn">
        <van-icon name="cross" />
      </div>
    </div>
    <div class="wrapper" id="wrapper">
      <ul class="img_group" :style="{ width: `${setting.length * 3.6}rem` }">
        <li
          class="img_item"
          v-for="(item, index) in setting"
          :key="item.id"
          :class="{ active: index == activeIndex }"
          @click="change(index)"
        >
          <van-image
            round
            width="3rem"
            height="3rem"
            fit="contain"
            :src="getImgUrl(item.id)"
          />
        </li>
      </ul>
    </div>
    <img src="../assets/img/nokia1.jpg" id="nokia1" alt="" v-show="false" />
    <img src="../assets/img/nokia2.jpg" id="nokia2" alt="" v-show="false" />
    <img src="../assets/img/nokia3.jpg" id="nokia3" alt="" v-show="false" />
    <img src="../assets/img/nokia4.jpg" id="nokia4" alt="" v-show="false" />
    <img src="../assets/img/paper.jpg" id="paper" alt="" v-show="false" />
    <img
      src="../assets/img/helloKitty.jpg"
      id="helloKitty"
      alt=""
      v-show="false"
    />
    <div class="canvas_zone">
      <div>
        <canvas id="my_canvas" :height="setting[activeIndex].height"></canvas>
        <img :src="imgSrc" alt="" @click="showImgPreview" />
      </div>
    </div>
    <div class="btn_group">
      <div class="btn btn_save" @click="save">保存</div>
      <div class="btn btn_share" @click="showShare = true">分享</div>
    </div>
    <div class="tips_zone">©Ych 2020</div>

    <share-sheet
      v-model="showShare"
      title="立即分享给好友"
      :options="options"
      @select="onSelect"
    />
    <van-dialog
      v-model="qrModal"
      :show-confirm-button="false"
      :close-on-click-overlay="true"
    >
      <img width="100%" src="../assets/img/qrcode.png" alt="" />
    </van-dialog>
  </div>
</template>

<script>
import BScroll from "better-scroll";
import {
  Notify,
  Toast,
  ShareSheet,
  Image as VanImage,
  Dialog,
  ImagePreview,
} from "vant";
export default {
  name: "index",
  data() {
    return {
      text: "无内鬼，抓紧上车!", //生成的文字
      showClearBtn: true, //清除按钮
      qrModal: false, //二维码所用弹窗
      //画布
      myCanvas: null,
      ctx: null,
      imgSrc: "", //导出所用图片
      bSrcoll: null,
      showShare: false, //分享面板
      options: [
        { name: "微信", icon: "wechat" },
        { name: "微博", icon: "weibo" },
        { name: "复制链接", icon: "link" },
        { name: "分享海报", icon: "poster" },
        { name: "二维码", icon: "qrcode" },
      ],
      // 图片设置
      setting: [
        {
          name: "有内鬼，终止交易！",
          id: "nokia1",
          width: 300,
          height: 300,
          lineHeight: 24,
          fontSize: 16,
          fontWeight: "",
          start: {
            //文字开始的坐标
            x: 85,
            y: 88,
          },
          maxWidth: 155, //一行文字最大长度
          rotate: 10.8, //文字旋转角度
          maxText: 50, //最长文字字数(中文)
        },
        {
          name: "安排上了。",
          id: "nokia2",
          width: 300,
          height: 646.2,
          lineHeight: 32,
          fontSize: 20,
          fontWeight: "bold",
          start: {
            x: 30,
            y: 130,
          },
          maxWidth: 220,
          rotate: 0,
          maxText: 72,
        },
        {
          name: "能不能别和别的女生聊天啊,好烦呀！！！",
          id: "helloKitty",
          width: 300,
          height: 300,
          lineHeight: 19,
          color: "#92BDCD",
          fontSize: 10,
          fontWeight: "normal",
          start: {
            x: 145,
            y: 85,
          },
          maxWidth: 90,
          rotate: -1.5,
          maxText: 40,
        },
        {
          name: "无内鬼，抓紧上车！",
          id: "nokia3",
          width: 300,
          height: 411,
          lineHeight: 32,
          fontSize: 24,
          color: "#328301",
          fontWeight: "",
          start: {
            x: 55,
            y: 200,
          },
          maxWidth: 180,
          rotate: 0,
          maxText: 24,
        },
        {
          name: "早起人，早起魂，早起打工人上人，早安打工人！",
          id: "nokia4",
          width: 300,
          height: 534,
          lineHeight: 18,
          fontSize: 13.3,
          color: "#1F120F",
          fontWeight: "bolder",
          start: {
            x: 105,
            y: 255,
          },
          maxWidth: 110,
          rotate: 2.5,
          maxText: 38,
        },
        {
          name: "放他三千裘马去，不寄俗生。唯贪我三枕黄粱梦。 ",
          id: "paper",
          width: 300,
          height: 290,
          lineHeight: 25,
          fontSize: 18,
          color: "#1F120F",
          fontWeight: "",
          start: {
            x: 40,
            y: 105,
          },
          maxWidth: 240,
          rotate: 3.2,
          maxText: 52,
        },
      ],
      activeIndex: 0,
    };
  },

  components: {
    VanImage,
    ShareSheet,
    [Dialog.Component.name]: Dialog.Component,
  },

  computed: {},

  beforeMount() {},

  mounted() {
    this.myCanvas = document.getElementById("my_canvas");
    this.ctx = this.myCanvas.getContext("2d");
    this.$nextTick(() => {
      let nokiaImg = document.getElementById("nokia1"),
        $this = this;
      nokiaImg.onload = nokiaImg.onreadystatechange = function () {
        if (
          !this.readyState ||
          this.readyState == "loaded" ||
          this.readyState == "complete"
        ) {
          // 加载完成
          $this.loadCavas();
          let wrapper = document.querySelector(".wrapper");
          this.bScroll = new BScroll(wrapper, {
            scrollY: false,
            scrollX: true,
            click: true, //派发事件
            bounce: false, //回弹动画
          });
        }
      };
    });
  },

  methods: {
    loadCavas() {
      if (this.text == "") {
        Toast.fail("请输入文字");
        return;
      }
      let activeSetting = this.setting[this.activeIndex];
      let textLength = this.checkLength(); //文字的长度 顺便去判断是否超长
      //分离文字(中文随时换行,英文换行需要单词)
      // 这个为复杂方案 待完善 标点问题
      // let arr = this.text.split(/([a-zA-Z0-9]+)/g);
      // let words = [].concat.apply(
      //   [],
      //   arr.map((x) =>
      //     x.trim() != "" && !x.match(/([a-zA-Z0-9]+)/g) ? x.split("") : [x]
      //   )
      // );
      let words = this.text.split("");

      let c = this.myCanvas,
        ctx = this.ctx;
      var img = document.getElementById(activeSetting.id); //绘制nokia背景
      ctx.drawImage(img, 0, 0, activeSetting.width, activeSetting.height);
      ctx.save(); //暂存状态 用于下一次绘制
      ctx.font = `${activeSetting.fontSize}px ${activeSetting.fontWeight} FZXIANGSU16`; //设置字体 和 大小
      ctx.rotate((activeSetting.rotate * Math.PI) / 180); //旋转
      //处理数据
      let lineArr = [], //多行文字数组
        lineStr = ""; //每行的文字
      words.forEach((item, index) => {
        lineStr += item;
        let metrics = ctx.measureText(lineStr);
        if (metrics.width > activeSetting.maxWidth) {
          //超出一行
          lineArr.push(lineStr);
          lineStr = "";
        }
        if (index == words.length - 1) {
          //最后一个
          lineArr.push(lineStr);
        }
      });
      // console.log(lineArr);
      ctx.fillStyle = activeSetting.color || "#000";
      lineArr.forEach((item, index) => {
        ctx.fillText(
          item,
          activeSetting.start.x,
          activeSetting.start.y + index * activeSetting.lineHeight
        );
      });
      //字数统计(仅图一有此功能)
      if (this.activeIndex == 0) {
        ctx.fillStyle = "#DBD2E2";
        ctx.textAlign = "right";
        ctx.fillText(`${Math.ceil(textLength)}/50`, 255, 61);
      }
      //当前时间(仅便签由此功能)
      if (this.activeIndex == 5) {
        let timeStr = this.getTime();
        ctx.fillStyle = "#1F120F";
        ctx.fillText(timeStr, 45, 70);
      }
      ctx.restore(); //画布状态回复
      this.imgSrc = this.myCanvas.toDataURL("image/png");
    },
    //获取文本的长度(中文和中文标点算一个字符,英文数字和英文字符算0.5个标点)
    checkLength() {
      let activeSetting = this.setting[this.activeIndex];
      let arr = this.text.split(""),
        reg1 = /[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/,
        reg2 = /[\u4e00-\u9fa5]/;
      let len = 0,
        cutIndex = null,
        flag = arr.some((item, index) => {
          if (reg1.test(item) || reg2.test(item)) {
            len++;
          } else {
            len = len + 0.5;
          }
          if (len > activeSetting.maxText) {
            cutIndex = index;
            return true;
          }
        });
      if (flag) {
        this.text = this.text.slice(0, cutIndex);
        len = activeSetting.maxText;
        Notify({
          message: `该图仅能容下${activeSetting.maxText}个字,超出部分已自动截取`,
          color: "#fff",
          background: "#1ABC9C",
        });
      }
      return len;
    },
    getTime() {
      let date = new Date(),
        y = date.getFullYear(),
        m = String(date.getMonth() + 1).padStart(2, 0),
        d = String(date.getDate()).padStart(2, 0),
        h = String(date.getHours()).padStart(2, 0),
        min = String(date.getMinutes()).padStart(2, 0),
        sec = String(date.getSeconds()).padStart(2, 0);
      return `${y}-${m}-${d} ${h}:${min}:${sec}`;
    },
    showImgPreview() {
      ImagePreview({
        images: [this.imgSrc],
        showIndex: false,
      });
    },
    save() {
      Dialog.alert({
        message: "长按图片即可保存或发送给好友 ~",
        theme: "round-button",
        confirmButtonColor: "#1abc9c",
        closeOnClickOverlay: true, //是否在点击遮罩层后关闭弹窗
        width: 260,
        getContainer: () => {
          return document.querySelector(".box");
        },
      }).then(() => {
        // on close
      });
    },
    onSelect(option) {
      if (option.name == "复制链接") {
        this.copyToClipBoard();
      } else if (option.name == "二维码") {
        this.qrModal = true;
      } else {
        Toast.fail("暂未开放");
      }
      this.showShare = false;
    },
    copyToClipBoard() {
      this.$copyText(window.location.href).then(
        function (e) {
          Toast.success("复制成功");
        },
        function (e) {
          Toast.fail("复制失败");
        }
      );
    },
    getImgUrl(id) {
      return require(`@/assets/img/${id}.jpg`);
    },
    change(i) {
      this.activeIndex = i;
      this.showClearBtn = true;
      this.text = this.setting[this.activeIndex].name;
      this.imgSrc = "";
      this.$nextTick(() => {
        this.loadCavas();
      });
    },
    //清除input
    clear() {
      this.text = "";
      setTimeout(() => {
        this.showClearBtn = false;
      }, 100);
    },
    toggleClearBtn(type) {
      if (type == 1) {
        this.showClearBtn = type;
      } else {
        setTimeout(() => {
          this.showClearBtn = type;
        }, 100);
      }
    },
  },

  watch: {},
};
</script>

<style scoped>
/* box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1) */
.box {
  font-family: "FZXIANGSU16";
  width: 375px;
  overflow: hidden;
}
.logo_zone {
  text-align: left;
}
.logo_zone > img {
  width: 100px;
  margin-top: 10px;
}
.title {
  font-size: 20px;
  color: #1abc9c;
  text-align: center;
  padding: 30px 20px;
  font-weight: 600;
}
.input_zone {
  width: 375px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.input_zone > input {
  padding: 5px 15px;
  line-height: 1.5;
  box-sizing: border-box;
  width: 320px;
  font-size: 18px;
  color: #16a085;
  background-color: #fff;
  background-image: none;
  border: 1px solid #27ae60;
  border-radius: 8px;
  transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  margin: 0 auto;
  padding-right: 88px;
}
.input_zone > input:focus {
  outline: none;
  border-color: #2ecc71;
  box-shadow: 0px 2px 12px 0 rgba(46, 204, 113, 0.5);
}
.btn_draw {
  position: absolute;
  right: 28px;
  font-size: 18px;
  width: 60px;
  text-align: center;
  line-height: 1.5;
  background-color: #1abc9c;
  color: #fff;
  padding: 5px 0;
  border-radius: 0 8px 8px 0;
}
.btn_clear {
  position: absolute;
  right: 95px;
  font-size: 8px;
  height: 16px;
  width: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1abc9c;
  color: #fff;
  border-radius: 50%;
  opacity: 0.5;
  transition: 0.5s all ease;
}
.canvas_zone {
  width: 300px;
  margin: 0 auto 10px auto;
  padding: 10px;
  border: 1px solid #27ae60;
  box-shadow: 0 2px 12px 0 rgba(46, 204, 113, 0.1);
  border-radius: 12px;
  position: relative;
}
.canvas_zone img {
  position: absolute;
  width: calc(100% - 20px);
  top: 10px;
  left: 10px;
  z-index: 10;
  border-radius: 12px;
  border: none;
  outline: none;
}
#my_canvas {
  width: 100%;
  border-radius: 12px;
}
.wrapper {
  width: 320px;
  margin: 20px auto;
  overflow-x: hidden;
  overflow-y: hidden;
}
.img_group {
  width: auto;
  height: 3.5rem;
  padding: 10px 0;
}
.img_item {
  border: 1px solid #27ae60;
  padding: 5px;
  border-radius: 4px;
  margin-right: 10px;
  float: left;
  text-align: center;
  overflow: hidden;
  transition: 0.5s all ease;
}
.img_item.active {
  box-shadow: 5px 5px 10px #9e9e9e, -5px -5px 10px #ffffff;
}
.img_item:nth-last-child(1) {
  margin-right: 0px;
}
.img_item > img {
  width: 100%;
  position: relative;
}
.btn_group {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: 15px auto 40px auto;
  width: 310px;
}
.btn {
  display: inline-block;
  width: 100px;
  height: 35px;
  line-height: 35px;
  font-size: 18px;
  border-radius: 17.5px;
  background: #1abc9c;
  box-shadow: 5px 5px 10px #d4d4d4, -5px -5px 10px #ffffff;
  color: #fff;
  text-align: center;
  border-radius: 15px;
  transition: 0.1s all ease-in-out;
}
.tips_zone {
  font-size: 12px;
  color: #7f8c8d;
  text-align: center;
  margin-bottom: 10px;
}
</style>