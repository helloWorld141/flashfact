import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useState, useEffect } from 'react';
import { Setting } from './components/Setting';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    NavLink,
    useLocation
} from "react-router-dom";

function fetchData(setWordList, location) {
    if (location.state) {
        console.log(location.state);
        const deck = location.state[0].deck;
        fetch("http://localhost:3000/deck/" + deck)
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
}

function PlaySound(props) {
    const b64 = props.data.toString('base64');
    // console.log(md5(b64));
    useEffect(() => {
        let audioElement = document.getElementById('playsound');
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
    const l = props.wordList.length;
    useEffect(() => {
        const interval = setInterval(() => setIdx(currentIdx => (currentIdx + 1) % l), 1000);
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

function Training() {
    const location = useLocation();
    console.log(location);
    const [wordList, setWordList] = useState([]);
    useEffect(() => {
        fetchData(setWordList, location);
    }, []);

    if (location.state) {
        return (
            <div className='App-header'>{wordList.length ? <DisplayChar wordList={wordList}></DisplayChar> : ''}</div>
        );
    } else {
        return (
            <div className='App-header'>
                <p>Please select your <NavLink to="/">settings</NavLink> first!</p>
            </div>
        )
    }
}
function App() {
    return (
        <Router>
            <Switch>
                <Route path='/training'>
                    <Training />
                </Route>
                <Route path='/'>
                    <Setting />
                </Route>
            </Switch>
        </Router>
    )
}

export default App;
