import React, { Component } from 'react';
import './App.css';

const allKana = {
  "あ": "a",   "い": "i",    "う": "u",    "え": "e",   "お": "o",
  "か": "ka",  "き": "ki",   "く": "ku",   "け": "ke",  "こ": "ko",
  "さ": "sa",  "し": "shi",  "す": "su",   "せ": "se",  "そ": "so",
  "た": "ta",  "ち": "chi",  "つ": "tsu",  "て": "te",  "と": "to",
};

const allRomaji = {
   "a": "あ",   "i": "い",   "u": "う",  "e": "え",  "o": "お",
  "ka": "か",  "ki": "き",  "ku": "く", "ke": "け", "ko": "こ",
  "sa": "さ", "shi": "し",  "su": "す", "se": "せ", "so": "そ",
  "ta": "た", "chi": "ち", "tsu": "つ", "te": "て", "to": "と",
};

const coinFlip = () => {
  return Math.random() > 0.5;
};

const getRandomElement = (arr) => {
  const len = Object.keys(arr).length;
  const index = Math.floor(Math.random() * len);
  return arr[index];
};

const getRandomValue = (arr, exclude) => {
  if (exclude) {
    arr = arr.filter(ch => exclude.indexOf(ch) === -1);
  }
  return getRandomElement(arr);
};

const getTestCharacter = () => {
  let isKana = coinFlip();
  let characterSet = isKana ? Object.keys(allKana) : Object.values(allKana);
  return {
    character: getRandomValue(characterSet),
    isKana,
  };
} 

class AnswerOptions extends Component {
  checkAnswer = (e) => {
    const choice = e.target.value;
    this.props.showAnswer(choice);
  }

  render() {
    // get multiple choice answers
    // include the real answer so that it's excluded from random selection
    const numFakes = 3;
    let options = [this.props.answer];
    for (let i = 0; i < numFakes; i++) {
      if (this.props.isKana) {
        options.push(getRandomValue(Object.values(allKana), options));
      } else {
        options.push(getRandomValue(Object.keys(allKana), options));
      }
    }

    // remove and insert the real answer at random index
    options = options.splice(1, numFakes);
    options.splice(Math.floor(Math.random() * numFakes), 0, this.props.answer);

    return (
      <div className="answers">
        {options.map(option => (
          <button
            key={option}
            onClick={this.checkAnswer}
            value={option}
          >
            {option}
          </button>
        ))}
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    let {character, isKana} = getTestCharacter();
    const currentAnswer = isKana ? allKana[character] : allRomaji[character];
    this.state = {
      currentCharacter: character,
      previousText: '',
      previousWasCorrect: true,
      isKana,
      currentAnswer,
    };
  }

  refreshKana = () => {
    const {character, isKana} = getTestCharacter();
    const currentAnswer = isKana ? allKana[character] : allRomaji[character];
    this.setState({
      currentCharacter: character,
      isKana,
      currentAnswer,
    });
  }

  showAnswer = (userChoice) => {
    const kana = this.state.isKana ? this.state.currentCharacter : this.state.currentAnswer;
    const romaji = this.state.isKana ? this.state.currentAnswer : this.state.currentCharacter;
    if (userChoice === this.state.currentAnswer) {
      this.setState({
        previousText: `✅ ${kana} = ${romaji}`,
        previousWasCorrect: true,
      });
    } else {
      this.setState({
        previousText: `❌ ${kana} = ${romaji}, you chose "${userChoice}"`,
        previousWasCorrect: false,
      });
    }
    this.refreshKana();
  }

  render() {
    return (
      <div>
        <div className={`previous previous-${this.state.previousWasCorrect}`}>{this.state.previousText}</div>
        <div className="current">
          <div className="kana">{this.state.currentCharacter}</div>
          <AnswerOptions
            answer={this.state.currentAnswer}
            isKana={this.state.isKana}
            showAnswer={this.showAnswer}
          />
        </div>
      </div>
    );
  }
}

export default App;
