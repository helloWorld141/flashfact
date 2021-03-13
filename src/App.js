import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import md5 from 'js-md5';

function fetchData(setWordList) {
    fetch("http://localhost:3000/")
        .then(res => {
            return res.json()
        })
        .then(data => {
            data.forEach(element => {
                const buffer = element.pronunciation ? Buffer.from(element.pronunciation.data) : null;
                element.pronunciation = buffer;
            });
            setWordList(data);
        })
        .catch(err => console.log(err));
}

function PlaySound(props) {
    const b64 = props.data.toString('base64');
    // console.log(md5(b64));
    useEffect(() => {
        let audioElement = document.getElementById('playsound');
        console.log(audioElement);
        audioElement.load();
        audioElement.play();
        return () => {
            audioElement.pause();
            audioElement.currentTime = 0;
        };
    });
    return (
        <audio id="playsound">
            <source src={"data:audio/x-wav;base64," + (b64)} ></source>
        </audio>
    );
}
function DisplayChar(props) {
    const [currentIdx, setIdx] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => setIdx(currentIdx => (currentIdx + 1) % props.wordList.length), 500);
        console.log(interval);
        return () => {
            clearInterval(interval);
        };
    }, []);
    return (
        <div>
            <div className='Char'>{props.wordList[currentIdx]?.char}</div>
            {props.wordList[currentIdx]?.pronunciation ?
                <PlaySound data={props.wordList[currentIdx]?.pronunciation}>{currentIdx}</PlaySound>
                : ''}
        </div>
    )
}

function App() {
    const [wordList, setWordList] = useState([]);
    useEffect(() => fetchData(setWordList), []);

    return (
        <div className='App-header'>{wordList?.length ? <DisplayChar wordList={wordList}></DisplayChar> : ''}</div>
    );
}

export default App;
