let maincontent = document.getElementById("contents").innerHTML;
alert('Wellcom " ' + localStorage.getItem("name") + '"\nYou Are Loged-In To The Library As A User.');

document.getElementById("Uname").innerHTML = localStorage.getItem('name');
document.getElementById("Uid").innerHTML = localStorage.getItem('id');

function exit() {
    alert("Your Id - " + localStorage.getItem("id") + " Is Loged Out From The Library.");
    location.replace("index.html");
}

let setUserIssuedBooks = JSON.parse(localStorage.getItem('UserIssuedBooks'));

let setbook = JSON.parse(localStorage.getItem('books'));

let setavailableBook = JSON.parse(localStorage.getItem('availableBook'));


function showBooktable() {
    document.getElementById("contents").innerHTML = '<div id="tableDiv"><table id="Booktable"><tr><th>Book Name</th><th>No of Books</th></tr></table></div> <input type="button" value="<< BACK" class="Back" onclick="back()">';
    var MyTable = document.getElementById("Booktable");
    for (let i = 0; i < localStorage.getItem('noOfBooks'); i++) {
        var NewRow = MyTable.insertRow(i + 1);
        var Newcell1 = NewRow.insertCell(0);
        var Newcell2 = NewRow.insertCell(1);
        Newcell1.innerHTML = setbook[i]
        Newcell2.innerHTML = setavailableBook[i];
    }
}

function back() {
    document.getElementById("contents").innerHTML = maincontent;
}

function issuebook() {
    document.getElementById("contents").innerHTML = '<div id="issueDiv"> Enter Book Name: <input type="text" class="bookname" id="Ibookname" onblur="SaveIssueBookName()" spellcheck="false"><br><input type="button" value="ISSUE" class="Back" onclick="issue()"><br><fieldset class="message"> <legend><h4 class="msg">Message Box</h4></legend><p class="msg" id="Imessage">No Message For You !</p></fieldset></div> <input type="button" value="<< BACK" class="Back" onclick="back()">';
}

let issuedBookName = "";
function SaveIssueBookName() {
    issuedBookName = document.getElementById("Ibookname").value;
    issuedBookName = issuedBookName.toUpperCase();
}

function issue() {
    let Bfound;
    if (issuedBookName != "") {
        Bfound = false;
        for (let i = 0; i < localStorage.getItem('noOfBooks'); i++) {
            if (issuedBookName === setbook[i]) {
                Bfound = true;
                let j = -1;
                do {// to redister the ID no if he/she issue the book first time or if the
                    // ID no alredy exist then modify the data.
                    j++;
                    if ((setUserIssuedBooks[j][0] != null || setUserIssuedBooks[j][0] != undefined) && setUserIssuedBooks[j][0] != localStorage.getItem('id')) {// to find the ID no in the array
                        continue;
                    }
                    if (setUserIssuedBooks[j][i + 1] == undefined || setUserIssuedBooks[j][i + 1] == null) {
                        if (setavailableBook[i] != 0) {// to cheack the book is available
                            setUserIssuedBooks[j][0] = localStorage.getItem('id');
                            setUserIssuedBooks[j][i + 1] = 1;
                            setavailableBook[i]--;
                            document.getElementById("Imessage").innerHTML = issuedBookName + " Book Is Issued To You."; localStorage.setItem('books', JSON.stringify(setbook));
                            localStorage.setItem('availableBook', JSON.stringify(setavailableBook));
                        } else {// show the statemnet if the book is not available
                            document.getElementById("Imessage").innerHTML = "SORRY! All Copies Of " + issuedBookName + " Book Is Already Borrowed By Others."
                        }
                    } else {
                        document.getElementById("Imessage").innerHTML = "You have alredy Borrow one " + issuedBookName + " book, so no further "
                            + issuedBookName + " book can issue to you.";
                    }
                    break;
                } while (setUserIssuedBooks[j][0] != null || setUserIssuedBooks[j][0] != undefined)
                localStorage.setItem('UserIssuedBooks', JSON.stringify(setUserIssuedBooks));

            }
        }
        issuedBookName = "";
    }
    else {
        document.getElementById("Imessage").innerHTML = "No Message For You !";
        alert("Please Enter A Book Name !!!");
    }
    if (Bfound == false) {
        document.getElementById("Imessage").innerHTML = "This Book Is Not Available In The Library."
        Bfound = undefined;
    }
}

let BookIssuedOrNot = false;
let returnBookName = "";
function SaveReturnBookName() {
    returnBookName = document.getElementById("Rbookname").value;
    returnBookName = returnBookName.toUpperCase();
}

