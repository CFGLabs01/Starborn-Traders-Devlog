from flask import Flask, jsonify, send_from_directory, request
import os
import sys
import copy # Needed for deep copies if modifying state before sending

# --- Add project root to path to find main.py ---
# Get the directory where app.py is located
current_dir = os.path.dirname(os.path.abspath(__file__))
# Add this directory to sys.path
sys.path.insert(0, current_dir)
# --- End Path Addition ---


# --- Import necessary function(s) from main ---
# We need to handle potential errors during import if main.py has issues
try:
    # Import ONLY the functions needed by the API for now
    from main import (
        initialize_player, travel_to, locations,
        trade_buy, trade_sell, # Import trade functions
        get_dynamic_prices, all_tradeable_items # Import pricing and item data
    )
    MAIN_IMPORT_SUCCESS = True
    # --- Initialize Server-Side Game State ONCE at module load ---
    print("Initializing server game state at module load...")
    server_game_state = initialize_player("Server User")
    print("...Server game state initialized.")
except ImportError as e:
    print(f"!!! CRITICAL ERROR importing from main.py: {e}")
    print("!!! Flask app cannot start without main module.")
    MAIN_IMPORT_SUCCESS = False
    # Optionally define a dummy function for Flask to run without crashing immediately
    def initialize_player(name): return {"error": "Failed to load main module"}
    def travel_to(state, dest): return False, "Backend main module failed to load." # Dummy function
    server_game_state = None # Ensure variable exists even on import error
    locations = {} # Define locations as empty dict on import error
    all_tradeable_items = {}
    # Dummy functions for error case
    def trade_buy(state, item, qty): return False, "Backend module failed to load."
    def trade_sell(state, item, qty): return False, "Backend module failed to load."
    def get_dynamic_prices(items, loc): return {}
# --- End Import ---


# --- Flask App Setup ---
# Static folder is 'src/assets', static_url_path is '/assets'
# This means Flask will automatically look for 'index.html' in '.' when '/' is requested.
# Setting static_folder=None because we will handle static files manually or let React handle its assets.
# Serve index.html from the root directory.
app = Flask(__name__, static_folder=None)


# --- API Endpoints (Define FIRST so they take precedence) ---

@app.route('/api/game_state', methods=['GET'])
def get_game_state():
    """
    Gets the current game state including available destinations and market prices.
    """
    if not MAIN_IMPORT_SUCCESS or server_game_state is None:
        # Handle case where initial import/initialization failed
        return jsonify({"error": "Backend module/state failed to initialize."}), 500

    state_to_send = _get_state_with_extras(server_game_state)
    if state_to_send is None:
         return jsonify({"error": "Failed to prepare game state."}), 500

    try:
        return jsonify(state_to_send) # Send the modified state
    except Exception as e:
        print(f"!!! ERROR during jsonify in get_game_state: {e}")
        return jsonify({"error": "Failed to serialize game state to JSON."}), 500


@app.route('/api/travel', methods=['POST'])
def handle_travel_api():
    """ Handles requests to travel to a new location."""
    global server_game_state
    if not MAIN_IMPORT_SUCCESS or server_game_state is None:
        return jsonify({"success": False, "message": "Server state not initialized", "newState": None}), 500

    data = request.get_json() # Get data sent from frontend
    if not data or 'destination' not in data:
        return jsonify({"success": False, "message": "Missing 'destination'", "newState": _get_state_with_extras(server_game_state)}), 400

    destination = data['destination']
    print(f"API: Received travel request to {destination}")

    # Call the actual game logic function from main.py
    # It modifies server_game_state directly and returns success/message
    success, message = travel_to(server_game_state, destination)

    print(f"API: Travel result - Success: {success}, Message: {message}")

    # --- Also add destinations to the returned state after travel ---
    if success:
        current_location_name = server_game_state.get('location')
        if current_location_name and locations:
            current_location_data = locations.get(current_location_name, {})
            available_destinations = current_location_data.get('connections', [])
        else:
            available_destinations = []
        # Create copy to send back
        state_to_send = server_game_state.copy()
        state_to_send['available_destinations'] = available_destinations
    else:
        # On failure, send back the state as it was before travel attempt,
        # but still include destinations for the original location
        current_location_name = server_game_state.get('location') # Location didn't change
        if current_location_name and locations:
             current_location_data = locations.get(current_location_name, {})
             available_destinations = current_location_data.get('connections', [])
        else:
             available_destinations = []
        state_to_send = server_game_state.copy()
        state_to_send['available_destinations'] = available_destinations
    # --- End modification ---

    # Return the outcome and the UPDATED state
    return jsonify({
        "success": success,
        "message": message,
        "newState": state_to_send # Send state including destinations
    })

# --- NEW: Buy Endpoint ---
@app.route('/api/buy', methods=['POST'])
def handle_buy_api():
    """ Handles requests to buy items."""
    global server_game_state
    if not MAIN_IMPORT_SUCCESS or server_game_state is None:
        return jsonify({"success": False, "message": "Server state not initialized", "newState": None}), 500

    data = request.get_json()
    item_name = data.get('item_name')
    quantity_str = data.get('quantity')

    if not item_name or not quantity_str:
        return jsonify({"success": False, "message": "Missing 'item_name' or 'quantity'", "newState": _get_state_with_extras(server_game_state)}), 400

    try:
        quantity = int(quantity_str)
        if quantity <= 0: raise ValueError("Quantity must be positive")
    except ValueError:
         return jsonify({"success": False, "message": "Invalid 'quantity'", "newState": _get_state_with_extras(server_game_state)}), 400

    print(f"API: Received buy request for {quantity} of {item_name}")
    success, message = trade_buy(server_game_state, item_name, quantity) # Modifies state

    state_to_send = _get_state_with_extras(server_game_state)

    return jsonify({
        "success": success,
        "message": message,
        "newState": state_to_send
    })

