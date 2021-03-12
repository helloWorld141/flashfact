import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';

function fetchData(setWordList) {
    fetch("http://localhost:3000/")
        .then(res => res.json())
        .then(data => {
            console.log(data);
            setWordList(data);
        })
        .catch(err => console.log(err));
}

function DisplayChar(props) {
    const [currentIdx, setIdx] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => setIdx(currentIdx => (currentIdx+1)%props.wordList.length), 500);
        console.log(interval);
        return () => {
            clearInterval(interval);
        };
    }, []);
    return (
        <div className='Char'>{props.wordList[currentIdx]?.char}</div>
    )
}

function App() {
    const [wordList, setWordList] = useState([]);
    useEffect(() => fetchData(setWordList), []);

    return (
        <div className='App-header'>{wordList?.length? <DisplayChar wordList={wordList}></DisplayChar>: ''}</div>
    );
}

export default App;
