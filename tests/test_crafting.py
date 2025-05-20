import unittest
import copy
from unittest.mock import patch, MagicMock
import os
import sys

# Add project root to sys.path to ensure modules can be found
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Now we can import from modules
from modules import crafting_engine

# Define path to test data files (relative to test file location perhaps)
# Assuming tests are run from the root project directory
TEST_DATA_DIR = 'data'
# Make sure the engine uses test data if needed, or mock the load_json_data function

class TestCraftingEngine(unittest.TestCase):

    def setUp(self):
        """Set up a default player state for crafting tests."""
        # Example player state - adjust as needed for game structure
        self.player_state = {
            "name": "Test Crafter",
            "credits": 1000,
            "ship_type": "Shuttle",
            "cargo_hold": {},
            "cargo_capacity": 20, # Decent capacity for testing
            "location": "Mars Colony", # A planet with bonuses
            "skills": {"crafting": 5}, # Initial crafting skill
            "log": [],
            "breadcrumbs": []
            # Add other relevant player state fields if needed by crafting
        }
        # Make a deep copy for comparisons where state shouldn't change
        self.initial_player_state = copy.deepcopy(self.player_state)

        # --- Mocking Data Loading ---
        # Option 1: Patch the loaded data constants directly within the engine module
        self.patcher_materials = patch.dict(crafting_engine.MATERIALS_DATA, {
            "Star Iron": {"rarity": "common", "tags": ["metallic"], "baseValue": 50},
            "Scrap Metal": {"rarity": "common", "tags": ["metallic"], "baseValue": 15},
            "Rare Crystals": {"rarity": "rare", "tags": ["crystal"], "baseValue": 250},
            "COMMENT": "Mock materials"
        }, clear=True) # clear=True replaces the dict entirely
        self.patcher_recipes = patch.dict(crafting_engine.RECIPES_DATA, {
             "Basic Hull Plating": {"inputs": {"Star Iron": 5, "Scrap Metal": 10}, "output_quantity": 1, "min_crafting_skill": 1},
             "Energy Cell": {"inputs": {"Rare Crystals": 2, "Scrap Metal": 5}, "output_quantity": 1, "min_crafting_skill": 5},
             "COMMENT": "Mock recipes"
        }, clear=True)
        self.patcher_profiles = patch.dict(crafting_engine.PLANET_PROFILES, {
             "Mars Colony": {"efficiency_bonus": {"tag:metallic": 1.10}}, # 10% bonus for metallic
             "COMMENT": "Mock profiles"
        }, clear=True)

        # Start the patchers
        self.mock_materials = self.patcher_materials.start()
        self.mock_recipes = self.patcher_recipes.start()
        self.mock_profiles = self.patcher_profiles.start()
        self.addCleanup(self.patcher_materials.stop) # Ensure patchers stop even if test fails
        self.addCleanup(self.patcher_recipes.stop)
        self.addCleanup(self.patcher_profiles.stop)


    def test_check_materials_availability_success(self):
        """Test check passes when player has enough materials."""
        self.player_state['cargo_hold'] = {"Star Iron": 10, "Scrap Metal": 20}
        required = {"Star Iron": 5, "Scrap Metal": 10}
        has_mats, missing = crafting_engine.check_materials_availability(self.player_state['cargo_hold'], required)
        self.assertTrue(has_mats)
        self.assertEqual(missing, [])

    def test_check_materials_availability_fail(self):
        """Test check fails when player lacks materials."""
        self.player_state['cargo_hold'] = {"Star Iron": 3, "Scrap Metal": 20} # Not enough Star Iron
        required = {"Star Iron": 5, "Scrap Metal": 10}
        has_mats, missing = crafting_engine.check_materials_availability(self.player_state['cargo_hold'], required)
        self.assertFalse(has_mats)
        self.assertEqual(len(missing), 1)
        self.assertEqual(missing[0], ("Star Iron", 5, 3)) # Check material, needed, has

    # --- Placeholder Tests for attempt_crafting ---
    # We will expand these as the engine logic gets filled in

    def test_crafting_success_basic_recipe(self):
        """Test crafting a simple item successfully."""
        self.player_state['cargo_hold'] = {"Star Iron": 10, "Scrap Metal": 20}
        recipe_name = "Basic Hull Plating"
        initial_iron = self.player_state['cargo_hold']['Star Iron']
        initial_scrap = self.player_state['cargo_hold']['Scrap Metal']

        report = crafting_engine.attempt_crafting(self.player_state, recipe_name)

        # Assertions
        self.assertTrue(report.get('success'), f"Crafting failed unexpectedly: {report.get('message')}")
        self.assertEqual(report.get('item_crafted'), recipe_name)
        self.assertEqual(report.get('quantity_added'), 1)
        # Check materials were consumed
        self.assertEqual(self.player_state['cargo_hold'].get("Star Iron"), initial_iron - 5)
        self.assertEqual(self.player_state['cargo_hold'].get("Scrap Metal"), initial_scrap - 10)
        # Check item was added
        self.assertEqual(self.player_state['cargo_hold'].get(recipe_name), 1)

    def test_crafting_fail_insufficient_materials(self):
        """Test crafting fails if materials are missing."""
        self.player_state['cargo_hold'] = {"Star Iron": 3, "Scrap Metal": 20} # Not enough Star Iron
        recipe_name = "Basic Hull Plating"
        initial_cargo = copy.deepcopy(self.player_state['cargo_hold'])

        report = crafting_engine.attempt_crafting(self.player_state, recipe_name)

        self.assertFalse(report.get('success'))
        self.assertIn("Insufficient materials", report.get('message', ''))
        self.assertTrue('missing_materials' in report)
        self.assertEqual(len(report.get('missing_materials', [])), 1)
        # Check inventory unchanged
        self.assertDictEqual(self.player_state['cargo_hold'], initial_cargo)

    def test_crafting_fail_insufficient_skill(self):
        """Test crafting fails if skill requirement is not met."""
        self.player_state['cargo_hold'] = {"Rare Crystals": 5, "Scrap Metal": 10}
        self.player_state['skills']['crafting'] = 3 # Skill is 3, needs 5 for Energy Cell
        recipe_name = "Energy Cell"
        initial_cargo = copy.deepcopy(self.player_state['cargo_hold'])

        report = crafting_engine.attempt_crafting(self.player_state, recipe_name)

        self.assertFalse(report.get('success'))
        self.assertIn("Insufficient crafting skill", report.get('message', ''))
        # Check inventory unchanged
        self.assertDictEqual(self.player_state['cargo_hold'], initial_cargo)

    def test_crafting_with_planetary_bonus(self):
        """Test that planetary bonuses affect the outcome (e.g., efficiency)."""
        self.player_state['cargo_hold'] = {"Star Iron": 10, "Scrap Metal": 20}
        self.player_state['location'] = "Mars Colony" # Has 10% bonus for metallic tags
        recipe_name = "Basic Hull Plating" # Uses metallic items
        # Mock random if efficiency bonus includes chance element later
        # Expected base quantity = 1. Bonus multiplier = 1.1 (Mars) + 0.025 (Skill 5) = 1.125
        # Expected final quantity = int(1 * 1.125) = 1 (no change yet)
        # Let's modify the recipe temporarily for the test to output more
        # Or add a skill bonus test separately? Let's test the bonus application.
        # We check the bonuses_applied dict in the report.

        report = crafting_engine.attempt_crafting(self.player_state, recipe_name)

        self.assertTrue(report.get('success'), f"Crafting failed: {report.get('message')}")
        self.assertIn('bonuses_applied', report)
        # Check if Mars bonus for metallic was applied (1.1 = 1.0 + 0.1 bonus)
        # Check if skill bonus was applied (5 * 0.005 = 0.025)
        expected_efficiency = 1.0 + 0.10 + (5 * 0.005) # Planet + Skill
        self.assertAlmostEqual(report['bonuses_applied'].get('efficiency_mult', 1.0), expected_efficiency)


    def test_crafting_fail_cargo_full(self):
        """Test crafting 'succeeds' but adds 0 items if cargo is full."""
        self.player_state['cargo_hold'] = {"Star Iron": 10, "Scrap Metal": 20}
        self.player_state['cargo_capacity'] = 0 # No space
        recipe_name = "Basic Hull Plating"
        initial_iron = 10; initial_scrap = 20 # Mats will be consumed

        report = crafting_engine.attempt_crafting(self.player_state, recipe_name)

        self.assertFalse(report.get('success')) # Report overall failure because item not added
        self.assertEqual(report.get('quantity_added', -1), 0) # Check 0 items added
        self.assertIn("failed to add", report.get('message',''))
        # Check materials were consumed (current logic)
        self.assertEqual(self.player_state['cargo_hold'].get("Star Iron"), initial_iron - 5)
        self.assertEqual(self.player_state['cargo_hold'].get("Scrap Metal"), initial_scrap - 10)
        self.assertNotIn(recipe_name, self.player_state['cargo_hold']) # Item not present


if __name__ == '__main__':
    unittest.main() 