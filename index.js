


let usernameInput;


let players=[];
var  playerSize=50
function openPopup() {
    const popup = document.getElementById("popup");
    popup.classList.remove("hidden");
}

function openChat() {
    const popup = document.getElementById("popup");
    const chatContainer = document.getElementById("chatContainer");
    usernameInput = document.getElementById("usernameInput").value;


    if (usernameInput !== "") {
        popup.style.display = "none";
        const message = {
            x:0,
            y:0,
            id:usernameInput
        };

        const player = document.createElement("div");

        player.classList.add("player");

        player.textContent=usernameInput;

        player.id="player"

        players.push(player)

        Client.send("/app/player", {}, JSON.stringify(message));
    } else {
        alert("Digite um nome válido!");
    }



}













document.addEventListener('DOMContentLoaded', function () {
    // Variáveis do jogo


    const playerSpeed = 5;


    window.addEventListener('keydown', function (event) {
        switch (event.key) {
            case 'ArrowUp':
                movePlayer(0, -playerSpeed);
                break;
            case 'ArrowDown':
                movePlayer(0, playerSpeed);
                break;
            case 'ArrowLeft':
                movePlayer(-playerSpeed, 0);
                break;
            case 'ArrowRight':
                movePlayer(playerSpeed, 0);
                break;
        }
    });

    // Função para mover o jogador
    function movePlayer(dx, dy) {

        var newX = dx;
        var newY =  dy;
        const player = {
            x:dx,
            y: dy,
            id:usernameInput
        };


        // Verificar limites da tela
        if (newX >= 0 && newX + playerSize <= 800) {

            sendMessage(player);
        }

        if (newY >= 0 && newY + playerSize <= 800) {

            sendMessage(player);
        }


    }


});


const socket = new SockJS('http://tupa.tech:8081/conect');
const Client = Stomp.over(socket);




function sendMessage(player) {


    const message = {
        x:player.x,
        y: player.y,
        id:usernameInput
    };

    Client.send("/app/player", {}, JSON.stringify(message));


}



function displayMessage(x, y, id) {
    if (players.length !== 0) {
        let playerExists = false;

        for (let j = 0; j < players.length; j++) {


            console.log(id)
            if (players[j].textContent === id) {

                console.log("------------------" +id)

                let newX = x;
                const newY = y;

                // Verificar limites da tela
                if (newX >= 0 && newX + playerSize <= window.innerWidth) {
                    players[j].style.left = newX + 'px';
                }

                if (newY >= 0 && newY + playerSize <= window.innerHeight) {
                    players[j].style.top = newY + 'px';
                }

                document.body.appendChild(players[j]);
                playerExists = true;
                break; // Se encontrou o jogador, não precisa verificar o resto do array
            }
        }

        if (!playerExists) {
            const player2 = document.createElement("div");
            player2.classList.add("player");
            player2.textContent =id;
            player2.id = "player";
            players.push(player2);
            document.body.appendChild(player2);
        }
    }
}
function displayEnemy(x, y) {
    console.log("enemy")
    const enemy = document.createElement("div");
    enemy.classList.add("enemy");
    enemy.textContent = "Inimigo";
    enemy.style.left = x + 'px';
    enemy.style.top = y + 'px';
    document.body.appendChild(enemy);
}

function connect(){
    Client.connect({}, function (frame) {
        console.log('Conectado: ' + frame);


        Client.subscribe('/canal', function (mesagem) {
            const chatMessage = JSON.parse(mesagem.body);
            if (chatMessage.tipo==="player"){
            displayMessage(chatMessage.x, chatMessage.y, chatMessage.id);}
if (chatMessage.tipo==="removeEnemy"){
    removeEnemyByPosition(chatMessage.x, chatMessage.y);
}
            if (Array.isArray(chatMessage)){
                for (const chatMessageElement of chatMessage) {
                    displayEnemy(chatMessageElement.x, chatMessageElement.y)

                }
            }
        });
    });



    function removeEnemyByPosition(x, y) {
        const margem = 5; // Ajuste conforme necessário
        const enemies = document.querySelectorAll('.enemy');

        enemies.forEach(enemy => {
            const enemyX = parseInt(enemy.style.left, 10);
            const enemyY = parseInt(enemy.style.top, 10);

            if (Math.abs(enemyX - x) < margem && Math.abs(enemyY - y) < margem) {
                enemy.remove();
            }
        });
    }


}


connect();
openPopup();
