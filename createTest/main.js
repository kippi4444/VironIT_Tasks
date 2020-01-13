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
        start.innerText = 'Начать';
        start.disabled = true;
        this.mainBlock.appendChild(loginBlock);
        loginBlock.appendChild(name);
        loginBlock.appendChild(select);
        loginBlock.appendChild(start);

        for (let i = 1; i < 4; i++) {
            let  option = document.createElement('option');
            option.value = i;
            option.innerHTML = `Уровень сложности ${i}`;
            select.appendChild(option);
        }
        name.addEventListener('input', () => (name.value.trim() && name.value.trim().length > 2) ? start.disabled = false : start.disabled = true);
    }

    createQuestionBlock(){
        this.clearView();
        this.submit = document.createElement('button');
        this.helloBlock = document.createElement('h3');
        this.wrapperForState = document.createElement('p');
        this.testBlock = document.createElement('div');
        this.testBlock.classList.add('testBlock');
        this.submit.id = 'submit';
        this.submit.innerHTML = 'Далее';
        this.mainBlock.appendChild(this.helloBlock);
        this.mainBlock.appendChild(this.wrapperForState);
        this.mainBlock.appendChild(this.testBlock);
        this.mainBlock.appendChild(this.submit);
        this.testBlock.addEventListener('input', (event) => {
            event.target.checked ? this.submit.disabled = false : this.submit.disabled = true;
        });
    }

    viewMessage(message) {
        this.helloBlock.innerHTML = message.mes.toUpperCase();
        this.wrapperForState.innerHTML = `Отвечено вопросов:  ${message.answers}/ ${message.quantity} ` ;
    }

    viewReaction(input){
        if(input.state) {
            input.value.parentElement.style.color = 'green';
        } else  {
            input.value.parentElement.style.color = 'red';
        }
    }

    clearView() {
        this.mainBlock.innerHTML = '';
    }

    viewTest(queston) {
        this.testBlock.innerHTML = '';
        this.submit.disabled = true;
        let h1 = document.createElement('h1'),
            inputRadio = document.createElement('input');
        inputRadio.type = 'radio';
        inputRadio.name = 'answer';
        h1.innerHTML = queston.text;
        this.testBlock.appendChild(h1);
        queston.answers.sort(() => 0.5 - Math.random()).forEach(answer =>{
            let p = document.createElement('p');
            this.testBlock.appendChild(p);
            inputRadio.value = answer;
            p.appendChild(inputRadio);
            p.innerHTML += answer;
            });
    }

    viewRestartMenu(result) {
        let restart = document.createElement('button');
        restart.id = 'restart';
        restart.innerHTML = 'Заново';
        let viewResult = document.createElement('button');
        viewResult.id = 'viewResult';
        viewResult.innerHTML = 'Мои ответы';
        this.clearView();
        this.mainBlock.innerHTML = `${result.userName},Ваш результат: ${result.result} %`;
        this.mainBlock.appendChild(viewResult);
        this.mainBlock.appendChild(restart);

    }

    viewResult(allAnswers){
        let wrapper = document.createElement('table');
        let viewResult = document.getElementById('viewResult');
        viewResult.disabled = true;
        this.mainBlock.appendChild(wrapper);
        for(let key of allAnswers){
            let tr = document.createElement('tr');
            let td = document.createElement('td');
            wrapper.appendChild(tr);
            tr.innerHTML += ` Вопрос:  ${key.title}`;
            tr.appendChild(td);
            td.innerHTML += ` Ваш ответ: ${key.selectValue}`;
            if (key.state){
                td.style.color = 'green';
            } else {
                td.style.color = 'red';

            }

        }
    }


}

class ModelWhyTest{
    constructor(questions){
        this.questions = questions;
        this.message = ['Здравствуйте, ', 'Вы выбрали уровень сложности: ', 'Всего вопросов: ', 'Правильно отвеченных вопросов: '];
        this.userName = null;
        this.selectLevel = null;
        this.selectLevelQuestions = [];
        this.count = 0;
        this.trueAnswer = 0;
        this.userAnswers = [];
    }

    checkFields(name, select) {
        this.userName = name;
        this.selectLevel = select;
        this.createSelectLevelQuestions();
        return {
            quantity: this.selectLevelQuestions.length,
            answers: this.count,
            mes:`${this.message[0]} ${name}! ${this.message[1]} ${select}`
        };
    }

    createSelectLevelQuestions() {
        this.questions.forEach(q => {if (q.level === Number(this.selectLevel)) this.selectLevelQuestions.push(q)});
    }

