// IPTV Admin Panel
// Users Management System
// users.js Part 1


let users = [];


// Open Add User Popup

function openAddUser(){

    document.getElementById("userModal").style.display="flex";

}



// Close Popup

function closeUser(){

    document.getElementById("userModal").style.display="none";

}



// Save New User

function saveUser(){


    let name =
    document.getElementById("username").value;


    let email =
    document.getElementById("useremail").value;


    let mobile =
    document.getElementById("usermobile").value;


    let plan =
    document.getElementById("userplan").value;



    if(name=="" || email==""){

        alert("Please fill all details");

        return;

    }



    let user = {


        id: users.length + 1,

        name:name,

        email:email,

        mobile:mobile,

        plan:plan,

        status:"Active",

        expiry:"30 Days"


    };



    users.push(user);



    loadUsers();



    closeUser();



    clearForm();


}




// Load User Data In Table

function loadUsers(){


    let table = 
    document.getElementById("userTableBody");


    table.innerHTML="";



    users.forEach(function(user){



        let row = `


        <tr>


        <td>${user.id}</td>


        <td>${user.name}</td>


        <td>${user.email}</td>


        <td>${user.mobile}</td>


        <td>${user.plan}</td>


        <td>

        <span class="active">

        ${user.status}

        </span>

        </td>


        <td>${user.expiry}</td>


        <td>


        <button 
        class="edit-btn"
        onclick="editUser(${user.id})">

        Edit

        </button>



        <button 
        class="delete-btn"
        onclick="deleteUser(${user.id})">

        Delete

        </button>


        </td>


        </tr>



        `;



        table.innerHTML += row;



    });



}




// Clear Input Form

function clearForm(){


document.getElementById("username").value="";

document.getElementById("useremail").value="";

document.getElementById("usermobile").value="";


}



// Page Load

window.onload=function(){

    loadUsers();

};
// users.js Part 2
// Edit + Delete + Search + Local Storage


let editMode = false;
let editId = null;



// Edit User Function

function editUser(id){


    let user = users.find(
        u => u.id === id
    );


    if(!user){
        return;
    }



    editMode = true;

    editId = id;



    document.getElementById("username").value =
    user.name;


    document.getElementById("useremail").value =
    user.email;


    document.getElementById("usermobile").value =
    user.mobile;


    document.getElementById("userplan").value =
    user.plan;



    document.getElementById("userModal").style.display="flex";


}




// Update User Save System

function updateUser(){


    users = users.map(function(user){


        if(user.id === editId){


            user.name =
            document.getElementById("username").value;


            user.email =
            document.getElementById("useremail").value;


            user.mobile =
            document.getElementById("usermobile").value;


            user.plan =
            document.getElementById("userplan").value;


        }


        return user;


    });



    saveStorage();


    loadUsers();


    closeUser();


    editMode=false;

}




// Modify Save Button Function

let oldSaveUser = saveUser;


saveUser=function(){


    if(editMode){

        updateUser();

    }

    else{

        oldSaveUser();

        saveStorage();

    }


};




// Delete User

function deleteUser(id){


    let confirmDelete =
    confirm(
    "Delete this user?"
    );



    if(confirmDelete){


        users =
        users.filter(
        u => u.id !== id
        );


        saveStorage();


        loadUsers();


    }


}




// Search User

function searchUser(){


    let keyword =
    document.getElementById("searchBox")
    .value
    .toLowerCase();



    let table =
    document.getElementById("userTableBody");


    table.innerHTML="";



    users
    .filter(function(user){


        return (

        user.name.toLowerCase()
        .includes(keyword)

        ||

        user.email.toLowerCase()
        .includes(keyword)

        ||

        user.mobile.includes(keyword)

        );


    })

    .forEach(function(user){



        table.innerHTML += `


<tr>

<td>${user.id}</td>

<td>${user.name}</td>

<td>${user.email}</td>

<td>${user.mobile}</td>

<td>${user.plan}</td>

<td>
<span class="active">
${user.status}
</span>
</td>

<td>${user.expiry}</td>

<td>

<button 
class="edit-btn"
onclick="editUser(${user.id})">

Edit

</button>


<button 
class="delete-btn"
onclick="deleteUser(${user.id})">

Delete

</button>


</td>


</tr>


`;



    });



}




// Local Storage Save

function saveStorage(){


localStorage.setItem(
"iptv_users",
JSON.stringify(users)
);


}




// Load Saved Users

function loadStorage(){


let data =
localStorage.getItem(
"iptv_users"
);



if(data){

users =
JSON.parse(data);

}



loadUsers();


}



// Auto Load

window.addEventListener(
"load",
function(){

loadStorage();

});