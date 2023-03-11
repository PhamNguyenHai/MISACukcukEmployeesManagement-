function initEmployee(){
    changPage()
    filterChange()
    LoadDataTableAndEventWithRowEmployee()
    DeleteEmployee()
    showFormInsertEmployee()
    closeItem()
    RefreshTable()
    DuplicateEmployee()
    ValidateAllAndSubmitData()
}

let formMode = 'insert'
let CurentEditEmployeeID = ''

// Load table và đợi load hoàn toàn tr để bắt sự kiện với tr
function LoadDataTableAndEventWithRowEmployee(){
    // Lấy ra các thông tin filter để lọc nhân viên và phân trang
    let keyWorkFilter = document.getElementById('filter-text-input').value
    let positionFilter = document.getElementById('filter-cbb-position').value
    let departmentFilter = document.getElementById('filter-cbb-department').value
    let pageSize = document.getElementById('filter-employees-number').value
    let curentPage = document.querySelector('.current-page')

    // Hiển thị các thông số của bản ghi vào phần góc cuối bên trái 
    let recordBeginInPage = document.getElementById('record-begin-in-page')
    let recordEndInPage = document.getElementById('record-end-in-page')
    let totalRocords = document.getElementById('total-records')

    // Lức mới bắt đầu vào trang chưa tạo thanh phân trang thì mặc định curentPage = 1 để gọi API và tạo
    if(!curentPage){
        curentPage = 1
    }
    else
        curentPage = curentPage.innerText

    let tableFields = document.querySelectorAll('.content-table thead th')
    let tableBody = document.querySelector('.content-table tbody')
    tableBody.innerHTML = ""
    fetch(`https://localhost:44328/api/Employees/filter?keyWord=${keyWorkFilter}&positionID=${positionFilter}&departmentID=${departmentFilter}&pageNumber=${curentPage}&pageSize=${pageSize}`)
    .then(res=>res.json())
    .then(employees=>{
        if(employees.totalCount > 0){
            let tableFields = document.querySelectorAll('.content-table thead th')
            let tableBody = document.querySelector('.content-table tbody')
            employees.data.forEach(employee => {
                let tr = document.createElement('tr')
                let tds = ''
                tableFields.forEach(field=>{
                    // Lấy ra các tên trường dữ liệu
                    let fieldName = field.getAttribute('field')
                    let value = employee[fieldName]
                    if(value != null || value != undefined){
                        // format các trường dữ liệu để hiển thị
                        switch(fieldName) {
                            case 'employeeName':
                                value = Format.name(value)
                            break;
                            case 'gender':
                                value = Format.gender(value)
                            break;
                            case 'dateOfBirth':
                                value = Format.date(value)
                            break;
                            case 'salary':
                                value = Format.vietnameDong(value)
                            break;
                            case 'workStatus':
                                value = Format.workStatus(value)
                            break;
                        }
                    }
                    tds += `<td>${value || ""}</td>`
                })
                tr.innerHTML = tds
                tr.setAttribute('data-employee-id', employee.employeeID)
                tableBody.appendChild(tr)

                recordBeginInPage.innerText = (curentPage - 1) * pageSize + 1

                // Nếu tổng số lượng bản ghi nhỏ hơn số lượng chọn hiển thị thì hiển thị tổng số lượng bản ghi
                if((curentPage * pageSize) > employees.totalCount)
                    recordEndInPage.innerText = employees.totalCount 
                else 
                    recordEndInPage.innerText = curentPage * pageSize
                    
                totalRocords.innerText = employees.totalCount

            });

            // Thêm sự kiện cho các row đảm bảo tất cả các row loaded thì mới bắt sự kiện
            selectARow()
            showFormEditEmployee()
        }

        // Nếu tổng số bản ghi trả về là 0 thì hiển thị tất cả số 0
        else{
            recordBeginInPage.innerText = 0
            recordEndInPage.innerText = 0
            totalRocords.innerText = 0
        }
        //  Tạo thanh phân trang
        createPagination(Math.ceil(employees.totalCount/pageSize), curentPage)
    })
    .catch(err => {
        console.error(err)
        showDialog('danger', "Có lỗi xảy ra với hệ thống vui lòng thử lại sau", 1)
    });
}

// Bắt sự kiện với các filter để lọc và phân trang
function filterChange(){
    let inputFilters = document.querySelectorAll('.input-filter')
    inputFilters.forEach(filter=>{
        filter.onchange = LoadDataTableAndEventWithRowEmployee
    })
}


function changPage(){
    let navigation = document.querySelector('.navigation')
    navigation.onclick = function(e){
        // Bắt sự kiện khi e.target là các nút
        if(!e.target.classList.contains('navigation') && !e.target.classList.contains('space-page-btn')){
            LoadDataTableAndEventWithRowEmployee()
        }
    }
}

// Highline 1 dòng bằng click
function selectARow(){
    let trs = document.querySelectorAll('.content-table tbody tr')
    for (const tr of trs) {
         tr.addEventListener('click', HighlineARow)
    }
}

