
import os
import re
import json
import io
import string
import random
import requests
import time

def remove_punctuation_at_end(text):
    return text.rstrip(string.punctuation)
def striptext(text):
   return re.sub(r"[^a-zA-Z]", "", text).lower()
def find_element_index(elements, search_element):
    for index, element in enumerate(elements):
        if element["stripped"] == search_element:
            return index
    return -1
def send_webhook_message(webhook_url, message):
    payload = {"content": message}
    response = requests.post(webhook_url, json=payload)
    if response.status_code == 204:
        print("Message sent successfully!")
    else:
        print("Error sending message. Status code:", response.status_code)
def cleanupresult(text):
    words = text.split()
    if len(words) <= 2:
        return text
    else:
        trimmed_words = words[-2:]
        capitalized_words = [word.capitalize() for word in trimmed_words]
        return ' '.join(capitalized_words)
def remove_special_chars(word):
    while word and not word[0].isalnum():
        word = word[1:]
    return word

        
webhook_url = "https://discord.com/api/webhooks/999862915471507486/jsjm7KM7Mh_sc4Awmfge5vvTEQRqw6Qoq9ajbgonZl_McrnZ-YDeRG2VxU4tLzTi448D"
config = []
config_path = "database.json"
try:
    with open(config_path, 'r') as f:
        config = json.load(f)
except (FileNotFoundError, json.JSONDecodeError):
    print("No Database Found")
    pass
def saveConfig():
    with open(config_path, 'w') as f:
        json.dump(config, f)

stripped_list = ["solid black background, beautiful cartoonish art of " + item['name'] + " object" for item in config['elements']]
with open("texturelist.json", 'w') as f:
    #json.dump(stripped_list, f)
    f.write('\n'.join(stripped_list))
    
