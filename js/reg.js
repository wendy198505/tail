//验证账号
const LoginIdValidate = new FieldValidator("txtLoginId", async function (val) {
  if (!val) {
    return "请输入账号";
  }
  //验证用户名是否存在
  const resp = await API.exists(val);
  if (resp.data) {
    return "账号已存在，请重新输入新的账号";
  }
});

//验证昵称
const NicknameValidate = new FieldValidator("txtNickname", function (val) {
  if (!val) {
    return "请输入昵称";
  }
});

//验证密码
const txtLoginPwdValidate = new FieldValidator("txtLoginPwd", function (val) {
  if (!val) {
    return "请输入密码";
  }
});

//验证确认密码
const pwdConfirmValidate = new FieldValidator("txtLoginPwdConfirm", function (
  val
) {
  if (!val) {
    return "请输入密码";
  }
  if (val !== txtLoginPwdValidate.txtId.value) {
    return "两次密码不正确，请重新输入";
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
    NicknameValidate,
    txtLoginPwdValidate,
    pwdConfirmValidate
  );
  //如果验证不通过，则返回
  if (!result) {
    return;
  }

  const formData = new FormData(form); //浏览器提供的构造函数，用于组装表单数据，传入一个表单dom，得到一个表单数据对象
  const data = Object.fromEntries(formData.entries()); //使用表单中的entries方法得到类似["a",1]["b",2]这样的数组，再使用Object的fromEntries方法，还原成对象如：{a:1,b:2}

  //验证通过，调用注册API
  const resp = await API.reg(data);
  //服务器的响应结果没有错误，验证成功，跳转到登录页面
  if (resp.code === 0) {
    alert("注册成功，点击确定，跳转到登录页");
    location.href = "./login.html";
  }
};
