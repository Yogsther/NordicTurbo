var socket = io.connect("http://213.66.254.63:25565");


/*

Old signup, not used.

// Signup funcitons
var errorMessage;
onOpenSignup();

function onOpenSignup(){
    var persID = readCookie("persID");
    var persIDplusText = "Personal ID - " + persID;
    document.getElementById("persIDSignup").value = persIDplusText;
}

// Signup regex check
function regexSignupCheck(){
    console.log("!");
    var text = document.getElementById("username").value;
    var edit = text.replace(/[^A-Za-z0-9]/g, "");
    document.getElementById("username").value = edit;
}

// Send signup request
function checkInputs(){

    // Get varibales from form
    var persID = readCookie("persID");
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var confPassword = document.getElementById("password_confirmed").value;

    // Check for problems in input values

    if(document.getElementById("checkbox_warning").checked == false){
        showError("You have to agree to the EULA to sign up!");
        return;
    }

    if(persID == null){
        showError("No personal ID, please go back to Notu.co and then try again.");
        return;
    }

    if(username == "" || password == "" || confPassword == ""){
        showError("Missing informations, all slots need to be filled.");
        return;
    }
    if(username.indexOf("<") != -1){
        showError("HTML tags are not allowed in username.");
    }
    if(password !== confPassword){
        showError("Passwords need to match");
        return;
    }
    if(username.length > 20 || password.length > 20){
        showError("Your password is too long.");
        return;
    }
    if(username.length < 3){
        showError("Username must be at least 3 characters.");
        return;
    }
    if(password.length < 3){
        showError("Password must be at least 3 characters.");
        return;
    }

    // Everything checks out, proceed to register user.
    showError("clear");


    // Send over data to the server with a request to register new user

    socket.emit("signupReq", {

        username: username,
        password: password,
        persID: persID

    });



}

socket.on("signup_success", function(){
    showError("clear");
    document.getElementById("success_msg").innerHTML = "Success! You are now signed up to Quick Draw. The game is not ready yet, but check back soon to play it!";

});

socket.on("callback_fail", function(err){

    console.log(err);
    showError(err);

});

function showError(errMsg){
    if(errMsg == "clear"){
        document.getElementById("error_msg").innerHTML = "";
        return;
    }
    document.getElementById("error_msg").innerHTML = "Error: " + errMsg;
}

*/

// All items
var items = [{
    name: "Hat 01",
    src: "hat01",
    cost: 20,
    type: "hat"
},{
    name: "Wizard 01",
    src: "wizard01",
    cost: 50,
    type: "hat"
}];


var unlockedItems = ["hat01"];

// Item loader
function loadItems(){
    document.getElementById("items_select").innerHTML = "";
    var i = 0;
    while(i < items.length){
        if(unlockedItems.indexOf(items[i].src) != -1){
            // Item is unlocked
        document.getElementById("items_select").innerHTML += '<div id="' + items[i].src + '" class="item" onclick="itemAction(this.id)" title="' + items[i].name + '"><img src="hats/' + items[i].src + '.png" class="item_img"> </div>';
        i++;    
        } else {
            // Item is locked
        document.getElementById("items_select").innerHTML += '<div id="' + items[i].src + '" class="item" onclick="itemAction(this.id)" title="' + items[i].name + '"> <span class="item_cost"> ' + items[i].cost +'</span> <img src="hats/' + items[i].src + '.png" class="item_img"> <img src="src/lock.png" class="lock"></div>';
        i++;
        }    
    }     
}


var gold;
var cp;
var id = readCookie("persID");

function reloadStats(){
    socket.emit("getProfile_quickdraw", id);
}

function loadProfile(profile){
    cp = profile[0];
    gold = profile[1];
    
    document.getElementById("insert_rank").innerHTML = cp;
    document.getElementById("insert_gold").innerHTML = gold;
    
    var i = 2;
    unlockedItems = ["hat01"];
    while(profile[i] != null){
        unlockedItems.push(profile[i]);
        i++;
    }
}

