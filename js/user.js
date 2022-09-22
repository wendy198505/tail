//注册登录验证的通用代码

/**
 * 创建构造函数
 */
class FieldValidator {
  //构造器
  /**
   * @param {string} txtId  表单中某一文本框id
   * @param {function} validatorFunc 验证规则回调函数，参数为该文本框的值，返回错误信息，如果没有返回则无错误
   */
  constructor(txtId, validatorFunc) {
    this.txtId = $("#" + txtId);
    this.p = this.txtId.nextElementSibling;
    this.validatorFunc = validatorFunc;
    //1元素失去焦点时验证，2点击【注册】按钮提交时需要验证.创建验证方法，其他时候需要验证时，直接调用验证方法即可
    this.txtId.onblur = () => {
      this.validate();
    };
  }

  /**
   *验证方法，实例方法
   * @returns {boolean} 有错误验证不通过，返回false，没有错误验证通过，返回ture
   */
  async validate() {
    //调用验证规则函数，传入当前文本框的值，把返回结果保存到err中
    const err = await this.validatorFunc(this.txtId.value);
    if (err) {
      //有错误，把返回的错误信息传递给p元素，显示在页面,并返回false
      this.p.innerText = err;
      return false;
    } else {
      this.p.innerText = "";
      return true;
    }
  }

  /**
   * 统一验证，静态方法，对传入的所有验证器统一验证
   * @param  {FieldValidator[]} validators
   * @returns {boolean} 所有验证均通过返回ture，否则返回false
   */
  static async validator(...validators) {
    //数组做map映射，每一项调用validate方法,返回promise
    const proms = validators.map((v) => v.validate());
    //等待proms全部完成,接收返回结果
    const result = await Promise.all(proms);
    //数组中的every方法，判断每一项是否符合要求，全是的话返回true,否则返回false
    return result.every((r) => r);
  }
}
