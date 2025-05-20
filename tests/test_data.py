"""Mock data for testing, mimicking the JSON file structures."""

MOCK_STRUCTURES = {
    "small_solar_array": {
        "name": "Small Solar Array",
        "cost": {"credits": 100, "resources": {"Basic Alloy Ingot": 5}},
        "power_generation": 25,
        "power_consumption": 0,
        "build_time": 3,
        "description": "Small solar power generator"
    },
    "basic_hab_module_structure": {
        "name": "Basic Habitation Module",
        "cost": {"credits": 200, "resources": {"Basic Alloy Ingot": 10, "Composite Panels": 5}},
        "power_generation": 0,
        "power_consumption": 15,
        "population_capacity": 5,
        "build_time": 5,
        "description": "Basic living quarters"
    },
    "command_center": {
        "name": "Command Center",
        "cost": {"credits": 500, "resources": {}},
        "power_generation": 10,
        "power_consumption": 5,
        "build_time": 0,
        "description": "Central command hub"
    }
}

MOCK_MISSIONS = [
    {
        "id": 1,
        "type": "delivery",
        "description": "Deliver supplies to Alpha Station",
        "destination": "Alpha Station",
        "item": "Food Supplies",
        "quantity": 5,
        "reward": 200
    }
]

MOCK_GOODS = {
    "Food Supplies": {"base_value": 50, "description": "Basic food supplies"},
    "Minerals": {"base_value": 75, "description": "Raw mineral resources"},
    "Robotics": {"base_value": 150, "description": "Advanced robotic components"},
    "Basic Wiring Harness": {"base_value": 25, "description": "Simple electrical wiring"},
    "Scrap Metal": {"base_value": 10, "description": "Salvageable metal pieces"}
}

MOCK_SHIPS = {
    "Shuttle": {"cargo_capacity": 50, "cost": 0, "description": "Basic starter ship"},
    "Freighter": {"cargo_capacity": 200, "cost": 5000, "description": "Large cargo ship"}
} 