// Sự kiện highline sau khi click vào 1 dòng
function HighlineARow(e){
    let anotherRowSelected = document.querySelector('.content-table tbody tr.row-selected')
    let trElement = e.target.parentElement
    if(anotherRowSelected && anotherRowSelected !== trElement)
        anotherRowSelected.classList.remove('row-selected')
    trElement.classList.toggle('row-selected')
}

// Ham dung chung cho form insert & form edit (và duplicate - bản chất là insert)
function showFormEmployee(e){
    let formInputs = document.querySelectorAll('.form-input')

    // Focus vao input đầu tiên trong form
    formInputs[0].focus()
    for (const input of formInputs) {
        input.value = ""
    }

    let invalidInputs = document.querySelectorAll('.invalid')
    if(invalidInputs){
        for (const invalidInput of invalidInputs) {
            invalidInput.classList.remove('invalid')
            invalidInput.querySelector('.error-message').innerText = ""
        }
    }

    // insert hoặc duplicate đều có bản chất là insert
    if(e.target.classList.contains('insert-btn') || e.target.classList.contains('duplicate-btn')){
        formMode = 'insert'

        // Nếu button target là duplicate thì binding data lên
        if(e.target.classList.contains('duplicate-btn')){
            let employeeRowSelected = document.querySelector('.content-table tbody .row-selected')
            if(employeeRowSelected && employeeRowSelected.getAttribute('data-employee-id')){
                BindingEmployeeDataToForm(employeeRowSelected.getAttribute('data-employee-id'))
                showFormOnly()
            }
            else{
                showDialog('infor', 'Bạn chưa chọn nhân viên nào để nhân bản', 1)
            }
        }
        // Nếu là insert thì call API để lấy employee code và hiển thị lên input
        else{
            getNewEmployeeCode()
            showFormOnly()
        }
    }

    // nếu mode là edit thì call API binding dữ liệu lên form
    else{
        formMode = 'edit'
        //this : tr -> truyền vào Binding
        CurentEditEmployeeID =  this.getAttribute('data-employee-id')
        BindingEmployeeDataToForm(CurentEditEmployeeID)
        showFormOnly()
    }
}

// Goị API lấy EmployeeCode mới
function getNewEmployeeCode(){
    fetch('https://localhost:44328/api/Employees/NewEmployeeCode')
    .then(res=>res.text())
    .then(newEmployeeCode =>{
        document.getElementById('employeeCode').value = newEmployeeCode
    })
    .catch((err)=>console.log(err))
}

// Thực hiện format để binding lên form nếu là kiểu date
function BindingDateToForm(value){
    var date = new Date(value)
    var day = date.getDate()
    var month = date.getMonth() + 1
    day = day > 9 ? day : `0${day}`
    month = month > 9 ? month : `0${month}`
    return`${date.getFullYear()}-${month}-${day}`
}

// gọi API lấy thông tin nhân viên cụ thể và binding lên form
function BindingEmployeeDataToForm(employeeId){
    //row là tr được truyền vào
    fetch(`https://localhost:44328/api/Employees/${employeeId}`)
    .then(res=>res.json())
    .then(employee=>{
        let formInputs = document.querySelectorAll('.form-input')
        for (const formInput of formInputs) {
            let fieldInput = formInput.getAttribute('name')
            let result = employee[fieldInput]
            if(result != null || result != undefined){
                // Nếu là kiểu date thì gọi hàm để format và binding
                if(fieldInput === 'dateOfBirth' || fieldInput === 'identityIssuedDate' || fieldInput === 'joiningDate'){
                    result = BindingDateToForm(result)
                }
                formInput.value = result
            }
        }
    })
    .catch(err=> console.log(err))
}

function showFormInsertEmployee(){    
    //select nut insertbtn
    let insertButton = document.querySelector('.insert-btn')
    insertButton.onclick = showFormEmployee

}

function showFormEditEmployee(){
    let trs = document.querySelectorAll('.content-table tbody tr')
    for (const tr of trs){
        tr.ondblclick = showFormEmployee
    }
}

// Lấy dữ liệu từ form và tạo thành 1 obj để call API
function GetDataAndMakeEmployeeObj(){
    let formInputs = document.querySelectorAll('.form-input')
    let employeeDataForm = {}
    formInputs.forEach(formInput=>{
        if(formInput.value){
            employeeDataForm[formInput.getAttribute('name')] = formInput.value
            if(formInput.getAttribute('name') === "positionID")
                employeeDataForm.positionName = formInput[formInput.selectedIndex].text
            else if(formInput.getAttribute('name') === "departmentID")
                employeeDataForm.departmentName = formInput[formInput.selectedIndex].text
        }
    })
    return employeeDataForm
}

// Nút refresh
function RefreshTable(){
    let refreshBtn = document.querySelector('.refresh-btn')
    refreshBtn.onclick = LoadDataTableAndEventWithRowEmployee
}

