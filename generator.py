import openai
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
    if len(words) <= 4:
        return text
    else:
        trimmed_words = words[-4:]
        capitalized_words = [word.capitalize() for word in trimmed_words]
        return ' '.join(capitalized_words)
def remove_special_chars(word):
    while word and not word[0].isalnum():
        word = word[1:]
    return word
def cut_after_word(string):
    words_to_check = ["make", "creates", "in", "="]
    for word in words_to_check:
        word_index = string.lower().find(word)
        if word_index != -1:
            return string[word_index+len(word):].strip()
    return string
        
print(os.environ.get('AIE_OPENAI_API_KEY'))
webhook_url = "https://discord.com/api/webhooks/999862915471507486/jsjm7KM7Mh_sc4Awmfge5vvTEQRqw6Qoq9ajbgonZl_McrnZ-YDeRG2VxU4tLzTi448D"
openai.api_key = os.environ.get('AIE_OPENAI_API_KEY')
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


def generateElementRecipe(ing1, ing2):
    comb1 = config['elements'][ing1]['name']
    comb2 = config['elements'][ing2]['name']
    chatMsgs = [{"role": "system", "content": f"Respond with nothing but the thing that {comb1} + {comb2} make. Keep it very short"}]
    cmodel = "gpt-3.5-turbo"
    response = openai.ChatCompletion.create(
        model=cmodel,
        messages=chatMsgs
    )
    #print(f"Combining {comb1} + {comb2}")
    responsetokens = response["usage"]["total_tokens"]
    rawresponsemsg = remove_special_chars(cleanupresult(remove_punctuation_at_end(cut_after_word(response['choices'][0]['message']['content'])))).title()
    #print(rawresponsemsg, f'{responsetokens} tokens')
    return rawresponsemsg
def addElement(ing1, ing2, name):
    strippedname = striptext(name)
    config['elements'].append({"name": name, "stripped": strippedname})#, "recipe": [ing1,ing2].sort()}
    combstring = f"{ing1}.{ing2}"
    if ing1 > ing2:
        combstring = f"{ing2}.{ing1}"
    config['recipes'][combstring] = (len(config['elements']) - 1)
    saveConfig()
def addRecipe(ing1, ing2, idg):
    combstring = f"{ing1}.{ing2}"
    if ing1 > ing2:
        combstring = f"{ing2}.{ing1}"
    config['recipes'][combstring] = idg
    saveConfig()
def addCombination(ing1, ing2):
    if ing1 > ing2:
        swap = ing1
        ing1 = ing2
        ing2 = swap
    elements = config['elements']
    print("Combining "+elements[ing1]['name']+" + "+elements[ing2]['name'])
    name = generateElementRecipe(ing1, ing2)
    print("Recipe Found")
    #name = "Test"
    find = find_element_index(elements, striptext(name))
    if find == -1:
        addElement(ing1, ing2, name)
        print(name+" added.")
        send_webhook_message(webhook_url, "Combined "+elements[ing1]['name']+" + "+elements[ing2]['name'] + " to " + name)
    else:
        addRecipe(ing1,ing2,find)
        print(name+" added as a recipe")
        send_webhook_message(webhook_url, "Combined "+elements[ing1]['name']+" + "+elements[ing2]['name'] + " to " + name + " (Old Recipe)")
    

def generateRandomCombination():
    elementLength = min(len(config['elements']) - 1,9999999)
    recipesDict = config['recipes']
    while True:
        ing1 = random.randint(0, random.randint(0, elementLength))
        ing2 = random.randint(0, random.randint(0, elementLength))
        if ing1 > ing2:
            swap = ing1
            ing1 = ing2
            ing2 = swap
        combstring = f"{ing1}.{ing2}"
        if recipesDict.get(combstring) is None:
            return ing1, ing2
def randomCombination():
    comb = generateRandomCombination()
    addCombination(comb[0], comb[1])
    return

#randomCombination()
while True:
    randomCombination()
    time.sleep(1.5)
