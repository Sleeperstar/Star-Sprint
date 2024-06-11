window.onload = function() {
    class PreloadScene extends Phaser.Scene {
        constructor() {
            super({ key: 'PreloadScene' });
        }

        preload() {
            this.load.image('sky', 'assets/sky.png');
            this.load.image('ground', 'assets/platform.png');
            this.load.image('star', 'assets/star.png');
            this.load.image('bomb', 'assets/bomb.png');
            this.load.image('leftArrow', 'assets/left-arrow.png');
            this.load.image('rightArrow', 'assets/right-arrow.png');
            this.load.image('stateheart', 'assets/stateheart.png');
            this.load.image('heart', 'assets/heart.png');
            this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
            this.load.audio('collectSound', 'assets/collectcoin-6075.mp3');
            this.load.audio('ambientSound', 'assets/ambient.mp3');
            this.load.audio('menuSound', 'assets/menu-music.mp3');
        }

        create() {
            this.scene.start('MenuScene');
        }
    }

    class MenuScene extends Phaser.Scene {
        constructor() {
            super({ key: 'MenuScene' });
        }

        create() {
            this.add.image(400, 300, 'sky');

            const title = this.add.text(400, 100, 'Star Sprint', { fontSize: '64px', fill: '#fff' });
            title.setOrigin(0.5);

            const singlePlayerButton = this.add.text(400, 200, 'Solo un jugador', { fontSize: '32px', fill: '#fff' })
                .setOrigin(0.5)
                .setInteractive()
                .on('pointerdown', () => this.startSinglePlayer());

            const twoPlayerButton = this.add.text(400, 260, '2 jugadores', { fontSize: '32px', fill: '#fff' })
                .setOrigin(0.5)
                .setInteractive()
                .on('pointerdown', () => this.startTwoPlayer());

            const infoButton = this.add.text(400, 320, 'Información', { fontSize: '32px', fill: '#fff' })
                .setOrigin(0.5)
                .setInteractive()
                .on('pointerdown', () => this.showInfo());

            const controlsButton = this.add.text(400, 380, 'Controles', { fontSize: '32px', fill: '#fff' })
                .setOrigin(0.5)
                .setInteractive()
                .on('pointerdown', () => this.showControls());

            this.difficultyText = this.add.text(400, 440, 'Fácil', { fontSize: '32px', fill: '#fff' })
                .setOrigin(0.5);

            const leftArrow = this.add.image(300, 440, 'leftArrow').setInteractive();
            const rightArrow = this.add.image(500, 440, 'rightArrow').setInteractive();

            leftArrow.on('pointerdown', () => this.changeDifficulty(-1));
            rightArrow.on('pointerdown', () => this.changeDifficulty(1));

            this.difficultyOptions = ['Fácil', 'Difícil'];
            this.currentDifficultyIndex = 0;

            this.menuSound = this.sound.add('menuSound', { loop: true });
            this.menuSound.play();
        }

        startSinglePlayer() {
            this.menuSound.stop();
            this.scene.start('GameScene', { players: 1, difficulty: this.difficultyOptions[this.currentDifficultyIndex] });
        }

        startTwoPlayer() {
            this.menuSound.stop();
            this.scene.start('GameScene', { players: 2, difficulty: this.difficultyOptions[this.currentDifficultyIndex] });
        }

        changeDifficulty(direction) {
            this.currentDifficultyIndex = Phaser.Math.Wrap(this.currentDifficultyIndex + direction, 0, this.difficultyOptions.length);
            this.difficultyText.setText(this.difficultyOptions[this.currentDifficultyIndex]);
        }

        showInfo() {
            this.menuSound.stop();
            this.scene.start('InfoScene');
        }

        showControls() {
            this.menuSound.stop();
            this.scene.start('ControlsScene');
        }
    }

    class InfoScene extends Phaser.Scene {
        constructor() {
            super({ key: 'InfoScene' });
        }
    
        create() {
            this.add.image(400, 300, 'sky');
            this.add.text(400, 100, 'Información del Juego', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
            this.add.text(400, 200, 'Este es un juego donde recolectas estrellas', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
            this.add.text(400, 230, 'y evitas bombas.', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
            this.add.text(400, 270, 'Desarrollado por Jhampier Quispe Huallpa', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
            this.add.text(400, 310, 'Ing. Sistemas UNMSM', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        
            const backButton = this.add.text(400, 500, 'Volver al Menú', { fontSize: '32px', fill: '#fff' })
                .setOrigin(0.5)
                .setInteractive()
                .on('pointerdown', () => this.scene.start('MenuScene'));
        }
        
    }
    
    class ControlsScene extends Phaser.Scene {
        constructor() {
            super({ key: 'ControlsScene' });
        }
    
        create() {
            this.add.image(400, 300, 'sky');
            this.add.text(400, 100, 'Controles del Juego', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
            this.add.text(400, 200, 'Jugador 1 (WASD):\nW - Saltar\nA - Izquierda\nD - Derecha', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
            this.add.text(480, 300, 'Jugador 2 (Flechas):\nFlecha Arriba - Saltar\nFlecha Izquierda - Izquierda\nFlecha Derecha - Derecha', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
            
            const backButton = this.add.text(400, 500, 'Volver al Menú', { fontSize: '32px', fill: '#fff' })
                .setOrigin(0.5)
                .setInteractive()
                .on('pointerdown', () => this.scene.start('MenuScene'));
        }
    }
    
    class GameScene extends Phaser.Scene {
        constructor() {
            super({ key: 'GameScene' });
        }
    
        init(data) {
            this.players = data.players;
            this.difficulty = data.difficulty || 'Fácil';
            this.score = [0, 0];  // Scores separados para cada jugador
            this.gameOver = false;
        }
    
        create() {
            this.add.image(400, 300, 'sky');
    
            const platforms = this.physics.add.staticGroup();
            platforms.create(400, 568, 'ground').setScale(2).refreshBody();
            platforms.create(600, 400, 'ground');
            platforms.create(50, 250, 'ground');
            platforms.create(750, 220, 'ground');
    
            this.playersArray = [];
            this.playersArray.push(this.createPlayer(100, 450, 0));  // Player 1
            if (this.players === 2) {
                this.playersArray.push(this.createPlayer(700, 450, 1));  // Player 2
            }
    
            this.stars = this.physics.add.group({
                key: 'star',
                repeat: 11,
                setXY: { x: 12, y: 0, stepX: 70 }
            });
    
            this.stars.children.iterate(child => {
                child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
            });
    
            this.bombs = this.physics.add.group();
    
            this.scoreTexts = [
                this.add.text(16, 16, 'P1 Score: 0', { fontSize: '32px', fill: '#000' }),
                this.add.text(540, 16, 'P2 Score: 0', { fontSize: '32px', fill: '#000' }).setVisible(this.players === 2)
            ];
    
            this.playersArray.forEach((player, index) => {
                this.physics.add.collider(player, platforms);
                this.physics.add.overlap(player, this.stars, (player, star) => this.collectStar(player, star, index), null, this);
                this.physics.add.collider(player, this.bombs, this.hitBomb, null, this);
            });
    
            this.physics.add.collider(this.stars, platforms);
            this.physics.add.collider(this.bombs, platforms);
    
            this.cursors = this.input.keyboard.createCursorKeys();
            this.wasd = {
                up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
                left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
                down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
                right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
            };
    
            this.sound.add('collectSound');
            this.ambientSound = this.sound.add('ambientSound', { loop: true });
            this.ambientSound.play();
    
            this.playersArray.forEach(player => {
                player.lives = 3;
                player.invincible = false;
            });
    
            this.livesTexts = [
                this.add.text(16, 48, 'P1 Vidas: 3', { fontSize: '32px', fill: '#000' }),
                this.add.text(540, 48, 'P2 Vidas: 3', { fontSize: '32px', fill: '#000' }).setVisible(this.players === 2)
            ];
    
            this.hearts = this.physics.add.group();
            this.physics.add.collider(this.hearts, platforms);
            this.physics.add.overlap(this.playersArray, this.hearts, this.collectHeart, null, this);
    
            this.nextHeartScore = 100;
        }
    
        createPlayer(x, y, playerIndex) {
            const player = this.physics.add.sprite(x, y, 'dude');
            player.setBounce(0.2);
            player.setCollideWorldBounds(true);
            this.anims.create({
                key: 'left',
                frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
                frameRate: 10,
                repeat: -1
            });
            this.anims.create({
                key: 'turn',
                frames: [{ key: 'dude', frame: 4 }],
                frameRate: 20
            });
            this.anims.create({
                key: 'right',
                frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
                frameRate: 10,
                repeat: -1
            });
            player.playerIndex = playerIndex;  // Asigna el índice del jugador
            return player;
        }
    
        update() {
            if (this.gameOver) return;
    
            this.playersArray.forEach((player, index) => {
                if (!player.active) return;
    
                this.handlePlayerControls(player, index === 0 ? this.wasd : this.cursors);
    
                if (player.invincible) {
                    player.alpha = Math.abs(Math.sin(this.time.now / 100)) * 0.5 + 0.5;
                } else {
                    player.alpha = 1;
                }
            });
    
            if (this.score[0] + this.score[1] >= this.nextHeartScore) {
                this.generateHeart();
                this.nextHeartScore += 100;
            }
        }
    
        handlePlayerControls(player, controls) {
            if (controls.left.isDown) {
                player.setVelocityX(-160);
                player.anims.play('left', true);
            } else if (controls.right.isDown) {
                player.setVelocityX(160);
                player.anims.play('right', true);
            } else {
                player.setVelocityX(0);
                player.anims.play('turn');
            }
    
            if (controls.up.isDown && player.body.touching.down) {
                player.setVelocityY(-330);
            }
        }
    
        collectStar(player, star, playerIndex) {
            star.disableBody(true, true);
    
            this.score[playerIndex] += 10;
            this.scoreTexts[playerIndex].setText(`P${playerIndex + 1} Score: ` + this.score[playerIndex]);
    
            if (this.stars.countActive(true) === 0) {
                this.stars.children.iterate(child => {
                    child.enableBody(true, child.x, 0, true, true);
                });
    
                const x = player.x < 400 ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
    
                const bomb = this.bombs.create(x, 16, 'bomb');
                bomb.setBounce(1);
                bomb.setCollideWorldBounds(true);
                bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
            }
        }
    
        hitBomb(player, bomb) {
            if (player.invincible) return;
    
            player.setTint(0xff0000);
            player.lives -= 1;
            this.updateLivesText(player);
    
            if (player.lives <= 0) {
                player.setActive(false).setVisible(false);
                this.checkGameOver();
            } else {
                player.invincible = true;
                this.time.addEvent({
                    delay: 1000,
                    callback: () => {
                        player.invincible = false;
                        player.clearTint();
                    }
                });
            }
        }
    
        checkGameOver() {
            if (this.playersArray.every(player => player.lives <= 0)) {
                this.gameOver = true;
                this.physics.pause();
                this.ambientSound.stop();
    
                let winnerText = 'Game Over';
                if (this.score[0] > this.score[1]) {
                    winnerText = 'P1 Wins!';
                } else if (this.score[1] > this.score[0]) {
                    winnerText = 'P2 Wins!';
                } else {
                    winnerText = 'Draw!';
                }
    
                this.add.text(400, 300, winnerText, { fontSize: '64px', fill: '#000' }).setOrigin(0.5);
    
                const restartButton = this.add.text(400, 400, 'Reiniciar Juego', { fontSize: '32px', fill: '#fff' })
                    .setOrigin(0.5)
                    .setInteractive()
                    .on('pointerdown', () => this.scene.restart());
    
                const menuButton = this.add.text(400, 500, 'Volver al Menú', { fontSize: '32px', fill: '#fff' })
                    .setOrigin(0.5)
                    .setInteractive()
                    .on('pointerdown', () => this.scene.start('MenuScene'));
            }
        }
    
        collectHeart(player, heart) {
            heart.disableBody(true, true);
            player.lives += 1;
            this.updateLivesText(player);
        }
    
        updateLivesText(player) {
            this.livesTexts[player.playerIndex].setText(`P${player.playerIndex + 1} Vidas: ` + player.lives);
        }
    
        generateHeart() {
            const x = Phaser.Math.Between(0, 800);
            const y = Phaser.Math.Between(0, 450);
            const heart = this.hearts.create(x, y, 'heart');
            heart.setScale(1.15);
            heart.setBounce(1);
            heart.setCollideWorldBounds(true);
            heart.setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(-200, 200));
        }
    }

    const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 300 },
                debug: false
            }
        },
        scene: [PreloadScene, MenuScene, InfoScene, ControlsScene, GameScene] // Agregar las escenas InfoScene y ControlsScene aquí
    };

    const game = new Phaser.Game(config);
};