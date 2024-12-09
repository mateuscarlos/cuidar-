from flask import Flask, request, jsonify
from flask_cors import CORS
from db import db
from routes.user_routes import user_routes
from routes.routes_app import app_routes


app = Flask(__name__, template_folder='../frontend/templates', static_folder='../frontend/static')
CORS(app, resources={r"/api/*": {"origins": "http://127.0.0.1:5000"}})

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


db.init_app(app)

app.register_blueprint(app_routes)
app.register_blueprint(user_routes)

@app.route('/api/docs')
def swagger_docs():
    return swagger(app, from_file_keyword='swagger')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)