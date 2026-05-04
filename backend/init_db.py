from app import app, get_db, init_db
with app.test_client() as client:
    response = client.post('/init')
    print(response.json)
