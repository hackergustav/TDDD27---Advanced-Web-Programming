from src import app, db
from src.models import Article, Invite
from flask import jsonify, request, _request_ctx_stack
from .auth import requires_auth
from src.api import (add_member, create_group, get_users_groups,
                     check_if_user_in_group)
from time import time


@app.route('/articles/group=<group_from_url>')
@requires_auth
def get_group_articles(group_from_url):
    subject = _request_ctx_stack.top.current_user['sub']
    # make sure that the user has access to the data of the requested group
    if check_if_user_in_group(subject, group_from_url):
        # fetching from the database
        article_objects = Article.query.filter_by(group=group_from_url).all()
        articles = [a.serialize() for a in article_objects]
        jsonified_articles = jsonify(articles)
        return jsonified_articles
    else:
        return jsonify({'message': 'access denied'}), 401


@app.route('/articles/<article_id>')
@requires_auth
def get_specific_article(article_id):
    subject = _request_ctx_stack.top.current_user['sub']
    article = Article.query.filter_by(id=article_id).first()
    if article is not None:
        if check_if_user_in_group(subject, article.group):
            return jsonify(article.serialize()), 200
        else:
            return jsonify({'message': 'access denied'}), 401
    else:
        return jsonify({'message': 'something went wrong'}), 404


@app.route('/articles/remove/<article_id>')
@requires_auth
def delete_document(article_id):
    subject = _request_ctx_stack.top.current_user['sub']
    article = Article.query.filter_by(id=article_id).first()
    if article is not None:
        if check_if_user_in_group(subject, article.group):
            db.session.delete(article)
            db.session.commit()
            return jsonify({'message': 'Document deleted'}), 200
        else:
            return jsonify({'message': 'access denied'}), 401
    else:
        return jsonify({'message': 'something went wrong'}), 404


# Route for adding an article to the database.
@app.route('/articles', methods=['POST'])
@requires_auth
def add_article():
    content = request.json['content']
    title = request.json['title']
    group = request.json['group']
    subject = _request_ctx_stack.top.current_user['sub']
    # check that the user is part of the group they claim to be
    if check_if_user_in_group(subject, group):
        article = Article.query.filter_by(title=title, group=group).first()
        # checking if a new article should be created
        if article is None:
            article = Article(content=content, title=title, group=group)
            db.session.add(article)
            msg = {'message': 'your article has been added successfully'}
        # else update the article
        else:
            article.content = content
            msg = {'message': 'your article has been successfully updated'}
    else:
        return jsonify({'message':'you do not have access to edit this document'}), 401

    # persist changes to the database
    db.session.commit()

    return jsonify(msg), 201


@app.route('/get_my_groups')
@requires_auth
def get_my_groups_route():

    subject = _request_ctx_stack.top.current_user['sub']
    groups = get_users_groups(subject)

    return jsonify(groups)


# Creates new group and adds the current user as a member
@app.route('/create_group', methods=['POST'])
@requires_auth
def create_new_group():
    name = request.json['group_name']
    user = _request_ctx_stack.top.current_user['sub']
    desc = request.json['group_desc']
    if not desc:
        desc = name + " is a group."

    create_group(name, desc, user)
    msg = {'message': 'Group {} successfully created'.format(name)}
    return jsonify(msg), 201


@app.route('/generate_invite', methods=['POST'])
@requires_auth
def generate_invite():
    groupID = request.json['group']
    sub = _request_ctx_stack.top.current_user['sub']
    if check_if_user_in_group(sub, groupID):
        _id = Invite.generate_id(int(time()), groupID)
        inv = Invite(_id=_id, group=groupID, exp_at=(int(time())+36000))
        db.session.add(inv)
        db.session.commit()
        return jsonify({'msg': _id})
    return jsonify({'message': 'something went wrong'})


@app.route('/invite/<invite_link>', methods=['POST'])
@requires_auth
def join_group(invite_link):
    invite = Invite.query.filter_by(_id=invite_link).first()
    if time() > invite.exp_at:
        return {'message': 'expired link'}
    add_member(invite.group, _request_ctx_stack.top.current_user['sub'])
    return {'message': 'success'}
