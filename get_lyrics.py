import json
import time
from urllib.request import urlopen
from urllib.parse import quote
from lyricsnmusic_apikey import API_KEY
from bs4 import BeautifulSoup

BASE_URL = "http://api.lyricsnmusic.com/songs?api_key=" + API_KEY
YEAR_START = 1946
YEAR_END = 2013

def get_lyrics(artist, song):
    lyrics = ""
    artist = quote(artist)
    song = quote(song)
    response = urlopen(BASE_URL + "&artist=" + artist + "&track=" + song).read()
    data = json.loads(response.decode("utf-8"))
    if len(data) > 0:
        lyrics_url = data[0]["url"]
        lyrics_html = urlopen(lyrics_url).read()
        soup = BeautifulSoup(lyrics_html)
        if soup.pre and soup.pre.string:
            lyrics += soup.pre.string
    return lyrics

def json_insert_lyrics():
    for year in range(1958, YEAR_END + 1):
        print(year)
        with open("billboard.txt", "r") as readfile:
            data = json.load(readfile)

        for i, entry in enumerate(data[str(year)]):
            if year != 2011 and data[str(year)][i].get("lyrics") is None:
                #while True:
                 #   try:
                time.sleep(0.5)
                data[str(year)][i]["lyrics"] = get_lyrics(entry["artist"], entry["song"])
                 #   except:
                #        continue
                #    else:
                #        break
                with open("billboard.txt", "w") as writefile:
                    writefile.write(json.dumps(data))
            print("song " + str(i) + " done")

json_insert_lyrics()
