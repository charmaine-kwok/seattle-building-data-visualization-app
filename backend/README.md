# API Server for the Seattle Building Data Visualization app

## Starting server

```sh
# local development
go run main.go
```

```sh
# docker

# pull from Docker Hub
docker pull mainekwok97/go-api

# use mount
docker run --rm -p 8081:8081 -v $PWD/data:/app/data/ mainekwok97/go-api

# use docker-compose
docker-compose up
```

## Endpoints

```sh
# login and get JWT
http POST http://localhost:8081/login username=admin password=password

# get a list of buildings name
http GET http://localhost:8081/api/buildings/overview?page=$page Authorization:"$JWT"

# get building details
http GET http://localhost:8081/api/buildings/details?name=$name Authorization:"$JWT"

# get get average EUI by Primary Property Type
http GET http://localhost:8081/api/buildings/average Authorization:"$JWT"

# get the list of building informations, accepts parameters primarypropertytype, yearbuilt & councildistrictcode
http GET http://localhost:8081/api/buildings?primarypropertytype=$primarypropertytype&yearbuilt=$yearbuilt&councildistrictcode=$councildistrictcode Authorization:"$JWT"
```
