function saveHighscores(records) {
    const url = "/gethighsores";

    async function postData(url = url, data = {}) {
        // Default options are marked with *
        return await fetch(url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(data)
        });
    }

    postData(url, records)
        .then(async (data) => {
            const result = await data.json();
        })
}



const scores = [];
const names = [];
const recordsBlock = createElement({tagName: "div", className: "records"});

function getHighscores() {
    const url = "/highscores";
    fetch(url).then(async (response) => {
        const result = await response.json();
        for (let i = 0; i < result.highscores.length; i++) {
            delete result.highscores[i]._id;
            delete result.highscores[i].__v;
            const {name, score} = result.highscores[i];
            names.push(name);
            scores.push(score);
            const p = createElement({tagName: "p"});
            p.innerText = `${i + 1} : ${result.highscores[i].name} : ${result.highscores[i].score}`;
            recordsBlock.appendChild(p);
        }
    });
}

getHighscores();
const $ = (id) => {
    return document.getElementById(id)
};

function _(className) {
    return document.querySelector("." + className)
}

function createElement({tagName = "div", className: classList = "", attributes = {}}) {
    const element = document.createElement(tagName);
    if (classList !== "") {
        const classNames = classList.split(' ').filter(Boolean);
        element.classList.add(...classNames);
    }
    Object.keys(attributes).forEach(key => {
        element.setAttribute(key, attributes[key]);
    });
    return element;
}
function showRecords() {
    $("menu").appendChild(recordsBlock);

}
function newGame() {
    $("menu").style.display = "none";
    _("main-game").style.display = "block";
    const main = _("main"); // Блок с ячейками
    main.style.display = "block";
    _("controls").appendChild(recordsBlock);
    const tetris = createElement({className: "tetris"});
    for (let i = 0; i < 180; i++) {
        const excel = createElement({className: "excel"});
        tetris.appendChild(excel);
    } // Заполняем ячейки

    main.appendChild(tetris);
    const excel = document.getElementsByClassName("excel");

    let j = 0;
    for (let Y = 18; Y > 0; Y--) {
        for (let X = 1; X < 11; X++) {
            excel[j].setAttribute("posX", "" + X);
            excel[j].setAttribute("posY", "" + Y);
            j++;
        }
    }

    let currentFigure = 0;
    let bodyOfFigure = 0;
    let rotateState = 1;
    let x = 5;
    let y = 15;
    let canBeRotated = true;
    let score = 0;
    const mainArr = [
        [// Прямая вертикальная палка
            [0, 1],
            [0, 2],
            [0, 3],
            [ // Поворот на 90
                [-1, 1],
                [0, 0],
                [1, -1],
                [2, -2]
            ],
            [ // поворот на 180
                [1, -1],
                [0, 0],
                [-1, 1],
                [-2, 2]
            ],
            [ // Поворот на 270
                [-1, 1],
                [0, 0],
                [1, -1],
                [2, -2]
            ],
            [ // поворот на 360
                [1, -1],
                [0, 0],
                [-1, 1],
                [-2, 2]
            ]
        ],
        [// квадрат
            [1, 0],
            [0, 1],
            [1, 1],
            [ // Поворот на 90
                [0, 0],
                [0, 0],
                [0, 0],
                [0, 0]
            ],
            [ // Поворот на 180
                [0, 0],
                [0, 0],
                [0, 0],
                [0, 0]
            ],
            [ // Поворот на 270
                [0, 0],
                [0, 0],
                [0, 0],
                [0, 0]
            ],
            [ // Поворот на 360
                [0, 0],
                [0, 0],
                [0, 0],
                [0, 0]
            ],
        ],
        [ // Буква L
            [1, 0],
            [0, 1],
            [0, 2],
            [ // Поворот на 90
                [0, 0],
                [-1, 1],
                [1, 0],
                [2, -1]
            ],
            [ // Поворот на 180
                [1, -1],
                [1, -1],
                [-1, 0],
                [-1, 0]
            ],
            [ // Поворот на 270
                [-1, 0],
                [0, -1],
                [2, -2],
                [1, -1]
            ],
            [ // Поворот на 360
                [0, -1],
                [0, -1],
                [-2, 0],
                [-2, 0]
            ],
        ],
        [ // Буква L наоборот
            [1, 0],
            [1, 1],
            [1, 2],
            [ // Поворот на 90
                [0, 0],
                [0, 0],
                [1, -1],
                [-1, -1]
            ],
            [ // Поворот на 180
                [0, -1],
                [-1, 0],
                [-2, 1],
                [1, 0]
            ],
            [ // Поворот на 270
                [2, 0],
                [0, 0],
                [1, -1],
                [1, -1]
            ],
            [ // Поворот на 360
                [-2, 0],
                [1, -1],
                [0, 0],
                [-1, 1]
            ],
        ],
        [ // Молния влево
            [1, 0],
            [1, 1],
            [2, 1],
            [ // Поворот на 90
                [2, -1],
                [0, 0],
                [1, -1],
                [-1, 0]
            ],
            [ // Поворот на 180
                [-2, 0],
                [0, -1],
                [-1, 0],
                [1, -1]
            ],
            [ // Поворот на 270
                [2, -1],
                [0, 0],
                [1, -1],
                [-1, 0]
            ],
            [ // Поворот на 360
                [-2, 0],
                [0, -1],
                [-1, 0],
                [1, -1]
            ],
        ],
        [ // Молния вправо
            [1, 0],
            [-1, 1],
            [0, 1],
            [ // Поворот на 90
                [0, -1],
                [-1, 0],
                [2, -1],
                [1, 0]
            ],
            [ // Поворот на 180
                [0, 0],
                [1, -1],
                [-2, 0],
                [-1, -1]
            ],
            [ // Поворот на 270
                [0, -1],
                [-1, 0],
                [2, -1],
                [1, 0]
            ],
            [ // Поворот на 360
                [0, 0],
                [1, -1],
                [-2, 0],
                [-1, -1]
            ],
        ],
        [// Т с маленьким хвостиком
            [1, 0],
            [2, 0],
            [1, 1],
            [ // Поворот на 90
                [1, 0],
                [0, 1],
                [0, 1],
                [0, 1]
            ],
            [ // Поворот на 180
                [0, 0],
                [-1, 0],
                [-1, 0],
                [1, -1]
            ],
            [ // Поворот на 270
                [0, 0],
                [0, 0],
                [0, 0],
                [-1, 1]
            ],
            [ // Поворот на 360
                [-1, 0],
                [1, -1],
                [1, -1],
                [0, -1]
            ]
        ]

    ];
    createFigure();

    let interval = setInterval(() => {
        move()
    }, 800);


    document.addEventListener("keydown", (e) => {
        let coordinates = getDataFromFigure();
        let [coordinates1, coordinates2, coordinates3, coordinates4] = coordinates;
        let canBeSwiped = true;

        function getNewState(a) {
            let newFigure = [
                getExcelByCoords([+coordinates1[0] + a, +coordinates1[1]]),
                getExcelByCoords([+coordinates2[0] + a, +coordinates2[1]]),
                getExcelByCoords([+coordinates3[0] + a, +coordinates3[1]]),
                getExcelByCoords([+coordinates4[0] + a, +coordinates4[1]]),
            ];
            for (let i = 0; i < 4; i++) {
                if (!newFigure[i] || newFigure[i].classList.contains("set")) {
                    canBeSwiped = false;
                }
            }
            if (canBeSwiped) {
                deleteFigure(bodyOfFigure);
                bodyOfFigure = newFigure;
                drawFigure(bodyOfFigure);
            }
        }

        function rotate() {

        }

        if (e.code === "ArrowRight") {
            getNewState(1)
        } else if (e.code === "ArrowLeft") {
            getNewState(-1)
        } else if (e.code === "ArrowDown") {
            move();
        } else if (e.code === "KeyD" && canBeRotated) {
            let newCordsArray;
            let newFigure;
            newCordsArray = [...mainArr[currentFigure][rotateState + 2]];
            newFigure = [
                getExcelByCoords([+coordinates1[0] + newCordsArray[0][0], +coordinates1[1] + newCordsArray[0][1]]),
                getExcelByCoords([+coordinates2[0] + newCordsArray[1][0], +coordinates2[1] + newCordsArray[1][1]]),
                getExcelByCoords([+coordinates3[0] + newCordsArray[2][0], +coordinates3[1] + newCordsArray[2][1]]),
                getExcelByCoords([+coordinates4[0] + newCordsArray[3][0], +coordinates4[1] + newCordsArray[3][1]]),
            ];
            for (let i = 0; i < 4; i++) {
                if (!newFigure[i] || newFigure[i].classList.contains("set")) {
                    canBeSwiped = false;
                }
            }
            if (canBeSwiped) {
                deleteFigure(bodyOfFigure);
                bodyOfFigure = newFigure;
                drawFigure(bodyOfFigure);
                canBeRotated = false;
                setTimeout(() => {
                    canBeRotated = true;
                }, 300);
            }
            if (rotateState < 4) {
                rotateState++;
            } else {
                rotateState = 1
            }
        }
    });


//move figure with some interval
    function move() {
        let moveFlag = true;
        let coordinates = getDataFromFigure();

        for (let i = 0; i < 4; i++) {
            if (coordinates[i][1] === 1 || getExcelByCoords([coordinates[i][0], coordinates[i][1] - 1]).classList.contains("set")) {
                moveFlag = false;
                break;
            }
        }

        if (moveFlag) {
            deleteFigure(bodyOfFigure);
            bodyOfFigure = changeCoords(coordinates);
            drawFigure(bodyOfFigure)
        } else {
            deleteFigure(bodyOfFigure);
            drawFigure(bodyOfFigure, "set");
            for (let i = 1; i < 15; i++) {
                let count = 0;
                for (let k = 1; k < 11; k++) {
                    if (document.querySelector(`[posX = "${k}"][posY = "${i}"`).classList.contains("set")) {
                        count++;
                        if (count === 10) {
                            for (let l = 1; l < 11; l++) {
                                getExcelByCoords([l, i]).classList.remove("set");
                            }
                            let set = document.querySelectorAll(".set");
                            let newSet = [];
                            for (let l = 0; l < set.length; l++) {
                                let setCoordinates = [set[l].getAttribute("posX"), set[l].getAttribute("posY")];
                                if (setCoordinates[1] > i) {
                                    set[l].classList.remove("set");
                                    newSet.push(getExcelByCoords([setCoordinates[0], setCoordinates[1] - i]))
                                }
                            }
                            for (let l = 0; l < newSet.length; l++) {
                                newSet[l].classList.add("set")
                            }
                            i--;
                            score += 10;
                            document.querySelector("input").value = `Score:${score}`;
                        }
                    }
                }
            }
            for (let i = 1; i < 11; i++) {
                if (getExcelByCoords([i, 15]).classList.contains("set")) {
                    clearInterval(interval);
                    alert(`Game ends ${score}`);
                    _("main-game").style.display = "none";
                    if (score > scores[9] || scores.length!==10) {
                        _("highscores-form").style.display = "block";
                        document.querySelector("form").addEventListener("submit", (e) => {
                            const records = [];
                            let scoresPush = false;
                            for (let k = 0; k < scores.length; k++) {
                                let obj = {name: "", score: ""};
                                obj.name = names[k];
                                obj.score = scores[k];
                                if (scoresPush) {
                                    if (k === 8) {
                                        break;
                                    }
                                } else {
                                    if (score > scores[k]) {
                                        obj.name = document.querySelector("#player-name").value;
                                        obj.score = score;
                                        let scoresPush = true;
                                    }
                                }
                                records.push(obj)
                            }
                            if (records.length !== 100) {
                                let obj = {name: "", score: ""};
                                obj.name = document.querySelector("#player-name").value;
                                obj.score = score;
                                records.push(obj);
                            }
                            saveHighscores({highscores: records});
                            console.log(records);
                        });

                    }
                    break;
                }
            }
            createFigure();
        }
    }

//Create figure
    function createFigure(figure/* индекс элемента в масиве*/ = getRandomFigure()) {
        rotateState = 1;
        currentFigure = figure;
        bodyOfFigure = [
            ...getFigureByCoordinates([[x, y], [x + mainArr[currentFigure][0][0], y + mainArr[currentFigure][0][1]], [x + mainArr[currentFigure][1][0], y + mainArr[currentFigure][1][1]], [x + mainArr[currentFigure][2][0], y + mainArr[currentFigure][2][1]]])
        ];
        for (let i = 0; i < 4; i++) {
            bodyOfFigure[i].classList.add("figure");
        }
    }

    function getRandomFigure() {
        return Math.round(Math.random() * (mainArr.length - 1));
    }


//Create figure

//draw and delete
    function drawFigure(figure, constant = "figure") {
        for (let i = 0; i < 4; i++) {
            figure[i].classList.add(constant);
        }
    }

    function deleteFigure(figure) {
        for (let i = 0; i < 4; i++) {
            figure[i].classList.remove("figure");
        }
    }

//draw and delete
//get data from page
    function getFigureByCoordinates([first, second, third, fourth]) {
        const figure = [
            getExcelByCoords(first),
            getExcelByCoords(second),
            getExcelByCoords(third),
            getExcelByCoords(fourth)
        ];
        return figure;
    }

    function getExcelByCoords([x, y]) {
        return document.querySelector(`[posX = "${x}"][posY = "${y}"`)
    }

//get data from page

//get data from figure
    function getDataFromFigure(figure = bodyOfFigure) {
        let coordinates = [
            [+figure[0].getAttribute("posX"), +figure[0].getAttribute("posY")],
            [+figure[1].getAttribute("posX"), +figure[1].getAttribute("posY")],
            [+figure[2].getAttribute("posX"), +figure[2].getAttribute("posY")],
            [+figure[3].getAttribute("posX"), +figure[3].getAttribute("posY")],
        ];
        return coordinates;
    }

//get data from figure


//returning the new figure with updated coordinates
    function changeCoords([first, second, third, fourth], direction = "down") {
        if (direction === "down") {
            return getFigureByCoordinates([[first[0], first[1] - 1], [second[0], second[1] - 1], [third[0], third[1] - 1], [fourth[0], fourth[1] - 1]]);
        } else if (direction === "right") {
            return getFigureByCoordinates([[first[0] + 1, first[1]], [second[0] + 1, second[1]], [third[0] + 1, third[1]], [fourth[0] + 1, fourth[1]]]);
        } else if (direction === "left") {
            return getFigureByCoordinates([[first[0] - 1, first[1]], [second[0] - 1, second[1]], [third[0] - 1, third[1]], [fourth[0] - 1, fourth[1]]]);
        }
    }

//returning the new figure with updated coordinates
}