from flask import Blueprint, request, jsonify
from models.user import User
from db import db  
from flasgger import swag_from

user_routes = Blueprint('user_routes', __name__)

usuarios = []

#Criar novo usuário
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
    return jsonify({'message': 'Usuário criado com sucesso!'}), 201

#Lista todos os usuários
@user_routes.route('/api/usuarios', methods=['GET'])
@swag_from('get_all_users.yml') 
def get_all_users():

    usuarios = User.query.all()  
    resultado = []
    
    for usuario in usuarios:
        resultado.append({
            "matricula": usuario.id,
            "nome": usuario.nome,
            "cpf": usuario.cpf,
            "setor": usuario.setor,
            "funcao": usuario.funcao,
            "especialidade": usuario.especialidade,
            "registro_categoria": usuario.registro_categoria
        })

    return jsonify(resultado), 200  


#Atualizar um usuário

@user_routes.route('/api/atualizar_usuario', methods=['PUT'])
@swag_from('update_user.yml')
def atualizar_usuario():
    """
    Update a user
    """
    matricula = request.json['matricula']
    nome = request.json['nome']
    cpf = request.json['cpf']
    setor = request.json['setor']
    funcao = request.json['funcao']
    especialidade = request.json['especialidade']
    registro_categoria = request.json['registro_categoria']

    usuario = User.query.get(matricula)
    if usuario:
        usuario.nome = nome
        usuario.cpf = cpf
        usuario.setor = setor
        usuario.funcao = funcao
        usuario.especialidade = especialidade
        usuario.registro_categoria = registro_categoria
        db.session.commit()
        return jsonify({'message': 'Usuário atualizado com sucesso!'})
    else:
        return jsonify({'message': 'Usuário não encontrado!'}), 404


#Excluir um usuário

@user_routes.route('/api/excluir_usuario', methods=['DELETE'])
@swag_from('delete_user.yml')
def excluir_usuario():

    matricula = request.args.get('matricula')

    if not matricula:
        return jsonify({"message": "Matrícula não informada."}), 400

    usuario = User.query.get(matricula)
    if usuario:
        db.session.delete(usuario)
        db.session.commit()
        return jsonify({'message': 'Usuário excluído com sucesso!'})
    else:
        return jsonify({'message': 'Usuário não encontrado!'}), 404

if __name__ == '__main__':
    app.run(debug=True)