function showborrowedbooks() {
    document.getElementById('IBname').innerHTML = "";
    for (let i = 0; setUserIssuedBooks[i][0] != undefined || setUserIssuedBooks[i][0] != null; i++) {
        if (setUserIssuedBooks[i][0] != localStorage.getItem('id')) {// to cheack the roll no is resent in the arr or not
            continue;
        } else {
            for (let j = 1; j <= localStorage.getItem('noOfBooks'); j++) {// to show which books are issued to the roll no
                if (setUserIssuedBooks[i][j] != undefined || setUserIssuedBooks[i][j] != null) {
                    BookIssuedOrNot = true;
                    newElem = document.getElementById('IBname');
                    createdElement = document.createElement('span');
                    createdElement.innerText = " _" + setbook[j - 1];
                    newElem.appendChild(createdElement);
                }
            }
        }
    }
    if (BookIssuedOrNot == false) {
        document.getElementById('IBname').innerHTML = "NONE.";
    }
}

function returnbook() {
    document.getElementById("contents").innerHTML = '<div id="returnDiv"> <div>The books Issued By You Are:<span id="IBname"> </span></div><br>Enter The Book Name You Want To Return: <input type="text" class="bookname" id="Rbookname" onblur="SaveReturnBookName()" spellcheck="false"><br><input type="button" value="RETURN" class="Back" onclick="Return()"><br><fieldset class="message"> <legend><h4>Message Box</h4></legend><p id="Rmessage">No Message For You !</p></fieldset></div> <input type="button" value="<< BACK" class="Back" onclick="back()">';
    showborrowedbooks();
}

function Return() {
    let Bfound = true;
    let Bavail = true;
    if (BookIssuedOrNot == true) {
        if (returnBookName != "") {
            for (let k = 0; k < localStorage.getItem('noOfBooks'); k++) {
                if (returnBookName == setbook[k]) {
                    Bavail = false;
                    for (let i = 0; setUserIssuedBooks[i][0] != undefined || setUserIssuedBooks[i][0] != null; i++) {
                        if (setUserIssuedBooks[i][0] == localStorage.getItem('id')) {
                            for (let j = 0; j <= localStorage.getItem('noOfBooks'); j++) {// to identify the index no of the book in the array
                                if ((returnBookName == setbook[j]) && (setUserIssuedBooks[i][j + 1] == 1)) {
                                    Bfound = false;
                                    // Bfound = true;
                                    setavailableBook[j]++;// to increase the no of book available book after ruturn
                                    setUserIssuedBooks[i][j + 1] = null;
                                    localStorage.setItem('UserIssuedBooks', JSON.stringify(setUserIssuedBooks));
                                    document.getElementById("Rmessage").innerHTML = "Returning Of " + returnBookName + " Book Is Successful.";
                                    BookIssuedOrNot = false;
                                    returnBookName = "";
                                    let conf = true;
                                    for (let k = 1; k <= localStorage.getItem('noOfBooks'); k++) {
                                        if (setUserIssuedBooks[i][k] != undefined || setUserIssuedBooks[i][k] != null) {
                                            conf = false;
                                            break;
                                        }
                                    }
                                    if (conf == true) {
                                        let l = i;
                                        for (l; setUserIssuedBooks[l][0] != null || setUserIssuedBooks[l][0] != undefined; l++) {
                                            setUserIssuedBooks[l][0] = setUserIssuedBooks[l + 1][0]
                                        }

                                        for (let a = i; a < l; a++) {
                                            for (let b = 1; b < localStorage.getItem('noOfBooks'); b++) {
                                                setUserIssuedBooks[a][b] = setUserIssuedBooks[a + 1][b]
                                            }
                                        }
                                    }
                                    localStorage.setItem('UserIssuedBooks', JSON.stringify(setUserIssuedBooks));
                                    showborrowedbooks();
                                    localStorage.setItem('books', JSON.stringify(setbook));
                                    localStorage.setItem('availableBook', JSON.stringify(setavailableBook));
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
        else {
            document.getElementById("Rmessage").innerHTML = "No Message For You !";
            alert("Please Enter A Book Name !!!");
        }
        if (Bfound == true) {
            document.getElementById("Rmessage").innerHTML = "This Book Is Not Borrowed By You.";
            Bfound = undefined;
        }
        if (Bavail == true) {
            document.getElementById("Rmessage").innerHTML = "This Book Is Not Present In The Library.";
        }
    } else {
        document.getElementById("Rmessage").innerHTML = "First Of All Borrow A Book."
    }
}

let avalBook = 0;
let addBookName = "";
function SaveAddBookName() {
    addBookName = document.getElementById("Abookname").value;
    addBookName = addBookName.toUpperCase();
}

function SaveNoOfBooks() {
    avalBook = document.getElementById('AvalBooks').value;
}

function addbook() {
    document.getElementById("contents").innerHTML = '<div id="addDiv"> Enter The Name Of The Book That You Want To Add: <input type="text" class="bookname" id="Abookname" onblur="SaveAddBookName()" spellcheck="false"><br>Enter How Many Copies Of Book Available: <input type="number" class="bookname" id="AvalBooks" onblur="SaveNoOfBooks()" spellcheck="false"><br><input type="button" value="ADD" class="Back" onclick="Add()"><br> <fieldset class="message"> <legend><h4>Message Box</h4></legend><p id="Amessage">No Message For You !</p></fieldset></div> <input type="button" value="<< BACK" class="Back" onclick="back()">';
}