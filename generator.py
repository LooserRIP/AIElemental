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
complexids = [3234,3418,3502,3580,3904,3987,4058,4096,3125,3432,3507,3641,3777,3863,3878,3920,3988,3399,3413,3695,3704,3715,3804,3830,3948,3963,3994,3343,3767,3872,3921,4004,4045,4061,4094,4095,3806,4012,4111,3457,3459,3588,3786,4017,3706,3772,3962,3115,3577,3684,3861,3971,3665,3768,3866,3925,4010,3910,3942,4029,4063,4108,3602,4001,4083,3134,3401,3945,3405,3710,3428,3712,3648,3785,3964]
try:
    with open(config_path, 'r', encoding='utf-8') as f:
        config = json.load(f)
except (FileNotFoundError, json.JSONDecodeError):
    print("No Database Found, Getting Backup")
    shutil.copy("database_backup.json", config_path)
    with open(config_path, 'r', encoding='utf-8') as f:
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

#idgc = 0;
#for icg in config['elements']:
#    potential = 0;
#    recipes = 0;
#    for recipesg in config['recipes']:
#        recipeGet = f".{recipesg}.";
#        if f".{idgc}." in recipeGet:
#            potential += 1;
#        if config['recipes'][recipesg] == idgc:
#            recipes += 1;
#    config['elements'][idgc]['potential'] = potential;
#    config['elements'][idgc]['recipes'] = recipes;
#    print(str(idgc) + ", "+ config['elements'][idgc]['name'])
#    idgc += 1;
        
        
saveConfig()
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
    complexids.append(len(config))
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
    elementLength = min(len(config['elements']) - 1,9999999990)
    #elementLength = len(complexids) - 1
    recipesDict = config['recipes']
    while True:
        ing1 = random.randint(0, elementLength)
        ing2 = random.randint(0, elementLength)
        #ing1 = complexids[random.randint(random.randint(0, elementLength), elementLength)]
        #ing2 = complexids[random.randint(random.randint(0, elementLength), elementLength)]
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


    

while True:
    user_input = input("Recipe: ")
    ing1, ing2 = user_input.split('+')
    find1 = find_element_index(config['elements'], striptext(ing1)) 
    find2 = find_element_index(config['elements'], striptext(ing2))
    if find1 > find2:
        temp = find1
        find1 = find2
        find2 = temp
    if find1 != -1 and find2 != -1 and f'{find1}.{find2}' not in config['recipes']:
        addCombination(find1, find2)
    else:
        if f'{find1}.{find2}' in config['recipes']:
            print(f"Recipe already exists and results in {config['elements'][config['recipes'][f'{find1}.{find2}']]['name']}!")
        if find1 == -1 and find2 == -1:
            print(f"{ing1} and {ing2} don't exist.")
        elif find2 == -1:
            print(f"{ing2} doesn't exist.")
        elif find1 == -1:
            print(f"{ing1} doesn't exist.")

    
while True:
    randomCombination()
    time.sleep(1.5)

#randomCombination()
