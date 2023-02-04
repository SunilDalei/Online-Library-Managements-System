let maincontent = document.getElementById("contents").innerHTML;
alert('Wellcom " ' + localStorage.getItem("name") + '"\nYou Are Loged-In To The Library As A Admin.');

document.getElementById("Uname").innerHTML = localStorage.getItem('name');
document.getElementById("Uid").innerHTML = localStorage.getItem('id');

function exit() {
    alert("Your Id - " + localStorage.getItem("id") + " Is Loged Out From The Library.");
    location.replace("index.html");
}

let setAdminIssuedBooks = JSON.parse(localStorage.getItem('AdminIssuedBooks'));

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
                    if ((setAdminIssuedBooks[j][0] != null || setAdminIssuedBooks[j][0] != undefined) && setAdminIssuedBooks[j][0] != localStorage.getItem('id')) {// to find the ID no in the array
                        continue;
                    }
                    if (setAdminIssuedBooks[j][i + 1] == undefined || setAdminIssuedBooks[j][i + 1] == null) {
                        if (setavailableBook[i] != 0) {// to cheack the book is available
                            setAdminIssuedBooks[j][0] = localStorage.getItem('id');
                            setAdminIssuedBooks[j][i + 1] = 1;
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
                } while (setAdminIssuedBooks[j][0] != null || setAdminIssuedBooks[j][0] != undefined)
                localStorage.setItem('AdminIssuedBooks', JSON.stringify(setAdminIssuedBooks));

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
    for (let i = 0; setAdminIssuedBooks[i][0] != undefined || setAdminIssuedBooks[i][0] != null; i++) {
        if (setAdminIssuedBooks[i][0] != localStorage.getItem('id')) {// to cheack the roll no is resent in the arr or not
            continue;
        } else {
            for (let j = 1; j <= localStorage.getItem('noOfBooks'); j++) {// to show which books are issued to the roll no
                if (setAdminIssuedBooks[i][j] != undefined || setAdminIssuedBooks[i][j] != null) {
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
                    for (let i = 0; setAdminIssuedBooks[i][0] != undefined || setAdminIssuedBooks[i][0] != null; i++) {
                        if (setAdminIssuedBooks[i][0] == localStorage.getItem('id')) {
                            for (let j = 0; j <= localStorage.getItem('noOfBooks'); j++) {// to identify the index no of the book in the array
                                if ((returnBookName == setbook[j]) && (setAdminIssuedBooks[i][j + 1] == 1)) {
                                    Bfound = false;
                                    // Bfound = true;
                                    setavailableBook[j]++;// to increase the no of book available book after ruturn
                                    setAdminIssuedBooks[i][j + 1] = null;
                                    localStorage.setItem('AdminIssuedBooks', JSON.stringify(setAdminIssuedBooks));
                                    document.getElementById("Rmessage").innerHTML = "Returning Of " + returnBookName + " Book Is Successful.";
                                    BookIssuedOrNot = false;
                                    returnBookName = "";
                                    let conf = true;
                                    for (let k = 1; k <= localStorage.getItem('noOfBooks'); k++) {
                                        if (setAdminIssuedBooks[i][k] != undefined || setAdminIssuedBooks[i][k] != null) {
                                            conf = false;
                                            break;
                                        }
                                    }
                                    if (conf == true) {
                                        let l = i;
                                        for (l; setAdminIssuedBooks[l][0] != null || setAdminIssuedBooks[l][0] != undefined; l++) {
                                            setAdminIssuedBooks[l][0] = setAdminIssuedBooks[l + 1][0]
                                        }

                                        for (let a = i; a < l; a++) {
                                            for (let b = 1; b < localStorage.getItem('noOfBooks'); b++) {
                                                setAdminIssuedBooks[a][b] = setAdminIssuedBooks[a + 1][b]
                                            }
                                        }
                                    }
                                    localStorage.setItem('AdminIssuedBooks', JSON.stringify(setAdminIssuedBooks));
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

function Add() {
    let go = true;
    if (addBookName != "") {
        for (let s = 0; s < localStorage.getItem('noOfBooks'); s++) {
            if (addBookName === setbook[s]) {
                go = false;
                break;
            }
        }
        if (go == true) {
            if (avalBook > 0) {
                Bfound = true;
                let x = localStorage.getItem('noOfBooks');
                x++;
                localStorage.setItem('noOfBooks', x);
                setbook[localStorage.getItem('noOfBooks') - 1] = addBookName;
                setavailableBook[localStorage.getItem('noOfBooks') - 1] = avalBook;
                document.getElementById("Amessage").innerHTML = "The " + setbook[localStorage.getItem('noOfBooks') - 1] + " Book Is Sccessfuly Added To The Central Library.";
                addBookName = "";
                avalBook = 0;
                localStorage.setItem('books', JSON.stringify(setbook));
                localStorage.setItem('availableBook', JSON.stringify(setavailableBook));
            }
            else {
                Bfound = undefined;
                document.getElementById("Amessage").innerHTML = "No Message For You !";
                alert("Please Enter A Valid Number Of Available Books !!!");
            }
        }
        else {
            document.getElementById("Amessage").innerHTML = "This Book Is Already Preasent In The Library !";
        }
    } else {
        document.getElementById("Amessage").innerHTML = "No Message For You !";
        alert("Please Enter A Book Name !!!");
    }
}

let ReBookName = "";
function SaveReBookName() {
    ReBookName = document.getElementById("Rebookname").value;
    ReBookName = ReBookName.toUpperCase();
}

function removebook() {
    document.getElementById("contents").innerHTML = '<div id="remDiv"> Enter The Name Of The Book That You Want To Remove: <input type="text" class="bookname" id="Rebookname" onblur="SaveReBookName()" spellcheck="false"><br><input type="button" value="REMOVE" class="Back" onclick="Remove()"><br> <fieldset class="message"> <legend><h4>Message Box</h4></legend><p id="Remessage">No Message For You !</p></fieldset></div> <input type="button" value="<< BACK" class="Back" onclick="back()">';
}

let setUserIssuedBooks = JSON.parse(localStorage.getItem('UserIssuedBooks'));

function Remove() {
    let Bfound;
    if (ReBookName != "") {
        Bfound = false;
        for (let i = 0; i < localStorage.getItem('noOfBooks'); i++) {
            if (ReBookName === setbook[i]) {
                Bfound = true;
                let choice = -1;
                let nobookissued1 = true;
                let nobookissued2 = true;
                let cheack;
                for (let i = 0; i < localStorage.getItem('noOfBooks'); i++) {// to identify the index no of the book in the array
                    cheack = ReBookName === setbook[i];
                    if (cheack == true) {
                        choice = i;
                        break;
                    }
                }
                for (let j = 0; setAdminIssuedBooks[0][j] != undefined || setAdminIssuedBooks[0][j] != null; j++) {
                    if (setAdminIssuedBooks[j][choice + 1] == 1) {
                        nobookissued1 = false;
                        break;
                    }
                }
                for (let j = 0; setUserIssuedBooks[0][j] != undefined || setUserIssuedBooks[0][j] != null; j++) {
                    if (setUserIssuedBooks[j][choice + 1] == 1) {
                        nobookissued2 = false;
                        break;
                    }
                }
                if (nobookissued1 == false || nobookissued2 == false) {// display error because this book is issued by some students
                    document.getElementById("Remessage").innerHTML = "As " + setbook[choice]
                        + " book was borrowed by others, you can not remove the book details from the library.";
                } else {
                    document.getElementById("Remessage").innerHTML = ("The " + setbook[choice]
                        + " book details is successfuly removed from The Central Library.");
                    let x = localStorage.getItem('noOfBooks');
                    x--;
                    localStorage.setItem('noOfBooks', x);
                    let i;
                    for (i = choice; i <= localStorage.getItem('noOfBooks'); i++) {
                        setbook[i] = setbook[i + 1];
                        setavailableBook[i] = setavailableBook[i + 1];
                    }

                    let j=0;
                    for (let i = 0; setAdminIssuedBooks[i][j] != null || setAdminIssuedBooks[i][j] != undefined; i++) {
                        for (j = choice + 1; j <= localStorage.getItem('noOfBooks'); j++) {
                            setAdminIssuedBooks[i][j] = setAdminIssuedBooks[i][j + 1];
                        }
                        setAdminIssuedBooks[i][j - 1] = null;
                    }
                    j=0;
                    for (let i = 0; setUserIssuedBooks[i][j] != null || setUserIssuedBooks[i][j] != undefined; i++) {
                        for (j = choice + 1; j <= localStorage.getItem('noOfBooks'); j++) {
                            setUserIssuedBooks[i][j] = setUserIssuedBooks[i][j + 1];
                        }
                        setUserIssuedBooks[i][j - 1] = null;
                    }

                    setbook[i] = undefined;
                    setavailableBook[i] = undefined;
                    ReBookName = "";
                    localStorage.setItem('books', JSON.stringify(setbook));
                    localStorage.setItem('availableBook', JSON.stringify(setavailableBook));
                    localStorage.setItem('AdminIssuedBooks', JSON.stringify(setAdminIssuedBooks));
                }
            }
        } if (Bfound == false) {
            document.getElementById("Remessage").innerHTML = "This Book Is A Not Preasent In The Library !";
            Bfound = undefined;
        }

    } else {
        document.getElementById("Remessage").innerHTML = "No Message For You !";
        alert("Please Enter A Book Name !!!");
    }
}

function issuedetails() {
    document.getElementById("contents").innerHTML = '<div id="detailsDiv"><div id="UserDetailDiv"><table id="Userissuetable"><tr><th>User ID</th><th>Book Name</th></tr></table></div><div id="AdminDetailDiv"><table id="Adminissuetable"><tr><th>Admin ID</th><th>Book Name</th></tr></table></div></div> <input type="button" value="<< BACK" class="Back" onclick="back()">';
    let iss = true;
    var MyTable1 = document.getElementById("Userissuetable");
    for (let i = 0; setUserIssuedBooks[i][0] != null || setUserIssuedBooks[i][0] != undefined; i++) {
        iss = false;
        var NewRow = MyTable1.insertRow(i + 1);
        var Newcell1 = NewRow.insertCell(0);
        var Newcell2 = NewRow.insertCell(1);
        Newcell1.innerHTML = setUserIssuedBooks[i][0];
        for (let j = 1; j <= localStorage.getItem('noOfBooks'); j++) {
            if (setUserIssuedBooks[i][j] != null || setUserIssuedBooks[i][j] != undefined) {
                createdElement = document.createElement('span');
                createdElement.innerText = " _" + setbook[j - 1];
                Newcell2.appendChild(createdElement);
            }
        }
    }
    if (iss == true) {
        var NewRow = MyTable1.insertRow(1);
        var Newcell1 = NewRow.insertCell(0);
        var Newcell2 = NewRow.insertCell(1);
        Newcell1.innerHTML = "NONE";
        Newcell2.innerHTML = "NONE";
    }
    iss = true;
    var MyTable2 = document.getElementById("Adminissuetable");
    for (let i = 0; setAdminIssuedBooks[i][0] != null || setAdminIssuedBooks[i][0] != undefined; i++) {
        iss = false;
        var NewRow = MyTable2.insertRow(i + 1);
        var Newcell1 = NewRow.insertCell(0);
        var Newcell2 = NewRow.insertCell(1);
        Newcell1.innerHTML = setAdminIssuedBooks[i][0];
        for (let j = 1; j <= localStorage.getItem('noOfBooks'); j++) {
            if (setAdminIssuedBooks[i][j] != null || setAdminIssuedBooks[i][j] != undefined) {
                createdElement = document.createElement('span');
                createdElement.innerText = " _" + setbook[j - 1];
                Newcell2.appendChild(createdElement);
            }
        }
    }
    if (iss == true) {
        var NewRow = MyTable2.insertRow(1);
        var Newcell1 = NewRow.insertCell(0);
        var Newcell2 = NewRow.insertCell(1);
        Newcell1.innerHTML = "NONE";
        Newcell2.innerHTML = "NONE";
        iss = true
    }
}