let Format = {
    name: function(name){
        name = name.trim();
    
        while(name.indexOf("  ") != -1){
            name = name.replace("  ", ' ');
        }
        
        var Words = name.split(" ")
        
        for(var i=0; i<Words.length; i++){
            Words[i] = Words[i].slice(0, 1).toLocaleUpperCase() + Words[i].slice(1).toLocaleLowerCase()
        }
        
        name = Words.join(" ")
        return name
    },
    gender: function(gender){
        return gender === 0 ? "Nam" : gender === 1 ? "Nữ" : "Khác"
    },
    date: function(value){
        var date = new Date(value)
    var day = date.getDate()
    var month = date.getMonth() + 1

    day = day > 9 ? day : `0${day}`
    month = date.getMonth() + 1 > 9 ? month : `0${month}`

    return `${day}/${month}/${date.getFullYear()}`
    },
    vietnameDong: function(value){
        return value ? value.toLocaleString('vi', {style : 'currency', currency : 'VND'}) : null
    },
    workStatus: function(value){
        // return value === 0 ? "Đã nghỉ" : value === 1 ? "Đang làm" : "Thử việc"
        return value === 0 ? "Đã nghỉ" : value === 1 ? "Đang làm" : "Thử việc"
    }
}