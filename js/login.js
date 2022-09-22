//验证账号
const LoginIdValidate = new FieldValidator("txtLoginId", async function (val) {
  if (!val) {
    return "请输入账号";
  }
});

//验证密码
const txtLoginPwdValidate = new FieldValidator("txtLoginPwd", function (val) {
  if (!val) {
    return "请输入密码";
  }
});

//找到表单元素
const form = $(".user-form");
//表单注册提交事件
form.onsubmit = async function (e) {
  //阻止默认提交事件
  e.preventDefault();
  //统一验证，返回结果保存到result中
  const result = await FieldValidator.validator(
    LoginIdValidate,
    txtLoginPwdValidate
  );
  //如果验证不通过，则返回
  if (!result) {
    return;
  }

  const formData = new FormData(form); //浏览器提供的构造函数，用于组装表单数据，传入一个表单dom，得到一个表单数据对象
  const data = Object.fromEntries(formData.entries()); //使用表单中的entries方法得到类似["a",1]["b",2]这样的数组，再使用Object的fromEntries方法，还原成对象如：{a:1,b:2}

  //验证通过，调用登录API
  const resp = await API.login(data);
  //服务器的响应结果没有错误，验证成功，跳转到首页
  if (resp.code === 0) {
    alert("登录成功，点击确定，跳转到首页");
    location.href = "./index.html";
  } else {
    LoginIdValidate.p.innerText = "账号或密码错误";
    txtLoginPwdValidate.txtId.value = "";
  }
};
