const GameState = {
    PLAYING: 0,
    WAITINGFORCLICK: 1,
}

const state = {
    "playername": "",
    "last_message_label": "",
    "state": GameState.PLAYING,
    "currentIntro": 1,
    "notifications": [],
    "tasks": []
}

var dialogues = {
    messages: [
        {
            "label": "intro",
            "message": "Bonjour ! Je suis <b>Maria</b>, votre assistante personnelle, mon but est d’être à votre écoute pour optimiser au mieux votre hygiène de vie !",
            "postfunction": function () { writeMessage(dialogues.messages[1]); }
        },
        {
            "label": "intro2",
            "message": "Commençons par quelques questions, tout d'abord, quelle est votre nom ?",
            "postfunction": function () {
                hideMessageBox();
                document.getElementById("setup-screen").style = "display: block; opacity: 1 !important;";
                var continueButton = document.getElementById("continue-button");
                document.getElementById("name-input-field").addEventListener('input', function (e) {
                    if (e.target.value.length > 0) {
                        continueButton.removeAttribute("disabled")
                    } else {
                        continueButton.setAttribute("disabled", true)
                    }
                })

            }
        },
        {
            "label": "intro3",
            "prefunction": function() {
                document.getElementById("setup-screen").style = "display: block; opacity: 1 !important; z-index: -3;";
                state.playername = document.getElementById('name-input-field').value;
            },
            "message": `Oh! Ravie de vous rencontrer <b>[player]</b> ! Encore quelques questions supplémentaires afin de mieux vous connaître et ça devrait être bon !`,
            "postfunction": function() {
                hideMessageBox();
                document.getElementById("setup-screen").style = "display: block; opacity: 1 !important; z-index: 1;";
                document.getElementById("setup-screen-1").style = "display: none;"
                document.getElementById("setup-screen-2").style = "display: initial!important; opacity: 1"
            }
        },
        {
            "label": "intro-last",
            "prefunction": function () {
                document.getElementById("setup-screen").style = "opacity: 1 !important; z-index: -3;";
            },
            "message": "Hmm, des choix intéressants... Ok! Tout est prêt. J'ai ajouté toutes les tâches nécessaire à votre quotidien à la liste",
            "postfunction": function() {
                hideMessageBox();
                document.getElementById("main-screen").style = "display: block;"
                writeMessage("next");
            }
        },
        {
            "label": "day1-intro",
            "message": "Bienvenue dans l'interface principale de <b>QOOL</b> ! Vous pouvez ici voir la date actuelle et les tâches à accomplir aujourd'hui.",
            "postfunction": function() {
                writeMessage("next");
                setPhoneTime("07:50")
            }
        },
        {
            "label": "day1-second",
            "message": "Pour \"Compléter\" une tâche, il suffit simplement d'appuyer dessus! D'ailleurs, il semblerait qu'il soit bientôt l'heure de nourir votre chat!",
            "postfunction": function() {
                hideMessageBox();
                state.tasks[0].node.addEventListener("click", function() {
                    setTimeout(function() {writeMessage("next");}, 1000)
                });
            }
        },
        {
            "label": "day1-cat-fed",
            "message": "Le saviez-vous ? Selon certaines études, les chats domestiques dormiraient environ 90 % du temps tandis qu’ils ne dormaient que 15 % du temps à l’état sauvage ! N’hésitez pas à passer du temps à jouer avec votre chat.",
            "postfunction": function () {
                writeMessage("next");
            }
        },
        {
            "label": "day1-cat-fed-2",
            "message": "Vous n'avez aucune autre tâches avant 17h aujourd'hui. Un rappel sera émis à 16h50. Amusez-vous bien !",
            "postfunction": function() {
                hideMessageBox();
                enableNode(state.tasks[1].node);
                changeDate(state.currentDate.format('DD/MM/YYYY'), "16:50", true, function() {
                    writeMessage("next");
                })
            }
        },
        {
            "label": "day1-gym",
            "message": "<b>\"Aller au gym\"</b> débute dans 10 minutes ! Votre salle de sport préférée est malheureusement fermée exceptionnellement aujourd'hui, j'ai donc mis les informations concernant votre seconde favorite sur votre GPS. Pas besoin de me remercier !",
            "postfunction": function() {
                hideMessageBox();
                state.tasks[1].node.addEventListener("click", function () {
                    setTimeout(function () { writeMessage("next"); }, 800)
                });
            }
        },
        {
            "label": "day1-gym-confirm",
            "message": "L’activité physique favorise la production d’endorphine, des molécules responsable du bien-être. Ses effets ne durent que peu de temps, il est alors important de pratiquer une activité physique régulière pour rester d’aplomb au quotidien !",
            "postfunction": function() {
                hideMessageBox();
                enableNode(state.tasks[2].node);
                changeDate(state.currentDate.format('DD/MM/YYYY'), "18:30", true, function() {
                    state.tasks[2].node.addEventListener("click", function () {
                        setTimeout(function () { writeMessage("next"); }, 800)
                    });
                });
            }
        },
        {
            "label": "day1-shower",
            "message": "Vous semblez avoir passé plus de temps qu’initialement prévu au gym, comptez sur moi pour optimiser davantage votre planning pour demain ! C’est également l’occasion de vous rappeler que la tâche <b>\"Cuisiner\"</b> débute dans 30 minutes, j'ai noté quelques recettes intéressantes... Bon appétit <b>[player]</b> !",
            "postfunction": function () {
                hideMessageBox();
                enableNode(state.tasks[3].node);
                changeDate(state.currentDate.format('DD/MM/YYYY'), "19:50", true, function () {
                    state.tasks[3].node.addEventListener("click", function () {
                        setTimeout(function () { writeMessage("next"); }, 800)
                    });
                });
            }
        },
        {
            "label": "day1-eating",
            "message": "Alors, bien mangé? Contente que vous ayez aimé mes recommandations ! Allez hop, maintenant un peu de lecture et puis au lit !",
            "postfunction": function() {
                hideMessageBox();
                enableNode(state.tasks[4].node);
                enableNode(state.tasks[5].node);
                changeDate(state.currentDate.format('DD/MM/YYYY'), "23:30", true, function () {
                    const resultFunction = function () {
                        if (state.tasks[4].state && state.tasks[5].state) {
                            setTimeout(function () { writeMessage("next"); }, 800)
                        }
                    }

                    state.tasks[4].node.addEventListener("click", resultFunction);
                    state.tasks[5].node.addEventListener("click", resultFunction);
                });
            }
        },
        {
            "label": "day1-end",
            "message": "Félicitations, votre première journée au sein de l'application QOOl est un succès ! Vous avez accompli toutes les tâches d'aujourd'hui ! On se revoit demain pour d'autres tâches, bonne nuit !",
            "postfunction": function () {
                clearTasks();
                changeDate('24/11/2024', "23:30", true, function () {
                    console.log("gfdgd");
                });
            }
        }
    ]
}

