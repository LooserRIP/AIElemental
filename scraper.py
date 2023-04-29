import requests
import json
import io
import os
import time
from cairosvg import svg2png
from PIL import Image
import random

def downloadImages():
    db = []
    db_path = "littlealchemysprites.json"
    with open(db_path, 'r') as f:
        db = json.load(f)
    print(db)
    for elm in db:
        print("Downloading " + elm["name"] + "...")
        link = elm["src"]
        f = requests.get(link)
        print(f.text)
        svg_code = f.text.replace("<svg", '<svg width="512" height="512"')
        svg2png(bytestring=svg_code,write_to= "images/" + elm["name"] + '.png')


def convert_folder_to_black_background(folder_path):
    for file_name in os.listdir(folder_path):
        if file_name.endswith('.png'):
            # Open the original image
            image_path = os.path.join(folder_path, file_name)
            image = Image.open(image_path)

            # Create a new image with a black background
            new_image = Image.new('RGB', image.size, color='black')
            roll = random.randint(0,1)
            if roll == 1:
                new_image = Image.new('RGB', image.size, color='white')

            # Paste the original image onto the new image with a black background
            new_image.paste(image, (0, 0), image)

            # Save the new image with a black background
            new_image_path = os.path.join(folder_path, f'{os.path.splitext(file_name)[0]}.png')
            new_image.save(new_image_path)

convert_folder_to_black_background("images")
