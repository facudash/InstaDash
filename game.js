// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDqJn3lFqLFx1ar2vyEeDGRk7tACBCEX84",
    authDomain: "instadash-de1fc.firebaseapp.com",
    databaseURL: "https://instadash-de1fc-default-rtdb.firebaseio.com",
    projectId: "instadash-de1fc",
    storageBucket: "instadash-de1fc.appspot.com",
    messagingSenderId: "666217267831",
    appId: "1:666217267831:web:99bdaca69b8a7220237c72",
    measurementId: "G-EYXN5VSXVD"
};

// Inicializa Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database(app);
firebase.analytics(app);

// Mostrar el ranking en el menú de inicio
function displayTopScores() {
    const scoresRef = firebase.database().ref('scores').orderByChild('score').limitToLast(5);
    scoresRef.on('value', (snapshot) => {
        const scores = snapshot.val();
        const rankingList = document.getElementById('ranking-list');
        rankingList.innerHTML = ''; // Limpiar la lista antes de agregar nuevas puntuaciones

        if (scores) {
            const sortedScores = Object.values(scores).sort((a, b) => b.score - a.score);
            sortedScores.forEach((entry) => {
                const listItem = document.createElement('li');
                listItem.textContent = `${entry.name}: ${entry.score}`;
                rankingList.appendChild(listItem);
            });
        }
    });
}

// Iniciar el juego
function startGame() {
    document.getElementById('menu-container').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';

    // Iniciar la música del juego
    const gameMusic = document.getElementById('game-music');
    gameMusic.play();

    const gameContainer = document.getElementById('game-container');
    let character, obstacle;
    let score = 0;

    const scoreElement = document.createElement('div');
    scoreElement.style.position = 'absolute';
    scoreElement.style.top = '10px';
    scoreElement.style.left = '10px';
    scoreElement.style.color = 'white';
    scoreElement.style.fontSize = '20px';
    scoreElement.textContent = `Puntuación: ${score}`;
    gameContainer.appendChild(scoreElement);

    function jump() {
        let jumpHeight = 100;
        character.style.transition = 'bottom 0.3s';
        character.style.bottom = `${jumpHeight}px`;
        setTimeout(() => {
            character.style.bottom = '10px';
        }, 300);
    }

    function createObstacle() {
        obstacle = document.createElement('div');
        obstacle.style.width = '50px';
        obstacle.style.height = '50px';
        obstacle.style.backgroundImage = 'url("obstacle111.png")'; // Cambia el color por una imagen
        obstacle.style.backgroundSize = 'cover'; // Asegura que la imagen cubra todo el obstáculo
        obstacle.style.position = 'absolute';
        obstacle.style.bottom = '10px';
        obstacle.style.right = '0px';
        gameContainer.appendChild(obstacle);

        let obstacleSpeed = 18; // Velocidad inicial del obstáculo
        let speedIncrement = 0.5; // Incremento de velocidad
        let obstacleInterval = setInterval(() => {
            let obstacleRight = parseInt(obstacle.style.right);
            obstacle.style.right = (obstacleRight + obstacleSpeed) + 'px';

            if (obstacleRight >= window.innerWidth) {
                clearInterval(obstacleInterval);
                gameContainer.removeChild(obstacle);
                score++;
                scoreElement.textContent = `Puntuación: ${score}`;

                // Aumenta la velocidad a medida que el jugador avanza
                if (score % 3 === 0) {
                    obstacleSpeed += speedIncrement;
                }
            }

            const obstacleLeft = window.innerWidth - obstacleRight - parseInt(obstacle.style.width);
            const characterLeft = parseInt(character.style.left);
            const characterBottom = parseInt(character.style.bottom);

            if (
                obstacleLeft < characterLeft + 50 &&
                obstacleLeft + 50 > characterLeft &&
                characterBottom < 60
            ) {
                alert('¡Juego terminado!');
                gameMusic.pause(); // Detener la música
                gameMusic.currentTime = 0; // Reiniciar la música

                const playerName = prompt("Ingresa tu nombre:");
                if (playerName) {
                    const scoresRef = firebase.database().ref('scores');
                    scoresRef.push({
                        name: playerName,
                        score: score
                    });
                }
                clearInterval(obstacleInterval);
                location.reload(); // Recarga el juego después de una colisión
            }
        }, 20);
    }

    character = document.createElement('img');
    character.src = 'instagram-logo2.png';
    character.style.width = '50px';
    character.style.height = '50px';
    character.style.position = 'absolute';
    character.style.bottom = '10px';
    character.style.left = '10px';
    gameContainer.appendChild(character);

    document.addEventListener('keydown', jump);
    setInterval(createObstacle, 2000);
}

// Evento para el botón de iniciar
document.getElementById('start-button').addEventListener('click', startGame);

// Cargar el ranking al inicio
displayTopScores();

