#!/usr/bin/env python3
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import json
import os
from datetime import datetime

app = Flask(__name__, static_folder='.')
CORS(app)

INVENTORY_FILE = 'inventory.json'

def read_inventory():
    try:
        if os.path.exists(INVENTORY_FILE):
            with open(INVENTORY_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        else:
            return {'items': [], 'lastUpdated': datetime.now().isoformat()}
    except Exception as e:
        print(f'Error reading inventory: {e}')
        return {'items': [], 'lastUpdated': datetime.now().isoformat()}

def write_inventory(inventory):
    try:
        inventory['lastUpdated'] = datetime.now().isoformat()
        with open(INVENTORY_FILE, 'w', encoding='utf-8') as f:
            json.dump(inventory, f, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        print(f'Error writing inventory: {e}')
        return False

@app.route('/api/inventory', methods=['GET'])
def get_inventory():
    inventory = read_inventory()
    return jsonify(inventory)

@app.route('/api/inventory/<item_id>', methods=['POST'])
def update_inventory(item_id):
    data = request.get_json()
    action = data.get('action')  # 'increment', 'decrement', or 'update'
    
    inventory = read_inventory()
    item = next((i for i in inventory['items'] if i['id'] == item_id), None)
    
    if not item:
        return jsonify({'error': 'Item not found'}), 404
    
    # If action is 'update', update the item fields directly
    if action == 'update':
        if 'name' in data:
            item['name'] = data['name']
        if 'quantity' in data:
            item['quantity'] = data['quantity']
        if 'group' in data:
            item['group'] = data['group']
    else:
        # Handle quantity updates (increment/decrement)
        current_qty = item['quantity']
        import re
        
        if isinstance(current_qty, str):
            # Try to extract number and any text after it (works for any format)
            # Pattern: number at start, optional whitespace, then any text
            match = re.match(r'(\d+)\s*(.*)', current_qty.strip())
            if match:
                qty = int(match.group(1))
                unit_text = match.group(2).strip()  # Everything after the number
                
                if action == 'increment':
                    qty += 1
                elif action == 'decrement' and qty > 0:
                    qty -= 1
                
                # Reconstruct: if there was text, preserve it; otherwise just the number
                if unit_text:
                    item['quantity'] = f'{qty} {unit_text}'
                else:
                    item['quantity'] = str(qty)
            else:
                # If no number found at start, try to parse as pure number
                try:
                    qty = int(current_qty)
                    if action == 'increment':
                        qty += 1
                    elif action == 'decrement' and qty > 0:
                        qty -= 1
                    item['quantity'] = str(qty)
                except (ValueError, TypeError):
                    # If all else fails, default to 0
                    item['quantity'] = '0'
        else:
            # Numeric quantity (not a string)
            try:
                qty = int(current_qty)
            except (ValueError, TypeError):
                qty = 0
            
            if action == 'increment':
                qty += 1
            elif action == 'decrement' and qty > 0:
                qty -= 1
            
            item['quantity'] = str(qty)
    
    if write_inventory(inventory):
        return jsonify({'success': True, 'item': item})
    else:
        return jsonify({'error': 'Failed to update inventory'}), 500

@app.route('/api/inventory', methods=['POST'])
def create_item():
    data = request.get_json()
    
    inventory = read_inventory()
    
    # Generate new ID
    max_id = 0
    for item in inventory['items']:
        if item['id'].startswith('item-'):
            try:
                num = int(item['id'].split('-')[1])
                max_id = max(max_id, num)
            except:
                pass
    
    new_item = {
        'id': f'item-{max_id + 1}',
        'name': data.get('name', ''),
        'quantity': data.get('quantity', '0'),
        'group': data.get('group', '')
    }
    
    inventory['items'].append(new_item)
    
    if write_inventory(inventory):
        return jsonify({'success': True, 'item': new_item})
    else:
        return jsonify({'error': 'Failed to create item'}), 500

@app.route('/api/inventory/<item_id>', methods=['DELETE'])
def delete_item(item_id):
    inventory = read_inventory()
    
    item = next((i for i in inventory['items'] if i['id'] == item_id), None)
    if not item:
        return jsonify({'error': 'Item not found'}), 404
    
    inventory['items'] = [i for i in inventory['items'] if i['id'] != item_id]
    
    if write_inventory(inventory):
        return jsonify({'success': True})
    else:
        return jsonify({'error': 'Failed to delete item'}), 500

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

if __name__ == '__main__':
    # For development
    import os
    port = int(os.environ.get('PORT', 3000))
    print(f'Server running at http://localhost:{port}')
    print('Make sure inventory.json exists. Run "python3 parse-csv.py" if needed.')
    app.run(host='0.0.0.0', port=port, debug=True)

