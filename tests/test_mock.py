"""Mock data structures that match test expectations"""

# Structure data with the expected keys (build_cost and effects)
MOCK_STRUCTURES = {
    "small_solar_array": {
        "name": "Small Solar Array",
        "build_cost": {"credits": 100, "resources": {"Basic Alloy Ingot": 5}},
        "effects": {"power_generation": 25},
        "build_time": 3,
        "description": "Small solar power generator"
    },
    "basic_hab_module_structure": {
        "name": "Basic Habitation Module",
        "build_cost": {"credits": 200, "resources": {"Basic Alloy Ingot": 10, "Composite Panels": 5}},
        "effects": {"power_consumption": 15, "population_capacity": 5},
        "build_time": 5,
        "description": "Basic living quarters"
    },
    "command_center": {
        "name": "Command Center",
        "build_cost": {"credits": 500, "resources": {}},
        "effects": {"power_generation": 10, "power_consumption": 5},
        "build_time": 0,
        "description": "Central command hub"
    }
}

# Missions with the expected format (ID as key, item field named correctly)
MOCK_MISSIONS = {
    1: {
        "id": 1,
        "type": "delivery",
        "description": "Deliver supplies to Alpha Station",
        "destination": "Alpha Station",
        "item": "Food Supplies",
        "cargo_item": "Food Supplies",
        "quantity": 5,
        "cargo_quantity": 5,
        "reward": 200
    }
}

# Simple ships data
MOCK_SHIPS = {
    "Shuttle": {"cargo_capacity": 50, "cost": 0, "description": "Basic starter ship"},
    "Freighter": {"cargo_capacity": 200, "cost": 5000, "description": "Large cargo ship"}
}

# Some goods for trading tests
MOCK_GOODS = {
    "Food Supplies": {"base_value": 50, "description": "Basic food supplies"},
    "Minerals": {"base_value": 75, "description": "Raw mineral resources"},
    "Robotics": {"base_value": 150, "description": "Advanced robotic components"}
}

from tests.test_mock import MOCK_STRUCTURES, MOCK_MISSIONS

# Before the tests:
missions_template = MOCK_MISSIONS 

MOCK_LOCATIONS = {
    "Mars Colony": {
        "name": "Mars Colony",
        "description": "A bustling frontier settlement.",
        "market": True, # Crucially, indicate a market exists
        "shipyard": True,
        "connections": ["Earth", "Jupiter Station"],
        "travel_cost": 50
    },
    "Earth": {
        "name": "Earth",
        "description": "The cradle of humanity.",
        "market": True,
        "shipyard": True,
        "connections": ["Mars Colony", "Aetheria"],
        "travel_cost": 50
    },
    "Aetheria": {
        "name": "Aetheria",
        "description": "A mysterious location.",
        "market": False,
        "shipyard": False,
        "connections": ["Earth"],
        "travel_cost": 100
    },
    "Jupiter Station": {
        "name": "Jupiter Station",
        "description": "Major trading hub.",
        "market": True,
        "shipyard": True,
        "connections": ["Mars Colony"],
        "travel_cost": 75
    }
    # Add other locations if needed for other tests
} 