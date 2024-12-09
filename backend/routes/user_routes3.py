from flask import Blueprint, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from models.user import User
from db import db
from flasgger import swag_from

user_routes = Blueprint('user_routes', __name__)

usuarios = []

# Anotação para a rota de criação de usuário
@user_routes.route('/api/users', methods=['POST'])
@swag_from('create_user.yml')
def create_user():
    data = request.json
    new_user = User(
        nome=data['nome'],
        cpf=data['cpf'],
        endereco=data.get('endereco'),
        setor=data.get('setor'),
        funcao=data.get('funcao'),
        especialidade=data.get('especialidade'),
        registro_categoria=data.get('registro_categoria')
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'Usuário criado com sucesso'}), 201

# Anotação para a rota de atualização de usuário
@user_routes.route('/api/users/<int:user_id>', methods=['PUT'])
@swag_from('update_user.yml')
def update_user(user_id):
    data = request.json
    user = User.query.get(user_id)
    if user:
        user.nome = data.get('nome', user.nome)
        user.cpf = data.get('cpf', user.cpf)
        user.endereco = data.get('endereco', user.endereco)
        user.setor = data.get('setor', user.setor)
        user.funcao = data.get('funcao', user.funcao)
        user.especialidade = data.get('especialidade', user.especialidade)
        user.registro_categoria = data.get('registro_categoria', user.registro_categoria)
        db.session.commit()
        return jsonify({'message': 'Usuário atualizado com sucesso'}), 200
    else:
        return jsonify({'message': 'Usuário não encontrado'}), 404

# Anotação para a rota de obtenção de usuário
@user_routes.route('/api/users/<int:user_id>', methods=['GET'])
@swag_from('get_user.yml')
def get_user(user_id):
    user = User.query.get(user_id)
    if user:
        return jsonify({
            'nome': user.nome,
            'cpf': user.cpf,
            'endereco': user.endereco,
            'setor': user.setor,
            'funcao': user.funcao,
            'especialidade': user.especialidade,
            'registro_categoria': user.registro_categoria
        }), 200
    else:
        return jsonify({'message': 'Usuário não encontrado'}), 404

# Anotação para a rota de deleção de usuário
@user_routes.route('/api/users/<int:user_id>', methods=['DELETE'])
@swag_from('delete_user.yml')
def delete_user(user_id):
    user = User.query.get(user_id)
    if user:
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'Usuário deletado com sucesso'}), 200
    else:
        return jsonify({'message': 'Usuário não encontrado'}), 404