import json
import os
import random
from datetime import datetime # For logging timestamps

# --- Constants ---
# Assuming these paths are relative to the project root where main.py might run from
# Adjust if your execution context is different
DATA_DIR = 'data'
MATERIALS_FILE = os.path.join(DATA_DIR, 'materials.json')
RECIPES_FILE = os.path.join(DATA_DIR, 'crafting_recipes.json')
PLANET_PROFILES_FILE = os.path.join(DATA_DIR, 'planetary_crafting_profiles.json')

# --- Load Data ---
def load_json_data(filepath):
    """Loads JSON data from a file with basic error handling."""
    # Add parent directory to path if running from modules directory itself (less ideal)
    if not os.path.exists(filepath) and not os.path.isabs(filepath):
         alt_path = os.path.join("..", filepath) # Try relative path one level up
         if os.path.exists(alt_path): filepath = alt_path
         # else: print(f"WARN: Data file not found at {filepath} or {alt_path}") # Uncomment for debug

    try:
        # Ensure the directory exists before trying to open the file
        dir_path = os.path.dirname(filepath)
        if dir_path and not os.path.exists(dir_path):
             print(f"WARN: Data directory not found: {dir_path}. Creating it.")
             os.makedirs(dir_path) # Create directory if it doesn't exist

        # Try opening the file
        with open(filepath, 'r') as f:
            # Skip comments (lines starting with '//' or containing 'COMMENT":')
            lines = [line for line in f if not line.strip().startswith('//') and '"COMMENT":' not in line]
            # Reconstruct JSON string without comments - might be fragile
            valid_json_string = ''.join(lines)
            # Handle potential trailing commas if comments were removed improperly
            import re
            valid_json_string = re.sub(r',\s*([\}\]])', r'\1', valid_json_string)

            if not valid_json_string.strip(): # Handle empty file after comment removal
                 print(f"WARN: No valid JSON data found in {filepath} after removing comments.")
                 return {} # Return empty dict for empty valid files

            return json.loads(valid_json_string)

    except FileNotFoundError:
         print(f"ERROR: Data file not found at {filepath}.")
         # Create empty file with comment if not found? Or just return default?
         if not dir_path or not os.path.exists(dir_path): os.makedirs(dir_path, exist_ok=True)
         try:
              with open(filepath, 'w') as f:
                  f.write("{\n  \"COMMENT\": \"Auto-generated empty data file.\"\n}")
              print(f"INFO: Created empty data file at {filepath}")
         except IOError as write_e:
              print(f"ERROR: Could not create empty data file at {filepath}: {write_e}")
         return {} # Return empty dict
    except json.JSONDecodeError as e:
        print(f"ERROR: Failed to decode JSON from {filepath}: {e}")
        print(f"Problematic content start: {valid_json_string[:100]}") # Show start of potentially invalid JSON
        return {}
    except IOError as e: # Catch other file errors (e.g., permissions)
        print(f"ERROR: File system error loading {filepath}: {e}")
        return {}


MATERIALS_DATA = load_json_data(MATERIALS_FILE)
RECIPES_DATA = load_json_data(RECIPES_FILE)
PLANET_PROFILES = load_json_data(PLANET_PROFILES_FILE)

# --- Helper Functions ---

def _log_crafting_event(player_name, message):
    """Basic logger for crafting events."""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[CRAFTING LOG - {timestamp}] {player_name}: {message}")
    # TODO: Integrate with main game's add_log function later via callback or passing state?
    # For now, this print serves as a breadcrumb visible during tests/debugging.

def get_material_property(material_name, property_name, default=None):
    """Safely gets a property for a material from loaded data."""
    if not MATERIALS_DATA: return default # Handle case where data failed to load
    material = MATERIALS_DATA.get(material_name)
    if material is None:
        # print(f"WARN: Material '{material_name}' not found in MATERIALS_DATA.") # Debug noise
        return default
    return material.get(property_name, default)


# --- Core Crafting Logic ---

def check_materials_availability(player_inventory, required_materials):
    """Checks if the player has enough materials."""
    missing = []
    print(f"DEBUG crafting: Checking availability. Have: {player_inventory}. Need: {required_materials}") # Breadcrumb
    for material, needed_qty in required_materials.items():
        # Ensure needed quantity is positive
        if needed_qty <= 0: continue
        has_qty = player_inventory.get(material, 0)
        if has_qty < needed_qty:
            missing.append((material, needed_qty, has_qty))

    if missing:
        print(f"DEBUG crafting: Missing materials found: {missing}") # Breadcrumb
        return False, missing
    else:
        print("DEBUG crafting: All materials available.") # Breadcrumb
        return True, []

