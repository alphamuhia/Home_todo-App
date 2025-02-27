import pygame
import sys
import os
import json

# File names for local storage and note saving
SHOPPING_LIST_FILE = "shopping_list.json"
NOTE_FILE = "shopping_list_note.txt"

# Function to load the shopping list from a JSON file
def load_shopping_list():
    if os.path.exists(SHOPPING_LIST_FILE):
        with open(SHOPPING_LIST_FILE, "r") as file:
            try:
                return json.load(file)
            except json.JSONDecodeError:
                return []
    else:
        return []

# Function to save the shopping list to a JSON file (optional, for updating storage)
def save_shopping_list(shopping_list):
    with open(SHOPPING_LIST_FILE, "w") as file:
        json.dump(shopping_list, file, indent=4)

# Function to "print" the shopping list as a note (save as text file)
def print_shopping_list(shopping_list):
    with open(NOTE_FILE, "w") as file:
        file.write("Shopping List Note\n")
        file.write("==================\n\n")
        for item in shopping_list:
            status = "Bought" if item.get("bought") else "Not Bought"
            line = (
                f"{item.get('itemName', '')} ({item.get('category', '')}) - "
                f"Price: Ksh. {float(item.get('price', 0)):.2f} | "
                f"Qty to Buy: {item.get('quantityToBuy', 0)} | "
                f"Available: {item.get('quantityAvailable', 0)} | "
                f"Status: {status}\n"
            )
            file.write(line)
    print(f"Shopping list saved as note in '{NOTE_FILE}'")

# Load the shopping list from local storage
shopping_list = load_shopping_list()

# If no list exists, initialize with sample data and save it
if not shopping_list:
    shopping_list = [
        {"itemName": "Apples", "category": "Fruits", "price": 0.5, "quantityToBuy": 10, "quantityAvailable": 3, "bought": False},
        {"itemName": "Bread", "category": "Bakery", "price": 1.5, "quantityToBuy": 2, "quantityAvailable": 0, "bought": False},
        {"itemName": "Milk", "category": "Dairy", "price": 0.9, "quantityToBuy": 1, "quantityAvailable": 1, "bought": True},
    ]
    save_shopping_list(shopping_list)

# Initialize Pygame
pygame.init()
WIDTH, HEIGHT = 800, 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Shopping List")

# Define colors and fonts
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
FONT = pygame.font.SysFont('Arial', 24)
TITLE_FONT = pygame.font.SysFont('Arial', 36)

clock = pygame.time.Clock()

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        # Press "P" to save the shopping list as a note
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_p:
                print_shopping_list(shopping_list)

    # Fill the background
    screen.fill(WHITE)

    # Render the title
    title_surface = TITLE_FONT.render("Shopping List", True, BLACK)
    screen.blit(title_surface, ((WIDTH - title_surface.get_width()) // 2, 20))

    # Display instructions
    instruction_text = FONT.render("Press 'P' to print the list as a note", True, BLACK)
    screen.blit(instruction_text, ((WIDTH - instruction_text.get_width()) // 2, 70))

    # Display each shopping list item
    y_offset = 120
    for item in shopping_list:
        status = "Bought" if item["bought"] else "Not Bought"
        text = (
            f"{item['itemName']} ({item['category']}) - "
            f"Price: Ksh. {float(item['price']):.2f} | "
            f"Qty: {item['quantityToBuy']} | "
            f"Available: {item['quantityAvailable']} | "
            f"Status: {status}"
        )
        item_surface = FONT.render(text, True, BLACK)
        screen.blit(item_surface, (50, y_offset))
        y_offset += 40

    pygame.display.flip()
    clock.tick(60)

pygame.quit()
sys.exit()