    restart() {
        this.count = 0;
        this.trueAnswer = 0;
        this.selectLevel = null;
        this.selectLevelQuestions = [];
    }

    getQuestion() {
        this.count++;
        return  this.selectLevelQuestions[this.count-1];
    }

    getAllAnswers(){
        return this.userAnswers;
    }

    calculateResult() {
        return {userName: this.userName, result: this.trueAnswer*100/this.selectLevelQuestions.length};
    }

    checkAnswer(inputs) {
        for(let input of inputs){
            if (input.checked) {

                if (input.value === (this.selectLevelQuestions[this.count - 1].true)) {
                    this.trueAnswer++;
                    this.userAnswers.push({title: this.selectLevelQuestions[this.count - 1].text, selectValue: input.value, state: true});
                    return {state: true, value: input};
                } else{
                    this.userAnswers.push({title: this.selectLevelQuestions[this.count - 1].text, selectValue: input.value, state: false});
                    return  {state: false, value: input};
                }
            }
        }
    }

    howManyQuestions() {
        return {
            quantity: this.selectLevelQuestions.length,
            answers: this.count,
            mes:`${this.userName}, ${this.message[3]} ${this.trueAnswer}`
        };
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
            this.view.createQuestionBlock();
            this.view.viewMessage(this.model.checkFields(input.value, select.value));
            this.view.viewTest(this.model.getQuestion());
            this.submitAnswer();
        });
    }

    submitAnswer() {
        let submit = document.getElementById('submit');
        submit.addEventListener('click',() => {
            let quantityQuestions = this.model.howManyQuestions();
            let input = document.getElementsByName('answer');
            if (quantityQuestions.quantity !== quantityQuestions.answers){
                this.view.viewReaction(this.model.checkAnswer(input));
                setTimeout(() => this.createNextView(), 300);
            } else {
                this.view.viewReaction(this.model.checkAnswer(input));
                setTimeout(() => {
                this.view.viewRestartMenu(this.model.calculateResult());
                this.restart();
                }, 300);
            }
        });
    }

    createNextView() {
        this.view.viewTest(this.model.getQuestion());
        this.view.viewMessage(this.model.howManyQuestions());
    }

    restart() {
        let showResult = document.getElementById('viewResult');
        let restart = document.getElementById('restart');
        showResult.addEventListener('click',() => {
          this.view.viewResult(this.model.getAllAnswers()) ;
        });
        restart.addEventListener('click',() => {
            this.view.clearView();
            this.model.restart();
            this.view.init();
            this.start();
        });
    }

}

let allQuestions = [
    {level: 1, text: 'Сколько суток составляют високосный год?', answers:['365','366','360','364'], true:'366'},
    {level: 1, text: 'Сколько ног у улитки?', answers:['1','2','4','5'], true:'1'},
    {level: 1, text: 'В какую из этих игр играют не клюшкой?', answers:['Хоккей','Гольф','Поло','Бильярд'], true:'Бильярд'},
    {level: 1, text: '2+2= ?', answers:['5','8','4','10'], true:'4'},
    {level: 2, text: 'От какого дерева появляются желуди?', answers:['Дуб','Каштан','Ясень','Клен'], true:'Дуб'},
    {level: 2, text: 'Где муха-цокотуха нашла денежку?', answers:['В лесу','В поле','Во дворе','На лугу'], true:'В поле'},
    {level: 2, text: 'В артериях кровь движется...?', answers:['Сверху вниз','От органов к сердцу','От сердца к органам','Снизу вверх'], true:'От сердца к органам'},
    {level: 2, text: 'Корюшка - это...', answers:['Крючок','Птичка','Растение','Рыбка'], true:'Рыбка'},
    {level: 3, text: 'Чему равна сумма чисел от 0 до 100 включительно?', answers:['3525','1000','5050','7550'], true:'5050'},
    {level: 3, text: 'У кого из "вампиров" кровь пьют только самки?', answers:['Летучие мыши','Люди','Пиявки','Комары'], true:'Комары'},
    {level: 3, text: 'Территория какой из этих стран - наибольшая?', answers:['Италия','Япония','Германия','Финляндия'], true:'Япония'},
    {level: 3, text: 'Какая из этих кислот является витамином?', answers:['Молочная','Яблочная','Никотиновая','Янтарная'], true:'Никотиновая'}
];


const container = document.getElementsByClassName('main')[0];
const whyModel = new ModelWhyTest(allQuestions),
      whyView = new ViewWhyTest(container),
      whyController = new ControllerWhyTest(whyModel, whyView);