def validate_recipe_requirements(player_state, recipe_data):
    """Checks player skill and location services (placeholder)."""
    player_name = player_state.get("name", "Unknown Player")
    min_skill = recipe_data.get("min_crafting_skill")
    req_station = recipe_data.get("required_station_type") # e.g., "Quantum Forge"
    player_skill = player_state.get("skills", {}).get("crafting", 0)

    # --- Placeholder for location services ---
    # In a real game, we'd look up the services at player_state['location']
    # For now, assume all stations are available unless explicitly required by recipe.
    location_services = ["basic_workbench"] # Example default service
    if player_state.get("location") == "Technoterra": # Example specific location
        location_services.extend(["Advanced Fabricator", "Quantum Forge"])
    # --- End Placeholder ---

    print(f"DEBUG crafting: Validating reqs. Skill: {player_skill} (Need {min_skill}), Station: {req_station} (Avail: {location_services})") # Breadcrumb

    if min_skill is not None and player_skill < min_skill:
        reason = f"Insufficient crafting skill ({player_skill}/{min_skill})."
        _log_crafting_event(player_name, f"Recipe requirement failed: {reason}") # Breadcrumb
        return False, reason
    if req_station and req_station not in location_services:
        reason = f"Required station '{req_station}' not available here."
        _log_crafting_event(player_name, f"Recipe requirement failed: {reason}") # Breadcrumb
        return False, reason

    print(f"DEBUG crafting: Recipe requirements validated for {player_name}.") # Breadcrumb
    return True, ""

def calculate_bonuses(player_state, recipe_data):
    """Calculates efficiency bonuses based on planet and skills."""
    player_name = player_state.get("name", "Unknown Player")
    planet = player_state.get("location")
    planet_profile = PLANET_PROFILES.get(planet, {})
    input_materials = recipe_data.get("inputs", {})
    # Initialize bonuses
    bonuses = {'efficiency_mult': 1.0, 'quality_mod': 0.0, 'special_yield_chance': 0.0}

    _log_crafting_event(player_name, f"Calculating bonuses for recipe on {planet}.") # Breadcrumb

    # 1. Planetary Efficiency Bonus (based on input material tags)
    eff_bonus_rules = planet_profile.get("efficiency_bonus", {})
    applied_planet_bonus = 0.0 # Track the sum of bonuses applied from planet profile
    material_tags_present = set()
    for mat_name in input_materials:
         tags = get_material_property(mat_name, "tags", [])
         if tags: material_tags_present.update(tags)

    for rule, bonus_val in eff_bonus_rules.items():
        target_type, target_value = rule.split(":", 1) # e.g., "tag:metallic" -> "tag", "metallic"
        apply_bonus = False
        if target_type == "tag" and target_value in material_tags_present:
             apply_bonus = True
        # Add elif for "rarity:common" etc. if needed later

        if apply_bonus:
            # Assume bonus_val is multiplier like 1.10, add the portion > 1.0
            bonus_to_add = max(0, bonus_val - 1.0) # Ensure non-negative bonus
            applied_planet_bonus += bonus_to_add
            _log_crafting_event(player_name, f"Applied planetary efficiency bonus +{bonus_to_add:.0%} for rule '{rule}'.") # Breadcrumb

    bonuses['efficiency_mult'] += applied_planet_bonus

    # 2. Player Skill Bonus (simple efficiency boost)
    crafting_skill = player_state.get("skills", {}).get("crafting", 0)
    skill_bonus = crafting_skill * 0.005 # Example: +0.5% efficiency per skill point
    if skill_bonus > 0:
         bonuses['efficiency_mult'] += skill_bonus
         _log_crafting_event(player_name, f"Applied skill efficiency bonus +{skill_bonus:.1%}.") # Breadcrumb

    # Ensure multiplier doesn't go below zero
    bonuses['efficiency_mult'] = max(0, bonuses['efficiency_mult'])

    print(f"DEBUG crafting: Final bonuses calculated: {bonuses}") # Breadcrumb
    return bonuses

def consume_materials(player_inventory, required_materials):
    """Removes materials from inventory. Modifies the dictionary in place."""
    print(f"DEBUG crafting: Consuming materials: {required_materials}") # Breadcrumb
    consumed_summary = []
    for material, needed_qty in required_materials.items():
        if material in player_inventory:
            # Ensure we don't consume more than available (should be pre-checked)
            consume_qty = min(needed_qty, player_inventory.get(material, 0))
            player_inventory[material] -= consume_qty
            consumed_summary.append(f"{consume_qty}x {material}")
            if player_inventory[material] <= 0:
                del player_inventory[material]
        else:
            print(f"WARN crafting: Attempted to consume missing material '{material}' during consumption phase.") # Should not happen
    print(f"DEBUG crafting: Consumption complete. Consumed: {', '.join(consumed_summary)}") # Breadcrumb


