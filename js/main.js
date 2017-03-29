$(document).ready(function () {

    var config = {
        apiKey: "AIzaSyDKAWFnFnTAVON0IMfUPx5SUs920GgxRBU",
        authDomain: "c6pfl-f92ad.firebaseapp.com",
        databaseURL: "https://c6pfl-f92ad.firebaseio.com",
        storageBucket: "c6pfl-f92ad.appspot.com",
        messagingSenderId: "142303462703"
    };
    firebase.initializeApp(config);

    if (true) {
        var usersRef;
        var fixturesRef = firebase.database().ref().child("fixtures");
        var teamsRef = firebase.database().ref().child("teams");
        var dbauth = firebase.auth();
        var studNo;
        var currentUser;
        var currentFile = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
        console.log("Currently at: " + currentFile);
    }

    dbauth.onAuthStateChanged(function (firebaseUser) {
        currentUser = firebaseUser;
        if (currentUser) {
            if (true) {
                studNo = currentUser.email.substring(0, 8);
                usersRef = firebase.database().ref().child("users").child(studNo);
                console.log("Logged in with: " + currentUser.email);
                $("#login-option").addClass("hidden");
                $("#logout-option").removeClass("hidden");
                $("#reset-password-option").removeClass("hidden");
                $(".nav-logged-in-only").removeClass("hidden");
                $("#view-points-logged-in-only").removeClass("hidden");
                if (currentFile == 'login.html') {
                    if (currentUser.email == "hkwilgen@sun.ac.za") {
                        window.location.href = 'admin.html';
                    } else {
                        window.location.href = 'index.html';
                    }
                }
                if (currentFile == 'admin.html' && currentUser.email != "hkwilgen@sun.ac.za") {
                    alert("Not an admin account.");
                    window.location.href = 'index.html';
                }
                if (currentUser.email == "hkwilgen@sun.ac.za") {
                    $(".navbar-nav").append("<li><a href='admin.html' style='background-color: blue;'><i class='fa fa-fw fa-unlock-alt'></i> Admin</a></li>");
                    $("#your-name-here").text("Admin");
                } else {
                    usersRef.once('value', function (snapshot) {
                        $("#your-name-here").html("<img src='images/" + snapshot.child("republic").val() + ".png' class='fa fa-fw'/> " + snapshot.child("name").val());
                    });
                }
            }

            /*  PREDICT */
            if (currentFile == 'predict.html') {
                usersRef.once('value', function (usersSnap) {
                    fixturesRef.once('value', function (snapshot) {
                        snapshot.forEach(function (childSnapshot) {
                            var matchTime = new Date(childSnapshot.child("datetime").val());
                            var diff = matchTime.getTime() - new Date().getTime();
                            if (diff > 0) {
                                var alertBox = "",
                                    predictBox = "";
                                alertBox += "<div class='alert alert-dismissable";
                                predictBox += "<div id='" + childSnapshot.key + "-match-predict' class='panel ";
                                var team1 = childSnapshot.child("team1").val();
                                var team2 = childSnapshot.child("team2").val();
                                var alertButtonHtml = "<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>";
                                var alertTeamsHtml = "<img src='images/" + team1 + ".png' class='fa fa-fw'> <i>" + team1 + "</i> vs. <img src='images/" + team2 + ".png' class='fa fa-fw'> <i>" + team2 + "</i> is coming up in ";
                                var predictTeamsHtml = "<div class='panel-heading'><h3 class='panel-title'><b>" + team1 + "</b> vs. <b>" + team2 + "</b></h3>";
                                if (diff > 1000 * 60 * 60 * 24) {
                                    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
                                    alertBox += " alert-info'>" + alertButtonHtml + "<strong>Predict later... </strong>" + alertTeamsHtml + days + " day";
                                    predictBox += "panel-info'>" + predictTeamsHtml + "<small>Starting in <b>" + days + " day";
                                    if (days != 1) {
                                        alertBox += "s";
                                        predictBox += "s";
                                    }
                                } else if (diff > 1000 * 60 * 60) {
                                    var hours = Math.floor(diff / (1000 * 60 * 60));
                                    alertBox += " alert-warning'>" + alertButtonHtml + "<strong>Predict soon. </strong>" + alertTeamsHtml + hours + " hour";
                                    predictBox += "panel-yellow'>" + predictTeamsHtml + "<small>Starting in <b>" + hours + " hour";
                                    if (hours != 1) {
                                        alertBox += "s";
                                        predictBox += "s";
                                    }
                                } else {
                                    var mins = Math.floor(diff / (1000 * 60));
                                    alertBox += " alert-danger'>" + alertButtonHtml + "<strong>Predict now! </strong>" + alertTeamsHtml + mins + " minute";
                                    predictBox += "panel-red'>" + predictTeamsHtml + "<small>Starting in <b>" + mins + " minute";
                                    if (mins != 1) {
                                        alertBox += "s";
                                        predictBox += "s";
                                    }
                                }
                                alertBox += "</div>";
                                if (diff < 1000 * 60 * 60 * 24 * 3) {
                                    $("#predict-alerts").append(alertBox);
                                }

                                predictBox += "</b></small></div>" +
                                    "<div class='panel-body'><div class='row'><div class='form-group'><form class='predict-form' onsubmit='return false' action=''>" +
                                    "<div class='col-sm-4'><div class='list-group team-options'>" +
                                    "<a class='list-group-item active'><h4 class='list-group-item-heading'><img src='images/" + team1 + ".png' width='50px' style='margin-right: 20px;'>" + team1 + "</h4></a>" +
                                    "<a class='list-group-item'><h4 class='list-group-item-heading'><img src='images/" + team2 + ".png' width='50px' style='margin-right: 20px;'>" + team2 + "</h4></a>" +
                                    "<a class='list-group-item team-options-draw'><h4 class='list-group-item-heading'>Draw</h4></a>" +
                                    "</div></div>" +
                                    "<div class='col-sm-4'><label>By runs:</label><fieldset class='predict-options'><select class='form-control runs-options'></select><label>By wickets:</label><select class='form-control wickets-options'></select></fieldset></div>" +
                                    "<div class='col-sm-4'><button type='submit' class='btn btn-lg btn-default predict-submit'>Submit picks</button>";
                                var userMatchPicks = usersSnap.child("picks").child(childSnapshot.key);
                                if (userMatchPicks.child("team").val() != "") {
                                    if (userMatchPicks.child("team").val() == "Draw") {
                                        predictBox += "<p>You have already chosen <b>a draw</b> for this match.</p>";
                                    } else {
                                        predictBox += "<p>You have already chosen <b>" + userMatchPicks.child("team").val() + "</b> to win by <b>" + userMatchPicks.child("runs").val() + " runs</b> or <b>" + userMatchPicks.child("wickets").val() + " wickets</b>.</p>";
                                    }
                                }
                                predictBox += "</div></form></div></div></div></div>";
                                $("#predict-forms").append(predictBox);
                            }
                        });

                        $(".runs-options").each(function () {
                            for (var i = 5; i <= 200; i += 5) {
                                $(this).append("<option value='" + i + "'>" + i + "</option>");
                            }
                        });
                        $(".wickets-options").each(function () {
                            for (var i = 1; i <= 10; i++) {
                                $(this).append("<option>" + i + "</option>");
                            }
                        });
                    });
                });
                $("body").on('click', '.list-group .list-group-item', function (event) {
                    $(this).parent().children().removeClass("active");
                    $(this).addClass("active");
                    if ($(this).hasClass("team-options-draw")) {
                        $(this).closest(".predict-form").find(".predict-options").prop("disabled", true);
                        $(this).closest(".predict-form").find(".predict-submit").addClass("alert-danger");
                    } else {
                        $(this).closest(".predict-form").find(".predict-options").prop("disabled", false);
                        $(this).closest(".predict-form").find(".predict-submit").removeClass("alert-danger");
                    }
                });

                $("body").on('submit', '.predict-form', function (event) {
                    event.preventDefault();
                    var current = $(this);

                    fixturesRef.once('value').then(function (snapshot) {
                        var num = current.closest(".panel").attr("id").substring(0, 1);
                        var selectedTeam = current.find(".team-options").find(".active").find("h4").text();
                        var runs = current.find('.runs-options').find(':selected').text();
                        var wickets = current.find('.wickets-options').find(':selected').text();

                        console.log("Submitted prediction for match " + num + ": " + selectedTeam + " by " + runs + " runs or " + wickets + " wickets.");
                        var matchTime = new Date(snapshot.child(num).child("datetime").val());
                        var diff = matchTime.getTime() - new Date().getTime();
                        if (diff < 0) {
                            alert("Seems like this match has already started, sorry about that.");
                        } else if (selectedTeam == "Draw") {
                            if (confirm("Are you sure that this will end in a draw?")) {
                                var team = selectedTeam,
                                    runs = "0",
                                    wickets = "0";
                                if (confirm("You selected this match to end in a draw. You can change your picks up until the match starts.")) {
                                    usersRef.child("picks").child(num).update({
                                        team: team,
                                        runs: runs,
                                        wickets: wickets
                                    });
                                }
                            }
                        } else {
                            if (confirm("Confirm that you selected " + selectedTeam + " to win by either " + runs + " runs or " + wickets + " wickets.")) {
                                var team = selectedTeam;
                                usersRef.child("picks").child(num).update({
                                    team: team,
                                    runs: runs,
                                    wickets: wickets
                                });
                                alert("Selected! You can change your picks up until the match starts.");
                            }
                        }
                    });
                });
            }

            /* MY POINTS */
            if (currentFile == 'myPoints.html') {
                var day = "";
                var dayCounter = 0;
                var gsp = 1;
                var cell10;
                var wpTotal = 0,
                    mpTotal = 0,
                    gspTotal = 0;
                usersRef.once('value', function (usersSnap) {
                    fixturesRef.once('value', function (fixturesSnap) {
                        fixturesSnap.forEach(function (childSnapshot) {
                            var matchTime = new Date(childSnapshot.child("datetime").val());

                            var diff = matchTime.getTime() - new Date().getTime();

                            if (diff < 0) {
                                var team1 = childSnapshot.child("team1").val();
                                var team2 = childSnapshot.child("team2").val();
                                var teamWon = childSnapshot.child("teamWon").val();
                                var typeWon = childSnapshot.child("typeWon").val();
                                var numberWon = childSnapshot.child("numberWon").val();
                                var myTeam = usersSnap.child("picks").child(childSnapshot.key).child("team").val();
                                var myRuns = usersSnap.child("picks").child(childSnapshot.key).child("runs").val();
                                var myWickets = usersSnap.child("picks").child(childSnapshot.key).child("wickets").val();

                                var row = document.getElementById("my-points-table").getElementsByTagName("tbody")[0].insertRow();
                                var cell0 = row.insertCell(0);
                                if (matchTime.toDateString() != day) {

                                    if (gsp > 0 && dayCounter != 0) {
                                        cell10.innerHTML = gsp;
                                        gspTotal += gsp;
                                    }
                                    dayCounter++;
                                    day = matchTime.toDateString();
                                    cell0.innerHTML = "<b>" + dayCounter + "</b>";
                                    gsp = 1;

                                }
                                cell0.className = "my-points-table-day";

                                var wp = (myTeam == teamWon) ? 1 : 0;
                                wpTotal += wp;
                                if (wp == 0) {
                                    gsp = 0;
                                }

                                var mp = 0;
                                if (myRuns != "") {
                                    if (typeWon == "runs" || typeWon == "draw") {
                                        var runDiff = Math.abs(numberWon - myRuns);
                                        if (runDiff <= 5) {
                                            mp = 0.75;
                                        } else if (runDiff <= 10) {
                                            mp = 0.5;
                                        } else if (runDiff <= 20) {
                                            mp = 0.25;
                                        }
                                    }
                                    if (typeWon == "wickets") {
                                        var wicketDiff = Math.abs(numberWon - myWickets);
                                        if (wicketDiff == 0) {
                                            mp = 0.75;
                                        } else if (wicketDiff == 1) {
                                            mp = 0.5;
                                        } else if (wicketDiff == 2) {
                                            mp = 0.25;
                                        }
                                    }

                                    if (wp + mp > 1.75) {
                                        row.className = "success";
                                    } else if (wp + mp > 1.25) {
                                        row.className = "warning";
                                    } else {
                                        row.className = "danger";
                                    }
                                }
                                mpTotal += mp;

                                row.insertCell(1).innerHTML = childSnapshot.key;
                                row.insertCell(2).innerHTML = matchTime.toDateString();
                                row.insertCell(3).innerHTML = matchTime.toLocaleTimeString();
                                row.insertCell(4).innerHTML = "<img class='fa fa-fw' src='images/" + team1 + ".png'/> " + team1;
                                row.insertCell(5).innerHTML = "<img class='fa fa-fw' src='images/" + team2 + ".png'/> " + team2;
                                if (myTeam != "") {
                                    if (myTeam == "Draw") {
                                        row.insertCell(6).innerHTML = "<b>Draw</b>";
                                    } else {
                                        row.insertCell(6).innerHTML = "<b>" + myTeam + "</b> by <b>" + myRuns + " runs</b> or <b>" + myWickets + " wickets</b>";
                                    }
                                } else {
                                    row.insertCell(6).innerHTML = "No pick was recorded for you.";
                                }
                                if (teamWon == "") {
                                    row.insertCell(7).innerHTML = "No result yet.";
                                } else {
                                    if (teamWon == "Draw") {
                                        row.insertCell(7).innerHTML = "<b>Draw</b>";
                                    } else {
                                        row.insertCell(7).innerHTML = "<b>" + teamWon + "</b> by <b>" + numberWon + " " + typeWon + "</b>";
                                    }
                                    row.insertCell(8).innerHTML = wp;
                                    row.insertCell(9).innerHTML = mp;
                                    cell10 = row.insertCell(10);
                                    row.insertCell(11).innerHTML = wp + mp;
                                }
                            }
                        });
                        if (gsp > 0 && dayCounter != 0) {
                            cell10.innerHTML = gsp;
                            gspTotal += gsp;
                        }
                        var footer = document.getElementById("my-points-table").createTFoot().insertRow(0);
                        footer.insertCell(0);
                        footer.insertCell(1);
                        footer.insertCell(2);
                        footer.insertCell(3);
                        footer.insertCell(4);
                        footer.insertCell(5);
                        footer.insertCell(6);
                        footer.insertCell(7).innerHTML = "<h3><b>TOTAL:</b></h3>";
                        footer.insertCell(8).innerHTML = "<h3>" + wpTotal + "</h3>";
                        footer.insertCell(9).innerHTML = "<h3>" + mpTotal + "</h3>";
                        footer.insertCell(10).innerHTML = "<h3>" + gspTotal + "</h3>";
                        footer.insertCell(11).innerHTML = "<h3><b>" + (wpTotal + mpTotal + gspTotal) + "</b></h3>";
                    });
                });
            }

        } else {
            if (true) {
                $("#login-option").removeClass("hidden");
                $("#logout-option").addClass("hidden");
                $("#reset-password-option").addClass("hidden");
                $(".nav-logged-in-only").addClass("hidden");
                $("#view-points-logged-in-only").addClass("hidden");
                if (currentFile !== 'login.html' && currentFile !== 'index.html' && currentFile !== 'fixtures.html' && currentFile !== 'republics.html' && currentFile !== 'results.html' && currentFile !== '') {
                    alert("Not logged in.");
                    window.location.href = 'login.html';
                }
            }
        }

    });

    $("#logout-option").click(function () {
        dbauth.signOut();
    });

    $("#reset-password-option").click(function () {
        if (confirm("Send a password reset email to yourself?")) {
            dbauth.sendPasswordResetEmail(currentUser.email).then(function () {
                alert("Password reset email sent to " + currentUser.email);
                console.log("Password reset email sent to " + currentUser.email);
            }, function (error) {
                alert(error.message);
                console.log(error.message);
            });
        }
    });

    $("#demo li a").on('click', function (event) {
        localStorage.setItem("selectedRepublic", $(this).text());
    });

    /*  INDEX   */
    if (currentFile == 'index.html' || currentFile == '') {
        var resultsToday = 0;
        fixturesRef.once('value', function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var matchTime = new Date(childSnapshot.child("datetime").val());
                var diff = matchTime.getTime() - new Date().getTime();
                var team1 = childSnapshot.child("team1").val();
                var team2 = childSnapshot.child("team2").val();
                if (diff > 0) {
                    var alertBox = "";
                    alertBox += "<div class='alert alert-dismissable";
                    var alertButtonHtml = "<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>";
                    var alertTeamsHtml = "<img src='images/" + team1 + ".png' class='fa fa-fw'> <i>" + team1 + "</i> vs. <img src='images/" + team2 + ".png' class='fa fa-fw'> <i>" + team2 + "</i> is coming up in ";
                    var fixturesRow = document.getElementById("fixtures-table").getElementsByTagName("tbody")[0].insertRow();

                    if (diff > 1000 * 60 * 60 * 24) {
                        var days = Math.floor(diff / (1000 * 60 * 60 * 24));
                        alertBox += " alert-info'>" + alertButtonHtml + "<strong>Predict later... </strong>" + alertTeamsHtml + days + " day";
                        if (days != 1) {
                            alertBox += "s";
                        }
                    } else if (diff > 1000 * 60 * 60) {
                        fixturesRow.className = "danger";
                        var hours = Math.floor(diff / (1000 * 60 * 60));
                        alertBox += " alert-warning'>" + alertButtonHtml + "<strong>Predict soon. </strong>" + alertTeamsHtml + hours + " hour";
                        if (hours != 1) {
                            alertBox += "s";
                        }
                    } else {
                        fixturesRow.className = "warning";
                        var mins = Math.floor(diff / (1000 * 60));
                        alertBox += " alert-danger'>" + alertButtonHtml + "<strong>Predict now! </strong>" + alertTeamsHtml + mins + " minute";
                        if (mins != 1) {
                            alertBox += "s";
                        }
                    }
                    if (diff < 1000 * 60 * 60) {
                        fixturesRow.className = "danger";
                    } else if (diff < 1000 * 60 * 60 * 24) {
                        fixturesRow.className = "warning";
                    }
                    alertBox += "</div>";
                    if (diff < 1000 * 60 * 60 * 24 * 3) {
                        $("#predict-alerts").append(alertBox);
                        fixturesRow.insertCell(0).innerHTML = childSnapshot.key;
                        fixturesRow.insertCell(1).innerHTML = matchTime.toDateString();
                        fixturesRow.insertCell(2).innerHTML = matchTime.toLocaleTimeString();
                        fixturesRow.insertCell(3).innerHTML = "<img class='fa fa-fw' src='images/" + team1 + ".png'/> " + team1;
                        fixturesRow.insertCell(4).innerHTML = "<img class='fa fa-fw' src='images/" + team2 + ".png'/> " + team2;
                    }

                } else if (childSnapshot.child("teamWon").val() != "") {
                    var teamWon = childSnapshot.child("teamWon").val();
                    var teamBeat = (teamWon == team1) ? team2 : team1;
                    var typeWon = childSnapshot.child("typeWon").val();
                    var numberWon = childSnapshot.child("numberWon").val();
                    var time;
                    if (Math.abs(diff) > 1000 * 60 * 60 * 24) {
                        time = Math.abs(Math.floor(diff / (1000 * 60 * 60 * 24))) + " days ago";
                    } else if (Math.abs(diff) > 1000 * 60 * 60) {
                        time = Math.abs(Math.floor(diff / (1000 * 60 * 60))) + " hours ago";
                    } else {
                        time = Math.abs(Math.floor(diff / (1000 * 60))) + " minutes ago";
                    }

                    var prependix = "<p class='list-group-item";
                    if (matchTime.toDateString() == new Date().toDateString()) {
                        resultsToday++;
                        prependix += " active";
                    }
                    if (teamWon == "Draw") {
                        prependix += "'><span class='badge'>" + time + "</span><i class='fa fa-fw fa-check'></i><i><img class='fa fa-fw' src='images/" + team1 + ".png'/> " + team1 + "</i> and <i><img class='fa fa-fw' src='images/" + team2 + ".png'/> " + team2 + "</i> <b>drew</b></p>";
                    } else {
                        prependix += "'><span class='badge'>" + time + "</span><i class='fa fa-fw fa-check'></i><b><img class='fa fa-fw' src='images/" + teamWon + ".png'/> " + teamWon + "</b> beat <i><img class='fa fa-fw' src='images/" + teamBeat + ".png'/> " + teamBeat + "</i> by <b>" + numberWon + " " + typeWon + "</b></p>";
                    }
                    $("#index-results").prepend(prependix);
                }
            });
            $("#results-today").text(resultsToday);
            if (resultsToday == 1) {
                $("#results-today-text").text("Kwottie Result Today");
            }
        });
    }

    /*  LOGIN   */
    if (currentFile == 'login.html') {
        $("#loginBtn").click(function () {
            dbauth.signInWithEmailAndPassword($("#email").val(), $("#password").val()).then(function (value) {
                console.log("Logging in...");
                window.location.href = 'index.html';
            }).catch(function (error) {
                alert(error.message);
                console.log(error.message);
            });
        });
    }

    /*  FIXTURES    */
    if (currentFile == 'fixtures.html') {
        fixturesRef.once('value', function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var matchTime = new Date(childSnapshot.child("datetime").val());
                var diff = matchTime.getTime() - new Date().getTime();
                if (diff > 0) {
                    var team1 = childSnapshot.child("team1").val();
                    var team2 = childSnapshot.child("team2").val();
                    var row = document.getElementById("fixtures-table").getElementsByTagName("tbody")[0].insertRow();
                    if (diff < 1000 * 60 * 60) {
                        row.className = "danger";
                    } else if (diff < 1000 * 60 * 60 * 24) {
                        row.className = "warning";
                    }
                    row.insertCell(0).innerHTML = childSnapshot.key;
                    row.insertCell(1).innerHTML = matchTime.toDateString();
                    row.insertCell(2).innerHTML = matchTime.toLocaleTimeString();
                    row.insertCell(3).innerHTML = "<img class='fa fa-fw' src='images/" + team1 + ".png'/> " + team1;
                    row.insertCell(4).innerHTML = "<img class='fa fa-fw' src='images/" + team2 + ".png'/> " + team2;
                }
            });
        });
    }

    /*  REPUBLIC    */
    if (currentFile == 'republics.html') {
        var selectedRepublic = localStorage.getItem("selectedRepublic");
        $("#republics-page-header").text(selectedRepublic);
        var image = "images/" + selectedRepublic + ".png";
        $("#republics-breadcrumb").html("<img class='fa fa-fw' src='" + image + "'/> " + selectedRepublic);
        $("#republics-image").attr("src", image);
        switch (selectedRepublic) {
            case "Hoek":
                $("#republics-slogan").text("Seize the means of production.");
                break;
            case "Tjom":
                $("#republics-slogan").text('My best pick-up line is "My name is Hugh Hefner." - Hugh Hefner');
                break;
            case "Saag":
                $("#republics-slogan").text("We are also a republic.");
                break;
            case "Dublin":
                $("#republics-slogan").text("Shoulder to shoulder, we'll answer Dublin's call.");
                break;
            case "Wankers":
                $("#republics-slogan").text("It's just sex with someone I love.");
                break;
            case "Yard":
                $("#republics-slogan").text();
                break;
            case "Palace":
                $("#republics-slogan").text();
                break;
            case "Oord":
                $("#republics-slogan").text();
                break;
            case "Bach":
                $("#republics-slogan").text("Don't look at this page.");
                break;
        }
    }

    /* RESULTS */
    if (currentFile == 'results.html') {
        var day = "";
        var dayCounter = 0;
        fixturesRef.once('value', function (fixturesSnap) {
            fixturesSnap.forEach(function (childSnapshot) {
                var matchTime = new Date(childSnapshot.child("datetime").val());
                var diff = matchTime.getTime() - new Date().getTime();

                if (diff < 0) {
                    var team1 = childSnapshot.child("team1").val();
                    var team2 = childSnapshot.child("team2").val();
                    var teamWon = childSnapshot.child("teamWon").val();
                    var typeWon = childSnapshot.child("typeWon").val();
                    var numberWon = childSnapshot.child("numberWon").val();

                    var row = document.getElementById("results-table").getElementsByTagName("tbody")[0].insertRow();
                    var cell0 = row.insertCell(0);
                    if (matchTime.toDateString() != day) {
                        dayCounter++;
                        day = matchTime.toDateString();
                        cell0.innerHTML = "<b>" + dayCounter + "</b>";
                    }
                    cell0.className = "my-points-table-day";

                    row.insertCell(1).innerHTML = childSnapshot.key;
                    row.insertCell(2).innerHTML = matchTime.toDateString();
                    row.insertCell(3).innerHTML = matchTime.toLocaleTimeString();
                    row.insertCell(4).innerHTML = "<img class='fa fa-fw' src='images/" + team1 + ".png'/> " + team1;
                    row.insertCell(5).innerHTML = "<img class='fa fa-fw' src='images/" + team2 + ".png'/> " + team2;

                    if (teamWon == "") {
                        row.insertCell(6).innerHTML = "No result yet.";
                    } else {
                        if (teamWon == "Draw") {
                            row.insertCell(6).innerHTML = "<b>Draw</b>";
                        } else {
                            row.insertCell(6).innerHTML = "<b>" + teamWon + "</b> by <b>" + numberWon + " " + typeWon + "</b>";
                        }
                    }
                }
            });

        });
    }

    /* ADMIN */
    if (currentFile == 'admin.html') {
        var numFixtures = 0;
        fixturesRef.on('value', function (snapshot) {
            $("#admin-fixtures-table tbody tr").remove();
            var deleteFixturesAppend = "", addResultsAppend = "", deleteResultsAppend = "";
            var counter = 0;
            snapshot.forEach(function (childSnapshot) {
                var matchTime = new Date(childSnapshot.child("datetime").val());
                var team1 = childSnapshot.child("team1").val();
                var team2 = childSnapshot.child("team2").val();
                row = document.getElementById("admin-fixtures-table").getElementsByTagName("tbody")[0].insertRow();
                row.insertCell(0).innerHTML = childSnapshot.key;
                row.insertCell(1).innerHTML = matchTime.toDateString();
                row.insertCell(2).innerHTML = matchTime.toLocaleTimeString();
                row.insertCell(3).innerHTML = "<img class='fa fa-fw' src='images/" + team1 + ".png'/> " + team1;
                row.insertCell(4).innerHTML = "<img class='fa fa-fw' src='images/" + team2 + ".png'/> " + team2;
                var matchDescription = "<option value='" + childSnapshot.key + "'>" + childSnapshot.key + " - " + childSnapshot.child("team1").val() + " vs. " + childSnapshot.child("team2").val() + " on " + new Date(childSnapshot.child("datetime").val()).toDateString() + " at " + new Date(childSnapshot.child("datetime").val()).toLocaleTimeString() + "</option>";
                deleteFixturesAppend = matchDescription + deleteFixturesAppend;
                if (childSnapshot.child("teamWon").val() == "") {
                    addResultsAppend += matchDescription;
                }
                else {
                    deleteResultsAppend += matchDescription;
                }
                counter++;
            });
            numFixtures = counter;
            $("#admin-delete-fixtures-selects").html(deleteFixturesAppend);
            $("#admin-add-results-match-selects").html(addResultsAppend);
            $("#admin-delete-results-selects").html(deleteResultsAppend);
            $("#admin-add-fixtures-match-selects").html("<option value='" + (numFixtures + 1) + "'>" + (numFixtures + 1) + "</option>");
            $("#admin-add-fixtures-team1-selects").html("");
            $("#admin-add-fixtures-team2-selects").html("");
            $("#admin-add-results-team-selects").html("");
            teamsRef.once('value', function (teamsSnap) {
                teamsSnap.forEach(function (childTeamsSnap) {
                    $("#admin-add-fixtures-team1-selects").append("<option value='" + childTeamsSnap.key + "'>" + childTeamsSnap.key + "</option>");
                    $("#admin-add-fixtures-team2-selects").append("<option value='" + childTeamsSnap.key + "'>" + childTeamsSnap.key + "</option>");
                    $("#admin-add-results-team-selects").append("<option value='" + childTeamsSnap.key + "'>" + childTeamsSnap.key + "</option>");
                });
            });
        });

        $("body").on('submit', '#admin-add-fixtures-form', function () {
            var num = (numFixtures + 1);
            var team1 = $("#admin-add-fixtures-team1-selects").find(":selected").text();
            var team2 = $("#admin-add-fixtures-team2-selects").find(":selected").text();
            var date = $("#admin-add-fixtures-date").val();
            var time = $("#admin-add-fixtures-time").val();

            console.log("Attempting to add new fixture: Match " + num + ", " + team1 + " vs. " + team2 + " on " + date + " at " + time);
            var diff = new Date(date).getTime() - new Date().getTime();
            if (diff < 0) {
                alert("Seems like this is in the past.");
            } else if (team1 == team2) {
                alert("Teams are the same.");
            } else {
                if (confirm("Do you want to add the new fixture: Match " + num + ", " + team1 + " vs. " + team2 + " on " + date + " at " + time + "?")) {
                    console.log(new Date(date).toDateString() + " " + new Date(date + " " + time).toTimeString());
                    fixturesRef.child(numFixtures + 1).update({
                        datetime: new Date(date).toDateString() + " " + new Date(date + " " + time).toTimeString(),
                        numberWon: "",
                        typeWon: "",
                        teamWon: "",
                        team1: team1,
                        team2: team2
                    });

                    alert("Submitted.");
                }
            }
        });

        $("body").on('submit', '#admin-delete-fixtures-form', function () {
            var del = $("#admin-delete-fixtures-selects").find(":selected");
            var delVal = parseInt(del.val());
            if (confirm("Delete the following: Match " + del.text() + "?")) {
                if (delVal != numFixtures) {
                    fixturesRef.child(delVal).remove();
                    var i = delVal + 1;
                    fixturesRef.once('value', function (miniSnap) {
                        miniSnap.forEach(function (childMiniSnap) {
                            if (childMiniSnap.key >= i) {
                                fixturesRef.child(i - 1).set(childMiniSnap.val());
                                fixturesRef.child(i).remove();
                                i++;
                            }
                        });
                    });
                } else {
                    fixturesRef.child(delVal).remove();
                }
            }
        });

        $("body").on('click', '#admin-add-results-team-selects', function (event) {
            event.preventDefault();
            if ($(this).val() == 'Draw') {
                $("#admin-add-results-number-fieldset").prop("disabled", true);
                $("#admin-add-results-type-fieldset").prop("disabled", true);
            } else {
                $("#admin-add-results-number-fieldset").prop("disabled", false);
                $("#admin-add-results-type-fieldset").prop("disabled", false);
            }
        });

        $("body").on('submit', '#admin-add-results-form', function () {
            fixturesRef.once('value', function (snap) {
                var num = $("#admin-add-results-match-selects").find(":selected").val();
                var team1 = snap.child(num).child("team1").val();
                var team2 = snap.child(num).child("team2").val();
                var teamWon = $("#admin-add-results-team-selects").find(":selected").val();
                var numberWon = $("#admin-add-results-number-input").val();
                var typeWon = $("#admin-add-results-type-selects").find(":selected").val();
                if (teamWon == team1 || teamWon == team2) {
                    if (teamWon == "Draw") {
                        if (confirm("Adding result: Draw?")) {
                            fixturesRef.child(num).update({
                                numberWon: "0",
                                typeWon: "Draw",
                                teamWon: "draw"
                            });
                            alert("Added result: Draw");
                        }
                    } else {
                        if (confirm("Adding result: " + teamWon + " won by " + numberWon + " " + typeWon + "?")) {
                            fixturesRef.child(num).update({
                                numberWon: numberWon,
                                typeWon: typeWon,
                                teamWon: teamWon
                            });
                            alert("Added result: " + teamWon + " won by " + numberWon + " " + typeWon);
                        }
                    }
                } else {
                    alert("This team wasn't part of this match.");
                }
            });
        });
        
        $("body").on('submit', '#admin-delete-results-form', function () {
            var del = $("#admin-delete-results-selects").find(":selected");
            var delVal = parseInt(del.val());
            if (confirm("Delete result from: Match " + del.text() + "?")) {
                    fixturesRef.child(delVal).update ({
                        teamWon: "",
                        typeWon: "",
                        numberWon: ""
                    });
            }
        });
        
        var day = "";
        var dayCounter = 0;
        fixturesRef.once('value', function (fixturesSnap) {
            fixturesSnap.forEach(function (childSnapshot) {
                var matchTime = new Date(childSnapshot.child("datetime").val());
                var diff = matchTime.getTime() - new Date().getTime();

                if (diff < 0 && childSnapshot.child("teamWon").val() != "") {
                    var team1 = childSnapshot.child("team1").val();
                    var team2 = childSnapshot.child("team2").val();
                    var teamWon = childSnapshot.child("teamWon").val();
                    var typeWon = childSnapshot.child("typeWon").val();
                    var numberWon = childSnapshot.child("numberWon").val();

                    var row = document.getElementById("results-table").getElementsByTagName("tbody")[0].insertRow();
                    var cell0 = row.insertCell(0);
                    if (matchTime.toDateString() != day) {
                        dayCounter++;
                        day = matchTime.toDateString();
                        cell0.innerHTML = "<b>" + dayCounter + "</b>";
                    }
                    cell0.className = "my-points-table-day";

                    row.insertCell(1).innerHTML = childSnapshot.key;
                    row.insertCell(2).innerHTML = matchTime.toDateString();
                    row.insertCell(3).innerHTML = matchTime.toLocaleTimeString();
                    row.insertCell(4).innerHTML = "<img class='fa fa-fw' src='images/" + team1 + ".png'/> " + team1;
                    row.insertCell(5).innerHTML = "<img class='fa fa-fw' src='images/" + team2 + ".png'/> " + team2;
                        if (teamWon == "Draw") {
                            row.insertCell(6).innerHTML = "<b>Draw</b>";
                        } else {
                            row.insertCell(6).innerHTML = "<b>" + teamWon + "</b> by <b>" + numberWon + " " + typeWon + "</b>";
                        }
                }
            });

        });

    }


});
