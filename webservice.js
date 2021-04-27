


export function getMessages(token){
    return new Promise(function (resolve){
        fetch("https://api.edu.etherial.dev/apijsv2/messages",
            {
            headers: {
            'Authorization': 'Bearer '+ token,
            'Content-Type': 'application/x-www-form-urlencoded'},
            }
        ).then(function (response) {
        
            response.json().then(function (data) {     
                resolve(data)
            })
        })
    })
}

export function creatMessage(messageenter,token){
    return new Promise(function (resolve){
    fetch("https://api.edu.etherial.dev/apijsv2/messages",{ 
            method: "POST",
            body: "message=" + messageenter.value, 
            headers: {
            'Authorization': 'Bearer '+ token,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        }).then(function (){  
            resolve()
        })
    })
}

export function checkAccount(emailenter, passwordenter){
    return new Promise(function (resolve){
    fetch("https://api.edu.etherial.dev/apijsv2/auth",{ 
            method: "POST",
            body: "email=" + emailenter.value + "&password=" + passwordenter.value,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }, 
        }).then(function (response) {    
            response.json().then(function (data) {     
                resolve(data)
                
            })
        })
    })
}

export function deleteMessage(token, id){  
    fetch("https://api.edu.etherial.dev/apijsv2/messages/"+ id,{ 
        method: "DELETE",
        headers: {
        'Authorization': 'Bearer '+ token,
    },
    })
}

export function EditMessage(token, id, messageenter){  
    fetch("https://api.edu.etherial.dev/apijsv2/messages/"+ id,{ 
        method: "PUT",
        body: "message=" + messageenter,
        headers: {
        'Authorization': 'Bearer '+ token,
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    })
}