def add_crafted_item(player_inventory, player_cargo_capacity, item_name, quantity):
    """Adds crafted item(s), checking cargo space. Modifies inventory in place."""
    # Assume 1 space per item for now. Refine with item data later.
    space_per_item = 1
    space_needed = quantity * space_per_item
    # Calculate current cargo usage based *only* on quantities
    current_cargo_used = sum(v for v in player_inventory.values() if isinstance(v, int))
    available_space = player_cargo_capacity - current_cargo_used

    # Clamp quantity to what can fit
    items_to_add = min(quantity, max(0, available_space // space_per_item))

    print(f"DEBUG crafting: Adding item '{item_name}'. Qty: {quantity}, SpaceNeed: {space_needed}, SpaceAvail: {available_space}, CanAdd: {items_to_add}") # Breadcrumb

    if items_to_add <= 0:
        print(f"WARN crafting: Not enough cargo space for crafted item '{item_name}'. Needed: {space_needed}, Available: {available_space}.") # Breadcrumb
        return 0

    player_inventory[item_name] = player_inventory.get(item_name, 0) + items_to_add
    print(f"DEBUG crafting: Added {items_to_add}x {item_name}. New inventory count: {player_inventory.get(item_name)}") # Breadcrumb

    if items_to_add < quantity:
        print(f"WARN crafting: Only added {items_to_add}/{quantity} of '{item_name}' due to cargo space limits.") # Breadcrumb

    return items_to_add


# --- Main Crafting Function ---

def attempt_crafting(player_state, recipe_name):
    """Attempts to craft an item based on a recipe name."""
    player_name = player_state.get("name", "Unknown Player")
    _log_crafting_event(player_name, f"Attempting to craft recipe: '{recipe_name}'")
    report = {'success': False, 'message': 'Crafting prerequisites not met.'} # Default fail

    # 1. Get Recipe Data
    recipe_data = RECIPES_DATA.get(recipe_name)
    if not recipe_data:
        report['message'] = f"Recipe '{recipe_name}' not found."
        _log_crafting_event(player_name, report['message']); return report
    input_materials = recipe_data.get("inputs", {})
    if not input_materials:
        report['message'] = f"Recipe '{recipe_name}' has invalid inputs."
        _log_crafting_event(player_name, report['message']); return report

    # 2. Check Requirements (Skill, Station)
    req_met, req_reason = validate_recipe_requirements(player_state, recipe_data)
    if not req_met:
        report['message'] = req_reason; return report

    # 3. Check Materials Availability
    # Ensure cargo_hold exists and is a dict
    player_inventory = player_state.setdefault('cargo_hold', {})
    if not isinstance(player_inventory, dict):
         report['message'] = "Invalid player inventory format."
         _log_crafting_event(player_name, report['message']); return report

    has_mats, missing_mats = check_materials_availability(player_inventory, input_materials)
    if not has_mats:
        report['message'] = "Insufficient materials."; report['missing_materials'] = missing_mats
        _log_crafting_event(player_name, f"{report['message']} Missing: {missing_mats}"); return report

    # --- If checks pass, proceed to craft ---
    _log_crafting_event(player_name, f"Checks passed for '{recipe_name}'. Proceeding...")
    report = {'success': False, 'message': 'Crafting process failed.'} # Reset report

    # 4. Calculate Bonuses
    bonuses = calculate_bonuses(player_state, recipe_data)
    report['bonuses_applied'] = bonuses

    # 5. Consume Materials (Modifies player_state['cargo_hold'] directly)
    consume_materials(player_inventory, input_materials)

    # 6. Determine Output & Add to Inventory
    output_item_name = recipe_name # Simple assumption: output name is recipe name
    output_base_quantity = recipe_data.get("output_quantity", 1)
    final_quantity = max(1, int(output_base_quantity * bonuses.get('efficiency_mult', 1.0))) # Ensure at least 1, apply bonus

    items_added = add_crafted_item(
        player_inventory, # Modifies player_state['cargo_hold']
        player_state.get("cargo_capacity", 0),
        output_item_name,
        final_quantity
    )

    # 7. Generate Final Report
    # FIX: Set quantity_added regardless of success/failure to add
    report['quantity_added'] = items_added
    report['item_crafted'] = output_item_name # Also useful to know what was attempted

    if items_added > 0:
        report['success'] = True
        # report['item_crafted'] = output_item_name # Already set above
        # report['quantity_added'] = items_added # Already set above
        report['message'] = f"Successfully crafted {items_added}x {output_item_name}."
        if items_added < final_quantity:
            report['message'] += f" ({final_quantity - items_added} lost due to space)."
        _log_crafting_event(player_name, report['message'])
    else:
        report['success'] = False # Failure because nothing was added
        # report['item_crafted'] = output_item_name # Already set above
        # report['quantity_added'] = items_added # Already set above (as 0)
        report['message'] = f"Materials consumed for '{output_item_name}', but failed to add to inventory (no cargo space)."
        _log_crafting_event(player_name, report['message'])

    return report 