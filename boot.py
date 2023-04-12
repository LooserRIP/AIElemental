import subprocess

filename = 'generator.py'
while True:
    p = subprocess.Popen('python '+filename, shell=True).wait()
    if p != 0:
        continue
    else:
        break
