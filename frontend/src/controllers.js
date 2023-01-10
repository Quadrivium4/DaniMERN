
const login = async(email,password) => {
    console.log("hello");
    /*const data = await fetch("https://dani-courses.onrender.com/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            password
        })
    })
    .then(res => res.json());
    
    console.log(data);*/
    let data = await fetch("https://dani-courses.onrender.com/store").then(res=>res.json());
    return data;
           /* console.log(data)
            if (data.ok) {
                if(data.role === "admin"){
                    location.replace("./admin/index.html");
                }else{
                    location.replace("./user/dashboard.html");
                }
                localStorage.setItem("loggedIn", true);
                message(data.message, "success")
            } else {
                message(data.message, "failure")
            }

        }).catch((err) => {
            console.log(err);
        })*/
}
/*
function register(name, email, password) {
    fetch("/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name,
            email,
            password
        })
    }).then(res => res.json()).then((data) => {
        console.log(data)
        if (data.ok) {
            message(data.message, "success")
        } else {
            message(data.message, "failure")
        }
    }).catch(error => {
        alert("ther was an error!")
        console.log(error)
    })
}

function logout() {
    fetch("/logout").then(res => res.json()).then((data) => {
        message(data.message, "success");
        localStorage.setItem("loggedIn", false)
    }).catch(error => {
        message(data.message, "failure")
        console.log(error)
    })
}
*/
export {
    login,
    /*register,
    logout*/
}