function addNotification(kind) {
    const notificationList = document.getElementById("phone-notifications");

    var notificationNode = document.createElement("object");
    notificationNode.height = "19px"
    notificationNode.data = `assets/${kind}.svg`

    notificationList.appendChild(notificationNode);
    state.notifications.push({ "kind": kind })
}

function setPhoneTime(time){
    const phoneTime = document.getElementById("phone-time");
    phoneTime.textContent = time;

    state.phoneTime = time;
}

function clearTasks() {
    state.tasks = [];

    const taskList = document.getElementById("task-list");
    taskList.innerHTML = "";
}

function toggleTaskList(state) {
    const mainScreen = document.getElementById("main-screen");
    const taskList = document.getElementById("task-list");

    if (state) {
        taskList.style.zIndex = 1;
        mainScreen.style.removeProperty("overflow-y");
    } else {
        taskList.style.removeProperty("z-index");
        mainScreen.style.overflowY = "hidden";
    }
}

function hideMessageBox() {
    const dialogue = document.getElementById("dialogue");
    const dialogueBox = dialogue.getElementsByClassName("box")[0];

    dialogue.style = "display: none;"
    dialogueBox.innerHTML = "";
}

function writeMessage(message) {
    if (message === "next"){
        message = dialogues.messages[dialogues.messages.findIndex((element) => {
            return element.label === state.last_message_label
        }) + 1]
    }

    const clickablezone = document.getElementById("clickable-zone");
    const overlay = document.getElementById("overlay");
    const dialogue = document.getElementById("dialogue");
    const dialogueBox = dialogue.getElementsByClassName("box")[0];
    dialogue.style = "display: initial";

    overlay.className = "overlay";

    toggleTaskList(false);

    if (message.prefunction) {
        message.prefunction()
    }

    var i = 0;
    var speed = 35;
    var messageText = message.message.replace("[player]", state.playername);

    var consoleTyper = function (text) {
        speed = 35;
        if (i <= text.length) {
            if (text[i] == "<") {
                i += 3;
            }
            dialogueBox.innerHTML = text.substr(0, i);


            if (["!", ".", "?"].includes(text[i - 1])) {
                speed = 200;
            }

            if ([","].includes(text[i - 1])) {
                speed = 50;
            }

            setTimeout(consoleTyper, speed, text);

            i += 1;
        } else {
            var app = document.getElementById("app");
            app.style = "cursor: pointer;"

            var onClickFunction = function () {
                toggleTaskList(true);
                overlay.className = "";
                app.style = ""
                clickablezone.removeEventListener('click', onClickFunction);

                if (message.postfunction) { message.postfunction(); }
            }

            clickablezone.addEventListener('click', onClickFunction)
        }
    }
    setTimeout(consoleTyper, speed, messageText);

    state.last_message_label = message.label;
}

