//==============MVC================//
class ViewWhyTest {
    constructor(container){
        this.mainBlock = container;
    }
    init() {
        this.createLogin();
    }
    createLogin() {
        let loginBlock = document.createElement('div'),
            name = document.createElement('input'),
            start = document.createElement('button'),
            select = document.createElement('select');
        loginBlock.classList.add('loginBlock');
        select.id = 'levels';
        name.placeholder = 'Введите Имя';
        start.id = 'start';
        start.innerText = 'start';
        start.disabled = true;
        this.mainBlock.appendChild(loginBlock);
        loginBlock.appendChild(name);
        loginBlock.appendChild(select);
        loginBlock.appendChild(start);

        for (let i = 1; i < 4; i++) {
            let  option = document.createElement('option');
            option.value = i;
            option.innerHTML = `level ${i}`;
            select.appendChild(option);
        }
        name.addEventListener('input', () => name.value.trim()? start.disabled = false : start.disabled = true);
    }
    viewMessage(message) {
        this.clearView();
        this.mainBlock.innerHTML = message.toUpperCase();
        let submit = document.createElement('button');
        this.testBlock = document.createElement('div');
        this.testBlock.classList.add('testBlock');
        submit.innerHTML = 'Отправить';
        submit.id = 'submit';
        this.mainBlock.appendChild(this.testBlock);
        this.mainBlock.appendChild(submit);
    }

    viewReaction(state){
        console.log(state)
        if(state) {
            alert('Molodec');
        } else  {alert('Ne ygadal')};
    }
    clearView() {
        this.mainBlock.innerHTML = '';
    }

    viewTest(queston) {
        if (typeof (queston) == 'object'){
        this.testBlock.innerHTML = '';
        let h1 = document.createElement('h1'),
            div = document.createElement('div'),
            inputRadio = document.createElement('input');
        inputRadio.type = 'radio';
        inputRadio.name = 'answer';
        h1.innerHTML = queston.text;
        div.appendChild(h1);
        queston.answers.forEach(answer =>{
            let p = document.createElement('p');
            this.testBlock.appendChild(div);
            div.appendChild(p);
            inputRadio.value = answer;
            p.appendChild(inputRadio);
            p.innerHTML += answer;
            });
        } else {
            let restart = document.createElement('button');
            restart.id = 'restart';
            restart.innerHTML = 'Заново';
            this.clearView();
            this.mainBlock.innerHTML = `Ваш результат: ${queston} %`;
            this.mainBlock.appendChild(restart);
        }
    }
}

class ModelWhyTest{
    constructor(questions){
        this.questions = questions;
        this.message = ['Здравствуйте, ', 'Вы выбрали уровень сложности '];
        this.userName = null;
        this.selectLevel = null;
        this.selectLevelQuestions = [];
        this.count = 0;
        this.trueAnswer = 0;
    }

    checkFields(name, select){
        this.userName = name;
        this.selectLevel = select;
        this.createSelectLevelQuestions();
        return (`${this.message[0]} ${name}! ${this.message[1]} ${select}`);
    }

    createSelectLevelQuestions(){
        this.questions.forEach(q => {if (q.level == this.selectLevel) this.selectLevelQuestions.push(q)});
        console.log(this.selectLevelQuestions);
    }

    restart() {
        this.count = 0;
        this.trueAnswer = 0;
        this.selectLevel = null;
        this.selectLevelQuestions = [];
    }

    startTest() {
        this.count++;
        if ( this.count-1 < this.selectLevelQuestions.length){
            return  this.selectLevelQuestions[this.count-1];
        } else {
            return this.trueAnswer*100/this.selectLevelQuestions.length;
        }
    }

    // nextQuestion(){
    //     this.count++;
    //     if ( this.count-1 < this.selectLevelQuestions.length){
    //         return  this.selectLevelQuestions[this.count-1];
    //     } else {
    //         return this.trueAnswer*100/this.selectLevelQuestions.length;
    //     }
    // }

    checkAnswer(input) {
        for (let i = 0; i < input.length; i++) {
            console.log(this.selectLevelQuestions[this.count - 1].true)
            if (input[i].checked) {
                if (input[i].value === (this.selectLevelQuestions[this.count - 1].true)) {
                    this.trueAnswer++;
                    return true;
                } else return false;
            }
        }
    }
}


class ControllerWhyTest {
    constructor(model, view) {
        this.view = view;
        this.model = model;
        this.view.init();
        this.start();
    }

    start() {
        let start = document.getElementById('start'),
            input = document.getElementsByTagName('input')[0],
            select = document.getElementById('levels');
        start.addEventListener('click', () =>{
            this.view.viewMessage(this.model.checkFields(input.value, select.value));
            this.view.viewTest(this.model.startTest());
            this.submitAnswer();
        });
    }

    submitAnswer() {
        let submit = document.getElementById('submit');
        let input = document.getElementsByName('answer');
        submit.addEventListener('click', () =>{
            this.view.viewReaction(this.model.checkAnswer(input));
            this.view.viewTest(this.model.startTest());
            let restart = document.getElementById('restart');
            if(restart){
                restart.addEventListener('click',() => {
                    this.view.clearView();
                    this.model.restart();
                    this.view.init();
                    this.start();
                });
            }
        });
    }

}

let allQuestions = [
    {level: 1, text: 'Сколько суток составляют високосный год?', answers:['365','366','360','364'], true:'366'},
    {level: 1, text: 'Сколько ног у улитки?', answers:['1','2','4','5'], true:'1'},
    {level: 1, text: 'Есть ли жизнь под ободком унитаза?', answers:['да','нет','туалетный утенок','ребята сегодня не получится'], true:'да'},
    {level: 1, text: 'Сок стоит стандартная шаурма на Комарах?', answers:['5р','8р','ну грубо говоря 7р','ребята 10р'], true:'8р'},
    {level: 2, text: '2+2= ?', answers:['5','9','8/2','3*2'], true:'8/2'},
    {level: 2, text: 'Ауе?', answers:['666','777','ну ты понял','937 99 92'], true:'666'},
    {level: 2, text: 'Завтра существует?', answers:['да','нет','ну грубо говоря да','завтраки твои эти'], true:'нет'},
    {level: 2, text: 'Будет ли завтра лекция?', answers:['да','нет','ну грубо говоря да','ребята сегодня не получится'], true:'нет'},
    {level: 3, text: 'Как лает собака?', answers:['Гав','Рав','Уф, сук','слышь, пацанчик, дай на планчик'], true:'Гав'},
    {level: 3, text: 'Милиция в молодежном сленге в 2020?', answers:['фараоны','менты','полис-мены','мусора'], true:'менты'},
    {level: 3, text: '5 минут назад?', answers:['я т****л с**у в мерсе','время','песня такая','что?'], true:'что?'},
    {level: 3, text: 'Ты дурака за меня не держи', answers:['видео блоггер','компьютерщик','баба Галя','Гамаз'], true:'Гамаз'}
];


const container = document.getElementsByClassName('main')[0];
const whyModel = new ModelWhyTest(allQuestions),
      whyView = new ViewWhyTest(container),
      whyController = new ControllerWhyTest(whyModel, whyView);
