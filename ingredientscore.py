import os
import re
import json
import io
import string
import random
import requests
import time
from collections import deque

config = []
config_path = "databasewithdepth.json"
with open(config_path, 'r', encoding='utf-8') as f:
    config = json.load(f)

def depth_to_list_of_lists(data):
    # Find the maximum depth
    max_depth = max(element["depth"] for element in data["elements"])

    # Initialize the list of lists
    result = [[] for _ in range(max_depth + 1)]

    # Iterate over the elements and append the ID to the corresponding depth list
    for idx, element in enumerate(data["elements"]):
        result[element["depth"]].append(idx)

    return result


listget = depth_to_list_of_lists(config)
print(listget)

with open("depths.json", 'w', encoding='utf-8') as f:
    json.dump(listget, f)
