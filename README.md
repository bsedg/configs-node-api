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
