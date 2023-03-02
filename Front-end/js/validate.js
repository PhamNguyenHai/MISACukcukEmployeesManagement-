// Thêm dấu * đỏ ở tên các trường cần
function AddrequiredFormInput(){
    var inputs = document.querySelectorAll('.form-input[rules]')
    for (const input of inputs) {
        if(input.getAttribute('rules').includes('required')){
            var labelName = input.parentElement.querySelector('label')
            labelName.innerHTML = `${labelName.innerText}<span style="color: red">*</span>`
        }
    }
}

// Define rules valildate
const validateObj = {
    required: function(value){
        return value? undefined : "Vui lòng nhập trường này"
    },
    name : function(value){
        return value.match(/^[a-zA-Z ]+$/) ? undefined : "Tên không hợp lệ"
    },
    employeeCode : function(value){
        return value.startsWith('NV') || value.startsWith('nv') ? undefined : "Mã nhân viên không hợp lệ"
    },
    email : function(value){
        return value.match(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/) ? undefined : "Email không hợp lệ"
    },
    identityNumber : function(value){
        return value.match(/^\d{10,12}$/) ? undefined : "Số CMND/CCCD không hợp lệ"
    },
    phoneNumber : function(value){
        return value.match(/^(?:\+84|0)(?:\d){9}$/) ? undefined : "Số điện thoại không hợp lệ"
    }
}

var formRules = {}
//Validate dữ liệu
function GetRuleValidation(){
    //get arr with each id and rules
    var inputs = document.querySelectorAll('.form-input[rules]')
    for (const input of inputs) {
        var RulesList = input.getAttribute('rules').split(' ')
        var RulesFunc = []
        for (const ruleItem of RulesList) {
            RulesFunc.push(validateObj[ruleItem])
        }
        formRules[input.getAttribute('id')] = RulesFunc 
    }
    
    // console.log(formRules)
}

function Validate(getRules){
    getRules()
    var inputs = document.querySelectorAll('.form-input[rules]')
    for (const input of inputs) {
        input.onblur = HandleError
        input.oninput = ClearError
    }
}

function HandleError(e){
    for (const rule in formRules) {
        if(formRules.hasOwnProperty(rule)){
            if(e.target.getAttribute('id') === rule){
                var errMessage = ''

                for (const ruleFunc of formRules[rule]) {
                    errMessage = ruleFunc(e.target.value)
                    if(errMessage)    break
                }
                
                if(errMessage){
                    e.target.parentElement.classList.add('invalid')
                    e.target.parentElement.querySelector('.error-message').innerText = errMessage
                }
                else{
                    e.target.parentElement.classList.remove('invalid')
                    e.target.parentElement.querySelector('.error-message').innerText = ""
                }
                break;
            }
        }
    }
}

function ClearError(e){
    if(e.target.parentElement.classList.contains('invalid')){
        e.target.parentElement.classList.remove('invalid')
        e.target.parentElement.querySelector('.error-message').innerText = ""
    }
}

//Khi click submit hiện hết lỗi lên => ở bên file main.js