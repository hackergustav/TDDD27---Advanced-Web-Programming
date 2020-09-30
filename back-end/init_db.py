from src import db

# Before running this script comment out lines in src.__init__.py

db.reflect()
db.drop_all()
db.create_all()


db.session.commit()
