import urllib.request
import time
from bs4 import BeautifulSoup
import json

BASE_URL = "http://www.bobborst.com/popculture/top-100-songs-of-the-year/?year="
YEAR_START = 1946
YEAR_END = 2013

# Scrapes billboard for top songs from 1946 to 2013
def scrape_billboard():
    data = {}
    for year in range(YEAR_START, YEAR_END + 1): 
        url = BASE_URL + str(year)
        html = urllib.request.urlopen(url).read()
        soup = BeautifulSoup(html)

        table = soup.find("table", attrs={"class": "sortable alternate songtable"})
        table_body = table.find("tbody")

        rows = table_body.find_all("tr")
        data[year] = []

        for row in rows:
            cols = row.find_all("td")
            cols = [el.text.strip() for el in cols]
            data[year].append({"artist": cols[1], "song": cols[2]})
        print("Processed " + str(year))
        time.sleep(1)
    json_write(data, 'billboard.txt')

def json_write(data, outfile):
    with open(outfile, 'w') as out:
        json.dump(data, out)

scrape_billboard()
