#!/usr/bin/env python3
import json
import csv
from datetime import datetime

# Read and parse the CSV file
items = []
item_index = 0

with open('Urunler.csv', 'r', encoding='utf-8') as f:
    # Read all lines
    lines = f.readlines()
    
    # Skip header
    i = 1
    current_item = None
    
    while i < len(lines):
        line = lines[i].strip()
        
        if not line:
            i += 1
            continue
        
        # Check if this is a continuation of a multi-line item
        if current_item:
            # Check if this line ends the item (starts with ";)
            if line.startswith('";'):
                # Parse quantity and group
                rest = line[2:]  # Skip '";'
                parts = rest.split(';')
                if len(parts) >= 2:
                    current_item['quantity'] = parts[0].strip()
                    current_item['group'] = parts[1].strip() if parts[1].strip() else ''
                elif len(parts) == 1:
                    current_item['quantity'] = parts[0].strip()
                    current_item['group'] = ''
                else:
                    current_item['quantity'] = ''
                    current_item['group'] = ''
                
                # Add the completed item
                item_index += 1
                items.append({
                    'id': f'item-{item_index}',
                    'name': ' '.join(current_item['name'].split()),  # Normalize whitespace
                    'quantity': current_item['quantity'],
                    'group': current_item['group']
                })
                current_item = None
            else:
                # Continue building the name
                current_item['name'] += ' ' + line
        else:
            # Check if line starts with a quote (multi-line item name)
            if line.startswith('"') and '";' not in line:
                # Start of multi-line item name
                current_item = {
                    'name': line[1:].strip()  # Remove opening quote
                }
            else:
                # Regular single-line entry
                parts = line.split(';')
                if len(parts) >= 2:
                    item_name = parts[0].strip()
                    # Remove quotes if present
                    if item_name.startswith('"') and item_name.endswith('"'):
                        item_name = item_name[1:-1]
                    
                    quantity = parts[1].strip() if len(parts) > 1 else ''
                    group = parts[2].strip() if len(parts) > 2 else ''
                    
                    if item_name:
                        item_index += 1
                        items.append({
                            'id': f'item-{item_index}',
                            'name': ' '.join(item_name.split()),  # Normalize whitespace
                            'quantity': quantity,
                            'group': group
                        })
        
        i += 1
    
    # Handle any remaining current_item
    if current_item:
        item_index += 1
        items.append({
            'id': f'item-{item_index}',
            'name': ' '.join(current_item['name'].split()),
            'quantity': current_item.get('quantity', '0'),
            'group': current_item.get('group', '')
        })

# Create inventory structure
inventory = {
    'items': items,
    'lastUpdated': datetime.now().isoformat()
}

# Write to JSON file
with open('inventory.json', 'w', encoding='utf-8') as f:
    json.dump(inventory, f, indent=2, ensure_ascii=False)

print(f'Successfully parsed {len(items)} items and created inventory.json')

