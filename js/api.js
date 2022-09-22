var API = (function () {
  const BASE_URL = "https://study.duyiedu.com";
  const TOKEN_KEY = "token";

  //   //注册接口函数
  //   async function reg(userinfo) {
  //     //发出请求
  //     const resp = await fetch(BASE_URL + "/api/user/reg", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       //把用户对象解析成json格式
  //       body: JSON.stringify(userinfo),
  //     });
  //     //等待解析响应体，解析完成拿到响应结果并返回
  //     return await resp.json();
  //   }

  //   //登录接口函数
  //   async function login(loginInfo) {
  //     //发出请求
  //     const resp = await fetch(BASE_URL + "/api/user/login", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       //把用户对象解析成json格式
  //       body: JSON.stringify(loginInfo),
  //     });
  //     //等待解析响应体，解析完成拿到响应结果保存到result中
  //     const result = await resp.json();
  //     //登录成功,拿到响应头令牌token，保存到localStorage中
  //     if (result.code === 0) {
  //       const token = resp.headers.get("authorization");
  //       localStorage.setItem(TOKEN_KEY, token);
  //     }
  //     //登录失败，直接返回
  //     return result;
  //   }

  //其他所有接口只要发现localStorage中有token,就把它附加到请求头中，请求时带上token，因此每个接口函数的请求头中都需要判断下有没有token，所以对fetch函数可以进行二次封装

  //get函数
  async function get(path) {
    //把令牌token值加入到请求头，因为不确定有没有token，因此headers初始值为空，再做判断，有的话加入
    const headers = {};
    //通过localStorage拿到token
    const token = localStorage.getItem(TOKEN_KEY);
    //判断
    if (token) {
      //headers添加属性及token值
      headers.authorization = `Bearer ${token}`;
    }
    return fetch(BASE_URL + path, { headers });
  }

  //post函数
  async function post(path, bodyObj) {
    const headers = {
      "Content-Type": "application/json",
    };
    //通过localStorage拿到token
    const token = localStorage.getItem(TOKEN_KEY);
    //判断
    if (token) {
      //headers添加属性及token值
      headers.authorization = `Bearer ${token}`;
    }
    return fetch(BASE_URL + path, {
      headers,
      method: "POST",
      body: JSON.stringify(bodyObj),
    });
  }

  //接口函数
  //注册
  async function reg(userinfo) {
    const resp = await post("/api/user/reg", userinfo); //等待响应头传输完成
    return await resp.json(); //一边传输一边解析json格式，等待响应体传输完成，返回响应结果
  }

  //登录
  async function login(loginInfo) {
    const resp = await post("/api/user/login", loginInfo);
    const result = await resp.json();
    //登录成功，拿到响应头的token值，保存到localStorage中
    if (result.code === 0) {
      const token = resp.headers.get("authorization");
      localStorage.setItem(TOKEN_KEY, token);
    }
    return result;
  }

  //验证
  async function exists(loginId) {
    const resp = await get("/api/user/exists?loginId=" + loginId);
    return await resp.json();
  }
  //当前登录的信息
  async function profile() {
    const resp = await get("/api/user/profile");
    return await resp.json();
  }
  //发送聊天信息
  async function sendChat(content) {
    const resp = await post("/api/chat", { content });
    return await resp.json();
  }
  //获取聊天记录
  async function getHistory() {
    const resp = await get("/api/chat/history");
    return await resp.json();
  }
  //退出登录，删除localStorage的token
  function loginOut() {
    localStorage.removeItem(TOKEN_KEY);
  }
  return {
    reg,
    login,
    exists,
    profile,
    sendChat,
    getHistory,
    loginOut,
  };
})();
