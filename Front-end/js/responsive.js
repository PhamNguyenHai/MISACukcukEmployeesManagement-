function responsive(){
    let optionBtn = document.querySelector('.sidebar-header-option-icon')
    let sidebarCategoriesList = document.querySelector('.sidebar-categories-list')
    optionBtn.onclick = function(){
        sidebarCategoriesList.classList.toggle('sidebar-categories-list--mobile')
    }
}
responsive()