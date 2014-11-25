from nltk.corpus import stopwords
from collections import Counter
import re
import json
from pprint import pprint

YEAR_START = 1946
YEAR_END = 2013
lyric_stopwords = set(["chorus", "refrain", "bridge", "x2", "x3", "x4", "x5"])
contraction_stopwords = set(["aren", "haven", "don", "couldn", "hasn", "didn", "mightn", "mustn", "shouldn", "wouldn", "ain", "ev", "ry", "re", "ve",  "er", "y", "e", "t", "ll", "d", "s", "m"])
english_stopwords = set(stopwords.words("english")) | contraction_stopwords

def extract_words(lyric_string):
   raw_set = set([w.lower() for w in re.sub("[^\w]", " ", lyric_string.replace("'", " ")).split()])
   word_count = Counter(raw_set.difference(lyric_stopwords).difference(english_stopwords))
   return word_count

lyrics = []
for year in range(YEAR_START, YEAR_END + 1):
   counter = Counter()
   with open("billboard.txt", "r") as readfile:
      data = json.load(readfile)
      for entry in data[str(year)]:
         if(entry.get("lyrics") != None):  
            counter += extract_words(entry["lyrics"])

   words = counter.most_common() # Converts Counter to list of tuples

   # Finds actual number of songs (ignores entries with no lyrics)
   num_songs = len([entry for entry in data[str(year)] if entry.get("lyrics") != None and len(entry["lyrics"]) > 0])

   #print(num_songs)
   # Normalizes word counts by dividing by number of songs
   words_normalized = [(entry[0], entry[1] / num_songs) for entry in words]

   # Only keep word counts that are in 15% of songs
   top_words_normalized = [entry for entry in words_normalized if entry[1] > 0.12]
   for entry in top_words_normalized:
      lyrics.append({"year": year, "word": entry[0], "frequency": round(entry[1], 5)})

with open("lyric_count.json", 'w') as out:
   json.dump(lyrics, out)