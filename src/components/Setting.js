import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useHistory } from 'react-router-dom';
import './Setting.css';

export function Setting() {
    const history = useHistory();

    const handleForm = (e) => {
        e.preventDefault();
        const settings = {};
        for (let i of e.target) if (i.id) {
            settings[i.id] = i.value;
        }
        console.log(settings);
        history.push("/training", [settings]);
    }

    return (
        <div className='Setting'>
            <div className='Container'>
                <p><b>Settings</b></p>
                <Form onSubmit={handleForm}>
                    <Form.Group controlId="nWords" className='row'>
                        <Form.Label className='col-sm-6'>Number of words</Form.Label>
                        <Form.Control className='col-sm-6' type="number" defaultValue="10" />
                    </Form.Group>
                    <Form.Group controlId="speed" className='row'>
                        <Form.Label className='col-sm-6'>Char per second</Form.Label>
                        <Form.Control className='col-sm-6' type="number" defaultValue="2" />
                    </Form.Group>
                    <Form.Group controlId="deck" className='row'>
                        <Form.Label className='col-sm-6'>Deck</Form.Label>
                        <Form.Control className='col-sm-6' as='select'>
                            <option value='hsk1'>HSK 1</option>
                        </Form.Control>
                    </Form.Group>
                    <div className='row'>
                        <Button type='submit' variant='outline-primary'>Start</Button>
                    </div>
                </Form>
            </div>
        </div>
    )
}
