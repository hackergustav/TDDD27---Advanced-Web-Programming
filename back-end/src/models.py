from src import db


class Article(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    content = db.Column(db.String(1000))
    title = db.Column(db.String(100))
    group = db.Column(db.String(100))

    def serialize(self):
        return {
            'id' : self.id,
            'title' : self.title,
            'content' : self.content,
            'group' : self.group
        }


class ExtToken(db.Model):
    _id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    token = db.Column(db.String(1000))
    exp_at = db.Column(db.Integer)


class Invite(db.Model):
    _id = db.Column(db.Integer, primary_key=True)
    group = db.Column(db.String(100))
    exp_at = db.Column(db.Integer)

    @classmethod
    def generate_id(cls, time, group):
        temp = sum([ord(c) for c in group])
        return time + temp