function enableNode(node) {
    node.setAttribute("disabled", false)
}

function changePageIntro(id) {
    const introNext = document.getElementsByClassName('intro-next')[0]
    const introScreen = document.getElementById("intro-screen");
    const setupScreen = document.getElementById("setup-screen");
    const introNavigation = document.getElementsByClassName("intro-navigation")[0];
    const introNavigationDots = document.getElementsByClassName("intro-navigation-dot")[0];
    const introCurrentScreen = document.getElementsByClassName(`intro-screen-${state.currentIntro}`)[0];
    introCurrentScreen.style = "opacity: 0";

    Array.prototype.forEach.call(introNavigationDots.children, child => {
        child.className = "";
    });

    if (id <= 3) {
        introNavigationDots.children[id - 1].className = "current";
        const newPage = document.getElementsByClassName(`intro-screen-${id}`)[0];
        newPage.style = "opacity: 1;";
    }

    if (id === 1) {
        introNext.textContent = "Suivant"
        introScreen.style = "background-color: hsl(204, 86%, 53%) !important;"
        introNavigation.classList.remove("dark");
    } else if (id === 2) {
        introNext.textContent = "Suivant"
        introScreen.style = "background-color: #00c37f !important;"
        introNavigation.classList.remove("dark");
    } else if (id === 3) {
        introNext.textContent = "Fin"
        introScreen.style = "background-color: hsl(48, 100%, 67%) !important;"
        introNavigation.classList.add("dark");
    } else if (id === 4) {
        introScreen.style = "display:none !important;"
        setupScreen.style = "display: block !important;"
        writeMessage(dialogues.messages[0])
    }

    state.currentIntro = id;
}

function changeTitle(newTitle) {
    const currentTitle = document.getElementById("current-title");

    currentTitle.textContent = newTitle;
}

function changeDate(newDate, newTime, cinematic, postfunction) {
    if (cinematic) {
        const body = document.getElementsByTagName("body")[0];
        const timeskip = document.getElementById("timeskip");
        const timeskipDate = document.getElementById("timeskip-date");
        const timeskipHour = document.getElementById("timeskip-time");
        const timeskipBlur = document.getElementById("timeskip-blur");
        toggleTaskList(false);
        timeskip.classList.add("timeskip-transition");
        timeskip.style.display = "flex";
        setTimeout(function() {timeskip.style.opacity = "1";}, 10);
        body.classList.add("darken");

        timeskipDate.style.removeProperty("text-shadow");
        timeskipDate.textContent = state.currentDate.format('DD MMM YYYY');
        timeskipHour.style.removeProperty("text-shadow");
        timeskipHour.textContent = state.currentDate.format('HH[h]mm');

        setTimeout(() => {
            timeskipDate.style = "opacity: 1;"
            timeskipHour.style = "opacity: 1;"
        }, 1500);

        setTimeout(() => {
            timeskipBlur.style="filter: blur(25px)"
        }, 3500);

        setTimeout(() => {
            state.currentDate = dayjs(newDate + " " + newTime, "DD/MM/YYYY HH:mm", "fr");
            setPhoneTime(state.currentDate.format("HH:mm"));

            const newDateText = state.currentDate.format('DD MMM YYYY');
            const newHourText = state.currentDate.format('HH[h]mm');

            if (newDateText !== timeskipDate.textContent) {
                timeskipDate.textContent = state.currentDate.format('DD MMM YYYY');
                timeskipDate.style.textShadow = "0 0 2px white"
            }

            if (newHourText !== timeskipHour.textContent) {
                timeskipHour.textContent = state.currentDate.format('HH[h]mm');
                timeskipHour.style.textShadow = "0 0 5px white"
            }
        }, 6000);

        setTimeout(() => {
            timeskipBlur.style = "filter: blur(0px)"
        }, 8500);

        setTimeout(() => {
            timeskip.style = "display: flex !important; opacity: 0;"
            timeskipDate.style = "opacity: 0;"
            timeskipHour.style = "opacity: 0;"
            body.classList.remove("darken");
        }, 11500);

        setTimeout(() => {
            timeskip.style = "display: none;";
            timeskip.classList.remove("timeskip-transition");
            if (postfunction) postfunction();
        }, 13000);
    } else {
        state.currentDate = dayjs(newDate + " " + newTime, "DD/MM/YYYY HH:mm", "fr");
        setPhoneTime(state.currentDate.format("HH:mm"))
    }

    const currentDate = document.getElementById("current-date");
    currentDate.textContent = state.currentDate.format('DD MMM YYYY');

}

