from flask import Blueprint, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from models.user import User
from db import db
from flask_swagger import swagger

user_routes = Blueprint('user_routes', __name__)

@user_routes.route('/api/users', methods=['POST'])
@swagger.model('User', {
    'nome': {'type': 'string', 'required': True},
    'cpf': {'type': 'string', 'required': True},
    'endereco': {'type': 'string'},
    'setor': {'type': 'string'},
    'funcao': {'type': 'string'},
    'especialidade': {'type': 'string'},
    'registro_categoria': {'type': 'string'}
})
@swagger.response(201, 'Usuário criado com sucesso!')
@swagger.response(400, 'Erro ao criar usuário')
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

@user_routes.route('/api/consultar_usuario', methods=['GET'])
@swagger.model('ConsultaUsuario', {
    'campo': {'type': 'string', 'required': True},
    'valor': {'type': 'string', 'required': True}
})
@swagger.response(200, 'Usuário encontrado com sucesso!')
@swagger.response(400, 'Erro ao consultar usuário')
def pesquisar_usuario():
    campo = request.args.get('campo')
    valor = request.args.get('valor')

    if campo not in ['nome', 'cpf', 'setor', 'matricula', 'registro_categoria']:
        return jsonify({"message": "Campo de pesquisa inválido."}), 400

    usuarios = User.query.filter(getattr(User, campo).like(f'%{valor}%')).all()

    resultado = []
    for usuario in usuarios:
        resultado.append({
            "Matrícula": usuario.id,
            "Nome": usuario.nome,
            "CPF": usuario.cpf,
            "Setor": usuario.setor,
            "Função": usuario.funcao,
            "Especialidade": usuario.especialidade,
            "Registro Categoria": usuario.registro_categoria
        })

    return jsonify(resultado), 200

@user_routes.route('/api/atualizar_usuario', methods=['PUT'])
@swagger.model('AtualizarUsuario', {
    'id': {'type': 'integer', 'required': True},
    'nome': {'type': 'string'},
    'cpf': {'type': 'string'},
    'endereco': {'type': 'string'},
    'setor': {'type': 'string'},
    'funcao': {'type': 'string'},
    'especialidade': {'type': 'string'},
    'registro_categoria': {'type': 'string'}
})
@swagger.response(200, 'Usuário atualizado com sucesso!')
@swagger.response(400, 'Erro ao atualizar usuário')
def atualizar_usuario():
    # implementação da função de atualização de usuário
    pass

@user_routes.route('/api/excluir_usuario', methods=['DELETE'])
@swagger.model('ExcluirUsuario', {
    'matricula': {'type': 'integer', 'required': True}
})
@swagger.response(200, 'Usuário excluído com sucesso!')
@swagger.response(400, 'Erro ao excluir usuário')
def excluir_usuario():
    matricula = request.args.get('matricula')

    if not matricula:
        return jsonify({"message": "Matrícula não informada."}), 400

    usuario = User.query.get(matricula)
    if usuario:
        db.session.delete(usuario)
        db.session.commit()
        return jsonify({'message': 'Usuário excluído com sucesso!'}), 200
    else:
        return jsonify({'message': 'Usuário não encontrado!'}), 404