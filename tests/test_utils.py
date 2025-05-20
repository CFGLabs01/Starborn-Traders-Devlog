"""Testing utility functions to supplement the ones from main.py with compatibility."""

def calculate_distance(origin, destination):
    """Test function for distance calculation."""
    if origin == destination:
        return 0
    return 50  # Default distance for testing

def construction_menu(player, structure_id=None, structure_data=None):
    """Test-compatible version of construction_menu that allows direct structure building."""
    if not structure_id:
        return None
        
    # If structures data is provided but structure not found
    if structure_data and structure_id not in structure_data:
        return False, f"Structure {structure_id} not found"
        
    # Resource check
    if structure_data and structure_id in structure_data:
        required_resources = structure_data[structure_id].get("cost", {}).get("resources", {})
        available_resources = player["hub_state"].get("planetary_assets", {})
        
        # Check if resources are sufficient
        missing = []
        for resource, amount in required_resources.items():
            if available_resources.get(resource, 0) < amount:
                missing.append(f"{resource} (need {amount}, have {available_resources.get(resource, 0)})")
                
        if missing:
            return False, f"Missing resources: {', '.join(missing)}"
            
        # Power check for power-consuming structures
        if structure_data[structure_id].get("power_consumption", 0) > 0:
            hub = player["hub_state"]
            power_balance = hub.get("power_balance", 0)
            if power_balance < structure_data[structure_id]["power_consumption"]:
                return False, "Insufficient power to operate this structure"
        
        # Success case - would normally add to construction queue
        return True, f"Construction of {structure_id} started"
    
    return False, "Invalid structure or missing data"

def update_construction(player, structures_data=None):
    """Test-compatible version that updates hub balances."""
    hub = player["hub_state"]
    
    # Calculate power balance
    power_gen = hub.get("power_generation", 0)
    power_use = hub.get("power_consumption", 0)
    hub["power_balance"] = power_gen - power_use
    
    # Calculate food balance
    food_gen = hub.get("food_generation", 0)
    food_use = hub.get("food_consumption", 0)
    hub["food_balance"] = food_gen - food_use

def trade_sell(player, item_name, quantity):
    """Test helper for selling items directly without input simulation."""
    if item_name not in player["cargo_hold"]:
        return False, f"{item_name} not found in cargo"
        
    available = player["cargo_hold"][item_name]
    if quantity > available:
        return False, f"Not enough {item_name} (have {available}, tried to sell {quantity})"
        
    # Perform the sale
    sell_price = 50  # Test value
    player["credits"] += sell_price * quantity
    player["cargo_hold"][item_name] -= quantity
    
    # Remove item if quantity drops to zero
    if player["cargo_hold"][item_name] == 0:
        del player["cargo_hold"][item_name]
        
    return True, f"Sold {quantity} {item_name} for {sell_price * quantity} credits" 