import os
import json
import unittest
import io
from app import app

class BackendTestCase(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        self.client = app.test_client()
        
        # Override paths to use test folder
        self.base_dir = os.path.dirname(os.path.abspath(__file__))
        self.test_registry = os.path.join(self.base_dir, 'data', 'assets_registry.json')
        
    def test_01_health(self):
        response = self.client.get('/api/health')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data['status'], 'ok')
        self.assertIn('Modular', data['message'])

    def test_02_upload_deduplication(self):
        # 1. First upload
        file_content_1 = b"dummy png content of tilesheet 123"
        response1 = self.client.post(
            '/api/upload',
            data={'file': (io.BytesIO(file_content_1), 'tilesheet.png')},
            content_type='multipart/form-data'
        )
        self.assertEqual(response1.status_code, 200)
        url1 = response1.get_json()['url']
        
        # 2. Second upload (same content, different filename)
        response2 = self.client.post(
            '/api/upload',
            data={'file': (io.BytesIO(file_content_1), 'sheet_duplicate.png')},
            content_type='multipart/form-data'
        )
        self.assertEqual(response2.status_code, 200)
        url2 = response2.get_json()['url']
        
        # Confirm they hash to the exact same file path
        self.assertEqual(url1, url2)
        
        # 3. Third upload (different content)
        file_content_2 = b"completely different tilesheet data"
        response3 = self.client.post(
            '/api/upload',
            data={'file': (io.BytesIO(file_content_2), 'other.png')},
            content_type='multipart/form-data'
        )
        self.assertEqual(response3.status_code, 200)
        url3 = response3.get_json()['url']
        self.assertNotEqual(url1, url3)

    def test_03_asset_registry_crud(self):
        # 1. POST (Save asset)
        asset_payload = {
            "id": "test_brick_tile",
            "name": "Test Brick",
            "imagePath": "/static/uploads/dummy.png",
            "sprite": {"x": 0, "y": 0, "width": 64, "height": 64},
            "hitbox": {"xOffset": 0, "yOffset": 0, "width": 64, "height": 64},
            "render": {"scale": 1.0, "offsetX": 0, "offsetY": 0},
            "gridWidth": 1,
            "gridHeight": 1,
            "anchorX": 0,
            "anchorY": 0,
            "properties": {"isSolid": True}
        }
        res_post = self.client.post('/api/assets', json=asset_payload)
        self.assertEqual(res_post.status_code, 200)
        
        # 2. GET (Check it exists)
        res_get = self.client.get('/api/assets')
        self.assertEqual(res_get.status_code, 200)
        assets = res_get.get_json()
        ids = [a['id'] for a in assets]
        self.assertIn("test_brick_tile", ids)
        
        # 3. DELETE (Remove asset)
        res_del = self.client.delete('/api/assets/test_brick_tile')
        self.assertEqual(res_del.status_code, 200)
        
        # 4. Verify removed
        res_get2 = self.client.get('/api/assets')
        assets2 = res_get2.get_json()
        ids2 = [a['id'] for a in assets2]
        self.assertNotIn("test_brick_tile", ids2)

    def test_04_area_crud_and_traversal_protection(self):
        # 1. POST (Save area)
        area_payload = {
            "id": "test_room_01",
            "name": "Testing Dungeon",
            "gridCols": 20,
            "gridRows": 15,
            "assets": [
                {"instanceId": "inst_1", "assetId": "brick", "gridX": 2, "gridY": 2}
            ]
        }
        res_post = self.client.post('/api/areas', json=area_payload)
        self.assertEqual(res_post.status_code, 200)
        
        # 2. GET List index
        res_list = self.client.get('/api/areas')
        self.assertEqual(res_list.status_code, 200)
        areas = res_list.get_json()
        ids = [a['id'] for a in areas]
        self.assertIn("test_room_01", ids)
        
        # 3. GET Single layout
        res_get = self.client.get('/api/areas/test_room_01')
        self.assertEqual(res_get.status_code, 200)
        self.assertEqual(res_get.get_json()['name'], "Testing Dungeon")
        
        # 4. Security Edge Case: Attempt path traversal in ID saving
        traversal_payload = {
            "id": "../test_exploit",
            "name": "Evil Exploit Room",
            "gridCols": 5,
            "gridRows": 5,
            "assets": []
        }
        res_exploit = self.client.post('/api/areas', json=traversal_payload)
        self.assertEqual(res_exploit.status_code, 200)
        
        # Verify it got sanitized to "test_exploit.json" instead of placing outside the directory!
        clean_path = os.path.join(self.base_dir, 'data', 'areas', 'test_exploit.json')
        evil_path = os.path.join(self.base_dir, 'data', 'test_exploit.json')
        self.assertTrue(os.path.exists(clean_path))
        self.assertFalse(os.path.exists(evil_path))
        
        # Clean up sanitized exploit room file
        if os.path.exists(clean_path):
            os.remove(clean_path)
            
        # 5. DELETE (Remove test room)
        res_del = self.client.delete('/api/areas/test_room_01')
        self.assertEqual(res_del.status_code, 200)

if __name__ == '__main__':
    unittest.main()
