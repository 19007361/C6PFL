$(document).ready(function () {

    var config = {
        apiKey: "AIzaSyDKAWFnFnTAVON0IMfUPx5SUs920GgxRBU",
        authDomain: "c6pfl-f92ad.firebaseapp.com",
        databaseURL: "https://c6pfl-f92ad.firebaseio.com",
        storageBucket: "c6pfl-f92ad.appspot.com",
        messagingSenderId: "142303462703"
    };
    firebase.initializeApp(config);

    var usersRef = firebase.database().ref().child("users");
    var dbauth = firebase.auth();
    var studNo;
    var currentUser;

    $("#loginBtn").click(function () {
        dbauth.signInWithEmailAndPassword($("#email").val(), $("#password").val()).then(function (value) {
            console.log("Logging in...");
            window.location.href = 'index.html';
        }).catch(function (error) {
            alert(error.message);
            console.log(error.message);
        });
    });

    dbauth.onAuthStateChanged(function (firebaseUser) {
        currentUser = firebaseUser;
        var currentFile = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
        if (firebaseUser) {
            studNo = firebaseUser.email.substring(0, 8);
            console.log("Logged in with: " + firebaseUser.email);
            $("#login-option").addClass("hidden");
            $("#logout-option").removeClass("hidden");
            $("#reset-password-option").removeClass("hidden");
            if (currentFile === 'login.html') {
                window.location.href = 'index.html';
            }
            usersRef.once('value', function (snapshot) {
                $("#your-name-here").text(snapshot.child(studNo).child("name").val());
            });
        } else {
            $("#login-option").removeClass("hidden");
            $("#logout-option").addClass("hidden");
            $("#reset-password-option").addClass("hidden");
            if (currentFile !== 'login.html') {
                alert("Not logged in.");
                window.location.href = 'login.html';
            }
        }

    });

    $("#logout-option").click(function () {
        dbauth.signOut();
    });

    $("#reset-password-option").click(function () {
        dbauth.sendPasswordResetEmail(currentUser.email).then(function () {
            alert("Password reset email sent to " + currentUser.email);
            console.log("Password reset email sent to " + currentUser.email);
        }, function (error) {
            alert(error.message);
            console.log(error.message);
        });
    });
});
