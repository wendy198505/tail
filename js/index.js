//验证是否有登录，如果没有登录，跳转到登录页，如果有登录，获取到用户的登录信息

(async function () {
  //调用当前登录信息接口，根据返回的数据判断有无登录
  const resp = await API.profile();
  const respData = resp.data;
  console.log(respData);
  if (!respData) {
    alert("未登录或登录已过期，请重新登录");
    location.href = "./login.html";
    return;
  }

  //登录后的状态

  //获取dom元素
  const doms = {
    aside: {
      nickname: $("#nickname"),
      loginId: $("#loginId"),
    },
    close: $(".close"),
    form: $(".msg-container"),
    txtMsg: $("#txtMsg"),
    chatContainer: $(".chat-container"),
  };
  //设置用户信息
  function setUser() {
    doms.aside.nickname.innerText = respData.nickname;
    doms.aside.loginId.innerText = respData.loginId;
  }
  setUser();

  //关闭按钮,调用退出登录按钮
  doms.close.addEventListener("click", function () {
    API.loginOut();
    location.href = "./login.html";
  });

  //调用接口，获取聊天记录
  async function history() {
    const resp = await API.getHistory();
    console.log(resp);
    //把每一项数据添加到页面中显示
    for (const item of resp.data) {
      addChat(item);
    }
    //滚动到底部
    scollBtm();
  }
  history();

  //根据响应的消息对象，添加到页面
  /*
  content: "你叫什么名字"
  createdAt: 1663060697359
  from: "wangyusi"
  to: null
  _id: "63204ad9632c21328811f3e8"
   */
  function addChat(chatInfo) {
    const chatContainer = $(".chat-container");
    const chatItem = $$$("div");
    chatItem.className = "chat-item";
    if (chatInfo.from) {
      chatItem.classList.add("me");
    }

    const img = $$$("img");
    img.className = "chat-avatar";
    img.src = chatInfo.from ? "./asset/avatar.png" : "./asset/robot-avatar.jpg";

    const chatContent = $$$("div");
    chatContent.innerText = chatInfo.content;
    chatContent.className = "chat-content";

    const chatDate = $$$("div");
    chatDate.className = "chat-date";
    chatDate.innerText = dateFormat(chatInfo.createdAt);

    //加入页面
    chatItem.appendChild(img);
    chatItem.appendChild(chatContent);
    chatItem.appendChild(chatDate);
    chatContainer.appendChild(chatItem);
  }

  //时间格式函数
  function dateFormat(timeInfo) {
    const date = new Date(timeInfo);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hh = date.getHours().toString().padStart(2, "0");
    const mm = date.getMinutes().toString().padStart(2, "0");
    const ss = date.getSeconds().toString().padStart(2, "0");
    return `${year}-${month}-${day} ${hh}:${mm}:${ss}`;
  }

  //注册发送消息事件
  doms.form.onsubmit = async function (e) {
    e.preventDefault();
    sendChatInfo();
  };

  //发送消息函数
  async function sendChatInfo() {
    //获取发送文本框中的值
    const content = doms.txtMsg.value;
    //如果发送内容为空，返回
    if (!content) {
      return;
    }
    //为了更好的客户体验，首先把发送内容显示在聊天框中
    addChat({
      content,
      createdAt: Date.now(),
      from: respData.loginId,
      to: null,
    });
    //滚动到底部
    scollBtm();
    //清空发送文本框
    doms.txtMsg.value = "";
    //调用接口，发送聊天信息
    const resp = await API.sendChat(content);
    //得到服务器响应,显示到聊天框
    addChat({
      from: null,
      to: respData.loginId,
      //展开data数组的其他项
      ...resp.data,
    });
    //滚动到底部
    scollBtm();
  }

  //聊天框滚动条回到底部函数
  function scollBtm() {
    //得到聊天框的高度
    const chatHeight = doms.chatContainer.scrollHeight;
    doms.chatContainer.scrollTop = chatHeight;
  }
})();
