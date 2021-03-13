import sqlite3
import os, json
import pandas as pd
import re
from google.cloud import texttospeech

print(os.getcwd())

def buildInsertQueryFromDf(df: pd.DataFrame):
    query = "insert into word (char, pinyin, meaning) values "
    values = list()
    for id, row in df.iterrows():
        values.append(f"('{row['Chinese']}', '{row['Pinyin']}', '{row['English']}')")
    query += ','.join(values)
    return query

def cleanData(df: pd.DataFrame):
    res = df.dropna(axis=1)
    res['Chinese'] = res['Chinese'].apply(lambda char: re.sub('\(.*\)', '', char))
    return res

def populateWordList(cursor):
    df = pd.read_excel('./data/HSK1-Vocabulary-List.xlsx')
    df = cleanData(df)
    query = buildInsertQueryFromDf(df)
    cursor.execute(query)

def populatePronunciation(cursor):
    query = "select char from word"
    chars = cursor.execute(query).fetchall()
    # chars = ['我']
    for row in chars:
        char = row[0]
        binary = text_to_speech(char)
        # sound = open(file_path, 'rb').read()
        cursor.execute(f"update word set pronunciation=(?) where char='{char}'", [sqlite3.Binary(binary.audio_content)])

def text_to_speech(word):
    '''
    :param word:
    :return: the binary of the sound in selected encoding
    '''
    # Instantiates a client
    client = texttospeech.TextToSpeechClient()
    # Set the text input to be synthesized
    synthesis_input = texttospeech.SynthesisInput(text=word)
    # Build the voice request, select the language code ("en-US") and the ssml
    # voice gender ("neutral")
    voice = texttospeech.VoiceSelectionParams(
        language_code="zh-CN", ssml_gender=texttospeech.SsmlVoiceGender.FEMALE
    )
    # Select the type of audio file you want returned
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.LINEAR16
    )
    # Perform the text-to-speech request on the text input with the selected
    # voice parameters and audio file type
    response = client.synthesize_speech(
        input=synthesis_input, voice=voice, audio_config=audio_config
    )
    # The response's audio_content is binary.
    return response
    ### for testing only ###
    # with open("./data/output.wav", "wb") as out:
    #     # Write the response to the output file.
    #     out.write(response.audio_content)
    #     print('Audio content written to file "output.wav"')
    # return "./data/output.wav"

def create_table(cursor, full_refresh=False):
    if full_refresh:
        cursor.execute("drop table word")
    cursor.execute("""
        create table if not exists word (
            char text not null primary key,
            pinyin text,
            pronunciation blob,
            meaning text
        )
    """)

if __name__ == '__main__':
    settings = json.loads(open('./settings.json').read())
    db_path = os.path.join(settings['db_location'], settings['db_filename'])
    connection = sqlite3.connect(db_path)
    cursor = connection.cursor()
    # create_table(cursor, full_refresh=True)
    connection.commit()
    #### mock data ####
    # populateWordList(cursor)
    connection.commit()
    #### check data ####
    cursor.execute("select * from word")
    print(cursor.fetchone())

    ### test populate sound ###
    populatePronunciation(cursor)
    connection.commit()

    ### close connection ###
    connection.close()

    ### test tts api ###
    # text_to_speech("Hello world")