db = db.getSiblingDB('admin');
db.createUser({user: 'root', pwd: 'K7M3mh9K9Upc53uf2TN562181xWwxT4XWrTfHY49e96RhMDYxBng6NLyqw6C3eHg', roles: [{role: 'root', db: 'admin'}]});
db = db.getSiblingDB('BLWRT');
db.createUser({user: 'blwrt', pwd: 'an63wVTRRA554Q5w7Hsj4xKp53983z8SJ8z3DCSBEEU6mSBx459xC9nfKpgZirqk', roles: [{role: 'readWrite', db: 'BLWRT'}]});
db.notes.createIndex({'title':'text','text':'text'})