// Nút nhân bản
function DuplicateEmployee(){
    let duplicateBtn =document.querySelector('.duplicate-btn')
    duplicateBtn.onclick = showFormEmployee
}

// Nút xóa
function DeleteEmployee(){
    let deleteBtn =document.querySelector('.delete-btn')
    deleteBtn.onclick = function(){
        let employeeRowSelected = document.querySelector('.content-table tbody .row-selected')
        if(employeeRowSelected && employeeRowSelected.getAttribute('data-employee-id')){
            let EmployeeCodeDelete = employeeRowSelected.querySelector('td').innerText
            showDialog('infor', `Bạn có chắc chắn muốn xóa nhân viên có mã ${EmployeeCodeDelete} không ?` , 2)
            let dialog = document.querySelector('.dialog')
            dialog.querySelector('.conform-btn').onclick = function(){
                fetch(`https://localhost:44328/api/Employees/${employeeRowSelected.getAttribute('data-employee-id')}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(res=>res.text())
                .then(data=>{
                    if(data === 'e01')
                        showDialog('error', 'Có lỗi xảy ra với thống vui lòng thử lại sau', 1)
                    else if(data === 'e02')
                        showDialog('error', 'Không tìm thấy mã nhân viên muốn xóa', 1)
                    else{
                        LoadDataTableAndEventWithRowEmployee()
                        showDialog('success', `Đã xóa thành công nhân viên có mã ${EmployeeCodeDelete}`, 1)
                    }
                })
                .catch(err=>{
                    console.log(err)
                })
            }
        }
        else
            showDialog('infor', 'Bạn chưa chọn nhân viên nào để xóa', 1)
    }
}

// Thực hiện gọi API và thêm mới nhân viên
function InsertEmployee(){
    // Lấy dữ liệu từ form input và tạo thành obj 
    let EmployeeData = GetDataAndMakeEmployeeObj()
    fetch('https://localhost:44328/api/Employees', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(EmployeeData)
    })
    .then(res=>res.text())
    .then(data =>{
        if(data ==='e02'){
            showDialog('danger', 'Mã nhân viên đã tồn tại', 1)
        }
        else if(data === 'e01' || data === 'e03'){
            showDialog('danger', 'Có lỗi phát sinh vui lòng thử lại', 1)
        }
        else{
            HideDialog()
            HideForm()
            LoadDataTableAndEventWithRowEmployee()
            showDialog('success', `Đã thêm thành công nhân viên có mã ${EmployeeData.employeeCode}`, 1)
        }
    })
    .catch(err=>{
        console.log(err)
    })
}

//Thực hiện gọi API và update
function UpdateEmploye(){
    // Lấy dữ liệu từ form input và tạo thành obj 
    let EmployeeData = GetDataAndMakeEmployeeObj()
    fetch(`https://localhost:44328/api/Employees/${CurentEditEmployeeID}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(EmployeeData)
    })
    .then(res=>res.text())
    .then(data =>{
        if(data === 'e01'){
            showDialog('danger', 'Có lỗi phát sinh vui lòng thử lại', 1)
        }
        else if(data ==='e02'){
            showDialog('danger', 'Không tồn tại mã nhân viên như bạn đã nhập', 1)
        }
        else if(data ==='e03'){
            showDialog('danger', 'Bạn đã cập nhật sang mã nhân viên đã tồn tại', 1)
        }
        else{
            HideDialog()
            HideForm()
            LoadDataTableAndEventWithRowEmployee()
            showDialog('success', `Đã cập nhật thành công nhân viên có mã ${EmployeeData.employeeCode}`, 1)
        }
    })
    .catch(err=>{
        console.log(err)
    })
}

// thực hiện Validate tất cả cá trường có yêu cầu và thực hiện submit dữ liệu
function SubmitData(){
    //Validate tất cả cá trường khi nhấn nút submit
    let formInputs = document.querySelectorAll('.form-input')
    formInputs.forEach(formInput=>{

        // Vì hàm HandleError cần truyền vào 1 và sử dụng target => tạo ra 1 đối tượng e ảo với target là formInput
        HandleError({target: formInput})
    })

    let isValid = document.querySelector('.invalid')
    if(!isValid){
        if(formMode === 'insert'){
            let dialog = document.querySelector('.dialog')
            showDialog('infor', 'Bạn có chắc chắn muốn thêm nhân viên mới ?', 2)
            dialog.querySelector('.conform-btn').onclick = InsertEmployee
        }
        else{
            let dialog = document.querySelector('.dialog')
            showDialog('infor', 'Bạn có chắc chắn muốn cập nhật thông tin nhân viên ?', 2)
            dialog.querySelector('.conform-btn').onclick = UpdateEmploye
        }
    }
}


function ValidateAllAndSubmitData(){
    let saveBtn = document.querySelector(".save-btn")
    saveBtn.onclick = SubmitData
}