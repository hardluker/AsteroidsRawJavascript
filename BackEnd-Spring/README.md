## Setup

It is important to run: mvn clean package -DskipTests

This will ensure that maven can generate the jar without depending on the database

Notice that the global variables are mapped in the application.properties file.

## Overview

This is a REST API for accessing a database of high scores and initials.

The intention of this is to utilize it with a retro-arcade-style game.

This is set up to work with a postgre database.

## HTTP Requests

The following HTTP requests are supported:

### GET http://localhost:8080/api/high-scores

This will return all of the high scores in the database

### GET http://localhost:8080/api/high-scores/{id}

This will return a high score of a specific id in the database

### POST http://localhost:8080/api/high-scores/

This will add a high score in the database

The body needs a JSON like this:

```
{
"initials" "ABC",
"score": 123
}
```

### PUT http://localhost:8080/api/high-scores/{id}

This will update an existing entry in the database.

The body needs a JSON like this:

```
{
"initials" "ABC",
"score": 123
}
```

### DELETE http://localhost:8080/api/high-scores/{id}

This will simply delete an entry in the database
