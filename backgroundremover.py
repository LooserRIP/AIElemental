from pathlib import Path
from rembg import remove, new_session
import os
import re
import json
import io
import string
import shutil

config = []
config_path = "database.json"
igt = 0
with open(config_path, 'r', encoding='utf-8') as f:
    config = json.load(f)
        
session = new_session()
pathes = ["05-04","05-05","05-07","05-08"]


for pathget in pathes:
    for file in Path(r'G:\koren\stablediffusion\stable-diffusion-webui\outputs\txt2img-images\2023-' + pathget).glob('*.png'):
        nameget = config['elements'][igt]['stripped']
        input_path = str(file)
        print(igt, nameget)
        output_path = str(r'C:\Users\User\Documents\GitHub\AIElemental\cdn\EnvStyle\\' + (nameget + ".png"))
        shutil.copyfile(input_path, output_path)
        #os.remove(file)
        igt += 1



#for pathget in pathes:
#    for file in Path(r'G:\koren\stablediffusion\stable-diffusion-webui\outputs\txt2img-images\2023-' + pathget).glob('*.png'):
#        nameget = config['elements'][igt]['stripped']
#        input_path = str(file)
#        print(igt, nameget)
#        output_path = str(r'C:\Users\User\Documents\GitHub\AIElemental\cdn\EnvStyle\\' + (nameget + ".png"))
#        with open(input_path, 'rb') as i:
#            with open(output_path, 'wb') as o:
#                input = i.read()
#                output = remove(input, session=session)
#                o.write(output)
#        
#        #os.remove(file)
#        igt += 1
