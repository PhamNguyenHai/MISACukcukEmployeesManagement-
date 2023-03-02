(function initEvent(){
    loadDepartmentComboboxs()
    loadPositionComboboxs()
    AddrequiredFormInput()
    Validate(GetRuleValidation)
    initEmployee()
})()

//Load 2 combobox department - ở trang chủ và ở form
function loadDepartmentComboboxs(){
    fetch('https://localhost:44328/api/Departments')
    .then(res=>res.json())
    .then(departments =>{
        let departmentComboboxs = document.querySelectorAll('select.department-combobox')
        var optionElement = '<option value="">--- Chọn phòng ban ---</option>'
        for (const department of departments)
            optionElement += `<option value="${department.departmentID}">${department.departmentName}</option>`
        for (const departmentcbb of departmentComboboxs) {
            departmentcbb.innerHTML = optionElement
        }
    })
    .catch((err)=>console.log(err))
}

//Load 2 combobox position - ở trang chủ và ở form
function loadPositionComboboxs(){
    fetch('https://localhost:44328/api/Positions')
    .then(res=>res.json())
    .then(positions =>{
        let positionComboboxs = document.querySelectorAll('select.position-combobox')
        var optionElement = '<option value="">--- Chọn vị trí ---</option>'
        for (const position of positions)
            optionElement += `<option value="${position.positionID}">${position.positionName}</option>`
        for (const positioncbb of positionComboboxs) {
            positioncbb.innerHTML = optionElement
        }
    })
    .catch((err)=>console.log(err))
}

// show dialog - hàm dùng lại
function showDialog(type="infor", message="", base=2){
    let dialog = document.querySelector('.dialog')
    if(dialog.classList.contains(`dialog--danger`))
        dialog.classList.remove(`dialog--danger`)
    else if(dialog.classList.contains(`dialog--infor`))
        dialog.classList.remove(`dialog--infor`)
    else
        dialog.classList.remove(`dialog--success`)

        dialog.classList.add(`dialog--${type}`)
    dialog.querySelector('.dialog-message').innerText = message
    if(base === 1){
        dialog.querySelector('.conform-btn').setAttribute('style', 'display:none')
        dialog.querySelector('.close-btn.cancel-btn').innerText = 'OK'
    }
    else{
        dialog.querySelector('.conform-btn').setAttribute('style', 'display:block')
        dialog.querySelector('.close-btn.cancel-btn').innerText = 'Huỷ'
    }
    dialog.setAttribute('style', 'display: block')
    dialog.parentElement.setAttribute('style', 'display: block')
}

// Thực hiện show form lên
function showFormOnly(){
    document.querySelector('.form-ovelay').setAttribute('style', 'display: block')
    document.querySelector('.form').setAttribute('style', 'display: block')
}

// Hàm hide dialog - dùng lại 
function HideDialog(){
    let dialog = document.querySelector('.dialog')
    dialog.setAttribute('style', 'display: none')
    dialog.parentElement.setAttribute('style', 'display: none')
}

// Hàm hide form - dùng lại - ẩn form sau khi submit
function HideForm(){
    let form = document.querySelector('.form')
    form.setAttribute('style', 'display: none')
    form.parentElement.setAttribute('style', 'display: none')
}

// Đóng 1 item bằng dấu X hoặc hủy
function closeItem(){
    let closeButtons = document.querySelectorAll('.close-btn')
    for (const closebtn of closeButtons) {
        closebtn.onclick = function(){
            parentE = this.parentElement.parentElement
            parentE.setAttribute('style', 'display: none')
            parentE.parentElement.setAttribute('style', 'display: none')
        }
    }
}