from pathlib import Path
from rembg import remove, new_session
import os
import re
import json
import io
import string

config = []
config_path = "database.json"
igt = 0
with open(config_path, 'r', encoding='utf-8') as f:
    config = json.load(f)
        
session = new_session()

for file in Path(r'G:\koren\stablediffusion\stable-diffusion-webui\outputs\txt2img-images\2023-05-01').glob('*.png'):
    nameget = config['elements'][igt]['stripped']
    input_path = str(file)
    print(file.parent)
    output_path = str(r'C:\Users\User\Documents\GitHub\AIElemental\cdn\IconsStyle\\' + (nameget + ".png"))
    with open(input_path, 'rb') as i:
        with open(output_path, 'wb') as o:
            input = i.read()
            output = remove(input, session=session)
            o.write(output)
    
    #os.remove(file)
    igt += 1
