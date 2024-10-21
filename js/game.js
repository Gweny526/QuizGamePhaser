let config = {
    type: Phaser.AUTO,
    width: 600,
    height: 640,
    physics: {
        default: 'arcade'
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    autoCenter: true
};
 
let game = new Phaser.Game(config);
let questionIndex = 0;
let questions;
let answerPanelImage = [];
let starImage = [];
let score = 0;
let nextQuestionImage;
let questionText;
let answerText1;
let answerText2;
let answerText3;
let restartImage;
let goodAnswerSound;
let wrongAnswerSound;
let tweenGoodAnswerPanel = [];
let tweenWrongAnswerPanel = [];
 
 
function preload() {
    //images
    this.load.image('background', './assets/Sprites/background.png');
    this.load.image('questionpanel', './assets/Sprites/Label1.png');
    this.load.image('answerpanel', './assets/Sprites/Label2.png');
    this.load.image('nextquestion', './assets/Sprites/Play.png');
    this.load.image('star', './assets/Sprites/Star.png')
    this.load.image('restart', './assets/Sprites/Restart.png')
 
    //data
    this.load.json('questions', './assets/Data/Questions.json');
   
    //sounds
    this.load.audio('goodSound', './assets/Sound/good.wav')
    this.load.audio('wrongSound', './assets/Sound/wrong.wav')
}
 
function create() {
    // construire l'objet questions à partir du JSON
    questions = this.cache.json.get('questions').questions;
 
    // dessiner l'image de fond
    let backImage = this.add.image(0, 0, 'background');
    backImage.setOrigin(0, 0);
    backImage.setScale(0.5);
 
    // dessiner l'image pour les questions
    let questionPanelImage = this.add.image(config.width/2, 100, 'questionpanel');
    questionPanelImage.setScale(0.5);
 
    // dessiner les 3 images pour les 3 réponses
    answerPanelImage[0] = this.add.image(config.width/2, 220, 'answerpanel').setInteractive();
    answerPanelImage[0].setScale(1.2, 0.8);
    answerPanelImage[0].on('pointerdown', () => {checkAnswer(0)});
    answerPanelImage[1] = this.add.image(config.width/2, 320, 'answerpanel').setInteractive();
    answerPanelImage[1].setScale(1.2, 0.8);
    answerPanelImage[1].on('pointerdown', () => {checkAnswer(1)});
    answerPanelImage[2] = this.add.image(config.width/2, 420, 'answerpanel').setInteractive();
    answerPanelImage[2].setScale(1.2, 0.8);
    answerPanelImage[2].on('pointerdown', () => {checkAnswer(2)});
 
    // écrire la question
    questionText = this.add.text(150, 80, questions[questionIndex].title,
    { fontFamily: 'Arial', fontSize: 18, color: '#00ff00' });
 
    // écrire les 3 réponses
    answerText1 = this.add.text(150, 200, questions[questionIndex].answer[0],
    { fontFamily: 'Arial', fontSize: 18, color: '#ffff00' });
    answerText2 = this.add.text(150, 300, questions[questionIndex].answer[1],
    { fontFamily: 'Arial', fontSize: 18, color: '#ffff00' });
    answerText3 = this.add.text(150, 400, questions[questionIndex].answer[2],
    { fontFamily: 'Arial', fontSize: 18, color: '#ffff00' });
 
    // dessiner le bouton pour question suivante
    nextQuestionImage = this.add.image(config.width/2, 510, 'nextquestion').setInteractive();
    nextQuestionImage.on('pointerdown',  nextQuestion)
    nextQuestionImage.setScale(0.4);
    nextQuestionImage.setVisible(false);
 
    //dessiner l'étoile
    for (let i = 0; i < 10; i++){
        starImage[i] = this.add.image(30+i*60, 600, 'star')
        starImage[i].setScale(0.25);
        starImage[i].setVisible(false)
    }
 
    //Ajouter le bouton Restart
    restartImage = this.add.image(300, 350, 'restart').setInteractive();
    restartImage.on('pointerdown', restart);
    restartImage.setVisible(false)
 
    //crée une animation sur un panel good answer
    for(let i = 0; i < 3; i++){
 
        tweenGoodAnswerPanel[i] = this.tweens.add({
            targets: answerPanelImage[i],
            scaleY: 1.2,
            scaleX: 1.5,
            duration: 200,
            ease: 'Power2',
            yoyo : true,
            loop: 0,
            paused: true
        });
    }
    //wrong answer
    for(let i = 0; i < 3; i++){
 
        tweenWrongAnswerPanel[i] = this.tweens.add({
            targets: answerPanelImage[i],
            scaleY: 1.2,
            scaleX: 1.3,
            angle : 2.5,
            duration: 20,
            ease: 'Power2',
            yoyo : true,
            loop: 2,
            paused: true
        });
    }
 
 
    //ajout des sons
    goodAnswerSound = this.sound.add('goodSound');
    wrongAnswerSound = this.sound.add('wrongSound');
}
 
function update() {
 
}
 
function checkAnswer(answerNumber) {
    for(let i = 0; i < 3; i++){
        answerPanelImage[i].disableInteractive();
    }
    nextQuestionImage.setVisible(true);
    starImage[questionIndex].setVisible(true)
    answerPanelImage[questions[questionIndex].goodAnswer].tint = 0x22FF22;
    if (answerNumber==questions[questionIndex].goodAnswer) {
        score += 1 ;
        goodAnswerSound.play();
        tweenGoodAnswerPanel[answerNumber].play();
 
    }
    else {
        answerPanelImage[answerNumber].tint = 0xFF0000;
        starImage[questionIndex].alpha = 0.6;
        wrongAnswerSound.play()
        tweenWrongAnswerPanel[answerNumber].play();
    }
}
 
function nextQuestion(){
    questionIndex += 1;
    for(let i = 0; i < 3; i++){
        answerPanelImage[i].setInteractive();
    }
    if(questionIndex <10){
        questionText.text =questions[questionIndex].title;
        answerText1.text = questions[questionIndex].answer[0];
        answerText2.text = questions[questionIndex].answer[1];
        answerText3.text = questions[questionIndex].answer[2];
        for (let i = 0; i <3; i++) answerPanelImage[i].tint = 0xFFFFFF;
    }
    else{
        for(let i = 0; i < 3; i++) answerPanelImage[i].setVisible(false);
        answerText1.setVisible(false)
        answerText2.setVisible(false)
        answerText3.setVisible(false)
        questionText.text = "Votre score est de "+ score +"/10";
        restartImage.setVisible(true);
    }
    nextQuestionImage.setVisible(false);
 
}
 
function restart(){
    //faire disparaitre le bouton restart
    restartImage.setVisible(false);
    //score index à zero
    score = 0;
    questionIndex = 0;
 
   
    //faire disparaitre les étoiles
    for (let i = 0; i < 10; i++){
        starImage[i].setVisible(false);
        starImage[i].alpha = 1
    }
 
    //faire réaparaitre les panels et les textes avec la première question
    for(let i = 0; i < 3; i++){
        answerPanelImage[i].setVisible(true);
        answerPanelImage[i].tint = 0xFFFFFF
    }
    questionText.text =questions[questionIndex].title;
    answerText1.text = questions[questionIndex].answer[0];
    answerText1.setVisible(true)
    answerText2.text = questions[questionIndex].answer[1];
    answerText2.setVisible(true)
    answerText3.text = questions[questionIndex].answer[2];
    answerText3.setVisible(true)
 
}