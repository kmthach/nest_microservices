docker run -d -p 1111:27017 --name mongo_auth -e MONGO_INIDB_REPLICASET=rs0 mongo --replSet "rs0"