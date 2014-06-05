configs-node-api
================

A simple REST API to access configurations, which offers an API for:

 * Allow a user login and logout
 * Let an authenticated user retrieves JSON data for configurations
 * Let authenticated user sort listing by name, hostname, port, and/or username
 * Let authenticated user create, delete, edit, and query for configurations

### Data Model
```javascript
{
"configurations" : [
     {
        "name" : String,
        "hostname" : String,
        "port" : Number,
        "username" : String
     }
 ]
}
```

### Login

```
curl -H "Content-Type: application/json" -H "Accept: application/json" -X POST -d '{"username": "tester-1", "password": "password"}' "api/users?action=login"
```

''Response'':
```javascript
{
    message: 'Session for user created',
    session_id: 1
}
```

### Logout

### GET /configs

Use the session_id and username as parameters to access the API for CRUD operations on configurations.

```
curl -H "Content-Type: application/json" -H "Accept: application/json" -X GET -d '{"username": "tester-1", "token": "1"}' "api/configs"
```

Sort by hostname:

```
curl -H "Content-Type: application/json" -H "Accept: application/json" -X GET -d '{"username": "tester-1", "token": "1"}' "api/configs?sortby=hostname"
```

### POST /configs

### PUT /configs

### DEL /configs