function addTaskToList(title, subtitle, color, disabled = false) {
    const taskTemplate = `
                        <div class="level">
                            <div class="level-left" style="flex-direction: column; align-items:initial;">
                                <p class="title is-4">${title}</p>
                                <p class="subtitle">${subtitle}</p>
                            </div>
                            <div class="level-right" style="flex-direction: column; margin-right:-10px;">
                                <div class="task-checkmark">
                                </div>
                            </div>
                        </div>`;
    const taskList = document.getElementById("task-list");

    var taskNode = document.createElement("div");
    taskNode.className = `tile is-child notification is-${color} card`
    taskNode.addEventListener('click', function () { toggleTask(slugify(title), true) })
    taskNode.innerHTML = taskTemplate;

    if (disabled){
        taskNode.setAttribute("disabled", true)
    }

    taskList.appendChild(taskNode);
    state.tasks.push({ "id": slugify(title), "state": false, "node": taskNode})
}

function toggleTask(id, newState) {
    const task = state.tasks.find(element => element.id === id)

    if (task.node.getAttribute("disabled") === "true") {
        return;
    }

    const checkmarkTemplate = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="width: 68px;
                                height: 55px;
                                fill: #fff;
                                position: relative;
                                top: -3px;" xml:space="preserve">
                                <path d="M504.502,75.496c-9.997-9.998-26.205-9.998-36.204,0L161.594,382.203L43.702,264.311c-9.997-9.998-26.205-9.997-36.204,0
                                c-9.998,9.997-9.998,26.205,0,36.203l135.994,135.992c9.994,9.997,26.214,9.99,36.204,0L504.502,111.7
                                C514.5,101.703,514.499,85.494,504.502,75.496z" />
                            </svg>`;


    if (newState === true) {
        task.node.classList.add("checked");
        task.node.getElementsByClassName("task-checkmark")[0].innerHTML = checkmarkTemplate;
        task.state = true;
    } else {
        task.node.classList.remove("checked");
        task.node.getElementsByClassName("task-checkmark")[0].innerHTML = "";
        task.state = false;
    }
}

// https://gist.github.com/codeguy/6684588
function slugify(str) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    var to = "aaaaeeeeiiiioooouuuunc------";
    for (var i = 0, l = from.length; i < l; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes

    return str;
}

document.addEventListener('DOMContentLoaded', function () {
    const introNavigationDots = document.getElementsByClassName("intro-navigation-dot")[0];
    document.getElementsByClassName("intro-next")[0].addEventListener('click', function () { changePageIntro(state.currentIntro + 1) })

    hideMessageBox();
    //document.getElementById("intro-screen").style = "display:none !important;"
    //document.getElementById("main-screen").style = "display: block;"

    changeTitle("Aujourd'hui");
    changeDate('23/11/2024', "07:50")
    addTaskToList("Nourir le chat", "08:00", "success");
    addTaskToList("Aller au gym", "17:00", "info", true);
    addTaskToList("Prendre une douche", "18:00", "warning", true);
    addTaskToList("Cuisiner", "19:00", "primary", true);
    addTaskToList("Lecture", "20:00", "danger", true);
    addTaskToList("Aller au lit", "23:00", "link", true);

    addNotification("messenger");
    //writeMessage(dialogues.messages[11]);

    Notification.requestPermission().then(function (result) {
        console.log(result);
    });
}, false);