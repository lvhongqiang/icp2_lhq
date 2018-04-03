
function check() {
	this.pass = true;
	this.showAll = true;
	this.alert = false;
	this.message = "";

	this.first = null;
	this.cancel = false;
	var aUsage = {
		"int" : "^([+-]?)\\d+$", // 整数
		"int+" : "^([+]?)\\d+$", // 正整数
		"int-" : "^-\\d+$", // 负整数
		"num" : "^([+-]?)\\d*\\.?\\d+$", // 数字
		"num+" : "^([+]?)\\d*\\.?\\d+$", // 正数
		"num-" : "^-\\d*\\.?\\d+$", // 负数
		"float" : "^([+-]?)\\d*\\.\\d+$", // 浮点数
		"float+" : "^([+]?)\\d*\\.\\d+$", // 正浮点数
		"float-" : "^-\\d*\\.\\d+$", // 负浮点数
		"email" : "^\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+$",// 邮件
		"color" : "^#[a-fA-F0-9]{6}", // 颜色
		"url" : "^http[s]?://([\\w-]+\\.)+[\\w-]+([\\w-./?%&=]*)?$", // 联接
		"chinese" : "^[\\u4E00-\\u9FA5\\uF900-\\uFA2D]+$", // 仅中文
		"ascii" : "^[\\x00-\\xFF]+$", // 仅ACSII字符
		"zipcode" : "^\\d{6}$", // 邮编
		"mobile" : "^0{0,1}1[0-9]{10}$", // 手机
		"ip4" : "^(([0-1]?\\d{0,2})|(2[0-5]{0,2}))\\.(([0-1]?\\d{0,2})|(2[0-5]{0,2}))\\.(([0-1]?\\d{0,2})|(2[0-5]{0,2}))\\.(([0-1]?\\d{0,2})|(2[0-5]{0,2}))$", // ip地址
		"notempty" : "^([\s| ]*[^ ]*)*[^ ]+([\s| ]*[^ ]*)*$", // 非空
		"picture" : "(.*)\\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$", // 图片
		"rar" : "(.*)\\.(rar|zip|7zip|tgz)$", // 压缩文件
		"date" : "^\\d{4}(\\-|///|/.)\\d{1,2}//1\\d{1,2}$" // 日期
	};

	// 缺省消息
	var aMessage = {
		"int" : "请输入整数", // 整数
		"int+" : "请输入正整数", // 正整数
		"int-" : "请输入负整数", // 负整数
		"num" : "请输入数字", // 数字
		"num+" : "请输入正数", // 正数
		"num-" : "请输入负整数", // 负数
		"float" : "请输入浮点数", // 浮点数
		"float+" : "请输入正浮点数", // 正浮点数
		"float-" : "请输入负浮点数", // 负浮点数
		"email" : "请输入正确的邮箱地址", // 邮件
		"color" : "请输入正确的颜色", // 颜色
		"url" : "请输入正确的连接地址", // 联接
		"chinese" : "请输入中文", // 中文
		"ascii" : "请输入ascii字符", // 仅ACSII字符
		"zipcode" : "请输入正确的邮政编码", // 邮编
		"mobile" : "请输入正确的手机号码", // 手机
		"ip4" : "请输入正确的IP地址", // ip地址
		"notempty" : "必填项不能为空", // 非空
		"picture" : "请选择图片", // 图片
		"rar" : "请输入压缩文件", // 压缩文件
		"date" : "请输入正确的日期" // 日期
	}
	var me = this;

	me.checkForm = function(oForm) {
		me.pass = true;
		me.message = "";
		me.first = null;

		if (me.cancel == true) {
			return true;
		}

		var els = oForm.elements;
		// 遍历所有表元素
		for ( var i = 0; i < els.length; i++) {
			// 取得格式
			var sUsage = els[i].getAttribute("Usage");
                var sReg = "";

                // 如果设置Usage，则使用内置正则表达式，忽略Exp
                if (typeof (sUsage) != "undefined" && sUsage != null) {
                	var sUsages = sUsage.split(" ");
                    for (var j = 0; j < sUsages.length; j++) {
                    	sUsage=sUsages[j];
                        // 如果Usage在表达室里找到，则使用内置表达式，无则认为是表达式；表达式可以是函数；
                        if (aUsage[sUsage] != null) {
                            sReg = aUsage[sUsage];
                        } else {
                            try {
                                if (eval(sUsage+'(els[i])') == false) {
                                    me.pass = false;
                                    if (me.first == null) {
                                        me.first = els[i];
                                    }

                                    addMessage(getMessage(els[i]));

                                    if (me.showAll == false) {
                                        setFocus(els[i]);
                                        break;
                                    }
                                }
                            } catch (e) {
                                alert("表达式[" + sUsage + "]错误:" + e.description)
                                return false;
                            }
                        }
                    }
                } else {
                    sReg = els[i].getAttribute("Exp");
                }

                if (typeof (sReg) != "undefined" && sReg != null) {
                    // 对于失效状态不验证
                    if (isDisabled(els[i]) == true) {
                        continue;
                    }

                    // 取得表单的值,用通用取值函数
                    var sVal = getValue(els[i]);
                    // 字符串->正则表达式,不区分大小写
                    var reg = new RegExp(sReg, "i");
                    if (!reg.test(sVal)) {
                        me.pass = false;
                        if (me.first == null) {
                            me.first = els[i];
                        }

                        // alert(reg);
                        // 验证不通过,弹出提示warning
                        var sTip = getMessage(els[i]);
                        if (sTip.length == 0 && typeof (sUsage) != "undefined"
                            && sUsage != null && aMessage[sUsage] != null) {
                            sTip = aMessage[sUsage];
                        }
                        addMessage(sTip);

                        if (me.showAll == false) {
                            // 该表单元素取得焦点,用通用返回函数
                            setFocus(els[i]);
                            break;
                        }
                    }
                }
            }


		if (me.pass == false) {
			showMessage();

			if (me.first != null && me.showAll == true) {
				setFocus(me.first);
			}
		}

		return me.pass;
	}

	/*
	 * 添加错误信息
	 */
	function addMessage(msg) {
		if (me.alert == true) {
			me.message += msg + "/n";
		} else {
			me.message += msg + "<br>";
		}
	}

	/*
	 * 显示错误
	 */
	function getMessage(els) {
		var sTip = els.getAttribute("tip");
		if (typeof (sTip) != "undefined" && sTip != null) {
			return sTip;
		} else {
			return "";
		}
	}

	/*
	 * 显示错误
	 */
	function showMessage() {
		// 外接显示错误函数
		if (typeof (me.showMessageEx) == "function") {
			return me.showMessageEx(me.message);
		}

		if (me.alert == true) {
			alert(me.message);
		} else {
			var divTip;
			divTip = document.getElementById("divErrorMessage");
			try {
				if (typeof (divTip) == "undefined" || divTip == null) {
					divTip = document.createElement("div");
					divTip.id = "divErrorMessage";
					divTip.name = "divErrorMessage";
					divTip.style.color = "red";
					document.body.appendChild(divTip);
				}

				divTip.innerHTML = me.message;
			} catch (e) {
			}
		}
	}

	/*
	 * 获得元素是否失效（失效的元素不做判断）
	 */
	function isDisabled(el) {
		// 对于radio,checkbox元素，只要其中有一个非失效元素就验证
		if (el.type == "radio" || el.type == "checkbox") {
			// 取得第一个元素的name,搜索这个元素组
			var tmpels = document.getElementsByName(el.name);
			for ( var i = 0; i < tmpels.length; i++) {
				if (tmpels[i].disabled == false) {
					return false;
				}
			}
			return true;
		} else {
			return el.disabled;
		}
	}

	/*
	 * 取得对象的值（对于单选多选框把其选择的个数作为需要验证的值）
	 */
	function getValue(el) {
		// 取得表单元素的类型
		var sType = el.type;
		switch (sType) {
		// 文本输入框,直接取值el.value
		case "text":
		case "hidden":
		case "password":
		case "file":
		case "textarea":
			return el.value;
			// 单多下拉菜单,遍历所有选项取得被选中的个数返回结果"0"表示选中一个，"00"表示选中两个
		case "checkbox":
		case "radio":
			return getRadioValue(el);
		case "select-one":
		case "select-multiple":
			return getSelectValue(el);
		}
		// 取得radio,checkbox的选中数,用"0"来表示选中的个数,我们写正则的时候就可以通过0{1,}来表示选中个数
		function getRadioValue(el) {
			var sValue = "";
			// 取得第一个元素的name,搜索这个元素组
			var tmpels = document.getElementsByName(el.name);
			for ( var i = 0; i < tmpels.length; i++) {
				if (tmpels[i].checked) {
					sValue += "0";
				}
			}
			return sValue;
		}
		// 取得select的选中数,用"0"来表示选中的个数,我们写正则的时候就可以通过0{1,}来表示选中个数
		function getSelectValue(el) {
			var sValue = "";
			for ( var i = 0; i < el.options.length; i++) {
				// 单选下拉框提示选项设置为value=""
				if (el.options[i].selected && el.options[i].value != "") {
					sValue += "0";
				}
			}
			return sValue;
		}
	}

	/*
	 * 对没有通过验证的元素设置焦点
	 */
	function setFocus(el) {
		// 取得表单元素的类型
		var sType = el.type;
		switch (sType) {
		// 文本输入框,光标定位在文本输入框的末尾
		case "text":
		case "hidden":
		case "password":
		case "file":
		case "textarea":
			try {
				el.focus();
				var rng = el.createTextRange();
				rng.collapse(false);
				rng.select();
			} catch (e) {
			}
			;
			break;

		// 单多选,第一选项非失效控件取得焦点
		case "checkbox":
		case "radio":
			var els = document.getElementsByName(el.name);
			for ( var i = 0; i < els.length; i++) {
				if (els[i].disabled == false) {
					els[i].focus();
					break;
				}
			}
			break;
		case "select-one":
		case "select-multiple":
			el.focus();
			break;
		}
	}

	// 自动绑定到所有form的onsubmit事件
	if (window.attachEvent) {
		window.attachEvent("onload", function() {
			for ( var i = 0; i < document.forms.length; i++) {
				var theFrom = document.forms[i];
				function mapping(f) {
					f.attachEvent("onsubmit", function() {
						return me.checkForm(f);
					});
				}

				if (theFrom) {
					mapping(theFrom);
					theFrom.attachEvent("onclick", function() {
						var o = event.srcElement;
						if (typeof (o.type) != "undefined") {
							var check = o.getAttribute("check");
							if (typeof (check) != "undefined" && check != null
									&& check.toLowerCase() == "false") {
								me.cancel = true;
							}
						}
					});
				}
			}
		});

	} else {
		window.onsubmit = function(e) {
			var theFrom = e.target;
			if (theFrom) {
				return me.checkForm(theFrom);
			}
		}
		window.addEventListener("click", function(e) {
			var o = e.target;
			if (typeof (o.type) != "undefined") {
				var check = o.getAttribute("check");
				if (typeof (check) != "undefined" && check != null
						&& check.toLowerCase() == "false") {
					me.cancel = true;
				}
			}
		}, false);

	}

    function exist(els) {
		var result = true;
        var value = getValue(els);
        if(result!=''){
            $.ajax({
                type: "json",
                url: 'exist?t='+value,
                async: false,
                success: function (data) {
                    if(data==1){
                        result = false;
                    }
                }
            });
		}
		return result;
    }

	this.check = function(form_id) {

	}
}