function itemAction(name){
    var itemUnlockedPos = unlockedItems.indexOf(name);
    var itemPos = items.findIndex(i => i.src === name);
    var type = items[itemPos].type;
     
    if(type == "hat"){
        // Item is of type Hat
    if(itemUnlockedPos != -1){
        // Item is unlocked, and will be choosed.
        createCookie("qd_hat", name, 10000);
        console.log("Selected skin/hat " + name
                    readlo
        }
    if(itemUnlockedPos == -1){
        // Item is not unlocked, and will try to purchase through server.
        // Check if user can buy it (client side) this is also done serverside for extra security.
        if(gold >= items[itemPos].cost){
        // Confirm that you want to buy it (missclick)
        if(confirm("Are you sure you want to purchase " + items[itemPos].name + " for " + items[itemPos].cost + " gold?")){
            socket.emit("qd_item", {
                src: items[itemPos].src,
                id: id
            });
            //window.location.reload(false);
            reloadStats();
        } else {
            // User decliened purchase.
            return;
                }
            }console.log("Not enough funds.");
        } 
    }
}

//Check if user is new, if so register user.
validate();

function validate(){
    var id = readCookie("persID");
    socket.emit("validate", id);
}

function join(){
    // Register function for quickdraw
    var id = readCookie("persID");
    socket.emit("quickdraw_join", id);
    
}

socket.on("validate_callback", function(call){
    var id = readCookie("persID");
    if(call == "failed"){
        
       document.body.innerHTML = '<img src="src/quickdraw_logo.png" id="header_logo"> <div id="signup_div"> Welcome to Quickdraw, looks like you are new! <br><br> Quick draw is a competitive standoff game in early access. <button id="join_button" onclick="join()">Join!</button> <script src="quickdraw.js"></script> </div>';
        console.log("Not found");
    }
    if(call == "valid"){
        //TODO Insert body on load
        socket.emit("getProfile_quickdraw", id);
        var selectedSkin = readCookie("qd_skin");
        var selectedHat = readCookie("qd_hat");
        if(selectedHat == null || selectedSkin == null){
            createCookie("qd_skin", "skin01", 10000);
            createCookie("qd_hat", "hat01", 10000);
        }
       
    }
});

socket.on("profile_callback", function(profile){
    loadProfile(profile);
    loadItems();
});


// Quickdraw game





// Setup canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
// Remove pixelation.
ctx.imageSmoothingEnabled = false;

// Declare image sources
var gameBG = new Image();
    gameBG.src = "src/bg.png";

var menuLogo = new Image();
    menuLogo.src = "src/quickdraw_logo_big.png"

// Decalare skins
var skin01 = new Image();
    skin01.src = "skins/skin01.png"

// Declare hats
var hat01 = new Image();
    hat01.src = "hats/hat01.png"


var player1 = {
    skin: "skin01",
    hat: "hat01"
}

var player2 = {
    skin: "skin01",
    hat: "hat01"
}

var player1Pos = {
    x: 80,
    y: 180
}
    
var player2Pos = {
    x: 470,
    y: 180
}

var draw = "menu";
// states, menu - game - ?


// hDraw game
function drawGame(){
    
    // Draw background image
    ctx.drawImage(gameBG, 0, 0);

    
    // Player one
    // Draw player one skin
    ctx.drawImage(eval(player1.skin), player1Pos.x, player1Pos.y, 64, 82);
    // Draw player one hat
    ctx.drawImage(eval(player1.hat), (player1Pos.x - 17), (player1Pos.y - 31), 82, 114);
    
    // Player two
    
    // Flip context for reverse sprite
    // Draw player two skin
    ctx.scale(-1, 1);
    ctx.drawImage(eval(player2.skin), -player2Pos.x, player2Pos.y, 64, 82);
    // Draw player two hat
    ctx.drawImage(eval(player2.hat), -(player2Pos.x + 17), (player2Pos.y - 31), 82, 114);
    document.getElementById("search_game").innerHTML = "In Game";
    document.getElementById("search_game").style.background = "black";
    document.getElementById("search_game").disabled = true;
    
}


var logoPos = 200;

function drawMenu(){
    ctx.drawImage(gameBG, 0, 0);
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(menuLogo, 0, logoPos);
    if(logoPos > 0){
        logoPos = logoPos - 15;
    }
    document.getElementById("search_game").innerHTML = "Search Game";
    document.getElementById("search_game").style.background = "#40ef49";
    document.getElementById("search_game").disabled = false;
}

function drawSearching(){
    ctx.drawImage(gameBG, 0, 0);
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    document.getElementById("insert_search").innerHTML = '<img src="src/loading.gif" id="load_gif"><span id="searching_stats">Searching</span>';
    ctx.drawImage(menuLogo, 0, logoPos);
    if(logoPos < 200){
        logoPos = logoPos - 15;
    }
    document.getElementById("search_game").innerHTML = "Cancel Search";
    document.getElementById("search_game").style.background = "#ed3434";
    document.getElementById("search_game").disabled = false;
}

var searching = false;

function search(){
    
    if(searching == false){
        logoPos = 0;
        searching = true;
        
    } else {
        logoPos = 200;
        searching = false;
        document.getElementById("insert_search").innerHTML = '';
    }
}


render();

function render(){
    
    if(draw == "game"){
        drawGame();
    }
    if(draw == "menu"){
        drawMenu();
    }
    if(searching == true){
        drawSearching();
    }
    
    
    requestAnimationFrame(render);
}













var playStatus = "Quickdraw";


// On connection send over Username, ProfileLoc & Lvl

socket.on("login", function(request){

    if(request == "loginInfo"){

        var personalID = readCookie("persID");
        // Generate new personalID for new users.
        if(personalID == null){
            var newID = Math.floor(Math.random() * 999999999) + 1;
            createCookie("persID", newID, 10000);
            personalID = readCookie("persID");
        }

        console.log("Personal ID: " + personalID);


        var messageUsername = readCookie("username");
        var messageProfile = readCookie("profileLocation");
        var xp = (readCookie("xp") / 1000) + 1;
        xp = Math.floor(xp);


         socket.emit("sentover", {
            username: messageUsername,
            profilepic: messageProfile,
            xp: xp,
            id: socket.id,
            status: playStatus,
            persID: personalID
        });

        console.log("Sent over data");
    }
});






function createCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name,"",-1);
}
