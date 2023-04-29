import openai
import os
import re
import json
import io
import string
import random
import requests
import time
import shutil

def remove_punctuation_at_end(text):
    return text.rstrip(string.punctuation)
def striptext(text):
   return re.sub(r"[^a-zA-Z]", "", text).lower()
def find_element_index(elements, search_element):
    for index, element in enumerate(elements):
        if element["stripped"] == search_element:
            return index
    return -1
def send_webhook_message(webhook_url, titleg, colorg, message, footer):
    payload = {
      "content": None,
      "embeds": [
        {
          "title": titleg,
          "color": colorg
        }
      ],
      "attachments": []
    }
    if message:
        payload = {
          "content": None,
          "embeds": [
            {
              "title": titleg,
              "description": message,
              "color": colorg
            }
          ],
          "attachments": []
        }
    if footer:
        payload = {
          "content": None,
          "embeds": [
            {
              "title": titleg,
              "description": message,
              "color": colorg,
              "footer": {
                "text": footer
              }
            }
          ],
          "attachments": []
        }
        
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
    words_to_check = ["make", "creates", " in", "="]
    for word in words_to_check:
        word_index = string.lower().find(word)
        if word_index != -1:
            return string[word_index+len(word):].strip()
    return string
def formattextureprompt(text):
    if ':' in text:
        text = text.split(':')[1].strip()
    else:
        text = text.strip()

    if text.endswith('.'):
        text = text[:-1]

    return text.lstrip()
def check_text_verify(text):
    if len(text) < 3 or not re.search('[a-zA-Z]', text):
        return True
    else:
        return False
    
#print(os.environ.get('AIE_OPENAI_API_KEY'))
webhook_url = "https://discord.com/api/webhooks/999862915471507486/jsjm7KM7Mh_sc4Awmfge5vvTEQRqw6Qoq9ajbgonZl_McrnZ-YDeRG2VxU4tLzTi448D"
openai.api_key = os.environ.get('AIE_OPENAI_API_KEY')
config = []
config_path = "database.json"
verifyrecipes = True
counterBackup = 0
try:
    with open(config_path, 'r') as f:
        config = json.load(f)
except (FileNotFoundError, json.JSONDecodeError):
    print("No Database Found, Getting Backup")
    shutil.copy("database_backup.json", config_path)
    with open(config_path, 'r') as f:
        print("Successful Backup Loaded")
        config = json.load(f)
    pass
def saveConfig():
    global counterBackup
    counterBackup += 1
    with open(config_path, 'w') as f:
        json.dump(config, f)
    if counterBackup > 10:
        counterBackup = 0
        shutil.copy(config_path, "database_backup.json")

