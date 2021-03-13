import sqlite3
import os, json
import time
import io
from pydub import AudioSegment
from pydub.playback import play

print(os.getcwd())

def play_audio(cursor):
    query = 'select pronunciation from word'
    audios = cursor.execute(query).fetchall()
    for audio in audios:
        song = AudioSegment.from_file(io.BytesIO(audio[0]), format="wav")
        play(song)
        time.sleep(0.5)
if __name__ == '__main__':
    settings = json.loads(open('./settings.json').read())
    db_path = os.path.join(settings['db_location'], settings['db_filename'])
    connection = sqlite3.connect(db_path)
    cursor = connection.cursor()
    play_audio(cursor)