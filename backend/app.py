# e:\cuidar+\backend\app.py

from flask import Flask
from flask_cors import CORS
from db import db  # Importando o db do novo arquivo
from routes.user_routes import user_routes
from routes.routes_app import app_routes

app = Flask(__name__, template_folder='../frontend/templates', static_folder='../frontend/static')
CORS(app, resources={r"/api/*": {"origins": "http://127.0.0.1:5000"}})  # Permitir CORS para o frontend
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)  # Inicializando o db com a aplicação

# Registrando as rotas
app.register_blueprint(app_routes)
app.register_blueprint(user_routes)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Cria o banco de dados e as tabelas
    app.run(debug=True)