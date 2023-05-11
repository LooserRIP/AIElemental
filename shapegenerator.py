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

def clean_string(s):
    return s
    #return ''.join(char for char in s if char.isalnum() or char == ' ')

regex = re.compile('[^a-zA-Z0-9\s]')
igg = 0;



import torch

from shap_e.diffusion.sample import sample_latents
from shap_e.diffusion.gaussian_diffusion import diffusion_from_config
from shap_e.models.download import load_model, load_config
from shap_e.util.notebooks import create_pan_cameras, decode_latent_images, gif_widget
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

xm = load_model('transmitter', device=device)
model = load_model('text300M', device=device)
diffusion = diffusion_from_config(load_config('diffusion'))

batch_size = 4
guidance_scale = 15.0
prompt = "a shark"

latents = sample_latents(
    batch_size=batch_size,
    model=model,
    diffusion=diffusion,
    guidance_scale=guidance_scale,
    model_kwargs=dict(texts=[prompt] * batch_size),
    progress=True,
    clip_denoised=True,
    use_fp16=True,
    use_karras=True,
    karras_steps=64,
    sigma_min=1e-3,
    sigma_max=160,
    s_churn=0,
)

render_mode = 'nerf' # you can change this to 'stf'
size = 64 # this is the size of the renders; higher values take longer to render.

cameras = create_pan_cameras(size, device)
for i, latent in enumerate(latents):
    images = decode_latent_images(xm, latent, cameras, rendering_mode=render_mode)
    display(gif_widget(images))
    
for it in config['elements']:
    print(str(igg) + ", " + it['textureprompt'].replace("\n",""))
    igg += 1;
    time.sleep(0.01)



    
