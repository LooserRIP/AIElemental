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
with open(config_path, 'r') as f:
    config = json.load(f)
        
session = new_session()

for file in Path('cdn/IconsStyle').glob('*.png'):
    nameget = config['elements'][igt]['stripped']
    input_path = str(file)
    output_path = str(file.parent / (nameget + ".png"))
    with open(input_path, 'rb') as i:
        with open(output_path, 'wb') as o:
            input = i.read()
            output = remove(input, session=session)
            o.write(output)
    
    os.remove(file)
    igt += 1