def verifyRecipe(ing1, ing2, name):
    if check_text_verify(name) or striptext(name).startswith("g "):
        send_webhook_message(webhook_url, f":closed_book: Cancelled **{comb1}** + **{comb2}** = **{name}**", 16741749, "Automatic cancellation due to the text being below 3 characters or containign no a-z characters", None)
        print("Does not make sense, cancelling item.")
        return False
    time.sleep(1.5)
    print("Sending Verification For {comb1} + {comb2} = {name}.")
    comb1 = config['elements'][ing1]['name']
    comb2 = config['elements'][ing2]['name']
    chatMsgs = [{"role": "system", "content": f"{comb1} + {comb2} = {name}. Does this combination make sense? One word responses only."}]
    cmodel = "gpt-3.5-turbo"
    response = openai.ChatCompletion.create(
        model=cmodel,
        messages=chatMsgs
    )
    stripd = striptext(response['choices'][0]['message']['content'])
    if "ye" in stripd:
        print("Makes sense.")
        return True
    send_webhook_message(webhook_url, f":closed_book: Cancelled **{comb1}** + **{comb2}** = **{name}**", 16741749, f"'{stripd}'", None)
    print("Does not make sense, cancelling item.")
    return False
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
def addElement(ing1, ing2, name, tp, desc):
    strippedname = striptext(name)
    config['elements'].append({"name": name, "stripped": strippedname, "description": desc, "textureprompt" : tp})#, "recipe": [ing1,ing2].sort()}
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
    print("Name Found: " + name)
    verified = True
    if verifyrecipes:
        verified = verifyRecipe(ing1, ing2, name)
    #name = "Test"
    if verified:
        find = find_element_index(elements, striptext(name))
        idget = len(elements)
        findadds = find_element_index(elements, striptext(name + "s"))
        if not findadds == -1:
            name = name + "s"
            find = findadds
        elif striptext(name).endswith("s"):
            findrems = find_element_index(elements, striptext(name[:-1]))
            if not findrems == -1:  
                name = name[:-1]
                find = findrems
        
        if find == -1:
            print("**"+name+"** added as a new item, generating texture prompt...")
            #send_webhook_message(webhook_url, "Created new item, **"+elements[ing1]['name']+"** + **"+elements[ing2]['name'] + "** to **" + name + "**\n*Generating Texture Prompt...*")
            texturepromptp = f'Respond with a detailed explanation of how a "{name}" element would look like physically as a prompt for a text-to-image model. Keep it VERY short and simple, and occasionally self-explanatory. Respond with one sentence, and respond in this format "Water: A Blue wave"'
            chatMsgs = [{"role": "system", "content": texturepromptp}]
            time.sleep(1.5)
            responsetp = openai.ChatCompletion.create(model="gpt-3.5-turbo",messages=chatMsgs)
            textureprompt = formattextureprompt(responsetp['choices'][0]['message']['content'])
            print("Texture Prompt: ``" + textureprompt + "`` - *Generating Description...*")
            #send_webhook_message(webhook_url, "Texture Prompt: ``" + textureprompt + "``\n*Generating Description...*")
            time.sleep(1.5)
            descriptionprompt = f'respond with nothing but a concise 1-2 sentences describing "{name}" in an abstract way. The element doesn\'t have to specifically exist. You will start the response with "A <description>".'
            chatMsgs = [{"role": "system", "content": descriptionprompt}]
            responsedp = openai.ChatCompletion.create(model="gpt-3.5-turbo",messages=chatMsgs)
            description = responsedp['choices'][0]['message']['content']
            print("Description: ``" + description + "``")
            #send_webhook_message(webhook_url, "Description: ``" + description + "``")
            send_webhook_message(webhook_url, f":sparkles: New Item: **{name}**", 7733241, f":blue_book: Recipe: **{elements[ing1]['name']}** + **{elements[ing2]['name']}**\n:scroll: Description: ``{description}``\n:frame_photo: Texture Prompt: ``{textureprompt}``", f"{ing1} + {ing2} = {idget}")
            addElement(ing1, ing2, name, textureprompt, description)
        else:
            addRecipe(ing1,ing2,find)
            print("*"+name+" added as a recipe*")
            send_webhook_message(webhook_url, f":green_book: New Recipe: **"+elements[ing1]['name']+"** + **"+elements[ing2]['name'] + "** = **" + name + "**", 7733115, None, f"{ing1} + {ing2} = {find}")
    



def generateRandomCombination():
    getnow = [0,1,2,3,4,5,6,7,8,9,14,769,10,11,12,13,15,16,18,20,21,23,24,28,30,32,49,79,330,565,17,19,22,25,26,29,31,33,34,36,37,42,46,50,51,53,55,56,60,69,82,85,93,111,126,152,154,199,265,328,427,678,692,740,860,1306,1893]
    elementLength = min(len(config['elements']) - 1,9999999990)
    elementLength = len(getnow) - 1
    recipesDict = config['recipes']
    while True:
        #ing1 = random.randint(0, random.randint(0, random.randint(0, random.randint(0, random.randint(0, elementLength)))))
        #ing2 = random.randint(0, random.randint(0, random.randint(0, random.randint(0, random.randint(0, elementLength)))))
        ing1 = getnow[random.randint(0, random.randint(0, elementLength))]
        ing2 = getnow[random.randint(0, random.randint(0, elementLength))]
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
