import * as API from './webservice.js'
const router = new Navigo('/');
let lastScrollTop =0
window.addEventListener('DOMContentLoaded', function(){     
    
    let divmessages = document.querySelector(".messages")
    let divconnexion = document.querySelector(".connexion")
    let divconnected = document.querySelector(".connected")
    let formconnexion = document.querySelector(".formconnect")
    let formbutton = document.querySelector(".button")
    let messageenter = document.querySelector(".message")
    let form = document.querySelector(".form")
    let emailenter = document.querySelector(".email")
    let passwordenter = document.querySelector(".password")
    let loading = document.querySelector(".loading")
    let disco = document.querySelector(".disco")
    let regmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    let regpass =/^((?=.*[\d])(?=.*[a-z])(?=.*[A-Z])|(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\d\s])|(?=.*[\d])(?=.*[A-Z])(?=.*[^\w\d\s])|(?=.*[\d])(?=.*[a-z])(?=.*[^\w\d\s])).{7,30}$/
    let regmessage = /^[a-zA-Z0-9]*$/
    let checkId = []
    let checkValue = []
    let users = []
    let checkAlready = 0
    let firstTimeReload = 0
    let lastmessage = ""
    let lastmessage2 = ""
    let keyfortab = ""

    router.on('/chat', function () {
        divconnexion.style.display ="none"
        divconnected.style.display ="block"
    });

    disco.addEventListener('click', function(){
        localStorage.clear()
        document.location.reload()
    })

    if(localStorage.getItem("token") != null){
        router.navigate('/chat');
    }

    formconnexion.addEventListener('submit', function (event){
        event.preventDefault()
        if(regmail.test(emailenter.value)){
            API.checkAccount(emailenter,passwordenter).then(function(data){
                if(data.hasOwnProperty("data")){
                    localStorage.setItem("token", data["data"]["token"])
                    localStorage.setItem("nickname", emailenter.value.split("@")[0])
                    divconnexion.style.display ="none"
                    loading.style.display ="block"
                    setTimeout(function(){
                        loading.style.display ="none"
                        router.navigate('/chat');
                        
                    }, 3000)
                }else{
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: 'Wrong password or email',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            })
        }else{
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Invalid password or email',
                showConfirmButton: false,
                timer: 1500
            })
        }
    })

    function lala(checkId){
        API.getMessages(localStorage.getItem("token")).then(function (data){
            for (const key2 in data['data']){
                if (!(checkId.includes(data['data'][key2]['id'])) && firstTimeReload == 1) {
                    checkId.push(data['data'][key2]['id'])
                    keyfortab = data['data'][key2]['id']
                    checkValue.push({
                        keyfortab : data['data'][key2]['message']
                    })
                }
                if(!(users.includes(data['data'][key2]['nickname']))){
                    users.push(data['data'][key2]['nickname'])
                }
            }
            if (firstTimeReload == 1) {
                checkbox()
            }
            
            for (const key in data['data'].reverse()){
                if(!(checkId.includes(data['data'][key]['id'])) || checkAlready == 1){
                    let div = document.createElement("div")
                    let nicknamefield = document.createElement("span")
                    let datefield = document.createElement("span")
                    let datefieldyear = document.createElement("span")
                    let messagefield = document.createElement("p")
                    
                    for (var i = 0; i < data['data'][key]['nickname'].length; i++) {
                        let span = document.createElement('span')
                        span.innerHTML = data['data'][key]['nickname'][i]
                        span.classList.add('lettre')
                        nicknamefield.appendChild(span)
                    }
                
                    messagefield.innerText = data['data'][key]['message']
                    datefield.innerText = data['data'][key]['createdAt'].substr(0,9)
                    datefieldyear.innerText = data['data'][key]['createdAt'].substr(11,8)
                    
                    div.classList.add("message123")
                    if(localStorage.getItem('nickname') == data['data'][key]['nickname']){
                        div.classList.add("messageUser")
                        div.classList.add("if"+data['data'][key]['id'])
                        nicknamefield.innerText = ""
                        lastmessage = "id"+data['data'][key]['id']
                        lastmessage2 = "if"+data['data'][key]['id']
                        messagefield.classList.add("id"+data['data'][key]['id'])
                        let vous = "Vous"
                        for (var i = 0; i < vous.length; i++) {
                            let span = document.createElement('span')
                            span.innerHTML = vous[i]
                            span.classList.add('lettre')
                            nicknamefield.appendChild(span)
                        }
                        let buttonMessage = document.createElement("button")
                        let numMessage = document.createElement("button")
                        numMessage.innerHTML = data['data'][key]['id']
                        numMessage.classList.add('buttonnum')
                        buttonMessage.classList.add('buttonedit')
                        buttonMessage.classList.add('buttondelete')
                        buttonMessage.innerHTML = "Delete"

                        buttonMessage.addEventListener('click', function (){
                            API.deleteMessage(localStorage.getItem("token"), buttonMessage.value)
                            div.remove()
                        })
                        div.appendChild(buttonMessage).value = data['data'][key]['id']
                        div.appendChild(numMessage).value = data['data'][key]['id']

                        let buttonEditMessage = document.createElement("button")
                        buttonEditMessage.classList.add('buttonedit')
                        buttonEditMessage.innerHTML = "Edit"
                        buttonEditMessage.addEventListener('click', function (){
                            // let date = new Date;
                            // date.setTime(result_from_Date_getTime);
                            // let seconds = date.getSeconds();
                            // let minutes = date.getMinutes();
                            Swal.fire({
                                title: 'Edit your message',
                                input: 'text',
                                inputValue:data['data'][key]['message'],
                                confirmButtonText: 'Edit',
                                showCancelButton: true,
                            }).then((result)=>{
                                if (result.isConfirmed) {
                                    API.EditMessage(localStorage.getItem("token"),data['data'][key]['id'],result.value)
                                    messagefield.innerText = result.value
                                }
                            })
                        })
                        div.appendChild(buttonEditMessage).value = data['data'][key]['id']
                    }

                    divmessages.appendChild(div)
                    
                    div.appendChild(nicknamefield)
                    nicknamefield.classList.add("content-nickname")
                    
                    div.appendChild(datefield)
                    datefield.classList.add("content-date")
                    div.appendChild(datefieldyear)
                    datefieldyear.classList.add("content-year")
                    div.appendChild(messagefield)
                    messagefield.classList.add("content-message")
                    div.dataset.name = data['data'][key]['nickname']

                    checkId.push(data['data'][key]['id'])
                   
                    keyfortab = data['data'][key]['id']
                    checkValue.push({
                        keyfortab : data['data'][key]['message']
                    })
              

                }
                for (let index = 0; index < checkValue.length; index++) {
                    if(data['data'][key]['id'] == checkValue[index]){
                        if(data['data'][key]['message'] != checkValue[key]["keyfortab"]){
                            messagefield.innerText = data['data'][key]['message']
                        }
                    }
                }
                
               
            }
        })
        checkAlready++
        firstTimeReload++
    }
    setInterval(() => {
        var x = document.querySelectorAll(".lettre");
        var i;
        for (i = 0; i < x.length; i++) {
            x[i].style.color = randomColor() 
        }
    }, 100);

    function checkbox(){
        let checkbox = document.querySelector('.checkbox')
        for (const value in users){
            let divcheckbox = document.createElement('div')
            divcheckbox.classList.add("checkboxdiv")
            let box = document.createElement('input')

            let boxText = document.createElement('label')
            box.id = 'box' + users[value]
            box.type = 'checkbox';
            box.setAttribute("value", users[value])
            boxText.innerHTML = users[value]
            boxText.htmlFor = box['id']
            checkbox.appendChild(divcheckbox)
            divcheckbox.appendChild(box)
            divcheckbox.appendChild(boxText)
            checkbox.style.display ="flex"
            boxText.style.cursor = "pointer"
            
            checkbox.style.color ="white"
            checkbox.style.fontWeight ="bold"
            box.style.display ="none"
            divcheckbox.style.display ="flex"
            divcheckbox.style.backgroundColor ="#7289da"
            divcheckbox.style.borderRadius ="30px"
            divcheckbox.style.margin ="5px"
            divcheckbox.style.padding ="5px"
            divcheckbox.addEventListener('click', function(){
                box.checked
            })
            box.addEventListener('change', function() {
                if (this.checked) {
                    divcheckbox.style.backgroundColor ="#ed4c4c"
                    var x = document.querySelectorAll(".message123");
                    var i;
                    for (i = 0; i < x.length; i++) {
                        if (box.value == x[i].dataset.name){
                            x[i].style.display = "none"
                        }
                    }
                } else {
                    divcheckbox.style.backgroundColor ="#7289da"
                    var x2 = document.querySelectorAll(".message123");
                    var i2;
                    for (i2 = 0; i2 < x2.length; i2++) {
                        if (box.value == x2[i2].dataset.name){
                            x2[i2].style.display = "flex"
                            x2[i2].style.flexDirection = "column"
                            window.scrollTo(0,document.body.scrollHeight);

                        }
                    }
                }
            });
        }
    }

    let checkScroll = 0
    window.addEventListener("scroll", function(){ 
        var st = window.pageYOffset || document.documentElement.scrollTop; 
        if (st > lastScrollTop){
            if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight) {
                checkScroll = 0
            }
        } else {
            checkScroll = 1
        }
        lastScrollTop = st <= 0 ? 0 : st;
    }, false);

    setInterval(() => {
        if(checkScroll == 0){
            window.scrollTo(0,document.body.scrollHeight);
        }
    }, 50);


    form.addEventListener("submit", function(event){
        event.preventDefault()
        if (messageenter.value.length > 2){
            if(messageenter.value.length < 200){
                API.creatMessage(messageenter,localStorage.getItem("token")).then(lala(checkId))
                lala(checkId)
            }else{
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Too long message',
                    showConfirmButton: false,
                    timer: 700
                })
            }
        }else{
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Too short message',
                showConfirmButton: false,
                timer: 700
            })
        }
        form.reset()
    })

    let konami = []
    let konamicheck = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a",]
    
    window.addEventListener('keydown', function(e){
        if(konami.length == 10){
            konami.splice(0, 1);
            konami.push(e['key'])
        }else{
            konami.push(e['key'])
        }
        if (JSON.stringify(konami) === JSON.stringify(konamicheck)){
            messageenter.value = "Le Ruby on rails est mon langage favoris"
            document.querySelector('.send').click()
        }
    })

    setInterval(function () {
        if(localStorage.getItem("token") != null){
            lala(checkId)

        }
    }, 500)

    if (annyang) {
        const commands = {
          'envoie *value': sendMessageWithVoice,
        }
        function sendMessageWithVoice(value){
            messageenter.value = value
            document.querySelector('.send').click()
          }
    setTimeout(() => {
        if(lastmessage !== ''){
            const commands2 = {
                'Modifie le dernier message en *value':sendMessageWithVoice2,
            }
            annyang.addCommands(commands2);
            function sendMessageWithVoice2(value){
                API.EditMessage(localStorage.getItem("token"),lastmessage.substr(2),value)
                document.querySelector("."+lastmessage).innerText = value
            }
            const commands3 = {
                'Supprimer mon dernier message':sendMessageWithVoice3,
            }
            annyang.addCommands(commands3);
            function sendMessageWithVoice3(){
                API.deleteMessage(localStorage.getItem("token"), lastmessage2.substr(2))
                document.querySelector('.'+lastmessage2).remove()
            }
        }
    }, 1000);
        const commands6 = {
            'Connecte-moi en tant que *value':(value)=>{
                if(preset.hasOwnProperty(value)){
                    emailenter.value = preset[value][0]
                    passwordenter.value = preset[value][1]
                    formbutton.click()

                }else{
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: 'This account does not exist',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            }
        }
        let preset = {
            'Vincent' : [
                'email',
                'password'
            ]
        }
        
        const commands5 = {
            'Déconnecte moi':()=>{
                localStorage.clear()
                document.location.reload()
            }
        }
        const commands4 = {
            'Recharge la page':()=>{
                document.location.reload()
            }
        }
        const commands7 = {
            'Monte de *value messages':(value)=>{
                if(/^\d{1,10}$/.test(value)){
                    window.scrollTo({top: window.pageYOffset - value*400, behavior: 'smooth'});
                }else{
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: 'Please enter a good format',
                        showConfirmButton: false,
                        timer: 1000
                    })
                }
            }
        }
        const commands8 = {
            'Reviens en bas':()=>{
                window.scrollTo(0,document.body.scrollHeight);
            }
        }

        const commands9 = {
            'Modifie le message *value en *value2':sendMessageWithVoice4,
        }
        annyang.addCommands(commands9);
        function sendMessageWithVoice4(value, value2){
          if(/^\S+$/.test(value)){  
                if(document.querySelector(".id"+value) != null){
                    API.EditMessage(localStorage.getItem("token"),value,value2)
                    document.querySelector(".id"+value).innerText = value2
                }
            }else{
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Please enter a good format',
                    showConfirmButton: false,
                    timer: 1000
                })
            }
        }
        const commands10 = {
            'Supprime mon dernier message':sendMessageWithVoice3,
        }
        annyang.addCommands(commands10);
        function sendMessageWithVoice3(){
            API.deleteMessage(localStorage.getItem("token"), lastmessage2.substr(2))
            document.querySelector('.'+lastmessage2).remove()
        }
        annyang.addCommands(commands);
        annyang.addCommands(commands5);
        annyang.addCommands(commands7);
        annyang.addCommands(commands8);
        annyang.addCommands(commands6);
        annyang.addCommands(commands4);
        annyang.setLanguage("fr-FR")
        annyang.start();
      }
})

// setattribute

// 36544