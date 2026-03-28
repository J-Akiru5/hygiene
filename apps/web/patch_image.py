from PIL import Image
import os

os.chdir('c:/dev/laravel/hygiene/apps/web')

clean_img = Image.open('public/assets/girl-clean.png').convert('RGBA')
happy_img = Image.open('public/assets/girl-happy.png').convert('RGBA')

W, H = clean_img.size

rects = [
    {'id': 'Teeth', 'x': 0.37, 'y': 0.54, 'w': 0.27, 'h': 0.13},
    {'id': 'Left Ear', 'x': 0.19, 'y': 0.37, 'w': 0.17, 'h': 0.25},
    {'id': 'Right Ear', 'x': 0.64, 'y': 0.37, 'w': 0.17, 'h': 0.25}
]

for rect in rects:
    left = int(rect['x'] * W)
    top = int(rect['y'] * H)
    right = int((rect['x'] + rect['w']) * W)
    bottom = int((rect['y'] + rect['h']) * H)
    
    region = happy_img.crop((left, top, right, bottom))
    clean_img.paste(region, (left, top))
    print(f"Pasted {rect['id']} from ({left}, {top}) to ({right}, {bottom})")

clean_img.save('public/assets/girl-clean.png')
print("girl-clean.png updated successfully.")