# --- NEW: Sell Endpoint ---
@app.route('/api/sell', methods=['POST'])
def handle_sell_api():
    """ Handles requests to sell items."""
    global server_game_state
    if not MAIN_IMPORT_SUCCESS or server_game_state is None:
        return jsonify({"success": False, "message": "Server state not initialized", "newState": None}), 500

    data = request.get_json()
    item_name = data.get('item_name')
    quantity_str = data.get('quantity')

    if not item_name or not quantity_str:
        return jsonify({"success": False, "message": "Missing 'item_name' or 'quantity'", "newState": _get_state_with_extras(server_game_state)}), 400

    try:
        quantity = int(quantity_str)
        if quantity <= 0: raise ValueError("Quantity must be positive")
    except ValueError:
         return jsonify({"success": False, "message": "Invalid 'quantity'", "newState": _get_state_with_extras(server_game_state)}), 400

    print(f"API: Received sell request for {quantity} of {item_name}")
    success, message = trade_sell(server_game_state, item_name, quantity) # Modifies state

    state_to_send = _get_state_with_extras(server_game_state)

    return jsonify({
        "success": success,
        "message": message,
        "newState": state_to_send
    })

# --- Static File Serving for root files (CSS, Title Screen JS) ---
# Serve specific allowed files from the root directory
@app.route('/<path:filename>')
def serve_root_static(filename):
    root_dir = os.path.dirname(os.path.abspath(__file__))
    # Allow specific root files needed by index.html (title screen)
    # Only favicon.ico might be relevant now, as Vite handles others.
    allowed_root_files = ['favicon.ico']

    # --- Simplified Logic ---
    if filename in allowed_root_files:
        asset_path = os.path.join(root_dir, filename)
        if os.path.exists(asset_path):
            print(f"Serving static file: {filename} from {root_dir}")
            return send_from_directory(root_dir, filename)
        else:
            print(f"Static file '{filename}' allowed but not found at '{asset_path}'. Falling through to React app.")
            return serve_react_app(filename) # Fall through if file is allowed but doesn't exist
    else:
        print(f"Path '{filename}' not in allowed_root_files, falling through to React app.")
        return serve_react_app(filename)

# --- Catch-all Route for React App (Client-Side Routing) ---
# This route should match any path NOT handled by the API or specific static files above.
# It serves the main index.html, allowing React Router to handle the specific route.
# --- Note: The route definition might overlap slightly with the one above ---
#       Flask processes routes in order. The '/<path:filename>' in serve_root_static
#       will catch everything first. Its logic now explicitly falls through
#       to serve_react_app for non-favicon requests.
#       Keeping the explicit '/<path:path>' route for serve_react_app might be redundant
#       but harmless, or potentially useful if serve_root_static logic changes later.
#       We also need the '@app.route('/')' for the root path.
@app.route('/') # Serve index.html for root path as well
@app.route('/<path:path>') # This might technically be redundant now but kept for clarity/safety
def serve_react_app(path=None):
    """Serves the main index.html for React app routes."""
    root_dir = os.path.dirname(os.path.abspath(__file__))
    # We always serve index.html for any route handled by React Router
    # Make sure your build process places index.html in the root, or adjust path here.
    # Also ensure Vite injects the correct JS/CSS links into this index.html during build.
    index_path = os.path.join(root_dir, 'index.html')
    if os.path.exists(index_path):
        print(f"Serving index.html for path: {path if path else '/'}")
        return send_from_directory(root_dir, 'index.html')
    else:
        print(f"Error: index.html not found at {index_path}")
        return "index.html not found!", 404

# --- Helper Function to add extras to state ---
def _get_state_with_extras(game_state):
    """Adds available destinations and market prices to the game state dict."""
    if game_state is None:
        return None

    state_copy = copy.deepcopy(game_state) # Work with a copy

    # Add available destinations
    current_location_name = state_copy.get('location')
    if current_location_name and locations:
        current_location_data = locations.get(current_location_name, {})
        state_copy['available_destinations'] = current_location_data.get('connections', [])
    else:
        state_copy['available_destinations'] = []

    # Add market prices (only for items available at the location)
    state_copy['market_prices'] = {}
    if current_location_name and locations and all_tradeable_items:
        location_data = locations.get(current_location_name, {})
        # Assuming locations.json has a "market_items" list per location
        items_available = location_data.get('market_items', [])
        if items_available: # Check if the list exists and is not empty
            items_data_subset = {
                item: all_tradeable_items[item]
                for item in items_available if item in all_tradeable_items
            }
            if items_data_subset: # Check if subset has items before calling price func
                 state_copy['market_prices'] = get_dynamic_prices(items_data_subset, current_location_name)

    return state_copy

# --- Main Execution (Keep existing) ---
if __name__ == '__main__':
    # Check if main module imported correctly before running
    if not MAIN_IMPORT_SUCCESS:
        print("!!! Flask app cannot run due to main.py import errors.")
    else:
        print("Starting Flask server...")
        # Use port 5002 as seen in logs
        app.run(debug=True, host='0.0.0.0', port=5002)
